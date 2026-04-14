"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";
import { resizeImage, downloadBlob } from "@/utils/imaging";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  // Capture original dimensions on upload
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);
      
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && originalRatio) {
      setHeight(Math.round(val / originalRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && originalRatio) {
      setWidth(Math.round(val * originalRatio));
    }
  };

  const executeResize = async () => {
    if (!file || !width || !height) return;
    setIsProcessing(true);
    setResultBlob(null);
    try {
      const blob = await resizeImage(file, width, height);
      setResultBlob(blob);
    } catch (err) {
      console.error("Resizing error:", err);
      alert("Calibration failed during image reconstruction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {!file ? (
        <FileUploader accept="image/*" label="Upload Visual Signal" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 min-h-[400px] relative group">
             {preview && (
               <Image 
                 src={preview} 
                 alt="Selection Preview" 
                 width={800}
                 height={600}
                 unoptimized
                 className="max-w-full max-h-[450px] rounded-xl shadow-2xl object-contain transition-transform duration-700 group-hover:scale-[1.02]" 
               />
             )}
             <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-sky-400 uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                Original Module: {originalRatio.toFixed(2)} AR
             </div>
          </div>

          <ToolOptionsDrawer title="Resizing Parameters">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target Resolution</span>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-slate-600 uppercase">Width (px)</span>
                      <input 
                        type="number" value={width} onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                        className="bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50"
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-slate-600 uppercase">Height (px)</span>
                      <input 
                        type="number" value={height} onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                        className="bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50"
                      />
                   </div>
                </div>
             </div>

             <label className="flex items-center gap-4 cursor-pointer group p-4 bg-white/2 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all">
                <input 
                  type="checkbox" checked={maintainAspect} onChange={() => setMaintainAspect(!maintainAspect)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-sky-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest group-hover:text-slate-200">Preserve Aspect Ratio</span>
             </label>

             <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={executeResize}
                  disabled={isProcessing}
                  className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                >
                  {isProcessing ? "Reconstructing..." : "Execute Resizing"}
                </button>

                {resultBlob && (
                  <button 
                    onClick={() => downloadBlob(resultBlob, `spacery_resized_${file.name.split('.')[0]}.webp`)}
                    className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                  >
                    ↓ Download Resized File
                  </button>
                )}

                <button 
                  onClick={() => { setFile(null); setPreview(null); setResultBlob(null); }} 
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
