import React from 'react'
export function Result({Correct,totalWords}:any){
          return (
            <div className="flex space-x-4 text-xl font-bold text-[#5d5f62]">
              
            <div>
              Correct Words- <span className="text-[#e2b714]">{Correct}</span>
            </div>
            <div>
              Total Words-{" "}
              <span className="text-[#e2b714]">{totalWords}</span>
            </div>
            <div>
              Accuracy{" "}
              <span className="text-[#e2b714]">
                {(Correct / totalWords).toFixed(2)}
              </span>
            </div>
          </div>
          )
}
