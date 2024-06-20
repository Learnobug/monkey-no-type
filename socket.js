// socket.js
import io from "socket.io-client";

let socket;

export const getSocket = () => {
  // Only create the socket if it doesn't already exist
  if (!socket) {
    socket = io("http://localhost:3001");
  }
  return socket;
};