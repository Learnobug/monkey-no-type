// socket.js
import io from "socket.io-client";

let socket;

export const getSocket = () => {
  // Only create the socket if it doesn't already exist
  if (!socket) {
    socket = io("https://monkey-no-type-1.onrender.com");
  }
  return socket;
};