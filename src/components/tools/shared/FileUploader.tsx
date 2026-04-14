"use client";

import React, { useState, useRef } from "react";

interface FileUploaderProps {
  accept: string;
  label: string;
  onFileSelect: (file: File) => void;
}

export default function FileUploader({ accept, label, onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full py-12 md:py-20 border-2 border-dashed rounded-[32px] transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center px-4 md:px-6 ${
        isDragging 
          ? "border-sky-500 bg-sky-500/10 scale-[1.02] shadow-[0_0_40px_rgba(56,189,248,0.2)]" 
          : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/5"
      }`}
    >
      <input 
        type="file" 
        accept={accept} 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        ref={fileInputRef}
        className="hidden"
      />
      
      <div className={`w-12 h-12 md:w-16 md:h-16 mb-6 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all duration-500 ${
        isDragging ? "bg-sky-500 text-white" : "bg-white/5 text-slate-500"
      }`}>
        ↑
      </div>

      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-2 uppercase tracking-widest px-4">{label}</h3>
      <p className="text-slate-500 text-[10px] md:text-sm max-w-xs font-mono uppercase tracking-widest leading-relaxed px-4">
        Drag material here or click to uplink
      </p>

      {/* Aesthetic corner accents - Responsive hiding */}
      <div className="hidden sm:block absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/10 group-hover:border-sky-500/30 transition-colors"></div>
      <div className="hidden sm:block absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/10 group-hover:border-sky-500/30 transition-colors"></div>
      <div className="hidden sm:block absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/10 group-hover:border-sky-500/30 transition-colors"></div>
      <div className="hidden sm:block absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/10 group-hover:border-sky-500/30 transition-colors"></div>
    </div>
  );
}
