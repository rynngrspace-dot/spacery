"use client";

import React, { useState, useRef, useEffect } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";

export default function SvgConverter() {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("image/png");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onSelectFile = async (file: File) => {
    setError(null);
    setStatus("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 10 : prev));
    }, 40);

    await new Promise(res => setTimeout(res, 500));
    clearInterval(interval);

    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setError("Protocol Violation: Expected SVG vector data, but received incompatible signal.");
      setStatus("idle");
      return;
    }

    setOriginalName(file.name.split(".")[0]);

    try {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setStatus("idle");
      });
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error loading SVG:", err);
      setError("Failed to load vector signal.");
      setStatus("idle");
    }
    
    setConvertedBlob(null);
  };

  const handleConvert = async () => {
    if (!imgRef.current) return;
    setStatus("processing");
    setProgress(0);

    // Simulation for aesthetic flow
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = document.createElement("canvas");
    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        clearInterval(interval);
        setProgress(100);
        setConvertedBlob(blob);
        setStatus("done");
      }, targetFormat, 0.9);
    }
  };

  const downloadImage = () => {
    if (!convertedBlob) return;
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${originalName}.${targetFormat.split("/")[1]}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getFormatLabel = (mime: string) => {
    return mime.split("/")[1]?.toUpperCase() || "IMG";
  };

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold">!</div>
          <span className="text-[11px] font-mono text-slate-400">{error}</span>
        </div>
      )}

      {!imgSrc ? (
        <FileUploader 
          accept="image/svg+xml" 
          label="Capture Vector Signal" 
          onFileSelect={onSelectFile} 
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-8 flex items-center justify-center min-h-[450px] relative overflow-hidden">
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
                          <div className="absolute inset-2 border-b-2 border-sky-300/40 rounded-full animate-spin-reverse"></div>
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
                        <span className="text-[9px] font-mono text-slate-500 uppercase mb-6">Image is ready</span>
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
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              ref={imgRef}
              src={imgSrc} 
              alt="Source" 
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl" 
            />
          </div>

          <ToolOptionsDrawer title="Rasterize Protocol">
            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Output Dimension Type</span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "PNG (Transparent)", value: "image/png" },
                    { label: "JPEG (Solid White)", value: "image/jpeg" },
                    { label: "WEBP (Optimized)", value: "image/webp" },
                  ].map((format) => (
                    <button
                      key={format.value}
                      onClick={() => { setTargetFormat(format.value); setConvertedBlob(null); }}
                      className={`py-4 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
                        targetFormat === format.value 
                          ? "bg-sky-500 text-white border-sky-400" 
                          : "bg-white/2 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                 {!convertedBlob ? (
                    <button
                      onClick={handleConvert}
                      disabled={status !== "idle"}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em]"
                    >
                      {status === "processing" ? "Processing..." : "Initiate Rasterization"}
                    </button>
                 ) : (
                    <button
                      onClick={downloadImage}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                    >
                      <span>Download {getFormatLabel(targetFormat)}</span>
                      <span className="animate-bounce">↓</span>
                    </button>
                 )}
                 <button onClick={() => setImgSrc("")} className="py-2 text-[10px] font-mono text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Eject Data</button>
              </div>
            </div>
          </ToolOptionsDrawer>
        </div>
      )}
    </div>
  );
}
