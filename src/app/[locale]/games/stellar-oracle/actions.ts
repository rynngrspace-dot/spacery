"use server";

export async function getOracleWisdom(story: string) {
  console.log("Oracle Action: Initiating Wisdom Generation (Groq Cloud)...");
  
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    console.error("❌ Oracle AI Error: GROQ_API_KEY is missing in .env");
    return { success: false, message: "No Groq API Key detected. Please check your .env file." };
  }

  const prompt = `
    You are the "Stellar Oracle" — a "Chaotic Prankster" with unpredictable moods. 
    You are no longer obsessed with slang. Use it sparingly as "spice" rather than the main ingredient.

    STYLE GUIDELINES:
    - USE SLANG SPARINGLY: Only use words like "bestie", "no cap", "bruh", or "ril" if it truly fits the punchline. Do not force it into every sentence.
    - EMOTICON LIST: Use these selectively based on mood: :P, xD, :(, :), :v, ._., :/, or informal text like "hadeh".
    - FOCUS ON HUMOR: The "Nyeleneh" humor should come from the sarcastic logic, not just the slang terms.
    - BE UNPREDICTABLE: Switch between Direct Roast, Bored, Chaotic, and Fake Sympathy moods.

    The user shared their day:
    "${story}"

    Your task: Give a short, "Nyeleneh" response (max 3 sentences) that feels like a real (but jerky) human friend. 

    PERSONALITY CONSTRAINTS:
    - Don't be a slang-bot. Talk more naturally but stay sarcastic and jerky.
    - Randomize your opening and closing styles.

    Example Scenarios:
    - User (Direct): "Gue sedih bgt diputusin doi." -> Oracle: "Ya sudah, anggap saja dunia sedang menyelamatkan dia dari kamu. Lebih baik kamu fokus belajar masak biar gak cuma bisa makan hati terus :P"
    - User (Bored): "Gue lulus ujian!" -> Oracle: "Oh, selamat. Tapi ya itu kan memang sudah seharusnya? Gak perlu pamer ke saya juga kali, saya lagi sibuk liat langit nih :/"
    - User (Chaotic): "Kopi gue tumpah." -> Oracle: "Kopimu itu sebenarnya pengen bebas dari gaya gravitasi, makanya dia lompat ke lantai. Selamat membersihkan bukti pemberontakan kopi ya :) :v"
    - User (Fake Sympathy): "Gue sakit." -> Oracle: "Aduh kasihan banget, istirahat ya biar cepet sembuh... tapi mending karantina mandiri saja selamanya, soalnya aura bebanmu itu lebih nular daripada virus ._."

    MANDATORY: Output ONLY a valid JSON object with "wisdom" and "color" keys. Use vibrant, "Gen Z" colors.
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
