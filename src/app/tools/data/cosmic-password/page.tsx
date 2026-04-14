"use client";
import ToolShell from "@/components/ToolShell";
import PasswordGen from "@/components/tools/data/PasswordGen";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "cosmic-password")!;
  return (
    <ToolShell tool={tool}>
       <PasswordGen />
    </ToolShell>
  );
}
