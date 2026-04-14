"use client";

import React, { useState, useRef } from "react";
import FileUploader from "../../shared/FileUploader";
import ToolOptionsDrawer from "../../shared/ToolOptionsDrawer";

export default function ImageFormatConverter() {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("image/jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (file: File) => {
    setOriginalName(file.name.split(".")[0]);
    const reader = new FileReader();
    reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
    reader.readAsDataURL(file);
    setConvertedBlob(null);
  };

  const handleConvert = () => {
    if (!imgRef.current) return;
    setIsProcessing(true);

    const canvas = document.createElement("canvas");
    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Paint white background if converting to JPG (transparency support)
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        setConvertedBlob(blob);
        setIsProcessing(false);
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

  return (
    <div className="flex flex-col gap-10">
      {!imgSrc ? (
        <FileUploader accept="image/*" label="Upload Image" onFileSelect={onSelectFile} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
            {isProcessing && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest animate-pulse">Converting Format...</span>
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
                          : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"
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
                      disabled={isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)]"
                    >
                      Convert Now
                    </button>
                 ) : (
                    <button
                      onClick={downloadImage}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3"
                    >
                      <span>Download {targetFormat.split("/")[1].toUpperCase()}</span>
                      <span className="animate-bounce">↓</span>
                    </button>
                 )}

                 <button
                    onClick={() => { setImgSrc(""); setConvertedBlob(null); }}
                    className="py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Clear Image
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
