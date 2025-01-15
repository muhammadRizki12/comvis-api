const bcrypt = require("bcrypt");
const {
  insertUser,
  getUserByEmail,
  updateUser,
  checkEmailDuplicate,
} = require("../models/UserModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// const upload = require("../config/multer");
const path = require("path");
const multer = require("multer");
const fs = require("fs").promises;

dotenv.config();

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // PR
    cb(null, "uploads/photos"); // Pastikan folder ini sudah dibuat
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `user-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 50, // maksimum 50 file
  },
});

// Middleware untuk handle multiple file upload
const uploadPhotos = upload.array("photos", 50); // maksimum 50 foto

const register = async (req, res) => {
  // Gunakan promise untuk handle multer upload
  const multerPromise = () => {
    return new Promise((resolve, reject) => {
      uploadPhotos(req, res, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  try {
    await multerPromise();
    const { email, name, password, security_answer } = req.body;
    const photos = req.files; // Array dari uploaded file

    if ((await checkEmailDuplicate(email)) !== null) {
      throw new Error("Email is exist!");
    }

    // Hapus foto yang sudah diupload jika validasi gagal
    if (photos && photos.length > 0) {
      await Promise.all(
        photos.map((photo) => fs.unlink(photo.path).catch(() => {}))
      );
    }
    // Check
    if (!(email && name && password && security_answer)) {
      throw new Error("Some fields are missing");
    }

    const passwordHashing = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: passwordHashing,
      security_answer,
    };

    // insert database
    const user = await insertUser(newUser);

    // Prepare photo paths
    const photoPaths = photos ? photos.map((photo) => photo.path) : [];

    // respon
    return res.status(200).send({
      data: user,
      message: "Register Success",
      photos: photoPaths,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("Email not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // payload
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // secret key
    const secret = process.env.JWT_SECRET;

    // expire
    const expireIn = 60 * 60 * 1;

    // Create token JWT
    const token = jwt.sign(payload, secret, { expiresIn: expireIn });

    return res.status(200).send({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, security_answer } = req.body;

    if (!(email && newPassword && security_answer)) {
      throw new Error("Some fields are missing");
    }

    // get user by email
    const user = await getUserByEmail(email);
    const id = user.id;

    // Validasi security answer
    if (!(security_answer == user.security_answer)) {
      throw new Error("Invalid security answer");
    }

    // change pass new
    const passwordNewHashing = await bcrypt.hash(newPassword, 10);
    const userNewPass = await updateUser({ id, password: passwordNewHashing });

    if (!userNewPass) {
      throw new Error("Failed reset password");
    }

    // respon
    res.status(200).send({
      data: userNewPass,
      message: "Reset Password Success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};
module.exports = { login, register, resetPassword };
