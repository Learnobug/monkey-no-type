"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTimer } from "react-timer-hook";
import axios from "axios";
import { Result } from "@/components/ResultComponent";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [sentence, setSentence] = useState("");
  const [text, setText] = useState("");
  const [resulttime, setResulttime] = useState(60);
  const [timerEnded, setTimerEnded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ correct: 0, total: 0 });
  const [dataStored, setDataStored] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  // refs to avoid stale closures
  const textRef = useRef("");
  const sentenceRef = useRef("");
  const resulttimeRef = useRef(60);

  const makeExpiry = (secs: number) => {
    const t = new Date();
    t.setSeconds(t.getSeconds() + secs);
    return t;
  };

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: makeExpiry(60),
    autoStart: false,
    onExpire: () => {
      // use refs so we get the latest values
      const inputarray = textRef.current.trim().split(/\s+/);
      const originalarray = sentenceRef.current.split(" ");
      let correct = 0;
      inputarray.forEach((word, i) => {
        if (word === originalarray[i]) correct++;
      });
      const total = inputarray.filter(Boolean).length;
      setResult({ correct, total });
      setTimerEnded(true);
      setShowResult(true);
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.id) {
      localStorage.setItem("userId", String((session.user as any).id));
    }
  }, [status, session]);

  useEffect(() => {
    axios.get("/api/word").then((res) => {
      setSentence(res.data.randomParagraph);
      sentenceRef.current = res.data.randomParagraph;
    });
  }, []);

  // save score after timer ends
  useEffect(() => {
    if (!timerEnded || dataStored) return;
    const id = localStorage.getItem("userId");
    if (!id) return;
    const { correct, total } = result;
    const secs = resulttimeRef.current;
    const data = {
      Accuracy: total > 0 ? (correct / total).toFixed(2) : "0",
      WordsCount: total,
      CorrectWords: correct,
      Totaltime: secs,
    };
    axios
      .put(`/api/user/${id}/scores`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => setDataStored(true))
      .catch((e) => console.error("Error storing score:", e));
  }, [timerEnded, dataStored, result]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (timerEnded) return;
    const val = e.target.value;
    setText(val);
    textRef.current = val;
    // start timer on very first keystroke
    if (!timerStarted) {
      restart(makeExpiry(resulttimeRef.current), true);
      setTimerStarted(true);
    }
  };

  const setTimer = (secs: number) => {
    resulttimeRef.current = secs;
    setResulttime(secs);
    restart(makeExpiry(secs), false);
    setTimerStarted(false);
    setTimerEnded(false);
    setShowResult(false);
    setDataStored(false);
    setText("");
    textRef.current = "";
    setResult({ correct: 0, total: 0 });
  };

  const redirectfunction = () => {
    const room = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    router.push(`/room/${room}`);
  };

  const renderText = () => {
    return [...sentence].map((char, index) => {
      let color: string | undefined;
      if (text[index] !== undefined) {
        color = text[index] === char ? "white" : "red";
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center text-[#e2b714] text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center items-center relative mt-8">
        <div className="relative w-[900px] h-56">
          <div
            ref={overlayRef}
            className="absolute inset-0 p-4 text-2xl text-[#5d5f62] font-bold leading-relaxed overflow-hidden pointer-events-none whitespace-pre-wrap break-words"
            style={{ fontFamily: "inherit" }}
          >
            {renderText()}
          </div>
          <textarea
            ref={textareaRef}
            className="absolute inset-0 w-full h-full p-4 z-10 text-2xl bg-transparent text-transparent border-none outline-none font-bold resize-none leading-relaxed overflow-y-scroll"
            value={text}
            onChange={handleChange}
            onScroll={() => {
              if (overlayRef.current && textareaRef.current) {
                overlayRef.current.scrollTop = textareaRef.current.scrollTop;
              }
            }}
            style={{ caretColor: "#e2b714", fontFamily: "inherit" }}
            autoFocus
            disabled={timerEnded}
          />
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-center space-y-8 mt-4">
        <div className="text-[#e2b714] text-5xl font-mono">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        {!timerStarted && !timerEnded && (
          <p className="text-[#646669] text-sm">Start typing to begin the timer</p>
        )}

        <div className="flex gap-2">
          {[15, 30, 60, 120].map((s) => (
            <button
              key={s}
              className={`px-4 py-2 rounded-md font-bold ${
                resulttime === s && !timerEnded
                  ? "bg-[#e2b714] text-black"
                  : "bg-[#2c2e31] text-white hover:bg-[#e2b714] hover:text-black"
              }`}
              onClick={() => setTimer(s)}
            >
              {s}s
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-4">
            <Result Correct={result.correct} totalWords={result.total} />
            <div className="text-center mt-4">
              <button
                onClick={() => setTimer(resulttime)}
                className="px-6 py-2 bg-[#e2b714] text-black font-bold rounded-md mr-4"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/result/history")}
                className="px-6 py-2 bg-[#2c2e31] text-white font-bold rounded-md hover:bg-white hover:text-[#e2b714]"
              >
                View History
              </button>
            </div>
          </div>
        )}

        <button
          onClick={redirectfunction}
          className="bg-[#2c2e31] hover:bg-white text-white hover:text-[#e2b714] font-bold py-2 px-6 rounded-md transition-colors"
        >
          JOIN MULTIPLAYER ROOM
        </button>
      </div>
    </>
  );
}
