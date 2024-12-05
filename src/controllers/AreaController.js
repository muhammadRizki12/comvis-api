const dotenv = require("dotenv");
const {
  insertArea,
  checkNameAreaDuplicate,
  getAllAreas,
  updateArea,
  deleteAreaById,
  getAreaById,
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

    if (await checkNameAreaDuplicate(name)) {
      throw new Error("Area is exist!");
    }

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

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await deleteAreaById(parseInt(id));
    if (!area) throw new Error("Invalid delete area");

    res.status(200).send({
      message: `Success delete area id: ${id}`,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await getAreaById(parseInt(id));

    if (!area) throw new Error(`Invalid Get area id: ${id}`);

    res.status(200).send({
      message: "success",
      data: area,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = { store, index, update, destroy, show };
