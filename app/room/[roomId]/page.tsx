"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSession } from "next-auth/react";
import { getSocket } from "../../../socket";
import { redirect } from "next/navigation";

export default function Page({ params }: { params: { roomId: string } }) {
  const session = useSession();
  const [loading, setLoading] = useState(true);

  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    if (session.status !== "authenticated") return;
    const socket = getSocket();

    
    socket.emit(
      "joinRoom",
      {
        roomId: params.roomId,
        name: session.data.user?.name ?? "",
        email: session.data.user?.email ?? "",
      },
      (response: any) => {
        console.log(response);
      }
    );


    socket.on("updateUserList", (users: any) => {
      console.log(users);
      setConnectedUsers(users);
    });


    return () => {
      socket.emit("disconnect", params.roomId);
      socket.disconnect();
    };


  }, [params.roomId, session.status]);

  return (
    <div className="w-full h-screen flex">
      <div className="w-3/4">chat here</div>
      <div className="flex flex-col justify-center items-center">
        <div className="h-1/2">
          <h1>Room ID: {params.roomId}</h1>
          <button className="px-4 py-2 bg-gray-200 mx-2">Start Game</button>
          <button className="px-4 py-2 bg-gray-200">Leave ROom</button>
        </div>
        <div className="h-1/2">
          <h1>Connected Users</h1>
          <ul>
            {connectedUsers.map((user: any, index) => (
              <li key={index}>{user.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
