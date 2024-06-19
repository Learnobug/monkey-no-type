"use client";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Page() {
  const [scores, setScores] = useState<{ Accuracy: number; WordsCount: number; Totaltime: number; CorrectWords: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    const getData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}/scores`);
        setScores(response.data.score);
        console.log(response.data.score);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);
  if (loading) {
    return <div className="w-full h-screen flex justify-center items-center text-[#e2b714] text-xl">Loading...</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="">
        <h1 className="text-5xl text-[#e2b714] font-bold">Game Over</h1>
        <p className="text-center text-xl text-white">Here are the Results</p>
      </div>
      <div className=" mt-10">
        {scores.length > 0 && (
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col justify-center items-center w-1/2">
              <h1 className="text-[#646669] text-3xl font-semibold">Accuracy</h1>
              <span className="text-[#e2b714] text-2xl">
                {scores[scores.length - 1].Accuracy *100}%
              </span>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2">
              <h1 className="text-[#646669] text-3xl font-semibold">WPM</h1>
              <span className="text-[#e2b714] text-2xl">
                {scores[scores.length - 1].WordsCount * 60 / scores[scores.length - 1].Totaltime}
              </span>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2">
              <h1 className="text-[#646669] text-3xl font-semibold">Test Type</h1>
              <span className="text-[#e2b714] text-2xl">
                English <br />
                time{" "}
                 {scores[scores.length - 1].Totaltime}
              </span>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2">
              <h1 className="text-[#646669] text-3xl font-semibold">Correct Words</h1>
              <span className="text-[#e2b714] text-2xl">
                {scores[scores.length - 1].CorrectWords}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
