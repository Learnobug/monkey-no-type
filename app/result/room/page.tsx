"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Score {
  id: number;
  userId: number;
  Accuracy: number;
  WordsCount: number;
  CorrectWords: number;
  Totaltime: number;
  timestamp: string;
}

export default function RoomResultPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const roomId = localStorage.getItem("roomId");
    if (!userId || !roomId) {
      setError("No room data found.");
      setLoading(false);
      return;
    }
    axios
      .get(`/api/user/${userId}/${roomId}`)
      .then((res) => {
        setScores(res.data.score ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load results.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-[#e2b714] text-xl">
        Loading results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-red-400 text-xl">{error}</p>
        <Link href="/" className="text-[#e2b714] underline">Go home</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10">
      <div className="w-full text-center text-5xl text-[#e2b714] font-bold mb-10">
        Room Results
      </div>
      <div className="w-full px-8">
        <div className="flex justify-around border-b border-[#646669] pb-2 mb-4">
          <div className="text-[#646669] text-xl w-16 text-center">#</div>
          <div className="text-[#646669] text-xl w-32 text-center">Player</div>
          <div className="text-[#646669] text-xl w-32 text-center">WPM</div>
          <div className="text-[#646669] text-xl w-32 text-center">Accuracy</div>
          <div className="text-[#646669] text-xl w-32 text-center">Correct Words</div>
        </div>

        {scores.length === 0 && (
          <p className="text-[#646669] text-center mt-10">No scores recorded yet.</p>
        )}

        {scores
          .sort((a, b) => (b.WordsCount * 60 / b.Totaltime) - (a.WordsCount * 60 / a.Totaltime))
          .map((score, indx) => (
            <div key={score.id} className="flex justify-around my-3">
              <div className="text-white text-xl w-16 text-center">{indx + 1}</div>
              <div className="text-white text-lg w-32 text-center">Player {score.userId}</div>
              <div className="text-[#e2b714] text-lg w-32 text-center font-bold">
                {Math.round(score.WordsCount * 60 / score.Totaltime)}
              </div>
              <div className="text-white text-lg w-32 text-center">
                {(score.Accuracy * 100).toFixed(0)}%
              </div>
              <div className="text-white text-lg w-32 text-center">{score.CorrectWords}</div>
            </div>
          ))}

        <div className="flex justify-center gap-4 mt-10">
          <Link
            href="/"
            className="px-6 py-3 bg-[#e2b714] text-black font-bold rounded-md hover:bg-yellow-400"
          >
            Play Again
          </Link>
          <Link
            href="/result/history"
            className="px-6 py-3 bg-[#2c2e31] text-white font-bold rounded-md hover:bg-white hover:text-[#e2b714]"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
