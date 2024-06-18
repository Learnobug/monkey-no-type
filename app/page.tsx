"use client";
import { useState,useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTimer } from "react-timer-hook";
import axios from 'axios'
import { Result } from "@/components/ResultComponent";

export default function Home() {
  let Correct = 0;
  let totalWords = 0;
  let countgames=0;
  

  const time: any = new Date();
  const[lorem,setLorem]=useState('');
  const [sentence,setSentence]=useState('');  
  let resulttime=0;
  const router = useRouter();
  const session = useSession();
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
  } = useTimer();

  if (!session) {
    router.push("/api/auth/signin");
  }
  time.setSeconds(time.getSeconds());

 const redirectfunc=()=>{
  return router.push('/result')
 }
  
   useEffect(()=>{
          const headers = {
            'Content-Type': 'application/json'
        };
         
          const data = {
            Accuracy: (Correct / totalWords).toFixed(2),
            WordsCount: totalWords,
            CorrectWords: Correct,
            Totaltime: resulttime
          };
          
        const storedata=async () =>{
           
          try{
             const response= await axios.put(`/api/user/${Object.values(session.data.user)[1]}/scores`,data,{headers});
             console.log(response.data);
          }catch(error)
          {
            console.error('Error fetching data:', error); 
          }
        }
          storedata();
   },[isRunning])



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/word');
        setSentence(JSON.stringify(response.data.randomParagraph));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
   useEffect(()=>{
      setSentence(lorem)
   },[lorem])

 

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRunning) resume();
    setText(e.target.value);
  };

  const timer = (e: any) => {
    const time = new Date();

    time.setSeconds(time.getSeconds() + e);
    restart(time);
    pause();
  };
  const renderText = () => {
    return [...sentence].map((char, index) => {
      let color;
      if (text[index]) {
        if (text[index] === char) Correct = Correct + 1;
        totalWords = totalWords + 1;
        color = text[index] === char ? "white" : "red";
      }
      return <span style={{ color }}>{char}</span>;
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
             <Result Correct={Correct} totalWords={totalWords}/>
             </>
          )}
        </div>
      </div>
    </>
  );
}
