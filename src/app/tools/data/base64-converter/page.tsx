"use client";
import ToolShell from "@/components/ToolShell";
import Base64Module from "@/components/tools/data/Base64Module";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "base64-converter")!;
  return (
    <ToolShell tool={tool}>
       <Base64Module />
    </ToolShell>
  );
}
