import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// PASTE YOUR GOOGLE GEMINI API KEY HERE IF YOU WANT TO HARDCODE IT LOCALLY:
// Example: const HARDCODED_GEMINI_API_KEY = "AIzaSy...";
const HARDCODED_GEMINI_API_KEY = "";

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
    // Fallback attempt with Bearer header if SDK failed due to auth format
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Free Google Gemini Models Fallback List
  const FREE_GEMINI_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
  ];

  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = getEffectiveApiKey();
      if (!apiKey) {
        return res.status(400).json({
          success: false,
          error: "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY environment variable (starting with 'AIzaSy...') or paste it in server.ts.",
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

      const { characterName, characterLanguage, userText, tierLevel, recentHistory } = req.body;

      // TOKEN SAVING STRATEGY 1: Truncate chat history to max 4 items (2 previous turns)
      const trimmedHistory = (recentHistory || [])
        .slice(-4)
        .map((h: any) => `${h.sender === "user" ? "User" : characterName || "LI"}: ${h.text}`)
        .join("\n");

      // TOKEN SAVING STRATEGY 2: Compact JSON system instructions
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

      // Model Fallback Mechanism for Free Google Models
      for (const modelName of FREE_GEMINI_MODELS) {
        try {
          console.log(`[Gemini API] Trying free model: ${modelName}`);
          const resText = await generateGeminiContent(apiKey, modelName, systemInstruction, userText, ai);
          if (resText) {
            responseText = resText;
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

      res.json({
        success: true,
        usedModel,
        data: parsedData,
      });
    } catch (err: any) {
      console.error("[Gemini API Error]", err);
      let errorMessage = err?.message || "Internal server error calling Gemini API";
      if (typeof errorMessage === "string" && (errorMessage.includes("UNAUTHENTICATED") || errorMessage.includes("OAuth 2") || errorMessage.includes("API key not valid"))) {
        errorMessage = "Invalid Gemini API Key: Please configure a valid Google Gemini API Key (starts with 'AIzaSy...') in Vercel settings or server.ts.";
      }
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
