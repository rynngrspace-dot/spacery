"use client";

import React, { useState } from "react";

export default function URLPulseChecker() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const processUrl = () => {
    try {
      if (mode === "encode") return encodeURIComponent(url);
      return decodeURIComponent(url);
    } catch {
      return "ERROR: Malformed URL Signal Detected.";
    }
  };

  const result = processUrl();

  return (
    <div className="flex flex-col gap-10 md:gap-16">
      <div className="flex flex-col gap-8">
        <div className="flex justify-center gap-4">
           {["encode", "decode"].map((m) => (
             <button 
               key={m}
               onClick={() => setMode(m as any)}
               className={`px-8 py-3 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all ${mode === m ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5"}`}
             >
               {m} Signal
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex flex-col gap-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Raw Input</label>
              <textarea 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://spacery.io/signal?id=123"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all min-h-[150px] resize-none"
              />
           </div>
           
           <div className="flex flex-col gap-4 relative">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Processed Output</label>
              <div className="w-full bg-white/2 border border-white/5 rounded-2xl p-6 font-mono text-sm text-slate-200 min-h-[150px] overflow-auto break-all relative group">
                 {result}
                 <button 
                   onClick={() => navigator.clipboard.writeText(result)}
                   className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   Copy
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Social Preview Simulator */}
      <div className="flex flex-col gap-6">
        <div className="h-px bg-white/5 w-full"></div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Temporal Communication Simulator</span>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">How the world sees your link</span>
        </div>

        <div className="w-full max-w-xl mx-auto p-4 md:p-8 bg-[#0b0f1a] border border-white/10 rounded-3xl shadow-2xl relative group overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">🚀</div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-100">Spacery Laboratory</span>
                    <span className="text-[9px] text-slate-500 font-mono">@spacery_lab</span>
                 </div>
              </div>
              
              <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
                 <div className="aspect-video bg-linear-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center p-8 text-center">
                    <span className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                       {url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : "spacery.io"}
                    </span>
                 </div>
                 <div className="p-4 bg-white/2">
                    <h4 className="text-sm font-bold text-slate-200 mb-1">Orbital Data Uplink Protocol</h4>
                    <p className="text-xs text-slate-500 leading-relaxed truncate">
                       {url || "https://spacery.io/signal-preview"}
                    </p>
                 </div>
              </div>
           </div>
           
           {/* Scanline effect */}
           <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none animate-[scanline_8s_linear_infinite]"></div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-md mx-auto leading-relaxed">
        Validated using standard terrestrial URI encoding specifications.
      </p>

    </div>
  );
}
