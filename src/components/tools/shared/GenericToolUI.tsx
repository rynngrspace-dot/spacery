"use client";

import React from "react";
import { Tool } from "@/data/tools";

export default function GenericToolUI({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
       <div className="w-24 h-24 mb-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-4xl animate-pulse">
         🚀
       </div>
       <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest">
         Module Synthetic Mode: Active
       </h2>
       <p className="text-slate-400 max-w-md mx-auto mb-12 leading-relaxed">
         The <span className="text-sky-400">{tool.title}</span> prototype is currently undergoing orbital calibration. Local processing logic is being synthesized for the next patch.
       </p>
       
       <div className="w-full max-w-md p-8 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] mb-4">Drop Signal Material Here</div>
          <div className="flex flex-col gap-2 items-center text-slate-700">
             <div className="w-12 h-1 bg-white/5 rounded-full mb-4"></div>
             <p className="text-[11px] uppercase tracking-widest">Awaiting Uplink...</p>
          </div>
       </div>

       <button className="mt-12 px-10 py-4 border border-sky-500/30 text-sky-400 text-[10px] font-mono uppercase tracking-[0.3em] rounded-full hover:bg-sky-500/10 transition-all opacity-50 cursor-not-allowed">
         Initialize Processing
       </button>
    </div>
  );
}
