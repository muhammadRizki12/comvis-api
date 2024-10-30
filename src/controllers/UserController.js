const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { findUserById, edit } = require("../models/UserModel");

dotenv.config();

const showProfile = async (req, res) => {
  // ambil data dari JWT
  const user = req.user;

  // get user data dari database
  res.status(200).send({
    data: user,
    message: "success",
  });
};

const editUserProfile = async (req, res) => {
  try {
    const { email, name } = req.body;
    const { id } = req.user;
    // update data
    const updateUser = await edit({ id, email, name });

    res.status(200).json({
      status: "success",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const editPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;

    if (!(oldPassword && newPassword)) {
      return res.status(400).send("Some fields are missing");
    }

    const user = await findUserById(id);

    //  cek password old
    const isOldPasswordValid = await bcrypt.compare(newPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // hashing
    const newPasswordHashing = await bcrypt.hash(newPassword, 10);

    // edit password
    const userNewPass = await edit({ id, password: newPasswordHashing });
    if (!userNewPass) {
      return res.status(401).json({ message: "Failed edit password" });
    }

    // respon
    res.status(201).send({
      data: userNewPass,
      message: "Edit Password Success",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { editUserProfile, showProfile, editPassword };
