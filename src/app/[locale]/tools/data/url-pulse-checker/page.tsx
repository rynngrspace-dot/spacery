"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import URLPulseChecker from "@/components/tools/data/URLPulseChecker";

export default function URLPulseCheckerPage() {
  const tool = TOOLS.find(t => t.slug === "url-pulse-checker")!;

  return (
    <ToolShell tool={tool}>
      <URLPulseChecker />
    </ToolShell>
  );
}
