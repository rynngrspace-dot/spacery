"use client";

import React, { useState } from "react";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function CSVToJSON() {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const convertCSV = () => {
    setIsProcessing(true);
    setProgress(0);
    setErrorMsg("");

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 20 : prev));
    }, 100);

    setTimeout(() => {
      try {
        if (!csvInput.trim()) throw new Error("Awaiting CSV stream input.");
        
        const lines = csvInput.trim().split("\n");
        if (lines.length < 2) throw new Error("Insufficient data points. Header and data row required.");
        
        const headers = lines[0].split(",").map(h => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
          const obj: any = {};
          const currentLine = lines[i].split(",");
          
          if (currentLine.length !== headers.length) continue; // Basic skip for bad data

          headers.forEach((header, index) => {
            obj[header] = currentLine[index]?.trim();
          });
          result.push(obj);
        }

        setJsonOutput(JSON.stringify(result, null, 2));
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setIsProcessing(false), 300);
      }
    }, 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert("JSON Matrix copied to local storage.");
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
                Transcoding CSV Stream...
              </span>
            </div>
          )}

          <div className="grid grid-rows-2 flex-1 gap-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">CSV Raw Input</span>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="ID,Name,Type\n101,S-X,Satellite\n..."
                  className="flex-1 bg-white/2 border border-white/5 rounded-2xl p-6 font-mono text-xs text-sky-300/80 focus:outline-none focus:border-sky-500/30 transition-colors resize-none placeholder:text-slate-800"
                />
             </div>
             
             <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">JSON Output</span>
                  {jsonOutput && <span className="text-[10px] font-mono text-emerald-500 uppercase">Conversion Finalized</span>}
                </div>
                <div className="flex-1 bg-black/20 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-400 overflow-auto whitespace-pre">
                   {jsonOutput || <span className="italic text-slate-700">Awaiting transcode...</span>}
                </div>
             </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
               <span className="block text-[8px] font-mono text-red-500 uppercase mb-1 underline">Transcode Failure</span>
               <p className="text-[10px] font-mono text-red-400/80 uppercase tracking-tighter leading-tight">{errorMsg}</p>
            </div>
          )}
        </div>

        <ToolOptionsDrawer title="Transcode Commands">
           <div className="flex flex-col gap-8">
              <div className="space-y-4">
                 <button
                   onClick={convertCSV}
                   disabled={!csvInput.trim() || isProcessing}
                   className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                 >
                   Transcode to JSON
                 </button>

                 {jsonOutput && (
                    <button
                      onClick={copyToClipboard}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      Retrieve JSON Matrix
                    </button>
                 )}

                 <button
                    onClick={() => { setCsvInput(""); setJsonOutput(""); setErrorMsg(""); }}
                    className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Purge Stream
                  </button>
              </div>

              <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                 <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Transcode Logic</span>
                 <p className="text-[9px] font-mono text-slate-600 leading-relaxed uppercase tracking-tighter">
                   Extracts header fragments and maps row data to correlated object nodes. Supports standard comma-delimited signals.
                 </p>
              </div>
           </div>
        </ToolOptionsDrawer>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        Autonomous CSV-to-JSON transcoding. Standardizing data structures for galactic integration.
      </p>
    </div>
  );
}
