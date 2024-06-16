'use client'
import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
export default function Home() {
  const router=useRouter();
  const session = useSession();
     if(!session){
     router.push("/api/auth/signin");
     }
    
  
  const [text, setText] = useState('');
  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi`;

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const renderText = () => {
    return [...lorem].map((char, index) => {
      let color;
      if (text[index]) {
        color = text[index] === char ? 'green' : 'red';
      }
      return <span style={{ color }}>{char}</span>;
    });
  };

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
    </div>
  );
}