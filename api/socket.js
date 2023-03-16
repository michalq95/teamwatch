const socketio = require("socket.io");
const io = socketio({ cors: { origin: "*" } });

io.use(async (socket, next) => {
  socket.username = socket.handshake.auth.username;
  socket.room = socket.handshake.auth.room;
  next();
});

io.on("connection", async (socket) => {
  console.log(`A user connected to room ${socket.room}`);
  socket.join(socket.room);
  socket.to(socket.room).emit("newuserconnected", {
    username: socket.username,
  });
});

module.exports = io;
