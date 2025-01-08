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

const getCrowdByAreaId = async (area_id) => {
  return await prisma.crowds.findMany({
    where: {
      area_id: area_id,
    },
  });
};

module.exports = {
  insertCrowd,
  getAllcrowds,
  getCrowdByAreaId,
};
