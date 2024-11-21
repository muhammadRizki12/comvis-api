const express = require("express");
const http = require("http");

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
const io = new Server(server, { cors: { origin: "*" } });

// MQTT Configuration
const mqtt = require("mqtt");

const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;

// const client = mqtt.connect("mqtt://localhost:1883");
// Membuat koneksi MQTT
const client = mqtt.connect(`mqtts://${MQTT_BROKER}:${MQTT_PORT}`, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
});

// connection socket io
io.on("connection", (socket) => {
  console.log("a user connected");

  // receive frame from frontend
  socket.on("video-frame", (frame) => {
    // publish to topic video-frames
    // send to analytic
    client.publish("video-frames", frame);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// subcribe to topic video-analysis
client.on("connect", () => {
  client.subscribe("video-analysis");
});

client.on("message", (topic, message) => {
  if (topic === "video-analysis") {
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
        : num_people > max_capacity
        ? "Over"
        : "Padat";

    io.emit("analysis-result", { ...data, statusCrowd });
  }
});

app.use("/", router);

server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});

module.exports = server;
