"use client";

import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function VideoCutter() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [securityActive, setSecurityActive] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const ffmpegRef = useRef<any>(null);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOutputUrl(null);
    setProgress(0);
  };

  const onLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const dur = e.currentTarget.duration;
    setDuration(dur);
    setEndTime(dur);
  };

  const checkSecurity = () => {
    const isIsolated = window.crossOriginIsolated || typeof SharedArrayBuffer !== "undefined";
    setSecurityActive(isIsolated);
    if (!isIsolated) {
      console.warn("[STATION-SECURITY] Cross-Origin Isolation not detected. FFmpeg mission may fail.");
    }
  };

  const loadFFmpeg = async () => {
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)));
    
    try {
      console.log("[STATION-LOG] Initializing Cutter engine...");
      checkSecurity();
      // Using locally hosted assets for stability
      await ffmpeg.load({
        coreURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.wasm`, "application/wasm"),
      });
      console.log("[STATION-LOG] Cutter engine response stabilized.");
      ffmpegRef.current = ffmpeg;
    } catch (err) {
      console.error("[STATION-ERROR] Cutter initialization failure:", err);
      throw err;
    }
  };

  const cutVideo = async () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      if (!ffmpegRef.current) await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const { name } = videoFile;
      
      await ffmpeg.writeFile(name, await fetchFile(videoFile));

      // -ss: start time
      // -to: end time (or -t for duration)
      // -c copy: lightning fast if we don't need re-encoding
      await ffmpeg.exec([
        "-ss", startTime.toString(),
        "-i", name,
        "-to", (endTime - startTime).toString(),
        "-c", "copy",
        "output.mp4"
      ]);
      
      const data = await ffmpeg.readFile("output.mp4") as any;
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
      setOutputUrl(url);
    } catch (error) {
      console.error("FFmpeg error:", error);
      alert("Motion stream extraction failed. Temporal boundaries corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
                  Extracting Temporal Fragment...
                </span>
              </div>
            )}
            
            <video 
              ref={videoRef}
              src={outputUrl || previewUrl || ""} 
              onLoadedMetadata={onLoadedMetadata}
              controls 
              className="max-w-full max-h-[450px] rounded-xl shadow-2xl"
            />
          </div>

          <ToolOptionsDrawer title="Temporal Boundary Calibration">
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Start Manifest</span>
                      <span className="text-[10px] font-mono text-sky-400 font-bold">{formatTime(startTime)}</span>
                    </div>
                    <input 
                      type="range" min={0} max={duration} step={0.1} value={startTime} 
                      onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.1))}
                      className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                 </div>

                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">End Manifest</span>
                      <span className="text-[10px] font-mono text-sky-400 font-bold">{formatTime(endTime)}</span>
                    </div>
                    <input 
                      type="range" min={0} max={duration} step={0.1} value={endTime} 
                      onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.1))}
                      className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                 </div>

                 <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center">
                    <span className="block text-[8px] font-mono text-slate-600 uppercase mb-1">Extracted Duration</span>
                    <span className="text-sm font-mono text-slate-300 font-bold tracking-widest">{formatTime(endTime - startTime)}</span>
                 </div>
                 
                 {!outputUrl ? (
                    <button
                      onClick={cutVideo}
                      disabled={isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {isProcessing ? "Extracting..." : "Initialize Extraction"}
                    </button>
                 ) : (
                    <a
                      href={outputUrl}
                      download={`cut_${videoFile.name}`}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      <span>Retrieve Stream Fragment</span>
                      <span className="animate-bounce">↓</span>
                    </a>
                 )}

                 <button
                    onClick={() => { setVideoFile(null); setOutputUrl(null); }}
                    className="w-full py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Eject Media
                  </button>
              </div>
            </div>
          </ToolOptionsDrawer>
        </div>
      )}

      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-sm mx-auto leading-relaxed">
        High-precision temporal stream manipulation. Frame-exact extraction protocol.
      </p>
    </div>
  );
}
