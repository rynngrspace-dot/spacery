"use client";
import ToolShell from "@/components/ToolShell";
import DocumentToolUI from "@/components/tools/documents/DocumentToolUI";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "pdf-merge")!;
  return (
    <ToolShell tool={tool}>
       <DocumentToolUI actionLabel="PDF Consolidation" acceptedTypes=".pdf" />
    </ToolShell>
  );
}
