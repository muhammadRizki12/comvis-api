const dotenv = require("dotenv");
const { formatInTimeZone, format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

const { getIO } = require("../config/socket");

const {
  insertArea,
  checkNameAreaDuplicate,
  getAllAreas,
  updateArea,
  deleteAreaById,
  getAreaById,
} = require("../models/AreaModel");

const client = require("../config/mqtt");
const { insertCrowd } = require("../models/CrowdModel");

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
    return res.status(200).send({
      data: area,
      message: "Insert area succesful",
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;

    const data = req.body;

    const area = await updateArea({
      id,
      ...data,
    });

    if (!area) throw new Error("Failed update area!");

    return res.status(200).send({
      success: true,
      message: "Area updated successfully",
      data: area,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await deleteAreaById(id);
    if (!area) throw new Error("Invalid delete area");

    return res.status(200).send({
      message: `Success delete area id: ${id}`,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const show = async (req, res) => {
  try {
    const io = getIO();
    const { id } = req.params;
    const area = await getAreaById(id);

    if (!area) {
      throw new Error(`Invalid Get area id: ${id}`);
    }

    // Initialize data outside the MQTT callback to avoid unnecessary reassignments
    let data = {
      status: "Kosong", // Initial status
      count: 0, // Initial count
      area_id: area.id,
      createdAt: formatInTimeZone(
        Date.now(),
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
    };

    io.on("connection", (socket) => {
      socket.on("io-crowd-frame", (frame) => {
        client.publish("mqtt-crowd-frame", JSON.stringify(frame));
      });

      // Emit initial data to the connected client
      socket.emit("io-crowd-result", {
        detection_data: [], // You might want to send initial detection data as well
        ...data,
      });

      socket.on("disconnect", () => {
        data.count = 0; // Reset count when the client disconnects
      });
    });

    client.subscribe("mqtt-crowd-result", (message) => {
      const result = JSON.parse(message);
      const num_people = result.num_people;
      const max_capacity = area.capacity;

      // Calculate thresholds once outside the loop
      const q1 = Math.round(max_capacity * 0.33);
      const q2 = Math.round(max_capacity * 0.66);

      // Simplified status determination using a lookup table
      const statusMap = {
        0: "Kosong",
        1: "Sepi",
        2: "Sedang",
        3: "Padat",
      };
      const statusKey =
        num_people === 0 ? 0 : num_people <= q1 ? 1 : num_people <= q2 ? 2 : 3;
      const statusCrowd = statusMap[statusKey] || "Over";

      data = {
        ...data, // Reuse existing data
        status: statusCrowd,
        count: num_people,
        createdAt: formatInTimeZone(
          Date.now(),
          timeZone,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
      };

      io.emit("io-crowd-result", {
        detection_data: result.detection_data,
        ...data,
      });
    });

    // Interval to save data
    setInterval(async () => {
      if (data.count >= 1) {
        try {
          await insertCrowd(data);
        } catch (error) {
          console.error("Failed to save data:", error);
        }
      }
    }, 5000);

    return res.status(200).send({
      message: "success",
      data: area,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

// const show = async (req, res) => {
//   try {
//     const io = getIO();

//     const { id } = req.params;

//     const area = await getAreaById(id);

//     let data = {};

//     if (!area) throw new Error(`Invalid Get area id: ${id}`);

//     io.on("connection", (socket) => {
//       socket.on("io-crowd-frame", (frame) => {
//         // send mqtt
//         client.publish("mqtt-crowd-frame", JSON.stringify(frame));
//       });
//     });

//     // receive analysis from flask
//     client.subscribe("mqtt-crowd-result", (message) => {
//       let result = JSON.parse(message);
//       // console.log(data);

//       let num_people = result.num_people;

//       const max_capacity = area.capacity;
//       const q1 = Math.round(max_capacity * 0.33);
//       const q2 = Math.round(max_capacity * 0.66);

//       // Tentukan statusCrowd berdasarkan jumlah orang
//       const statusCrowd =
//         num_people === 0
//           ? "Kosong"
//           : num_people <= q1
//           ? "Sepi"
//           : num_people <= q2
//           ? "Sedang"
//           : num_people > q2
//           ? "Padat"
//           : "Over";

//       // const datetime = format(Date.now(), "yyyy-MM-dd HH:mm:ss.SSS");
//       const datetime = formatInTimeZone(
//         Date.now(),
//         timeZone,
//         "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
//       );

//       data = {
//         status: statusCrowd,
//         count: num_people,
//         area_id: area.id,
//         createdAt: datetime,
//       };

//       io.emit("io-crowd-result", {
//         detection_data: result.detection_data,
//         ...data,
//       });
//     });

//     let i = 0;
//     // interval 5 second saves data crowd
//     setInterval(async () => {
//       if (data.count >= 1) {
//         try {
//           await insertCrowd(data);
//           console.log(i++);
//         } catch (error) {
//           console.error("Failed to save data:", error);
//         }
//       }
//     }, 5000);
//     // show ejs
//     // res.render("index");

//     return res.status(200).send({
//       message: "success",
//       data: area,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       message: error.message,
//     });
//   }
// };

module.exports = { store, index, update, destroy, show };
