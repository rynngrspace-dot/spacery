"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useLenis } from "lenis/react";
import Magnetic from "./Magnetic";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("blog"), href: "/chat" },
    { name: t("about"), href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#") && (window.location.pathname === "/id" || window.location.pathname === "/en" || window.location.pathname === "/")) {
      e.preventDefault();
      const targetId = href.replace("/", "");
      lenis?.scrollTo(targetId, {
        lerp: 0.1,
        duration: 2,
      });
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-100 p-4 md:p-6 transition-all duration-500 ${
          scrolled ? "py-3 md:py-4" : "py-6 md:py-8"
        }`}
      >
        <div className={`max-w-5xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 rounded-full transition-all duration-500 ${
          (scrolled || isMenuOpen)
            ? "bg-[#060b19]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]" 
            : "bg-transparent border border-transparent"
        }`}>
          <Link href="/" className="text-lg md:text-xl font-bold bg-linear-to-r from-sky-400 to-white bg-clip-text text-transparent transition-all duration-300 hover:opacity-80 z-110">
            Spacery
          </Link>

          {/* Desktop Links & Switcher */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
              {navLinks.map((link) => (
                <Magnetic key={link.name}>
                  <Link 
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm font-mono text-slate-400 hover:text-sky-400 transition-colors duration-300 uppercase tracking-widest"
                    aria-label={`Go to ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </Magnetic>
              ))}
            </div>
            
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle & Switcher */}
          <div className="flex items-center gap-4 md:hidden z-110">
            <LanguageSwitcher />
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-8 w-8 flex-col justify-center items-center cursor-pointer group"
              aria-label="Toggle Menu"
            >
              <div className={`h-[2px] w-6 bg-sky-400 rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[2px]" : "mb-1.5"}`}></div>
              <div className={`h-[2px] w-6 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 translate-y-0" : ""}`}></div>
              <div className={`h-[2px] w-6 bg-sky-400 rounded-full transition-all duration-300 mt-1.5 ${isMenuOpen ? "hidden" : ""}`}></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-90 bg-[#010205]/95 backdrop-blur-3xl transition-all duration-700 md:hidden ${
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-12 p-8">
           {navLinks.map((link, i) => (
             <Link 
               key={link.name}
               href={link.href}
               onClick={(e) => handleNavClick(e, link.href)}
               style={{ transitionDelay: `${i * 100}ms` }}
               className={`text-3xl font-bold tracking-tighter transition-all duration-500 ${
                 isMenuOpen ? "opacity-100 y-0" : "opacity-0 translate-y-10"
               }`}
             >
               <span className="text-sky-500 mr-4 font-mono text-lg">0{i+1}</span>
               <span className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">{link.name}</span>
             </Link>
           ))}
           
           <div className={`mt-12 pt-12 border-t border-white/5 w-full flex flex-col items-center gap-4 transition-all duration-1000 delay-500 ${
             isMenuOpen ? "opacity-40" : "opacity-0"
           }`}>
              <p className="text-[10px] font-mono uppercase tracking-[0.5em]">Spacery OS v2.0</p>
              <div className="flex gap-6">
                 <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                 <div className="w-1 h-1 rounded-full bg-sky-500/20"></div>
                 <div className="w-1 h-1 rounded-full bg-sky-500/20"></div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
