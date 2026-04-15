"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getOracleWisdom } from "./actions";

type Step = "ENTRANCE" | "INPUT" | "ANALYZING" | "REVEAL";

const WISDOM_LIBRARY = {
  positive: [
    "You're doing amazing! Even the stars are noticing your hard work. Keep that momentum going.",
    "Your energy is contagious. You're creating your own orbit of success right now.",
    "The universe loves a winner, and right now, you're the main character of this galaxy.",
    "Great things take time, but you're making it look easy. Your light is reaching further than you think.",
    "Keep that smile! It's the brightest thing in the sector. You're on the right track.",
    "Small wins lead to big journeys. Today was a victory, no matter how small it felt.",
    "Your potential is infinite. This success is just one star in your growing constellation.",
    "The way you handle things is inspiring. You've got that natural pilot's intuition.",
    "Celebrate today! You've earned a moment of joy in this vast cosmos.",
    "You are the sun of your own system today. Everything is looking bright.",
    "Progress is progress. You're moving forward at light-speed!",
    "The universe is high-fiving you right now. Can you feel the cosmic pulse?"
  ],
  negative: [
    "Bad days are like black holes—they feel heavy, but they don't last forever. Take a deep breath.",
    "It's okay to feel lost sometimes. Even the best pilots need a map. This is just a temporary detour.",
    "You don't have to be perfect to be a star. Even stars have spots. Be kind to yourself today.",
    "The void feels lonely sometimes, but remember you're part of a huge, connected system. You're not alone.",
    "If things look dark, it's just so you can see the stars better. You'll find your way back soon.",
    "Crying isn't a sign of weakness; it's a systems flush. Let it out, then restart your engines.",
    "Whatever is weighing you down, remember that the stars are patient. This too shall pass.",
    "You're allowed to have a bad day. Even the moon has its dark phases.",
    "It takes a lot of courage to admit things are tough. You're stronger than you give yourself credit for.",
    "Sometimes you have to drift to find your direction again. Don't rush the healing process.",
    "The universe isn't testing you; it's just a bumpy asteroid field. You'll navigate through it.",
    "Hold on tight. The turbulence is temporary, but your spirit is resilient."
  ],
  tired: [
    "It's okay to hit the 'Snooze' button on life. Even orbits need a rest phase. You've done enough for today.",
    "Your battery is low, and that's okay. Power down, recharge, and try again tomorrow. The stars will still be there.",
    "Burnout is real. Don't try to fly on an empty tank. Take some time to just... drift.",
    "Resting isn't quitting. It's tactical maintenance. Go get some real sleep, Pilot.",
    "The universe is vast and patient. It can wait for you to feel better. Take your time.",
    "You're not a machine. You're a pilot. And every pilot needs to come home and relax sometimes.",
    "Silence is sometimes the best music. Let the quiet of the void help you recover.",
    "Your mind needs a break from the constant solar flares of life. Peace out for a bit.",
    "If you're too tired to fly, just stay in orbit. There's no rush to reach the next jump-gate.",
    "You've been carrying the weight of a whole planet lately. Set it down for a while.",
    "Dreams are where we rebuild our constellations. Sleep well and dream big.",
    "The world can wait. Your peace of mind is the priority mission right now."
  ],
  angry: [
    "I get it. That was unfair and you have every right to be mad. Space can be a harsh place.",
    "Anger is just high-energy fuel. Don't let it burn you up; use it to power your next big move.",
    "It's okay to scream into the void. It's big enough to take it. Let that heat out.",
    "Someone or something crossed your path the wrong way. Don't let their gravity pull you down.",
    "Venting is a safety protocol. Better to release the pressure now than to explode later.",
    "Your fire is impressive, but don't let it scorch your own hull. Breathe through the heat.",
    "The universe isn't همیشه fair, but you're strong enough to carve out your own justice.",
    "Focus that rage into something brilliant. The brightest stars come from the most intense heat."
  ],
  mixed: [
    "Feelings are complicated, like a binary star system pulling in two directions. It's okay to feel 'everything' at once.",
    "You're sad, you're mad, you're tired—and that's okay. You contain galaxies of complexity.",
    "A bittersweet orbit. You've achieved something great but at a heavy cost. Take a moment to process it all.",
    "It's confusing when the heart signals 'Red' and 'Green' at the same time. Trust your gut, Pilot.",
    "Mixed feelings are just a sign that you're experiencing life in high-definition. It's intense, but it's real.",
    "You're navigating through a nebula of emotions right now. Don't worry about labeling it—just experience it.",
    "The most beautiful nebulas are made of many different gases. Your mixed emotions are what make you unique.",
    "Paradoxes are part of the cosmic design. You can be both strong and vulnerable at the same time."
  ],
  neutral: [
    "Nothing major happened today? That's actually a win. Enjoy the quiet flight for once.",
    "Stability is underrated. You're in a stable orbit, and that's a great place to be.",
    "Just existing is a pretty big deal in a universe this large. You're doing just fine.",
    "Take a moment to look around. The view is nice, even when nothing is happening.",
    "Consistency is the secret to long-term flight. Today was a solid day of just... being you.",
    "The stars are watching quietly. No news is good news in the deep void.",
    "Sometimes 'average' is exactly what we need. A peaceful day among the stars.",
    "Your frequency is steady and clear. A perfectly balanced transmission.",
    "No solar flares, no asteroid storms. Just a smooth glide through the sector.",
    "The universe is resting with you. Appreciate the simplicity of a quiet day.",
    "You're grounded and steady. That's a powerful state to be in.",
    "Quiet days build the foundation for heroic journeys. Enjoy the calm."
  ]
};

