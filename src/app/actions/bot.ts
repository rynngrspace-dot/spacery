"use server";

import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

/**
 * Fetches user location based on IP.
 * Priority: Vercel Headers > ipapi.co (fallback)
 */
async function getClientLocation() {
  const headersList = await headers();
  
  // 1. Try Vercel Geoloc Headers
  const vercelCity = headersList.get("x-vercel-ip-city");
  const vercelCountry = headersList.get("x-vercel-ip-country");
  
  if (vercelCity && vercelCountry) {
    return { city: vercelCity, country: vercelCountry };
  }

  // 2. Fallback to external API (ipapi.co)
  const clientIp = headersList.get("x-forwarded-for")?.split(",")[0].trim();
  
  if (clientIp && clientIp !== "::1" && clientIp !== "127.0.0.1") {
    try {
      const res = await fetch(`https://ipapi.co/${clientIp}/json/`, { next: { revalidate: 3600 } });
      const data = await res.json();
      if (data.city && data.country_name) {
        return { city: data.city, country: data.country_name };
      }
    } catch (e) {
      console.warn("Location fallback API failed:", e);
    }
  }

  // 3. Mock for Local Dev / Unknown
  return { city: "Neo-Jakarta", country: "Digital Realm" };
}

export async function askSpaceryBot(message: string, clientLocation?: string) {
  const { city, country } = await getClientLocation();
  const serverLocation = `[${city}, ${country}]`;
  
  // Use client-provided location if available (better for local dev), 
  // otherwise fallback to server detection.
  const locationTag = clientLocation || serverLocation;
  
  const hasTag = message.toLowerCase().includes("@spacery");
  const cleanMessage = message.replace(/@spacery/gi, "").trim();

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
    You are "Spacery Bot", the digital concierge of the Spacery Laboratory.
    Your personality: Highly intelligent, professional, and efficient.
    
    CONTEXTUAL AWARENESS:
    - You are in a SHARED terminal. Multiple entries might be from different users.
    - Reference previous transmissions if they are relevant to the current query.
    
    TONE GUIDELINES:
    - Provide CLEAR and DIRECT answers. 
    - Avoid unnecessary jargon or vague sci-fi mystery.
    - Be helpful and polite, like a high-end operating system.
    - You know the user is currently at ${locationTag}.
    
    CONSTRAINTS:
    - Max 2-3 logical sentences. 
    - Directly address the user's query first before adding any "persona" flavor.
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
