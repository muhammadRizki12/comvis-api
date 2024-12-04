const dotenv = require("dotenv");
const {
  insertArea,
  checkNameAreaDuplicate,
  getAllAreas,
  updateArea,
} = require("../models/AreaModel");
dotenv.config();

const index = async (req, res) => {
  try {
    const areas = await getAllAreas();

    if (!areas) throw new Error("Invalid Get All area");

    res.status(200).send({
      data: areas,
      message: "success",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const store = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (checkNameAreaDuplicate(name)) {
      throw new Error("Area is exist!");
    }

    // validate
    if (!(name && capacity)) {
      throw new Error("Some fields are missing");
    }

    const data = {
      name,
      capacity,
    };

    // insert database
    const area = await insertArea(data);

    // respon
    res.status(200).send({
      data: area,
      message: "Insert area succesful",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = req.body;

    const area = await updateArea({
      id,
      ...data,
    });

    if (!area) throw new Error("Failed update area!");

    res.status(200).send({
      success: true,
      message: "Area updated successfully",
      data: area,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = { store, index, update };
