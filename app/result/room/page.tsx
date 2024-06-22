"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function HistoryPage() {
  const [scores, setScores] = useState<{ Accuracy: number; WordsCount: number; Totaltime: number; CorrectWords: number; userId: string; timestamp: string; }[]>([]);
  const session = useSession();
  
  useEffect(() => {
      const userId = localStorage.getItem("userId");
    const getData = async () => {
        
        const roomId=localStorage.getItem("roomId")?.toString()
        
      try {
        const response = await axios.get(`/api/user/${userId}/${roomId}`);
        setScores(response.data.score.reverse());

        console.log(response.data.score);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

return (
    <div className="w-full h-screen">
        <div className="w-full text-center text-5xl text-[#e2b714] font-bold mb-10">
            History
        </div>
        <div className="w-full">
            <div className="flex justify-around">
                <div className="text-[#646669] text-xl w-32 text-center">Sr. No</div>
                <div className="text-[#646669] text-xl w-32 text-center">User Id</div>
                <div className="text-[#646669] text-xl w-32 text-center">WPM</div>
                <div className="text-[#646669] text-xl w-32 text-center">Accuracy</div>
                <div className="text-[#646669] text-xl w-32 text-center">Mode</div>
                <div className="text-[#646669] text-xl w-32 text-center">Correct Words</div>
                <div className="text-[#646669] text-xl w-32 text-center">Date</div>
            </div>

            {scores.map((score, indx) => (
                <div key={indx} className="flex justify-around my-2">
                    <div className="text-white text-xl w-32 text-center">{indx+1}</div>
                    <div className="text-white text-xl w-32 text-center">{score.userId}</div>
                    <div className="text-white text-lg w-32 text-center">{score.WordsCount*60/score.Totaltime}</div>
                    <div className="text-white text-lg w-32 text-center">{score.Accuracy}</div>
                    <div className="text-white text-lg w-32 text-center">English {score.Totaltime}</div>
                    <div className="text-white text-lg w-32 text-center">{score.CorrectWords}</div>
                    <div className="text-white text-lg w-32 text-center">{new Date(score?.timestamp).toLocaleString()}</div>
                </div>
            ))}
        </div>
    </div>
);
}
