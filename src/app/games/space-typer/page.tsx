"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SPACE_VOCAB = [
  "nebula", "supernova", "neutron", "pulsar", "galaxy", "quasar", "blackhole",
  "telescope", "astronaut", "orbit", "satellite", "asteroid", "comet", "meteor",
  "eclipse", "gravity", "zenith", "nadir", "starlight", "void", "cosmos",
  "interstellar", "horizon", "expansion", "redshift", "blueshift", "vacuum",
  "entropy", "singularity", "constellation", "parallax", "magnitude", "cluster"
];

type GameState = "idle" | "playing" | "ended";

// --- SELECTIVE RENDERING ENGINE ---
// This component only re-renders if its individual status/state changes.
const SelectiveChar = memo(({ char, status }: { char: string; status: "pending" | "correct" | "incorrect" }) => {
  let colorClass = "text-slate-600";
  if (status === "correct") colorClass = "text-slate-200";
  if (status === "incorrect") colorClass = "text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";

  return (
    <span className={`inline-block transition-colors duration-150 ${colorClass}`}>
      {char === " " ? "\u00A0" : char}
    </span>
  );
}, (prev, next) => prev.status === next.status && prev.char === next.char);
SelectiveChar.displayName = "SelectiveChar";

// --- Main Page ---

export default function SpaceTyper() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [typedContent, setTypedContent] = useState("");
  const [targetText, setTargetText] = useState("");
  const [liveWpm, setLiveWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFocused, setIsFocused] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  const generateContent = useCallback(() => {
    // Dynamic length based on duration: 15s -> ~25 words, 30s -> ~50 words, 60s -> ~100 words
    const count = duration * 1.6; 
    const words = Array.from({ length: Math.ceil(count) }, () => 
      SPACE_VOCAB[Math.floor(Math.random() * SPACE_VOCAB.length)]
    );
    setTargetText(words.join(" "));
    setTypedContent("");
    setGameState("idle");
    setTimeLeft(duration);
    setLiveWpm(0);
    setAccuracy(100);
    startTimeRef.current = null;
  }, [duration]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateContent();
  }, [generateContent]);

  const calculateFinalStats = useCallback(() => {
    const totalTyped = typedContent.length;
    let correct = 0;
    for (let i = 0; i < typedContent.length; i++) {
        if (typedContent[i] === targetText[i]) correct++;
    }

    const minutes = duration / 60;
    const finalWpm = Math.round((correct / 5) / (minutes || 1));
    const finalAcc = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;

    setLiveWpm(finalWpm);
    setAccuracy(finalAcc);
  }, [typedContent, targetText, duration]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGameState("ended");
            calculateFinalStats();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, calculateFinalStats]);

  const startGame = () => {
    setGameState("playing");
    setTypedContent("");
    setTimeLeft(duration);
    setTimeout(() => {
      inputRef.current?.focus();
      setIsFocused(true);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== "playing") return;

    // Restricted Space logic
    if (e.code === "Space") {
      if (targetText[typedContent.length] !== " ") {
        e.preventDefault();
      }
    }

    // Esc to restart
    if (e.key === "Escape") {
      generateContent();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === "idle") {
       setGameState("playing");
    }
    if (gameState === "ended") return;
    
    const val = e.target.value;
    if (val.length <= targetText.length) {
      setTypedContent(val);
      
      if (!startTimeRef.current && val.length > 0) {
        startTimeRef.current = Date.now();
      }

      if (startTimeRef.current) {
        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
        if (elapsedSeconds > 1) {
          let correct = 0;
          for (let i = 0; i < val.length; i++) {
            if (val[i] === targetText[i]) correct++;
          }
          const currentWpm = Math.round((correct / 5) / (elapsedSeconds / 60));
          setLiveWpm(currentWpm);
        }
      }
    }
  };

  // Smooth Static Caret
  useEffect(() => {
    if (!textContainerRef.current || !caretRef.current) return;

    const frameId = requestAnimationFrame(() => {
      const charEls = textContainerRef.current?.children;
      if (!charEls) return;

      const currentIndex = typedContent.length;
      const targetCharEl = (charEls[currentIndex] || charEls[charEls.length - 1]) as HTMLElement;
      
      if (targetCharEl) {
        const isPastEnd = currentIndex >= charEls.length;
        const targetX = targetCharEl.offsetLeft + (isPastEnd ? targetCharEl.offsetWidth : 0);
        const targetY = targetCharEl.offsetTop;

        const currentY = gsap.getProperty(caretRef.current, "y") as number;
        const isLineJump = Math.abs(currentY - targetY) > 10;
        const durationValue = (gameState === 'idle' || isLineJump) ? 0 : 0.1;

        gsap.to(caretRef.current, {
           x: targetX,
           y: targetY,
           duration: durationValue,
           opacity: 1,
           ease: "power2.out"
        });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [typedContent, gameState]);

  useGSAP(() => {
    gsap.fromTo(".game-ui", 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center select-none cursor-default"
      onClick={() => {
        if (gameState !== "ended") inputRef.current?.focus();
      }}
    >
      <div className="max-w-4xl w-full game-ui">
        
        {/* Header / Mode Selection */}
        <div className={`flex flex-col md:flex-row justify-between items-center mb-16 gap-8 transition-all duration-500 ${gameState === 'playing' ? 'opacity-[0.05] blur-md pointer-events-none' : 'opacity-100'}`}>
          <Link href="/#games" className="text-xs font-mono text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-[0.3em]">
            ← Return to Bridge
          </Link>
          
          <div className="flex bg-[#0d0714]/60 backdrop-blur-xl border border-white/5 rounded-full p-1.5 pointer-events-auto">
            {[15, 30, 60].map((t) => (
              <button
                key={t}
                onClick={(e) => { e.stopPropagation(); setDuration(t); }}
                className={`px-8 py-2.5 rounded-full text-[10px] font-mono transition-all ${
                  duration === t ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t}S
              </button>
            ))}
          </div>

          <div className="text-right hidden md:block">
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Protocol: Selective Render</span>
          </div>
        </div>

        {/* Live HUD */}
        <div className="flex gap-12 font-mono mb-12 h-8 transition-opacity duration-300">
           {gameState === 'playing' && (
             <>
               <div className="flex items-baseline gap-2">
                 <span className="text-[10px] text-slate-600 uppercase">Mission Clock</span>
                 <span className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-purple-400'}`}>{timeLeft}s</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-[10px] text-slate-600 uppercase">Input Velocity</span>
                 <span className="text-xl font-bold text-white">{liveWpm} <span className="text-[10px] text-slate-500 opacity-50">WPM</span></span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-[10px] text-slate-600 uppercase">Transmission</span>
                 <span className="text-xl font-bold text-slate-400">{Math.round((typedContent.length / targetText.length) * 100)}%</span>
               </div>
             </>
           )}
        </div>

        {/* Continuous Flow Engine */}
        <div className="relative min-h-[350px] text-xl md:text-2xl font-mono leading-relaxed tracking-wider text-justify">
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            value={typedContent}
            onKeyDown={handleKeyDown}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
          />

          {/* Precise Caret (Solid) */}
          {gameState !== 'ended' && (
            <div 
              ref={caretRef}
              className="absolute w-[2px] h-[1.3em] bg-purple-400 z-10 shadow-[0_0_15px_rgba(168,85,247,0.9)] opacity-0"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* Focus Warning */}
          {gameState === 'playing' && !isFocused && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#010205]/20 backdrop-blur-[1px] cursor-pointer">
              <span className="text-xs font-mono text-purple-400 animate-pulse tracking-widest uppercase px-6 py-3 rounded-full border border-purple-500/20 bg-[#0d0714]">Connection Interrupted: Click to Focus</span>
            </div>
          )}

          {/* Start Trigger */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-8">
               <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="group relative px-16 py-6 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all hover:scale-105 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center gap-4"
              >
                <span className="uppercase tracking-[0.3em] text-[11px]">Initiate Stream</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}

          {/* Justified Character Stream with Selective Rendering */}
          <div 
            ref={textContainerRef}
            className={`transition-all duration-700 text-justify break-words hyphens-none ${gameState === 'idle' ? 'opacity-[0.03] blur-2xl scale-110' : 'opacity-100'} ${gameState === 'ended' ? 'opacity-0 pointer-events-none' : ''}`}
            style={{ textAlignLast: 'left' }}
          >
            {targetText.split("").map((char, i) => {
               let status: "pending" | "correct" | "incorrect" = "pending";
               if (typedContent[i] !== undefined) {
                 status = typedContent[i] === char ? "correct" : "incorrect";
               }
               return <SelectiveChar key={i} char={char} status={status} />;
            })}
          </div>

          {/* Result Terminal */}
          {gameState === "ended" && (
             <div className="absolute inset-x-0 top-0 z-50 flex flex-col items-center justify-center p-12 bg-[#0d0714]/80 backdrop-blur-3xl rounded-[40px] border border-white/5 animate-[fadeUp_0.8s_forwards] shadow-[0_0_100px_rgba(168,85,247,0.1)]">
                <span className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.5em] mb-12 opacity-70">Transmission Finalized</span>
                <div className="flex flex-wrap justify-center gap-12 md:gap-32 mb-16">
                  <div className="text-center group">
                    <div className="text-8xl font-black text-white group-hover:text-purple-400 transition-colors duration-500">{liveWpm}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase mt-4 tracking-widest">Final Velocity (WPM)</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-8xl font-black text-white group-hover:text-purple-400 transition-colors duration-500">{accuracy}%</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-4 tracking-widest uppercase">Stream Accuracy</div>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <button 
                    onClick={(e) => { e.stopPropagation(); generateContent(); }}
                    className="px-14 py-5 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] uppercase tracking-widest text-[11px]"
                  >
                    Reset Gear
                  </button>
                  <Link 
                    href="/#games"
                    className="px-14 py-5 border border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-all text-[11px] uppercase tracking-widest"
                  >
                    Close Log
                  </Link>
                </div>
             </div>
          )}
        </div>

        {/* Footer Hint */}
        {gameState !== 'ended' && (
          <div className="text-center mt-12 text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em]">
            Escape: Quick Reset // Space: Standard Character
          </div>
        )}
      </div>
    </div>
  );
}
