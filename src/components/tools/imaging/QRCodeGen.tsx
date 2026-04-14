"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGen() {
  const [inputValue, setInputValue] = useState("");
  const [encodedValue, setEncodedValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = () => {
    if (!inputValue.trim()) return;
    setIsGenerating(true);
    setIsGenerated(false);
    
    // 2-second temporal synthesis simulation
    setTimeout(() => {
      setEncodedValue(inputValue);
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const downloadBrandedTemplate = () => {
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) return;

    // Create a high-res template canvas (1000x1200)
    const template = document.createElement("canvas");
    template.width = 800;
    template.height = 1000;
    const ctx = template.getContext("2d");
    if (!ctx) return;

    // 1. Draw Deep Space Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, template.height);
    bgGradient.addColorStop(0, "#060b19");
    bgGradient.addColorStop(1, "#010205");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, template.width, template.height);

    // 2. Add Star Field
    ctx.fillStyle = "white";
    for (let i = 0; i < 150; i++) {
      ctx.globalAlpha = Math.random();
      ctx.beginPath();
      ctx.arc(Math.random() * template.width, Math.random() * template.height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Lab Branding Header
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("SPACERY LABORATORY", template.width / 2, 80);
    
    ctx.fillStyle = "#38bdf8";
    ctx.font = "14px monospace";
    ctx.fillText("SECURE UPLINK SIGNAL // REF_" + Math.random().toString(36).substring(7).toUpperCase(), template.width / 2, 110);

    // 4. QR Frame and Shadow
    const qrSize = 400;
    const x = (template.width - qrSize) / 2;
    const y = (template.height - qrSize) / 2;

    ctx.shadowColor = "rgba(56, 189, 248, 0.4)";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "white";
    ctx.fillRect(x - 20, y - 20, qrSize + 40, qrSize + 40);
    ctx.shadowBlur = 0;

    // 5. Draw QR Code
    ctx.drawImage(qrCanvas, x, y, qrSize, qrSize);

    // 6. Metadata Footer
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "12px monospace";
    ctx.fillText("UPLINK SOURCE: " + (inputValue.length > 40 ? inputValue.substring(0, 40) + "..." : inputValue), template.width / 2, y + qrSize + 80);
    ctx.fillText("ORIGIN: SPACERY_ORBITAL_HUB // TIMESTAMP: " + new Date().toISOString(), template.width / 2, y + qrSize + 110);

    // 7. Trigger Download
    const url = template.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `spacery-artifact-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col gap-10 md:gap-12 items-center">
      
      {/* Input Module */}
      <div className="w-full max-w-xl flex flex-col gap-6">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Data Signal to Encode</label>
        <textarea 
          value={inputValue}
          onChange={(e) => {
             setInputValue(e.target.value);
             setIsGenerated(false); // Reset if changed
          }}
          placeholder="Enter URL or text to beam..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-6 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all min-h-[120px] resize-none"
        />
        
        {!isGenerated && !isGenerating && (
          <button 
            onClick={handleGenerate}
            disabled={!inputValue.trim()}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-sky-500/20 hover:border-sky-500/40 transition-all disabled:opacity-20"
          >
            Start Signal Synthesis
          </button>
        )}
      </div>

      {/* Visualizer & Animation Area */}
      <div className="relative min-h-[350px] flex items-center justify-center w-full">
        
        {/* Holographic Generating Animation */}
        {isGenerating && (
          <div className="flex flex-col items-center gap-6 animate-pulse">
             <div className="relative w-48 h-48">
                <div className="absolute inset-0 border-2 border-sky-500/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-4 border border-sky-500/20 rounded-full animate-[spin_2s_linear_reverse_infinite]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(56,189,248,1)]"></div>
                </div>
                {/* Scanning line */}
                <div className="absolute top-0 left-0 w-full h-px bg-sky-500/60 shadow-[0_0_10px_rgba(56,189,248,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
             </div>
             <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.4em] animate-pulse">Synthesizing Signal Grid...</span>
          </div>
        )}

        {/* The Final QR Result */}
        {isGenerated && !isGenerating && (
          <div className="flex flex-col items-center gap-10 md:gap-12 animate-[scaleIn_0.5s_ease-out_forwards]">
            <div className="relative group">
              <div className="absolute -inset-1 bg-sky-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative p-8 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
                 <QRCodeCanvas 
                   ref={canvasRef}
                   value={encodedValue} 
                   size={256}
                   level="H"
                   includeMargin={true}
                   imageSettings={{
                      src: "/favicon.ico",
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                   }}
                 />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={downloadBrandedTemplate}
                className="px-8 py-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] text-[10px] uppercase tracking-widest group flex items-center gap-3"
              >
                <span>Download Branded Artifact</span>
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGenerated && !isGenerating && (
           <div className="text-center opacity-30">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Module Standing By</p>
           </div>
        )}
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm leading-relaxed px-4">
        High-fidelity visual encoding optimized for terrestrial scanners. Certified by Spacery Lab.
      </p>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          50% { top: 100%; opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </div>
  );
}
