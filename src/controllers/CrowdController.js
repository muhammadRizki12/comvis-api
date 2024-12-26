const { getAllcrowds } = require("../models/CrowdModel");

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

module.exports = { index };
