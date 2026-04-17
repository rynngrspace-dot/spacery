"use client";
import ToolShell from "@/components/ToolShell";
import ImageFormatConverter from "@/components/tools/imaging/ImageFormatConverter";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "image-converter");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <ImageFormatConverter />
    </ToolShell>
  );
}
