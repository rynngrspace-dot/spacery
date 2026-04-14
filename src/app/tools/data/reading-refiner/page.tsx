"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import ReadingRefiner from "@/components/tools/data/ReadingRefiner";

export default function ReadingRefinerPage() {
  const tool = TOOLS.find(t => t.slug === "reading-refiner")!;

  return (
    <ToolShell tool={tool}>
      <ReadingRefiner />
    </ToolShell>
  );
}
