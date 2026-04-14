"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import CaseConverter from "@/components/tools/data/CaseConverter";

export default function CaseConverterPage() {
  const tool = TOOLS.find(t => t.slug === "case-converter")!;

  return (
    <ToolShell tool={tool}>
      <CaseConverter />
    </ToolShell>
  );
}
