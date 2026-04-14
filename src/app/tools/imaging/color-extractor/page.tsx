"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import ColorExtractor from "@/components/tools/imaging/ColorExtractor";

export default function ColorExtractorPage() {
  const tool = TOOLS.find(t => t.slug === "color-extractor")!;

  return (
    <ToolShell tool={tool}>
      <ColorExtractor />
    </ToolShell>
  );
}
