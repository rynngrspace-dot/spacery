"use client";

import React, { useState } from "react";

export default function GlassmorphismGen() {
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(0.1);
  const [saturation, setSaturation] = useState(150);
  const [border, setBorder] = useState(10);

  const cssCode = `background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(255, 255, 255, ${border / 100});
border-radius: 16px;`;

  return (
    <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-start">
      
      {/* Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Blur Depth</span>
              <span className="text-sky-400">{blur}px</span>
            </div>
            <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Opalescence (%)</span>
              <span className="text-sky-400">{(opacity * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Saturation Boost</span>
              <span className="text-sky-400">{saturation}%</span>
            </div>
            <input type="range" min="0" max="300" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Core Border Line</span>
              <span className="text-sky-400">{border}%</span>
            </div>
            <input type="range" min="0" max="100" value={border} onChange={(e) => setBorder(Number(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-slate-400 leading-relaxed overflow-x-auto">
          <pre className="text-sky-300">{cssCode}</pre>
          <button 
            onClick={() => navigator.clipboard.writeText(cssCode)}
            className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            Copy Artifact Snippet
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 w-full min-h-[400px] rounded-[32px] bg-linear-to-br from-indigo-900 via-slate-900 to-black relative overflow-hidden flex items-center justify-center p-8 border border-white/5">
         {/* Animated BG elements */}
         <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-[60px] animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-sky-500/30 rounded-full blur-[80px] animate-[pulse_4s_infinite]"></div>
         
         {/* The Glass Component */}
         <div 
           style={{
             background: `rgba(255, 255, 255, ${opacity})`,
             backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
             WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
             border: `1px solid rgba(255, 255, 255, ${border / 100})`,
           }}
           className="w-full max-w-sm aspect-video rounded-3xl p-8 flex flex-col justify-between relative group overflow-hidden"
         >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Nebula UI Pre-Alpha</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">Frosted Fragment</h3>
            </div>
            
            <div className="h-px w-full bg-white/10"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/60">SEC_LEVEL_H</span>
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 backdrop-blur-md"></div>
            </div>

            {/* Reflection lines */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
         </div>
      </div>

    </div>
  );
}
