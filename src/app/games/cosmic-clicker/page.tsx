"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const UPGRADES = [
  { id: "miner", name: "Auto-Miner", basePrice: 15, baseFps: 1, desc: "A simple drone to pick up space dust." },
  { id: "collector", name: "Star Collector", basePrice: 100, baseFps: 5, desc: "Harvests raw energy from distant stars." },
  { id: "swarm", name: "Dyson Swarm", basePrice: 500, baseFps: 25, desc: "A network of mirrors surrounding the sun." },
];

export default function CosmicClicker() {
  const [matter, setMatter] = useState(0);
  const [fps, setFps] = useState(0); // Flow per second (Dark Matter)
  const [inventory, setInventory] = useState<{ [key: string]: number }>({
    miner: 0,
    collector: 0,
    swarm: 0,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem("spacery-clicker-save");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMatter(data.matter || 0);
        setInventory(data.inventory || { miner: 0, collector: 0, swarm: 0 });
      } catch (e) {
        console.error("Save corrupted", e);
      }
    }
  }, []);

  // Set FPS
  useEffect(() => {
    let totalFps = 0;
    UPGRADES.forEach(u => {
      totalFps += (inventory[u.id] || 0) * u.baseFps;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFps(totalFps);
  }, [inventory]);

  // Main Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setMatter(prev => prev + fps);
    }, 1000);
    return () => clearInterval(interval);
  }, [fps]);

  // Save Loop
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem("spacery-clicker-save", JSON.stringify({ matter, inventory }));
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [matter, inventory]);

  const handleClick = (e: React.MouseEvent) => {
    setMatter(prev => prev + 1);
    
    // Core animation
    gsap.fromTo(coreRef.current, 
      { scale: 0.95 }, 
      { scale: 1, duration: 0.1, ease: "back.out(2)" }
    );

    // Particle effect logic (simplified placeholder)
    const particle = document.createElement("div");
    particle.className = "absolute pointer-events-none text-purple-400 font-bold select-none";
    particle.innerText = "+1";
    particle.style.left = `${e.clientX - 20}px`;
    particle.style.top = `${e.clientY - 20}px`;
    document.body.appendChild(particle);

    gsap.to(particle, {
      y: -100,
      opacity: 0,
      duration: 1,
      onComplete: () => particle.remove()
    });
  };

  const buyUpgrade = (u: typeof UPGRADES[0]) => {
    const currentPrice = Math.floor(u.basePrice * Math.pow(1.15, inventory[u.id] || 0));
    if (matter >= currentPrice) {
      setMatter(prev => prev - currentPrice);
      setInventory(prev => ({ ...prev, [u.id]: (prev[u.id] || 0) + 1 }));
      
      gsap.fromTo(`.upgrade-${u.id}`, 
        { backgroundColor: "rgba(168, 85, 247, 0.2)" },
        { backgroundColor: "transparent", duration: 0.5 }
      );
    }
  };

  useGSAP(() => {
    gsap.fromTo(".game-ui", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen pt-40 pb-20 px-8 flex flex-col items-center">
      <div className="max-w-6xl w-full game-ui flex flex-col md:flex-row gap-12">
        {/* Left Side: The Core */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Link href="/#games" className="self-start text-sm font-mono text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-widest mb-12">
            ← Return to Bridge
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-sm font-mono text-purple-400 uppercase tracking-[0.4em] mb-4">Dark Matter Reserves</h1>
            <div className="text-6xl md:text-8xl font-black text-white tracking-tighter">
              {Math.floor(matter).toLocaleString()}
            </div>
            <div className="text-lg font-mono text-slate-500 mt-2">
              Generating <span className="text-purple-400">+{fps}</span> per second
            </div>
          </div>

          <div 
            ref={coreRef}
            onClick={handleClick}
            className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-linear-to-br from-purple-500 to-indigo-900 cursor-pointer relative shadow-[0_0_80px_rgba(168,85,247,0.3)] hover:shadow-[0_0_120px_rgba(168,85,247,0.5)] transition-all duration-300 group"
          >
             {/* Inner glow */}
             <div className="absolute inset-4 rounded-full border-2 border-white/10 animate-pulse" />
             <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-mono uppercase tracking-widest group-hover:text-white/40">
               Click to Mine
             </div>
          </div>
        </div>

        {/* Right Side: Upgrades */}
        <div className="w-full md:w-96 flex flex-col gap-6 bg-[#0d0714]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px]">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            Equipment <span className="text-xs font-mono text-slate-500 tracking-tighter">Upgrades available</span>
          </h2>
          
          <div className="flex flex-col gap-4">
            {UPGRADES.map(u => {
              const count = inventory[u.id] || 0;
              const price = Math.floor(u.basePrice * Math.pow(1.15, count));
              const canAfford = matter >= price;

              return (
                <button
                  key={u.id}
                  onClick={() => buyUpgrade(u)}
                  disabled={!canAfford}
                  className={`upgrade-${u.id} flex flex-col p-5 rounded-2xl border transition-all text-left ${
                    canAfford 
                      ? "border-purple-500/30 bg-purple-500/5 hover:border-purple-400 hover:bg-purple-500/10" 
                      : "border-white/5 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">{u.name}</span>
                    <span className="text-xs font-mono text-slate-500 uppercase">Owned: {count}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{u.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-purple-400">{price.toLocaleString()} DM</span>
                    <span className="text-[10px] font-mono text-slate-500">+{u.baseFps} DM/s</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-8 text-center">
             <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
               Game auto-saves every 5 seconds
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
