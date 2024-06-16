'use client'
import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useTimer } from 'react-timer-hook';

export default function Home() {
  
  let correct=0;
  let totalword=0;
  let accuracy=correct/totalword;
  let numberofgames=0;
  let flag=0

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
  if(seconds==0 && minutes==0) flag=1;
  const router=useRouter();
  const session = useSession();
     if(!session){
      router.push("/api/auth/signin");
     }
     const [previousgame,setprevious]=useState();
    
  
  const [text, setText] = useState('');
  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi`;

  const handleChange = (e) => {
    setText(e.target.value);
  };

   const timer=((e:any)=>{
    const time = new Date();
    time.setSeconds(time.getSeconds() + e);
    restart(time)
   })
  const renderText = () => {
     if(seconds !=0 || minutes !=0 ){
    return [...lorem].map((char, index) => {
      let color;
      if (text[index]) {
        if(text[index]===char) correct=correct+1;
        totalword=totalword+1;
        color = text[index] === char ? 'green' : 'red';
      }
      return <span style={{ color }}>{char}</span>;
    });
  }
  };
    const restartfunc=()=>
    {

        accuracy=0;
        correct=0;
        totalword=0;
        numberofgames=numberofgames+1;
        return null;
    }

  return (
    <div className="w-full min-h-screen flex justify-center items-center relative">
      <div className="absolute h-96 w-[700px] p-4 text-xl text-black">
        {renderText()}
      </div>
    
      <textarea 
        className="h-96 w-[700px] flex justify-center items-center bg-slate-600 p-4 text-xl text-black z-10 bg-transparent text-transparent"
        value={text}
        onChange={handleChange}
      />
        <div style={{fontSize: '50px'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div>
  
        {flag &&    (numberofgames==0 ? <div>
          <div> start the game by clicking on timer</div>
        </div>: <div>
          <h1>
            Score
          </h1>
          <h2>
          <div>correct words-{correct}</div>
          <div>totalwords-{totalword}</div>
           <div> Accuracy- {accuracy.toFixed(2)}</div>
          </h2>
          <button onClick={restartfunc()}>Restart</button>
         
        </div>)
       }
     
      <button onClick={() => timer(15)}>...15 sec....</button>
      <button onClick={() => timer(30)}>..30 sec.....</button>
      <button onClick={() => timer(60)}>.60 sec....</button>
      <button onClick={() => timer(120)}>.120 sec...</button>
      <div>correct words-{correct}</div>
      <div>totalwords-{totalword}</div>
      <div> Accuracy- {accuracy.toFixed(2)}</div>
      </div>
    </div>
  );
}