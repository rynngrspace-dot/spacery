"use client";

import React from "react";
import UnderConstruction from "@/components/shared/UnderConstruction";

export default function VideoToolUI({ actionLabel }: { actionLabel: string }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden text-center">
         <UnderConstruction title={actionLabel} category="Motion Stream" status="Syncing_Stream" />
      </div>
    </div>
  );
}
