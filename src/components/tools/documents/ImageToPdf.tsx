"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: ImageFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: e.target?.result as string,
        name: file.name,
      };
      setImages((prev) => [...prev, newImage]);
      setResultBlob(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setResultBlob(null);
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgress(10);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    try {
      for (let i = 0; i < images.length; i++) {
        setProgress(Math.round(10 + (i / images.length) * 80));
        
        if (i > 0) pdf.addPage();

        const img = images[i];
        const imgData = img.preview;
        
        // Basic scaling to fit page while maintaining aspect ratio
        // For a more advanced version, we could calculate the image dimensions
        pdf.addImage(imgData, "JPEG", 20, 20, pageWidth - 40, pageHeight - 40);
      }

      const pdfData = pdf.output("blob");
      
      setProgress(100);
      setTimeout(() => {
        setResultBlob(pdfData);
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Imaging-to-Document translation failed. Protocol mismatch.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
        <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 min-h-[400px] relative overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-sky-500/20"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-mono text-sky-400 font-bold">{progress}%</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] animate-pulse">
                Synthesizing PDF Manifest...
              </span>
            </div>
          )}

          <div className="space-y-4">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Unit Gallery ({images.length})</span>
             </div>

             {images.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl text-slate-700 italic font-mono text-sm">
                   Awaiting visual input sequences...
                </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="group relative aspect-[3/4] bg-white/2 rounded-2xl border border-white/5 overflow-hidden">
                       <img src={img.preview} alt={img.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[8px] font-mono text-white truncate uppercase tracking-tighter">{img.name}</span>
                       </div>
                       <button 
                         onClick={() => removeImage(img.id)}
                         className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         ×
                       </button>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>

        <ToolOptionsDrawer title="Consolidation Specs">
           <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Capture Protocol</span>
                 <div className="scale-90 origin-top">
                    <FileUploader accept="image/*" label="Add Imaging Unit" onFileSelect={handleFileSelect} />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center">
                    <span className="block text-[40px] font-bold text-sky-400 mb-1 leading-none">{images.length}</span>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Active Frames</span>
                 </div>
                 
                 {!resultBlob ? (
                    <button
                      onClick={generatePDF}
                      disabled={images.length === 0 || isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {isProcessing ? "Synthesizing..." : "Initialize Render"}
                    </button>
                 ) : (
                    <a
                      href={URL.createObjectURL(resultBlob)}
                      download="consolidated_imaging.pdf"
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      <span>Obtain Manifest</span>
                      <span className="animate-bounce">↓</span>
                    </a>
                 )}

                 {images.length > 0 && (
                    <button
                      onClick={() => setImages([])}
                      className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                    >
                      Purge Sequence
                    </button>
                 )}
              </div>
           </div>
        </ToolOptionsDrawer>
      </div>

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        High-fidelity imaging-to-document translation core. Finalizing visual evidence for galactic archives.
      </p>
    </div>
  );
}
