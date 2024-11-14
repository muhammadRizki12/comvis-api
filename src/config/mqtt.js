const mqtt = require("mqtt");
const clientMQTT = mqtt.connect("mqtt://localhost:1883");

// subscribe to analysis
clientMQTT.on("connect", () => {
  clientMQTT.subscribe("video/analysis");
});

module.exports = clientMQTT;
