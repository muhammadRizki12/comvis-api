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
const client = mqtt.connect("mqtt://localhost:1883");

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
    io.emit("analysis-result", JSON.parse(message));
  }
});

app.use("/", router);

server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});

module.exports = server;
