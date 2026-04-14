"use client";
import ToolShell from "@/components/ToolShell";
import RandomChoiceMaker from "@/components/tools/data/RandomChoiceMaker";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "random-choice-maker");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <RandomChoiceMaker />
    </ToolShell>
  );
}
