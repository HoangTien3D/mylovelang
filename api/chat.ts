import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

// Free Google Gemini Models Fallback List
const FREE_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error:
          "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in Environment Variables.",
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

    const { characterId, characterName, characterLanguage, isGroup, userText, tierLevel, recentHistory } = req.body || {};

    if (!userText) {
      return res.status(400).json({
        success: false,
        error: "Missing userText in request body",
      });
    }

    // TOKEN SAVING STRATEGY 1: Truncate chat history to max 4 items
    const trimmedHistory = (recentHistory || [])
      .slice(-4)
      .map((h: any) => `${h.sender === "user" ? "User" : (h.speakerName || characterName || "LI")}: ${h.text}`)
      .join("\n");

    let systemInstruction = "";

    if (isGroup || characterId === "group") {
      systemInstruction = `You are running a 3-way language exchange group chat between two love interests competing for the user's (MC) attention and romantic affection:
1. Bao Nguyen (Vietnamese 🇻🇳, warm barista & chef): Native Vietnamese speaker trying his best to speak endearing, cute broken English! He shares coffee/food thoughts and sweet casual words, getting playfully jealous if MC praises Julian.
2. Julian Vance (English 🇬🇧, polite literature scholar): Native English speaker trying his best to speak enthusiastic, beginner broken Vietnamese! He quotes romantic lines in Vietnamese for MC and competes with Bao for MC's attention.
And the user (MC), who is learning languages with both love interests!

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Keep ALL responses short, natural, casual, and grounded (10-20 words max per character). Avoid over-the-top, theatrical, or excessively cheesy speeches—make it sound like realistic, sweet texting banter.
2. If the user is saying goodbye/leaving (e.g., "bye", "goodnight", "gặp lại sau", "talk to you later"), both characters send brief, sweet sign-off texts (e.g., "Bye MC! Talk soon! ☕", "Hẹn gặp lại MC! Have a lovely day!").
3. Otherwise, both love interests engage in friendly, sweet, and playfully competitive texting for MC's attention.
4. Bao attempts endearing broken English mixed with Vietnamese.
5. Julian attempts enthusiastic broken Vietnamese mixed with English.
6. GRAMMAR EVALUATION: Check if "${userText}" has any language/grammar errors.
7. Provide 5-6 short word chips for the user's next turn in 'contextualChips' and prompt guide in 'contextualChipsPrompt'.

Return ONLY valid JSON matching this schema:
{
  "isGroup": true,
  "groupResponses": [
    {
      "speaker": "bao",
      "speakerName": "Bao Nguyen",
      "text": "Short response from Bao (concise, endearing broken English mixed with Vietnamese)",
      "translation": "Full English translation / explanation",
      "tip": "Short language exchange tip from Bao"
    },
    {
      "speaker": "julian",
      "speakerName": "Julian Vance",
      "text": "Short response from Julian (concise, enthusiastic broken Vietnamese mixed with English)",
      "translation": "Full English translation / explanation",
      "tip": "Short language exchange tip from Julian"
    }
  ],
  "isCorrect": true,
  "correction": "Grammar correction or 'Spot on!'",
  "encouragement": "Positive praise sentence for group language exchange",
  "contextualChipsPrompt": "Build your reply to choose between Bao and Julian or praise both:",
  "contextualChips": ["You both are so cute!", "Bao's English is better!", "Julian's Vietnamese is sweet!", "Cả hai anh đều giỏi", "Cảm ơn hai anh"]
}`;
    } else {
      systemInstruction = `You are a character in a language learning Otome dating sim chat game.
Target Language: ${characterLanguage || "Vietnamese"}.
Character Name: ${characterName || "Love Interest"}.
Difficulty Level: Tier ${tierLevel || 1}.

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Provide a short, natural, and realistic romantic response in ${characterLanguage} (strictly 10-20 words max, like a real text message). Keep the flirting sweet, subtle, and natural—not over-the-top or overly dramatic.
2. If the user is saying goodbye or leaving (e.g., "bye", "goodbye", "talk to you later", "gặp lại sau", "tạm biệt"), send a warm, brief sign-off text (e.g., "Bye! Talk to you later 😊" or "Gặp lại sau nhé! Take care!").
3. Set 'romaji' to null.
4. Provide full English translation in 'translation'.
5. Provide a 1-sentence helpful language tip in 'tip'.
6. GRAMMAR EVALUATION: Check if "${userText}" has any grammar or vocabulary errors.
   - 'isCorrect': true if correct, false if noticeable errors.
   - 'correction': Gentle correction if mistaken, or 'Spot on!' if correct.
   - 'encouragement': Positive praise sentence encouraging the user's effort.
7. Provide 5-6 short word chips for next turn in 'contextualChips' and prompt guide in 'contextualChipsPrompt'.

Return ONLY valid JSON matching this schema:
{
  "characterResponse": "short response in ${characterLanguage}",
  "romaji": null,
  "translation": "English translation",
  "tip": "1-sentence tip",
  "isCorrect": true,
  "correction": "Grammar correction or 'Spot on!'",
  "encouragement": "Positive praise sentence",
  "contextualChipsPrompt": "Next turn prompt guide",
  "contextualChips": ["chip1", "chip2", "chip3", "chip4", "chip5", "chip6"]
}`;
    }

    let responseText: string | undefined = undefined;
    let usedModel = "";
    let lastError: any = null;

    // Model Fallback Mechanism for Free Google Models
    for (const modelName of FREE_GEMINI_MODELS) {
      try {
        console.log(`[Gemini API] Trying free model: ${modelName}`);
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
          console.log(`[Gemini API] Success using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Gemini API] Model ${modelName} failed/rate-limited:`, err?.message || err);
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
    console.error("[Gemini API Error]", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error calling Gemini API",
    });
  }
}
