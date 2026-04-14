"use client";

import React, { useState } from "react";

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#0ea5e9");

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalettes = (hex: string) => {
    const { h, s, l } = hexToHsl(hex);
    
    return {
      monochromatic: [
        hslToHex(h, s, Math.max(0, l - 30)),
        hslToHex(h, s, Math.max(0, l - 15)),
        hex,
        hslToHex(h, s, Math.min(100, l + 15)),
        hslToHex(h, s, Math.min(100, l + 30)),
      ],
      complementary: [
        hex,
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 180) % 360, s - 10, l + 10),
        hslToHex(h, s - 10, l + 10),
        hslToHex((h + 180) % 360, s - 20, l - 10),
      ],
      triadic: [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
        hslToHex((h + 120) % 360, s - 10, l + 10),
        hslToHex((h + 240) % 360, s - 10, l + 10),
      ],
      analogous: [
        hslToHex((h - 30 + 360) % 360, s, l),
        hslToHex((h - 15 + 360) % 360, s, l),
        hex,
        hslToHex((h + 15) % 360, s, l),
        hslToHex((h + 30) % 360, s, l),
      ]
    };
  };

  const [activePalette, setActivePalette] = useState<keyof ReturnType<typeof generatePalettes>>("monochromatic");
  const palettes = generatePalettes(baseColor);

  const generateRandom = () => {
    const randomHex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

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

        <div className="flex flex-wrap justify-center gap-3 mb-8">
           {(["monochromatic", "complementary", "triadic", "analogous"] as const).map(type => (
              <button 
                key={type}
                onClick={() => setActivePalette(type)}
                className={`px-4 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest border transition-all ${activePalette === type ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"}`}
              >
                {type}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {palettes[activePalette].map((color, i) => (
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

        <div className="mt-12 flex justify-center">
           <button 
             onClick={generateRandom}
             className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-mono uppercase tracking-[0.3em] hover:bg-white/10 hover:border-sky-500/50 transition-all flex items-center gap-4 group"
           >
              <span className="group-hover:rotate-180 transition-transform duration-700">🔄</span>
              Simulate Random Signal
           </button>
        </div>

      <div className="mt-8 text-center">
         <p className="text-slate-500 text-xs italic">
           Colors extracted from the visible star spectrum. Click a hex to copy the signal.
         </p>
      </div>

    </div>
  );
}
