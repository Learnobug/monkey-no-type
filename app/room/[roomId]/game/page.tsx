"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTimer } from "react-timer-hook";
import axios from "axios";
import { Result } from "@/components/ResultComponent";

const GAME_DURATION = 15;

export default function GamePage() {
  const router = useRouter();
  const { status } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [sentence, setSentence] = useState("");
  const [text, setText] = useState("");
  const [timerEnded, setTimerEnded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({ correct: 0, total: 0 });
  const [dataStored, setDataStored] = useState(false);

  // refs to avoid stale closures inside onExpire
  const textRef = useRef("");
  const sentenceRef = useRef("");

  const makeExpiry = () => {
    const t = new Date();
    t.setSeconds(t.getSeconds() + GAME_DURATION);
    return t;
  };

  const { seconds, minutes } = useTimer({
    expiryTimestamp: makeExpiry(),
    autoStart: true,
    onExpire: () => {
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
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const stored = localStorage.getItem("sentence") ?? "";
    setSentence(stored);
    sentenceRef.current = stored;
  }, []);

  // save score and redirect after timer ends
  useEffect(() => {
    if (!timerEnded || dataStored) return;

    const userId = localStorage.getItem("userId");
    const roomId = localStorage.getItem("roomId");
    if (!userId || !roomId) return;

    const { correct, total } = result;
    const data = {
      roomId,
      Accuracy: total > 0 ? (correct / total).toFixed(2) : "0",
      WordsCount: total,
      CorrectWords: correct,
      Totaltime: GAME_DURATION,
    };

    axios
      .post(`/api/user/${userId}/${roomId}`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        setDataStored(true);
        router.push("/result/room");
      })
      .catch((e) => console.error("Error storing score:", e));
  }, [timerEnded, dataStored, result, router]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (timerEnded) return;
    const val = e.target.value;
    setText(val);
    textRef.current = val;
  };

  const renderText = () => {
    if (!sentence) return null;
    return sentence.split("").map((char, index) => {
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

        {showResult && (
          <div className="mt-4 text-center">
            <Result Correct={result.correct} totalWords={result.total} />
            <p className="text-[#646669] mt-4 text-sm">Saving results...</p>
          </div>
        )}
      </div>
    </>
  );
}
