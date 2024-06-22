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
import { getSocket } from "../socket";

export default function Home() {
  let Correct = 0;
  let totalWords = 0;
  let countgames = 0;
  
  const time: any = new Date();
  const [lorem, setLorem] = useState("");
  const [sentence, setSentence] = useState("");
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
  } = useTimer({
    onExpire: () => setTimerEnded(true), // Set timerEnded to true when the timer ends
  });


  if (session.status == "unauthenticated" || !localStorage.getItem("userId")) {
    router.push("/api/auth/signin");
  }
  time.setSeconds(time.getSeconds());
  
  const redirectfunc = () => {
    const inputarray = text.split(" ");
    const orignalarray = sentence.split(" ");

    [...inputarray].map((char, indx) => {
      if (char === orignalarray[indx]) {
        Correct = Correct + 1;
      }
    });
    console.log(inputarray);
    totalWords = inputarray.length;

    return router.push("/result");
  };

  const redirectfunction = ()=>{
    const randomNumberString = length => Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
    const room= randomNumberString(10)
    router.push(`/room/${room}`);
  }

  const id = session.data?.user.id;
  localStorage.setItem("userId", id);
   
  useEffect(() => {
    if (timerEnded && !dataStored) {
      const headers = {
        "Content-Type": "application/json",
      };

      const data = {
        Accuracy: (Correct / totalWords).toFixed(2),
        WordsCount: totalWords,
        CorrectWords: Correct,
        Totaltime: resulttime,
      };

      const storedata = async () => {
        try {

          const response = await axios.put(
            `/api/user/${session.data.user.id?.toString()}/scores`,
            data,
            { headers }
          );
          const id = Object.values(session.data.user)[1];
          localStorage.setItem("userId", id);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      storedata();
    }
  }, [isRunning, dataStored]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/word");
        setSentence(response.data.randomParagraph);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSentence(lorem);
  }, [lorem]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e);
    if (!isRunning) resume();
    setText(e.target.value);
  };

  const timer = (e: any) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + e);
    restart(time);
    pause();
    setResulttime(e);
    setDataStored(false);
  };
  const renderText = () => {
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
          <button
            className="px-4 py-2 bg-[#e2b714] mx-2 rounded-md"
            onClick={() => timer(15)}
          >
            15 sec
          </button>
          <button
            className="px-4 py-2 bg-[#e2b714] mx-2 rounded-md"
            onClick={() => timer(30)}
          >
            30 sec
          </button>
          <button
            className="px-4 py-2 bg-[#e2b714] mx-2 rounded-md"
            onClick={() => timer(60)}
          >
            60 sec
          </button>
          <button
            className="px-4 py-2 bg-[#e2b714] mx-2 rounded-md"
            onClick={() => timer(120)}
          >
            120 sec
          </button>
         
          {!isRunning && seconds === 0 && (
            <>
              {redirectfunc()}
              <Result Correct={Correct} totalWords={totalWords} />
            </>
          )}

        </div>
        <button onClick={redirectfunction} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
   JOIN ROOM
</button>
      </div>
    </>
  );
}
