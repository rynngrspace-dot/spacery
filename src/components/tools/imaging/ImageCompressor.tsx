"use client";

import React, { useState } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";

export default function ImageCompressor() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const startCompression = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, we'd use canvas to compress here
      alert("Signal Compressed! In a production environment, the download would initiate now.");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10">
      {!image ? (
        <FileUploader accept="image/*" label="Upload Visual Signal" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          <div className="p-6 md:p-8 bg-white/2 border border-white/5 rounded-[32px] flex flex-col gap-6 md:gap-8 flex-1">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Compression Density</span>
                <span className="text-sm font-mono text-sky-400">{quality}%</span>
             </div>
             
             <input 
               type="range" min="1" max="100" value={quality} 
               onChange={(e) => setQuality(parseInt(e.target.value))}
               className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500"
             />
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <span className="block text-[8px] font-mono text-slate-600 uppercase mb-1">Original</span>
                   <span className="text-xs font-mono text-slate-400">{(image.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <span className="block text-[8px] font-mono text-slate-600 uppercase mb-1">Projected</span>
                   <span className="text-xs font-mono text-sky-400">{((image.size / 1024) * (quality / 100)).toFixed(1)} KB</span>
                </div>
             </div>

             <div className="flex flex-col gap-3 mt-auto">
               <button 
                onClick={startCompression}
                disabled={isProcessing}
                className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
               >
                 {isProcessing ? "Processing..." : "Execute Compression"}
               </button>
               <button onClick={() => setImage(null)} className="py-2 text-[9px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors">
                  Purge Source
               </button>
             </div>
          </div>

          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 min-h-[300px] flex items-center justify-center p-6 md:p-8 relative group overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={previewUrl || ""} alt="Preview" className="max-w-full max-h-[400px] rounded-lg shadow-2xl transition-all duration-500" />
             <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-sky-400 uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                SIGNAL_PREVIEW
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
