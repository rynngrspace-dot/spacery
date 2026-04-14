"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";
import { downloadBlob } from "@/utils/imaging";

type FilterKey = "grayscale" | "sepia" | "invert" | "blur" | "saturate" | "brightness" | "contrast";

interface FilterDef {
  name: string;
  key: FilterKey;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

const FILTERS: FilterDef[] = [
  { name: "Grayscale",  key: "grayscale",  unit: "%",  min: 0, max: 100, step: 1,   defaultValue: 0   },
  { name: "Sepia",      key: "sepia",      unit: "%",  min: 0, max: 100, step: 1,   defaultValue: 0   },
  { name: "Invert",     key: "invert",     unit: "%",  min: 0, max: 100, step: 1,   defaultValue: 0   },
  { name: "Blur",       key: "blur",       unit: "px", min: 0, max: 20,  step: 0.5, defaultValue: 0   },
  { name: "Saturate",   key: "saturate",   unit: "%",  min: 0, max: 300, step: 1,   defaultValue: 100 },
  { name: "Brightness", key: "brightness", unit: "%",  min: 0, max: 200, step: 1,   defaultValue: 100 },
  { name: "Contrast",   key: "contrast",   unit: "%",  min: 0, max: 200, step: 1,   defaultValue: 100 },
];

const PRESETS = [
  { name: "Raw",         values: { grayscale: 0, sepia: 0, invert: 0, blur: 0, saturate: 100, brightness: 100, contrast: 100 } },
  { name: "Grayscale",   values: { grayscale: 100, sepia: 0, invert: 0, blur: 0, saturate: 100, brightness: 100, contrast: 100 } },
  { name: "Sepia",       values: { grayscale: 0, sepia: 100, invert: 0, blur: 0, saturate: 100, brightness: 100, contrast: 100 } },
  { name: "Astro Bloom", values: { grayscale: 0, sepia: 0, invert: 0, blur: 0, saturate: 150, brightness: 120, contrast: 110 } },
  { name: "Noir",        values: { grayscale: 100, sepia: 0, invert: 0, blur: 0, saturate: 100, brightness: 100, contrast: 140 } },
  { name: "Invert",      values: { grayscale: 0, sepia: 0, invert: 100, blur: 0, saturate: 100, brightness: 100, contrast: 100 } },
];

export default function ImageFilters() {
  const [image, setImage] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("grayscale");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [filterValues, setFilterValues] = useState<Record<FilterKey, number>>({
    grayscale: 0, sepia: 0, invert: 0, blur: 0, saturate: 100, brightness: 100, contrast: 100,
  });

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setResultBlob(null);
  };

