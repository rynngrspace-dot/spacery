"use client";

import React, { useState } from "react";

export default function RandomChoiceMaker() {
  const [options, setOptions] = useState<string[]>(["Pizza", "Sushi", "Burgers"]);
  const [newOption, setNewOption] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handlePickRandom = () => {
    if (options.length < 2) return;
    
    setIsSpinning(true);
    setSelectedOption(null);

    // Simulate "thinking" or "spinning"
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setSelectedOption(options[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        
        {/* Input & List Section */}
        <div className="flex flex-col gap-8">
           <form onSubmit={handleAddOption} className="flex gap-3">
              <input 
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add a choice..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-4 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all"
              />
              <button 
                type="submit"
                className="px-6 py-4 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-400 transition-all text-xs uppercase tracking-widest"
              >
                Add
              </button>
           </form>

           <div className="flex flex-col gap-3">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Your Options ({options.length})</label>
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-auto p-2">
                 {options.map((opt, i) => (
                   <div key={i} className="group flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs text-slate-300 hover:border-sky-500/30 transition-all">
                      <span>{opt}</span>
                      <button 
                        onClick={() => removeOption(i)} 
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                   </div>
                 ))}
                 {options.length === 0 && (
                   <span className="text-xs text-slate-600 italic px-2">Add at least two options to begin...</span>
                 )}
              </div>
           </div>

           <button 
             onClick={handlePickRandom}
             disabled={options.length < 2 || isSpinning}
             className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.3em] hover:bg-sky-500/20 hover:border-sky-500/40 transition-all disabled:opacity-20"
           >
             Pick Random Choice
           </button>
        </div>

        {/* Animation & Result Area */}
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-sky-500/5 rounded-[40px] border border-sky-500/10 p-10 relative overflow-hidden">
           
           {isSpinning && (
             <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                   <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-transparent border-t-sky-400 rounded-full animate-spin"></div>
                   <div className="absolute inset-4 border-2 border-transparent border-t-purple-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                </div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.4em] animate-pulse">Consulting Fate...</span>
             </div>
           )}

           {!isSpinning && selectedOption && (
             <div className="flex flex-col items-center gap-6 animate-[scaleIn_0.5s_ease-out_forwards]">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Recommended Selection</span>
                <h3 className="text-4xl md:text-5xl font-bold text-white text-center leading-tight">
                   {selectedOption}
                </h3>
                <div className="mt-4 px-6 py-2 bg-sky-500 text-white font-mono text-[9px] uppercase tracking-[0.3em] rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                   Confirmed
                </div>
             </div>
           )}

           {!isSpinning && !selectedOption && (
             <div className="text-center opacity-20">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Decision Module Ready</p>
             </div>
           )}
        </div>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        High-precision random selection powered by cryptographically neutral algorithms.
      </p>
    </div>
  );
}
