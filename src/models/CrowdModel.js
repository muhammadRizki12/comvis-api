const prisma = require("../config/db");

const insertCrowd = async (data) => {
  return (crowd = await prisma.crowds.create({ data }));
};

const getAllCrowds = async () => {
  const crowds = await prisma.crowds.findMany({
    select: {
      id: true,
      count: true,
      createdAt: true,
      status: true,
      area: { select: { user_id: true } },
      area_id: true,
    },
  });

  return crowds.map((crowd) => ({
    id: crowd.id,
    count: crowd.count,
    createdAt: crowd.createdAt,
    status: crowd.status,
    area_id: crowd.area_id,
    user_id: crowd.area.user_id,
  }));
};

const getCrowdByAreaId = async (area_id) => {
  const crowds = await prisma.crowds.findMany({
    where: { area_id: area_id },
    select: {
      id: true,
      count: true,
      createdAt: true,
      status: true,
      area: { select: { user_id: true } },
      area_id: true,
    },
  });

  return crowds.map((crowd) => ({
    id: crowd.id,
    count: crowd.count,
    createdAt: crowd.createdAt,
    status: crowd.status,
    area_id: crowd.area_id,
    user_id: crowd.area.user_id,
  }));
};

const getCrowdByUserId = async (user_id) => {
  const crowds = await prisma.crowds.findMany({
    select: {
      id: true,
      count: true,
      createdAt: true,
      area_id: true,
      status: true,
      area: { select: { user_id: true } },
    },

    where: { area: { user_id: user_id } },
  });

  return crowds.map((crowd) => ({
    id: crowd.id,
    count: crowd.count,
    createdAt: crowd.createdAt,
    area_id: crowd.area_id,
    user_id: crowd.area.user_id,
    status: crowd.status,
  }));
};

module.exports = {
  insertCrowd,
  getAllCrowds,
  getCrowdByAreaId,
  getCrowdByUserId,
};
