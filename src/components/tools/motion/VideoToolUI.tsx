"use client";

import React, { useState } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";

export default function VideoToolUI({ actionLabel }: { actionLabel: string }) {
  const [video, setVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    setVideo(URL.createObjectURL(file));
  };

  const startProcessing = () => {
    setIsProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsProcessing(false), 500);
      } else {
        setProgress(p);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col gap-10">
      {!video ? (
        <FileUploader accept="video/*" label="Upload Motion Stream" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col gap-6 md:gap-10">
          
          {/* Video Preview Interface */}
          <div className="relative aspect-video bg-black/60 rounded-3xl border border-white/5 overflow-hidden group shadow-2xl min-h-[240px]">
             <video src={video || ""} controls className="w-full h-full object-contain" aria-label="Selection Preview" />
             {isProcessing && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 md:p-12">
                  <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
                     <div 
                      className="h-full bg-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                     ></div>
                  </div>
                  <div className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.4em] animate-pulse text-center">
                    Synthesizing Stream: {Math.floor(progress)}%
                  </div>
               </div>
             )}
          </div>

          {/* Action Deck */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10 p-6 md:p-10 bg-white/5 border border-white/5 rounded-[32px]">
             <div className="flex flex-col gap-2 text-center lg:text-left">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{actionLabel} Initiative</h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed max-w-sm">Automatic optimization based on local hardware entropy.</p>
             </div>

             <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
               <button 
                onClick={startProcessing}
                disabled={isProcessing}
                className={`w-full sm:w-auto px-10 py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(56,189,248,0.2)] ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
               >
                 {isProcessing ? "Processing..." : `Execute ${actionLabel}`}
               </button>

               <button 
                onClick={() => setVideo(null)}
                className="text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors py-2"
               >
                 Purge Source
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
