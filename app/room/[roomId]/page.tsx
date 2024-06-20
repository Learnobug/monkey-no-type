"use client";
import React, { useEffect, useState } from "react";
import { getSocket } from "../../../socket";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Chat from "@/components/Chat";

export default function Page({ params }: { params: { roomId: string } }) {
  const session = useSession();
  
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
      socket.disconnect();
    };
  }, [params.roomId, session.status]);

  return (
    <div className="w-full h-screen flex">
      <Chat roomId={params.roomId} />
      <div className="flex flex-col justify-center items-center">
        <div className="h-1/2 flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl text-white">
            Room ID: <span className="text-[#e2b714]">{params.roomId}</span>
          </h1>
          <button className="px-20 py-6 bg-[#2c2e31] mx-2 rounded-md text-white w-72 hover:bg-white hover:text-[#e2b714] hover:font-bold text-xl">
            Start Game
          </button>
          <Link
            href={"/"}
            className="px-20 py-6 bg-[#2c2e31] mx-2 rounded-md text-white w-72 text-center hover:bg-white hover:text-[#e2b714] hover:font-bold text-xl"
          >
            Leave Room
          </Link>
        </div>
        <div className="h-1/2">
          <h1 className="text-xl text-[#646669] font-bold">Connected Users</h1>
          <ul>
            {connectedUsers.map((user: any, index) => (
              <li className="text-[#e2b714]" key={index}>
                {index + 1}
                {". "}
                {user.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}