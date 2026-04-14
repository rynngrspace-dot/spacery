"use client";

import React, { useState } from "react";

export default function CaseConverter() {
  const [text, setText] = useState("");

  const transform = (type: string) => {
    let result = text;
    switch (type) {
      case "upper": result = text.toUpperCase(); break;
      case "lower": result = text.toLowerCase(); break;
      case "title": 
        result = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '); 
        break;
      case "sentence":
        result = text.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase());
        break;
      case "pascal":
        result = text.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase()).replace(/\s+/g, '');
        break;
      case "camel":
        result = text.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
        break;
      case "snake":
        result = text.toLowerCase().replace(/\s+/g, '_');
        break;
      case "constant":
        result = text.toUpperCase().replace(/\s+/g, '_');
        break;
    }
    setText(result);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">Raw Text Signal</label>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste signal string here..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all min-h-[250px] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "UPPERCASE", id: "upper" },
          { label: "lowercase", id: "lower" },
          { label: "Title Case", id: "title" },
          { label: "Sentence case", id: "sentence" },
          { label: "PascalCase", id: "pascal" },
          { label: "camelCase", id: "camel" },
          { label: "snake_case", id: "snake" },
          { label: "CONSTANT_CASE", id: "constant" },
        ].map((btn) => (
          <button 
            key={btn.id}
            onClick={() => transform(btn.id)}
            className="px-4 py-3 bg-white/2 border border-white/5 rounded-xl text-[10px] font-mono text-slate-400 uppercase tracking-widest hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-300 transition-all text-center"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 mt-4">
         <button 
           onClick={() => navigator.clipboard.writeText(text)}
           className="px-12 py-5 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-400 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] text-[10px] uppercase tracking-[0.3em]"
         >
           Copy Formatted Signal
         </button>
         
         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] text-center max-w-md mx-auto leading-relaxed">
           Instant morphological text processing across multiple conventions.
         </p>
      </div>
    </div>
  );
}
