"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// --- Game Constants (Base Values) ---
const GRAVITY = 0.25;
const JUMP_STRENGTH = -5.2;
const BASE_PIPE_SPEED = 2.2;
const PIPE_WIDTH = 60;
const BASE_PIPE_GAP = 160;
const BIRD_SIZE = 34;
const BASE_SPAWN_RATE = 100;

interface Skin {
  id: string;
  name: string;
  cost: number;
  body: string;
  glow: string;
  flame: string;
  desc: string;
}

const SKINS: Skin[] = [
  { id: "default", name: "Standard Mk.I", cost: 0, body: "#ffffff", glow: "#38bdf8", flame: "#38bdf8", desc: "Reliable scouting vessel. Standard issue." },
  { id: "neon", name: "Neon Strike", cost: 50, body: "#00f2ff", glow: "#00f2ff", flame: "#00f2ff", desc: "Equipped with high-intensity plasma emitters." },
  { id: "specter", name: "Void Specter", cost: 150, body: "#a855f7", glow: "#ffffff", flame: "#a855f7", desc: "Phase-shifted hull for deep void traversal." },
  { id: "crimson", name: "Crimson Fury", cost: 800, body: "#ef4444", glow: "#f59e0b", flame: "#991b1b", desc: "Aggressive frame designed for high-risk maneuvers." },
  { id: "solar", name: "Solar Flare", cost: 500, body: "#f59e0b", glow: "#ef4444", flame: "#ffffff", desc: "Forged in the heart of a dying star." },
  { id: "hyperion", name: "Hyperion Eclipse", cost: 2500, body: "#111111", glow: "#ffffff", flame: "#06b6d4", desc: "Experimental stealth tech. The pinnacle of airframes." },
];

type GameState = "START" | "PLAYING" | "GAME_OVER" | "HANGAR";

const MOTIVATIONS = [
  "Even gravity is laughing at that maneuver.",
  "That meteor just wanted a high-five. You gave it your whole ship.",
  "Don't worry, those pillars have zero respect for personal space.",
  "A great pilot isn't one who never crashes, but one who follows their dreams... into a wall.",
  "Were you trying to phase through that? Spoiler: Physics says no.",
  "Mission Control is officially sending tissues via emergency drone.",
  "The other astronauts are asking: 'What exactly was the plan there?'",
  "Space is infinite, yet you found the one thing to hit. Impressive!",
  "Try again. That pillar is getting a bit too smug.",
  "We have plenty of backup jets. It's just your ego that's in critical condition.",
  "Gravity: 1, Pilot: 0. Don't worry, it's just a temporary lead!",
  "The Captain suggests checking your eye prescription.",
  "That pylon is currently celebrating its victory. Reclaim your honor!",
  "Don't be sad. That pillar was always a bit of a jerk anyway.",
  "Was that a new tactical maneuver? Oh, wait... no, just a regular crash.",
  "Your flight recorder just filed for early retirement.",
  "I've seen better flight paths from a confused pigeon.",
  "Is the joystick upside down? Just checking for a friend.",
  "That was a masterpiece of unintentional destruction.",
  "Technically, you successfully stopped. Just... very abruptly.",
  "The insurance company just blocked our number.",
  "If you were trying to paint the energy beam with your hull, mission accomplished.",
  "You're making the vacuum of space look surprisingly crowded.",
  "Even the stars are blinking in disbelief right now.",
  "Look on the bright side: you're creating a lot of jobs for the repair crew."
];

interface Pipe { x: number; topHeight: number; passed: boolean; }
interface Star { x: number; y: number; collected: boolean; id: string; }
interface Meteor { x: number; y: number; vx: number; vy: number; size: number; rotation: number; dr: number; }

