"use client";

import React, { useState } from "react";

export default function Base64Module() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleAction = (isEncode: boolean) => {
    try {
      setError("");
      if (!input.trim()) return;
      if (isEncode) {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch {
      setError("Encoding failure. Signal mismatch in the Base64 stream.");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-[500px] lg:h-[500px]">
        <div className="flex flex-col gap-4 flex-1 h-[300px] lg:h-full">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Input String</label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-sm text-sky-300 focus:outline-none focus:border-sky-500/50 transition-colors resize-none placeholder:text-slate-800 h-full"
            placeholder="Paste text here..."
          />
        </div>
        <div className="flex flex-col gap-4 flex-1 h-[300px] lg:h-full relative">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Base64 Output</label>
          <div className="flex-1 relative bg-white/2 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-sm overflow-auto group h-full">
            {output ? (
               <pre className="text-slate-200">{output}</pre>
            ) : (
               <span className="text-slate-800 italic">Encoding output...</span>
            )}
            {output && (
              <button 
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute top-4 right-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-center justify-center pt-4">
         <button 
          onClick={() => handleAction(true)}
          className="group relative px-10 py-5 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] text-xs uppercase tracking-[0.3em]"
         >
           Encode Signal
         </button>
         <button 
           onClick={() => handleAction(false)}
           className="px-10 py-5 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-[0.3em]"
         >
           Decode Stream
         </button>
         {error && <span className="text-red-500 text-xs font-mono animate-pulse">{error}</span>}
      </div>
    </div>
  );
}
