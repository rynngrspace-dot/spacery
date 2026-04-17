"use client";
import ToolShell from "@/components/ToolShell";
import ImageToPdf from "@/components/tools/documents/ImageToPdf";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "image-to-pdf");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <ImageToPdf />
    </ToolShell>
  );
}
