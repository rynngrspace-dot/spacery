"use client";

import React, { useState } from "react";

export default function ReadingRefiner() {
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState(0.5);

  const bionicfy = (txt: string) => {
    if (!txt) return "";
    
    return txt.split(/\s+/).map((word, i) => {
      if (word.length <= 1) return word;
      
      const pivot = Math.ceil(word.length * intensity);
      const start = word.slice(0, pivot);
      const end = word.slice(pivot);
      
      return (
        <span key={i} className="inline-block mr-[0.4em]">
           <span className="font-bold text-white">{start}</span>
           <span className="text-slate-400 opacity-60">{end}</span>
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col gap-10">
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-8">
           <div className="flex flex-col gap-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Enter Text</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all min-h-[200px] resize-none"
              />
           </div>

           <div className="flex flex-col gap-4">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">
                 <span>Reading Intensity</span>
                 <span className="text-sky-400">{(intensity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0.2" max="0.8" step="0.1" value={intensity} 
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500"
              />
           </div>

           <button 
             onClick={() => setText("")}
             className="w-full py-3 bg-white/2 border border-white/5 rounded-xl text-[10px] font-mono text-slate-500 hover:text-red-400 transition-all uppercase tracking-widest"
           >
             Clear Text
           </button>
        </div>

        {/* Output Area */}
        <div className="flex-1 flex flex-col gap-4">
           <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Bionic Reading Output</label>
           <div className="w-full bg-white/2 border border-white/5 rounded-2xl p-8 min-h-[400px] leading-relaxed text-lg font-serif">
              {text ? (
                <div className="flex flex-wrap">
                   {bionicfy(text)}
                </div>
              ) : (
                <p className="text-slate-700 italic font-mono text-sm">Waiting for text input...</p>
              )}
           </div>
           
           <div className="flex justify-end">
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                Optimized for rapid visual scanning.
              </p>
           </div>
        </div>
      </div>

      <div className="mt-8 p-10 rounded-3xl bg-white/2 border border-white/5 text-center">
         <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
           Bionic reading improves focus by guiding the eyes with artificial fixation points.
         </p>
      </div>

    </div>
  );
}
