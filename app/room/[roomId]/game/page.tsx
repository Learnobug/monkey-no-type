"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTimer } from "react-timer-hook";
import axios from "axios";
import { Result } from "@/components/ResultComponent";
import Link from "next/link";
import { io } from "socket.io-client";
import { getSocket } from "../../../../socket"

export default function Home({ params }: { params: { roomId: string } }) {
  let Correct = 0;
  let totalWords = 0;
  let countgames = 0;

  const time: any = new Date();
  const [lorem, setLorem] = useState("");
  const sentence=localStorage.getItem("sentence")

  const router = useRouter();
  const session = useSession();
  const [dataStored, setDataStored] = useState(false);
  const [resulttime, setResulttime] = useState(0);
  const [timerEnded, setTimerEnded] = useState(false);
  const [text, setText] = useState("");
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({expiryTimestamp: new Date(),
    onExpire: () => setTimerEnded(true), 
  });

  if (session.status == "unauthenticated") {
    router.push("/api/auth/signin");
  }
  time.setSeconds(time.getSeconds());

  const redirectfunc = () => {
    const inputarray = text.split(" ");
    const orignalarray = sentence?.split(" ")||[];
   
    [...inputarray].map((char, indx) => {
      if (char === orignalarray[indx]) {
        Correct = Correct + 1;
      }
    });
    console.log("coorect",Correct);
    console.log(inputarray);
    totalWords = inputarray.length;

  };

  useEffect(() => {
    if (timerEnded && !dataStored) {
      const headers = {
        "Content-Type": "application/json",
      };

      redirectfunc();

      const data = {
        roomId:params.roomId,
        Accuracy: (Correct / totalWords).toFixed(2),
        WordsCount: totalWords,
        CorrectWords: Correct,
        Totaltime: resulttime,
      };

      console.log('Data is',data);
       
      const storedata = async () => {
        try {
            const userId=localStorage.getItem("userId");
          const response = await axios.post(
            `/api/user/${userId?.toString()}/${localStorage.getItem("roomId")?.toString()}`,
            data,
            { headers }
          );
          console.log(response.data);
          return router.push("/result/room");

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      storedata();
    }
  }, [isRunning, dataStored]);


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e);
    setText(e.target.value);
  };

  useEffect(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 15);
        restart(time);
        setDataStored(false);
    
  }, []);
 
  
  const renderText = () => {
    //@ts-ignore
    return [...sentence].map((char, index) => {
      let color;
      if (text[index]) {
        color = text[index] === char ? "white" : "red";
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <div className="w-full h-96 flex justify-center items-center relative">
        <div className="absolute h-48 w-[900px] p-4 text-3xl text-[#5d5f62] font-bold">
          {renderText()}
        </div>
        <textarea
          className="h-48 w-[900px] flex justify-center items-center p-4 z-10 text-3xl bg-transparent text-transparent border-none outline-none font-bold"
          value={text}
          onChange={handleChange}
          style={{ caretColor: "#e2b714" }}
          autoFocus
          disabled={!isRunning && seconds === 0}
        />
      </div>
      <div className="w-full flex flex-col justify-start items-center space-y-10">
        <div className="text-[#e2b714] text-5xl">
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <div>

          {!isRunning && seconds === 0 && (
            <>
              
            </>
          )}
        </div>
      </div>
    </>
  );
}
