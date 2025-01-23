const socketIO = require("socket.io");

class SocketManager {
  constructor() {
    this.io = null;
  }

  init(server) {
    this.io = socketIO(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    this.io.on("connection", (socket) => {
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

  getIO() {
    if (!this.io) {
      throw new Error("Socket.IO is not initialized!");
    }
    return this.io;
  }

  // Method to get all connected clients
  clients(callback) {
    this.io.clients((error, clients) => {
      if (error) {
        console.error("Error retrieving clients:", error);
        return;
      }
      callback(clients); // Execute the callback with the list of clients
    });
  }
}

// Ekspor instance singleton dari SocketManager
const socketManager = new SocketManager();
module.exports = socketManager;
