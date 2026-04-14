"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface UnderConstructionProps {
  title: string;
  category?: string;
  status?: string;
}

export default function UnderConstruction({ title, category, status = "Off-Line" }: UnderConstructionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Holographic gear rotation
    gsap.to(gearRef.current, {
      rotate: 360,
      duration: 15,
      repeat: -1,
      ease: "none"
    });

    // Fade in text
    gsap.fromTo(".construction-content", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center py-20 px-6 min-h-[400px]">
      
      {/* Holographic Element */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 mb-12">
        <div ref={gearRef} className="absolute inset-0 border-2 border-sky-500/20 rounded-full flex items-center justify-center">
            <div className="w-[80%] h-[80%] border border-dashed border-sky-400/40 rounded-full animate-pulse" />
            <div className="absolute w-2 h-2 bg-sky-400 rounded-full top-0 left-1/2 -ml-1 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-6xl grayscale opacity-50">🛠️</span>
        </div>
        {/* Glow behind */}
        <div className="absolute inset-4 bg-sky-500/10 blur-3xl rounded-full" />
      </div>

      <div className="construction-content text-center max-w-md">
        <div className="inline-block px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full mb-6">
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em]">Module: {status}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase tracking-tighter">
          {title} Under Recalibration
        </h2>
        
        <p className="text-sm font-mono text-slate-500 leading-relaxed mb-10">
          Our engineering droids are currently synthesising the logic circuits for the <span className="text-sky-400">{category || "requested"}</span> module. 
          Signal stability is expected within the next hardware refresh cycle.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools"
              className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-[10px] font-mono uppercase tracking-widest"
            >
              Return to Archives
            </Link>
            <Link 
              href="/"
              className="px-8 py-3 bg-sky-500 text-white font-bold rounded-xl hover:bg-sky-400 transition-all text-[10px] font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              Back to Bridge
            </Link>
        </div>
      </div>

      {/* Background gibberish */}
      <div className="absolute bottom-10 left-10 p-4 border-l border-white/5 opacity-10 pointer-events-none hidden lg:block">
        <pre className="text-[8px] font-mono text-slate-500 leading-tight">
          SCAN_SECTOR: 7F-9A-02<br />
          LOGIC_STATE: UNSTABLE<br />
          RECOVERY_PROTOCOL: ACTIVE<br />
          HARDWARE_REQ: VORTEX_GEN_3
        </pre>
      </div>

    </div>
  );
}
