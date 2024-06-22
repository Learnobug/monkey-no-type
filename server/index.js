const io = require("socket.io")(3001, {
  cors: { origin: "https://monkey-no-type.vercel.app", methods: ["GET", "POST"] },
});

let roomUsers = {};
io.on("connection", (socket) => {
  console.log("user is connected", socket.id);

  socket.on("joinRoom", ({ roomId, name, email }, callback) => {
    let isOwner = false;
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
      isOwner = true;
      io.to(roomId).emit("RoomInfo", {ownerEmail: email, ownerId: socket.id}); // Send Room Owner Email
    }

    // Check if the user is already in the room
    const isUserInRoom = roomUsers[roomId].some((user) => user.socketId === socket.id);
    if (!isUserInRoom) {
      // Proceed with joining the room
      socket.join(roomId);
      roomUsers[roomId].push({ name, email, socketId: socket.id, isOwner }); // Include socketId in user's info
      io.to(roomId).emit("updateUserList", roomUsers[roomId]);
      console.log(roomUsers[roomId]);
      io.to(roomId).emit("userConnected", { name, email, isOwner });

      // Optional: Send acknowledgment back to the joining user
      callback({ success: true, message: `Joined room ${roomId} as ${name}` });

      console.log(`${name} joined room: ${roomId}`);
    } else {
      // Handle the case where the user is already in the room
      console.log(`User ${name} with socket ID ${socket.id} is already in room: ${roomId}`);
      // Optionally, send a message back to the user
      callback({ success: false, message: `You are already in room ${roomId}` });
    }
  });
  socket.on("Send Message", (RoomId, msg) => {
    socket.broadcast.to(RoomId).emit("chatMessage", msg);
  });
  socket.on("Recieve Sentence", (RoomId, Sentence) => {
    socket.broadcast.to(RoomId).emit("Sentence", Sentence);
  });

  socket.on("startGame", (RoomId, data) => {
    io.to(RoomId).emit("sentence",data);
  });

  socket.on('disconnect',()=>{
    let user = null;
    for (const roomId in roomUsers) {
      const index = roomUsers[roomId].findIndex((user) => user.socketId === socket.id);
      if (index !== -1) {
        user = roomUsers[roomId].splice(index, 1)[0];
        io.to(roomId).emit("updateUserList", roomUsers[roomId]);
        io.to(roomId).emit("userDisconnected", user);
        console.log(`${user.name} left room: ${roomId}`);
        break;
      }
    }
  })
  // Uncomment and adjust the disconnect logic as needed
  // socket.on("disconnect", () => {
  //   // Your disconnect logic here
  // });
});
console.log("hello");
//Chat Connection
// io.on("connection", (socket) => {
//   console.log("user is connected", socket.id);
//   socket.on("joinRoom", (RoomId) => {
//     socket.join(RoomId);
//   });
//   socket.on("Send Message", (RoomId, msg) => {
//     socket.broadcast.to(RoomId).emit("msg", msg);
//   });
// });