import io from "socket.io-client";
const socket = io(process.env.VUE_APP_BACKEND_URL, {
  transports: ["websocket"],
  secure: true,
  autoConnect: false,
});
socket.onAny((event, ...args) => {});

export default socket;
