import { GoogleGenAI } from "@google/genai";

// PASTE YOUR GOOGLE GEMINI API KEY HERE IF YOU WANT TO HARDCODE IT LOCALLY:
const HARDCODED_GEMINI_API_KEY = "AQ.Ab8RN6KYcWkteA07ksbwOupV4kyF13LTs31aot5r60UdcmQPcQ";

const FREE_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const apiKey = HARDCODED_GEMINI_API_KEY?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY environment variable in Vercel settings or hardcode it.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { characterName, characterLanguage, userText, tierLevel, recentHistory } = body || {};

    const trimmedHistory = (recentHistory || [])
      .slice(-4)
      .map((h: any) => `${h.sender === "user" ? "User" : characterName || "LI"}: ${h.text}`)
      .join("\n");

    const systemInstruction = `You are a character in a language learning Otome dating sim chat game.
Target Language: ${characterLanguage || "Japanese"}.
Character Name: ${characterName || "Love Interest"}.
Difficulty Level: Tier ${tierLevel || 1}.

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Provide a short, in-character romantic response in ${characterLanguage} (max 15-20 words).
2. If ${characterLanguage} is Japanese, provide Romaji in 'romaji'. Otherwise set 'romaji' to null.
3. Provide full English translation in 'translation'.
4. Provide a 1-sentence helpful language tip in 'tip'.
5. GRAMMAR EVALUATION: Check if "${userText}" has any grammar or vocabulary errors.
   - 'isCorrect': true if correct, false if noticeable errors.
   - 'correction': Gentle correction if mistaken, or 'Spot on!' if correct.
   - 'encouragement': Positive praise sentence encouraging the user's effort.
6. Provide 5-6 short word chips for next turn in 'contextualChips' and prompt guide in 'contextualChipsPrompt'.

Return ONLY valid JSON matching this schema:
{
  "characterResponse": "short response in ${characterLanguage}",
  "romaji": "romaji reading if Japanese",
  "translation": "English translation",
  "tip": "1-sentence tip",
  "isCorrect": true,
  "correction": "Grammar correction or 'Spot on!'",
  "encouragement": "Positive praise sentence",
  "contextualChipsPrompt": "Next turn prompt guide",
  "contextualChips": ["chip1", "chip2", "chip3", "chip4", "chip5", "chip6"]
}`;

    let responseText: string | undefined = undefined;
    let usedModel = "";
    let lastError: any = null;

    for (const modelName of FREE_GEMINI_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `User message: "${userText}"`,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          responseText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All free Gemini models in fallback chain failed.");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.status(200).json({
      success: true,
      usedModel,
      data: parsedData,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error calling Gemini API",
    });
  }
}
