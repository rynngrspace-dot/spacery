"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Step = "ENTRANCE" | "INPUT" | "ANALYZING" | "REVEAL";

const WISDOM_LIBRARY = {
  positive: [
    "The stars shine brighter when they sense a soul in harmony. Your light is reaching distant galaxies.",
    "Your joy is like a supernova—it creates elements that will build future worlds. Keep expanding.",
    "The universe is not just outside you. You are the universe expressing itself in a moment of triumph.",
    "A soaring spirit is the strongest engine in the cosmos. Your trajectory is set for greatness."
  ],
  negative: [
    "Even the largest black holes eventually give way to Hawking radiation. This darkness is not your end.",
    "The void is not empty; it is a space for stars to be born. Your current silence is a preparation for light.",
    "When a star collapses, it becomes something denser, stronger, and more mysterious. You are evolving.",
    "Navigation through a nebula is slow and blind. Trust your internal gyroscopes; you will find clear space soon."
  ],
  tired: [
    "Even the sun sets to recharge its solar winds. Resting is a vital part of your mission, Pilot.",
    "The vastness of space requires patience. It is okay to drift for a while and just exist among the silence.",
    "Powering down systems is not a failure; it is a tactical necessity. Close your eyes and let the stars watch over you.",
    "Your internal battery is low, but the cosmic energy around you is infinite. Plug into the quiet and heal."
  ],
  neutral: [
    "The cosmic balance is maintained by the quiet moments. You are the calm between the solar flares.",
    "Orbiting is as important as traveling. Enjoy the stability of your current path.",
    "The stars observe your journey with interest. Every small step is recorded in the chronicles of the void.",
    "Existence is the greatest miracle in the multiverse. Simply being here is enough of a story."
  ]
};

const MOOD_KEYWORDS = {
  positive: ["happy", "good", "great", "awesome", "love", "smile", "won", "success", "excited", "glad", "best"],
  negative: ["sad", "bad", "hate", "hurt", "fail", "lost", "broken", "lonely", "pain", "crying", "dark"],
  tired: ["tired", "sleepy", "exhausted", "lazy", "bored", "drained", "weak", "slow", "heavy", "burnout"]
};

