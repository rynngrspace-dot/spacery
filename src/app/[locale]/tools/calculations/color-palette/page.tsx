"use client";
import ToolShell from "@/components/ToolShell";
import ColorPalette from "@/components/tools/calculations/ColorPalette";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "color-palette")!;
  return (
    <ToolShell tool={tool}>
       <ColorPalette />
    </ToolShell>
  );
}
