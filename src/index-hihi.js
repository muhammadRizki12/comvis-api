const express = require("express");
const http = require("http");

// cors
const cors = require("cors");
const router = require("./routes/index");
const mqttConnection = require("./config/mqtt");
const socketConnection = require("./config/socket");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// create server
const server = http.createServer(app);

const PORT = process.env.PORT;
const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middleware use json response
app.use(express.json());

// inisialisasi MQTT
// const mqttClient = mqttConnection.connect(`mqtt::/${MQTT_BROKER}:${MQTT_PORT}`);
mqttConnection.connect();

// inisialisasi Socket
const io = socketConnection.initialize(server);

// connect mqtt
app.use("/", router);

server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});

module.exports = { io };
