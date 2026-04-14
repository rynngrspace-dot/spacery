import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { TOOLS } from "@/data/tools";
import Magnetic from "./Magnetic";

export default function ToolGrid() {
  const container = useRef<HTMLDivElement>(null);

  const featuredTools = [
    TOOLS.find(t => t.slug === "image-compressor"),
    TOOLS.find(t => t.slug === "video-compressor"),
    TOOLS.find(t => t.slug === "pdf-compressor"),
    TOOLS.find(t => t.slug === "json-formatter"),
    TOOLS.find(t => t.slug === "unit-converter"),
    TOOLS.find(t => t.slug === "image-filters"),
  ].filter(Boolean);

  useGSAP(() => {
    // ... animation logic remains same ...
    gsap.fromTo(".tools-title", 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=100px",
          toggleActions: "play none none none",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }
    );

    gsap.fromTo(".tool-card", 
      { y: 80, opacity: 0 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom-=200px", 
          toggleActions: "play none none none",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    gsap.fromTo(".view-more-btn",
      { opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: ".view-more-btn",
          start: "top bottom-=50px",
        },
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.6,
        ease: "back.out(1.7)"
      }
    );
  }, { scope: container });

  return (
    <section id="tools" ref={container} className="relative z-10 w-full py-20 md:py-32 px-4 md:px-8 flex flex-col items-center overflow-x-hidden">
      <div className="max-w-6xl w-full">
        <h2 className="tools-title text-3xl sm:text-5xl font-bold mb-12 md:mb-16 text-center bg-linear-to-r from-sky-300 to-white bg-clip-text text-transparent underline decoration-sky-500/20 underline-offset-8">
          Featured Laboratories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {featuredTools.map((tool, i) => tool && (
            <Link href={`/tools/${tool.category.toLowerCase()}/${tool.slug}`} key={i} className="tool-card group cursor-pointer relative overflow-hidden rounded-[24px] bg-[#060b19]/60 backdrop-blur-xl border border-white/5 p-5 md:p-10 transition-all duration-500 hover:bg-white/5 hover:border-sky-400/30 hover:shadow-[0_20px_60px_-15px_rgba(56,189,248,0.15)] block">
              <div className="absolute inset-0 bg-linear-to-br from-sky-400/0 via-sky-400/0 to-sky-400/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono text-sky-400/60 uppercase tracking-[0.2em] border border-sky-400/20 px-3 py-1 rounded-full">{tool.category}</span>
                {tool.isComingSoon && <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest px-2 py-0.5 border border-purple-500/30 rounded">Coming Soon</span>}
              </div>

              <h3 className="relative z-10 text-xl md:text-2xl font-bold mb-4 text-slate-100 group-hover:text-sky-400 transition-colors duration-300">
                {tool.title}
              </h3>
              <p className="relative z-10 text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 text-sm">
                {tool.desc}
              </p>
              
              <div className="relative z-10 mt-8 md:mt-10 flex items-center text-[10px] md:text-[11px] font-mono text-sky-500/70 uppercase tracking-[0.2em] group-hover:translate-x-2 group-hover:text-sky-400 transition-all duration-500">
                Initiate Module <span className="ml-3 transition-transform group-hover:scale-125">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center view-more-btn">
          <Magnetic>
            <Link 
              href="/tools" 
              className="group relative px-12 py-5 bg-white/5 border border-white/10 rounded-full text-white text-sm font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-white/10 hover:border-sky-500/50 hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]"
            >
              <div className="absolute inset-0 bg-linear-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              View All Modules
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
