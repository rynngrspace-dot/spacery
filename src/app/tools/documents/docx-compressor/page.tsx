"use client";
import ToolShell from "@/components/ToolShell";
import DocumentToolUI from "@/components/tools/documents/DocumentToolUI";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "docx-compressor")!;
  return (
    <ToolShell tool={tool}>
       <DocumentToolUI actionLabel="Manuscript Optimization" acceptedTypes=".docx,.doc" />
    </ToolShell>
  );
}
