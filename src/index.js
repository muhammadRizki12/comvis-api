const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { initSocket } = require("./config/socket");
const mqtt = require("./config/mqtt");
// const bodyParser = require("body-parser");

// access .env
dotenv.config();

const router = require("./routes/index");
const path = require("path");

// inisialisasi server
const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.IO
initSocket(server);

const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;

// inisialisasi mqtt
mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`);

// get port
const PORT = process.env.PORT;

// cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middleware use json response
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define the directory where your HTML files (views) are located
app.set("views", path.join(__dirname, "views"));

// app.use(express.json({ limit: "100mb" }));

app.use((req, res, next) => {
  // Akses data dari res.locals
  const userId = res.locals.userId;
  // ... gunakan data userId dan username di sini ...
  console.log("User ID:", userId);
  next();
});

// routes
app.use("/", router);

// Optionally, you can define a static files directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// server run
server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});

module.exports = server;
