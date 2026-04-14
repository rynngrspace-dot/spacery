"use client";
import ToolShell from "@/components/ToolShell";
import JSONFormatter from "@/components/tools/data/JSONFormatter";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "json-formatter")!;
  return (
    <ToolShell tool={tool}>
       <JSONFormatter />
    </ToolShell>
  );
}
