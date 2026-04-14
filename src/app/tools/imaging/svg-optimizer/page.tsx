"use client";
import ToolShell from "@/components/ToolShell";
import SVGOptimizer from "@/components/tools/imaging/SVGOptimizer";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "svg-optimizer");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <SVGOptimizer />
    </ToolShell>
  );
}
