"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase";
import { askSpaceryBot } from "@/app/actions/bot";
import { getChatHistory } from "@/app/actions/chat";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  location?: string;
  timestamp: Date;
}

export default function ChatPage() {
  const t = useTranslations("Bot");
  const tc = useTranslations("Games.common");
  const locale = useLocale();
  
  // State Hooks
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connStatus, setConnStatus] = useState<"connecting" | "online" | "offline" | "error">("connecting");
  
  // Ref Hooks
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Auto-scroll Hook
  useEffect(() => {
    if (scrollRef.current && !isLoading) {
      const viewport = scrollRef.current;
      const scrollTimeout = setTimeout(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: messages.length <= 50 ? 'auto' : 'smooth'
        });
      }, 50);
      return () => clearTimeout(scrollTimeout);
    }
  }, [messages, isTyping, isLoading]);

  // 2. Initial Setup Hook
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getChatHistory();
        setMessages(history);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    loadHistory();

    // 3. Realtime Subscription

    // 3. Realtime Subscription
    let channel: any;

    const connectRealtime = () => {
      setConnStatus("connecting");
      
      channel = supabase
        .channel("shared-terminal")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newMsg = payload.new;
            const formattedMsg: Message = {
              id: newMsg.id,
              text: newMsg.text,
              sender: newMsg.sender as "user" | "bot",
              location: newMsg.location,
              timestamp: new Date(newMsg.created_at),
            };

            setMessages((prev) => {
    
              if (prev.some((m) => m.id === formattedMsg.id)) return prev;

   
              const optIndex = prev.findIndex(m => 
                m.id.startsWith("opt-") && 
                m.sender === formattedMsg.sender && 
                m.text === formattedMsg.text
              );

              if (optIndex !== -1) {
                const newArr = [...prev];
                newArr[optIndex] = formattedMsg; 
                return newArr;
              }

        
              return [...prev, formattedMsg];
            });
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') setConnStatus("online");
          if (status === 'CHANNEL_ERROR') setConnStatus("error");
          if (status === 'TIMED_OUT') setConnStatus("offline");
        });
    };

    connectRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useGSAP(() => {
    gsap.from(".chat-container", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Optimistic UI for User
    const tempId = "opt-" + Date.now();
    const savedLocation = "";
    
    setMessages(prev => [...prev, {
      id: tempId,
      text: userMessage,
      sender: "user",
      location: savedLocation,
      timestamp: new Date()
    }]);

    setIsTyping(true);
    try {
     
      const result = await askSpaceryBot(userMessage, savedLocation, locale);
      
      if (result.success && result.botResponded) {
        setMessages(prev => {
    
          const isAlreadyThere = prev.some(m => 
            m.sender === "bot" && 
            m.text === result.message &&
            !m.id.startsWith("opt-") 
          );

          if (isAlreadyThere) return prev;

          return [...prev, {
            id: "opt-bot-" + Date.now(),
            text: result.message || "",
            sender: "bot",
            location: "[Spacery Laboratory]",
            timestamp: new Date()
          }];
        });
      }
    } catch (error) {
       console.error("Transmission failed:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearLogs = () => {
    setMessages([]);
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#010205] pt-24 md:pt-32 pb-12 px-4 md:px-8 flex flex-col items-center">
      {/* Bot Usage Hint */}
      <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400/40 animate-pulse text-center">
        {t("botHint")}
      </div>

      <div className="chat-container w-full max-w-4xl flex flex-col h-[75vh] bg-[#060b19]/40 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              connStatus === "online" ? "bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
              connStatus === "error" ? "bg-red-500" :
              "bg-yellow-500 animate-pulse"
            }`}></div>
            <span className="ml-4 text-[10px] font-mono uppercase tracking-[0.3em] text-sky-400/70">
              {t("title")} 
              {connStatus === "connecting" && " — SEARCHING..."}
              {connStatus === "error" && " — LINK ERROR"}
            </span>
          </div>
          <button 
            onClick={clearLogs}
            className="text-[9px] font-mono uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors"
          >
            {t("clear")}
          </button>
        </div>

        {/* Message Viewport */}
        <div 
          ref={scrollRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-6 custom-scrollbar scroll-smooth"
          style={{ maxHeight: "calc(75vh - 120px)" }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-sky-400 font-mono text-center px-8">
              <div className="w-12 h-12 mb-6 relative">
                 <div className="absolute inset-0 border-2 border-sky-500/20 rounded-full"></div>
                 <div className="absolute inset-0 border-t-2 border-sky-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-2 border-r-2 border-sky-400/50 rounded-full animate-spin-reverse opacity-50"></div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] animate-pulse">
                Establishing uplink... <br />
                <span className="opacity-40">Decrypting lab frequencies</span>
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 font-mono text-center px-8">
              <div className="text-4xl mb-4 opacity-20">📡</div>
              <p className="text-xs uppercase tracking-[0.2em] max-w-xs leading-loose">
                Established link with Spacery Lab. <br />
                {t("placeholder")}
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-sky-500/10 border border-sky-500/20 text-sky-100 rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-slate-300 rounded-tl-none"
                  }`}
                >
                  <span className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text.split(/(\/\w+[\/\w.-]*[a-zA-Z0-9/]|https?:\/\/[^\s]+[a-zA-Z0-9/])/g).map((part, i) => {
                      if (part.startsWith('/') || part.startsWith('http')) {
                        return (
                          <a 
                            key={i} 
                            href={part} 
                            target={part.startsWith('http') ? "_blank" : "_self"}
                            className="text-sky-400 underline underline-offset-4 hover:text-sky-300 transition-colors font-bold decoration-sky-400/30"
                          >
                            {part}
                          </a>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </span>
                </div>
                {msg.location && msg.location !== "" && (
                  <span className="mt-1 text-[9px] font-mono text-sky-500/50 uppercase tracking-widest">
                    {msg.location}
                  </span>
                )}
                <span className="mt-1 text-[8px] font-mono text-slate-700 uppercase">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex items-center gap-2 text-sky-400/50 font-mono text-[10px] uppercase tracking-widest animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400/50 animate-bounce"></div>
              {t("typing")}
            </div>
          )}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSendMessage}
          className="p-6 border-t border-white/5 bg-black/20"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all font-mono"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-3 p-2 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-400 transition-all disabled:opacity-20 disabled:grayscale"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
        </form>

        {/* Decorative Overlay */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl"></div>
      </div>

      <Link href="/" className="mt-12 text-[10px] font-mono uppercase tracking-[0.4em] text-slate-600 hover:text-sky-400 transition-colors">
        {tc("unknown")} // Terminal Exit
      </Link>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.3);
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
        .scanline::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.05), transparent);
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}
