"use client";
import ToolShell from "@/components/ToolShell";
import UnitConverter from "@/components/tools/calculations/UnitConverter";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "unit-converter")!;
  return (
    <ToolShell tool={tool}>
       <UnitConverter />
    </ToolShell>
  );
}
