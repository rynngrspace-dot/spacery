"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import QRCodeGen from "@/components/tools/imaging/QRCodeGen";

export default function QRGeneratorPage() {
  const tool = TOOLS.find(t => t.slug === "qr-generator")!;

  return (
    <ToolShell tool={tool}>
      <QRCodeGen />
    </ToolShell>
  );
}
