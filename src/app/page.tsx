"use client";

import { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import GreetingTyping from "@/components/GreetingTyping";
import ToolGrid from "@/components/ToolGrid";
import Magnetic from "@/components/Magnetic";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import GameGrid from "@/components/GameGrid";
import CoffeeButton from "@/components/CoffeeButton";
import Link from "next/link";

export default function Home() {
  const lenis = useLenis();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleScrollToTools = (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo("#tools", {
      lerp: 0.1,
      duration: 1.5,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Parallax effect values
    const x = (e.clientX - centerX) / 20;
    const y = (e.clientY - centerY) / 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Check for mounting to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (typeof window !== 'undefined') setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full text-slate-200 overflow-x-hidden noise-overlay">
      
      {/* Creative Mouse Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: isMounted ? `radial-gradient(800px circle at ${
            mousePos.x * 10 + (isMounted ? window.innerWidth / 2 : 0)
          }px ${
            mousePos.y * 10 + (isMounted ? window.innerHeight / 2 : 0)
          }px, rgba(56, 189, 248, 0.08), transparent 80%)` : "none"
        }}
      />
      
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16 md:p-8 perspective-1000">
        <div 
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) rotateX(${-mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
            transition: isHovered ? 'transform 0.1s linear' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
          className="w-full max-w-2xl animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] rounded-[24px] bg-[#060b19]/40 backdrop-blur-2xl p-6 text-center opacity-0 sm:p-14 sm:max-w-3xl border border-white/5 relative overflow-hidden shrink-0"
        >
          {/* Internal Reflection Glow */}
          <div 
            className="pointer-events-none absolute inset-0 z-0 opacity-50"
            style={{
              background: `radial-gradient(400px circle at ${50 + mousePos.x}% ${50 + mousePos.y}%, rgba(56, 189, 248, 0.1), transparent)`
            }}
          />
          
          <div className="relative z-10 mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-2xl text-sky-400 border border-sky-500/20">
              🚀
            </div>
          </div>

          <GreetingTyping />
          
          <p className="relative z-10 mx-auto mb-10 max-w-[90%] text-lg font-normal leading-relaxed text-slate-400 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.6s_forwards]">
            Welcome to my digital space. I build tools that are fast, functional, and well-designed. Scroll down to see the latest collection!
          </p>
          
          <div className="relative z-10 flex flex-col items-center justify-center gap-5 sm:flex-row opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.8s_forwards]">
            <Magnetic>
              <button 
                onClick={handleScrollToTools}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-sky-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
              >
                <span>Explore Tools</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </Magnetic>
            
            <Magnetic>
              <Link 
                href="/about"
                className="px-8 py-4 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                About Me
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Specialty Caffeine Section (Transition) */}
      <section className="relative z-20 py-12 flex justify-center">
        <CoffeeButton />
      </section>

      {/* Recreation Wing (Games) Section */}
      <GameGrid />

      {/* Tools Section */}
      <ToolGrid limit={3} />

      {/* Tech Stack Section */}
      <TechStack />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
