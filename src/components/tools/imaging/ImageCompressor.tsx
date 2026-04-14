"use client";

import React, { useState } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";
import imageCompression from "browser-image-compression";
import { downloadBlob } from "@/utils/imaging";

export default function ImageCompressor() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [reductionPercent, setReductionPercent] = useState<number | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const handleFileSelect = (file: File) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCompressedSize(null);
    setReductionPercent(null);
    setCompressedBlob(null);
    setProgress(0);
  };

  const startCompression = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    
    const options = {
      maxSizeMB: image.size / 1024 / 1024 * (quality / 100),
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality / 100,
      onProgress: (p: number) => setProgress(p),
    };

    try {
      const compressedFile = await imageCompression(image, options);
      const newSize = compressedFile.size;
      setCompressedSize(newSize);
      setReductionPercent(Math.round((1 - newSize / image.size) * 100));
      setCompressedBlob(compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
      alert("Signal compression failed. Data integrity compromised.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col gap-10">
      {!image ? (
        <FileUploader accept="image/*" label="Upload Visual Signal" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          {/* Preview Area */}
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 min-h-[300px] flex items-center justify-center p-6 md:p-8 relative group overflow-hidden">
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
                {/* Orbital spinner */}
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-sky-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-sky-300 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                  <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-white/40 animate-spin" style={{ animationDuration: "2s" }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-mono text-sky-400 font-bold">{progress}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-300 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] animate-pulse">
                  Compacting Signal Data...
                </span>
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl || ""} alt="Preview" className="max-w-full max-h-[450px] rounded-xl shadow-2xl transition-all duration-500" />
            <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-sky-400 uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               SIGNAL_ANALYSIS: {formatSize(image.size)}
            </div>
          </div>

          <ToolOptionsDrawer title="Compression Matrix">
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Intensity Threshold</span>
                   <span className="text-sm font-mono text-sky-400">{quality}%</span>
                </div>
                
                <input 
                  type="range" min="1" max="100" value={quality} 
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500"
                />
                
                {/* Size comparison cards */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <span className="block text-[8px] font-mono text-slate-600 uppercase mb-1">Source Mass</span>
                      <span className="text-xs font-mono text-slate-400">{formatSize(image.size)}</span>
                   </div>
                   <div className={`p-4 rounded-xl border transition-all duration-500 ${
                     compressedSize 
                       ? "bg-emerald-500/5 border-emerald-500/20" 
                       : "bg-white/2 border-white/5"
                   }`}>
                      <span className={`block text-[8px] font-mono uppercase mb-1 ${
                        compressedSize ? "text-emerald-400" : "text-slate-600"
                      }`}>
                        {compressedSize ? "Compressed" : "Projected"}
                      </span>
                      <span className={`text-xs font-mono ${compressedSize ? "text-emerald-400" : "text-sky-400"}`}>
                        {compressedSize 
                          ? formatSize(compressedSize) 
                          : formatSize(image.size * (quality / 100))
                        }
                      </span>
                   </div>
                </div>

                {/* Result banner */}
                {compressedSize && reductionPercent !== null && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold font-mono text-emerald-400">↓</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                        Signal Reduced by {reductionPercent}%
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 mt-1">
                        {formatSize(image.size)} → {formatSize(compressedSize)}
                      </span>
                    </div>
                  </div>
                )}
             </div>

             <div className="flex flex-col gap-3 pt-4">
               <button 
                onClick={startCompression}
                disabled={isProcessing}
                className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
               >
                 {isProcessing ? "Compressing Signal..." : "Execute Compression"}
               </button>

               {compressedBlob && (
                 <button 
                  onClick={() => downloadBlob(compressedBlob, `spacery_compressed_${image.name}`)}
                  className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                 >
                   ↓ Download Compressed File
                 </button>
               )}

               <button 
                onClick={() => { setImage(null); setPreviewUrl(null); setCompressedSize(null); setReductionPercent(null); setCompressedBlob(null); }} 
                className="py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
               >
                  Eject Source
               </button>
             </div>
          </ToolOptionsDrawer>
        </div>
      )}
    </div>
  );
}
