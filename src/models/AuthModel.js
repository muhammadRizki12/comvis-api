const prisma = require("../config/db");

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

module.exports = { store };
