"use client";

import React from "react";
import ToolShell from "@/components/ToolShell";
import { TOOLS } from "@/data/tools";
import { TOOL_COMPONENTS } from "@/components/tools";
import { notFound, useParams } from "next/navigation";

export default function UnifiedToolPage() {
  const params = useParams();
  const slug = params.slug as string;

  const tool = TOOLS.find(t => t.slug === slug);
  const ToolComponent = TOOL_COMPONENTS[slug];

  console.log("Tool Page Debug:", { slug, toolFound: !!tool, componentFound: !!ToolComponent });

  if (!tool || !ToolComponent) {
    return notFound();
  }

  // Determine initial format for converters
  let initialFormat: string | undefined = undefined;
  let sourceFormat: string | undefined = undefined;

  if (slug === "jpg-to-png") { initialFormat = "image/png"; sourceFormat = "image/jpeg"; }
  if (slug === "png-to-jpg") { initialFormat = "image/jpeg"; sourceFormat = "image/png"; }
  if (slug === "webp-to-png") { initialFormat = "image/png"; sourceFormat = "image/webp"; }
  if (slug === "webp-to-jpg") { initialFormat = "image/jpeg"; sourceFormat = "image/webp"; }
  if (slug === "heic-to-jpg") { initialFormat = "image/jpeg"; sourceFormat = "image/heic"; }
  if (slug === "heic-to-png") { initialFormat = "image/png"; sourceFormat = "image/heic"; }
  if (slug === "image-to-webp") { initialFormat = "image/webp"; }

  return (
    <ToolShell tool={tool}>
       <ToolComponent 
         initialFormat={initialFormat} 
         sourceFormat={sourceFormat} 
         actionLabel={tool.title} 
       />
    </ToolShell>
  );
}
