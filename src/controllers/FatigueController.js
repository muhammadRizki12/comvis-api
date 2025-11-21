const {
  getAllFatigues,
  getFatigueByUserId,
  insertFatigue,
} = require("../models/FatigueModel");

const index = async (req, res) => {
  try {
    const fatigues = await getAllFatigues();
    if (!fatigues) throw new Error("Invalid Get All fatigue");

    return res.status(200).send({ data: fatigues, message: "success" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// select by user_id
const show = async (req, res) => {
  try {
    const { user_id } = req.params;
    const fatigue = await getFatigueByUserId(user_id);
    if (!fatigue) throw new Error("Invalid Get fatigues by user id");

    return res.status(200).send({ data: fatigue, message: "success" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const store = async (req, res) => {
  try {
    const data = req.body;

    const fatigue = await insertFatigue(data);
    if (!fatigue) throw new Error("Failed insert fatigue!");

    return res.status(200).send({
      data: fatigue,
      message: "Insert fatigue succesful",
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = { index, show, store };
