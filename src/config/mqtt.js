const mqtt = require("mqtt");

class MQTTConnection {
  constructor() {
    this.client = null;
  }

  connect(brokerUrl, options = {}) {
    try {
      this.client = mqtt.connect(brokerUrl, options);

      this.client.on("connect", () => {
        console.log("MQTT Connected");
      });

      this.client.on("error", (error) => {
        console.error("MQTT Connection Error:", error);
      });

      return this.client;
    } catch (error) {
      console.error("Failed to establish MQTT connection:", error);
      return null;
    }
  }

  subscribe(topic, callback) {
    if (this.client) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Error subscribing to ${topic}:`, err);
        } else {
          console.log(`Subscribed to ${topic}`);
          this.client.on("message", (receivedTopic, message) => {
            if (receivedTopic === topic) {
              callback(message.toString());
            }
          });
        }
      });
    }
  }

  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message);
    }
  }
}

module.exports = new MQTTConnection();
