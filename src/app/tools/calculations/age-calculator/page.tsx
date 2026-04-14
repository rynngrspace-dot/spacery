"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import AgeCalculator from "@/components/tools/calculations/AgeCalculator";

export default function AgeCalculatorPage() {
  const tool = TOOLS.find(t => t.slug === "age-calculator")!;

  return (
    <ToolShell tool={tool}>
      <AgeCalculator />
    </ToolShell>
  );
}
