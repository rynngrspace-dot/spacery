"use client";
import ToolShell from "@/components/ToolShell";
import ImageFilters from "@/components/tools/imaging/ImageFilters";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "image-filters");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <ImageFilters />
    </ToolShell>
  );
}
