"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".contact-content", 
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: container.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, { scope: container });

  return (
    <footer id="contact" ref={container} className="relative z-10 w-full py-32 px-8 flex flex-col items-center border-t border-white/5 bg-[#010205]">
      <div className="max-w-4xl w-full text-center contact-content">
        <h2 className="text-4xl sm:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
          Found My Frequency?
        </h2>
        <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">
          I&apos;m usually floating somewhere between GMT+7 and the Moon. If you&apos;ve got a cool project or just want to talk about aliens (or React), hit me up!
        </p>

        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          <Magnetic>
            <a href="mailto:hello@spacery.com" className="group flex flex-col items-center">
              <span className="text-sm font-mono text-sky-400 mb-2 uppercase tracking-widest group-hover:text-white transition-colors">Email Channel</span>
              <span className="text-2xl font-semibold text-white">hello@spacery.com</span>
            </a>
          </Magnetic>

          <Magnetic>
            <a href="https://github.com/spacery" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center">
              <span className="text-sm font-mono text-sky-400 mb-2 uppercase tracking-widest group-hover:text-white transition-colors">GitHub Repository</span>
              <span className="text-2xl font-semibold text-white">@spacery</span>
            </a>
          </Magnetic>
        </div>

        <div className="mt-32 pt-16 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm font-mono text-slate-500 tracking-wider">
            © 2026 SPACERY LABORATORY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 group">
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Lat: 0.123N / Long: 1.456W</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
