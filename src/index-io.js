const express = require("express");
const http = require("http");
const { initSocket, getIO } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.IO
initSocket(server);

// Contoh penggunaan Socket.IO di route lain
app.get("/send-message", (req, res) => {
  const io = getIO();
  io.emit("message", { text: "Hello from server!" });
  res.send("Message sent");
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
