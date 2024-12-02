const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUserById,
  getUserPasswordById,
} = require("../models/UserModel");

dotenv.config();

// select all
const index = async (req, res) => {
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

// select user by id
const show = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) throw new Error(`Invalid Get users id: ${id}`);

    res.status(200).send({
      message: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deleteUserById(id);

    if (!user) throw new Error("Invalid delete user");

    res.status(200).send({
      message: `Success delete user id: ${id}`,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body;

    const updatedUser = await updateUser({
      id,
      ...data,
    });

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const data = req.body;

    const newPasswordHashing = await bcrypt.hash(data.password, 10);

    const updatedUser = await updateUser({
      id,
      password: newPasswordHashing,
    });

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

// User JWT information
const showProfile = async (req, res) => {
  try {
    // ambil data dari JWT
    const user = req.user;

    if (!user) new Error("Error show profile");

    res.status(200).send({
      data: user,
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, name } = req.body;
    const { id } = req.user;
    // update data
    const user = await updateUser({ id, email, name });

    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(error.code || 400).send({
      message: error.message,
    });
  }
};

const updateProfilePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;

    if (!(oldPassword && newPassword)) {
      throw new Error("Some fields are missing");
    }

    const user = await getUserPasswordById(id);

    //  cek password old
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error("Invalid old password");
    }

    // hashing
    const newPasswordHashing = await bcrypt.hash(newPassword, 10);

    // edit password
    const userNewPass = await updateUser({ id, password: newPasswordHashing });
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
  index,
  show,
  update,
  updateProfile,
  showProfile,
  updateUserPassword,
  updateProfilePassword,
  destroy,
};
