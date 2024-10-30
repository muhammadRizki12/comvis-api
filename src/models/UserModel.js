const prisma = require("../config/db");

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

module.exports = { findUserByEmail, findUserById, store, edit };
