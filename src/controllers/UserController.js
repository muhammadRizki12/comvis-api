const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  findUserById,
  edit,
  getAllUsers,
  destroy,
} = require("../models/UserModel");

dotenv.config();

// Admin
const showAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    if (!users) throw new Error("Invalid Get All users");

    res.status(200).send({
      data: users,
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await destroy(id);

    if (!user) throw new Error("Invalid delete user");
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const editUser = async (req, res) => {
  // // get id params
  // const { id } = req.params;
  // // get body data
  // const { name, email, passwordAdmin, password } = req.body;
  // // cek empty
  // if (!(name && email && passwordAdmin && password)) {
  // }
};

// end admin

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

    res.status(200).send({
      status: "success",
      data: updateUser,
    });
  } catch (error) {
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};

const editPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;

    if (!(oldPassword && newPassword)) {
      throw new Error("Some fields are missing");
    }

    const user = await findUserById(id);

    //  cek password old
    const isOldPasswordValid = await bcrypt.compare(newPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error("Invalid old password");
    }

    // hashing
    const newPasswordHashing = await bcrypt.hash(newPassword, 10);

    // edit password
    const userNewPass = await edit({ id, password: newPasswordHashing });
    if (!userNewPass) {
      throw new Error("Failed edit password");
    }

    // respon
    res.status(200).send({
      data: userNewPass,
      message: "Edit Password Success",
    });
  } catch (error) {
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};

module.exports = {
  editUserProfile,
  showProfile,
  editPassword,
  showAllUsers,
  deleteUser,
};
