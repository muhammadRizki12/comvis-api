const prisma = require("../config/db");

// Mengambil seluruh data user kecuali password dan security_key
const getAllUsers = async () => {
  return await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

const getUserById = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
};

const getUserPasswordById = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
    select: { password: true },
  });
};

const getUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

const insertUser = async (userData) => {
  const { name, email, password, role, security_answer } = userData;
  const user = await prisma.users.create({
    data: {
      name: name,
      email: email,
      password: password,
      role: "user",
      security_answer: security_answer,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

// update
const updateUser = async (userData) => {
  const { id, name, email, password, security_answer } = userData;

  const user = await prisma.users.update({
    where: {
      id,
    },

    data: {
      name,
      email,
      password,
      security_answer,
    },
    select: {
      id: true,
      name: true,
      email: true,
      security_answer: true,
    },
  });

  return user;
};

const deleteUserById = async (id) => {
  const user = await prisma.users.delete({
    where: {
      id,
    },
  });

  return user;
};

const checkEmailDuplicate = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email: email.toLowerCase(), // Convert ke lowercase untuk konsistensi
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
};

module.exports = {
  getUserByEmail,
  getUserById,
  insertUser,
  updateUser,
  deleteUserById,
  getAllUsers,
  checkEmailDuplicate,
  getUserPasswordById,
};
