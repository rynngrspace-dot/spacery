"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import GlassmorphismGen from "@/components/tools/imaging/GlassmorphismGen";

export default function GlassmorphismPage() {
  const tool = TOOLS.find(t => t.slug === "glassmorphism-generator")!;

  return (
    <ToolShell tool={tool}>
      <GlassmorphismGen />
    </ToolShell>
  );
}
