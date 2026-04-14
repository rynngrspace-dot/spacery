"use client";

import React, { useState } from "react";
import Image from "next/image";
import FileUploader from "@/components/tools/shared/FileUploader";

const FILTERS = [
  { name: "Raw", filter: "none" },
  { name: "Grayscale", filter: "grayscale(100%)" },
  { name: "Sepia", filter: "sepia(100%)" },
  { name: "Invert", filter: "invert(100%)" },
  { name: "Blur", filter: "blur(4px)" },
  { name: "Saturate", filter: "saturate(200%)" },
  { name: "Astro Bloom", filter: "brightness(1.2) contrast(1.1) saturate(1.2)" },
];

export default function ImageFilters() {
  const [image, setImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);

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
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* Preview Area */}
          <div className="flex-1 w-full bg-black/40 rounded-3xl overflow-hidden border border-white/5 relative group min-h-[300px] md:min-h-[500px]">
             <Image 
               src={image} 
               alt="Selection Preview" 
               fill
               unoptimized
               className="object-contain transition-all duration-700" 
               style={{ filter: activeFilter.filter }}
             />
             <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-sky-400 uppercase tracking-widest border border-white/10">
                ACTIVE_LAYER: {activeFilter.name}
             </div>
             <button 
               onClick={() => setImage(null)}
               className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-white/10"
             >
               ×
             </button>
          </div>

          {/* Control Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-6 md:gap-8">
             <div className="flex flex-col gap-4">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Available Matrices</label>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                   {FILTERS.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setActiveFilter(f)}
                        className={`px-5 py-3 rounded-xl text-xs font-mono transition-all text-left border ${
                          activeFilter.name === f.name 
                            ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                            : "bg-white/2 text-slate-400 border-transparent hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        {f.name}
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-5 rounded-2xl bg-white/2 border border-white/5">
                <span className="block text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-2">Technical Info</span>
                <p className="text-[9px] text-slate-500 leading-relaxed font-mono">CSS3 Warp Engine active. Real-time GPU acceleration enabled.</p>
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