  const updateFilter = (key: FilterKey, value: number) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setResultBlob(null);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFilterValues(preset.values);
    setResultBlob(null);
  };

  const resetFilters = () => {
    setFilterValues({ grayscale: 0, sepia: 0, invert: 0, blur: 0, saturate: 100, brightness: 100, contrast: 100 });
    setResultBlob(null);
  };

  const buildFilterString = useCallback(() => {
    return `grayscale(${filterValues.grayscale}%) sepia(${filterValues.sepia}%) invert(${filterValues.invert}%) blur(${filterValues.blur}px) saturate(${filterValues.saturate}%) brightness(${filterValues.brightness}%) contrast(${filterValues.contrast}%)`;
  }, [filterValues]);

  const isModified = Object.entries(filterValues).some(([key, val]) => {
    const def = FILTERS.find(f => f.key === key);
    return def && val !== def.defaultValue;
  });

  const applyAndDownload = async () => {
    if (!image) return;
    setIsProcessing(true);
    setResultBlob(null);

    await new Promise(r => setTimeout(r, 2000));

    try {
      const img = new window.Image();
      img.src = image;
      await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      ctx.filter = buildFilterString();
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject("Blob failed"), "image/webp", 0.95);
      });

      setResultBlob(blob);
    } catch (err) {
      console.error("Filter apply error:", err);
      alert("Filter rendering failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {!image ? (
        <FileUploader accept="image/*" label="Upload Visual Signal" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* Preview Area */}
          <div className="flex-1 w-full bg-black/40 rounded-3xl overflow-hidden border border-white/5 relative group min-h-[300px] md:min-h-[500px]">
             {/* Processing Overlay */}
             {isProcessing && (
               <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
                 <div className="relative w-24 h-24 mb-8">
                   <div className="absolute inset-0 rounded-full border-2 border-sky-500/20"></div>
                   <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 animate-spin"></div>
                   <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-sky-300 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                   <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-white/40 animate-spin" style={{ animationDuration: "2s" }}></div>
                 </div>
                 <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] animate-pulse">
                   Rendering Filter Matrix...
                 </span>
               </div>
             )}

             <Image 
               src={image} 
               alt="Selection Preview" 
               fill
               unoptimized
               className="object-contain transition-all duration-500" 
               style={{ filter: showOriginal ? "none" : buildFilterString() }}
             />

             {/* Top bar */}
             <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-sky-400 uppercase tracking-widest border border-white/10">
                {showOriginal ? "ORIGINAL" : isModified ? "FILTERED" : "RAW"}
             </div>

             <div className="absolute top-4 right-4 flex gap-2">
               {/* Toggle Original */}
               <button 
                 onMouseDown={() => setShowOriginal(true)}
                 onMouseUp={() => setShowOriginal(false)}
                 onMouseLeave={() => setShowOriginal(false)}
                 onTouchStart={() => setShowOriginal(true)}
                 onTouchEnd={() => setShowOriginal(false)}
                 className={`px-4 py-2 backdrop-blur-md rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all ${
                   showOriginal 
                     ? "bg-sky-500/30 text-sky-300 border-sky-400/50" 
                     : "bg-black/60 text-slate-400 border-white/10 hover:text-sky-400 hover:border-sky-500/30"
                 }`}
               >
                 Hold: Original
               </button>

               {/* Close */}
               <button 
                 onClick={() => { setImage(null); resetFilters(); setResultBlob(null); }}
                 className="p-3 bg-black/60 backdrop-blur-md rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/10"
               >
                 ×
               </button>
             </div>
          </div>

          <ToolOptionsDrawer title="Filter Controls">
            {/* Presets */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Quick Presets</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className={`py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest border transition-all ${
                      JSON.stringify(filterValues) === JSON.stringify(p.values)
                        ? "bg-sky-500 text-white border-sky-400"
                        : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Selector + Active Slider */}
            <div className="flex flex-col gap-4 mt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Fine Tuning</span>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSelectedFilter(f.key)}
                    className={`px-3 py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-widest border transition-all text-left flex justify-between items-center ${
                      selectedFilter === f.key
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                        : filterValues[f.key] !== f.defaultValue
                          ? "bg-white/2 text-sky-300 border-white/10"
                          : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>{f.name}</span>
                    <span className="text-[8px] opacity-60">{filterValues[f.key]}{f.unit}</span>
                  </button>
                ))}
              </div>

              {/* Active Filter Slider */}
              {(() => {
                const f = FILTERS.find(fl => fl.key === selectedFilter);
                if (!f) return null;
                return (
                  <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">{f.name}</span>
                      <span className="text-sm font-mono text-sky-400 font-bold">{filterValues[f.key]}{f.unit}</span>
                    </div>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={filterValues[f.key]}
                      onChange={(e) => updateFilter(f.key, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-600">
                      <span>{f.min}{f.unit}</span>
                      <span>{f.max}{f.unit}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={applyAndDownload}
                disabled={isProcessing || !isModified}
                className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
              >
                {isProcessing ? "Rendering..." : "Apply & Prepare Download"}
              </button>

              {resultBlob && (
                <button
                  onClick={() => downloadBlob(resultBlob, `spacery_filtered_${Date.now()}.webp`)}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                >
                  ↓ Download Filtered Image
                </button>
              )}

              <button
                onClick={resetFilters}
                className="py-3 text-[10px] font-mono text-slate-600 hover:text-sky-400 uppercase tracking-widest transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </ToolOptionsDrawer>

        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
