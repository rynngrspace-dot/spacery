"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

export default function BlogPage() {
  const t = useTranslations("Blog");
  const container = useRef<HTMLDivElement>(null);

  const posts = [
    { id: 1, date: "2026.04.13", title: t("posts.p1.title"), excerpt: t("posts.p1.excerpt") },
    { id: 2, date: "2026.04.10", title: t("posts.p2.title"), excerpt: t("posts.p2.excerpt") },
    { id: 3, date: "2026.04.05", title: t("posts.p3.title"), excerpt: t("posts.p3.excerpt") },
  ];

  useGSAP(() => {
    gsap.fromTo(".blog-card", 
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-sky-500 uppercase tracking-[0.3em] mb-4 block">{t("archive")}</span>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              {t("title")}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono text-slate-500 uppercase">{t("sector")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
          {posts.map((post) => (
            <div key={post.id} className="blog-card group relative bg-[#010205] p-10 md:p-14 hover:bg-white/[0.02] transition-colors duration-500 cursor-pointer">
              <div className="absolute left-0 top-0 w-[2px] h-0 bg-sky-400 transition-all duration-500 group-hover:h-full" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <span className="text-sm font-mono text-sky-500/60 uppercase tracking-widest">{post.date}</span>
                <div className="h-px flex-1 bg-white/5 hidden md:block mx-8" />
                <span className="text-xs font-mono text-slate-500 uppercase">{t("status")}</span>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 group-hover:text-sky-400 transition-colors duration-300">
                {post.title}
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-2 text-sm font-mono text-slate-500 group-hover:text-white transition-colors duration-300 uppercase tracking-widest">
                {t("readMore")} <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
