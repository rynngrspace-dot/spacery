"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(nextLocale: 'en' | 'id') {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 h-9">
      <button
        onClick={() => onSelectChange("en")}
        disabled={isPending}
        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
          locale === "en" 
            ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]" 
            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
        }`}
        aria-label="Switch language to English"
      >
        EN
      </button>
      <button
        onClick={() => onSelectChange("id")}
        disabled={isPending}
        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
          locale === "id" 
            ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]" 
            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
        }`}
        aria-label="Switch language to Indonesian"
      >
        ID
      </button>
    </div>
  );
}
