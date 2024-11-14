const { Server } = require("socket.io");

const socketConfig = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connect userid: ", socket.id);

    // event get frame frontend
    io.on("video-frame", (frame) => {
      // console.log(frame);
    });

    io.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketConfig;
