"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGen() {
  const [value, setValue] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "spacery-qr-uplink.png";
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col gap-10 md:gap-12 items-center">
      
      {/* Input Module */}
      <div className="w-full max-w-xl flex flex-col gap-6">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Data Signal to Encode</label>
        <textarea 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter URL or text to beam..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-6 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all min-h-[120px] resize-none"
        />
      </div>

      {/* Visualizer */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-sky-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
        <div className="relative p-8 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
           <QRCodeCanvas 
             ref={canvasRef}
             value={value || "https://spacery.io"} 
             size={200}
             level="H"
             includeMargin={false}
             imageSettings={{
                src: "/favicon.ico",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
             }}
           />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button 
          onClick={downloadQR}
          disabled={!value}
          className="px-8 py-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed group flex items-center gap-3"
        >
          <span>Download Artifact</span>
          <span className="group-hover:translate-y-1 transition-transform">↓</span>
        </button>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm leading-relaxed">
        High-fidelity visual encoding optimized for terrestrial scanners.
      </p>

    </div>
  );
}
