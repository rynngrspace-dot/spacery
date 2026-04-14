"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import UnderConstruction from "@/components/shared/UnderConstruction";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "svg-optimizer");
  if (!tool) return null;

  return (
    <ToolShell tool={tool}>
      <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden text-center mt-10">
         <UnderConstruction title="SVG Optimizer" category="Vector Imaging" status="Locked_Sector" />
      </div>
    </ToolShell>
  );
}
