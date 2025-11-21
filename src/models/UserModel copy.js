const prisma = require("../config/db");

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

const getUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

const checkEmailDuplicate = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
};

module.exports = {
  insertUser,
  checkEmailDuplicate,
  getUserByEmail,
};
