"use client";

import React, { useState, useRef } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";

export default function ColorExtractor() {
  const [colors, setColors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColors = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorCounts: { [key: string]: number } = {};
        
        // Sample every 20th pixel to save power
        for (let i = 0; i < data.length; i += 80) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(entry => entry[0]);

        setColors(sortedColors);
        setIsProcessing(false);
        setImagePreview(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-10">
      
      {!imagePreview ? (
        <FileUploader 
          accept="image/*" 
          label="Target Asset for Analysis" 
          onFileSelect={extractColors} 
        />
      ) : (
        <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full max-w-sm aspect-square relative rounded-2xl overflow-hidden border border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <ToolOptionsDrawer title="Color Analysis">
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10">
                       <span className="block text-[8px] font-mono text-sky-400/60 uppercase mb-2">Color Statistics</span>
                       <div className="flex flex-col gap-2 font-mono text-[10px] text-slate-500">
                          <span>Detected: {colors.length} unique colors</span>
                          <span>Ready for export</span>
                       </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        onClick={() => { setImagePreview(null); setColors([]); }}
                        className="py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors text-center"
                      >
                        Clear Image
                      </button>
                    </div>
                  </div>
                </ToolOptionsDrawer>
            </div>

            <div className="flex-1 w-full space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Extracted Color Data</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Ordered by frequency intensity</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {colors.map((color, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 bg-white/2 border border-white/5 rounded-xl group transition-all hover:border-sky-500/30">
                       <div className="w-full h-10 rounded-lg shadow-inner" style={{ backgroundColor: color }}></div>
                       <button 
                         onClick={() => navigator.clipboard.writeText(color)}
                         className="font-mono text-[10px] text-slate-400 hover:text-sky-400 transition-colors text-left uppercase"
                       >
                         {color}
                       </button>
                    </div>
                  ))}
                </div>
            </div>
        </div>
      )}

      {isProcessing && (
        <div className="py-10 text-center flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">Scanning Visual Grid...</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-md mx-auto leading-relaxed">
        Natively analyzing pixel frequencies in the local browser environment. Private by default.
      </p>
    </div>
  );
}
