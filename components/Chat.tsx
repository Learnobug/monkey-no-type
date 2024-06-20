import { getSocket } from "@/socket";
import React, { useState } from "react";

export default function Chat({roomId}: {roomId: string}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const socket = getSocket();
  const sendMessage = () => {
    if (message.trim()) {
      // Send message via socket
      socket.emit("Send Message", roomId,message);
      setChat([...chat, message]);
      setMessage("");
    }
  };

  socket.on("chatMessage", (message: string) => {
    console.log(message);
    setChat([...chat, message]);
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-3/4 flex flex-col justify-between p-4 px-40">
      <div>
        <div>
          {chat.map((user: any, index) => (
            <div className="text-white" key={index}>
                {user}
            </div>
          ))}
        </div>
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="text-black"
        type="text"
      />
    </div>
  );
}