const MOOD_KEYWORDS = {
  positive: ["happy", "good", "great", "awesome", "love", "smile", "won", "success", "excited", "glad", "best", "proud", "amazing", "wonderful"],
  negative: ["sad", "bad", "hate", "hurt", "fail", "lost", "broken", "lonely", "pain", "crying", "dark", "unhappy", "depressed", "sorry"],
  tired: ["tired", "sleepy", "exhausted", "lazy", "bored", "drained", "weak", "slow", "heavy", "burnout", "sleep", "rest"],
  angry: ["angry", "mad", "hate", "pissed", "annoyed", "unfair", "wrong", "shout", "rage", "furious", "stupid", "idiot"]
};

export default function StellarOracle() {
  const [step, setStep] = useState<Step>("ENTRANCE");
  const [pilotName, setPilotName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [enlightenment, setEnlightenment] = useState("");
  const [glowColor, setGlowColor] = useState("#a855f7"); // Default purple
  const [isGenerating, setIsGenerating] = useState(false);
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
    const detectedTags: string[] = [];

    if (MOOD_KEYWORDS.positive.some(k => lowerInput.includes(k))) detectedTags.push("positive");
    if (MOOD_KEYWORDS.negative.some(k => lowerInput.includes(k))) detectedTags.push("negative");
    if (MOOD_KEYWORDS.tired.some(k => lowerInput.includes(k))) detectedTags.push("tired");
    if (MOOD_KEYWORDS.angry.some(k => lowerInput.includes(k))) detectedTags.push("angry");

    let mood: keyof typeof WISDOM_LIBRARY = "neutral";
    let color = "#a855f7"; // default purple

    if (detectedTags.length > 1) {
        mood = "mixed";
        color = "#f472b6"; // pink/mixed
    } else if (detectedTags.length === 1) {
        mood = detectedTags[0] as keyof typeof WISDOM_LIBRARY;
        if (mood === "positive") color = "#2dd4bf";
        if (mood === "negative") color = "#ef4444";
        if (mood === "tired") color = "#3b82f6";
        if (mood === "angry") color = "#f97316"; // orange
    }

    const messages = WISDOM_LIBRARY[mood];
    setEnlightenment(messages[Math.floor(Math.random() * messages.length)]);
    setGlowColor(color);
  };

  const startAnalysis = async () => {
    if (!userInput.trim()) return;
    setStep("ANALYZING");
    setIsGenerating(true);

    try {
        const result = await getOracleWisdom(userInput, pilotName);
        
        if (result.success && result.wisdom) {
            setEnlightenment(result.wisdom);
            if (result.color) setGlowColor(result.color);
        } else {
            // Fallback to local logic if AI fails or key is missing
            analyzeMood();
        }
    } catch (err) {
        analyzeMood();
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
              <span className="oracle-text text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] mb-4 opacity-0 translate-y-4">Celestial Consciousness</span>
              <h1 className="oracle-text text-5xl sm:text-7xl font-black text-white italic tracking-tighter mb-8 uppercase opacity-0 translate-y-4">Stellar Oracle</h1>
              <p className="oracle-text text-slate-400 font-mono text-xs max-w-lg mb-12 leading-relaxed opacity-0 translate-y-4">
                The stars have observed your journey since the dawn of time. They sense the ripples of your experiences. 
                Are you ready to share your frequency with the void?
              </p>
              <button 
                onClick={() => setStep("INPUT")}
                className="z-100 oracle-text px-16 py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-400 hover:text-white transition-all text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] opacity-0 translate-y-4"
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
                <div className="h-full bg-linear-to-r from-purple-500 to-indigo-500 animate-[loading_3s_linear]" />
              </div>
              <p className="text-purple-400 font-mono text-xs uppercase tracking-[0.6em] animate-pulse">
                {isGenerating ? "Transmitting to Central Core..." : "Filtering Nebula Noise..."}
              </p>
              <p className="text-slate-600 font-mono text-[9px] mt-4 uppercase tracking-[0.2em]">
                {isGenerating ? "Synthesizing AI Response..." : "Calibrating Psychic Resonance..."}
              </p>
            </div>
          )}

          {step === "REVEAL" && (
            <div className="flex flex-col items-center">
              <span className="reveal-text text-[10px] font-mono text-slate-500 uppercase tracking-[0.6em] mb-4 opacity-0 scale-95">Transmission Received</span>
              <h2 className="reveal-text text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter mb-12 max-w-2xl leading-tight opacity-0 scale-95">
                "{enlightenment}"
              </h2>
              
              <div className="reveal-text flex gap-4 opacity-0 scale-95">
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
