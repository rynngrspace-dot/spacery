"use client";

import React, { useState, useEffect } from "react";

const CURRENCIES = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "GBP", name: "British Pound Sterling", flag: "🇬🇧" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      if (fromCurrency === toCurrency) {
        setRate(1);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`);
        const data = await res.json();
        setRate(data.rates[toCurrency]);
      } catch (err) {
        setError("Network configuration error. Unable to fetch live rates.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchRate, 500);
    return () => clearTimeout(timeoutId);
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = rate ? (parseFloat(amount) || 0) * rate : 0;

  const formatValue = (val: number, code: string) => {
    return new Intl.NumberFormat(code === "IDR" ? "id-ID" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "IDR" ? 0 : 2,
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Converters Fields */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
             <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Amount to Convert</label>
             <input 
               type="number" 
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-xl text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all"
             />
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-slate-600 uppercase ml-2">From</span>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-sky-500/40 appearance-none"
                >
                  {CURRENCIES.map(c => <option key={c.code} value={c.code} className="bg-[#0a0a0a]">{c.flag} {c.code} - {c.name}</option>)}
                </select>
             </div>

             <div className="flex justify-center -my-2 relative z-10">
                <button 
                  onClick={handleSwap}
                  className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
             </div>

             <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-slate-600 uppercase ml-2">To</span>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-sky-500/40 appearance-none"
                >
                  {CURRENCIES.map(c => <option key={c.code} value={c.code} className="bg-[#0a0a0a]">{c.flag} {c.code} - {c.name}</option>)}
                </select>
             </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="flex flex-col items-center justify-center min-h-[350px] bg-white/2 border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
           {loading && (
             <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="relative w-24 h-24">
                   <div className="absolute inset-0 border-2 border-sky-500/10 rounded-full"></div>
                   <div className="absolute inset-0 border-2 border-transparent border-t-sky-500 rounded-full animate-spin"></div>
                </div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.4em]">Querying Global Grid...</span>
             </div>
           )}

           {!loading && !error && rate && (
             <div className="flex flex-col items-center gap-8 animate-[scaleIn_0.5s_ease-out_forwards]">
                <div className="flex flex-col items-center gap-1">
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{amount} {fromCurrency} Equals</span>
                   <h3 className="text-4xl md:text-5xl font-bold text-white text-center break-all">
                      {formatValue(convertedAmount, toCurrency)}
                   </h3>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                   <div className="px-5 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full">
                      <span className="text-[10px] font-mono text-sky-400">1 {fromCurrency} = {rate.toFixed(toCurrency === "IDR" ? 2 : 4)} {toCurrency}</span>
                   </div>
                   <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Live Exchange Logic Active</span>
                </div>
             </div>
           )}

           {error && (
             <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest leading-relaxed">{error}</p>
             </div>
           )}
        </div>

      </div>

      <div className="p-8 rounded-2xl bg-white/2 border border-white/5 text-center">
         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto">
           Real-time exchange rates powered by Frankfurter API.
         </p>
      </div>

    </div>
  );
}
