"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Magnetic from "./Magnetic";
import { getCoffeeCount, incrementCoffeeCount } from "@/app/actions/coffee";
import { useTranslations } from "next-intl";

export default function CoffeeButton() {
  const t = useTranslations("Coffee");
  const [count, setCount] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Load initial count via Server Action
    const fetchCount = async () => {
      try {
        const initialCount = await getCoffeeCount();
        setCount(initialCount);
      } catch (err) {
        setCount(0);
      }
    };
    fetchCount();
  }, []);

  const handleClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // BROWSER POLICY FRIENDLY AUDIO
    try {
      const audio = new Audio("/assets/audio/hidup-jokowi.mp3");
      audio.play().catch((e) => {
        console.warn("Audio play failed:", e);
        audio.load();
        audio.play().catch(err => console.error("Second attempt failed:", err));
      });
    } catch (e) {
      console.error("Audio initialization failed:", e);
    }

    // GSAP Animation
    gsap.to(buttonRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => setIsAnimating(false)
    });

    // Increment via Server Action
    try {
      const newCount = await incrementCoffeeCount();
      if (newCount !== null) {
        setCount(newCount);
      }
    } catch (err) {
      console.error("Counter increment failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-12 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_1.2s_forwards]">
      <Magnetic>
        <button
          ref={buttonRef}
          onClick={handleClick}
          className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#060b19]/60 backdrop-blur-2xl border border-white/10 hover:border-sky-500/30 px-8 py-6 transition-all duration-500 hover:bg-sky-500/10 hover:shadow-[0_0_50px_rgba(56,189,248,0.2)] active:scale-95"
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 z-0 bg-radial-gradient from-sky-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <div className="relative z-10 text-3xl mb-2 group-hover:scale-110 transition-transform duration-500">
            ☕
          </div>
          <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em] text-slate-300 group-hover:text-sky-400 pb-1">
            {t("buzz")}
          </span>
          
          {/* Decorative Border Glow */}
          <div className="absolute inset-0 rounded-2xl border border-sky-500/0 group-hover:border-sky-500/40 transition-all duration-500" />
        </button>
      </Magnetic>

      <div className="flex flex-col items-center">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="h-[1px] w-4 bg-slate-800"></span>
          {count !== null ? (
            <span className="text-sky-400 font-bold tabular-nums">
              {count.toLocaleString()}
            </span>
          ) : (
             <span className="animate-pulse">Loading...</span>
          )}
          <span className="h-[1px] w-4 bg-slate-800"></span>
        </div>
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1 italic text-center">
          {count !== null ? (
            <>{t("synthesized")} <br /> <span className="opacity-40">{t("awake")}</span></>
          ) : (
            t("loading")
          )}
        </p>
      </div>
    </div>
  );
}
