"use client";
import ToolShell from "@/components/ToolShell";
import CSSMinifier from "@/components/tools/data/CSSMinifier";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "css-minifier")!;
  return (
    <ToolShell tool={tool}>
       <CSSMinifier />
    </ToolShell>
  );
}
