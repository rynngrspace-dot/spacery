"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "@/components/Magnetic";

export default function AboutPage() {
  const container = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useGSAP(() => {
    gsap.fromTo(".dossier-element", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen pt-40 pb-32 px-8 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="dossier-element flex flex-col md:flex-row items-center gap-16 mb-32">
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-[300px] h-[400px] border border-white/5 bg-[#060b19]/40 backdrop-blur-2xl rounded-[32px] flex items-center justify-center p-4 relative overflow-hidden group">
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/[0.03] to-transparent bg-[length:100%_4px] animate-pulse" />
              <div className="w-full h-full bg-[#0d1a38] rounded-[24px] flex items-center justify-center text-8xl grayscale group-hover:grayscale-0 transition-all duration-700">
                👨‍🔬
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-mono text-sky-500 uppercase tracking-[0.4em] mb-4 block">Personnel Dossier: #001</span>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent mb-8">
              The Guy Behind the Screen
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
              Just a human who spends too much time staring at glowing rectangles. I like building fast things, cool things, and sometimes things that exist purely because they look awesome. Welcome to my corner of the void.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { label: "Main Hustle", value: "Turning caffeine into lines of high-performance code." },
            { label: "Current Orbit", value: "Remote Hub / GMT+7" },
            { label: "Signal Status", value: "Available for Cool Stuff" }
          ].map((stat, i) => (
            <div key={i} className="dossier-element bg-white/5 border border-white/5 p-10 rounded-[24px] backdrop-blur-lg">
              <div className="text-xs font-mono text-sky-500 uppercase tracking-widest mb-4">{stat.label}</div>
              <div className="text-xl text-white font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="dossier-element w-full text-center">
          <Magnetic>
            <button className="font-mono text-sm px-10 py-4 rounded-full border border-sky-400/30 text-sky-400 hover:bg-sky-400/10 hover:border-sky-400 hover:text-white transition-all duration-300">
              SAY HELLO
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
