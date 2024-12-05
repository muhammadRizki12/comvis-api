const express = require("express");
const http = require("http");

// cors
const cors = require("cors");
const router = require("./routes/index");

// package to get data in ENV
const dotenv = require("dotenv");

const app = express();

// create server
const server = http.createServer(app);

dotenv.config();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middleware use json response
app.use(express.json());

// Socket IO Configuration
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// MQTT Configuration
const mqtt = require("mqtt");

const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;

const client = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`);

// connection socket io
io.on("connection", (socket) => {
  console.log("a user connected");

  // crowd detection
  socket.on("io-crowd-frame", (frame) => {
    client.publish("mqtt-crowd-frame", JSON.stringify(frame));
  });

  // fatigue detection
  socket.on("io-fatigue-frame", (frame) => {
    let data = {
      message: "express fatigue",
    };
    client.publish("mqtt-fatigue-frame", JSON.stringify(data));
  });

  // disconnect alert
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// subcribe to topic topic analysis result
client.on("connect", () => {
  client.subscribe("mqtt-crowd-result");
  client.subscribe("mqtt-fatigue-result");
});

client.on("message", (topic, message) => {
  if (topic === "mqtt-crowd-result") {
    // Broadcast analysis results to all connected clients
    let data = JSON.parse(message);
    let num_people = data.data.num_people;

    const max_capacity = 3;
    const q1 = Math.round(max_capacity * 0.33);
    const q2 = Math.round(max_capacity * 0.66);

    // Tentukan statusCrowd berdasarkan jumlah orang
    const statusCrowd =
      num_people === 0
        ? "Kosong"
        : num_people <= q1
        ? "Sepi"
        : num_people <= q2
        ? "Sedang"
        : num_people > q2
        ? "Padat"
        : "Over";

    io.emit("io-crowd-result", { ...data, statusCrowd });
  }
});

app.use("/", router);

server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});

module.exports = server;
