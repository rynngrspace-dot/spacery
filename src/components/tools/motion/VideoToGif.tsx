"use client";

import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function VideoToGif() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [fps, setFps] = useState(10);
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
    setProgress(0);
  };

  const loadFFmpeg = async () => {
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)));
    
    try {
      checkSecurity();
      // Using locally hosted assets for stability
      await ffmpeg.load({
        coreURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
    } catch (err) {
      console.error("[STATION-ERROR] GIF initialization failure:", err);
      throw err;
    }
  };

  const convertToGif = async () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      if (!ffmpegRef.current) await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const { name } = videoFile;
      
      await ffmpeg.writeFile(name, await fetchFile(videoFile));

      // Simple implementation: generate Gif
      // For higher quality, we could generate a palette first.
      await ffmpeg.exec([
        "-i", name,
        "-vf", `fps=${fps},scale=480:-1:flags=lanczos`,
        "output.gif"
      ]);
      
      const data = await ffmpeg.readFile("output.gif") as any;
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
      setOutputUrl(url);
    } catch (error) {
      console.error("FFmpeg error:", error);
      alert("Motion-to-Animation sequence failed. Raster protocols compromised.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {!videoFile ? (
        <FileUploader accept="video/*" label="Upload Video Stream" onFileSelect={handleFileSelect} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
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
                  Encoding Animation Raster...
                </span>
              </div>
            )}
            
            {outputUrl ? (
              <img src={outputUrl} alt="Generated GIF" className="max-w-full max-h-[450px] rounded-xl shadow-2xl" />
            ) : (
              <video 
                src={previewUrl || ""} 
                controls 
                className="max-w-full max-h-[450px] rounded-xl shadow-2xl"
              />
            )}
          </div>

          <ToolOptionsDrawer title="Rasterization Parameters">
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Frame Velocity</span>
                      <span className="text-[10px] font-mono text-sky-400 font-bold">{fps} FPS</span>
                    </div>
                    <input 
                      type="range" min={5} max={30} step={1} value={fps} 
                      onChange={(e) => { setFps(parseInt(e.target.value)); setOutputUrl(null); }}
                      className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                 </div>

                 <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center">
                    <span className="block text-[8px] font-mono text-slate-600 uppercase mb-1">Target Resolution</span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest text-xs uppercase">480px / Optimized Pallet</span>
                 </div>
                 
                 {!outputUrl ? (
                    <button
                      onClick={convertToGif}
                      disabled={isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {isProcessing ? "Rasterizing..." : "Initiate Conversion"}
                    </button>
                 ) : (
                    <a
                      href={outputUrl}
                      download={`animation_${videoFile.name.split('.')[0]}.gif`}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      <span>Retrieve Animation</span>
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
        High-fidelity motion rasterization core. Decoupled animation structures for intergalactic sharing.
      </p>
    </div>
  );
}
