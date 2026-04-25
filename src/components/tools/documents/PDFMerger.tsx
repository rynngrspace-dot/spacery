"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PDFMerger() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus("uploading");
    setProgress(0);
    
    // Scanning simulation
    const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 10 : prev));
    }, 40);

    await new Promise(res => setTimeout(res, 500));
    clearInterval(interval);

    const newFile: PDFFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
    };
    
    setPdfFiles((prev) => [...prev, newFile]);
    setMergedBlob(null);
    setStatus("idle");
  };

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlob(null);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...pdfFiles];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setPdfFiles(newFiles);
    setMergedBlob(null);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...pdfFiles];
    const draggedItem = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setPdfFiles(newFiles);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) return;
    setStatus("processing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 150);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      
      clearInterval(interval);
      setProgress(100);
      setMergedBlob(blob);
      setStatus("done");
    } catch (error) {
      clearInterval(interval);
      console.error("Error merging PDFs:", error);
      setStatus("idle");
    }
  };

  const downloadMerged = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "merged_documents.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
        <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 min-h-[400px] relative overflow-hidden">
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
                     <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Syncing Files...</span>
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
                     <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Merging Fragments...</span>
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
                     <span className="text-[9px] font-mono text-slate-500 uppercase mb-6">Documents are merged</span>
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

          <div className="space-y-3">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Manifest Contents ({pdfFiles.length})</span>
                {pdfFiles.length > 1 && (
                  <span className="text-[9px] font-mono text-sky-500/50 uppercase animate-pulse">Drag units to reorder</span>
                )}
             </div>

             {pdfFiles.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl text-slate-700 italic font-mono text-sm">
                   Awaiting document input...
                </div>
             )}

             <div className="grid gap-2">
               {pdfFiles.map((f, index) => (
                  <div 
                    key={f.id} 
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group relative flex items-center justify-between p-4 bg-white/2 border rounded-2xl transition-all cursor-grab active:cursor-grabbing ${
                      draggedIndex === index 
                        ? "border-sky-500 bg-sky-500/10 opacity-50 scale-95" 
                        : "border-white/5 hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                     <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-[10px] font-mono text-sky-400 border border-sky-500/20">
                           {index + 1}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm text-slate-200 font-medium truncate max-w-[150px] md:max-w-xs">{f.name}</span>
                           <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">{formatSize(f.size)}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1 mr-2 opacity-20 group-hover:opacity-100 transition-opacity hidden md:flex">
                           <button onClick={(e) => { e.stopPropagation(); moveFile(index, "up"); }} disabled={index === 0} className="text-[10px] hover:text-sky-400">▲</button>
                           <button onClick={(e) => { e.stopPropagation(); moveFile(index, "down"); }} disabled={index === pdfFiles.length - 1} className="text-[10px] hover:text-sky-400">▼</button>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} 
                          className="w-8 h-8 rounded-full hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors font-bold"
                        >
                          ×
                        </button>
                     </div>
                  </div>
               ))}
             </div>
          </div>
        </div>

        <ToolOptionsDrawer title="Lab Control System">
           <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Input Protocol</span>
                 <div className="scale-90 origin-top">
                    <FileUploader accept="application/pdf" label="Add PDF Document" onFileSelect={handleFileSelect} />
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/2 border border-white/5 text-center">
                 <span className="block text-[40px] font-bold text-sky-400 mb-2 leading-none">{pdfFiles.length}</span>
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Total Fragments</span>
              </div>

              <div className="space-y-4">
                 <button
                   onClick={mergePDFs}
                   disabled={pdfFiles.length < 2 || status !== "idle"}
                   className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {status === "processing" ? "Consolidating..." : "Execute Merge"}
                 </button>

                 {mergedBlob && (
                    <button
                      onClick={downloadMerged}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95 duration-300"
                    >
                      <span>Retrieve Manifest</span>
                      <span className="animate-bounce">↓</span>
                    </button>
                 )}

                 {pdfFiles.length > 0 && (
                    <button
                      onClick={() => setPdfFiles([])}
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
        High-fidelity document consolidation. Certified for intergalactic record keeping.
      </p>
    </div>
  );
}
