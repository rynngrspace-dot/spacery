"use client";

import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

type QualityLevel = "low" | "medium" | "high";

export default function VideoCompressor() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<QualityLevel>("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [securityActive, setSecurityActive] = useState<boolean | null>(null);
  const ffmpegRef = useRef<any>(null);

  const checkSecurity = () => {
    const isIsolated = window.crossOriginIsolated || typeof SharedArrayBuffer !== "undefined";
    setSecurityActive(isIsolated);
    if (!isIsolated) {
      console.warn("[STATION-SECURITY] Cross-Origin Isolation not detected. FFmpeg mission may fail.");
    }
  };

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setOutputUrl(null);
    setCompressedSize(null);
    setProgress(0);
  };

  const loadFFmpeg = async () => {
    checkSecurity();
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)));
    
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
    } catch (err) {
      console.error("[STATION-ERROR] Engine initialization failure:", err);
      throw err;
    }
  };

  const compressVideo = async () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      if (!ffmpegRef.current) await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const { name } = videoFile;
      
      await ffmpeg.writeFile(name, await fetchFile(videoFile));

      // Quality settings using CRF (Constant Rate Factor)
      // 18-28 is a good range. Lower is better quality.
      const crfMap = { low: "30", medium: "24", high: "20" };
      
      await ffmpeg.exec([
        "-i", name, 
        "-vcodec", "libx264", 
        "-crf", crfMap[quality], 
        "-preset", "veryfast", 
        "output.mp4"
      ]);
      
      const data = await ffmpeg.readFile("output.mp4") as any;
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      setCompressedSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("FFmpeg error:", error);
      alert("Motion stream compression failed. Structural integrity at risk.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="flex flex-col gap-10">
      {!videoFile ? (
        <FileUploader accept="video/*" label="Upload Video Stream" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
            {isProcessing && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md text-center px-6">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-sky-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-mono text-sky-400 font-bold">{progress}%</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] animate-pulse">
                  Compressing Atomic Structures...
                </span>
              </div>
            )}
            
            <video 
              src={outputUrl || previewUrl || ""} 
              controls 
              className="max-w-full max-h-[450px] rounded-xl shadow-2xl"
            />
          </div>

          <ToolOptionsDrawer title="Compression Specs">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Quality Preset</span>
                 <div className="grid grid-cols-3 gap-2">
                    {(["low", "medium", "high"] as QualityLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => { setQuality(level); setOutputUrl(null); }}
                        className={`py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest border transition-all ${
                          quality === level 
                            ? "bg-sky-500 text-white border-sky-400 font-bold" 
                            : "bg-white/2 text-slate-400 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-mono text-slate-600 uppercase">Original Size</span>
                      <span className="text-[10px] font-mono text-slate-400">{formatSize(videoFile.size)}</span>
                    </div>
                    {compressedSize && (
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                        <span className="text-[8px] font-mono text-emerald-500 uppercase">Result Size</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatSize(compressedSize)}</span>
                      </div>
                    )}
                 </div>
                 
                 {!outputUrl ? (
                    <button
                      onClick={compressVideo}
                      disabled={isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Reduce Payload"}
                    </button>
                 ) : (
                    <a
                      href={outputUrl}
                      download={`compressed_${videoFile.name}`}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      <span>Obtain Encrypted Bitstream</span>
                      <span className="animate-bounce">↓</span>
                    </a>
                 )}

                 <button
                    onClick={() => { setVideoFile(null); setOutputUrl(null); }}
                    className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Eject Source
                  </button>
              </div>
            </div>
          </ToolOptionsDrawer>
        </div>
      )}

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        High-performance video reduction protocol. Compact data streams for universal transmission.
      </p>
    </div>
  );
}
