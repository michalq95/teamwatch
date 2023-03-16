const socketio = require("socket.io");
const io = socketio({ cors: { origin: "*" } });
const { getRoomByName, createOrJoinRoom, addVideo } = require("./roomStore");

io.use(async (socket, next) => {
  socket.username = socket.handshake.auth.username;
  socket.room = socket.handshake.auth.room;
  next();
});

io.on("connection", async (socket) => {
  console.log(`A user connected to room ${socket.room}`);
  socket.join(socket.room);
  socket.emit("room", createOrJoinRoom(socket.room));
  socket.to(socket.room).emit("newuserconnected", {
    username: socket.username,
  });

  socket.on("track:play", (data) => {
    socket.to(data.to).emit("track:play");
  });

  socket.on("track:pause", (data) => {
    socket.to(data.to).emit("track:pause");
  });

  socket.on("track:switch", ({ playlistData, to }) => {
    let room = getRoomByName(to);
    room.currentIndex = playlistData.currentIndex;

    socket.to(to).emit("track:switch", room);
  });
});

module.exports = io;
