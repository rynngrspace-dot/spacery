"use client";
import ToolShell from "@/components/ToolShell";
import VideoToolUI from "@/components/tools/motion/VideoToolUI";
import { TOOLS } from "@/data/tools";

export default function Page() {
  const tool = TOOLS.find(t => t.slug === "video-muter")!;
  return (
    <ToolShell tool={tool}>
       <VideoToolUI actionLabel="Acoustic Scrubbing" />
    </ToolShell>
  );
}
