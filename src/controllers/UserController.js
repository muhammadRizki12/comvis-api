const dotenv = require("dotenv");
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

module.exports = { editUserProfile, showProfile };
