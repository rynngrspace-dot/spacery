"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import RegExTester from "@/components/tools/data/RegExTester";

export default function RegExTesterPage() {
  const tool = TOOLS.find(t => t.slug === "regex-tester")!;

  return (
    <ToolShell tool={tool}>
      <RegExTester />
    </ToolShell>
  );
}
