"use client";

import React, { useState, useRef, useEffect } from "react";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";
import Script from "next/script";

declare global {
  interface Window {
    ImageTracer: any;
  }
}

export default function PngToSvg() {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const onSelectFile = async (file: File) => {
    setError(null);
    setSvgOutput(null);
    setStatus("uploading");
    setProgress(0);

    const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 25 : prev));
    }, 20);

    await new Promise(res => setTimeout(res, 200));
    clearInterval(interval);

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type) && !file.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/)) {
      setError("Protocol Violation: Targeted raster pixels must be PNG, JPG, or WEBP.");
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
      setError("Failed to load image signal.");
      setStatus("idle");
    }
  };

  const handleTrace = () => {
    if (!window.ImageTracer || !imgSrc) {
      setError("Tracing engine not ready. Check galactic connection.");
      return;
    }

    setStatus("processing");
    setProgress(10);

    // ImageTracer is synchronous but can be heavy, so we wrap it to keep UI responsive
    setTimeout(() => {
      try {
        setProgress(40);
        window.ImageTracer.imageToSVG(
          imgSrc,
          (svgstr: string) => {
            setSvgOutput(svgstr);
            setProgress(100);
            setStatus("done");
          },
          { 
            ltres: 1, 
            qtres: 1, 
            pathomit: 8, 
            rightangleenhance: true,
            colorsampling: 1, // 0: No grouping, 1: Simple grouping, 2: Fancy grouping
            numberofcolors: 16,
            mincolorratio: 0.02,
            colorquantcycles: 3
          }
        );
      } catch (err) {
        console.error("Tracing failed:", err);
        setError("Vectorization protocol failed. Complexity threshold exceeded.");
        setStatus("idle");
      }
    }, 100);
  };

  const downloadSvg = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${originalName}_vectorized.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-10">
      <Script 
        src="https://cdn.jsdelivr.net/gh/jspanic/imagetracerjs/imagetracer_v1.2.6.js" 
        onLoad={() => setIsScriptLoaded(true)}
      />

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold">!</div>
          <span className="text-[11px] font-mono text-slate-400">{error}</span>
        </div>
      )}

      {!imgSrc ? (
        <FileUploader 
          accept="image/png,image/jpeg,image/webp" 
          label="Capture Raster Target" 
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
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] font-bold mb-2">Tracing Paths...</span>
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
                        <span className="text-[9px] font-mono text-slate-500 uppercase mb-6">Vector image ready</span>
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
            
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Source Pixels</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc} alt="Source" className="max-w-full max-h-[300px] object-contain rounded-lg opacity-40 brightness-50" />
              </div>
              
              {svgOutput && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest">Vector Result</span>
                  <div 
                    className="bg-white/5 rounded-xl p-4 flex items-center justify-center border border-sky-500/20 h-[250px]"
                    dangerouslySetInnerHTML={{ __html: svgOutput }}
                  />
                </div>
              )}
            </div>
          </div>

          <ToolOptionsDrawer title="Vector Engine">
            <div className="space-y-8">
              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
                <p className="text-[10px] font-mono text-slate-400 leading-relaxed uppercase tracking-widest">
                  Using high-fidelity path tracing to synthesize scalable vector geometry from raster pixels.
                </p>
              </div>

              {!svgOutput ? (
                <button
                  onClick={handleTrace}
                  disabled={status !== "idle" || !isScriptLoaded}
                  className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] disabled:opacity-30"
                >
                  {status === "processing" ? "Converting..." : "Convert to SVG"}
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={downloadSvg}
                    className="w-full py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                  >
                    <span>Download SVG</span>
                    <span className="animate-bounce">↓</span>
                  </button>
                  <button onClick={() => { setImgSrc(""); setSvgOutput(null); }} className="py-2 text-[10px] font-mono text-slate-600 hover:text-white transition-colors uppercase tracking-widest text-center">Reset</button>
                </div>
              )}
            </div>
          </ToolOptionsDrawer>
        </div>
      )}
    </div>
  );
}
