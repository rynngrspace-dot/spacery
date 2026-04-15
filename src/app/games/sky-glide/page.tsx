"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// --- Game Constants ---
const GRAVITY = 0.25;
const JUMP_STRENGTH = -5.2;
const PIPE_SPEED = 2.2;
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const BIRD_SIZE = 34;
const SPAWN_RATE = 100; // frames between pipe spawns

type GameState = "START" | "PLAYING" | "GAME_OVER";

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export default function SkyGlide() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  // Game Logic Refs (to avoid re-renders during loop)
  const birdY = useRef(300);
  const birdVelocity = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const frameCount = useRef(0);
  const scoreEffects = useRef<{ x: number, y: number, opacity: number }[]>([]);
  const scoreRef = useRef(0);

  // Initialize High Score
  useEffect(() => {
    const saved = localStorage.getItem("sky-glide-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const resetGame = useCallback(() => {
    birdY.current = 250;
    birdVelocity.current = 0;
    pipes.current = [];
    scoreEffects.current = [];
    frameCount.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setGameState("PLAYING");
  }, []);

  const jump = useCallback(() => {
    if (gameState === "PLAYING") {
      birdVelocity.current = JUMP_STRENGTH;
    } else if (gameState === "START" || gameState === "GAME_OVER") {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (gameState !== "PLAYING") return;

    // Update Bird
    birdVelocity.current += GRAVITY;
    birdY.current += birdVelocity.current;

    // Boundary Check
    if (birdY.current < 0) birdY.current = 0;
    if (birdY.current > canvas.height - BIRD_SIZE) {
      setGameState("GAME_OVER");
      return;
    }

    // Update Pipes
    frameCount.current++;
    if (frameCount.current % SPAWN_RATE === 0) {
      const minHeight = 50;
      const maxHeight = canvas.height - PIPE_GAP - minHeight;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      pipes.current.push({ x: canvas.width, topHeight, passed: false });
    }

    pipes.current.forEach((pipe, i) => {
      pipe.x -= PIPE_SPEED;

      // Collision Detection
      const birdRect = { 
        left: 50 + 5, 
        right: 50 + BIRD_SIZE - 5, 
        top: birdY.current + 5, 
        bottom: birdY.current + BIRD_SIZE - 5 
      };
      
      const topPipeRect = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: 0, bottom: pipe.topHeight };
      const bottomPipeRect = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: pipe.topHeight + PIPE_GAP, bottom: canvas.height };

      if (
        (birdRect.right > topPipeRect.left && birdRect.left < topPipeRect.right && birdRect.top < topPipeRect.bottom) ||
        (birdRect.right > bottomPipeRect.left && birdRect.left < bottomPipeRect.right && birdRect.bottom > bottomPipeRect.top)
      ) {
        setGameState("GAME_OVER");
      }

      // Score Check
      if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
        pipe.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
        
        // Real-time High Score update
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
          localStorage.setItem("sky-glide-highscore", scoreRef.current.toString());
        }

        // Add score effect
        scoreEffects.current.push({ x: 70, y: birdY.current, opacity: 1 });
      }
    });

    // Update Score Effects
    scoreEffects.current.forEach(effect => {
      effect.y -= 1.5;
      effect.opacity -= 0.02;
    });
    scoreEffects.current = scoreEffects.current.filter(e => e.opacity > 0);

    // Remove Off-screen Pipes
    pipes.current = pipes.current.filter(p => p.x > -PIPE_WIDTH);
  }, [gameState]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Subtle Glows
    const time = Date.now() / 1000;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 200 + Math.sin(time) * 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw Bird (Spaceship)
    ctx.save();
    ctx.translate(50 + BIRD_SIZE/2, birdY.current + BIRD_SIZE/2);
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVelocity.current * 0.1));
    ctx.rotate(rotation);
    
    // Spaceship Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#38bdf8";
    
    // Main Body
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();

    // Engine Flame
    if (gameState === "PLAYING") {
      ctx.fillStyle = birdVelocity.current < 0 ? "#38bdf8" : "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(-10, -5);
      ctx.lineTo(-20 - Math.random() * 10, 0);
      ctx.lineTo(-10, 5);
      ctx.fill();
    }
    ctx.restore();

    // Draw Pipes (Energy Pillars)
    pipes.current.forEach(pipe => {
      const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      gradient.addColorStop(0, "#1e1b4b");
      gradient.addColorStop(0.5, "#4338ca");
      gradient.addColorStop(1, "#1e1b4b");

      ctx.fillStyle = gradient;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
      ctx.lineWidth = 2;

      // Top Pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      
      // Bottom Pipe
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - (pipe.topHeight + PIPE_GAP));
      ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - (pipe.topHeight + PIPE_GAP));

      // Glow Edges
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#a855f7";
      ctx.fillStyle = "#a855f7";
      ctx.fillRect(pipe.x, pipe.topHeight - 4, PIPE_WIDTH, 4);
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, 4);
      ctx.shadowBlur = 0;
    });

    // Draw Score Effects
    scoreEffects.current.forEach(effect => {
      ctx.save();
      ctx.globalAlpha = effect.opacity;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.fillText("+1", effect.x, effect.y);
      ctx.restore();
    });

  }, [gameState]);

  // Main Loop
  useEffect(() => {
    const loop = () => {
      update();
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update, draw]);

  // Handle Game Over persistence
  useEffect(() => {
    if (gameState === "GAME_OVER") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("sky-glide-highscore", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  // Animations
  useGSAP(() => {
    if (gameState === "GAME_OVER") {
      gsap.fromTo(".game-over-panel", 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, { scope: containerRef, dependencies: [gameState] });

  return (
    <div ref={containerRef} className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-12">
          <Link href="/#games" className="text-xs font-mono text-slate-500 hover:text-sky-400 transition-colors uppercase tracking-[0.3em]">
            ← Close Sim
          </Link>
          <div className="flex gap-8">
             <div className="text-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase mb-1">Current Scan</p>
                <p className="text-xl font-bold text-white tracking-widest">{score.toString().padStart(3, '0')}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase mb-1">Sector Record</p>
                <p className="text-xl font-bold text-sky-400 tracking-widest">{highScore.toString().padStart(3, '0')}</p>
             </div>
          </div>
        </div>

        {/* Game Area */}
        <div 
          className="relative w-full max-w-[800px] aspect-[16/10] sm:aspect-[16/9] bg-[#0d0714]/60 backdrop-blur-3xl rounded-[40px] border border-white/5 overflow-hidden cursor-pointer shadow-[0_0_100px_rgba(56,189,248,0.05)]"
          onClick={jump}
        >
          {/* Live HUD Overlay */}
          {gameState === "PLAYING" && (
            <div className="absolute inset-x-0 top-0 p-8 flex justify-between items-start pointer-events-none z-20 animate-[fadeIn_0.5s_ease-out]">
               <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Current Score</span>
                  <span className="text-4xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">{score}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-sky-500/50 uppercase tracking-[0.3em]">Sector Best</span>
                  <span className="text-2xl font-bold text-sky-400/80 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">{highScore}</span>
               </div>
            </div>
          )}

          <canvas 
            ref={canvasRef} 
            width={800} 
            height={450}
            className="w-full h-full block"
          />

          {/* Start Overlay */}
          {gameState === "START" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
               <div className="text-center p-12 animate-[fadeUp_0.8s_forwards]">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.4em] mb-4 block">Navigation Module: 60FPS</span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter uppercase italic">Sky Glide</h1>
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-12 max-w-xs mx-auto leading-relaxed">
                    Protect the ship. Navigate the pillars.
                  </p>
                  <button className="px-12 py-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all hover:scale-105 shadow-[0_0_40px_rgba(56,189,248,0.3)] text-xs uppercase tracking-widest">
                    Engage Thrusters
                  </button>
                  <p className="mt-8 text-[9px] font-mono text-slate-600 uppercase tracking-widest">Press Space or Click to Jump</p>
               </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === "GAME_OVER" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
               <div className="game-over-panel text-center p-12 bg-[#0d0714]/80 rounded-[40px] border border-white/5 shadow-[0_0_100px_rgba(244,63,94,0.1)]">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.4em] mb-4 block">Signal Lost</span>
                  <h2 className="text-4xl font-bold text-white mb-4 uppercase italic">Critical Failure</h2>
                  
                  <div className="flex justify-center gap-12 my-10">
                     <div>
                        <p className="text-8xl font-black text-white">{score}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase mt-2">Final Score</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <button 
                       onClick={(e) => { e.stopPropagation(); resetGame(); }}
                       className="px-12 py-4 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all text-[11px] uppercase tracking-widest"
                     >
                       Re-Initiate
                     </button>
                     <Link 
                       href="/#games"
                       className="px-12 py-4 border border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-all text-[11px] uppercase tracking-widest"
                     >
                       Close Session
                     </Link>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="mt-12 text-center opacity-40">
           <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Engine: Native Canvas 2D // Kinetic Physics v4.0</p>
        </div>

      </div>
    </div>
  );
}
