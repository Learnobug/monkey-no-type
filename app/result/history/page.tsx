"use client"
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";

export default function HistoryPage() {
    const [scores, setScores] = useState([]);
    const session = useSession();
    const userId=localStorage.getItem('userId');
    console.log(userId)
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}/scores`);
                setScores(response.data.score);
                console.log(response.data.score)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
            getData();
    }, []);

    return (
        <div className="">
            <h1>
                {scores.map((score,indx) => (
                    <div key={indx}>
                       <h1>Accuracy-</h1> {score.Accuracy} 
                      <h1>Correctwords-</h1>  {score.CorrectWords}
                    </div>
                ))}
            </h1>
        </div>
    );
}
