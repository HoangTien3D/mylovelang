import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const FREE_GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const {
      mediaType, // 'text' | 'image' | 'audio' | 'video' | 'subtitles'
      targetLanguage = "vi", // 'vi' | 'en' | 'ja' | 'ko' | 'zh'
      text,
      mediaBase64,
      mimeType,
      fileName,
      customFocus = "Romance & Everyday Life",
      apiKey: clientApiKey
    } = req.body || {};

    const langNames: Record<string, string> = {
      vi: "Vietnamese",
      en: "English",
      ja: "Japanese",
      ko: "Korean",
      zh: "Mandarin Chinese"
    };

    const targetLangName = langNames[targetLanguage] || "Vietnamese";

    const apiKey =
      process.env.GEMINI_API_KEY ||
      clientApiKey ||
      process.env.VITE_OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    let parsedData = null;
    let usedModel = "gemini-flash";

    if (apiKey) {
      // 1. If OpenRouter API Key (sk-...)
      if (apiKey.startsWith("sk-") || apiKey.includes("openrouter") || apiKey.includes("or-")) {
        try {
          const openRouterModels = [
            "google/gemini-2.5-flash",
            "google/gemini-flash-1.5",
            "meta-llama/llama-3.3-70b-instruct",
            "openai/gpt-4o-mini"
          ];

          let userPrompt = `Please analyze this media for OpenKoto language learning in ${targetLangName} with focus on "${customFocus}".`;
          if (fileName) userPrompt += ` File name: "${fileName}".`;
          if (text && text.trim().length > 0) {
            userPrompt += `\n\nProvided Text / Transcript / Media Content:\n"""\n${text}\n"""`;
          } else if (!mediaBase64) {
            userPrompt += `\n\nGenerate an immersive romance media learning experience in ${targetLangName} around the theme: "${customFocus}".`;
          }

          const messages = [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
          ];

          for (const orModel of openRouterModels) {
            try {
              const orResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${apiKey}`,
                  "HTTP-Referer": "https://aistudio-build.app",
                  "X-Title": "Otome OpenKoto Language Learning"
                },
                body: JSON.stringify({
                  model: orModel,
                  messages: messages,
                  temperature: 0.6,
                  response_format: { type: "json_object" }
                })
              });

              if (orResp.ok) {
                const orJson: any = await orResp.json();
                const content = orJson?.choices?.[0]?.message?.content;
                if (content) {
                  try {
                    parsedData = JSON.parse(content);
                  } catch {
                    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
                    parsedData = JSON.parse(cleaned);
                  }
                  if (parsedData) {
                    usedModel = `openrouter-${orModel}`;
                    break;
                  }
                }
              }
            } catch (err: any) {
              console.warn(`[OpenRouter Media AI] Failed with ${orModel}:`, err?.message);
            }
          }
        } catch (e: any) {
          console.warn("[OpenRouter Media] Error:", e?.message);
        }
      }

      // 2. If Gemini API Key or fallback
      if (!parsedData) {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey.startsWith("sk-") && process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

        const systemInstruction = `You are OpenKoto AI - an advanced multimodal language learning intelligence inspired by openkoto/TextLingo.
Your mission is to transform any user-uploaded media (photo of signs/manga/text, audio clip, video subtitles, song lyrics, article, dialogue, or story) into a comprehensive, highly interactive language learning experience tailored for learners of ${targetLangName} (${targetLanguage}).

LEARNING FOCUS & CONTEXT: "${customFocus}".
TARGET LEARNING LANGUAGE: ${targetLangName} (${targetLanguage}).

YOUR TASKS:
1. Extract, transcribe, or analyze the media content accurately in ${targetLangName}. If the media is in another language, transcribe and adapt it for learning ${targetLangName}.
2. Break down the content sentence by sentence.
3. For each sentence:
   - Provide accurate original text in ${targetLangName}.
   - Provide phonetic pronunciation / reading guide (e.g. Romaji for Japanese, Pinyin with tones for Chinese, Romaja for Korean, simplified phonetic tones for Vietnamese, or IPA for English).
   - Provide clean English translation.
   - Provide grammar/nuance breakdown explaining the sentence structure, tone (polite vs casual vs romantic/flirty), and particle usage.
   - Tokenize the sentence into clickable words/morphemes. For each token: word, lemma (dictionary form), part of speech (pos), phonetic, meaning, and contextual usage note.
4. Extract 4-8 high-yield Core Vocabulary terms with difficulty rating (A1-C2 / JLPT / HSK), part of speech, exact definition, and an example sentence with translation.
5. Identify 2-4 key Grammar Points & Sentence Patterns with pattern formulas, explanations, and romance/colloquial usage context.
6. Provide 2-3 Cultural & Pragmatic Insights (social context, addressing terms like anh/em/cậu/chị, body language cues, or texting slang).
7. Generate 4 interactive practice activities based DIRECTLY on this media:
   - 1 Multiple Choice comprehension/nuance check with 4 options, correctIndex, and explanation.
   - 1 Sentence Scramble exercise with targetSentence, translation, scrambledWords array, and correctWords array.
   - 1 Cloze Fill-in-the-blank test with sentenceWithBlank, blankWord, 4 options, correctIndex, and explanation.
   - 1 Otome Character Dialogue Roleplay where one of our romance characters (Ado the tsundere classmate, Kou the cute junior, or Ren the flirty senior) reacts to this media and prompts the user with 2-3 reply choices, each with character feedback.

OUTPUT STRICT VALID JSON matching this exact schema:
{
  "title": "Short catchy title for this media lesson (e.g. Cafe Menu Romance or Night Walk Lyrics)",
  "summary": "2-3 sentence overview explaining what this media is about and why it's great for learning",
  "level": "Beginner (A1)" or "Elementary (A2)" or "Intermediate (B1)" or "Advanced (B2/C1)",
  "language": "${targetLangName}",
  "mediaType": "${mediaType}",
  "estimatedStudyTime": "5-10 mins",
  "transcription": "Full extracted or transcribed text",
  "sentences": [
    {
      "id": 1,
      "original": "Original sentence in ${targetLangName}",
      "phonetic": "Phonetic reading / Romaji / Pinyin",
      "translation": "English translation",
      "grammarNotes": "Grammar and tone breakdown for this line",
      "tokens": [
        {
          "word": "word as seen in text",
          "lemma": "root dictionary form",
          "pos": "Noun | Verb | Adjective | Pronoun | Particle | Adverb",
          "phonetic": "phonetic reading",
          "meaning": "English meaning",
          "note": "Contextual tip or nuance note"
        }
      ]
    }
  ],
  "vocabularyList": [
    {
      "term": "Vocabulary word",
      "reading": "Reading / phonetic",
      "pos": "Part of speech",
      "meaning": "Definition in English",
      "example": "Example sentence in ${targetLangName}",
      "exampleTrans": "Translation of example",
      "difficulty": "A1 | A2 | B1 | B2"
    }
  ],
  "grammarPoints": [
    {
      "pattern": "Formula pattern (e.g. S + Có + V + Không?)",
      "explanation": "Clear explanation of the rule",
      "example": "Example sentence with translation",
      "romanceContext": "How to use this when texting or flirting"
    }
  ],
  "culturalInsights": [
    "Insightful note about culture, social hierarchy, slang, or etiquette present in the media"
  ],
  "quizzes": [
    {
      "type": "multiple_choice",
      "question": "Question text based on the media",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    },
    {
      "type": "sentence_scramble",
      "prompt": "Reconstruct this key sentence from the media:",
      "targetSentence": "Full target sentence",
      "translation": "English translation",
      "scrambledWords": ["word3", "word1", "word4", "word2"],
      "correctWords": ["word1", "word2", "word3", "word4"]
    },
    {
      "type": "cloze_fill",
      "sentenceWithBlank": "Sentence with ___ in place of blank",
      "blankWord": "the missing word",
      "options": ["word1", "word2", "word3", "word4"],
      "correctIndex": 0,
      "explanation": "Why this word fits"
    },
    {
      "type": "roleplay_reply",
      "partner": "ado" or "kou" or "ren",
      "partnerName": "Ado" or "Kou" or "Ren",
      "partnerDialogue": "Character's question in ${targetLangName}",
      "partnerTrans": "English translation of character's dialogue",
      "options": [
        {
          "text": "Your reply option 1 in ${targetLangName}",
          "trans": "English translation",
          "feedback": "Character's warm reaction to this reply"
        },
        {
          "text": "Your reply option 2 in ${targetLangName}",
          "trans": "English translation",
          "feedback": "Character's playful reaction to this reply"
        }
      ],
      "correctIndex": 0
    }
  ]
}`;

        const contentsPayload: any[] = [];

        // Check if there is base64 media (image or audio)
        if (mediaBase64 && mimeType) {
          const cleanBase64 = mediaBase64.replace(/^data:.*?;base64,/, "");
          contentsPayload.push({
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          });
        }

        let userPrompt = `Please analyze this media for OpenKoto language learning in ${targetLangName} with focus on "${customFocus}".`;
        if (fileName) {
          userPrompt += ` File name: "${fileName}".`;
        }
        if (text && text.trim().length > 0) {
          userPrompt += `\n\nProvided Text / Transcript / Media Content:\n"""\n${text}\n"""`;
        } else if (!mediaBase64) {
          userPrompt += `\n\nGenerate an immersive romance media learning experience in ${targetLangName} around the theme: "${customFocus}".`;
        }

        contentsPayload.push({ text: userPrompt });

        let responseText: string | undefined = undefined;

        for (const modelName of FREE_GEMINI_MODELS) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: contentsPayload.length === 1 ? contentsPayload[0].text : { parts: contentsPayload },
              config: {
                systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.6,
              },
            });

            if (response && response.text) {
              responseText = response.text;
              usedModel = modelName;
              break;
            }
          } catch (e) {
            console.warn(`[OpenKoto Media AI] Failed with ${modelName}:`, (e as any)?.message);
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
        console.warn("[OpenKoto AI] Generation error:", err?.message);
      }
    }
  }

    // Smart Fallback Builder if Gemini was offline or no key
    if (!parsedData) {
      parsedData = generateFallbackMediaLesson(targetLanguage, targetLangName, text, mediaType, customFocus);
      usedModel = "fallback-openkoto-engine";
    }

    return res.status(200).json({
      success: true,
      usedModel,
      data: parsedData,
    });
  } catch (err: any) {
    console.error("[OpenKoto API Error]", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error analyzing media",
    });
  }
}

function generateFallbackMediaLesson(
  targetLanguage: string,
  targetLangName: string,
  userText: string | undefined,
  mediaType: string | undefined,
  focus: string
) {
  if (targetLanguage === "ja") {
    return {
      title: "Late-Night Cafe Dialogue (夜のカフェ)",
      summary: "A gentle conversation over warm matcha latte in a quiet Tokyo cafe. Learn natural Japanese casual forms, polite particle 'ne', and expressing sweet affections.",
      level: "Elementary (N4/A2)",
      language: "Japanese",
      mediaType: mediaType || "text",
      estimatedStudyTime: "6 mins",
      transcription: "今日は来てくれてありがとう。一緒に過ごす時間が一番好きだよ。また明日も会えるかな？",
      sentences: [
        {
          id: 1,
          original: "今日は来てくれてありがとう。",
          phonetic: "Kyou wa kite kurete arigatou.",
          translation: "Thank you for coming today.",
          grammarNotes: "'-te kurete' expresses gratitude for an action someone did for your benefit.",
          tokens: [
            { word: "今日", lemma: "今日 (kyou)", pos: "Noun", phonetic: "kyou", meaning: "today", note: "Time indicator" },
            { word: "は", lemma: "は (wa)", pos: "Particle", phonetic: "wa", meaning: "topic marker", note: "Marks 'today' as topic" },
            { word: "来てくれて", lemma: "来る (kuru)", pos: "Verb + Helper", phonetic: "kite kurete", meaning: "coming for me", note: "te-form + kureru" },
            { word: "ありがとう", lemma: "ありがとう (arigatou)", pos: "Phrase", phonetic: "arigatou", meaning: "thank you", note: "Warm gratitude" }
          ]
        },
        {
          id: 2,
          original: "一緒に過ごす時間が一番好きだよ。",
          phonetic: "Issho ni sugosu jikan ga ichiban suki da yo.",
          translation: "The time I spend together with you is what I love the most.",
          grammarNotes: "'Ichiban suki' means favorite / love most; 'da yo' adds friendly romantic conviction.",
          tokens: [
            { word: "一緒に", lemma: "一緒 (issho)", pos: "Adverb", phonetic: "issho ni", meaning: "together", note: "With each other" },
            { word: "過ごす", lemma: "過ごす (sugosu)", pos: "Verb", phonetic: "sugosu", meaning: "to spend (time)", note: "Dictionary form" },
            { word: "時間", lemma: "時間 (jikan)", pos: "Noun", phonetic: "jikan", meaning: "time", note: "Noun modified by verb" },
            { word: "一番", lemma: "一番 (ichiban)", pos: "Adverb", phonetic: "ichiban", meaning: "most / number one", note: "Superlative" },
            { word: "好きだよ", lemma: "好き (suki)", pos: "Na-Adj + Particle", phonetic: "suki da yo", meaning: "like / love (assertive)", note: "Affectionate expression" }
          ]
        },
        {
          id: 3,
          original: "また明日も会えるかな？",
          phonetic: "Mata ashita mo aeru kana?",
          translation: "I wonder if we can meet again tomorrow too?",
          grammarNotes: "'-eru' is potential form of 'au' (to meet); 'kana' expresses a gentle, hopeful wondering tone.",
          tokens: [
            { word: "また", lemma: "また (mata)", pos: "Adverb", phonetic: "mata", meaning: "again", note: "Recurrence" },
            { word: "明日", lemma: "明日 (ashita)", pos: "Noun", phonetic: "ashita", meaning: "tomorrow", note: "Next day" },
            { word: "も", lemma: "も (mo)", pos: "Particle", phonetic: "mo", meaning: "also / too", note: "Inclusion particle" },
            { word: "会えるかな", lemma: "会う (au)", pos: "Verb + Particle", phonetic: "aeru kana", meaning: "can meet, I wonder?", note: "Potential + wonder particle" }
          ]
        }
      ],
      vocabularyList: [
        { term: "一緒に (いっしょに)", reading: "issho ni", pos: "Adverb", meaning: "Together with someone", example: "一緒に帰ろう。 (Let's go home together.)", exampleTrans: "Let's head home together.", difficulty: "N5" },
        { term: "過ごす (すごす)", reading: "sugosu", pos: "Verb", meaning: "To spend or pass time", example: "素敵な時間を過ごした。 (Spent wonderful time.)", exampleTrans: "We spent wonderful time together.", difficulty: "N4" },
        { term: "一番 (いちばん)", reading: "ichiban", pos: "Adverb", meaning: "The most / best / number one", example: "君が一番大切だよ。 (You're my most precious one.)", exampleTrans: "You are the most precious to me.", difficulty: "N5" },
        { term: "会える (あえる)", reading: "aeru", pos: "Verb (Potential)", meaning: "Can meet / able to see each other", example: "早く会いたいな。 (I want to see you soon.)", exampleTrans: "I want to see you soon.", difficulty: "N4" }
      ],
      grammarPoints: [
        { pattern: "[Verb Te-form] + くれてありがとう", explanation: "Expresses sincere gratitude for a kind favor or gesture someone did for you.", example: "待っててくれてありがとう。 (Thank you for waiting for me.)", romanceContext: "Very charming when your date waited for you or bought you a drink." },
        { pattern: "[Noun] + が一番好き (ga ichiban suki)", explanation: "Identifies the thing or person you love the most above all others.", example: "君の笑顔が一番好き。 (I love your smile the most.)", romanceContext: "A direct, heart-fluttering compliment in Japanese." }
      ],
      culturalInsights: [
        "In Japanese dating culture, using gentle endings like 'kana?' (I wonder?) sounds cute and considerate rather than pushy.",
        "Notice the omission of explicit 'you' (anata); Japanese lovers prefer natural contextual pronouns or partner names."
      ],
      quizzes: [
        {
          type: "multiple_choice",
          question: "What is the speaker asking in sentence 3 ('また明日も会えるかな？')?",
          options: ["Asking for directions to the station", "Hoping to meet again tomorrow", "Asking what time it is", "Saying they are tired"],
          correctIndex: 1,
          explanation: "'Mata ashita mo aeru kana' translates to 'I wonder if we can meet again tomorrow too?'"
        },
        {
          type: "sentence_scramble",
          prompt: "Reconstruct the romantic sentence:",
          targetSentence: "一緒に過ごす時間が一番好きだよ",
          translation: "The time spent together is what I love the most",
          scrambledWords: ["一番", "一緒に", "好きだよ", "過ごす", "時間が"],
          correctWords: ["一緒に", "過ごす", "時間が", "一番", "好きだよ"]
        },
        {
          type: "cloze_fill",
          sentenceWithBlank: "今日は来てくれて___。",
          blankWord: "ありがとう",
          options: ["ありがとう", "さようなら", "ごめんなさい", "いただきます"],
          correctIndex: 0,
          explanation: "'arigatou' completes the expression of gratitude for coming."
        },
        {
          type: "roleplay_reply",
          partner: "ren",
          partnerName: "Ren Takahashi",
          partnerDialogue: "また明日も会えるかな？それとも俺のこと焦らしたい？",
          partnerTrans: "Can we meet again tomorrow? Or do you want to keep me waiting?",
          options: [
            { text: "明日も絶対に会いたいです！", trans: "I definitely want to see you tomorrow too!", feedback: "Ren smirks with satisfaction: 'Ngoan lắm. Mai anh qua đón nhóc sớm nhé.'" },
            { text: "Để xem anh Ren có ngoan không đã.", trans: "Let me see if you behave nicely first.", feedback: "Ren chuckles warmly: 'Haha dám trêu anh à? Được rồi, mai em sẽ biết.'" }
          ],
          correctIndex: 0
        }
      ]
    };
  }

  // Default Vietnamese Media Lesson
  return {
    title: userText && userText.length > 5 ? "Phân Tích Ngôn Ngữ Tự Nhiên (Media Breakdown)" : "Lãng Mạn Phố Cổ & Trà Sữa (Old Quarter Date)",
    summary: "An authentic, romantic conversation between two people sharing sweet feelings on an evening stroll in Hanoi. Master natural pronouns, sweet affectionate particles, and sentence rhythm.",
    level: "Beginner / Elementary (A1-A2)",
    language: "Vietnamese",
    mediaType: mediaType || "text",
    estimatedStudyTime: "5 mins",
    transcription: userText || "Hôm nay đi dạo với em vui thật đấy. Lần sau chúng mình lại cùng đi uống trà sữa nữa nhé!",
    sentences: [
      {
        id: 1,
        original: "Hôm nay đi dạo với em vui thật đấy.",
        phonetic: "Hom nay di dao voi em vui that day.",
        translation: "Taking a walk with you today was truly enjoyable.",
        grammarNotes: "'Vui thật đấy' uses the emotive particle 'đấy' to emphasize genuine happiness.",
        tokens: [
          { word: "Hôm nay", lemma: "hôm nay", pos: "Noun (Time)", phonetic: "hom nay", meaning: "today", note: "Time adverbial" },
          { word: "đi dạo", lemma: "đi dạo", pos: "Verb", phonetic: "di dao", meaning: "to take a stroll / walk", note: "Relaxed leisure activity" },
          { word: "với", lemma: "với", pos: "Preposition", phonetic: "voi", meaning: "with / together with", note: "Connecting companion" },
          { word: "em", lemma: "em", pos: "Pronoun", phonetic: "ehm", meaning: "you (sweetheart/younger)", note: "Intimate affectionate term" },
          { word: "vui", lemma: "vui", pos: "Adjective", phonetic: "vooy", meaning: "fun / joyful / happy", note: "Positive emotion" },
          { word: "thật đấy", lemma: "thật", pos: "Adverb + Particle", phonetic: "that day", meaning: "truly / genuinely so", note: "Expressive confirmation" }
        ]
      },
      {
        id: 2,
        original: "Lần sau chúng mình lại cùng đi uống trà sữa nữa nhé!",
        phonetic: "Lan sau chung minh lai cung di uong tra sua nua nhe!",
        translation: "Next time let's go drink bubble tea together again, okay!",
        grammarNotes: "'Chúng mình' is the inclusive affectionate 'we'; 'nhé' is a friendly invitation tag.",
        tokens: [
          { word: "Lần sau", lemma: "lần sau", pos: "Noun (Time)", phonetic: "lan sau", meaning: "next time", note: "Future promise" },
          { word: "chúng mình", lemma: "chúng mình", pos: "Pronoun", phonetic: "choong ming", meaning: "we / the two of us", note: "Sweet couple pronoun" },
          { word: "lại", lemma: "lại", pos: "Adverb", phonetic: "lai", meaning: "again / once more", note: "Repetition of happy event" },
          { word: "cùng", lemma: "cùng", pos: "Adverb", phonetic: "coong", meaning: "together", note: "Shared action" },
          { word: "đi uống", lemma: "đi uống", pos: "Verb Phrase", phonetic: "di uong", meaning: "go drink", note: "Social hangout" },
          { word: "trà sữa", lemma: "trà sữa", pos: "Noun", phonetic: "tra sua", meaning: "bubble milk tea", note: "Youth favorite beverage" },
          { word: "nữa nhé", lemma: "nhé", pos: "Particle", phonetic: "nua nhe", meaning: "more, okay?", note: "Cute invitation tag" }
        ]
      }
    ],
    vocabularyList: [
      { term: "đi dạo", reading: "đi dạo (di dao)", pos: "Verb", meaning: "To take a walk / stroll leisurely", example: "Tối nay mình đi dạo hồ Tây nhé.", exampleTrans: "Let's take a stroll around West Lake tonight.", difficulty: "A1" },
      { term: "chúng mình", reading: "chúng mình", pos: "Pronoun", meaning: "We / the two of us (intimate & sweet)", example: "Chúng mình hợp nhau thật đấy.", exampleTrans: "The two of us really match well.", difficulty: "A1" },
      { term: "thật đấy", reading: "thật đấy", pos: "Particle Phrase", meaning: "Truly / for real (emotive emphasis)", example: "Cậu dễ thương thật đấy!", exampleTrans: "You are truly so cute!", difficulty: "A2" },
      { term: "trà sữa", reading: "trà sữa", pos: "Noun", meaning: "Boba milk tea", example: "Em thích trà sữa trân châu đường đen.", exampleTrans: "I love brown sugar boba milk tea.", difficulty: "A1" }
    ],
    grammarPoints: [
      { pattern: "[Chủ ngữ] + Vui + Thật đấy!", explanation: "Used to express heartfelt satisfaction and delight after spending memorable time with someone.", example: "Gặp anh vui thật đấy! (Meeting you was truly wonderful!)", romanceContext: "The perfect text to send right after saying goodbye at the end of a date." },
      { pattern: "Lần sau + [Đại từ] + lại + [Hành động] + nhé!", explanation: "Gentle promise and invitation to repeat a lovely experience in the near future.", example: "Lần sau mình lại đi xem phim nhé! (Next time let's go watch a movie again, okay!)", romanceContext: "Secures your next date naturally without feeling overly formal." }
    ],
    culturalInsights: [
      "In Vietnamese dating, 'đi uống trà sữa' (drinking boba) is the iconic casual hangout activity for young couples.",
      "The particle 'nhé' softens requests into affectionate invitations, creating an inviting warmth."
    ],
    quizzes: [
      {
        type: "multiple_choice",
        question: "What does the speaker propose for next time in sentence 2?",
        options: ["Going to study for exams", "Drinking bubble milk tea together", "Buying a new motorcycle", "Going to sleep early"],
        correctIndex: 1,
        explanation: "'Đi uống trà sữa nữa nhé' means 'Let's go drink bubble tea together again, okay!'"
      },
      {
        type: "sentence_scramble",
        prompt: "Reconstruct this heartfelt date review:",
        targetSentence: "Hôm nay đi dạo với em vui thật đấy",
        translation: "Taking a walk with you today was truly enjoyable",
        scrambledWords: ["thật đấy", "với em", "Hôm nay", "đi dạo", "vui"],
        correctWords: ["Hôm nay", "đi dạo", "với em", "vui", "thật đấy"]
      },
      {
        type: "cloze_fill",
        sentenceWithBlank: "Lần sau chúng mình lại cùng đi uống ___ nữa nhé!",
        blankWord: "trà sữa",
        options: ["trà sữa", "nước mắm", "dầu ăn", "thuốc lá"],
        correctIndex: 0,
        explanation: "'trà sữa' (milk tea) is the romantic and delicious hangout drink mentioned."
      },
      {
        type: "roleplay_reply",
        partner: "kou",
        partnerName: "Kou",
        partnerDialogue: "Chị ơi, lần sau đi uống trà sữa với Kou nhé? Kou khao chị nha!",
        partnerTrans: "Big sis, next time let's drink bubble tea with Kou okay? It's my treat!",
        options: [
          { text: "Được chứ, Kou nhớ giữ lời nhé!", trans: "Of course, Kou remember to keep your promise!", feedback: "Kou eyes sparkle with joy: 'Dạ vâng ạ! Kou sẽ chọn quán ngon nhất cho chị luôn!'" },
          { text: "Kou đáng yêu thế này sao từ chối được.", trans: "How could I refuse when Kou is so cute.", feedback: "Kou blushes and giggles happily: 'Chị làm Kou ngại quá nè... Hì hì.'" }
        ],
        correctIndex: 0
      }
    ]
  };
}
