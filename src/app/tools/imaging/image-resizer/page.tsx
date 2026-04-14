"use client";
import ToolShell from "@/components/ToolShell";
import ImageResizer from "@/components/tools/imaging/ImageResizer";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "image-resizer");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <ImageResizer />
    </ToolShell>
  );
}
