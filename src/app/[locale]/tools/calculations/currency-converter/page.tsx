"use client";
import ToolShell from "@/components/ToolShell";
import CurrencyConverter from "@/components/tools/calculations/CurrencyConverter";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "currency-converter");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <CurrencyConverter />
    </ToolShell>
  );
}
