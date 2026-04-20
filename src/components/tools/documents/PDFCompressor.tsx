"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function PDFCompressor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setResultBlob(null);
    setProgress(0);
  };

  const compressPDF = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 200);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      // Load the original PDF
      const originalDoc = await PDFDocument.load(arrayBuffer);
      
      // Create a fresh document for reconstruction
      const pdfDoc = await PDFDocument.create();
      
      // Copy all pages from original to the new document
      // This forces resource pruning and re-indexing
      const pages = await pdfDoc.copyPages(originalDoc, originalDoc.getPageIndices());
      pages.forEach(page => pdfDoc.addPage(page));
      
      // Basic optimization: stripping metadata from the new scan
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setCreator("");
      pdfDoc.setProducer("");
      pdfDoc.setModificationDate(new Date());

      // Serialize with object streams enabled
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResultBlob(blob);
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      clearInterval(interval);
      console.error("PDF Compression Error:", error);
      alert("Document density reduction failed. File parity compromised.");
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col gap-10">
      {!pdfFile ? (
        <FileUploader accept="application/pdf" label="Upload PDF Manifest" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 min-h-[400px] relative overflow-hidden flex items-center justify-center">
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
                  Reducing Object Density...
                </span>
              </div>
            )}
            
            <div className={`transition-all duration-700 ${isProcessing ? "opacity-20 scale-95 blur-sm" : "opacity-100 scale-100"}`}>
               <div className="w-32 h-40 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-3 shadow-2xl">
                  <div className="text-4xl">📄</div>
                  <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest px-2 text-center truncate w-full">{pdfFile.name}</div>
               </div>
            </div>
          </div>

          <ToolOptionsDrawer title="Density recalibration specs">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-mono text-slate-600 uppercase">Input Density</span>
                      <span className="text-[10px] font-mono text-slate-400">{formatSize(pdfFile.size)}</span>
                    </div>
                    {resultBlob && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                        <span className="text-[8px] font-mono text-emerald-500 uppercase">Optimized Density</span>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatSize(resultBlob.size)}</span>
                          <span className="text-[8px] font-mono text-emerald-600">-{Math.round((1 - resultBlob.size/pdfFile.size) * 100)}%</span>
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10">
                    <span className="block text-[8px] font-mono text-sky-500 uppercase mb-2">Protocol: Stream Optimization</span>
                    <p className="text-[9px] font-mono text-slate-500 leading-relaxed uppercase tracking-tighter">
                      Stripping redundant metadata clusters and re-indexing structural object streams for maximum efficiency.
                    </p>
                 </div>
                 
                 {!resultBlob ? (
                    <button
                      onClick={compressPDF}
                      disabled={isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {isProcessing ? "Recalibrating..." : "Reduce Density"}
                    </button>
                 ) : (
                    <a
                      href={URL.createObjectURL(resultBlob)}
                      download={`optimized_${pdfFile.name}`}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      <span>Retrieve Manifest</span>
                      <span className="animate-bounce">↓</span>
                    </a>
                 )}

                 <button
                    onClick={() => { setPdfFile(null); setResultBlob(null); }}
                    className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Eject Manifest
                  </button>
              </div>
            </div>
          </ToolOptionsDrawer>
        </div>
      )}

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        Next-generation document density recalibration. Optimizing structural matrices for deep-space transmission.
      </p>
    </div>
  );
}
