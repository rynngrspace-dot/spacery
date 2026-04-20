"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stage, 
  useGLTF, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Float,
  PresentationControls
} from "@react-three/drei";
import { useTranslations } from "next-intl";

// Home Staging Catalog
const MODELS = [
  { 
    name: "Modern Chair", 
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/SheenChair/glTF-Binary/SheenChair.glb",
    scale: 2.5
  },
  { 
    name: "Luxury Sofa", 
    url: "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Sofa.glb",
    scale: 0.05 // Google's sofa model often has large world coordinates
  },
  { 
    name: "Antique Lantern", 
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Lanterne/glTF-Binary/Lanterne.glb",
    scale: 2.0
  },
  { 
    name: "Cactus Flower", 
    url: "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Cactus.glb",
    scale: 4.0
  }
];

function Model({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url);
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive object={scene} scale={[scale, scale, scale]} />
    </Float>
  );
}

export default function AR3DVision() {
  const t = useTranslations("Tools");
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [isRotateEnabled, setIsRotateEnabled] = useState(true);
  const [isRealityMode, setIsRealityMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Zoom & Hardware Controls
  const [zoom, setZoom] = useState(1);
  const [zoomRange, setZoomRange] = useState({ min: 1, max: 1 });
  const [isZoomSupported, setIsZoomSupported] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  const toggleRealityMode = async () => {
    if (isRealityMode) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        videoTrackRef.current = null;
      }
      setIsRealityMode(false);
      setIsZoomSupported(false);
    } else {
      // Check for Secure Context / MediaDevices availability
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is only available in Secure Contexts (HTTPS or localhost). If you are on a mobile device via IP, please use HTTPS or Port Forwarding.");
        return;
      }

      try {
        const constraints = {
          video: { 
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 }, // Prefer higher res for staging
            height: { ideal: 1080 }
          }
        };
        
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        const track = newStream.getVideoTracks()[0];
        videoTrackRef.current = track;

        // Check for zoom capabilities (Chromium based typically)
        // @ts-ignore - getCapabilities is not in standard TS lib yet
        const capabilities = (track.getCapabilities?.() || {}) as any;
        if (capabilities.zoom) {
          setIsZoomSupported(true);
          setZoomRange({ min: capabilities.zoom.min, max: capabilities.zoom.max });
          setZoom(capabilities.zoom.min);
        }
        
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setIsRealityMode(true);
      } catch (err) {
        console.error("Camera access failed:", err);
        alert(`Camera access failed: ${err instanceof Error ? err.name : "Unknown Error"}.`);
      }
    }
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);
    if (videoTrackRef.current) {
      // @ts-ignore
      videoTrackRef.current.applyConstraints({
        advanced: [{ zoom: value }]
      }).catch(err => console.error("Zoom apply failed:", err));
    }
  };

  const captureScene = () => {
    // Fallback search if ref.current is not the DOM element (R3F behavior)
    const activeCanvas = canvasRef.current instanceof HTMLCanvasElement 
      ? canvasRef.current 
      : document.querySelector('canvas');

    if (!videoRef.current || !activeCanvas) {
      alert("System not ready for capture. Please try again.");
      return;
    }

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = videoRef.current.videoWidth || 1920;
    exportCanvas.height = videoRef.current.videoHeight || 1080;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // 1. Draw video background
    if (isRealityMode) {
      ctx.drawImage(videoRef.current, 0, 0, exportCanvas.width, exportCanvas.height);
    } else {
      ctx.fillStyle = "#010205";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    // 2. Draw 3D Canvas on top
    ctx.drawImage(activeCanvas, 0, 0, exportCanvas.width, exportCanvas.height);

    // 3. Trigger Download
    const link = document.createElement("a");
    link.download = `spacery-vision-${MODELS[activeModelIndex].name.toLowerCase().replace(/\s/g, '-')}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col w-full h-[75vh] md:h-[80vh] bg-[#010205]/40 rounded-[32px] overflow-hidden border border-white/5 relative group">
      
      {/* Reality Mode - Video Feed Layer */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          isRealityMode ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 3D Canvas Layer */}
      <div className={`absolute inset-0 z-10 ${isRealityMode ? 'bg-transparent' : 'bg-slate-950/40'}`}>
        <Canvas 
          ref={canvasRef}
          shadows="percentage" 
          dpr={1} 
          gl={{ 
            preserveDrawingBuffer: true, 
            alpha: true,
            powerPreference: "high-performance",
            antialias: false
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
            
            <Stage intensity={0.5} environment="city" adjustCamera={false}>
               <Model 
                 url={MODELS[activeModelIndex].url} 
                 scale={MODELS[activeModelIndex].scale} 
               />
            </Stage>

            <OrbitControls 
              makeDefault 
              autoRotate={!isRealityMode && isRotateEnabled} 
              autoRotateSpeed={1.5}
              enableDamping={true}
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
            
            {!isRealityMode && <Environment preset="city" blur={0.8} />}
            <ContactShadows 
              position={[0, -1.5, 0]} 
              opacity={isRealityMode ? 0.7 : 0.4} 
              scale={10} 
              blur={2.5} 
              far={4} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-20 w-full h-full p-4 md:p-6 flex flex-col justify-between pointer-events-none">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="bg-[#010205]/70 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isRealityMode ? 'bg-rose-500 animate-pulse' : 'bg-sky-500'}`}></div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                  {isRealityMode ? 'Reality Mode' : 'Studio Mode'}
                </span>
                <h4 className="text-white text-xs font-bold uppercase tracking-tight">{MODELS[activeModelIndex].name}</h4>
              </div>
           </div>

           <div className="flex items-center gap-2 pointer-events-auto">
             <button 
                onClick={captureScene}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-md"
             >
                <span className="text-[10px] font-bold uppercase tracking-widest">Capture</span>
                <span className="text-lg">📸</span>
             </button>

             <button 
               onClick={toggleRealityMode}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all backdrop-blur-md ${
                 isRealityMode 
                 ? 'bg-rose-600 text-white border-rose-500' 
                 : 'bg-sky-600 text-white border-sky-500'
               }`}
             >
                <span className="text-[10px] font-bold uppercase tracking-widest">{isRealityMode ? 'Exit AR' : 'Enter AR'}</span>
                <span className="text-lg">🤳</span>
             </button>

             <button 
               onClick={() => setIsRotateEnabled(!isRotateEnabled)}
               className={`bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-xl transition-all ${
                 isRotateEnabled && !isRealityMode ? 'text-sky-400' : 'text-slate-500'
               }`}
             >
                <span className="text-lg">🔄</span>
             </button>
           </div>
        </div>

        {/* Model Switcher Footer */}
        <div className="w-full flex flex-col items-center gap-6">
           
           {/* Navigation Hint */}
           <div className="bg-[#010205]/60 border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl">
              <span className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.3em]">
                {isRealityMode ? 'Place furniture in your room' : 'Drag to rotate // Scroll to zoom'}
              </span>
           </div>

           {/* Model Selector */}
           <div className="pointer-events-auto flex items-center gap-2 p-1.5 bg-[#060b19]/80 backdrop-blur-2xl border border-white/10 rounded-[28px] max-w-full overflow-x-auto no-scrollbar">
              {MODELS.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModelIndex(idx)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[9px] font-mono transition-all duration-300 uppercase tracking-widest ${
                    activeModelIndex === idx 
                    ? "bg-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {model.name}
                </button>
              ))}
           </div>
        </div>

        {/* Zoom Control Overlay - Floating Vertical Slider */}
        {isRealityMode && isZoomSupported && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-auto bg-[#010205]/40 backdrop-blur-xl border border-white/10 p-4 rounded-full group/zoom">
            <span className="text-[9px] font-mono text-sky-400 font-bold">Z</span>
            <div className="h-40 w-8 relative flex items-center justify-center">
              <input 
                type="range"
                min={zoomRange.min}
                max={zoomRange.max}
                step={0.1}
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="absolute w-40 -rotate-90 appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400">{zoom.toFixed(1)}x</span>
          </div>
        )}
      </div>

      {/* Overlay Glows */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-sky-400/5 to-transparent z-5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

    </div>
  );
}
