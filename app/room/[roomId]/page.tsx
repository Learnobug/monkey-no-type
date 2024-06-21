"use client";
import React, { useEffect, useState } from "react";
import { getSocket } from "../../../socket";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Chat from "@/components/Chat";
import axios from "axios";

export default function Page({ params }: { params: { roomId: string } }) {
  const session = useSession();
  localStorage.setItem("roomId",params.roomId);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [sentence, setSentence] = useState("");
  const router=useRouter();
  if (session.status == "unauthenticated") {
    router.push("/api/auth/signin");
  }
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

    socket.on("sentence",(data:any)=>{
      console.log(data);
      localStorage.setItem("sentence",data);
      router.push(`/room/${params.roomId}/game`)
    })

    return () => {
      socket.disconnect();
    };
  }, [params.roomId, session.status]);
  const startGame = async () => {
    const gameData = await fetchGameData();
    const socket = getSocket();
    socket.emit("startGame", params.roomId, gameData);
    localStorage.setItem("sentence",gameData);
    router.push(`/room/${params.roomId}/game`)
    
  };

  const fetchGameData = async () => {
    const response = await axios.get("/api/word");
    setSentence(response.data.randomParagraph);
    return response.data.randomParagraph;
  };

  const filteredUsers = connectedUsers.filter((user: any) => user.isOwner === true);

  const owner = filteredUsers[0]?.email === session.data?.user?.email;


  return (
    <div className="w-full h-screen flex">
      <Chat roomId={params.roomId} />
      <div className="flex flex-col justify-center items-center">
        <div className="h-1/2 flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl text-white">
            Room ID: <span className="text-[#e2b714]">{params.roomId}</span>
          </h1>
          {owner && <button onClick={startGame} className="px-20 py-6 bg-[#2c2e31] mx-2 rounded-md text-white w-72 hover:bg-white hover:text-[#e2b714] hover:font-bold text-xl">
            Start Game
          </button>}
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