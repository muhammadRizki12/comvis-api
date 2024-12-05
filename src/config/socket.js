const socketIo = require("socket.io");

class SocketConnection {
  constructor() {
    this.io = null;
    this.connectedSockets = new Set();
  }

  initialize(server) {
    this.io = socketIo(server);

    this.io.on("connection", (socket) => {
      console.log("New socket connected");
      this.connectedSockets.add(socket.id);

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        this.connectedSockets.delete(socket.id);
      });
    });

    return this.io;
  }

  emitToAll(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  emitToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }
}

module.exports = new SocketConnection();
