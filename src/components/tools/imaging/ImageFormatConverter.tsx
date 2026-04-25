"use client";

import React, { useState, useRef, useEffect } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";

interface ImageFormatConverterProps {
  initialFormat?: string;
  sourceFormat?: string;
}

export default function ImageFormatConverter({ initialFormat, sourceFormat }: ImageFormatConverterProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>(initialFormat || "image/jpeg");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync target format if initialFormat changes (deep linking)
  useEffect(() => {
    if (initialFormat) {
      setTargetFormat(initialFormat);
      setConvertedBlob(null);
    }
  }, [initialFormat]);

  const onSelectFile = async (file: File) => {
    setError(null);
    setStatus("uploading");
    setProgress(0);

    // Simulation for scanning feel
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 10 : prev));
    }, 40);

    await new Promise(res => setTimeout(res, 500));
    clearInterval(interval);

    // Validate if sourceFormat is specified for this tool
    if (sourceFormat) {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const expectedExt = sourceFormat.split("/")[1]?.toLowerCase();
      
      const matchesMainType = file.type === sourceFormat;
      const matchesExtension = 
        (expectedExt === "jpeg" && (fileExt === "jpg" || fileExt === "jpeg")) ||
        (expectedExt === "heic" && (fileExt === "heic" || fileExt === "heif")) ||
        (fileExt === expectedExt);

      if (!matchesMainType && !matchesExtension) {
        setError(`Protocol Violation: Expected ${expectedExt?.toUpperCase()} signal, but received ${fileExt?.toUpperCase()}.`);
        setStatus("idle");
        return;
      }
    }

    setOriginalName(file.name.split(".")[0]);

    try {
      let processedFile: File | Blob = file;

      // Check for specialized formats
      const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic");
      const isTiff = file.type === "image/tiff" || file.name.toLowerCase().endsWith(".tiff") || file.name.toLowerCase().endsWith(".tif");
      const isJfif = file.name.toLowerCase().endsWith(".jfif");

      if (isHeic || isTiff) {
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        });
        processedFile = Array.isArray(result) ? result[0] : result;
      }

      if (isJfif) {
        // Force blob type for JFIF if needed, though most browsers handle it fine
        processedFile = new Blob([file], { type: "image/jpeg" });
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setStatus("idle");
      });
      reader.readAsDataURL(processedFile);
    } catch (err) {
      console.error("Error processing specialized image format:", err);
      setError("Failed to process image orbit.");
      setStatus("idle");
    }
    
    setConvertedBlob(null);
  };

  const handleConvert = async () => {
    if (!imgRef.current) return;
    setStatus("processing");
    setProgress(0);

    // Simulate progress for better feedback
    const interval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + 5 : prev));
    }, 100);

    // Add a small delay for "transcoding" simulation
    await new Promise(resolve => setTimeout(resolve, 1500));

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
    const extension = targetFormat.split("/")[1];
    const url = URL.createObjectURL(convertedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${originalName}_converted.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getFormatLabel = (mime: string) => {
    if (mime === "image/jpeg") return "JPEG";
    if (mime === "image/png") return "PNG";
    if (mime === "image/webp") return "WEBP";
    return mime.split("/")[1]?.toUpperCase() || "IMG";
  };

  return (
    <div className="flex flex-col gap-10">
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-lg font-bold font-mono text-red-500">!</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">Protocol Violation</span>
            <span className="text-[11px] font-mono text-slate-400 mt-0.5">{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-[10px] font-mono text-slate-600 hover:text-white transition-colors uppercase tracking-widest"
          >
            Dismiss
          </button>
        </div>
      )}

      {!imgSrc ? (
          <FileUploader 
          accept="image/*,.heic,.heif,.tiff,.tif" 
          label={status !== "idle" ? "Recalibrating..." : "Upload Image"} 
          onFileSelect={onSelectFile} 
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
            {status !== "idle" && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md p-6 text-center">
                {/* Stage: Uploading / scanning */}
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
                      <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Converting...</span>
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
              className="max-w-full max-h-[500px] object-contain rounded-lg"
            />
          </div>

          <ToolOptionsDrawer title="Conversion Settings">
            <div className="space-y-8">
              {!initialFormat && (
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target Format</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "JPEG (Standard)", value: "image/jpeg" },
                      { label: "PNG (Lossless)", value: "image/png" },
                      { label: "WEBP (High Efficiency)", value: "image/webp" },
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
              )}

              {initialFormat && (
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Active Objective</span>
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">Converting to {getFormatLabel(targetFormat)}</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                  {!convertedBlob ? (
                    <button
                      onClick={handleConvert}
                      disabled={status !== "idle"}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)]"
                    >
                      {status === "processing" ? "Processing..." : "Execute Conversion"}
                    </button>
                 ) : (
                    <button
                      onClick={downloadImage}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center gap-3"
                    >
                      <span>Download {getFormatLabel(targetFormat)}</span>
                      <span className="animate-bounce">↓</span>
                    </button>
                 )}

                 <button
                    onClick={() => { setImgSrc(""); setConvertedBlob(null); }}
                    className="py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Eject Source
                  </button>
              </div>
            </div>
          </ToolOptionsDrawer>
        </div>
      )}

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        Fast, hardware-accelerated image transcoding. Certified for high-fidelity conversion.
      </p>
    </div>
  );
}
