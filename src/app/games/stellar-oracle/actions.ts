"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getOracleWisdom(story: string, pilotName: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { success: false, message: "No API Key detected." };
  }

  const prompt = `
    You are the "Stellar Oracle", a celestial consciousness from the game Spacery. 
    A pilot named "${pilotName}" has shared their story of the day: "${story}".

    Your goal is to provide a piece of "Enlightenment" (Wisdom).
    Rules:
    1. Be humanized, supportive, and deeply empathetic. 
    2. Use subtle space metaphors (stars, nebulas, orbits, voids) but keep it understandable for a regular person.
    3. Keep the response concise (2-4 sentences).
    4. Provide the result in a JSON-like format with two fields: "wisdom" (the text) and "color" (a hex code representing the energy/mood: teal for success, blue for tired, red for sad/angry, purple for neutral/deep).

    Output format example:
    {"wisdom": "...", "color": "#..."}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from AI response
    try {
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanedText);
        return { success: true, wisdom: data.wisdom, color: data.color };
    } catch (e) {
        // Fallback if AI doesn't return perfect JSON
        return { success: true, wisdom: text, color: "#a855f7" };
    }
  } catch (error) {
    console.error("Oracle AI Error:", error);
    return { success: false, message: "The signals were interrupted by nebula noise." };
  }
}
