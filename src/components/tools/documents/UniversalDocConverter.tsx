"use client";

import React, { useState, useRef, useEffect } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";
import Script from "next/script";

declare global {
  interface Window {
    pdfjsLib: any;
    jspdf: any;
    mammoth: any;
  }
}

interface UniversalDocConverterProps {
  initialFormat?: string; // target mime
  sourceFormat?: string; // source mime
}

export default function UniversalDocConverter({ initialFormat, sourceFormat }: UniversalDocConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetType, setTargetType] = useState(initialFormat || "application/pdf");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  
  const [libsReady, setLibsReady] = useState({
    pdfjs: false,
    jspdf: false,
    mammoth: false
  });

  const onSelectFile = async (selectedFile: File) => {
    setError(null);
    setDownloadUrl(null);
    setStatus("uploading");
    setProgress(0);

    // Fast protocol check
    const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 25 : prev));
    }, 20);

    await new Promise(res => setTimeout(res, 200));
    clearInterval(interval);

    // Strict validation against sourceFormat if provided
    if (sourceFormat) {
      const allowedTypes = sourceFormat.split(",").map(t => t.trim());
      const fileExt = selectedFile.name.split(".").pop()?.toLowerCase();
      
      const isAllowed = allowedTypes.some(type => {
        if (type.includes("/")) return selectedFile.type === type;
        return fileExt === type.replace(".", "");
      });

      if (!isAllowed) {
        const expected = allowedTypes.map(t => t.split("/").pop()?.toUpperCase()).join(" or ");
        setError(`Protocol Violation: Expected ${expected} signal, but received ${fileExt?.toUpperCase()}.`);
        setStatus("idle");
        return;
      }
    }

    setFile(selectedFile);
    setStatus("idle");
    setResultName("");
  };

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(10);
    setError(null);

    const fileName = file.name.split(".")[0];
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    try {
      if (fileExt === "pdf" && targetType === "image/jpeg") {
        await convertPdfToImages(file, fileName);
      } else if (fileExt === "docx" && targetType === "application/pdf") {
        await convertDocxToPdf(file, fileName);
      } else if ((fileExt === "jpg" || fileExt === "png" || fileExt === "jpeg") && targetType === "application/pdf") {
        await convertImagesToPdf([file], fileName);
      } else if (fileExt === "heic" && targetType === "application/pdf") {
        await convertHeicToPdf(file, fileName);
      } else if (fileExt === "pdf" && targetType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        await convertPdfToWord(file, fileName);
      } else {
        throw new Error("This specific orbital path is not yet mapped.");
      }
      setStatus("done");
    } catch (err: any) {
      console.error("Conversion failed:", err);
      setError(err.message || "Failed to synthesize document.");
      setStatus("idle");
    }
  };

  // --- Logic Implementations ---

  const convertPdfToImages = async (pdfFile: File, name: string) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    setProgress(30);

    // For simplicity in this tool, we convert the first page or could zip them.
    // Let's do the first page for now as a high-quality JPG.
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    setProgress(80);

    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/jpeg", 0.9));
    if (blob) {
      setDownloadUrl(URL.createObjectURL(blob));
      setResultName(`${name}_page1.jpg`);
      setProgress(100);
    }
  };

  const convertDocxToPdf = async (docxFile: File, name: string) => {
    const arrayBuffer = await docxFile.arrayBuffer();
    const result = await window.mammoth.convertToHtml({ arrayBuffer });
    setProgress(50);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Mammoth returns HTML. Simple text injection for now.
    // Advanced: render HTML to canvas then to PDF, but that requires more libs.
    // We'll use a simple text extraction for the "Pro" feel.
    const text = result.value.replace(/<[^>]*>?/gm, "\n");
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 15, 15);
    
    const blob = doc.output("blob");
    setDownloadUrl(URL.createObjectURL(blob));
    setResultName(`${name}.pdf`);
    setProgress(100);
  };

  const convertHeicToPdf = async (heicFile: File, name: string) => {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({ blob: heicFile, toType: "image/jpeg" });
    const imageBlob = Array.isArray(result) ? result[0] : result;
    setProgress(60);

    const imageUrl = URL.createObjectURL(imageBlob);
    const { jsPDF } = window.jspdf;
    
    const img = new Image();
    img.src = imageUrl;
    await new Promise(res => img.onload = res);

    const doc = new jsPDF(img.width > img.height ? "l" : "p", "px", [img.width, img.height]);
    doc.addImage(img, "JPEG", 0, 0, img.width, img.height);
    
    const blob = doc.output("blob");
    setDownloadUrl(URL.createObjectURL(blob));
    setResultName(`${name}.pdf`);
    setProgress(100);
    URL.revokeObjectURL(imageUrl);
  };

  const convertImagesToPdf = async (files: File[], name: string) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    for (let i = 0; i < files.length; i++) {
      if (i > 0) doc.addPage();
      const url = URL.createObjectURL(files[i]);
      const img = new Image();
      img.src = url;
      await new Promise(res => img.onload = res);
      
      const width = doc.internal.pageSize.getWidth();
      const height = (img.height * width) / img.width;
      doc.addImage(img, "JPEG", 0, 0, width, height);
      URL.revokeObjectURL(url);
    }
    
    const blob = doc.output("blob");
    setDownloadUrl(URL.createObjectURL(blob));
    setResultName(`${name}.pdf`);
    setProgress(100);
  };

  const convertPdfToWord = async (pdfFile: File, name: string) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n\n";
        setProgress(Math.round((i / pdf.numPages) * 90));
    }

    // Creating a basic .doc file (HTML-based Word compatible)
    const blob = new Blob([`<html><body>${fullText.replace(/\n/g, "<br>")}</body></html>`], { type: "application/msword" });
    setDownloadUrl(URL.createObjectURL(blob));
    setResultName(`${name}.doc`);
    setProgress(100);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = resultName;
    link.click();
  };

  return (
    <div className="flex flex-col gap-10">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" 
        onLoad={() => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            setLibsReady(prev => ({ ...prev, pdfjs: true }));
        }} 
      />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" onLoad={() => setLibsReady(prev => ({ ...prev, jspdf: true }))} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js" onLoad={() => setLibsReady(prev => ({ ...prev, mammoth: true }))} />

      {!file ? (
        <FileUploader 
          accept={sourceFormat || ".pdf,.docx,.jpg,.png,.jpeg,.heic"} 
          label="Identify Target Document" 
          onFileSelect={onSelectFile} 
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-8 flex flex-col items-center justify-center min-h-[300px] relative">
             <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl mb-4">
                {file.name.endsWith(".pdf") ? "📄" : "📝"}
             </div>
             <span className="text-sm font-mono text-slate-200 mb-2 truncate max-w-xs">{file.name}</span>
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                {(file.size / 1024 / 1024).toFixed(2)} MB
             </span>

             {status !== "idle" && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[32px] p-6 text-center">
                    {/* Stage: Uploading / Scanning */}
                    {status === "uploading" && (
                      <>
                        <div className="relative w-20 h-20 mb-6">
                          <div className="absolute inset-0 border-2 border-sky-500/20 rounded-2xl"></div>
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-[scan_2s_linear_infinite]"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">📡</div>
                        </div>
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Syncing File...</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Checking compatibility</span>
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
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">In Progress...</span>
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
                        <span className="text-[9px] font-mono text-slate-500 uppercase mb-6">File is ready</span>
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
          </div>

          <ToolOptionsDrawer title="Mission Parameters">
             <div className="space-y-8">
                <div className="space-y-3">
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Output Sector</span>
                   <select 
                      value={targetType}
                      onChange={(e) => { setTargetType(e.target.value); setDownloadUrl(null); }}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500/50 appearance-none"
                   >
                      <option value="application/pdf" className="bg-[#0a0a0a]">PDF Document</option>
                      <option value="image/jpeg" className="bg-[#0a0a0a]">JPG Image</option>
                      <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="bg-[#0a0a0a]">Word Document (DOCX)</option>
                   </select>
                </div>

                {!downloadUrl ? (
                    <button
                      onClick={handleConvert}
                      disabled={status !== "idle"}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] disabled:opacity-30"
                    >
                      {status === "processing" ? "Converting..." : "Start Conversion"}
                    </button>
                ) : (
                   <div className="flex flex-col gap-3">
                      <button
                        onClick={handleDownload}
                        className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                      >
                        <span>Retrieve Result</span>
                        <span className="animate-bounce">↓</span>
                      </button>
                      <button onClick={() => setFile(null)} className="py-2 text-[10px] font-mono text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Reset Chamber</button>
                   </div>
                )}
             </div>
          </ToolOptionsDrawer>
        </div>
      )}
    </div>
  );
}
