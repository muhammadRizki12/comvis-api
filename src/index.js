const express = require("express");
const http = require("http");

const cors = require("cors");
const router = require("./routes/index");

const socketConfig = require("./config/socket");

// package to get data in ENV
const dotenv = require("dotenv");

const app = express();
// create server
const server = http.createServer(app);

// create connection
const io = socketConfig(server);

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

app.use("/", router);

server.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});

module.exports = server;
