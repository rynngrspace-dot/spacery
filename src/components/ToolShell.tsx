"use client";

import React from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Tool } from "@/data/tools";

interface ToolShellProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolShell({ tool, children }: ToolShellProps) {
  useGSAP(() => {
    gsap.fromTo(".tool-header", 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    gsap.fromTo(".tool-content-area", 
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: "power3.out" }
    );
  }, [tool.slug]);

  return (
    <div className="min-h-screen bg-[#010205] text-slate-200 pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8 flex flex-col items-center overflow-x-hidden">
      <div className="max-w-5xl w-full">
        
        {/* Navigation & Breadcrumbs */}
        <div className="tool-header flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-12 gap-6">
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <Link 
              href="/tools" 
              className="group flex items-center justify-center sm:justify-start gap-3 w-full sm:w-fit px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-slate-400 hover:text-sky-400 hover:border-sky-500/30 transition-all uppercase tracking-[0.2em]"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              <span>Back to Archives</span>
            </Link>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-mono text-slate-600 uppercase tracking-widest ml-1 overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 scrollbar-hide">
              <span>Bridge</span>
              <span className="opacity-30">/</span>
              <span className="text-slate-400">Archives</span>
              <span className="opacity-30">/</span>
              <span className="text-sky-400/80">{tool.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-full px-5 py-2 w-full sm:w-auto justify-center">
             <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
             <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">Module Status: Operational</span>
             <span className="text-[10px] font-mono text-slate-700 hidden sm:inline">|</span>
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] hidden sm:inline">{tool.category}</span>
          </div>
        </div>

        {/* Tool Branding Header */}
        <div className="tool-header mb-12 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            {tool.title}
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
            {tool.desc}
          </p>
        </div>

        {/* The Action Area */}
        <div className="tool-content-area relative w-full bg-[#060b19]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
           <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sky-500/20 to-transparent"></div>
           <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sky-500/10 to-transparent"></div>
           
           <div className="p-6 md:p-12">
             {children}
           </div>
        </div>

        {/* Technical Metadata Footer for the Lab */}
        <div className="tool-header mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
           <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
              <span className="block text-[10px] font-mono text-sky-500 uppercase tracking-widest mb-3">Security Protocol</span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">End-to-end encryption active. No data leaves the local orbital environment. Private by design.</p>
           </div>
           <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
              <span className="block text-[10px] font-mono text-sky-500 uppercase tracking-widest mb-3">Performance Data</span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">Latency: 0.02ms. Engine: Next/Rust Hybrid. High performance mode initialized.</p>
           </div>
           <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
              <span className="block text-[10px] font-mono text-sky-500 uppercase tracking-widest mb-3">Module Context</span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">This module is part of the Spacery 2.0 Lab grid. Regularly updated via orbital patches.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
