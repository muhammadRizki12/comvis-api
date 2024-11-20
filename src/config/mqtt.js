const mqtt = require("mqtt");

const dotenv = require("dotenv");
dotenv.config();

const MQTT_BROKER = process.env.MQTT_BROKER;

const MQTTClient = mqtt.connect(MQTT_BROKER, {
  clientId: "express_mqtt_client_" + Math.random().toString(16).substr(2, 8),
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

MQTTClient.on("error", (error) => {
  console.error("MQTT Client Error:", error);
});

MQTTClient.on("reconnect", () => {
  console.log("Reconnecting to MQTT broker...");
});

MQTTClient.on("connect", () => {
  MQTTClient.subscribe("video-analysis");
});

MQTTClient.on("message", (topic, message) => {
  if (topic === "video-analysis") {
    // io.emit("analysis-result", JSON.parse(message));
    console.log(JSON.parse(message));
  } else {
    console.log("GAGAL");
  }
});

module.exports = MQTTClient;
