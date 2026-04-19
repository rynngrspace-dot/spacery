"use client";
import { TypeAnimation } from 'react-type-animation';
import { useTranslations } from 'next-intl';

export default function GreetingTyping() {
  const t = useTranslations("Greeting");
  
  // Extracting keys from dictionary
  // Note: t.raw("sequence") handles the array from the JSON
  const sequenceData = t.raw("sequence") as string[];
  
  const sequence = [
    sequenceData[0],
    2000,
    sequenceData[1],
    2000,
    sequenceData[2],
    2000,
    sequenceData[3],
    2000,
  ];

  return (
    <h1 className="mb-8 font-mono text-xl sm:text-2xl font-medium tracking-[1px] text-sky-400 h-8 flex items-center justify-center opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
      <TypeAnimation
        sequence={sequence}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
    </h1>
  );
}
