"use client";

import React, { useState, useEffect } from "react";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: number;
  } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) return;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }

    // Total Days
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Next Birthday
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const nextDiff = nextBday.getTime() - today.getTime();
    const nextBirthday = Math.ceil(nextDiff / (1000 * 60 * 60 * 24));

    setAge({ years, months, days, totalDays, nextBirthday });
  };

  useEffect(() => {
    if (birthDate) calculateAge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthDate]);

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      
      {/* Input Module */}
      <div className="flex flex-col items-center gap-6">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date of Birth</label>
        <div className="relative group w-full max-w-md">
          <input 
            type="date" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-6 font-mono text-xl text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all appearance-none cursor-pointer"
          />
          <div className="absolute inset-0 rounded-2xl border border-sky-500/0 group-hover:border-sky-500/20 pointer-events-none transition-colors"></div>
        </div>
      </div>

      {/* Results Grid */}
      {age && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fadeUp_0.6s_ease-out_forwards]">
          <div className="p-6 rounded-2xl bg-white/2 border border-white/5 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Current Age</span>
            <span className="text-5xl font-bold text-white mb-2">{age.years}</span>
            <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Years Old</span>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/2 border border-white/5 flex flex-col items-center">
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Months</span>
             <span className="text-5xl font-bold text-white mb-2">{age.months}</span>
             <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Additional Months</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/2 border border-white/5 flex flex-col items-center">
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Days</span>
             <span className="text-5xl font-bold text-white mb-2">{age.days}</span>
             <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Additional Days</span>
          </div>
        </div>
      )}

      {/* Secondary Metrics */}
      {age && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 rounded-2xl bg-sky-500/5 border border-sky-500/10 flex flex-col items-center group hover:bg-sky-500/10 transition-all">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest mb-4">Total Days Lived</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white">{age.totalDays.toLocaleString()}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Days Since Birth</span>
              </div>
           </div>

           <div className="p-8 rounded-2xl bg-purple-500/5 border border-purple-500/10 flex flex-col items-center group hover:bg-purple-500/10 transition-all">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-4">Next Birthday</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-white">{age.nextBirthday}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Days Remaining</span>
              </div>
           </div>
        </div>
      )}

      {!age && (
        <div className="py-20 text-center">
           <p className="text-xs font-mono text-slate-600 uppercase tracking-[0.4em] animate-pulse">
             Select your date of birth to begin...
           </p>
        </div>
      )}

    </div>
  );
}
