"use client";

import React, { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ToolOptionsDrawerProps {
  children: React.ReactNode;
  title?: string;
}

export default function ToolOptionsDrawer({ 
  children, 
  title = "Module Configuration" 
}: ToolOptionsDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(".drawer-content", { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(".drawer-content", { height: 0, opacity: 0, duration: 0.4, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <div className="w-full lg:w-80 flex flex-col bg-white/2 border border-white/5 rounded-[32px] overflow-hidden transition-all duration-500">
      {/* Header / Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between group hover:bg-white/5 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">{title}</span>
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">
            {isOpen ? "Active Settings" : "Settings Minimized"}
          </span>
        </div>
        <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
           <span className="text-xs text-sky-400">▼</span>
        </div>
      </button>

      {/* Content Area */}
      <div className="drawer-content overflow-hidden">
        <div className="p-6 md:p-8 pt-0 md:pt-0 space-y-6 md:space-y-8">
           <div className="h-px bg-white/5 w-full mb-6"></div>
           {children}
        </div>
      </div>
    </div>
  );
}
