"use client";

import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileUploader from "../shared/FileUploader";
import ToolOptionsDrawer from "../shared/ToolOptionsDrawer";

export default function VideoAudioRemover() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
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
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOutputUrl(null);
    setProgress(0);
  };

  const loadFFmpeg = async () => {
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      checkSecurity();
      // Using locally hosted assets for stability
      await ffmpeg.load({
        coreURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`/assets/ffmpeg/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
    } catch (err) {
      console.error("[STATION-ERROR] Audio Stripper initialization failure:", err);
      throw err;
    }
  };

  const muteVideo = async () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      if (!ffmpegRef.current) {
        await loadFFmpeg();
      }
      const ffmpeg = ffmpegRef.current;
      const { name } = videoFile;
      
      await ffmpeg.writeFile(name, await fetchFile(videoFile));
      
      // -an: Remove audio
      // -c:v copy: Copy video stream without re-encoding (lightning fast)
      await ffmpeg.exec(["-i", name, "-an", "-c:v", "copy", "output.mp4"]);
      
      const data = await ffmpeg.readFile("output.mp4") as any;
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
      setOutputUrl(url);
    } catch (error) {
      console.error("FFmpeg error:", error);
      alert("Motion stream synchronization failed. System protocols compromised.");
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
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 flex items-center justify-center min-h-[300px] relative overflow-hidden">
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
                  Stripping Audio Manifest...
                </span>
              </div>
            )}
            
            <video 
              src={outputUrl || previewUrl || ""} 
              controls 
              className="max-w-full max-h-[450px] rounded-xl shadow-2xl"
            />
          </div>

          <ToolOptionsDrawer title="Audio Removal Specs">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                    <span className="block text-[8px] font-mono text-slate-600 uppercase mb-1">Source Resolution</span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{videoFile.name.split('.').pop()?.toUpperCase()} | {formatSize(videoFile.size)}</span>
                 </div>
                 
                 {!outputUrl ? (
                    <button
                      onClick={muteVideo}
                      disabled={isProcessing}
                      className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Remove Audio"}
                    </button>
                 ) : (
                    <a
                      href={outputUrl}
                      download={`silenced_${videoFile.name}`}
                      className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center gap-3 animate-in zoom-in-95"
                    >
                      <span>Retrieve Stream</span>
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
        High-fidelity audio remover. Vacuum-sealed silence guaranteed.
      </p>
    </div>
  );
}
