"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function PDFCompressor() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus("uploading");
    setProgress(0);
    setResultBlob(null);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 10 : prev));
    }, 40);

    await new Promise(res => setTimeout(res, 500));
    clearInterval(interval);

    setPdfFile(file);
    setStatus("idle");
    setProgress(0);
  };

  const compressPDF = async () => {
    if (!pdfFile) return;
    setStatus("processing");
    setProgress(10);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 200);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const originalDoc = await PDFDocument.load(arrayBuffer);
      const pdfDoc = await PDFDocument.create();
      
      const pages = await pdfDoc.copyPages(originalDoc, originalDoc.getPageIndices());
      pages.forEach(page => pdfDoc.addPage(page));
      
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setCreator("");
      pdfDoc.setProducer("");
      pdfDoc.setModificationDate(new Date());

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      
      clearInterval(interval);
      setProgress(100);
      setResultBlob(blob);
      setStatus("done");
    } catch (error) {
      clearInterval(interval);
      console.error("PDF Compression Error:", error);
      setStatus("idle");
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
            {status !== "idle" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center">
                   {/* Stage: Uploading / Scanning */}
                   {status === "uploading" && (
                     <>
                        <div className="relative w-20 h-20 mb-6">
                           <div className="absolute inset-0 border-2 border-sky-500/20 rounded-2xl"></div>
                           <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-[scan_2s_linear_infinite]"></div>
                           <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">📡</div>
                        </div>
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Syncing File...</span>
                     </>
                   )}

                   {/* Stage: Processing / Synthesis */}
                   {status === "processing" && (
                      <>
                        <div className="relative w-24 h-24 mb-6">
                          <div className="absolute inset-0 border-2 border-sky-500/10 rounded-full"></div>
                          <div className="absolute inset-[-4px] border-t-2 border-sky-400 rounded-full animate-spin"></div>
                          <div className="absolute inset-2 border-b-2 border-sky-300/40 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "2s" }}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-mono text-sky-400 font-bold">{progress}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Optimizing...</span>
                        <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                      </>
                   )}

                   {/* Stage: Done / Accomplished */}
                   {status === "done" && (
                      <>
                        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in zoom-in duration-500">
                          ✅
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.3em] font-bold mb-2">Success!</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase mb-6">PDF is optimized</span>
                        <button 
                          onClick={() => setStatus("idle")}
                          className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-widest text-slate-300 transition-all"
                        >
                          Close
                        </button>
                      </>
                   )}
                </div>
            )}
            
            <div className={`transition-all duration-700 ${status === "processing" ? "opacity-20 scale-95 blur-sm" : "opacity-100 scale-100"}`}>
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
                      disabled={status !== "idle"}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {status === "processing" ? "Recalibrating..." : "Reduce Density"}
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
