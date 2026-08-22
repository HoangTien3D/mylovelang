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

    const isMaleUser = userPronouns.toLowerCase().includes("he") || userPronouns.toLowerCase().includes("him");
    const userOlderHonorific = isMaleUser ? "anh" : "chị"; // What Kou calls the user
    const userOlderHonorificCap = isMaleUser ? "Anh" : "Chị";

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
1. Ado (Classmate: strict, reliable, tsundere, acts demanding about studies/duties but easily flustered and soft inside, addresses user as classmate "cậu", calls himself "tớ")
2. Kou (Underclassman/Junior: cute, innocent, clingy, eager to please, addresses user as "${userOlderHonorific}" e.g. "${userOlderHonorificCap} ơi", calls himself "em" or "Kou")
3. Ren (Senior: aggressive, flirty, bully & assertive, teasing, confident, addresses user as "em" / "nhóc", calls himself "anh")

CRITICAL LANGUAGE REQUIREMENT:
The selected target language for this conversation MUST BE 100% EXCLUSIVELY ${targetLangName} (${targetLangCode}).
Both characters MUST speak in ${targetLangName}!
Do NOT output Vietnamese if the target language is English or Japanese!
Do NOT output English if the target language is Vietnamese or Japanese!
Do NOT output Japanese if the target language is Vietnamese or English!

VIETNAMESE ADDRESSING MANDATE (CRITICAL):
- When target language is Vietnamese, NEVER use the word "tiền bối"!
- Kou is the younger junior: Kou MUST address the user as "${userOlderHonorific}" (capitalized: "${userOlderHonorificCap}"), and Kou refers to himself as "em" or "Kou".
- Ren is the older senior: Ren MUST address the user as "em" or playfully "nhóc", and refers to himself as "anh".
- Ado is the classmate: Ado addresses the user as "cậu", and refers to himself as "tớ".

NO EMOJIS RULE:
Do NOT use emojis in texting or character dialogue! Keep all character text, replies, and options free of emojis.

USER PROFILE: Name: "${userName}", Pronouns: "${userPronouns}", Age: "${userAge}".
Address and refer to the user directly as "${userName}".

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Ultra-Simple Beginner Language (A1 Level): Keep responses very short, simple, and natural (strictly 3 to 8 words max, e.g., "Chào ${userOlderHonorific} nha!", "Đi chơi thôi nào!", "Cảm ơn ${userOlderHonorific}!"). Do NOT use complex grammar, subordinate clauses, or long sentences!
2. Strict No-Emoji Rule: Do NOT include emojis in character dialogues, starter options, or chips!
3. Ensure Ado sounds tsundere/diligent, Kou sounds cute/clingy, and Ren sounds flirty/assertive.

EVALUATION COLOR RANGE & INSIGHTFUL FEEDBACK RULES:
Analyze "${userText}" and classify its language quality into 'evalColor' ("red", "yellow", or "green"):

1. "red" (SEVERELY BROKEN LANGUAGE):
   - Trigger: Major grammar mistakes, broken sentence structure, incomprehensible phrasing, severe particle/verb conjugation errors.
   - Set 'evalColor': "red"
   - Set 'isCorrect': false
   - Set 'correction': The corrected standard sentence in ${targetLangName}.
   - Set 'tip': An insightful, clear breakdown explaining the grammar rule that was broken and how to fix it properly.
   - Set 'encouragement': "Grammar fix needed! Here is the corrected structure:"

2. "yellow" (SLANG & CASUAL PHRASING):
   - Trigger: Slang, informal abbreviations (e.g., "idk", "gonna", "u", "r", "wanna", "được ko", "ko", "bùn", "chơi luôn", "vl", "omg", "imho", "idfc", "thôi nha", "omw", "tbh"), or colloquialisms.
   - Set 'evalColor': "yellow"
   - Set 'isCorrect': true
   - Set 'correction': Standard/formal equivalent term (e.g. "Standard term: 'I do not know' instead of 'idk'" or "Formal: 'Được không'").
   - Set 'tip': An insightful explanation of WHAT the slang term means, its social context, AND a clear reminder of the standard/formal term for learning.
   - Set 'encouragement': "Fun casual slang! Here is a reminder of the formal term:"

