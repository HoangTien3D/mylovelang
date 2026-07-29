import { GoogleGenAI } from "@google/genai";

// PASTE YOUR GOOGLE GEMINI API KEY HERE IF YOU WANT TO HARDCODE IT LOCALLY:
const HARDCODED_GEMINI_API_KEY = "AQ.Ab8RN6ItF-hxrmb__2PaM2zHKJL5TXK90KRwPejb2zji8QgLJg";

function getEffectiveApiKey() {
  const envKey = process.env.GEMINI_API_KEY?.trim();
  if (envKey && envKey !== "MY_GEMINI_API_KEY" && envKey.length > 5) {
    return envKey;
  }
  const hardcoded = HARDCODED_GEMINI_API_KEY?.trim();
  if (hardcoded && hardcoded.length > 5) {
    return hardcoded;
  }
  const openRouter = process.env.VITE_OPENROUTER_API_KEY?.trim();
  if (openRouter && openRouter.length > 5) {
    return openRouter;
  }
  return envKey || hardcoded || "";
}

const FREE_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

async function generateGeminiContent(
  apiKey: string,
  modelName: string,
  systemInstruction: string,
  userText: string,
  aiSDK: GoogleGenAI
): Promise<string> {
  const isBearerToken = apiKey.startsWith("AQ.") || apiKey.startsWith("ya29.");

  if (isBearerToken) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: `User message: "${userText}"` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const json = await res.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      return candidateText;
    }
    throw new Error("No text content returned from Gemini REST API.");
  }

  try {
    const response = await aiSDK.models.generateContent({
      model: modelName,
      contents: `User message: "${userText}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (response && response.text) {
      return response.text;
    }
    throw new Error("No response text from GoogleGenAI SDK.");
  } catch (err: any) {
    if (err?.message && (err.message.includes("UNAUTHENTICATED") || err.message.includes("OAuth 2"))) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: `User message: "${userText}"` }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) return candidateText;
      }
    }
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const apiKey = getEffectiveApiKey();
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY environment variable in Vercel settings (starts with 'AIzaSy...').",
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
        const resText = await generateGeminiContent(apiKey, modelName, systemInstruction, userText, ai);
        if (resText) {
          responseText = resText;
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
    let errorMessage = err?.message || "Internal server error calling Gemini API";
    if (typeof errorMessage === "string" && (errorMessage.includes("UNAUTHENTICATED") || errorMessage.includes("OAuth 2") || errorMessage.includes("API key not valid"))) {
      errorMessage = "Invalid Gemini API Key: Please configure a valid Google Gemini API Key (starts with 'AIzaSy...') in Vercel environment variables or server configuration.";
    }
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
