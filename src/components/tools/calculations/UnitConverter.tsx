"use client";

import React, { useState } from "react";

const CONVERSIONS = {
  meters: 1,
  kilometers: 0.001,
  miles: 0.000621371,
  au: 6.68459e-12,
  lightyears: 1.057e-16,
  parsecs: 3.24078e-17
};

type Unit = keyof typeof CONVERSIONS;

export default function UnitConverter() {
  const [val, setVal] = useState<string>("1");
  const [from, setFrom] = useState<Unit>("meters");
  const [to, setTo] = useState<Unit>("lightyears");

  const calculateResult = () => {
    const value = parseFloat(val) || 0;
    const baseValue = value / CONVERSIONS[from];
    return (baseValue * CONVERSIONS[to]).toExponential(4);
  };

  const units = Object.keys(CONVERSIONS) as Unit[];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center">
        <div className="flex-1 w-full space-y-4">
           <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Source Magnitude</label>
           <input 
             type="number" value={val} onChange={(e) => setVal(e.target.value)}
             className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 md:p-6 font-mono text-xl md:text-2xl text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all"
             placeholder="0.00"
           />
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {units.map(u => (
                <button 
                  key={u} onClick={() => setFrom(u)}
                  className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${from === u ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"}`}
                >
                  {u}
                </button>
              ))}
           </div>
        </div>

        <div className="text-2xl md:text-3xl text-slate-700 font-mono py-4 md:py-0 rotate-90 lg:rotate-0">→</div>

        <div className="flex-1 w-full space-y-4">
           <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Projected Value</label>
           <div className="w-full bg-white/2 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-xl md:text-2xl text-slate-200">
              {calculateResult()}
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {units.map(u => (
                <button 
                  key={u} onClick={() => setTo(u)}
                  className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${to === u ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"}`}
                >
                  {u}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="mt-6 p-8 rounded-3xl bg-sky-500/5 border border-white/5 text-center">
         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
           Calculation powered by Orbital Parallax Engine v4.0
         </p>
      </div>
    </div>
  );
}
