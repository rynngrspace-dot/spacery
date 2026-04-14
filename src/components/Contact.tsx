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
    <footer id="contact" ref={container} className="relative z-10 w-full py-20 md:py-32 px-3 md:px-8 flex flex-col items-center border-t border-white/5 bg-[#010205]">
      <div className="max-w-4xl w-full text-center contact-content">
        <h2 className="text-4xl sm:text-6xl font-bold mb-8 bg-linear-to-r from-white to-slate-500 bg-clip-text text-transparent">
          Spacery Laboratory
        </h2>
        <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">
          Experimental digital foundry for the curious and the brave. 🛸
        </p>

        <div className="mt-20 pt-16 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm font-mono text-slate-500 tracking-wider">
            © 2026 SPACERY LABORATORY. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
}
