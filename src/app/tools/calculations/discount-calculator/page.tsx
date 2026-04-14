"use client";
import ToolShell from "@/components/ToolShell";
import DiscountCalculator from "@/components/tools/calculations/DiscountCalculator";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "discount-calculator");
  if (!tool) return null;
  return (
    <ToolShell tool={tool}>
       <DiscountCalculator />
    </ToolShell>
  );
}
