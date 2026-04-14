"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";

interface QueuedImage {
  id: string;
  url: string;
  name: string;
  file: File;
}

type Orientation = "p" | "l";
type PageFormat = "a4" | "letter" | "legal";

export default function ImageToPdf() {
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Settings
  const [orientation, setOrientation] = useState<Orientation>("p");
  const [format, setFormat] = useState<PageFormat>("a4");
  const [margin, setMargin] = useState<number>(10);

  useEffect(() => {
    // Reset PDF URL when images or settings change
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [images, orientation, format, margin]);

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
      orientation: orientation,
      unit: "mm",
      format: format,
    });

    const startTime = Date.now();

    for (let i = 0; i < images.length; i++) {
      if (i > 0) pdf.addPage();
      
      const imgData = await getBase64(images[i].file);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const img = new Image();
      img.src = images[i].url;
      await new Promise(resolve => img.onload = resolve);
      
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const ratio = imgWidth / imgHeight;
      
      let finalWidth = pageWidth - (margin * 2);
      let finalHeight = finalWidth / ratio;
      
      if (finalHeight > pageHeight - (margin * 2)) {
        finalHeight = pageHeight - (margin * 2);
        finalWidth = finalHeight * ratio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
    }

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    
    // Ensure at least 2 seconds of loading time for better UX
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 2000 - elapsedTime);

    setTimeout(() => {
      setPdfUrl(url);
      setIsGenerating(false);
    }, remainingTime);
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `spacery_document_${Date.now()}.pdf`;
    link.click();
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
    <div className="flex flex-col gap-10 relative">
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out_forwards]">
           <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-sky-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-sky-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-2 border-transparent border-t-purple-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-sky-400 uppercase tracking-[0.4em] animate-pulse">Synthesizing PDF</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Processing {images.length} layers...</span>
           </div>
        </div>
      )}

      {!images.length ? (
        <FileUploader 
          accept="image/*" 
          label="Select Images to Convert" 
          onFileSelect={onSelectFiles}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex justify-between items-center px-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Document Queue ({images.length} Pages)</span>
              <button 
                onClick={() => { images.forEach(img => URL.revokeObjectURL(img.url)); setImages([]); }}
                className="text-[9px] font-mono text-red-500 hover:opacity-70 uppercase tracking-widest"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div 
                onClick={() => document.getElementById("hidden-file-input")?.click()}
                className="aspect-[3/4] bg-white/2 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-sky-500/20 transition-all gap-2"
              >
                <span className="text-xl text-slate-600">+</span>
                <span className="text-[10px] font-mono text-slate-600 uppercase">Add More</span>
                <input 
                  id="hidden-file-input" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => e.target.files && onSelectFiles(Array.from(e.target.files))}
                />
              </div>
            </div>
          </div>

          <ToolOptionsDrawer title="Document Settings">
             <div className="space-y-8">
                {/* Orientation */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Orientation</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Portrait", val: "p" },
                      { label: "Landscape", val: "l" }
                    ].map(opt => (
                      <button 
                        key={opt.val}
                        onClick={() => setOrientation(opt.val as Orientation)}
                        className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
                          orientation === opt.val ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Size */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Page Size</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "A4 (Standard)", val: "a4" },
                      { label: "Letter (US)", val: "letter" },
                      { label: "Legal", val: "legal" }
                    ].map(opt => (
                      <button 
                        key={opt.val}
                        onClick={() => setFormat(opt.val as PageFormat)}
                        className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
                          format === opt.val ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margins */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Margin</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "None", val: 0 },
                      { label: "5mm", val: 5 },
                      { label: "10mm", val: 10 }
                    ].map(opt => (
                      <button 
                        key={opt.val}
                        onClick={() => setMargin(opt.val)}
                        className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
                          margin === opt.val ? "bg-sky-500 text-white border-sky-400" : "bg-white/2 text-slate-500 border-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 my-4"></div>

                <div className="flex flex-col gap-3">
                  {!pdfUrl ? (
                    <button 
                      onClick={generatePdf}
                      disabled={isGenerating}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      Process Document
                    </button>
                  ) : (
                    <button 
                      onClick={downloadPdf}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-[pulse_2s_infinite]"
                    >
                      <span>Download PDF</span>
                      <span className="animate-bounce">↓</span>
                    </button>
                  )}
                  {pdfUrl && (
                     <button 
                       onClick={() => setPdfUrl(null)}
                       className="py-2 text-[9px] font-mono text-slate-600 uppercase tracking-widest hover:text-red-400 transition-colors"
                     >
                       Regenerate / Edit
                     </button>
                  )}
                </div>
             </div>
          </ToolOptionsDrawer>

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
