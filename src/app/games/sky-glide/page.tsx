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
  { id: "solar", name: "Solar Flare", cost: 500, body: "#f59e0b", glow: "#ef4444", flame: "#ffffff", desc: "Forged in the heart of a dying star." },
  { id: "hyperion", name: "Hyperion Eclipse", cost: 2500, body: "#111111", glow: "#ffffff", flame: "#06b6d4", desc: "Experimental stealth tech. The pinnacle of airframes." },
];

type GameState = "START" | "PLAYING" | "GAME_OVER" | "HANGAR";

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

    if (savedHL) setHighScore(parseInt(savedHL));
    if (savedCR) setCredits(parseInt(savedCR));
    if (savedSK) setSelectedSkinId(savedSK);
    if (savedOW) {
        try { setOwnedSkins(JSON.parse(savedOW)); } catch(e) { setOwnedSkins(["default"]); }
    }
  }, []);

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
    // START requires button click now as per user request
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

  // Input listeners
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

    // --- Difficulty Scaling ---
    const currentSpeed = BASE_PIPE_SPEED + (levelRef.current - 1) * 0.4;
    const currentGap = Math.max(120, BASE_PIPE_GAP - (levelRef.current - 1) * 6);
    const currentSpawnRate = Math.max(65, BASE_SPAWN_RATE - (levelRef.current - 1) * 8);

    // --- Bird ---
    birdVelocity.current += GRAVITY;
    birdY.current += birdVelocity.current;
    if (birdY.current < 0) birdY.current = 0;
    if (birdY.current > canvas.height - BIRD_SIZE) {
        setGameState("GAME_OVER");
        return;
    }

    frameCount.current++;

    // --- Pipes ---
    if (frameCount.current % Math.floor(currentSpawnRate) === 0) {
      const minHeight = 50;
      const maxHeight = canvas.height - currentGap - minHeight;
      const topH = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipes.current.push({ x: canvas.width, topHeight: topH, passed: false });

      // Spawn Star (reduced frequency as requested)
      if (Math.random() > 0.8) {
        stars.current.push({
            id: Math.random().toString(),
            x: canvas.width + 100,
            y: topH + (currentGap / 2) + (Math.random() * 40 - 20),
            collected: false
        });
      }
    }

    // --- Meteors ---
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

    // Process Pipes
    pipes.current.forEach(p => {
        p.x -= currentSpeed;
        // Collision
        if (50 + BIRD_SIZE - 5 > p.x && 50 + 5 < p.x + PIPE_WIDTH) {
            if (birdY.current + 5 < p.topHeight || birdY.current + BIRD_SIZE - 5 > p.topHeight + currentGap) {
                setGameState("GAME_OVER");
            }
        }
        // Score & Leveling
        if (!p.passed && p.x + PIPE_WIDTH < 50) {
            p.passed = true;
            scoreRef.current++;
            setScore(scoreRef.current);

            // Level Up Check
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

    // Process Stars
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

    // Process Meteors
    meteors.current.forEach(m => {
        m.x += m.vx;
        m.y += m.vy;
        m.rotation += m.dr;
        const dist = Math.hypot(m.x - (50 + BIRD_SIZE/2), m.y - (birdY.current + BIRD_SIZE/2));
        if (dist < (m.size/2 + BIRD_SIZE/2 - 5)) {
            setGameState("GAME_OVER");
        }
    });

    // Clean up
    pipes.current = pipes.current.filter(p => p.x > -100);
    stars.current = stars.current.filter(s => s.x > -100 && !s.collected);
    meteors.current = meteors.current.filter(m => m.x > -100);

    // Effects
    scoreEffects.current.forEach(e => {
        e.y -= 1;
        e.opacity -= 0.02;
    });
    scoreEffects.current = scoreEffects.current.filter(e => e.opacity > 0);

  }, [gameState, highScore]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars Background
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    for(let i=0; i<8; i++) {
        ctx.beginPath();
        const tx = (Date.now() / (50 - i*2) + i * 200) % canvas.width;
        ctx.arc(canvas.width - tx, (i * 123) % canvas.height, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Pipes
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

        // Subtle glow at gap edges
        ctx.fillStyle = "rgba(168, 85, 247, 0.4)";
        ctx.fillRect(p.x, p.topHeight - 2, PIPE_WIDTH, 2);
        ctx.fillRect(p.x, p.topHeight + currentGap, PIPE_WIDTH, 2);
    });

    // Draw Stars
    stars.current.forEach(s => {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#facc15";
        ctx.fillStyle = "#facc15";
        const pulse = 1 + Math.sin(Date.now() / 150) * 0.2;
        ctx.translate(s.x, s.y);
        ctx.scale(pulse, pulse);
        ctx.beginPath();
        for(let i=0; i<5; i++) {
            ctx.rotate(Math.PI / 2.5);
            ctx.lineTo(0, 0 - 8);
            ctx.rotate(Math.PI / 2.5);
            ctx.lineTo(0, 0 - 4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    });

    // Draw Meteors
    meteors.current.forEach(m => {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rotation);
        ctx.fillStyle = "#2d2d2d";
        ctx.strokeStyle = "#444";
        ctx.beginPath();
        ctx.moveTo(m.size/2, 0);
        for(let i=1; i<8; i++) {
            const r = m.size/2 + (Math.sin(i * 1.5) * 5);
            ctx.lineTo(r * Math.cos(i * Math.PI/4), r * Math.sin(i * Math.PI/4));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    });

    // Draw Bird
    ctx.save();
    ctx.translate(50 + BIRD_SIZE/2, birdY.current + BIRD_SIZE/2);
    ctx.rotate(Math.min(Math.PI/4, Math.max(-Math.PI/4, birdVelocity.current * 0.1)));
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = selectedSkin.glow;
    ctx.fillStyle = selectedSkin.body;
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-12, -12); ctx.lineTo(-12, 12); ctx.closePath(); ctx.fill();

    // Flame
    if (gameState === "PLAYING") {
        ctx.fillStyle = selectedSkin.flame;
        ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(-24 - Math.random()*12, 0); ctx.lineTo(-12, 6); ctx.fill();
    }
    ctx.restore();

    // Effects
    scoreEffects.current.forEach(e => {
        ctx.save();
        ctx.globalAlpha = e.opacity;
        ctx.fillStyle = e.color;
        ctx.font = "bold 16px font-mono";
        ctx.fillText(e.text, e.x, e.y);
        ctx.restore();
    });

  }, [gameState, selectedSkin]);

  // Main Loop
  useEffect(() => {
    const loop = () => { update(); draw(); requestRef.current = requestAnimationFrame(loop); };
    requestRef.current = requestAnimationFrame(loop);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [update, draw]);

  // Handle Game Over
  useEffect(() => {
    if (gameState === "GAME_OVER") {
      const finalCredits = credits + sessionCredits;
      setCredits(finalCredits);
      localStorage.setItem("sky-glide-credits", finalCredits.toString());
    }
  }, [gameState]);

  // Render Logic
  return (
    <div ref={containerRef} className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center select-none overflow-hidden">
        
        {/* HUD: Persistent Header */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-12 animate-[fadeIn_0.8s]">
            <Link href="/#games" className="text-[10px] font-mono text-slate-500 hover:text-sky-400 uppercase tracking-[0.3em] transition-colors">← Back to Command</Link>
            <div className="flex gap-12 bg-black/40 px-8 py-4 rounded-full border border-white/5 backdrop-blur-xl">
                <div className="text-center">
                    <p className="text-[8px] font-mono text-slate-600 uppercase mb-1">Star Credits</p>
                    <p className="text-xl font-bold text-yellow-500 tracking-widest">{credits.toLocaleString()}</p>
                </div>
                <div className="text-center">
                    <p className="text-[8px] font-mono text-slate-600 uppercase mb-1">Sector Record</p>
                    <p className="text-xl font-bold text-sky-400 tracking-widest">{highScore}</p>
                </div>
            </div>
        </div>

        {/* Game Container */}
        <div 
          className="relative w-full max-w-[800px] aspect-[16/10] bg-[#0d0714]/80 backdrop-blur-3xl rounded-[48px] border border-white/10 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
          onClick={jump}
        >
            <canvas ref={canvasRef} width={800} height={500} className="w-full h-full block" />

            {/* Level Up Notification */}
            {showLevelUp && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <div className="text-center animate-[scaleIn_0.5s_ease-out_forwards]">
                      <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_20px_#38bdf8]">Sector Advanced</h2>
                      <p className="text-sky-400 font-mono text-xs uppercase tracking-[0.4em] mt-2">Level {level} Engaged</p>
                  </div>
              </div>
            )}

            {/* Playing HUD Overlay */}
            {gameState === "PLAYING" && (
                <div className="absolute inset-x-0 top-0 p-10 flex justify-between items-start pointer-events-none z-10">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Pillars Passed</span>
                            <span className="text-5xl font-black text-white drop-shadow-2xl">{score}</span>
                        </div>
                        <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full w-fit">
                            <span className="text-[8px] font-mono text-sky-400 uppercase tracking-widest font-bold">Sector {level}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full">
                           <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest">Captured</span>
                           <span className="text-lg font-bold text-yellow-400">{sessionCredits}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlays */}
            {gameState === "START" && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center z-40">
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.6em] mb-4">Deep Space Protocol</span>
                    <h1 className="text-6xl md:text-7xl font-black text-white italic tracking-tighter mb-12 uppercase">Sky Glide</h1>
                    
                    {/* Visual Tutorial */}
                    <div className="flex justify-center gap-12 mb-12 opacity-80">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center bg-white/5 font-mono text-[10px] text-sky-400">SPC</div>
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Jump</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center bg-white/5 text-xl">🖱️</div>
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Click</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetGame(); }}
                          className="px-14 py-5 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(56,189,248,0.4)]"
                        >
                          Launch Mission
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setGameState("HANGAR"); }}
                            className="px-14 py-5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm uppercase tracking-widest backdrop-blur-md"
                        >
                            Open Hangar
                        </button>
                    </div>

                    <div className="mt-12">
                        <Link href="/#games" className="text-[9px] font-mono text-slate-500 hover:text-sky-400 uppercase tracking-[0.4em] transition-colors">← Abandon Mission & Return to Bridge</Link>
                    </div>
                </div>
            )}

            {gameState === "HANGAR" && (
                <div className="absolute inset-0 bg-[#0d0714]/95 backdrop-blur-3xl flex flex-col p-12 overflow-y-auto z-40">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Vessel Customization</h2>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setGameState("START"); }}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SKINS.map(skin => {
                            const isOwned = ownedSkins.includes(skin.id);
                            const isSelected = selectedSkinId === skin.id;
                            const canBuy = credits >= skin.cost;

                            return (
                                <div key={skin.id} className={`p-8 rounded-[32px] border transition-all ${isSelected ? "bg-white/5 border-sky-500/50" : "bg-white/2 border-white/5 hover:border-white/10"}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">{skin.name}</h3>
                                            <p className="text-[10px] font-mono text-slate-500 leading-relaxed max-w-[180px]">{skin.desc}</p>
                                        </div>
                                        <div className="w-16 h-12 relative flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full blur-xl absolute" style={{ backgroundColor: skin.glow }}></div>
                                            <div className="w-6 h-6 border-2 relative z-10 rotate-45" style={{ borderColor: skin.body, backgroundColor: skin.glow + "20" }}></div>
                                        </div>
                                    </div>

                                    {isOwned ? (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); equipSkin(skin.id); }}
                                            disabled={isSelected}
                                            className={`w-full py-4 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] transition-all ${isSelected ? "bg-sky-500 text-white cursor-default" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                                        >
                                            {isSelected ? "Equipped" : "Select Vessel"}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); buySkin(skin); }}
                                            disabled={!canBuy}
                                            className={`w-full py-4 rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${canBuy ? "bg-yellow-500 text-black font-bold hover:bg-yellow-400" : "bg-white/5 text-slate-600 cursor-not-allowed border-white/5"}`}
                                        >
                                            <span className="text-sm">⭐</span> {skin.cost} Credits
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {gameState === "GAME_OVER" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-[scaleIn_0.4s_ease-out] z-40">
                    <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.6em] mb-4">Signal Lost</span>
                    <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4 uppercase">Vessel Down</h2>
                    <div className="px-4 py-1.5 bg-sky-500/20 rounded-full mb-10">
                        <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold">Final Sector: {level}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="flex flex-col">
                            <span className="text-7xl font-black text-white">{score}</span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2">Passed</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-7xl font-black text-yellow-400">+{sessionCredits}</span>
                            <span className="text-[10px] font-mono text-yellow-600 uppercase tracking-widest mt-2">Earned</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetGame(); }}
                          className="px-14 py-5 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all text-xs uppercase tracking-widest"
                        >
                          Restart Sim
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setGameState("HANGAR"); }}
                            className="px-14 py-5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                        >
                            Hangar
                        </button>
                    </div>
                </div>
            )}

        </div>

    </div>
  );
}
