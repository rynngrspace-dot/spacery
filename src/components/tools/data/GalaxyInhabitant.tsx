"use client";

import React, { useState } from "react";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

interface Inhabitant {
  id: string;
  name: string;
  species: string;
  origin: string;
  role: string;
  clearance: string;
}

const SPECIES = ["Humanoid", "Xenomorph", "Cyborg", "Ethereal", "Plasmoid", "Silicate"];
const ORIGINS = ["Terra Nova", "Shadow Realm", "Nebula Cluster 9", "Iron Star System", "Crystal Moons", "Void Station"];
const ROLES = ["Pilot", "Engineer", "Scientist", "Commander", "Medic", "Diplomat"];
const NAMES = ["Zog", "X-12", "Lyra", "Orion", "Vance", "Kael", "Nova", "Astra", "Drax", "Soren"];

export default function GalaxyInhabitant() {
  const [inhabitants, setInhabitants] = useState<Inhabitant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateInhabitants = (count: number = 5) => {
    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 10 : prev));
    }, 50);

    setTimeout(() => {
      const newList: Inhabitant[] = [];
      for (let i = 0; i < count; i++) {
        newList.push({
          id: Math.random().toString(36).substr(2, 6).toUpperCase(),
          name: NAMES[Math.floor(Math.random() * NAMES.length)] + "-" + Math.floor(Math.random() * 100),
          species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
          origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)],
          role: ROLES[Math.floor(Math.random() * ROLES.length)],
          clearance: Math.floor(Math.random() * 10).toString(),
        });
      }
      setInhabitants(newList);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsProcessing(false), 300);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(inhabitants, null, 2));
    alert("Inhabitant records copied to manifest cache.");
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
                Manifesting Beings...
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Galactic Manifest</span>
             {inhabitants.length > 0 && <span className="text-[10px] font-mono text-sky-500 uppercase">{inhabitants.length} Active Records</span>}
          </div>

          <div className="flex-1 space-y-3 overflow-auto">
             {inhabitants.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-slate-800 italic font-mono text-sm">
                   Awaiting organic/synthetic signatures...
                </div>
             ) : (
                inhabitants.map((person) => (
                  <div key={person.id} className="p-4 bg-white/2 border border-white/5 rounded-2xl hover:border-white/10 transition-colors flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center border border-white/10">
                           <span className="text-xs font-mono text-white/50">{person.id.slice(0,2)}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm text-slate-200 font-bold uppercase tracking-wider">{person.name}</span>
                           <span className="text-[9px] font-mono text-slate-600 uppercase">{person.species} • {person.origin}</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">{person.role}</span>
                        <span className="text-[8px] font-mono text-slate-700 uppercase">Clearance Lvl: {person.clearance}</span>
                     </div>
                  </div>
                ))
             )}
          </div>
        </div>

        <ToolOptionsDrawer title="Generator Controls">
           <div className="flex flex-col gap-8">
              <div className="space-y-4">
                 <button
                   onClick={() => generateInhabitants(5)}
                   disabled={isProcessing}
                   className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                 >
                   Sequence 5 Beings
                 </button>

                 <button
                   onClick={() => generateInhabitants(20)}
                   disabled={isProcessing}
                   className="w-full py-5 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(139,92,246,0.2)] disabled:opacity-50"
                 >
                   Sequence 20 Beings
                 </button>

                 {inhabitants.length > 0 && (
                    <button
                      onClick={copyToClipboard}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      Export Record Set
                    </button>
                 )}

                 <button
                    onClick={() => setInhabitants([])}
                    className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Wipe Manifest
                  </button>
              </div>

              <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                 <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Algorithm: RNG-Prime</span>
                 <p className="text-[9px] font-mono text-slate-600 leading-relaxed uppercase tracking-tighter">
                   Synthesizing hypothetical life-form data for population simulation and resource allocation protocols.
                 </p>
              </div>
           </div>
        </ToolOptionsDrawer>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        Galalxy Inhabitant Synthetic Record Generator. Populating the void with simulated intelligence.
      </p>
    </div>
  );
}
