"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function UnderConstruction() {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6 py-12 relative overflow-hidden rounded-[32px] bg-[#060b19]/40 border border-white/5 backdrop-blur-xl">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="w-20 h-20 mb-8 relative">
          <div className="absolute inset-0 border-2 border-sky-500/20 rounded-2xl rotate-45 animate-[pulse_3s_infinite]"></div>
          <div className="absolute inset-0 border-2 border-sky-500/40 rounded-2xl -rotate-45 animate-[pulse_4s_infinite]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-3xl animate-bounce">🚧</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-[0.2em] mb-4">
          Station Under Maintenance
        </h2>
        
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-relaxed mb-10">
          The temporal stream for this module is currently undergoing critical synchronization. 
          The laboratory core has restricted access to preserve structural integrity.
        </p>

        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.2em] font-bold">Status: Temporal Syncing</span>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/10 rounded-tl-lg"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/10 rounded-br-lg"></div>
    </div>
  );
}
