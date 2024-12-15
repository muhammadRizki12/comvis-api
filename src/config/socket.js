// const cors = require("cors");

let io;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Tambahkan handler event di sini
    socket.on("message", (data) => {
      console.log("Message received:", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO is not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
