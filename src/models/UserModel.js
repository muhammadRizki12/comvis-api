const prisma = require("../config/db");

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
    },
  });

  return user;
};

module.exports = { findUserByEmail, store };
