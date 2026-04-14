"use client";

import React, { useState } from "react";
import Image from "next/image";
import FileUploader from "@/components/tools/shared/FileUploader";

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [maintainAspect, setMaintainAspect] = useState(true);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-10">
      {!image ? (
        <FileUploader accept="image/*" label="Upload Visual Signal" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center p-6 md:p-8 min-h-[300px]">
             <Image 
               src={image} 
               alt="Selection Preview" 
               width={800}
               height={600}
               unoptimized
               className="max-w-full max-h-[400px] rounded-lg shadow-2xl object-contain" 
             />
          </div>

          <div className="w-full lg:w-80 flex flex-col gap-6 md:gap-8 p-6 md:p-8 bg-white/2 border border-white/5 rounded-[32px]">
             <div className="flex flex-col gap-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target Dimensions</label>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-slate-600 uppercase">Width</span>
                      <input 
                        type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value))}
                        className="bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50"
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-mono text-slate-600 uppercase">Height</span>
                      <input 
                        type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))}
                        className="bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50"
                      />
                   </div>
                </div>
             </div>

             <label className="flex items-center gap-4 cursor-pointer group">
                <input 
                  type="checkbox" checked={maintainAspect} onChange={() => setMaintainAspect(!maintainAspect)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-sky-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest group-hover:text-slate-200">Lock Aspect Ratio</span>
             </label>

             <div className="flex flex-col gap-3 mt-4">
                <button className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                  Execute Resizing
                </button>

                <button onClick={() => setImage(null)} className="py-3 text-[9px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors">
                   Purge Source
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
