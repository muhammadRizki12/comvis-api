const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

const { formatInTimeZone, format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

const { insertCrowd } = require("./models/CrowdModel");
const { insertFatigue } = require("./models/FatigueModel");

dotenv.config();

const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;
const PORT = process.env.PORT;

const router = require("./routes/index");
const path = require("path");

const app = express();
const server = http.createServer(app);

// socket init
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// MQTT // socket init
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");
client.on("connect", () => {
  client.subscribe("mqtt-crowd-result");
  client.subscribe("mqtt-fatigue-result");
  client.subscribe("mqtt-face-result");
});

let data_crowd = {
  area_id: "",
  capacity: 0,
};

let data_fatigue = {
  user_id: "",
};

let clientId = "";
let incremenCrowd = 0;
let incremenFatigue = 0;
let statusRecognition = false;

// Socket.IO Connection and Events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("io-crowd-frame", (frame, capacity, area_id) => {
    clientId = socket.id;
    data_crowd.area_id = area_id;
    data_crowd.capacity = capacity;

    // console.log({ frame: "base64Format", capacity, area_id });

    // Kirim ke Analitik
    client.publish("mqtt-crowd-frame", JSON.stringify(frame));
  });

  socket.on("io-fatigue-frame", (frame, user_id) => {
    // Simpan socket.id dari client yang mengirim
    clientId = socket.id;
    data_fatigue.user_id = user_id;

    // console.log({ frame: "base64Format", user_id });

    client.publish("mqtt-face-frame", JSON.stringify(frame));
    if (statusRecognition === true) {
      client.publish("mqtt-fatigue-frame", JSON.stringify(frame));
    }
  });

  socket.on("disconnect", () => {
    data_crowd.count = 0;
    console.log("Client disconnected:", socket.id);
  });
});

client.on("message", (topic, message) => {
  if (topic === "mqtt-crowd-result") {
    const result = JSON.parse(message);
    const num_people = result.num_people;

    // Calculate thresholds once outside the loop
    const q1 = Math.round(data_crowd.capacity * 0.33);
    const q2 = Math.round(data_crowd.capacity * 0.66);

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

    data_crowd = {
      ...data_crowd,
      status: statusCrowd,
      createdAt: formatInTimeZone(
        Date.now(),
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      count: num_people,
      detection_data: result.detection_data,
    };

    if (clientId) {
      io.to(clientId).emit("io-crowd-result", data_crowd);

      if (data_crowd.count >= 1) incremenCrowd++;
    }

    // saves database
    const dataSaveDB = {
      count: data_crowd.count,
      createdAt: data_crowd.createdAt,
      status: statusCrowd,
      area_id: data_crowd.area_id,
    };

    if (incremenCrowd === 4) {
      // save database
      insertCrowd(dataSaveDB);
      console.log("save data crowd success");
      // reset i
      incremenCrowd = 0;
    }
  }

  if (topic === "mqtt-face-result") {
    // get result
    const faces = JSON.parse(message);

    // empty check or more than one
    if (faces.length > 1) {
      statusRecognition = false;
    }

    if (faces.length > 1) {
      io.to(clientId).emit("io-fatigue-result", {
        user_id: "",
        detection_data: [],
        status: "NOT ALONE",
        createdAt: formatInTimeZone(
          Date.now(),
          timeZone,
          "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
        ),
      });
    } else {
      // check face
      faces.forEach((face) => {
        if (face !== data_fatigue.user_id) {
          statusRecognition = false;
          // emit if unknow
          io.to(clientId).emit("io-fatigue-result", {
            user_id: "",
            detection_data: [],
            status: "NOT YOU",
            createdAt: formatInTimeZone(
              Date.now(),
              timeZone,
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            ),
          });
        } else if (face === data_fatigue.user_id) {
          statusRecognition = true;
        }
      });
    }
  }

  if (topic === "mqtt-fatigue-result") {
    const result = JSON.parse(message);
    data_fatigue = {
      ...data_fatigue,
      ...result,
      createdAt: formatInTimeZone(
        Date.now(),
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
    };

    // Misalkan clientId disimpan sebelumnya dalam scope yang dapat diakses
    if (clientId) {
      io.to(clientId).emit("io-fatigue-result", data_fatigue);
      console.log(data_fatigue);

      incremenFatigue++;
    }

    // saves database
    const dataSaveDB = {
      status: data_fatigue.status,
      createdAt: data_fatigue.createdAt,
      user_id: data_fatigue.user_id,
    };

    // save
    if (incremenFatigue == 4 && dataSaveDB.status != "UNDETECTED") {
      insertFatigue(dataSaveDB);
      incremenFatigue = 0;
      console.log("save data fatigue success");
    }
  }
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});
