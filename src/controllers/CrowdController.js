const {
  getAllCrowds,
  getCrowdByAreaId,
  insertCrowd,
  getCrowdByUserId,
} = require("../models/CrowdModel");

const index = async (req, res) => {
  try {
    const crowds = await getAllCrowds();
    if (!crowds) throw new Error("Invalid Get All crowd");

    return res.status(200).send({ data: crowds, message: "success" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// select by area_id
const show = async (req, res) => {
  try {
    const { area_id } = req.params;
    const crowd = await getCrowdByAreaId(area_id);
    if (!crowd) throw new Error("Invalid Get Crowd by ID");

    return res.status(200).send({ data: crowd, message: "success" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const store = async (req, res) => {
  try {
    const data = req.body;
    const crowd = await insertCrowd(data);
    if (!crowd) throw new Error("Failed insert crowd!");

    return res.status(200).send({
      data: crowd,
      message: "Insert crowd succesful",
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const crowdByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const crowd = await getCrowdByUserId(user_id);
    if (!crowd) throw new Error("Invalid Get Crowd by ID");

    return res.status(200).send({ data: crowd, message: "success" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = { index, show, store, crowdByUserId };
