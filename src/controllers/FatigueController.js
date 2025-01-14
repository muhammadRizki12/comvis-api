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
    return res.status(400).send({
      message: error.message,
    });
  }
};

const upload = (req, res) => {
  try {
    if (!req.file) {
      new Error("Please upload a file!");
    }

    const fileName = req.file.filename;
    console.log(fileName);

    return res.status(200).send({
      status: "success",
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = { index, upload };
