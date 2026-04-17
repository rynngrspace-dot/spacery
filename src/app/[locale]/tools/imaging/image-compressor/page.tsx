"use client";
import ToolShell from "@/components/ToolShell";
import ImageCompressor from "@/components/tools/imaging/ImageCompressor";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "image-compressor");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <ImageCompressor />
    </ToolShell>
  );
}
