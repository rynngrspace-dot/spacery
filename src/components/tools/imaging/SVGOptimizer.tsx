"use client";

import React, { useState } from "react";

export default function SVGOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const optimizeSVG = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      // Basic simulation of minification/cleaning
      const optimized = input
        .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
        .replace(/>\s+</g, "><")         // Remove spaces between tags
        .trim();
      
      setOutput(optimized);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-[500px] lg:h-[500px]">
          <div className="flex flex-col gap-4 flex-1 h-[300px] lg:h-full">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Raw SVG XML</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-sm text-sky-300 focus:outline-none focus:border-sky-500/50 transition-colors resize-none placeholder:text-slate-800 h-full"
              placeholder='<svg>...</svg>'
            />
          </div>
          <div className="flex flex-col gap-4 flex-1 h-[300px] lg:h-full relative">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Optimized Output</label>
            <div className="flex-1 relative bg-white/2 border border-white/5 rounded-2xl p-4 md:p-6 font-mono text-sm overflow-auto group h-full">
              {isProcessing ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-10 h-10 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest animate-pulse">Calculating Paths...</span>
                 </div>
              ) : (
                 <pre className={output ? "text-slate-200" : "text-slate-800 italic"}>
                   {output || "Output will appear here..."}
                 </pre>
              )}
              {output && !isProcessing && (
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

      <div className="flex items-center justify-center pt-4">
        <button 
          onClick={optimizeSVG}
          disabled={isProcessing}
          className="px-16 py-6 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all shadow-[0_0_40px_rgba(56,189,248,0.3)] text-xs uppercase tracking-[0.3em] disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Initiate Optimization"}
        </button>
      </div>
    </div>
  );
}
