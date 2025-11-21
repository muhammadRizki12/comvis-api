const dotenv = require("dotenv");

const {
  insertArea,
  checkNameAreaDuplicate,
  getAllAreas,
  updateArea,
  deleteAreaById,
  getAreaById,
  getAreaByUserId,
} = require("../models/AreaModel");

dotenv.config();

const index = async (req, res) => {
  try {
    const areas = await getAllAreas();

    if (!areas) throw new Error("Invalid Get All area");

    return res.status(200).send({
      data: areas,
      message: "success",
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const store = async (req, res) => {
  try {
    const { name, capacity, user_id } = req.body;

    if (!(name && capacity && user_id)) {
      throw new Error("Some fields are missing");
    }

    const data = { name, capacity, user_id };

    // insert database
    const area = await insertArea(data);
    if (!area) new Error("Insert failed!");

    // respon
    return res
      .status(200)
      .send({ data: area, message: "Insert area succesful" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    // get id from params
    const id = req.params.id;

    // get data from body request
    const data = req.body;

    // update area
    const area = await updateArea({ id, ...data });

    // area failed
    if (!area) throw new Error("Failed update area!");

    return res.status(200).send({
      success: true,
      message: "Area updated successfully",
      data: area,
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await deleteAreaById(id);
    if (!area) throw new Error("Invalid delete area");

    return res.status(200).send({ message: `Success delete area id: ${id}` });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await getAreaById(id);

    if (!area) throw new Error(`Invalid Get area id: ${id}`);

    return res.status(200).send({ message: "success", data: area });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const areaByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const area = await getAreaByUserId(user_id);

    if (!area) throw new Error(`Invalid Get area id: ${id}`);

    return res.status(200).send({ message: "success", data: area });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = { store, index, update, destroy, show, areaByUserId };
