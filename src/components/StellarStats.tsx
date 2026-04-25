"use client";

import { useState, useEffect } from "react";

const stats = [
  { label: "Data Fragments Processed", value: 1240, suffix: "TB", color: "text-sky-400" },
  { label: "Molecular Conversions", value: 89, suffix: "k", color: "text-purple-400" },
  { label: "Photons Captured", value: 99.9, suffix: "%", color: "text-emerald-400" },
];

export default function StellarStats() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounts(stats.map(s => s.value));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
      {stats.map((stat, i) => (
        <div key={i} className="p-8 rounded-[32px] bg-white/2 border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all duration-500">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold font-mono tracking-tighter ${stat.color}`}>
                {counts[i].toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-500">{stat.suffix}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">{stat.label}</span>
          </div>
          
          <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-1000 ease-out ${stat.color.replace('text', 'bg')}`}
               style={{ width: counts[i] > 0 ? '100%' : '0%' }}
             ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
