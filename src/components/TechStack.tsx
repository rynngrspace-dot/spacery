"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const skills = [
  { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "TypeScript"], size: "large", icon: "⚛️" },
  { name: "Animations", items: ["GSAP", "Framer Motion", "Lenis"], size: "medium", icon: "✨" },
  { name: "Laboratory Tools", items: ["Node.js", "File API", "Wasm"], size: "medium", icon: "🧪" },
  { name: "Exploration", items: ["Three.js", "Creative Coding"], size: "small", icon: "🚀" },
];

export default function TechStack() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".stack-card", 
      { scale: 0.9, opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=100px",
          toggleActions: "play none none none",
        },
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, { scope: container });

  return (
    <section id="stack" ref={container} className="relative z-10 w-full min-h-screen py-20 md:py-32 px-4 md:px-8 flex flex-col items-center bg-grid overflow-x-hidden">
      <div className="max-w-5xl w-full">
        <h2 className="text-3xl sm:text-5xl font-bold mb-12 md:mb-16 text-center bg-linear-to-r from-sky-300 to-white bg-clip-text text-transparent px-4 uppercase tracking-tighter">
          The Tech I Crash-Landed With
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
          {/* Large Card */}
          <div className="stack-card md:col-span-2 md:row-span-2 bg-[#060b19]/60 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col justify-between group hover:border-sky-400/30 transition-all duration-500">
            <div>
              <div className="text-3xl md:text-4xl mb-4">{skills[0].icon}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{skills[0].name}</h3>
              <p className="text-slate-400 mb-8 text-sm md:text-base">Building robust, high-performance user interfaces with modern frameworks.</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {skills[0].items.map(item => (
                <span key={item} className="px-3 py-1.5 md:px-4 md:py-2 bg-sky-500/10 text-sky-400 rounded-full text-[10px] md:text-sm font-mono border border-sky-500/20">{item}</span>
              ))}
            </div>
          </div>

          {/* Medium Card 1 */}
          <div className="stack-card md:col-span-2 md:row-span-1 bg-[#060b19]/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-6 md:p-8 flex items-center justify-between group hover:border-sky-400/30 transition-all duration-500">
            <div className="flex-1">
              <div className="text-2xl md:text-3xl mb-3">{skills[1].icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{skills[1].name}</h3>
              <div className="flex flex-wrap gap-2">
                {skills[1].items.map(item => (
                  <span key={item} className="text-slate-500 text-[10px] md:text-sm font-mono italic">#{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Medium Card 2 */}
          <div className="stack-card md:col-span-1 md:row-span-1 bg-[#060b19]/40 backdrop-blur-xl border border-white/5 rounded-[24px] p-8 flex flex-col justify-center items-center group hover:border-sky-400/30 transition-all duration-500 text-center">
            <div className="text-3xl mb-3">{skills[2].icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{skills[2].name}</h3>
            <div className="flex flex-col gap-1">
               {skills[2].items.map(item => (
                  <span key={item} className="text-slate-500 text-xs font-mono">{item}</span>
                ))}
            </div>
          </div>

          {/* Small Card */}
          <div className="stack-card md:col-span-1 md:row-span-1 bg-linear-to-br from-sky-500/20 to-transparent backdrop-blur-xl border border-sky-400/20 rounded-[24px] p-8 flex flex-col justify-center items-center group hover:border-sky-400/50 transition-all duration-500 text-center">
            <div className="text-3xl mb-2">{skills[3].icon}</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tighter italic">Coming Soon</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
