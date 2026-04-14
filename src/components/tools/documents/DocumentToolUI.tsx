"use client";

import React, { useState } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";

export default function DocumentToolUI({ actionLabel, acceptedTypes }: { actionLabel: string, acceptedTypes: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const startProcessing = () => {
    setIsProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsProcessing(false), 800);
      } else {
        setProgress(p);
      }
    }, 300);
  };

  return (
    <div className="flex flex-col gap-10">
      {!file ? (
        <FileUploader accept={acceptedTypes} label="Uplink Document" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col gap-6 md:gap-10 max-w-2xl mx-auto w-full">
          
          {/* Document Identity Card */}
          <div className="p-6 md:p-10 bg-white/2 border border-white/5 rounded-[32px] relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-6 md:p-8 text-3xl md:text-4xl opacity-10">📄</div>
             
             <div className="flex flex-col gap-2 mb-8">
               <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Document Signal Identified</span>
               <h4 className="text-lg md:text-xl font-bold text-slate-100 truncate pr-12">{file.name}</h4>
             </div>

             <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono text-slate-600 uppercase">Mass</span>
                   <span className="text-sm font-mono text-slate-300">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-mono text-slate-600 uppercase">Encoding</span>
                   <span className="text-sm font-mono text-slate-300 truncate">{file.type || "System/Binary"}</span>
                </div>
             </div>

             {isProcessing ? (
                <div className="space-y-4">
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.6)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                   </div>
                   <div className="text-[9px] font-mono text-sky-400 text-center uppercase tracking-[0.4em] animate-pulse">
                     Compressing Manifest: {Math.floor(progress)}%
                   </div>
                </div>
             ) : (
                <button 
                  onClick={startProcessing}
                  className="w-full py-5 bg-white/2 text-white font-bold rounded-2xl hover:bg-sky-500 transition-all text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(56,189,248,0.2)]"
                >
                  Initiate {actionLabel}
                </button>
             )}
          </div>

          <div className="flex justify-center">
             <button 
              onClick={() => setFile(null)}
              className="px-8 py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 transition-colors uppercase tracking-[0.4em]"
             >
               Purge Manifest
             </button>
          </div>

        </div>
      )}
    </div>
  );
}
