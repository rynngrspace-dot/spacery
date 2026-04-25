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
  if (slug === "jfif-to-png") { initialFormat = "image/png"; sourceFormat = "image/jpeg"; }
  if (slug === "heic-to-jpg") { initialFormat = "image/jpeg"; sourceFormat = "image/heic"; }
  if (slug === "heic-to-png") { initialFormat = "image/png"; sourceFormat = "image/heic"; }
  if (slug === "image-to-webp") { initialFormat = "image/webp"; }
  if (slug === "pdf-to-jpg") { initialFormat = "image/jpeg"; sourceFormat = "application/pdf"; }
  if (slug === "pdf-to-word") { initialFormat = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; sourceFormat = "application/pdf"; }
  if (slug === "docx-to-pdf") { initialFormat = "application/pdf"; sourceFormat = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; }
  if (slug === "heic-to-pdf") { initialFormat = "application/pdf"; sourceFormat = "image/heic"; }
  if (slug === "epub-to-pdf") { initialFormat = "application/pdf"; sourceFormat = "application/epub+zip"; }
  if (slug === "pdf-to-epub") { initialFormat = "application/epub+zip"; sourceFormat = "application/pdf"; }
  if (slug === "png-to-svg") { sourceFormat = "image/png,image/jpeg,image/webp"; }
  if (slug === "svg-converter") { sourceFormat = "image/svg+xml"; }

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
