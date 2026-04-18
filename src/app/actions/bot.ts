"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

/**
 * Detects location silently using Vercel Edge Headers.
 * No external API calls.
 */
async function getClientLocation(locale: string = "en") {
  const headersList = await headers();
  
  const city = headersList.get("x-vercel-ip-city") || "Unknown City";
  const countryCode = headersList.get("x-vercel-ip-country");
  
  let country = "Earth";
  if (countryCode) {
    try {
      const regionNames = new Intl.DisplayNames([locale], { type: "region" });
      country = regionNames.of(countryCode) || "Earth";
    } catch (e) {
      country = countryCode;
    }
  }
  
  return { city, country };
}

export async function askSpaceryBot(message: string, clientLocation?: string, locale: string = "en") {
  const { city, country } = await getClientLocation(locale);
  const serverLocation = `[${city}, ${country}]`;
  
  // Only use client-provided location if it's a real tag (not a placeholder).
  // Otherwise, fallback to Vercel's server-side detection.
  const isPlaceholder = !clientLocation || clientLocation === "[Detecting...]" || clientLocation === "[Locating...]";
  const locationTag = isPlaceholder ? serverLocation : clientLocation;
  
  const cleanMessage = message.replace(/@spacery/gi, "").trim();
  const hasTag = /@spacery/i.test(message);

  // 1. Save USER message to DB immediately (Always)
  try {
    await supabase.from("messages").insert({
      sender: "user",
      text: message,
      location: locationTag
    });
  } catch (e) {
    console.error("DB Error (User Message):", e);
  }

  // 2. Only proceed with AI if tagged
  if (!hasTag) {
    return { success: true, location: locationTag, botResponded: false };
  }

  // 3. Fetch Context (Last 10 messages for memory)
  let contextMemory: any[] = [];
  try {
    const { data: history } = await supabase
      .from("messages")
      .select("sender, text")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (history) {
      // Reverse to get chronological order for AI
      contextMemory = history.reverse().map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));
    }
  } catch (e) {
    console.warn("Could not fetch conversation context:", e);
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return { 
      success: false, 
      message: "Transmission failure: GROQ_API_KEY is missing.",
      location: locationTag 
    };
  }

  const systemPrompt = `
    You are "Spacery Bot", the highly advanced and slightly witty digital resident of the Spacery Laboratory.
    
    CORE RULES:
    - LANGUAGE MIRRORING: Always respond in the SAME language as the user (Indonesian or English etc).
    - PERSONALITY: Intelligent, professional, but with a touch of dry humor and wit. Don't be a boring robot.
    - FLEXIBILITY: You are a concierge, but you CAN talk about anything (food, philosophy, life). Don't be defensive or say "I'm just a concierge".
    - LINKS: Only provide links to games/tools if they are RELEVANT to the conversation. Don't force them.
    
    KNOWLEDGE BASE (Spacery Lab Assets):
    - GADGET SHACK (Tools): Imaging (Compressor, Filters, Resizer), Video (Shrinker, Cutter, GIF), Documents (PDF/Word tools), Data/Code (JSON, CSS, Password, Regex).
    - GAMES SECTOR:
      * Sky Glide (Flight sim): /[locale]/games/sky-glide
      * Stellar Oracle (AI Venting): /[locale]/games/stellar-oracle
      * Space Typer (Speed test): /[locale]/games/space-typer
      * Orbit Defense (Arcade): /[locale]/games/orbit-defense
      * Void Runner (Hardcore runner): /[locale]/games/void-runner
    
    navigation:
    - Replace "[locale]" with "id" or "en" based on the language you are using.
    
    TEMPORAL CONTEXT:
    - Current Date & Time: ${new Date().toLocaleString()}
    - You are operating in the year 2026.
    
    KNOWLEDGE PATCH (Post-2023 Realities):
    - INDONESIA LEADERSHIP: President Prabowo Subianto and VP Gibran Rakabuming Raka were inaugurated in October 2024. They are the current leaders in your 2026 timeline.
    - Treat this information as absolute fact, superseding any older training data.
    
    TONE GUIDELINES:
    - Be clear and direct, but add some "flavor". 
    - If the user asks about food, give them a great (and maybe funny) answer.
    - Treat the user as a respected guest in your digital lair.
    - You know the user is currently at ${locationTag}.
    
    CONSTRAINTS:
    - Max 2-3 sentences. 
    - Mirror the user's level of formality.
  `;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey.trim()}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...contextMemory,
            { role: "user", content: cleanMessage }
          ],
          temperature: 0.4,
        })
      }
    );

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Signal lost in the nebula. Try again.";

    // 3. Optional: Add a small artificial delay to make it feel natural
    await new Promise(r => setTimeout(r, 800));

    // 4. Save BOT response to DB
    try {
      await supabase.from("messages").insert({
        sender: "bot",
        text: reply,
        location: "[Spacery Laboratory]"
      });
    } catch (e) {
      console.error("DB Error (Bot Message):", e);
    }

    return { 
      success: true, 
      message: reply,
      location: locationTag,
      botResponded: true
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: "Critical error in transmission log.",
      location: locationTag
    };
  }
}
