const prisma = require("../config/db");

const insertArea = async (areaData) => {
  return await prisma.areas.create({ data: areaData });
};

const getAllAreas = async () => {
  return await prisma.areas.findMany();
};

const updateArea = async (areaData) => {
  const { id, name, capacity } = areaData;

  return await prisma.areas.update({
    where: { id },
    data: { name, capacity },
  });
};

const deleteAreaById = async (id) => {
  return await prisma.areas.delete({ where: { id } });
};

const getAreaById = async (id) => {
  return await prisma.areas.findUnique({ where: { id } });
};

const getAreaByUserId = async (user_id) => {
  return await prisma.areas.findMany({ where: { user_id } });
};

const checkNameAreaDuplicate = async (name) => {
  const area = await prisma.areas.findUnique({
    where: { name },
  });

  return area;
};

module.exports = {
  insertArea,
  checkNameAreaDuplicate,
  getAllAreas,
  updateArea,
  deleteAreaById,
  getAreaById,
  getAreaByUserId,
};
