const prisma = require("../config/db");

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

const findUserById = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

const store = async (userData) => {
  const user = await prisma.users.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "user",
      security_answer: userData.security_answer,
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

// edit
const edit = async (userData) => {
  const { id, name, email, password } = userData;

  const user = await prisma.users.update({
    where: {
      id,
    },

    data: {
      name,
      email,
      password,
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

const destroy = async (id) => {
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
  findUserByEmail,
  findUserById,
  store,
  edit,
  destroy,
  getAllUsers,
  checkEmailDuplicate,
};
