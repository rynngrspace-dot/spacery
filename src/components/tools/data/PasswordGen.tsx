"use client";

import React, { useState } from "react";

export default function PasswordGen() {
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 items-center py-4 md:py-10 text-center">
      
      {/* Visual Display */}
      <div className="w-full max-w-xl relative group">
         <div className="absolute -inset-1 bg-linear-to-r from-sky-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative bg-black h-20 md:h-24 rounded-2xl border border-white/5 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <span className={`text-xl md:text-3xl font-mono text-center tracking-wider truncate mb-1 px-4 ${password ? "text-sky-400" : "text-slate-800 italic"}`}>
               {password || "••••••••••••••••"}
            </span>
            {password && (
              <button 
                onClick={copyToClipboard}
                className="absolute right-4 text-[9px] md:text-[10px] font-mono text-slate-500 hover:text-white transition-colors"
              >
                COPY
              </button>
            )}
         </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
         <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Key Amplitude</span>
               <span className="text-sm font-mono text-sky-400">{length}</span>
            </div>
            <input 
              type="range" min="8" max="64" value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500"
            />
         </div>

         <div className="grid grid-cols-1 gap-5">
            <label className="flex items-center gap-4 cursor-pointer group">
               <input 
                 type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)}
                 className="w-4 h-4 rounded border-white/10 bg-white/2 text-sky-500 focus:ring-0 focus:ring-offset-0 transition-all"
               />
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest group-hover:text-slate-200">Inject Star Symbols</span>
            </label>
            <label className="flex items-center gap-4 cursor-pointer group">
               <input 
                 type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)}
                 className="w-4 h-4 rounded border-white/10 bg-white/2 text-sky-500 focus:ring-0 focus:ring-offset-0 transition-all"
               />
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest group-hover:text-slate-200">Include Spectral Digits</span>
            </label>
         </div>
      </div>

      <button 
        onClick={generatePassword}
        className="w-full sm:w-auto px-12 md:px-16 py-5 md:py-6 bg-purple-500 text-white font-bold rounded-2xl md:rounded-full hover:bg-purple-400 transition-all shadow-[0_0_50px_rgba(168,85,247,0.3)] text-[10px] md:text-xs uppercase tracking-[0.3em] mt-8"
      >
        Synthesize New Key
      </button>

    </div>
  );
}
