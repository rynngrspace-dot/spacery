"use client";

import React, { useState } from "react";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const formatJSON = (pretty: boolean) => {
    try {
      setError("");
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, pretty ? 2 : 0));
    } catch {
      setError("Invalid JSON detected in the signal stream.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-[500px] lg:h-[500px]">
          <div className="flex flex-col gap-4 flex-1 h-[300px] lg:h-full">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Raw Blueprint (JSON)</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-sm text-sky-300 focus:outline-none focus:border-sky-500/50 transition-colors resize-none placeholder:text-slate-800 h-full"
              placeholder='{"signal": "active"}'
            />
          </div>
          <div className="flex flex-col gap-4 flex-1 h-[300px] lg:h-full relative">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Formatted Telemetry</label>
            <div className="flex-1 relative bg-white/2 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-sm overflow-auto group h-full">
               {error ? (
                 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                    {error}
                 </div>
               ) : (
                 <pre className={output ? "text-slate-200" : "text-slate-800 italic"}>
                   {output || "Awaiting signal input..."}
                 </pre>
               )}
               {output && !error && (
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

      <div className="flex flex-wrap gap-4 items-center">
        <button 
          onClick={() => formatJSON(true)}
          className="px-8 py-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] text-xs uppercase tracking-widest"
        >
          Prettify Space
        </button>
        <button 
          onClick={() => formatJSON(false)}
          className="px-8 py-4 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-widest"
        >
          Minify Void
        </button>
        {error && <span className="text-red-500 text-xs font-mono animate-pulse ml-4">{error}</span>}
      </div>
    </div>
  );
}
