"use server";

export async function getOracleWisdom(story: string) {
  console.log("Oracle Action: Initiating Wisdom Generation (Groq Cloud)...");
  
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    console.error("❌ Oracle AI Error: GROQ_API_KEY is missing in .env");
    return { success: false, message: "No Groq API Key detected. Please check your .env file." };
  }

  const prompt = `
    You are the "Stellar Oracle" — but you have the personality of a lazy, unimpressed, and absolute jerk of a human friend. 
    You are a "Troll" who provides "Nyeleneh" wisdom. You are extremely sarcastic and easily annoyed by the user's "small" human problems.

    The user shared their day:
    "${story}"

    Your task: Give a short, "Nyeleneh" (eccentric/sarcastic) roast or piece of wisdom.

    PERSONALITY GUIDELINES (BE SAVAGE):
    1. DO NOT BE HELPFUL. Be a sassy jerk. 
    2. If the user is sad, mock them playfully or give an absurdly useless solution.
    3. Use everyday informal slang (Gaul). If the input is Indonesian, use "Gue/Lo" or similar informal tone.
    4. Be UNIMPRESSED. Act like you're being forced to answer these boring human stories.
    5. Refer to specific details from their story only to roast them better.
    6. Keep it short (max 2 sentences). BE MEAN BUT FUNNY.

    Example Tone:
    - User: "I'm sad my crush ignored me."
    - Oracle: "Ya wajar sih, muka lo aja kayak error 404 gitu. Coba perbanyak istighfar atau operasi plastik sekalian."

    MANDATORY: Respond in the SAME LANGUAGE as the user's story.
    MANDATORY: Output ONLY a valid JSON object.
    MANDATORY: Make sure to include "wisdom" and "color" keys in the JSON.
    `;

  // Specific Llama models requested via Groq
  const modelsToTry = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant"
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`📡 Oracle Diagnostic: Contacting Groq via ${modelName}...`);
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey.trim()}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: "You are a sassy, nyeleneh oracle that output JSON only." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.9,
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `Status ${response.status}`;
        console.error(`❌ model ${modelName} failed with error: ${errMsg}`);
        continue;
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "";
      console.log(`✅ ${modelName} responded successfully.`);
      
      try {
          const parsed = JSON.parse(text);
          return { 
            success: true, 
            wisdom: parsed.wisdom, 
            color: parsed.color || "#a855f7" 
          };
      } catch (e) {
          console.error(`❌ JSON Parse Error for ${modelName}:`, text);
          continue; 
      }
    } catch (err: any) {
      console.error(`❌ Critical error for model ${modelName}:`, err.message);
    }
  }

  return { success: false, message: "Semua jalur transmisi Groq saat ini sedang penuh atau kunci API ditolak." };
}