3. "green" (GOOD GRAMMAR & VOCAB USAGE):
   - Trigger: Good grammar, correct sentence structure, natural vocabulary, or standard phrases (including natural short replies like "sure", "ok", "yes", "thank you", "cảm ơn").
   - Set 'evalColor': "green"
   - Set 'isCorrect': true
   - Set 'correction': "Spot on!" (or a polished alternative if applicable)
   - Set 'tip': An insightful breakdown praising their grammar/vocab selection, explaining WHY it sounds natural, authentic, or contextually fitting.
   - Set 'encouragement': "Excellent grammar and natural vocabulary usage!"

5. Provide 6-10 individual single words in ${targetLangName} (NOT full sentences or multi-word phrases) for ${userName} to combine and build a custom sentence in 'contextualChips', along with a prompt guide in 'contextualChipsPrompt'. CRITICAL: Each item in 'contextualChips' MUST be a single word (or particle/punctuation), e.g., ["Cảm", "ơn", "hai", "cậu", "rất", "vui", "nói", "chuyện", "nhé", "ạ"]. Do NOT suggest full sentences or multi-word phrases!
6. Provide EXACTLY 3 ultra-short, simple beginner-friendly reply options without emojis in ${targetLangName} in 'starterOptions' (each with 'text' of 2-5 words and English 'translation') for complete beginners to pick with 1 click. E.g. [{"text": "Chào hai cậu!", "translation": "Hello both of you!"}, {"text": "Cảm ơn nhé!", "translation": "Thank you!"}, {"text": "Đi chơi thôi!", "translation": "Let's go play!"}].
7. Optional Klipy GIF Search Query: You can optionally include 'gifQuery' with a short search query for popular pop culture or meme GIFs matching your emotion (e.g., "shrek happy", "ishowspeed hype", "funny cat reaction", "popular meme reaction", "steve harvey shock"). Only include this ONCE IN A WHILE (occasionally) when a GIF reaction is truly fitting!

