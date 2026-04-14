"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

const games = [
  { slug: "space-typer", title: "Space Typer", desc: "Test your transmission speeds against the cosmic void. Fast fingers only.", icon: "⌨️" },
  { slug: "cosmic-clicker", title: "Cosmic Clicker", desc: "Mine dark matter with every click. Build your galactic empire.", icon: "🖱️" },
  { slug: "orbit-defense", title: "Orbit Defense", desc: "Protect your laboratory from incoming space debris.", icon: "🛰️" },
  { slug: "void-runner", title: "Void Runner", desc: "An experimental reflex-based traversal simulation.", icon: "🏃" },
];

export default function GameGrid() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Stagger animate game cards
    gsap.fromTo(".game-card", 
      { y: 80, opacity: 0, rotate: 2 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=200px", 
          toggleActions: "play none none none",
        },
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }
    );
  }, { scope: container });

  return (
    <section id="games" ref={container} className="relative z-10 w-full py-20 md:py-32 px-4 md:px-8 flex flex-col items-center overflow-x-hidden">
      <div className="max-w-5xl w-full">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em] mb-4 block">Section: Recreation Wing</span>
            <h2 className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-purple-400 to-white bg-clip-text text-transparent">
              Experimental Recreation
            </h2>
          </div>
          <p className="text-slate-600 font-mono text-[9px] uppercase mb-2 tracking-[0.2em] text-center md:text-right">Unauthorized access encouraged</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {games.map((game, i) => (
            <Link href={`/games/${game.slug}`} key={i} className="game-card group cursor-pointer relative overflow-hidden rounded-[24px] bg-[#0d0714]/60 backdrop-blur-xl border border-white/5 p-5 md:p-10 transition-all duration-300 hover:bg-white/5 hover:border-purple-400/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.15)] block">
              {/* Purple Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 via-purple-500/0 to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              
              <div className="relative z-10 text-3xl md:text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                {game.icon}
              </div>

              <h3 className="relative z-10 text-xl md:text-2xl font-bold mb-4 text-slate-100 group-hover:text-purple-400 transition-colors duration-300 uppercase tracking-tight">
                {game.title}
              </h3>
              <p className="relative z-10 text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 text-sm">
                {game.desc}
              </p>
              
              <div className="relative z-10 mt-8 flex items-center text-[11px] font-mono text-purple-500/70 uppercase tracking-widest group-hover:translate-x-2 group-hover:text-purple-400 transition-all duration-300">
                Play now <span className="ml-2">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