export default function SkyGlide() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [credits, setCredits] = useState(0);
  const [sessionCredits, setSessionCredits] = useState(0);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(["default"]);
  const [selectedSkinId, setSelectedSkinId] = useState("default");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [pilotName, setPilotName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState("");
  const [currentMotivation, setCurrentMotivation] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  // Game Logic Refs
  const birdY = useRef(250);
  const birdVelocity = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const stars = useRef<Star[]>([]);
  const meteors = useRef<Meteor[]>([]);
  const frameCount = useRef(0);
  const scoreEffects = useRef<{ x: number, y: number, opacity: number, text: string, color: string }[]>([]);
  const scoreRef = useRef(0);
  const sessionCreditsRef = useRef(0);
  const levelRef = useRef(1);

  const selectedSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];

  // Initialize Data
  useEffect(() => {
    const savedHL = localStorage.getItem("sky-glide-highscore");
    const savedCR = localStorage.getItem("sky-glide-credits");
    const savedOW = localStorage.getItem("sky-glide-owned-skins");
    const savedSK = localStorage.getItem("sky-glide-selected-skin");
    const savedPilot = localStorage.getItem("sky-glide-pilot");

    if (savedHL) setHighScore(parseInt(savedHL));
    if (savedCR) setCredits(parseInt(savedCR));
    if (savedSK) setSelectedSkinId(savedSK);
    if (savedPilot) {
      setPilotName(savedPilot);
    } else {
      setShowNamePrompt(true);
    }
    if (savedOW) {
        try { setOwnedSkins(JSON.parse(savedOW)); } catch(e) { setOwnedSkins(["default"]); }
    }
  }, []);

  const savePilotName = () => {
    if (tempName.trim()) {
      setPilotName(tempName.trim());
      localStorage.setItem("sky-glide-pilot", tempName.trim());
      setShowNamePrompt(false);
    }
  };

  const resetGame = useCallback(() => {
    birdY.current = 250;
    birdVelocity.current = 0;
    pipes.current = [];
    stars.current = [];
    meteors.current = [];
    scoreEffects.current = [];
    frameCount.current = 0;
    scoreRef.current = 0;
    sessionCreditsRef.current = 0;
    levelRef.current = 1;
    setScore(0);
    setSessionCredits(0);
    setLevel(1);
    setGameState("PLAYING");
  }, []);

  const jump = useCallback(() => {
    if (gameState === "PLAYING") {
      birdVelocity.current = JUMP_STRENGTH;
    } else if (gameState === "GAME_OVER") {
      resetGame();
    }
  }, [gameState, resetGame]);

  const buySkin = (skin: Skin) => {
    if (credits >= skin.cost && !ownedSkins.includes(skin.id)) {
        const newCredits = credits - skin.cost;
        const newOwned = [...ownedSkins, skin.id];
        setCredits(newCredits);
        setOwnedSkins(newOwned);
        localStorage.setItem("sky-glide-credits", newCredits.toString());
        localStorage.setItem("sky-glide-owned-skins", JSON.stringify(newOwned));
    }
  };

  const equipSkin = (id: string) => {
    setSelectedSkinId(id);
    localStorage.setItem("sky-glide-selected-skin", id);
  };

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && gameState !== "HANGAR" && gameState !== "START") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, gameState]);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "PLAYING") return;

    // Scaling
    const currentSpeed = BASE_PIPE_SPEED + (levelRef.current - 1) * 0.4;
    const currentGap = Math.max(120, BASE_PIPE_GAP - (levelRef.current - 1) * 6);
    const currentSpawnRate = Math.max(65, BASE_SPAWN_RATE - (levelRef.current - 1) * 8);

    // Bird
    birdVelocity.current += GRAVITY;
    birdY.current += birdVelocity.current;
    if (birdY.current < 0) birdY.current = 0;
    if (birdY.current > canvas.height - BIRD_SIZE) {
        setGameState("GAME_OVER");
        return;
    }

    frameCount.current++;

    // Pipes
    if (frameCount.current % Math.floor(currentSpawnRate) === 0) {
      const minHeight = 50;
      const maxHeight = canvas.height - currentGap - minHeight;
      const topH = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipes.current.push({ x: canvas.width, topHeight: topH, passed: false });

      if (Math.random() > 0.8) {
        stars.current.push({
            id: Math.random().toString(),
            x: canvas.width + 100,
            y: topH + (currentGap / 2) + (Math.random() * 40 - 20),
            collected: false
        });
      }
    }

    // Meteors
    const meteorInterval = Math.max(100, 180 - (levelRef.current - 1) * 15);
    if (frameCount.current % Math.floor(meteorInterval) === 0 && Math.random() > 0.5) {
        meteors.current.push({
            x: canvas.width,
            y: Math.random() * canvas.height,
            vx: -(currentSpeed + 1 + Math.random() * 2),
            vy: (Math.random() - 0.5) * 1.5,
            size: 20 + Math.random() * 30,
            rotation: 0,
            dr: (Math.random() - 0.5) * 0.15
        });
    }

    // Process
    pipes.current.forEach(p => {
        p.x -= currentSpeed;
        if (50 + BIRD_SIZE - 5 > p.x && 50 + 5 < p.x + PIPE_WIDTH) {
            if (birdY.current + 5 < p.topHeight || birdY.current + BIRD_SIZE - 5 > p.topHeight + currentGap) {
                setGameState("GAME_OVER");
            }
        }
        if (!p.passed && p.x + PIPE_WIDTH < 50) {
            p.passed = true;
            scoreRef.current++;
            setScore(scoreRef.current);
            if (scoreRef.current % 10 === 0) {
                levelRef.current++;
                setLevel(levelRef.current);
                setShowLevelUp(true);
                setTimeout(() => setShowLevelUp(false), 2000);
            }
            if (scoreRef.current > highScore) {
               setHighScore(scoreRef.current);
               localStorage.setItem("sky-glide-highscore", scoreRef.current.toString());
            }
        }
    });

    stars.current.forEach(s => {
        s.x -= currentSpeed;
        const dist = Math.hypot(s.x - (50 + BIRD_SIZE/2), s.y - (birdY.current + BIRD_SIZE/2));
        if (!s.collected && dist < BIRD_SIZE) {
            s.collected = true;
            sessionCreditsRef.current += 10;
            setSessionCredits(sessionCreditsRef.current);
            scoreEffects.current.push({ x: 70, y: s.y, opacity: 1, text: "+10", color: "#facc15" });
        }
    });

    meteors.current.forEach(m => {
        m.x += m.vx; m.y += m.vy; m.rotation += m.dr;
        const dist = Math.hypot(m.x - (50 + BIRD_SIZE/2), m.y - (birdY.current + BIRD_SIZE/2));
        if (dist < (m.size/2 + BIRD_SIZE/2 - 5)) setGameState("GAME_OVER");
    });

    pipes.current = pipes.current.filter(p => p.x > -100);
    stars.current = stars.current.filter(s => s.x > -100 && !s.collected);
    meteors.current = meteors.current.filter(m => m.x > -100);

    scoreEffects.current.forEach(e => { e.y -= 1; e.opacity -= 0.02; });
    scoreEffects.current = scoreEffects.current.filter(e => e.opacity > 0);

  }, [gameState, highScore]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.1)";
    for(let i=0; i<8; i++) {
        ctx.beginPath();
        const tx = (Date.now() / (50 - i*2) + i * 200) % canvas.width;
        ctx.arc(canvas.width - tx, (i * 123) % canvas.height, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    pipes.current.forEach(p => {
        const currentGap = Math.max(120, BASE_PIPE_GAP - (levelRef.current - 1) * 6);
        const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
        grad.addColorStop(0, "#1e1b4b"); grad.addColorStop(0.5, "#4338ca"); grad.addColorStop(1, "#1e1b4b");
        ctx.fillStyle = grad;
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
        ctx.fillRect(p.x, p.topHeight + currentGap, PIPE_WIDTH, canvas.height);
        ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
        ctx.strokeRect(p.x, 0, PIPE_WIDTH, p.topHeight);
        ctx.strokeRect(p.x, p.topHeight + currentGap, PIPE_WIDTH, canvas.height);
        ctx.fillStyle = "rgba(168, 85, 247, 0.4)";
        ctx.fillRect(p.x, p.topHeight - 2, PIPE_WIDTH, 2);
        ctx.fillRect(p.x, p.topHeight + currentGap, PIPE_WIDTH, 2);
    });

    stars.current.forEach(s => {
        ctx.save();
        ctx.shadowBlur = 15; ctx.shadowColor = "#facc15"; ctx.fillStyle = "#facc15";
        const pulse = 1 + Math.sin(Date.now() / 150) * 0.2;
        ctx.translate(s.x, s.y); ctx.scale(pulse, pulse);
        ctx.beginPath();
        for(let i=0; i<5; i++) { ctx.rotate(Math.PI / 2.5); ctx.lineTo(0, 0 - 8); ctx.rotate(Math.PI / 2.5); ctx.lineTo(0, 0 - 4); }
        ctx.closePath(); ctx.fill(); ctx.restore();
    });

    meteors.current.forEach(m => {
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.rotation);
        ctx.fillStyle = "#2d2d2d"; ctx.strokeStyle = "#444";
        ctx.beginPath(); ctx.moveTo(m.size/2, 0);
        for(let i=1; i<8; i++) { const r = m.size/2 + (Math.sin(i * 1.5) * 5); ctx.lineTo(r * Math.cos(i * Math.PI/4), r * Math.sin(i * Math.PI/4)); }
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    });

    ctx.save();
    ctx.translate(50 + BIRD_SIZE/2, birdY.current + BIRD_SIZE/2);
    ctx.rotate(Math.min(Math.PI/4, Math.max(-Math.PI/4, birdVelocity.current * 0.1)));
    ctx.shadowBlur = 20; ctx.shadowColor = selectedSkin.glow; ctx.fillStyle = selectedSkin.body;
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-12, -12); ctx.lineTo(-12, 12); ctx.closePath(); ctx.fill();
    if (gameState === "PLAYING") {
        ctx.fillStyle = selectedSkin.flame;
        ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(-24 - Math.random()*12, 0); ctx.lineTo(-12, 6); ctx.fill();
    }
    ctx.restore();

    scoreEffects.current.forEach(e => {
        ctx.save(); ctx.globalAlpha = e.opacity; ctx.fillStyle = e.color; ctx.font = "bold 16px font-mono";
        ctx.fillText(e.text, e.x, e.y); ctx.restore();
    });
  }, [gameState, selectedSkin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        // Mobile: 9:12 aspect -> 600x800 internal res
        canvas.width = 600;
        canvas.height = 800;
      } else {
        // Desktop: 16:10 aspect -> 800x500 internal res
        canvas.width = 800;
        canvas.height = 500;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const loop = () => { update(); draw(); requestRef.current = requestAnimationFrame(loop); };
    requestRef.current = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update, draw]);

  // Handle Game Over
  useEffect(() => {
    if (gameState === "GAME_OVER") {
      const finalCredits = credits + sessionCredits;
      setCredits(finalCredits);
      localStorage.setItem("sky-glide-credits", finalCredits.toString());
      
      // Pick random motivation
      const randomMsg = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
      setCurrentMotivation(randomMsg);
    }
  }, [gameState]);

  return (
    <div ref={containerRef} className="min-h-screen pt-24 sm:pt-40 pb-10 sm:pb-20 px-4 sm:px-8 flex flex-col items-center select-none overflow-hidden touch-none">
        
        {/* HUD: Persistent Header */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 sm:mb-12 animate-[fadeIn_0.8s]">
            <Link href="/#games" className="text-[9px] sm:text-[10px] font-mono text-slate-500 hover:text-sky-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-colors truncate">← Bridge</Link>
            <div className="flex gap-4 sm:gap-12 bg-black/40 px-4 sm:px-8 py-2 sm:py-4 rounded-full border border-white/5 backdrop-blur-xl shrink-0">
                <div className="text-center">
                    <p className="text-[7px] sm:text-[8px] font-mono text-slate-600 uppercase mb-0.5 sm:mb-1">Pilot</p>
                    <p className="text-sm sm:text-lg font-bold text-sky-400 tracking-wider truncate max-w-[80px] sm:max-w-[120px]">{pilotName || "Unknown"}</p>
                </div>
                <div className="text-center border-l border-white/5 pl-4 sm:pl-12">
                    <p className="text-[7px] sm:text-[8px] font-mono text-slate-600 uppercase mb-0.5 sm:mb-1">Credits</p>
                    <p className="text-sm sm:text-xl font-bold text-yellow-500 tracking-wider sm:tracking-widest">{credits.toLocaleString()}</p>
                </div>
            </div>
        </div>

        {/* Game Container */}
        <div 
          className="relative w-full max-w-[800px] aspect-[9/12] sm:aspect-[16/10] bg-[#0d0714]/80 backdrop-blur-3xl rounded-[32px] sm:rounded-[48px] border border-white/10 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] touch-manipulation"
          onClick={jump}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Level Up */}
            {showLevelUp && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 px-4">
                  <div className="text-center animate-[scaleIn_0.5s_ease-out_forwards]">
                      <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_20px_#38bdf8]">Sector Advanced</h2>
                      <p className="text-sky-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">Level {level} Engaged</p>
                  </div>
              </div>
            )}

            {/* In-Game HUD */}
            {gameState === "PLAYING" && (
                <div className="absolute inset-x-0 top-0 p-4 sm:p-10 flex justify-between items-start pointer-events-none z-10">
                    <div className="flex flex-col gap-1 sm:gap-2">
                        <div className="flex flex-col">
                            <span className="text-[8px] sm:text-[10px] font-mono text-slate-600 uppercase tracking-widest">Score</span>
                            <span className="text-3xl sm:text-5xl font-black text-white drop-shadow-2xl leading-none">{score}</span>
                        </div>
                        <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-sky-500/10 border border-sky-500/20 rounded-full w-fit">
                            <span className="text-[7px] sm:text-[8px] font-mono text-sky-400 uppercase tracking-widest font-bold">Lvl {level}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 bg-yellow-500/10 border border-yellow-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md">
                           <span className="text-[8px] sm:text-[10px] font-mono text-yellow-500 uppercase tracking-widest">Star</span>
                           <span className="text-sm sm:text-lg font-bold text-yellow-400 leading-none">{sessionCredits}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* START */}
            {gameState === "START" && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 sm:p-12 text-center z-40">
                    <span className="text-[8px] sm:text-[10px] font-mono text-sky-400 uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-2 sm:mb-4">
                      {pilotName ? `Welcome Back, Pilot ${pilotName}` : "Deep Space Protocol"}
                    </span>
                    <h1 className="text-4xl sm:text-7xl font-black text-white italic tracking-tighter mb-8 sm:mb-12 uppercase">Sky Glide</h1>
                    
                    <div className="hidden sm:flex justify-center gap-12 mb-12 opacity-80 scale-90 sm:scale-100">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center bg-white/5 font-mono text-[10px] text-sky-400">SPC</div>
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Jump</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center bg-white/5 text-xl">🖱️</div>
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Click</span>
                        </div>
                    </div>
                    <p className="sm:hidden text-[9px] font-mono text-sky-400/60 uppercase tracking-widest mb-8 animate-pulse text-center">Tap screen to jump</p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-10 sm:px-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetGame(); }}
                          className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(56,189,248,0.4)]"
                        >
                          Launch
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setGameState("HANGAR"); }}
                            className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-xs uppercase tracking-widest backdrop-blur-md"
                        >
                            Hangar
                        </button>
                    </div>

                    <div className="mt-8 sm:mt-12">
                        <Link href="/#games" className="text-[8px] sm:text-[9px] font-mono text-slate-500 hover:text-sky-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-colors py-2 block">← Return to Bridge</Link>
                    </div>
                </div>
            )}

            {/* HANGAR */}
            {gameState === "HANGAR" && (
                <div className="absolute inset-0 bg-[#0d0714]/95 backdrop-blur-3xl flex flex-col p-6 sm:p-12 overflow-y-auto z-40 custom-scrollbar">
                    <div className="flex justify-between items-center mb-6 sm:mb-12 sticky top-0 bg-[#0d0714]/95 py-2 z-10">
                        <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter italic">Hangar</h2>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setGameState("START"); }}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-8">
                        {SKINS.map(skin => {
                            const isOwned = ownedSkins.includes(skin.id);
                            const isSelected = selectedSkinId === skin.id;
                            const canBuy = credits >= skin.cost;

                            return (
                                <div key={skin.id} className={`p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] border transition-all ${isSelected ? "bg-white/5 border-sky-500/50" : "bg-white/2 border-white/5 hover:border-white/10"}`}>
                                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                                        <div className="flex flex-col gap-0.5 sm:gap-1">
                                            <h3 className="text-sm sm:text-lg font-bold text-white uppercase tracking-tight">{skin.name}</h3>
                                            <p className="text-[8px] sm:text-[10px] font-mono text-slate-500 leading-relaxed max-w-[140px] sm:max-w-[180px]">{skin.desc}</p>
                                        </div>
                                        <div className="w-12 h-10 sm:w-16 sm:h-12 relative flex items-center justify-center">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full blur-lg sm:blur-xl absolute" style={{ backgroundColor: skin.glow }}></div>
                                            <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 relative z-10 rotate-45" style={{ borderColor: skin.body, backgroundColor: skin.glow + "20" }}></div>
                                        </div>
                                    </div>

                                    {isOwned ? (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); equipSkin(skin.id); }}
                                            disabled={isSelected}
                                            className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.2em] transition-all ${isSelected ? "bg-sky-500 text-white cursor-default" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                                        >
                                            {isSelected ? "Active" : "Select"}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); buySkin(skin); }}
                                            disabled={!canBuy}
                                            className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${canBuy ? "bg-yellow-500 text-black font-bold hover:bg-yellow-400" : "bg-white/5 text-slate-600 cursor-not-allowed border-white/5"}`}
                                        >
                                            <span className="text-xs">⭐</span> {skin.cost} CR
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* GAME OVER */}
            {gameState === "GAME_OVER" && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-12 text-center animate-[scaleIn_0.4s_ease-out] z-40">
                    <span className="text-[8px] sm:text-[10px] font-mono text-red-500 uppercase tracking-widest mb-2">Signal Lost</span>
                    <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter mb-2 sm:mb-4 uppercase">Down</h2>
                    
                    <p className="text-xs sm:text-sm font-mono text-slate-400 mb-6 bg-slate-400/5 px-6 py-3 rounded-2xl italic">
                      "{currentMotivation}"
                    </p>

                    <div className="flex flex-col items-center gap-2 mb-8 sm:mb-10">
                      <div className="px-3 py-1 bg-sky-500/20 rounded-full backdrop-blur-md border border-sky-500/30">
                          <span className="text-[8px] sm:text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold font-mono">Lvl reached: {level}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Pilot: {pilotName}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 sm:gap-12 mb-10 sm:mb-16">
                        <div className="flex flex-col">
                            <span className="text-4xl sm:text-7xl font-black text-white leading-none">{score}</span>
                            <span className="text-[8px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1.5 sm:mt-2 font-mono">Pillars</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-4xl sm:text-7xl font-black text-yellow-500 leading-none">+{sessionCredits}</span>
                            <span className="text-[8px] sm:text-[10px] font-mono text-yellow-600 uppercase tracking-widest mt-1.5 sm:mt-2 font-mono">Credits</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-10 sm:px-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetGame(); }}
                          className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all text-[10px] sm:text-xs uppercase tracking-widest"
                        >
                          Retry
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setGameState("HANGAR"); }}
                            className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-[10px] sm:text-xs uppercase tracking-widest"
                        >
                            Hangar
                        </button>
                    </div>
                </div>
            )}
            {/* Pilot Identity Prompt */}
            {showNamePrompt && (
              <div className="absolute inset-0 bg-[#0d0714] backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center z-[100] animate-[fadeIn_0.5s]">
                <div className="w-full max-w-sm">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.5em] mb-4 block">Central Registry</span>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8">Identify Pilot</h2>
                  <div className="relative mb-8">
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter Callsign..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-sky-500/50 transition-all text-center uppercase tracking-widest"
                      onKeyDown={(e) => e.key === "Enter" && savePilotName()}
                      autoFocus
                    />
                  </div>
                  <button 
                    onClick={savePilotName}
                    disabled={!tempName.trim()}
                    className="w-full py-5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-all text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(56,189,248,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Authorize Call-Sign
                  </button>
                  <p className="mt-8 text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-relaxed">
                    Identity will be encoded into the galaxy registry for future sorting.
                  </p>
                </div>
              </div>
            )}
        </div>
    </div>
  );
}