export default function StellarOracle() {
  const [step, setStep] = useState<Step>("ENTRANCE");
  const [pilotName, setPilotName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [enlightenment, setEnlightenment] = useState("");
  const [glowColor, setGlowColor] = useState("#a855f7"); // Default purple
  const [hasMounted, setHasMounted] = useState(false);
  const [starsData, setStarsData] = useState<{width:string, height:string, top:string, left:string, delay:string, duration:string}[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const oracleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize Name & Client-side logic
  useEffect(() => {
    setHasMounted(true);
    const savedPilot = localStorage.getItem("sky-glide-pilot");
    if (savedPilot) setPilotName(savedPilot);

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

  // Sentiment Analysis
  const analyzeMood = () => {
    const lowerInput = userInput.toLowerCase();
    let mood: keyof typeof WISDOM_LIBRARY = "neutral";
    let color = "#a855f7"; // default purple

    if (MOOD_KEYWORDS.positive.some(k => lowerInput.includes(k))) {
      mood = "positive";
      color = "#2dd4bf"; // teal
    } else if (MOOD_KEYWORDS.negative.some(k => lowerInput.includes(k))) {
      mood = "negative";
      color = "#ef4444"; // red
    } else if (MOOD_KEYWORDS.tired.some(k => lowerInput.includes(k))) {
      mood = "tired";
      color = "#3b82f6"; // blue
    }

    const messages = WISDOM_LIBRARY[mood];
    setEnlightenment(messages[Math.floor(Math.random() * messages.length)]);
    setGlowColor(color);
  };

  const startAnalysis = () => {
    if (!userInput.trim()) return;
    setStep("ANALYZING");
    analyzeMood();

    setTimeout(() => {
      setStep("REVEAL");
    }, 4000);
  };

  // GSAP Animations
  useGSAP(() => {
    if (step === "ENTRANCE") {
      gsap.from(".oracle-orb", { scale: 0, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" });
      gsap.from(".oracle-text", { y: 20, opacity: 0, delay: 0.5, stagger: 0.2 });
    }
    if (step === "INPUT") {
      gsap.from(".input-ui", { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (step === "ANALYZING") {
      gsap.to(".oracle-orb", { scale: 1.5, repeat: -1, yoyo: true, duration: 1.5, ease: "sine.inOut" });
    }
    if (step === "REVEAL") {
      gsap.from(".reveal-text", { opacity: 0, scale: 0.9, duration: 1, stagger: 0.3 });
      gsap.to(".oracle-orb", { scale: 1, filter: `drop-shadow(0 0 40px ${glowColor})`, duration: 2 });
    }
  }, { scope: containerRef, dependencies: [step] });

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
        <div className="w-full flex justify-between items-center mb-16 px-4">
            <Link href="/#games" className="text-[10px] font-mono text-slate-500 hover:text-purple-400 uppercase tracking-[0.3em] transition-colors">← Return to Bridge</Link>
            {pilotName && (
              <div className="bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Pilot: {pilotName}</span>
              </div>
            )}
        </div>

        {/* The Oracle Visual */}
        <div className="relative mb-20">
          <div 
            className="oracle-orb w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-linear-to-br from-purple-500 via-indigo-600 to-black relative shadow-[0_0_80px_rgba(168,85,247,0.4)] border border-white/10"
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
              <span className="oracle-text text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] mb-4">Celestial Consciousness</span>
              <h1 className="oracle-text text-5xl sm:text-7xl font-black text-white italic tracking-tighter mb-8 uppercase">Stellar Oracle</h1>
              <p className="oracle-text text-slate-400 font-mono text-xs max-w-lg mb-12 leading-relaxed">
                The stars have observed your journey since the dawn of time. They sense the ripples of your experiences. 
                Are you ready to share your frequency with the void?
              </p>
              <button 
                onClick={() => setStep("INPUT")}
                className="oracle-text px-16 py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-400 hover:text-white transition-all text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
              >
                Commune with Wisdom
              </button>
            </div>
          )}

          {step === "INPUT" && (
            <div className="input-ui flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight italic">Share your cycle</h2>
              <p className="text-slate-500 font-mono text-[10px] mb-12 uppercase tracking-[0.2em]">Pilot {pilotName}, how does the void feel today?</p>
              
              <div className="w-full relative group">
                <textarea 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="I am feeling... today was..."
                  className="w-full min-h-[200px] bg-white/2 border border-white/10 rounded-[32px] p-8 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 transition-all backdrop-blur-3xl resize-none"
                  autoFocus
                />
                <div className="absolute bottom-6 right-6 text-[9px] font-mono text-slate-600 uppercase tracking-widest">Signal strength: {userInput.length > 50 ? "High" : "Low"}</div>
              </div>

              <button 
                onClick={startAnalysis}
                disabled={userInput.length < 5}
                className="mt-12 px-16 py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Analyze Energy Trace
              </button>
            </div>
          )}

          {step === "ANALYZING" && (
            <div className="flex flex-col items-center">
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-purple-500 animate-[loading_4s_linear]" />
              </div>
              <p className="text-purple-400 font-mono text-xs uppercase tracking-[0.6em] animate-pulse">Filtering Nebula Noise...</p>
              <p className="text-slate-600 font-mono text-[9px] mt-4 uppercase tracking-[0.2em]">Synthesizing pilot call-sign with cosmic rays</p>
            </div>
          )}

          {step === "REVEAL" && (
            <div className="flex flex-col items-center">
              <span className="reveal-text text-[10px] font-mono text-slate-500 uppercase tracking-[0.6em] mb-4">Transmission Received</span>
              <h2 className="reveal-text text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter mb-12 max-w-2xl leading-tight">
                "{enlightenment}"
              </h2>
              
              <div className="reveal-text flex gap-4">
                <button 
                  onClick={() => { setStep("INPUT"); setUserInput(""); setGlowColor("#a855f7"); }}
                  className="px-12 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest"
                >
                  New Transmission
                </button>
                <Link 
                  href="/#games"
                  className="px-12 py-4 bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest border border-white/5"
                >
                  Back to Bridge
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
