"use client";

import React, { useState, useEffect } from "react";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>("100000");
  const [discountPercent, setDiscountPercent] = useState<string>("20");
  const [finalPrice, setFinalPrice] = useState<number>(80000);
  const [savings, setSavings] = useState<number>(20000);
  const [currency, setCurrency] = useState<"USD" | "IDR" | "EUR">("IDR");

  useEffect(() => {
    const price = parseFloat(originalPrice) || 0;
    const discount = parseFloat(discountPercent) || 0;
    
    const calculatedSavings = (price * discount) / 100;
    const calculatedFinal = price - calculatedSavings;
    
    setSavings(calculatedSavings);
    setFinalPrice(calculatedFinal);
  }, [originalPrice, discountPercent]);

  const formatCurrency = (val: number) => {
    if (currency === "IDR") {
      return `Rp ${val.toLocaleString("id-ID")}`;
    }
    const symbol = currency === "USD" ? "$" : "€";
    return `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Currency Selector */}
      <div className="flex justify-center gap-3">
         {(["IDR", "USD", "EUR"] as const).map((curr) => (
           <button
             key={curr}
             onClick={() => setCurrency(curr)}
             className={`px-6 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all border ${
               currency === curr ? "bg-sky-500 text-white border-sky-400" : "bg-white/5 text-slate-500 border-white/10 hover:border-white/20"
             }`}
           >
             {curr}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Fields */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Original Price</label>
            <div className="relative group">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-lg">
                 {currency === "IDR" ? "Rp" : currency === "USD" ? "$" : "€"}
               </span>
               <input 
                 type="number"
                 value={originalPrice}
                 onChange={(e) => setOriginalPrice(e.target.value)}
                 placeholder="0"
                 className={`w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-6 font-mono text-xl text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all ${
                   currency === "IDR" ? "pl-20" : "pl-12"
                 }`}
               />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Discount Percentage (%)</label>
            <div className="relative group">
               <input 
                 type="number"
                 value={discountPercent}
                 onChange={(e) => setDiscountPercent(e.target.value)}
                 placeholder="20"
                 className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-6 font-mono text-xl text-purple-400 focus:outline-none focus:border-purple-500/50 transition-all"
               />
               <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-lg">%</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
             {[10, 20, 30, 50].map((val) => (
               <button 
                 key={val}
                 onClick={() => setDiscountPercent(val.toString())}
                 className="py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-mono text-slate-400 hover:bg-sky-500/20 hover:text-sky-400 transition-all uppercase tracking-widest"
               >
                 {val}%
               </button>
             ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex flex-col justify-center gap-6">
           <div className="p-8 rounded-3xl bg-sky-500/5 border border-sky-500/10 flex flex-col items-center">
              <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest mb-4">Final Price</span>
              <div className="flex items-baseline gap-2">
                 <span className="text-6xl font-bold text-white">{formatCurrency(finalPrice)}</span>
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center">
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-2">Total Savings</span>
              <span className="text-2xl font-bold text-emerald-400">{formatCurrency(savings)}</span>
           </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white/2 border border-white/5">
         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] leading-relaxed text-center">
           Real-time price evaluation for retail and commercial transactions.
         </p>
      </div>
    </div>
  );
}
