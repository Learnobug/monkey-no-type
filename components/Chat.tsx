import { getSocket } from "@/socket";
import React, { useState, useEffect } from "react";

export default function Chat({ roomId }: { roomId: string }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    const socket = getSocket();

    const handleMessage = (msg: string) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.on("chatMessage", handleMessage);

    return () => {
      socket.off("chatMessage", handleMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const socket = getSocket();
    socket.emit("Send Message", roomId, message);
    setChat((prev) => [...prev, message]);
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-3/4 flex flex-col justify-between p-4 px-40">
      <div>
        {chat.map((msg, index) => (
          <div className="text-white" key={index}>
            {msg}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="text-black"
        type="text"
        placeholder="Type a message..."
      />
    </div>
  );
}
