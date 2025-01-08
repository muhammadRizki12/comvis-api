const { getAllcrowds, getCrowdByAreaId } = require("../models/CrowdModel");

const index = async (req, res) => {
  try {
    const crowds = await getAllcrowds();

    if (!crowds) throw new Error("Invalid Get All area");

    res.status(200).send({
      data: crowds,
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

// select by area_id
const show = async (req, res) => {
  try {
    const { area_id } = req.params;
    const crowd = await getCrowdByAreaId(area_id);

    if (!crowd) throw new Error("Invalid Get Crowd by ID");

    res.status(200).send({
      data: crowd,
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = { index, show };
