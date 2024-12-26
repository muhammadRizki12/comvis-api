const prisma = require("../config/db");

const insertCrowd = async (data) => {
  const crowd = await prisma.crowds.create({
    data,
  });

  return crowd;
};

const getAllcrowds = async () => {
  return await prisma.crowds.findMany();
};

module.exports = {
  insertCrowd,
  getAllcrowds,
};
