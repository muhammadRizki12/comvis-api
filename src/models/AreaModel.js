const prisma = require("../config/db");

const insertArea = async (areaData) => {
  const { name, capacity } = areaData;
  const area = await prisma.areas.create({
    data: {
      name,
      capacity,
    },
  });

  return area;
};

const getAllAreas = async () => {
  return await prisma.areas.findMany();
};

const updateArea = async (areaData) => {
  const { id, name, capacity } = areaData;

  const area = await prisma.areas.update({
    where: {
      id,
    },

    data: {
      name,
      capacity,
    },
  });

  return area;
};

const deleteAreaById = async (id) => {
  const area = await prisma.areas.delete({
    where: { id },
  });

  return area;
};

const getAreaById = async (id) => {
  const area = await prisma.areas.findUnique({
    where: { id },
  });

  return area;
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
};
