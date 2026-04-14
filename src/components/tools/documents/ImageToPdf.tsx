"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import FileUploader from "../../shared/FileUploader";

interface QueuedImage {
  id: string;
  url: string;
  name: string;
  file: File;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const onSelectFiles = (files: File[] | File) => {
    const fileList = Array.isArray(files) ? files : [files];
    const newImages = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
      file: file
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let i = 0; i < images.length; i++) {
      if (i > 0) pdf.addPage();
      
      const imgData = await getBase64(images[i].file);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate aspect ratio to fit image on page
      const img = new Image();
      img.src = images[i].url;
      await new Promise(resolve => img.onload = resolve);
      
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const ratio = imgWidth / imgHeight;
      
      let finalWidth = pageWidth - 20; // 10mm margins
      let finalHeight = finalWidth / ratio;
      
      if (finalHeight > pageHeight - 20) {
        finalHeight = pageHeight - 20;
        finalWidth = finalHeight * ratio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
    }

    pdf.save(`spacery_document_${Date.now()}.pdf`);
    setIsGenerating(false);
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="flex flex-col gap-10">
      
      {/* Upload Zone */}
      <div className="w-full">
         <FileUploader 
           accept="image/*" 
           label="Select Images to Convert" 
           onFileSelect={onSelectFiles}
         />
      </div>

      {/* Queued Images Grid */}
      {images.length > 0 && (
        <div className="flex flex-col gap-8 animate-[fadeUp_0.6s_ease-out_forwards]">
          <div className="flex justify-between items-center px-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Document Queue ({images.length} Pages)</span>
            <button 
              onClick={() => { images.forEach(img => URL.revokeObjectURL(img.url)); setImages([]); }}
              className="text-[9px] font-mono text-red-500 hover:opacity-70 uppercase tracking-widest"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-[3/4] bg-white/2 border border-white/5 rounded-2xl overflow-hidden hover:border-sky-500/30 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     onClick={() => removeImage(img.id)}
                     className="p-3 bg-red-500 text-white rounded-full hover:bg-red-400 transition-colors"
                   >
                     ✕
                   </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-sm">
                   <p className="text-[8px] font-mono text-slate-400 truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={generatePdf}
            disabled={isGenerating}
            className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(56,189,248,0.3)] disabled:opacity-50"
          >
            {isGenerating ? "Synthesizing PDF..." : "Generate PDF Document"}
          </button>
        </div>
      )}

      {!images.length && (
         <div className="py-20 text-center opacity-30">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Awaiting Visual Assets...</p>
         </div>
      )}

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
         Encapsulates high-resolution imaging into industry-standard PDF containers. Securely processed on-site.
      </p>

    </div>
  );
}
