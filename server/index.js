const io = require("socket.io")(3001, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

//room connection
let roomUsers = {};
io.on("connection", (socket) => {
  console.log("user is connected", socket.id);
  socket.on("joinRoom", ({ roomId, name, email }, callback) => {
    socket.join(roomId);
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
    roomUsers[roomId].push({ name, email });
    io.to(roomId).emit("updateUserList", roomUsers[roomId]);
    socket.to(roomId).emit("userConnected", { name, email });

    // Optional: Send acknowledgment back to the joining user
    callback({ success: true, message: `Joined room ${roomId} as ${name}` });

    console.log(`${name} joined room: ${roomId}`);
  });
  socket.on("Recieve Sentence", (RoomId, Sentence) => {
    socket.broadcast.to(RoomId).emit("Sentence", Sentence);
  });
});
console.log("hello");
//Chat Connection
io.on("connection", (socket) => {
  console.log("user is connected", socket.id);
  socket.on("joinRoom", (RoomId) => {
    socket.join(RoomId);
  });
  socket.on("Send Message", (RoomId, msg) => {
    socket.broadcast.to(RoomId).emit("msg", msg);
  });
});
