"use client";

import React, { useState, useEffect } from "react";

export default function RegExTester() {
  const [pattern, setPattern] = useState("[0-9]+");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("The signal 123 was received at 0400 hours.");
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setError(null);
      if (!pattern) {
        setMatches([]);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const allMatches = Array.from(testText.matchAll(regex));
      setMatches(allMatches);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [pattern, flags, testText]);

  const renderHighlightedText = () => {
    if (error || !pattern || matches.length === 0) return testText;

    try {
      const regex = new RegExp(pattern, flags);
      const fragments: React.ReactNode[] = [];
      let lastIndex = 0;

      // Only highlight if global or if we handle non-global carefully
      const matchesToUse = flags.includes('g') ? matches : matches.slice(0, 1);

      matchesToUse.forEach((match, i) => {
        const index = match.index!;
        const text = match[0];

        // Add plain text before match
        fragments.push(testText.slice(lastIndex, index));
        
        // Add highlighted match
        fragments.push(
          <span key={i} className="bg-sky-500/30 border-b-2 border-sky-400 text-sky-200 px-0.5 rounded-sm group relative">
            {text}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sky-600 text-[8px] font-mono p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Match {i + 1}
            </span>
          </span>
        );
        
        lastIndex = index + text.length;
      });

      // Add remaining text
      fragments.push(testText.slice(lastIndex));
      return fragments;
    } catch {
      return testText;
    }
  };

  return (
    <div className="flex flex-col gap-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Pattern Configuration */}
        <div className="flex flex-col gap-8">
           <div className="flex flex-col gap-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Regex Pattern</label>
              <div className="flex gap-2 p-2 bg-black/40 border border-white/10 rounded-2xl items-center">
                 <span className="pl-4 font-mono text-slate-600 text-xl">/</span>
                 <input 
                   value={pattern}
                   onChange={(e) => setPattern(e.target.value)}
                   placeholder="[a-z]+"
                   className="flex-1 bg-transparent border-none p-4 font-mono text-lg text-sky-400 focus:outline-none placeholder:text-slate-800"
                 />
                 <span className="font-mono text-slate-600 text-xl">/</span>
                 <input 
                   value={flags}
                   onChange={(e) => setFlags(e.target.value)}
                   placeholder="g"
                   className="w-16 bg-white/5 border border-white/10 rounded-xl p-3 font-mono text-sm text-purple-400 focus:outline-none text-center"
                 />
              </div>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                   <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                      Syntax Error: {error}
                   </p>
                </div>
              )}
           </div>

           <div className="flex flex-col gap-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Test Text</label>
              <textarea 
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all min-h-[200px] resize-none"
              />
           </div>
        </div>

        {/* Results Area */}
        <div className="flex flex-col gap-4 h-full">
           <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Regex Results</label>
              <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">{matches.length} Matches Found</span>
           </div>
           
           <div className="flex-1 w-full bg-white/2 border border-white/5 rounded-2xl p-8 font-mono text-sm leading-relaxed overflow-auto min-h-[400px]">
              {renderHighlightedText()}
           </div>
           
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center">
                 <span className="text-[8px] font-mono text-slate-500 uppercase mb-1">Status</span>
                 <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">{error ? "ERROR" : "READY"}</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center">
                 <span className="text-[8px] font-mono text-slate-500 uppercase mb-1">Engine</span>
                 <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest text-center">Standard JS</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center">
                 <span className="text-[8px] font-mono text-slate-500 uppercase mb-1">Performance</span>
                 <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">Optimal</span>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-4 text-center">
         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
            Fast regex testing powered by native JavaScript.
         </p>
      </div>

    </div>
  );
}
