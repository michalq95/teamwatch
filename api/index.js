const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("A user connected");
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
