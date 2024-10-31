const bcrypt = require("bcrypt");
const { store, findUserByEmail, edit } = require("../models/UserModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const register = async (req, res) => {
  try {
    const { email, name, password, security_answer } = req.body;

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
    const user = await store(newUser);

    // respon
    res.status(200).send({
      data: user,
      message: "Register Success",
    });
  } catch (error) {
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
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
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, security_answer } = req.body;

    if (!(email && password && security_answer)) {
      throw new Error("Some fields are missing");
    }

    // get user by email
    const user = await findUserByEmail(email);
    const id = user.id;

    // Validasi security answer
    if (!(security_answer == user.security_answer)) {
      throw new Error("Invalid security answer");
    }

    // change pass new
    const passwordNewHashing = await bcrypt.hash(password, 10);
    const userNewPass = await edit({ id, password: passwordNewHashing });

    if (!userNewPass) {
      throw new Error("Failed register");
    }

    // respon
    res.status(200).send({
      data: userNewPass,
      message: "Reset Password Success",
    });
  } catch (error) {
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};
module.exports = { login, register, resetPassword };
