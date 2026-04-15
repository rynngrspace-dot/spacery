"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getOracleWisdom(story: string) {
  console.log("Oracle Action: Initiating Wisdom Generation (Next-Gen REST API)...");
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Oracle AI Error: GEMINI_API_KEY is missing in .env");
    return { success: false, message: "No API Key detected." };
  }

  const prompt = `
    You are the "Stellar Oracle" from Spacery — but you behave like a quirky, sassy, and "nyeleneh" human friend who is a bit of a troll.
    Stop using too many space or galaxy metaphors. Instead, speak in a very relatable, human way.

    The user shared their day:
    "${story}"

    Your task is to give a short piece of "Enlightenment" (Wisdom) that is funny, eccentric, sassy, and potentially a bit "trollish".

    Guidelines:
    1. Speak like a real human who is a bit of a jerk — be sassy, mock the user's problems in a funny, relatable way. 
    2. Use EVERYDAY LANGUAGE. Avoid cryptic or overly poetic galactic talk.
    3. MANDATORY: Respond in the SAME LANGUAGE as the user's story.
    4. MANDATORY: Refer to specific details from their story to make your "troll" advice feel real.
    5. Keep it short, understandable, and "nyeleneh" (1–3 sentences max).
    6. MANDATORY: Output ONLY a valid JSON object. No extra text.

    Format:
    {"wisdom": "your response here", "color": "#hexcode"}
    `;
  // Restricted Rotation: Gemini 2 Series ONLY
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite"
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting REST transmission (v1/Smart) with model: ${modelName}`);
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

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("AI returned an empty response.");
      }

      const text = data.candidates[0].content.parts[0].text.trim();
      
      try {
          // Attempt direct parse first
          const parsed = JSON.parse(text);
          console.log(`✅ AI Transmission successful with ${modelName}`);
          return { success: true, wisdom: parsed.wisdom, color: parsed.color };
      } catch (e) {
          // If direct parse fails, try extraction
          const startIdx = text.indexOf('{');
          const endIdx = text.lastIndexOf('}');
          
          if (startIdx !== -1 && endIdx !== -1) {
              try {
                  const targetJson = text.substring(startIdx, endIdx + 1);
                  const parsed = JSON.parse(targetJson);
                  console.log(`✅ AI Transmission extracted from ${modelName}`);
                  return { success: true, wisdom: parsed.wisdom, color: parsed.color };
              } catch (innerE) {
                  // Final deep cleanup if even extraction fails
                  console.log(`⚠️ Deep cleaning required for ${modelName}`);
                  const cleanWisdom = text
                    .replace(/[\{\}]/g, "") // remove brackets
                    .replace(/"wisdom":\s*/, "") // remove property name
                    .replace(/"color":\s*#[0-9a-fA-F]{3,6}/, "") // remove color property
                    .replace(/[",:]/g, "") // remove remaining quotes, commas, colons
                    .trim();
                  return { success: true, wisdom: cleanWisdom, color: "#a855f7" };
              }
          }
          return { success: true, wisdom: text.substring(0, 500), color: "#a855f7" };
      }
    } catch (error: any) {
      console.error(`❌ Model ${modelName} failed:`, error.message);
      // Continue to next model in loop
    }
  }

  return { success: false, message: "All star-links are currently overwhelmed. Please try to re-establish the energy trace in a few moments." };
}
