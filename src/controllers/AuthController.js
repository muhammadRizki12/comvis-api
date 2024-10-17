const bcrypt = require("bcrypt");

const { store, findUserByEmail } = require("../models/UserModel");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check
    if (!(email && name && password)) {
      return res.status(400).send("Some fields are missing");
    }

    const passwordHashing = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: passwordHashing,
    };

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      data: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login" });
  }
};

module.exports = { login, register };
