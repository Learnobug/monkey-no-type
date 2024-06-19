const io=require("socket.io")(3001,{cors:{origin:"http://localhost:3000",methods:[
    "GET","POST"]
},})

//room connection
io.on("connection",(socket)=>{
    console.log("user is connected",socket.id)
    socket.on('joinRoom',(RoomId)=>{
        socket.join(RoomId)
    });
    socket.on("Recieve Sentence",(RoomId,Sentence)=>{
        socket.broadcast.to(RoomId).emit("Sentence", Sentence);  
    })
})
console.log("hello")
//Chat Connection
io.on("connection",(socket)=>{
    console.log("user is connected",socket.id)
    socket.on('joinRoom',(RoomId)=>{
        socket.join(RoomId)
    });
    socket.on("Send Message",(RoomId,msg)=>{
        socket.broadcast.to(RoomId).emit("msg", msg);  
    })
})