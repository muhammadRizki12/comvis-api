const client = require("../config/mqtt");
const { getIO } = require("../config/socket");

const index = (req, res) => {
  try {
    const io = getIO();

    // menerima data dari client
    io.on("connection", (socket) => {
      socket.on("io-fatigue-frame", (frame) => {
        client.publish("mqtt-fatigue-frame", JSON.stringify(frame));
      });
    });

    // menerima analysis dari flask
    client.subscribe("mqtt-fatigue-result", (message) => {
      const data = JSON.parse(message.toString());
      io.emit("io-fatigue-result", data);
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = { index };
