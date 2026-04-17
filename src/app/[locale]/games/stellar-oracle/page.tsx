"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getOracleWisdom } from "./actions";
import { useTranslations } from "next-intl";

type Step = "ENTRANCE" | "INPUT" | "ANALYZING" | "REVEAL";

export default function StellarOracle() {
  const t = useTranslations("Games.stellar-oracle");
  const tc = useTranslations("Games.common");
  
  const [step, setStep] = useState<Step>("ENTRANCE");
  const [userInput, setUserInput] = useState("");
  const [enlightenment, setEnlightenment] = useState("");
  const [glowColor, setGlowColor] = useState("#a855f7"); // Default purple
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [starsData, setStarsData] = useState<{width:string, height:string, top:string, left:string, delay:string, duration:string}[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Client-side logic
  useEffect(() => {
    setHasMounted(true);

    // Generate stars only on client to avoid hydration mismatch
    const newStars = [...Array(40)].map(() => ({
      width: Math.random() * 3 + "px",
      height: Math.random() * 3 + "px",
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: Math.random() * 3 + 2 + "s"
    }));
    setStarsData(newStars);
  }, []);

  const startAnalysis = async () => {
    if (!userInput.trim()) return;
    setStep("ANALYZING");
    setIsGenerating(true);

    try {
        const result = await getOracleWisdom(userInput);
        
        if (result.success && result.wisdom) {
            setEnlightenment(result.wisdom);
            if (result.color) setGlowColor(result.color);
        } else {
            setEnlightenment(result.message || "Star-link interrupted. The nebula is currently too thick to penetrate. Please re-establish the energy trace.");
            setGlowColor("#334155"); // dim gray
        }
    } catch (err) {
        setEnlightenment("Critical failure in the neural link gateway. High-level cosmic interference detected.");
        setGlowColor("#ef4444"); // error red
    } finally {
        setTimeout(() => {
            setIsGenerating(false);
            setStep("REVEAL");
        }, 3000);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    if (step === "ENTRANCE" && hasMounted) {
      gsap.to(".oracle-orb", { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" });
      gsap.to(".oracle-text", { y: 0, opacity: 1, delay: 0.5, stagger: 0.2, duration: 0.8 });
    }
    if (step === "INPUT") {
      gsap.from(".input-ui", { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (step === "ANALYZING") {
      gsap.to(".oracle-orb", { scale: 1.5, repeat: -1, yoyo: true, duration: 1.5, ease: "sine.inOut" });
    }
    if (step === "REVEAL") {
      gsap.to(".reveal-text", { opacity: 1, scale: 1, duration: 1, stagger: 0.3 });
      gsap.to(".oracle-orb", { scale: 1, filter: `drop-shadow(0 0 40px ${glowColor})`, duration: 2 });
    }
  }, { scope: containerRef, dependencies: [step, hasMounted] });

  return (
    <div ref={containerRef} className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center select-none overflow-hidden bg-[#010205]">
      
      {/* Dynamic Background Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {hasMounted && starsData.map((star, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/40 animate-pulse"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Navigation */}
        <div className="w-full flex justify-end items-center mb-16 px-4">
            <Link href="/#games" className="text-[10px] font-mono text-slate-500 hover:text-purple-400 uppercase tracking-[0.3em] transition-colors">{tc("back")}</Link>
        </div>

        {/* The Oracle Visual */}
        <div className="relative mb-20">
          <div 
            className="oracle-orb w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-linear-to-br from-purple-500 via-indigo-600 to-black relative shadow-[0_0_80px_rgba(168,85,247,0.4)] border border-white/10 opacity-0 scale-0"
            style={{ 
              boxShadow: `0 0 100px -20px ${glowColor}66`,
              filter: step === "REVEAL" ? `drop-shadow(0 0 40px ${glowColor}aa)` : "none"
            }}
          >
            <div className="absolute inset-0 rounded-full bg-grid opacity-20" />
            <div className="absolute inset-0 rounded-full bg-linear-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute -inset-8 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-16 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        {/* Step Content */}
        <div className="w-full max-w-2xl text-center">
          
          {step === "ENTRANCE" && (
            <div className="flex flex-col items-center">
              <span className="oracle-text text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] mb-4 opacity-0 translate-y-4">{t("consciousness")}</span>
              <h1 className="oracle-text text-5xl sm:text-7xl font-black text-white italic tracking-tighter mb-8 uppercase opacity-0 translate-y-4">{t("title")}</h1>
              <p className="oracle-text text-slate-400 font-mono text-xs max-w-lg mb-12 leading-relaxed opacity-0 translate-y-4">
                {t("description")}
              </p>
              <button 
                onClick={() => setStep("INPUT")}
                className="z-100 oracle-text px-16 py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-400 hover:text-white transition-all text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] opacity-0 translate-y-4"
              >
                {t("commune")}
              </button>
            </div>
          )}

          {step === "INPUT" && (
            <div className="input-ui flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight italic">{t("mind")}</h2>
              <p className="text-slate-500 font-mono text-[10px] mb-12 uppercase tracking-[0.2em]">{t("share")}</p>
              
              <div className="w-full relative group">
                <textarea 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={t("placeholder")}
                  className="w-full min-h-[200px] bg-white/2 border border-white/10 rounded-[32px] p-8 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 transition-all backdrop-blur-3xl resize-none"
                  autoFocus
                />
                <div className="absolute bottom-6 right-6 text-[9px] font-mono text-slate-600 uppercase tracking-widest">{t("signal")}: {userInput.length > 50 ? t("strengthHigh") : t("strengthLow")}</div>
              </div>

              <button 
                onClick={startAnalysis}
                disabled={userInput.length < 5}
                className="mt-12 px-16 py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t("analyze")}
              </button>
            </div>
          )}

          {step === "ANALYZING" && (
            <div className="flex flex-col items-center">
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-linear-to-r from-purple-500 to-indigo-500 animate-[loading_3s_linear]" />
              </div>
              <p className="text-purple-400 font-mono text-xs uppercase tracking-[0.6em] animate-pulse">
                {isGenerating ? t("transmitting") : t("filtering")}
              </p>
              <p className="text-slate-600 font-mono text-[9px] mt-4 uppercase tracking-[0.2em]">
                {isGenerating ? t("synthesizing") : t("calibrating")}
              </p>
            </div>
          )}

          {step === "REVEAL" && (
            <div className="flex flex-col items-center">
              <span className="reveal-text text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-4 opacity-0 scale-95">{t("decoded")}</span>
              <h2 className="reveal-text text-xl sm:text-2xl font-black text-white italic uppercase tracking-tight mb-12 max-w-2xl leading-relaxed opacity-0 scale-95">
                "{enlightenment}"
              </h2>
              
              <div className="reveal-text flex gap-4 opacity-0 scale-95">
                <button 
                  onClick={() => { setStep("INPUT"); setUserInput(""); setGlowColor("#a855f7"); }}
                  className="px-12 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest"
                >
                  {t("newMessage")}
                </button>
                <Link 
                  href="/#games"
                  className="px-12 py-4 bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest border border-white/5"
                >
                  {tc("back")}
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>

    </div>
  );
}
