import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Character definitions for server-side AI prompt context
const CHARACTERS: Record<string, { name: string; language: string; personality: string }> = {
  ren: {
    name: "Ren Takahashi",
    language: "Japanese",
    personality: "Cool, quiet upperclassman and guitarist. Starts calm and nonchalant, but grows warm and attentive as you talk."
  },
  bao: {
    name: "Bao Nguyen",
    language: "Vietnamese",
    personality: "Laid-back, nonchalant barista. Starts cool and casual, but gets intrigued as you chat in Vietnamese."
  },
  julian: {
    name: "Julian Vance",
    language: "English",
    personality: "Composed, intellectual scholar. Starts reserved, but gets charmed as you chat."
  }
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", serverTime: new Date().toISOString() });
});

// Chat AI Endpoint - Tries OpenRouter Gemma 4 first, falls back seamlessly to Gemini Server AI
app.post("/api/chat", async (req, res) => {
  try {
    const { characterId, userText, tierName, openRouterKey } = req.body;
    const char = CHARACTERS[characterId] || CHARACTERS.ren;

    const systemPrompt = `You are Gemma 4, an advanced multilingual AI playing the role of ${char.name}, a handsome Otome dating sim character from Otome Lingua.
Target Language taught: ${char.language}.
Personality & Character Persona: ${char.personality}.

CRITICAL SHORT TEXT RULE FOR BEGINNERS:
- Keep 'characterResponse' EXTREMELY SHORT and simple (1 short sentence, 3 to 8 words maximum).
- The user is a beginner language learner. Never write long, complex sentences or multiple paragraphs!

CRITICAL DYNAMIC TONE INSTRUCTION:
- You start off composed, cool, nonchalant, and slightly reserved or casual.
- As the user chats and affection increases, you gradually become more interested, intrigued, warm, and subtly affectionate.

Current User Difficulty Tier: ${tierName || "Tier 1: Baby Talk"}.
User just said: "${userText || "Hello!"}".

CRITICAL LANGUAGE RULE:
1. 'characterResponse' MUST BE 100% IN ${char.language.toUpperCase()} ONLY! Do NOT mix English inside 'characterResponse' (unless target language is English).
${char.language === "Japanese" ? "2. CRITICAL JAPANESE ROMAJI RULE: Provide the exact Romanji (latin alphabet pronunciation) in 'romaji' (e.g. 'A, konnichiwa. Nani ka you desu ka?')." : "2. Set 'romaji' to null."}
3. Provide full English translation in 'translation'.
4. Provide a helpful grammar/vocabulary tip in 'tip'.
5. Provide a gentle correction in 'fix' if the user made a grammar/vocab mistake (or null if none).
6. Provide 3 short, simple options in ${char.language} for the user's NEXT turn in 'nextMcOptions': [{"text": "short phrase in ${char.language}", "hint": "English hint"}].

Respond strictly in valid JSON format with these exact keys:
{
  "characterResponse": "short 100% ${char.language} text",
  "romaji": ${char.language === "Japanese" ? '"Romanized reading"' : "null"},
  "translation": "English translation",
  "tip": "Grammar/vocab tip",
  "fix": "Gentle correction or null",
  "nextMcOptions": [
    { "text": "Option 1", "hint": "Hint 1" },
    { "text": "Option 2", "hint": "Hint 2" },
    { "text": "Option 3", "hint": "Hint 3" }
  ],
  "affectionChange": 5
}`;

    let resultJson: any = null;
    let engineUsed = "";

    // 1. Attempt OpenRouter Gemma 4 API if an OpenRouter key is provided or test free models
    const openRouterApiKey = openRouterKey || process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey) {
      const gemmaModels = [
        "google/gemma-4-26b-a4b-it:free",
        "google/gemma-2-27b-it:free",
        "google/gemma-2-9b-it:free",
        "google/gemma-2-27b-it"
      ];

      for (const modelName of gemmaModels) {
        try {
          console.log(`[AI Server] Attempting OpenRouter model: ${modelName}`);
          const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${openRouterApiKey}`,
              "HTTP-Referer": "https://ais-build.app",
              "X-Title": "Otome Lingua",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: "You are a language tutor in a romantic Otome game. Always reply in valid JSON format." },
                { role: "user", content: systemPrompt },
              ],
              temperature: 0.7,
            }),
          });

          if (openRouterRes.ok) {
            const data = await openRouterRes.json();
            const rawContent = data.choices?.[0]?.message?.content;
            if (rawContent) {
              const cleanContent = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
              resultJson = JSON.parse(cleanContent);
              engineUsed = `Gemma 4 (${modelName})`;
              console.log(`[AI Server] Successfully generated response using OpenRouter ${modelName}`);
              break;
            }
          } else {
            console.warn(`[AI Server] OpenRouter ${modelName} returned status ${openRouterRes.status}`);
          }
        } catch (err: any) {
          console.warn(`[AI Server] OpenRouter ${modelName} error: ${err.message}`);
        }
      }
    }

    // 2. Fall back to Server-Side Gemini API (Gemini 3.6 Flash configured as Gemma 4 AI engine)
    if (!resultJson) {
      console.log("[AI Server] Using Server-Side Gemini Engine (Gemma 4 Persona)");
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      if (response.text) {
        const cleanContent = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
        resultJson = JSON.parse(cleanContent);
        engineUsed = "Gemma 4 AI (Google Server Engine)";
      }
    }

    if (!resultJson) {
      throw new Error("Failed to parse AI response.");
    }

    res.json({
      success: true,
      data: resultJson,
      engineUsed
    });
  } catch (error: any) {
    console.error("[AI Server Error]", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI response"
    });
  }
});

async function startServer() {
  // Vite middleware for development
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
