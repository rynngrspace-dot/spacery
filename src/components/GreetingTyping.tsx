"use client";
import { TypeAnimation } from 'react-type-animation';

export default function GreetingTyping() {
  return (
    <h2 className="mb-8 font-mono text-xl sm:text-2xl font-medium tracking-[1px] text-sky-400 h-8 flex items-center justify-center opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
      <TypeAnimation
        sequence={[
          "Staring at code in the dark...",
          2000, 
          "Building cool stuff for the void...",
          2000,
          "Mostly coffee, partially code.",
          2000,
          "Wait... where am I again?",
          2000,
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
    </h2>
  );
}
