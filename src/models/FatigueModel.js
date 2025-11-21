const prisma = require("../config/db");

const getAllFatigues = async () => {
  return await prisma.fatigues.findMany();
};

const getFatigueByUserId = async (user_id) => {
  return await prisma.fatigues.findMany({ where: { user_id } });
};

const insertFatigue = async (data) => {
  return await prisma.fatigues.create({ data });
};

module.exports = { getAllFatigues, getFatigueByUserId, insertFatigue };
