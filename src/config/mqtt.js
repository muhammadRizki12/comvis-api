const mqtt = require("mqtt");
const EventEmitter = require("events");
const dotenv = require("dotenv");
dotenv.config();

const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_PORT = process.env.MQTT_PORT;

class MQTTConnection {
  constructor() {
    this.client = null;
    this.messageHandlers = new Map(); // Untuk menyimpan handler pesan per topic

    // Tetapkan pendengar maksimum default yang lebih tinggi
    EventEmitter.defaultMaxListeners = 1000;
  }

  connect(brokerUrl, options = {}) {
    try {
      this.client = mqtt.connect(brokerUrl, options);

      // Tetapkan maksimum listener untuk instance klien ini
      this.client.setMaxListeners(15);

      this.client.on("connect", () => {
        console.log("MQTT Connected");
      });

      this.client.on("error", (error) => {
        console.error("MQTT Connection Error:", error);
        this.cleanup(); // Bersihkan listener saat terjadi error
      });

      return this.client;
    } catch (error) {
      console.error("Failed to establish MQTT connection:", error);
      return null;
    }
  }

  subscribe(topic, callback) {
    if (!this.client) {
      console.error("MQTT client not connected");
      return;
    }

    // Hapus handler lama untuk topic ini jika ada
    if (this.messageHandlers.has(topic)) {
      const oldHandler = this.messageHandlers.get(topic);
      this.client.removeListener("message", oldHandler);
    }

    // Buat handler baru
    const messageHandler = (receivedTopic, message) => {
      if (receivedTopic === topic) {
        callback(message.toString());
      }
    };

    // Simpan handler baru
    this.messageHandlers.set(topic, messageHandler);

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Error subscribing to ${topic}:`, err);
        // Hapus handler jika gagal subscribe
        this.messageHandlers.delete(topic);
      } else {
        console.log(`Subscribed to ${topic}`);
        this.client.on("message", messageHandler);
      }
    });
  }

  unsubscribe(topic) {
    if (!this.client) return;

    this.client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`Error unsubscribing from ${topic}:`, err);
      } else {
        console.log(`Unsubscribed from ${topic}`);

        // Hapus dan bersihkan handler untuk topic ini
        if (this.messageHandlers.has(topic)) {
          const handler = this.messageHandlers.get(topic);
          this.client.removeListener("message", handler);
          this.messageHandlers.delete(topic);
        }
      }
    });
  }

  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message);
    } else {
      console.error("MQTT client not connected");
    }
  }

  cleanup() {
    if (this.client) {
      // Bersihkan semua message handlers
      for (const [topic, handler] of this.messageHandlers) {
        this.client.removeListener("message", handler);
      }
      this.messageHandlers.clear();

      // Hapus event listeners lainnya
      this.client.removeAllListeners("connect");
      this.client.removeAllListeners("error");

      // Akhiri koneksi
      this.client.end();
      this.client = null;
    }
  }

  disconnect() {
    this.cleanup();
  }
}

module.exports = new MQTTConnection();
