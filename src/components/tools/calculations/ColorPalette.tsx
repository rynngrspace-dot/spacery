"use client";

import React, { useState } from "react";

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#0ea5e9");

  const generatePalette = () => {
    // Simulated palette generation for the demo
    return [
      baseColor,
      adjustColor(baseColor, 20),
      adjustColor(baseColor, 40),
      adjustColor(baseColor, -20),
      adjustColor(baseColor, -40),
    ];
  };

  const adjustColor = (hex: string, amt: number) => {
    let usePound = false;
    if (hex[0] === "#") {
      hex = hex.slice(1);
      usePound = true;
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  };

  const palette = generatePalette();

  return (
    <div className="flex flex-col gap-8 md:gap-12 py-6 md:py-10 items-center">
      
      <div className="flex flex-col items-center gap-6">
         <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Base Spectral Frequency</label>
         <div className="flex items-center gap-6">
            <input 
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-16 rounded-full overflow-hidden bg-transparent border-none cursor-pointer p-0"
            />
            <span className="font-mono text-2xl text-white uppercase">{baseColor}</span>
         </div>
      </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {palette.map((color, i) => (
            <div 
              key={i} 
              className="group flex flex-col gap-3 p-3 md:p-4 bg-white/2 border border-white/5 rounded-2xl hover:border-sky-500/30 transition-all duration-500"
            >
              <div 
                className="w-full aspect-square rounded-xl shadow-inner relative overflow-hidden"
                style={{ backgroundColor: color }}
              >
                 <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent"></div>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Hex Code</span>
                 <button 
                  onClick={() => navigator.clipboard.writeText(color)}
                  className="text-xs font-mono text-slate-200 hover:text-sky-400 transition-colors text-left truncate"
                 >
                   {color}
                 </button>
              </div>
            </div>
          ))}
        </div>

      <div className="mt-8 text-center">
         <p className="text-slate-500 text-xs italic">
           Colors extracted from the visible star spectrum. Click a hex to copy the signal.
         </p>
      </div>

    </div>
  );
}