Return ONLY valid JSON matching this schema:
{
  "isGroup": true,
  "groupResponses": [
    {
      "speaker": "ado",
      "speakerName": "Ado",
      "text": "Short 3-6 word response from Ado in ${targetLangName} without emojis",
      "translation": "Full English translation",
      "tip": "Short language tip from Ado"
    },
    {
      "speaker": "kou",
      "speakerName": "Kou",
      "text": "Short 3-6 word response from Kou in ${targetLangName} without emojis",
      "translation": "Full English translation",
      "tip": "Short language tip from Kou"
    }
  ],
  "evalColor": "green",
  "isCorrect": true,
  "correction": "Grammar correction or standard formal term or 'Spot on!'",
  "tip": "Insightful breakdown explaining grammar, slang, or vocabulary choice",
  "encouragement": "Positive praise or feedback title sentence",
  "starterOptions": [
    { "text": "Chào hai cậu!", "translation": "Hello both of you!" },
    { "text": "Cảm ơn nhé!", "translation": "Thank you!" },
    { "text": "Đi chơi thôi!", "translation": "Let's go hang out!" }
  ],
  "contextualChipsPrompt": "Build your reply:",
  "contextualChips": ["Cảm", "ơn", "hai", "cậu", "rất", "vui", "nói", "chuyện", "nhé", "ạ"],
  "gifQuery": "shrek happy"
}`;
        } else {
          let charPersona = "";
          if (characterId === "ado") {
            charPersona = `Ado (Classmate): Strict, reliable, tsundere. Acts strict about studies/duties, easily flustered when complimented, stammers 'b-betsu ni...' or 'It's not like I care!', but secretly looks out for user and cares deeply. In Vietnamese, Ado calls the user 'cậu' and refers to himself as 'tớ' or 'Ado'.`;
          } else if (characterId === "kou") {
            charPersona = `Kou (Underclassman/Junior): Cute, innocent, extremely clingy, eager to please. In Vietnamese, Kou calls the user '${userOlderHonorific}' (e.g. '${userOlderHonorificCap} ơi', '${userOlderHonorific} có rảnh không?') and refers to himself as 'em' or 'Kou'. CRITICAL: NEVER call the user 'tiền bối' in Vietnamese! Always use '${userOlderHonorific}'. Always seeks user's attention, gets worried if ignored.`;
          } else if (characterId === "ren") {
            charPersona = `Ren (Senior): Aggressive, flirty, bully & assertive. Teases user playfully, refers to himself as 'anh', calls user 'em' or playfully 'nhóc' / 'bé', confident, loves getting close and making user blush.`;
          } else {
            charPersona = `${characterName}: Romantic love interest in a dating sim.`;
          }

          systemInstruction = `You are playing the character ${characterName} in an Otome romance dating sim chat game.
CHARACTER PERSONA & TROPE:
${charPersona}

CRITICAL LANGUAGE REQUIREMENT:
The selected target language for this conversation MUST BE 100% EXCLUSIVELY ${targetLangName} (${targetLangCode}).
You MUST speak ONLY in ${targetLangName}!
Do NOT output Vietnamese if target language is English or Japanese!
Do NOT output Japanese if target language is Vietnamese or English!
Do NOT output English if target language is Vietnamese or Japanese!
(Except for the JSON 'translation' field which provides the English translation).

VIETNAMESE ADDRESSING MANDATE (CRITICAL):
- When target language is Vietnamese, NEVER use the word "tiền bối"!
- If you are Kou (junior): You MUST call the user "${userOlderHonorific}" ("${userOlderHonorificCap}"), and refer to yourself as "em" or "Kou".
- If you are Ren (senior): You MUST refer to yourself as "anh", and call the user "em" or "nhóc".
- If you are Ado (classmate): You MUST call the user "cậu", and refer to yourself as "tớ".

NO EMOJIS RULE:
Do NOT use emojis in texting or character dialogue! Keep all character text, replies, and options free of emojis.

USER PROFILE: Name: "${userName}", Pronouns: "${userPronouns}", Age: "${userAge}".
Address the user directly as "${userName}" or using appropriate natural Vietnamese terms (${userOlderHonorific} / em / cậu).

User input: "${userText}"

Recent conversation:
${trimmedHistory}

Instructions:
1. Ultra-Simple Beginner Language (A1 Level): Keep your in-character response extremely short, simple, and elementary (strictly 3 to 8 words maximum, e.g., "Chào ${userOlderHonorific} nha!", "Kou nhớ ${userOlderHonorific} lắm!", "Đi chơi thôi nào!", "Ngoan quá!", "Hừm... Tốt lắm.", "Chào nhóc nhé."). Ban long sentences, complicated vocabulary, or dense grammar!
2. Strict No-Emoji Rule: Do NOT include emojis in character responses or dialogue!
3. If ${userName} is saying goodbye or leaving, send a brief sign-off text in ${targetLangName} matching your personality.
4. If target language is Japanese (${targetLangCode} === 'ja'), provide Romaji in 'romaji'. Otherwise set 'romaji' to null.
5. Provide full English translation in 'translation'.

EVALUATION COLOR RANGE & INSIGHTFUL FEEDBACK RULES:
Analyze "${userText}" and classify its language quality into 'evalColor' ("red", "yellow", or "green"):

1. "red" (SEVERELY BROKEN LANGUAGE):
   - Trigger: Major grammar mistakes, broken sentence structure, incomprehensible phrasing, severe particle/verb conjugation errors.
   - Set 'evalColor': "red"
   - Set 'isCorrect': false
   - Set 'correction': The corrected standard sentence in ${targetLangName}.
   - Set 'tip': An insightful, clear breakdown explaining the grammar rule that was broken and how to fix it properly.
   - Set 'encouragement': "Grammar fix needed! Here is the corrected structure:"

2. "yellow" (SLANG & CASUAL PHRASING):
   - Trigger: Slang, informal abbreviations (e.g., "idk", "gonna", "u", "r", "wanna", "được ko", "ko", "bùn", "chơi luôn", "vl", "omg", "imho", "idfc", "thôi nha", "omw", "tbh"), or colloquialisms.
   - Set 'evalColor': "yellow"
   - Set 'isCorrect': true
   - Set 'correction': Standard/formal equivalent term (e.g. "Standard term: 'I do not know' instead of 'idk'" or "Formal: 'Được không'").
   - Set 'tip': An insightful explanation of WHAT the slang term means, its social context, AND a clear reminder of the standard/formal term for learning.
   - Set 'encouragement': "Fun casual slang! Here is a reminder of the formal term:"

3. "green" (GOOD GRAMMAR & VOCAB USAGE):
   - Trigger: Good grammar, correct sentence structure, natural vocabulary, or standard phrases (including natural short replies like "sure", "ok", "yes", "thank you", "cảm ơn").
   - Set 'evalColor': "green"
   - Set 'isCorrect': true
   - Set 'correction': "Spot on!" (or a polished alternative if applicable)
   - Set 'tip': An insightful breakdown praising their grammar/vocab selection, explaining WHY it sounds natural, authentic, or contextually fitting.
   - Set 'encouragement': "Excellent grammar and natural vocabulary usage!"

6. Provide 6-10 individual single words in ${targetLangName} (NOT full sentences or multi-word phrases) for ${userName} to combine and build a custom sentence in 'contextualChips', along with a prompt guide in 'contextualChipsPrompt'. CRITICAL: Each item in 'contextualChips' MUST be a single word (or particle/punctuation), e.g., ["Thank", "you", "so", "much", "I", "am", "happy", "to", "see", "you", "too"]. Do NOT suggest full sentences or multi-word phrases!
7. Provide EXACTLY 3 ultra-short, simple beginner-friendly reply options without emojis in ${targetLangName} in 'starterOptions' (each with 'text' of 2-5 words and English 'translation') for complete beginners to pick with 1 click. E.g. [{"text": "Chào Ado!", "translation": "Hello Ado!"}, {"text": "Đi chơi nhé!", "translation": "Let's hang out!"}, {"text": "Cảm ơn em!", "translation": "Thank you!"}].
8. Optional Klipy GIF Search Query: You can optionally include 'gifQuery' with a short search query for popular pop culture or meme GIFs matching your emotion (e.g., "shrek happy", "ishowspeed hype", "funny cat reaction", "popular meme reaction", "steve harvey shock"). Only include this ONCE IN A WHILE (occasionally) when a GIF reaction is truly fitting!

Return ONLY valid JSON matching this schema:
{
  "characterResponse": "short 3-8 word response without emojis in ${targetLangName}",
  "romaji": "romaji text if Japanese, else null",
  "translation": "English translation",
  "evalColor": "green",
  "tip": "Insightful breakdown explaining grammar, slang, or vocabulary choice",
  "isCorrect": true,
  "correction": "Grammar correction or standard formal term or 'Spot on!'",
  "encouragement": "Positive praise or feedback title sentence",
  "starterOptions": [
    { "text": "Option 1 in 2-5 words", "translation": "English translation 1" },
    { "text": "Option 2 in 2-5 words", "translation": "English translation 2" },
    { "text": "Option 3 in 2-5 words", "translation": "English translation 3" }
  ],
  "contextualChipsPrompt": "Next turn prompt guide",
  "contextualChips": ["word1", "word2", "word3", "word4", "word5", "word6"],
  "gifQuery": "shrek happy"
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
      // Dynamic evaluation color classifier for fallback
      let fallbackColor = "green";
      let fallbackCorrection = "Spot on!";
      let fallbackTip = "Language Insight: Great grammar and natural phrase usage!";
      let fallbackEncouragement = "Excellent grammar and natural vocabulary usage!";

      const textLower = (userText || "").toLowerCase();
      const slangRegex = /\b(idk|gonna|wanna|u|r|ko|được ko|bùn|chơi luôn|vcl|vl|omg|imho|idfc|tbh|omw)\b/i;

      if (slangRegex.test(textLower)) {
        fallbackColor = "yellow";
        fallbackCorrection = "Standard term: Expand abbreviations into full formal terms (e.g. 'I do not know' or 'Được không')";
        fallbackTip = "Slang Insight: You used informal slang/abbreviation. It's great for casual texting, but remember formal phrasing for learning standard grammar!";
        fallbackEncouragement = "Fun casual slang! Here is a reminder of the formal term:";
      } else if (textLower.length > 25 && !textLower.includes(" ")) {
        fallbackColor = "red";
        fallbackCorrection = "Grammar Fix: Ensure clear word spacing and grammar structure";
        fallbackTip = "Grammar Rule: Severely broken sentence structure. Make sure words are separated with proper spaces and conjugation.";
        fallbackEncouragement = "Grammar fix needed! Here is the corrected structure:";
      }

      // In-character smart fallback generator (Ultra-Simple Beginner Level)
      if (characterId === "group" || isGroup) {
        parsedData = {
          isGroup: true,
          groupResponses: [
            {
              speaker: "ado",
              speakerName: "Ado",
              text: "Ado nhớ bạn lắm nè!",
              translation: "Ado: I miss you so much!",
              tip: "Ado is showing his cute junior affection."
            },
            {
              speaker: "kou",
              speakerName: "Kou",
              text: "Hừm... Học bài xong chưa?",
              translation: "Kou: Hmph... Are you done studying?",
              tip: "Kou is showing his tsundere caring side."
            }
          ],
          evalColor: fallbackColor,
          isCorrect: fallbackColor !== "red",
          correction: fallbackCorrection,
          tip: fallbackTip,
          encouragement: fallbackEncouragement,
          starterOptions: [
            { text: "Chào hai cậu!", translation: "Hello both of you!" },
            { text: "Cảm ơn nhé!", translation: "Thank you!" },
            { text: "Đi chơi thôi!", translation: "Let's go play!" }
          ],
          contextualChipsPrompt: "Build your reply to Ado & Kou:",
          contextualChips: ["Cảm", "ơn", "hai", "cậu", "Ado", "Kou", "nhé", "ạ"]
        };
      } else if (characterId === "ado") {
        parsedData = {
          characterResponse: "Hừm... Cậu làm tốt lắm.",
          romaji: null,
          translation: "Hmph... You did well.",
          evalColor: fallbackColor,
          tip: fallbackTip,
          isCorrect: fallbackColor !== "red",
          correction: fallbackCorrection,
          encouragement: fallbackEncouragement,
          starterOptions: [
            { text: "Cảm ơn Ado!", translation: "Thank you Ado!" },
            { text: "Ado giảng bài nhé!", translation: "Teach me Ado!" },
            { text: "Ado đừng gắt nha.", translation: "Don't be strict Ado." }
          ],
          contextualChipsPrompt: "Build your reply to Ado:",
          contextualChips: ["Cảm", "ơn", "Ado", "tớ", "sẽ", "cố", "gắng", "nhé"]
        };
      } else if (characterId === "kou") {
        parsedData = {
          characterResponse: `Chào ${userOlderHonorific} nha! Đi chơi với em thôi!`,
          romaji: null,
          translation: `Hello ${userOlderHonorificCap}! Let's go play together!`,
          evalColor: fallbackColor,
          tip: fallbackTip,
          isCorrect: fallbackColor !== "red",
          correction: fallbackCorrection,
          encouragement: fallbackEncouragement,
          starterOptions: [
            { text: `Chào Kou nha!`, translation: "Hello Kou!" },
            { text: "Đi chơi thôi!", translation: "Let's go play!" },
            { text: "Kou ngoan quá!", translation: "Kou is so cute!" }
          ],
          contextualChipsPrompt: "Build your reply to Kou:",
          contextualChips: ["Chào", "Kou", "ngoan", "quá", "đi", "chơi", "với", userOlderHonorific, "nhé"]
        };
      } else if (characterId === "ren") {
        parsedData = {
          characterResponse: "Chào nhóc nhé. Ngoan lắm!",
          romaji: null,
          translation: "Hello kid. Good job!",
          evalColor: fallbackColor,
          tip: fallbackTip,
          isCorrect: fallbackColor !== "red",
          correction: fallbackCorrection,
          encouragement: fallbackEncouragement,
          starterOptions: [
            { text: "Chào anh Ren!", translation: "Hello Ren!" },
            { text: "Em không phải nhóc!", translation: "I am not a kid!" },
            { text: "Anh Ren trêu em!", translation: "Ren is teasing me!" }
          ],
          contextualChipsPrompt: "Build your reply to Ren:",
          contextualChips: ["Chào", "anh", "Ren", "em", "không", "phải", "nhóc", "đâu"]
        };
      } else {
        parsedData = {
          characterResponse: "Hello! So happy to talk!",
          romaji: null,
          translation: "Hello! So happy to talk!",
          evalColor: fallbackColor,
          tip: fallbackTip,
          isCorrect: fallbackColor !== "red",
          correction: fallbackCorrection,
          encouragement: fallbackEncouragement,
          starterOptions: [
            { text: "Hello! How are you?", translation: "Hello! How are you?" },
            { text: "Thank you so much!", translation: "Thank you so much!" },
            { text: "Talk to you soon!", translation: "Talk to you soon!" }
          ],
          contextualChipsPrompt: "Build your reply:",
          contextualChips: ["Hello", "Thank", "you", "happy", "to", "talk", "with", "you"]
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

