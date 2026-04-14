"use client";

import React, { useState, useRef } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import FileUploader from "@/components/tools/shared/FileUploader";
import ToolOptionsDrawer from "@/components/tools/shared/ToolOptionsDrawer";
import { cropImage, downloadBlob } from "@/utils/imaging";

export default function ImageCropper() {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height), width, height));
    }
  };

  const executeCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsProcessing(true);
    
    try {
      // Calculate coordinates relative to original image if needed, 
      // but canvas drawImage handle source rect naturally.
      const blob = await cropImage(imgSrc, completedCrop);
      downloadBlob(blob, `spacery_crop_${Date.now()}.webp`);
    } catch (err) {
      console.error("Crop error:", err);
      alert("Sector cutting failed. Target coordinates unstable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (newAspect && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 90 }, newAspect, width, height), width, height));
    } else {
      setCrop(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {!imgSrc ? (
        <FileUploader accept="image/*" label="Initialize Visual Signal" onFileSelect={onSelectFile} />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 md:p-8 flex items-center justify-center min-h-[400px]">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-h-[600px]"
            >
              <img
                ref={imgRef}
                alt="Crop Source"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-w-full max-h-[500px] object-contain rounded-lg"
              />
            </ReactCrop>
          </div>

          <ToolOptionsDrawer title="Crop Calibration">
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Target Aspect Ratio</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Free Form", value: undefined },
                    { label: "1:1 (Square)", value: 1 },
                    { label: "16:9 (Cinema)", value: 16/9 },
                    { label: "4:3 (Legacy)", value: 4/3 },
                    { label: "9:16 (Story)", value: 9/16 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAspectChange(opt.value)}
                      className={`py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-widest border transition-all ${
                        aspect === opt.value 
                          ? "bg-sky-500 text-white border-sky-400" 
                          : "bg-white/2 text-slate-500 border-white/5 hover:border-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10">
                 <span className="block text-[8px] font-mono text-sky-400/60 uppercase mb-2">Selection Data</span>
                 <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
                    <span>W: {Math.round(completedCrop?.width || 0)}px</span>
                    <span>H: {Math.round(completedCrop?.height || 0)}px</span>
                    <span>X: {Math.round(completedCrop?.x || 0)}px</span>
                    <span>Y: {Math.round(completedCrop?.y || 0)}px</span>
                 </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={executeCrop}
                  disabled={!completedCrop || isProcessing}
                  className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.2)] disabled:opacity-50"
                >
                  {isProcessing ? "Extracting Sector..." : "Execute Crop"}
                </button>
                <button
                  onClick={() => { setImgSrc(""); setCrop(undefined); }}
                  className="py-3 text-[10px] font-mono text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Eject Signal
                </button>
              </div>
            </div>
          </ToolOptionsDrawer>
        </div>
      )}
    </div>
  );
}
