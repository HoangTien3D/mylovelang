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
    const { characterId, characterName, characterLanguage, targetLanguage, isGroup, userText, tierLevel, recentHistory, apiKey: clientApiKey, userProfile } = req.body || {};

    const userName = userProfile?.name || "MC";
    const userPronouns = userProfile?.pronouns || "she/her";
    const userAge = userProfile?.age ? String(userProfile.age) : "20";

    // Determine target language name
    let targetLangCode = targetLanguage || "vi";
    if (!["vi", "en", "ja"].includes(targetLangCode)) {
      if (characterLanguage === "English") targetLangCode = "en";
      else if (characterLanguage === "Japanese") targetLangCode = "ja";
      else targetLangCode = "vi";
    }

    let targetLangName = "Vietnamese";
    if (targetLangCode === "en") targetLangName = "English";
    else if (targetLangCode === "ja") targetLangName = "Japanese";

    if (!userText) {
      return res.status(400).json({
        success: false,
        error: "Missing userText in request body",
      });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      clientApiKey ||
      process.env.VITE_OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY;

    let parsedData = null;
    let usedModel = "gemini-flash";

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const trimmedHistory = (recentHistory || [])
          .slice(-4)
          .map((h: any) => `${h.sender === "user" ? userName : (h.speakerName || characterName || "LI")}: ${h.text}`)
          .join("\n");

        let systemInstruction = "";

        if (isGroup || characterId === "group") {
          systemInstruction = `You are running a 3-way language exchange group chat between love interests competing for the user's attention and romantic affection:
1. Bao Nguyen (Barista & Chef, warm & attentive)
2. Julian Vance (Literature Scholar, refined & romantic)
3. Ren Takahashi (Manga Illustrator & Tea Master, reserved & tsundere)

CRITICAL LANGUAGE REQUIREMENT:
The selected target language for this conversation is MUST BE 100% EXCLUSIVELY ${targetLangName} (${targetLangCode}).
Both characters MUST speak in ${targetLangName}!
Do NOT output Vietnamese if the target language is English or Japanese!
Do NOT output English if the target language is Vietnamese or Japanese!
Do NOT output Japanese if the target language is Vietnamese or English!

USER PROFILE: Name: "${userName}", Pronouns: "${userPronouns}", Age: "${userAge}".
Address and refer to the user directly as "${userName}".

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Short & Casual Texting: Keep responses natural, short (10-20 words max or pure emojis).
2. Pure Emoji Reactions: Characters can respond with pure emoji reactions (e.g. "🥰", "☕❤️", "👀", "😳", "✨") or short emoji-led responses when natural!
3. Short User Answers: The user may send short answers like "yeah", "ok", "cool", "no", "idk", "me too", "haha", "sure", "😊", "❤️". Treat these as 100% valid natural conversation—NEVER mark them as grammar errors!
4. GRAMMAR EVALUATION: Check if "${userText}" has any language errors. If user gave short/casual answer or emojis, set 'isCorrect': true and 'correction': 'Spot on!'.
5. Provide 5-6 short word chips in ${targetLangName} for ${userName}'s next turn in 'contextualChips' and prompt guide in 'contextualChipsPrompt'.

10. Optional Klipy GIF Search Query: You can optionally include 'gifQuery' with a short search query for Klipy GIFs matching the emotion/context (e.g., "anime coffee blush", "anime reading book heart", "anime tea blush").

Return ONLY valid JSON matching this schema:
{
  "isGroup": true,
  "groupResponses": [
    {
      "speaker": "bao",
      "speakerName": "Bao Nguyen",
      "text": "Short response or emoji from Bao in ${targetLangName}",
      "translation": "Full English translation",
      "tip": "Short language tip from Bao"
    },
    {
      "speaker": "julian",
      "speakerName": "Julian Vance",
      "text": "Short response or emoji from Julian in ${targetLangName}",
      "translation": "Full English translation",
      "tip": "Short language tip from Julian"
    }
  ],
  "isCorrect": true,
  "correction": "Grammar correction or 'Spot on!'",
  "encouragement": "Positive praise sentence",
  "contextualChipsPrompt": "Build your reply:",
  "contextualChips": ["chip1", "chip2", "chip3", "chip4", "chip5"],
  "gifQuery": "anime coffee heart"
}`;
        } else {
          systemInstruction = `You are a character (${characterName || "Love Interest"}) in an Otome romance dating sim chat game.

CRITICAL LANGUAGE REQUIREMENT:
The selected target language for this conversation MUST BE 100% EXCLUSIVELY ${targetLangName} (${targetLangCode}).
You MUST speak ONLY in ${targetLangName}!
Do NOT output Vietnamese if target language is English or Japanese!
Do NOT output Japanese if target language is Vietnamese or English!
Do NOT output English if target language is Vietnamese or Japanese!
(Except for the JSON 'translation' field which provides the English translation).

USER PROFILE: Name: "${userName}", Pronouns: "${userPronouns}", Age: "${userAge}".
Address the user directly as "${userName}" or using their preferred pronouns (${userPronouns}).

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Provide a short, natural, and realistic romantic response in ${targetLangName} addressing ${userName} (strictly 10-20 words max, or pure emoji reaction).
2. Pure Emoji Reactions: You CAN respond with pure emoji reactions (e.g. "🥰", "☕❤️", "👀", "😳", "✨", "😊") or short emoji-led responses when appropriate!
3. Short User Answers: The user may send short answers or casual phrases (e.g. "yeah", "ok", "cool", "no", "idk", "me too", "haha", "sure", "😊", "❤️"). Treat these as 100% valid natural conversation—NEVER mark them as grammar errors!
4. If ${userName} is saying goodbye or leaving, send a warm, brief sign-off text in ${targetLangName}.
5. If target language is Japanese (${targetLangCode} === 'ja'), provide Romaji in 'romaji'. Otherwise set 'romaji' to null.
6. Provide full English translation in 'translation'.
7. Provide a 1-sentence helpful language tip in 'tip'.
8. GRAMMAR EVALUATION: Check if "${userText}" has any grammar errors. If short answer/emoji, set 'isCorrect': true and 'correction': 'Spot on!'.
9. Provide 5-6 short word chips in ${targetLangName} for next turn in 'contextualChips' and prompt guide in 'contextualChipsPrompt'.

10. Optional Klipy GIF Search Query: You can optionally include 'gifQuery' with a short search query for Klipy GIFs matching your emotion (e.g., "anime coffee blush", "anime book heart", "anime tea blush").

Return ONLY valid JSON matching this schema:
{
  "characterResponse": "short response or emoji in ${targetLangName}",
  "romaji": "romaji text if Japanese, else null",
  "translation": "English translation",
  "tip": "1-sentence tip",
  "isCorrect": true,
  "correction": "Grammar correction or 'Spot on!'",
  "encouragement": "Positive praise sentence",
  "contextualChipsPrompt": "Next turn prompt guide",
  "contextualChips": ["chip1", "chip2", "chip3", "chip4", "chip5"],
  "gifQuery": "anime coffee heart"
}`;
        }

        let responseText: string | undefined = undefined;

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
          } catch (e) {
            // try next model
          }
        }

        if (responseText) {
          try {
            parsedData = JSON.parse(responseText);
          } catch {
            const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            parsedData = JSON.parse(cleaned);
          }
        }
      } catch (err: any) {
        console.warn("[Gemini API] AI call failed, using fallback:", err?.message);
      }
    }

    if (!parsedData) {
      // In-character smart fallback generator
      if (characterId === "group" || isGroup) {
        parsedData = {
          isGroup: true,
          groupResponses: [
            {
              speaker: "bao",
              speakerName: "Bao Nguyen",
              text: "Em nhắn dễ thương quá! Anh vừa pha ly cà phê thơm phức cho em nè! ☕❤️",
              translation: "Bao: Your message is so cute! I brewed a fragrant coffee for you! ☕❤️",
              tip: "Bao is showing affection through his coffee brewing."
            },
            {
              speaker: "julian",
              speakerName: "Julian Vance",
              text: "Splendid words, MC! Talking with you always brightens my day! ✨",
              translation: "Julian: Splendid words, MC! Talking with you always brightens my day! ✨",
              tip: "Julian loves chatting with you in the group chat."
            }
          ],
          isCorrect: true,
          correction: "Spot on!",
          encouragement: "Great effort! Your sentence was clear and natural.",
          contextualChipsPrompt: "Build your reply to Bao & Julian:",
          contextualChips: ["Cảm ơn hai anh", "Cà phê ngon lắm", "I love chatting with both of you", "Hai anh rất dễ thương", "Hẹn gặp lại"]
        };
      } else if (characterId === "bao") {
        parsedData = {
          characterResponse: "Cảm ơn em nha! Nghe em nói làm anh vui cả ngày luôn á. Em uống cà phê chưa? ☕",
          romaji: null,
          translation: "Thank you sweetheart! Hearing you talk made my whole day happy. Have you had coffee yet?",
          tip: "'Cảm ơn em' is a warm way to say thank you to someone younger or a sweetheart.",
          isCorrect: true,
          correction: "Spot on!",
          encouragement: "Tuyệt vời! Cụm từ của em rất chính xác và tự nhiên.",
          contextualChipsPrompt: "Build your reply to Bao (Vietnamese 🇻🇳):",
          contextualChips: ["Cho em một ly cà phê", "Cảm ơn anh Bao", "Anh Bao rất dễ thương", "Em rảnh nè", "Hẹn gặp lại anh"]
        };
      } else {
        parsedData = {
          characterResponse: "What a charming sentiment! Reading your words always brings a smile to my face, MC.",
          romaji: null,
          translation: "What a charming sentiment! Reading your words always brings a smile to my face, MC.",
          tip: "'Charming sentiment' expresses gentle romantic affection.",
          isCorrect: true,
          correction: "Spot on!",
          encouragement: "Splendid phrasing! Excellent work expressing your thoughts.",
          contextualChipsPrompt: "Build your reply to Julian (English 🇬🇧):",
          contextualChips: ["I would love to read with you", "Thank you Julian", "You are very kind", "I am happy to talk", "Talk to you later"]
        };
      }
      usedModel = "fallback-engine";
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

