import io from "socket.io-client";
const socket = io(process.env.VUE_APP_BACKEND_URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  // console.log(event, args);
});

export default socket;
