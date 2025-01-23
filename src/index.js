const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

const { formatInTimeZone, format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

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
});

let data = {
  count: 0,
  createdAt: formatInTimeZone(
    Date.now(),
    timeZone,
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
  ),
};
let clientId = "";
// Socket.IO Connection and Events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("io-crowd-frame", (frame) => {
    // Simpan socket.id dari client yang mengirim
    clientId = socket.id;

    // Kirim ke Analitik
    client.publish("mqtt-crowd-frame", JSON.stringify(frame));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

client.on("message", (topic, message) => {
  if (topic === "mqtt-crowd-result") {
    const result = JSON.parse(message);
    data = {
      ...data,
      detection_data: result.detection_data,
      count: result.num_people,
    };

    // Mengirim hasil hanya ke client yang mengirim permintaan asli.
    // Misalkan clientId disimpan sebelumnya dalam scope yang dapat diakses
    if (clientId) {
      io.to(clientId).emit("io-crowd-result", data);
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
