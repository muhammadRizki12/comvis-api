const { Server } = require("socket.io");
const server = require("../index");

const MQTTClient = require("./mqtt");

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = io;

// const socketConfig = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Connect userid: ", socket.id);

//     // event get frame frontend
//     io.on("video-frames", (frame) => {
//       client.publish("video-frames", frame);
//     });

//     io.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };

// module.exports = socketConfig;
