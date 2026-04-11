"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Score {
  Accuracy: number;
  WordsCount: number;
  Totaltime: number;
  CorrectWords: number;
}

export default function ResultPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { setLoading(false); return; }
    axios
      .get(`/api/user/${userId}/scores`)
      .then((res) => { setScores(res.data.score ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-[#e2b714] text-xl">
        Loading...
      </div>
    );
  }

  const last = scores[scores.length - 1];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl text-[#e2b714] font-bold">Game Over</h1>

      {last ? (
        <div className="flex flex-wrap justify-center gap-10 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-[#646669] text-2xl font-semibold">WPM</span>
            <span className="text-[#e2b714] text-4xl font-bold">
              {last.Totaltime > 0 ? Math.round(last.WordsCount * 60 / last.Totaltime) : 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#646669] text-2xl font-semibold">Accuracy</span>
            <span className="text-[#e2b714] text-4xl font-bold">
              {(last.Accuracy * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#646669] text-2xl font-semibold">Correct Words</span>
            <span className="text-[#e2b714] text-4xl font-bold">{last.CorrectWords}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#646669] text-2xl font-semibold">Time</span>
            <span className="text-[#e2b714] text-4xl font-bold">{last.Totaltime}s</span>
          </div>
        </div>
      ) : (
        <p className="text-[#646669] text-xl">No scores yet.</p>
      )}

      <div className="flex gap-4 mt-6">
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
  );
}
