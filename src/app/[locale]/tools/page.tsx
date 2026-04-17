"use client";

import React, { useState, useRef } from "react";
import { Link } from "@/i18n/routing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TOOLS, ToolCategory } from "@/data/tools";
import { useTranslations } from "next-intl";

const CATEGORIES: ("All" | ToolCategory)[] = ["All", "Imaging", "Motion", "Documents", "Data", "Calculations"];

export default function ToolsArchive() {
  const t = useTranslations("Tools");
  const td = useTranslations("ToolsData");
  const [activeCategory, setActiveCategory] = useState<"All" | ToolCategory>("All");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTools = activeCategory === "All" 
    ? TOOLS 
    : TOOLS.filter(t => t.category === activeCategory);

  useGSAP(() => {
    gsap.fromTo(".archive-header", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    
    gsap.fromTo(".tool-card-archive", 
      { opacity: 0, scale: 0.9, y: 20 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.05, 
        ease: "power2.out",
        overwrite: "auto" 
      }
    );
  }, [activeCategory]);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-40 pb-20 md:pb-32 px-4 md:px-8 flex flex-col items-center select-none overflow-x-hidden">
      
      {/* Header Area */}
      <div className="max-w-6xl w-full archive-header">
        <div className="mb-8 md:mb-12">
            <Link href="/" className="text-[9px] md:text-[10px] font-mono text-slate-600 hover:text-sky-400 transition-colors uppercase tracking-[0.4em] ml-1">
              {t("archive.return")}
            </Link>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-linear-to-r from-sky-300 via-white to-sky-100 bg-clip-text text-transparent px-1">
          {t("archive.title")}
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-12 md:mb-16 leading-relaxed px-1">
          {t("archive.description")}
        </p>

        {/* Filter Navigation - Scrollable on Mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-16 md:mb-20">
          <div className="flex gap-3 min-w-max pb-4 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-mono transition-all duration-300 border ${
                  activeCategory === cat 
                    ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]" 
                    : "bg-white/2 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/5"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredTools.map((tool) => (
              <Link 
                href={`/tools/${tool.category.toLowerCase()}/${tool.slug}`} 
                key={tool.slug} 
                className="tool-card-archive group relative overflow-hidden rounded-[24px] bg-[#060b19]/60 backdrop-blur-xl border border-white/5 p-5 md:p-8 transition-all duration-500 hover:bg-white/5 hover:border-sky-400/30 hover:shadow-[0_20px_60px_-15px_rgba(56,189,248,0.15)] block"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sky-400/0 via-sky-400/0 to-sky-400/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] font-mono text-sky-400/60 uppercase tracking-[0.2em] border border-sky-400/20 px-3 py-1 rounded-full">{tool.category}</span>
                  {tool.isComingSoon && <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest px-2 py-0.5 border border-purple-500/30 rounded">Coming Soon</span>}
                </div>

                <h3 className="relative z-10 text-xl font-bold mb-3 text-slate-100 group-hover:text-sky-400 transition-colors duration-300">
                  {td(`${tool.slug}.title`)}
                </h3>
                <p className="relative z-10 text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
                  {td(`${tool.slug}.desc`)}
                </p>
                
                <div className="relative z-10 mt-8 flex items-center text-[10px] font-mono text-sky-500/70 uppercase tracking-[0.2em] group-hover:translate-x-2 group-hover:text-sky-400 transition-all duration-500">
                  {t("initiate")} <span className="ml-3 transition-transform group-hover:scale-125">→</span>
                </div>
              </Link>
           ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="py-32 text-center text-slate-600 font-mono uppercase tracking-widest animate-pulse">
            {t("archive.empty")}
          </div>
        )}
      </div>
    </div>
  );
}
