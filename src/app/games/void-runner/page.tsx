"use client";

import React from "react";
import Link from "next/link";
import UnderConstruction from "@/components/shared/UnderConstruction";

export default function VoidRunner() {
  return (
    <div className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <Link href="/#games" className="text-xs font-mono text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-[0.3em] mb-12 inline-block">
          ← Return to Bridge
        </Link>
        <div className="bg-[#0d0714]/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.1)]">
           <UnderConstruction title="Void Runner" category="Traversal Simulation" />
        </div>
      </div>
    </div>
  );
}
