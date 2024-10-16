const { store } = require("../models/AuthModel");
// const { registerUser } = require("../services/AuthService");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check
    if (!(email && name && password)) {
      return res.status(400).send("Some fields are missing");
    }

    const newUser = req.body;

    // insert database
    const user = await store(newUser);

    // respon
    res.status(201).send({
      data: user,
      message: "user register success",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const login = async (req, res) => {};

module.exports = { login, register };
