"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth
import { getSocket } from "../../../socket";

export default function Page({ params }: { params: { roomId: string } }) {
  const session  = useSession(); // Fetch session data
  const [loading, setLoading] = useState(true); // State to track loading status


  const [connectedUsers, setConnectedUsers] = useState([]); // State to track connected users

  useEffect(() => {
    if (session.status !== 'authenticated') return; // Ensure session is loaded
    const socket = getSocket(); // Get the socket instance
    // Connect to the room with user details
    socket.emit(
      "joinRoom",
      {
        roomId: params.roomId,
        name: session.data.user?.name ?? '',
        email: session.data.user?.email ?? '',
      },
      (response: any) => {
        console.log(response);
      }
    );

    // Listen for updates to connected users
    socket.on("updateUserList", (users: any) => {
      console.log(users);
      setConnectedUsers(users); // Update the state with the new list of users
    });

    // Clean up on component unmount
    return () => {
      socket.emit("disconnect", params.roomId);
      socket.disconnect();
    };
  }, [params.roomId, session.status]);

  return (
    <div className="w-full h-screen flex">
      <div className="w-3/4">
         chat here
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="h-1/2">
            <h1>Room ID: {params.roomId}</h1>
            <button className="px-4 py-2 bg-gray-200 mx-2">Start Game</button>
            <button className="px-4 py-2 bg-gray-200">Leave ROom</button>
        </div>
        <div className="h-1/2">
          <h1>Connected Users</h1>
          <ul>
            {connectedUsers.map((user: any) => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
