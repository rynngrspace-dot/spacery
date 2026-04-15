"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Force v1 api version by using the second argument in getGenerativeModel
const modelOptions = { model: "gemini-1.5-flash", apiVersion: "v1" };

export async function getOracleWisdom(story: string, pilotName: string) {
  console.log("Oracle Action: Initiating Wisdom Generation (REST API)...");
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Oracle AI Error: GEMINI_API_KEY is missing in .env");
    return { success: false, message: "No API Key detected." };
  }

  const prompt = `
    You are the "Stellar Oracle", a celestial consciousness from the game Spacery. 
    A pilot named "${pilotName}" has shared their story of the day: "${story}".

    Your goal is to provide a piece of "Enlightenment" (Wisdom).
    Rules:
    1. Be humanized, supportive, and deeply empathetic. 
    2. Use subtle space metaphors (stars, nebulas, orbits, voids) but keep it understandable for a regular person.
    3. Keep the response concise (1-3 sentences).
    4. Provide the result in a JSON-like format with two fields: "wisdom" (the text) and "color" (a hex code representing the energy/mood: teal for success, blue for tired, red for sad/angry, purple for neutral/deep).

    Output format example:
    {"wisdom": "...", "color": "#..."}
  `;

  const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting REST transmission with model: ${modelName}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      const text = data.candidates[0].content.parts[0].text;
      
      try {
          // Robust JSON extraction
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          const targetJson = jsonMatch ? jsonMatch[0] : text;
          const parsed = JSON.parse(targetJson);
          console.log(`✅ Transmission successful with ${modelName}`);
          return { success: true, wisdom: parsed.wisdom, color: parsed.color };
      } catch (e) {
          console.log(`⚠️ AI returned text but not valid JSON from ${modelName}. Attempting to use raw text.`);
          // If it's not JSON, it might just be the wisdom directly
          return { success: true, wisdom: text.substring(0, 500), color: "#a855f7" };
      }
    } catch (error: any) {
      console.error(`❌ Model ${modelName} failed:`, error.message);
    }
  }

  return { success: false, message: "All star-links are currently offline." };
}
