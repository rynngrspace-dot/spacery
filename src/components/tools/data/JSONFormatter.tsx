"use client";

import React, { useState } from "react";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function JSONValidator() {
  const [jsonInput, setJsonInput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateAndFormat = () => {
    setIsProcessing(true);
    setProgress(0);
    setIsValid(null);
    setErrorMsg("");

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 25 : prev));
    }, 100);

    setTimeout(() => {
      try {
        if (!jsonInput.trim()) throw new Error("Empty manifest data.");
        const parsed = JSON.parse(jsonInput);
        const formatted = JSON.stringify(parsed, null, 2);
        setJsonInput(formatted);
        setIsValid(true);
      } catch (err: any) {
        setIsValid(false);
        setErrorMsg(err.message || "Invalid JSON syntax detected.");
      } finally {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setIsProcessing(false), 300);
      }
    }, 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput);
    alert("Manifest copied to local storage.");
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
        <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 min-h-[500px] relative overflow-hidden flex flex-col">
          {isProcessing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-sky-500/20"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-mono text-sky-400 font-bold">{progress}%</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] animate-pulse">
                Parsing Data Matrix...
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Raw Data Stream</span>
             {isValid === true && (
                <span className="text-[10px] font-mono text-emerald-500 uppercase flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   Syntax Verified
                </span>
             )}
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => { setJsonInput(e.target.value); setIsValid(null); }}
            placeholder='Paste your JSON matrix here... { "key": "value" }'
            className="flex-1 bg-white/2 border border-white/5 rounded-2xl p-6 font-mono text-xs text-sky-300/80 focus:outline-none focus:border-sky-500/30 transition-colors resize-none placeholder:text-slate-800"
          />

          {isValid === false && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
               <span className="block text-[8px] font-mono text-red-500 uppercase mb-1 underline">Protocol Violation: Invalid Syntax</span>
               <p className="text-[10px] font-mono text-red-400/80 uppercase tracking-tighter leading-tight">{errorMsg}</p>
            </div>
          )}
        </div>

        <ToolOptionsDrawer title="Matrix Commands">
           <div className="flex flex-col gap-8">
              <div className="space-y-4">
                 <button
                   onClick={validateAndFormat}
                   disabled={!jsonInput.trim() || isProcessing}
                   className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                 >
                   Verify & Format
                 </button>

                 {isValid === true && (
                    <button
                      onClick={copyToClipboard}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      Retrieve Formatted Matrix
                    </button>
                 )}

                 <button
                    onClick={() => { setJsonInput(""); setIsValid(null); }}
                    className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Clear Stream
                  </button>
              </div>

              <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                 <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Protocol Specs</span>
                 <ul className="space-y-2">
                    <li className="text-[9px] font-mono text-slate-600 uppercase flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                       RFC 8259 Compliant
                    </li>
                    <li className="text-[9px] font-mono text-slate-600 uppercase flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                       Structural Prettification
                    </li>
                 </ul>
              </div>
           </div>
        </ToolOptionsDrawer>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        High-precision data matrix validation. Certified for intergalactic communication protocols.
      </p>
    </div>
  );
}
