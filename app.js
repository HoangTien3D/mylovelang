/**
 * Otome Lingua - App Logic Engine
 * Duolingo competitor disguised as Mystic Messenger Otome Sim
 * Features 10-Tier progression, Gemma 4 OpenRouter LLM, Contextual Sentence Builder,
 * Free Text Chat, Convex Sync & Telemetry Dashboard
 */

import { inject } from "@vercel/analytics";

// Initialize Vercel Analytics
try {
  inject();
} catch (e) {
  console.log("Vercel Analytics initialized", e);
}

// Global Configuration
const CONVEX_HTTP_SITE = "https://wary-reindeer-174.convex.site";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

// PASTE YOUR OPENROUTER API KEY HERE IF YOU WANT IT HARDCODED IN CODE:
// Example: const HARDCODED_OPENROUTER_API_KEY = "sk-or-v1-1234567890abcdef...";
const HARDCODED_OPENROUTER_API_KEY = "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";

///// Character Definitions & Clean SVG Avatars
function svgDataUrl(svgString) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString.trim());
}

const SVG_AVATARS = {
  bao: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gBao" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#059669"/>
        <stop offset="100%" stop-color="#10b981"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gBao)"/>
    <path d="M50 15 c-16 0 -26 12 -26 26 c0 11 6 18 14 22 c-18 6 -26 18 -26 35 h76 c0 -17 -8 -29 -26 -35 c18 -4 14 -11 14 -22 c0 -14 -10 -26 -26 -26 z" fill="#ffffff" opacity="0.95"/>
    <circle cx="50" cy="40" r="15" fill="#d1fae5"/>
    <path d="M30 30 q20 -10 40 0 q-18 24 -40 0" fill="#064e3b"/>
    <circle cx="42" cy="41" r="2.5" fill="#064e3b"/>
    <circle cx="58" cy="41" r="2.5" fill="#064e3b"/>
    <path d="M45 49 q5 5 10 0" stroke="#064e3b" stroke-width="2" fill="none"/>
  </svg>`),

  julian: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gJul" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#b91c1c"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gJul)"/>
    <path d="M50 15 c-16 0 -26 12 -26 26 c0 11 6 18 14 22 c-18 6 -26 18 -26 35 h76 c0 -17 -8 -29 -26 -35 c18 -4 14 -11 14 -22 c0 -14 -10 -26 -26 -26 z" fill="#ffffff" opacity="0.95"/>
    <circle cx="50" cy="40" r="15" fill="#fef3c7"/>
    <path d="M31 30 q18 -12 34 0 q-6 24 -38 0" fill="#78350f"/>
    <circle cx="42" cy="41" r="2.5" fill="#78350f"/>
    <circle cx="58" cy="41" r="2.5" fill="#78350f"/>
    <path d="M46 49 q4 3 8 0" stroke="#78350f" stroke-width="2" fill="none"/>
  </svg>`),

  ren: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gRen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4c1d95"/>
        <stop offset="100%" stop-color="#e11d48"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gRen)"/>
    <path d="M50 15 c-16 0 -26 12 -26 26 c0 11 6 18 14 22 c-18 6 -26 18 -26 35 h76 c0 -17 -8 -29 -26 -35 c18 -4 14 -11 14 -22 c0 -14 -10 -26 -26 -26 z" fill="#ffffff" opacity="0.95"/>
    <circle cx="50" cy="40" r="15" fill="#fce7f3"/>
    <path d="M28 28 q15 -14 44 0 q-10 26 -44 0" fill="#1e1b4b"/>
    <circle cx="42" cy="41" r="2.5" fill="#1e1b4b"/>
    <circle cx="58" cy="41" r="2.5" fill="#1e1b4b"/>
    <path d="M46 48 q4 3 8 0" stroke="#1e1b4b" stroke-width="2" fill="none"/>
  </svg>`),

  group: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gGrp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#059669"/>
        <stop offset="50%" stop-color="#d90057"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gGrp)"/>
    <circle cx="35" cy="40" r="14" fill="#ffffff" opacity="0.9"/>
    <circle cx="65" cy="40" r="14" fill="#ffffff" opacity="0.9"/>
    <circle cx="50" cy="38" r="16" fill="#ffffff"/>
    <path d="M25 75 c0 -12 6 -18 15 -20 c2 -8 18 -8 20 0 c9 2 15 8 15 20 z" fill="#ffffff" opacity="0.85"/>
  </svg>`)
};

const BASE_CHARACTERS = {
  bao: {
    id: "bao",
    name: "Bao Nguyen",
    avatar: SVG_AVATARS.bao,
    role: "Artisan Chef & Barista",
    personality: "Laid-back, nonchalant barista. Starts cool and casual, but gets intrigued as you chat.",
    sampleVoice: "Warm energetic baritone",
    greetings: {
      vi: {
        text: "Chào em. Em muốn gọi món gì không? ☕",
        translation: "Hello. Would you like to order anything?",
        tip: "'Chào em' is 'Hello'. 'Em muốn gọi món gì không?' is a polite cafe greeting in Vietnamese."
      },
      en: {
        text: "Hey there! Can I brew a fresh artisan coffee or tea for you today? ☕",
        translation: "Hey there! Can I brew a fresh artisan coffee or tea for you today?",
        tip: "'Hey there' is a friendly coffee shop greeting in English."
      },
      ja: {
        text: "こんにちは。美味しいベトナムコーヒーかお茶はいかがですか？ ☕",
        romaji: "Konnichiwa. Oishii Vietnam koohi1 ka ocha wa ikaga desu ka?",
        translation: "Hello. Would you like some delicious Vietnamese coffee or tea?",
        tip: "'Konnichiwa' is 'Hello'. '-ikaga desu ka?' is a polite offer in Japanese."
      }
    }
  },
  julian: {
    id: "julian",
    name: "Julian Vance",
    avatar: SVG_AVATARS.julian,
    role: "Literature Scholar & Architect",
    personality: "Composed, intellectual scholar. Starts reserved, but gets charmed as you chat.",
    sampleVoice: "Refined British scholar",
    greetings: {
      vi: {
        text: "Chào em. Hôm nay em có muốn cùng anh đọc sách hay trò chuyện không? 📚",
        translation: "Hello. Do you want to read books or chat with me today?",
        tip: "'Cùng anh' is 'together with me' in Vietnamese."
      },
      en: {
        text: "Good day. Shall we discuss literature or share a quiet conversation today? 📚",
        translation: "Good day. Shall we discuss literature or share a quiet conversation today?",
        tip: "'Good day' is a formal, polite greeting in English."
      },
      ja: {
        text: "こんにちは。今日は一緒に本を読んだり、お話ししませんか？ 📚",
        romaji: "Konnichiwa. Kyou wa issho ni hon wo yondari, o-hanashi shimasen ka?",
        translation: "Hello. Shall we read books or chat together today?",
        tip: "'Issho ni' means 'together' in Japanese."
      }
    }
  },
  ren: {
    id: "ren",
    name: "Ren Takahashi (高橋 蓮)",
    avatar: SVG_AVATARS.ren,
    role: "Manga Illustrator & Tea Master",
    personality: "Tsundere artistic soul. Acts cool and aloof, but gets soft and blushes when you text him.",
    sampleVoice: "Cool soft-spoken Tokyo accent",
    greetings: {
      vi: {
        text: "Chào em... Anh vừa pha trà nóng, em có muốn ngồi xuống uống cùng anh không? 🍵",
        translation: "Hello... I just brewed hot tea, would you like to sit and drink with me?",
        tip: "'Vừa pha trà' means 'just brewed tea' in Vietnamese."
      },
      en: {
        text: "Hello... I just brewed a fresh pot of green tea. Care to join me? 🍵",
        translation: "Hello... I just brewed a fresh pot of green tea. Care to join me?",
        tip: "'Care to join me?' is a polite invitation in English."
      },
      ja: {
        text: "こんにちは。何か用ですか？お茶でも淹れましょうか… 🍵",
        romaji: "Konnichiwa. Nanika you desu ka? O-cha demo iremashou ka...",
        translation: "Hello. Do you need something? Shall I brew us some tea...",
        tip: "'Nanika you desu ka?' is a cool, reserved inquiry in Japanese."
      }
    }
  },
  group: {
    id: "group",
    name: "Global Otome Lounge 💬",
    isGroup: true,
    avatar: SVG_AVATARS.group,
    role: "Bao, Julian & Ren",
    personality: "Playful multi-way romantic rivalry & language lounge! All three love interests compete for your affection while teaching you phrases in your selected language!",
    sampleVoice: "Multilingual trio harmony",
    greetings: {
      vi: {
        text: "Chào em! Bao, Julian và Ren đang ở sảnh chờ nhắn tin cùng em đó! 💬",
        translation: "Hello! Bao, Julian, and Ren are in the lounge waiting to text you!",
        tip: "Chat with all 3 love interests in Vietnamese!"
      },
      en: {
        text: "Welcome! Bao, Julian, and Ren are waiting to chat with you in English! 💬",
        translation: "Welcome! Bao, Julian, and Ren are waiting to chat with you in English!",
        tip: "Chat with all 3 love interests in English!"
      },
      ja: {
        text: "ようこそ！バオ、ジュリアン、蓮の3人がラウンジで待っていますよ！ 💬",
        romaji: "Youkoso! Bao, Jurian, Ren no 3-nin ga raunji de matte imasu yo!",
        translation: "Welcome! Bao, Julian, and Ren are waiting in the lounge!",
        tip: "Chat with all 3 love interests in Japanese!"
      }
    }
  }
};

function getCharacter(charId) {
  const targetLang = (typeof userState !== "undefined" && userState.targetLanguage) ? userState.targetLanguage : "vi";
  const base = BASE_CHARACTERS[charId] || BASE_CHARACTERS.bao;
  const greetingObj = base.greetings[targetLang] || base.greetings.vi;

  let flag = "🇻🇳";
  let langLabel = "Vietnamese";
  if (targetLang === "en") {
    flag = "🇬🇧";
    langLabel = "English";
  } else if (targetLang === "ja") {
    flag = "🇯🇵";
    langLabel = "Japanese";
  }

  return {
    id: base.id,
    name: base.name,
    isGroup: !!base.isGroup,
    language: langLabel,
    flag: flag,
    avatar: base.avatar,
    role: base.role,
    personality: base.personality,
    greeting: greetingObj.text,
    romaji: greetingObj.romaji || null,
    greetingTranslation: greetingObj.translation,
    greetingTip: greetingObj.tip,
    sampleVoice: base.sampleVoice,
  };
}

const CHARACTERS = new Proxy({}, {
  get(target, prop) {
    if (typeof prop === "symbol" || prop === "inspect" || prop === "toJSON") return undefined;
    if (BASE_CHARACTERS[prop]) {
      return getCharacter(prop);
    }
    return undefined;
  },
  ownKeys() {
    return Object.keys(BASE_CHARACTERS);
  },
  getOwnPropertyDescriptor(target, prop) {
    if (BASE_CHARACTERS[prop]) {
      return {
        enumerable: true,
        configurable: true,
        value: getCharacter(prop)
      };
    }
    return undefined;
  }
});

// 10-Tier Difficulty Progression System
const TIERS = [
  { level: 1, name: "Tier 1: Greetings & Warm-up", mode: "wordbank", heartsPerAns: 10, desc: "Build greetings with Contextual Sentence Builder." },
  { level: 2, name: "Tier 2: First Impressions", mode: "wordbank", heartsPerAns: 12, desc: "Express preferences with Contextual Sentence Builder." },
  { level: 3, name: "Tier 3: Coffee Date", mode: "wordbank", heartsPerAns: 15, desc: "Order drinks & express gratitude with Word Bank." },
  { level: 4, name: "Tier 4: Word Builder", mode: "wordbank", heartsPerAns: 18, desc: "Build 4–6 word conversational sentences." },
  { level: 5, name: "Tier 5: Daily Routines", mode: "wordbank", heartsPerAns: 20, desc: "Express schedules & feelings in target language." },
  { level: 6, name: "Tier 6: Flirting & Compliments", mode: "free", heartsPerAns: 22, desc: "Craft romantic compliments with Free Text Chat." },
  { level: 7, name: "Tier 7: Heart-to-Heart", mode: "free", heartsPerAns: 25, desc: "Deeper personal conversations in Free Text Chat." },
  { level: 8, name: "Tier 8: Advanced Romance", mode: "free", heartsPerAns: 30, desc: "Free-form text input evaluated by Gemma 4 AI." },
  { level: 9, name: "Tier 9: Poetic Fluency", mode: "free", heartsPerAns: 35, desc: "Metaphors, romantic idioms & emotional nuances." },
  { level: 10, name: "Tier 10: Soulmate Mastery", mode: "free", heartsPerAns: 50, desc: "Full immersion, natural speed & romantic soulmate bond." }
];

// UI Language Dictionary (English & Vietnamese)
const UI_STRINGS = {
  en: {
    chatsTitle: "Messenger Chats",
    chatsSubtitle: "Select a Love Interest to start learning & chatting",
    charactersTitle: "Love Interests",
    charactersSubtitle: "Personality profiles, relationship levels & affection stats",
    guidebookTitle: "Language Guidebook",
    guidebookSubtitle: "Special letters, typing rules, word forms & romance vocabulary",
    settingsTitle: "App Settings",
    settingsSubtitle: "Customize theme, language preferences & story progress",
    apiKeyLabel: "🔑 Gemini API Key",
    keyActive: "Key Active",
    keyRequired: "⚠️ Key Required",
    saveKeyBtn: "Save API Key",
    resetLabel: "🔄 Reset Story & Chat Progress",
    resetDesc: "Wipe all chat histories, reset affection levels back to initial nonchalant states, and restart story choices for a fresh experience.",
    resetBtn: "Reset All Story Progress & Replay",
    resetSuccess: "✓ All story progress and chat histories have been reset!",
    tabChats: "Chats",
    tabLIs: "LIs",
    tabGuidebook: "Guidebook",
    tabSettings: "Settings",
    sentenceBuilderTab: "🧩 Sentence Builder",
    freeTextTab: "💬 Free Text Chat",
    sendSentenceBtn: "Send Built Sentence ❤️",
    freeInputPlaceholder: "Type custom message in target language...",
    selectLevelLabel: "Select Level:",
    wordBankPlaceholder: "Click word chips below to build your sentence...",
    chatWith: "Chat with",
    affectionLevel: "Affection Level",
    currentTier: "Current Tier:",
    playTier: "Play Tier",
  },
  vi: {
    chatsTitle: "Đoạn Chat Messenger",
    chatsSubtitle: "Chọn một nhân vật để bắt đầu học và trò chuyện",
    charactersTitle: "Các Nhân Vật Nam",
    charactersSubtitle: "Hồ sơ cá tính, mức độ mối quan hệ & chỉ số tình cảm",
    guidebookTitle: "Cẩm Nang Ngôn Ngữ",
    guidebookSubtitle: "Chữ cái đặc biệt, quy tắc gõ, dạng từ & từ vựng tình cảm",
    settingsTitle: "Cài Đặt Ứng Dụng",
    settingsSubtitle: "Tùy chỉnh giao diện, ngôn ngữ & tiến trình câu chuyện",
    apiKeyLabel: "🔑 Mã Khóa Gemini API Key",
    keyActive: "Đã Hoạt Động",
    keyRequired: "⚠️ Cần Mã Khóa",
    saveKeyBtn: "Lưu API Key",
    resetLabel: "🔄 Đặt Lại Câu Chuyện & Lịch Sử Chat",
    resetDesc: "Xóa toàn bộ lịch sử trò chuyện, đưa độ thiện cảm về ban đầu để trải nghiệm lại từ đầu.",
    resetBtn: "Đặt Lại Tiến Trình & Chơi Lại",
    resetSuccess: "✓ Đã đặt lại toàn bộ tiến trình và lịch sử chat!",
    tabChats: "Trò chuyện",
    tabLIs: "Nhân vật",
    tabGuidebook: "Cẩm Nang",
    tabSettings: "Cài đặt",
    sentenceBuilderTab: "🧩 Ghép Câu",
    freeTextTab: "💬 Nhắn Tự Do",
    sendSentenceBtn: "Gửi Câu Đã Ghép ❤️",
    freeInputPlaceholder: "Nhập tin nhắn bằng ngoại ngữ...",
    selectLevelLabel: "Chọn Cấp Độ:",
    wordBankPlaceholder: "Nhấn các thẻ từ bên dưới để ghép câu...",
    chatWith: "Nhắn với",
    affectionLevel: "Mức Độ Thiện Cảm",
    currentTier: "Cấp độ hiện tại:",
    playTier: "Chơi Cấp Độ",
  }
};

// Natural Glitch & Recovery Messages for Friendly Error Handling
const ERROR_GLITCH_MESSAGES = {
  bao: [
    "Chờ anh một xíu nha, điện thoại anh đang bị giật 📱",
    "Ơ tự nhiên mất mạng xíu, chờ anh sửa lại nhé! 📶",
    "Đợi anh tí, máy bị đơ đơ tí xíu...",
    "Ủa điện thoại anh vừa lag, một xíu nha..."
  ],
  julian: [
    "Hold on a second, my phone is glitching... lemme fix it 📱",
    "Wait a sec, my signal dropped for a moment! 📶",
    "Oops, my app just crashed, fixing it real quick...",
    "Hold on, my wifi is acting up! One sec..."
  ],
  ren: [
    "あ、すみません！携帯の調子が一瞬悪くなりました 📱",
    "電波が途切れてしまいました… 少々お待ちください 📶",
    "アプリが固まってしまいました、すぐ修正します…"
  ],
  minjun: [
    "잠시만요! 휴대폰 신호가 잠시 끊겼어요 📱",
    "아, 지연이 되었네요! 금방 고칠게요 📶",
    "앱이 잠시 멈췄어요, 조금만 기다려주세요!"
  ],
  chen: [
    "抱歉，网络信号有些不佳，请稍等片刻 📱",
    "抱歉，刚才消息卡顿了一下，我正在处理 📶",
    "请稍微等我一下，马上就好..."
  ],
  group: [
    "Wait, my phone is lagging! Is everyone else frozen too?",
    "Glitching for a moment! Give us just a second, MC."
  ]
};

const ERROR_RECOVERY_MESSAGES = {
  bao: [
    "Được rồi nè! Em mới nói gì đó?",
    "Rồi nè em ơi! Hồi nãy em nói gì dở dang ta?",
    "Anh quay lại rồi đây! Em nhắn lại cho anh với?",
    "Ngon lành rồi! Mình nói tới đâu rồi em nhỉ?"
  ],
  julian: [
    "Okay fixed! What were you saying?",
    "Ah there we go! What were we talking about?",
    "Back online! Sorry about that, what did you say?",
    "Got it back! Can you say that again?"
  ],
  ren: [
    "お待たせしました！何のお話をされていましたか？",
    "直りました！もう一度教えていただけますか？",
    "戻りました！すみません、何を仰っていましたか？"
  ],
  minjun: [
    "연결됐어요! 아까 무슨 말씀 하셨어요?",
    "이제 괜찮아요! 다시 말씀해 주시겠어요?",
    "다시 돌아왔어요! 아까 이야기 이어가요!"
  ],
  chen: [
    "恢复正常了！你刚才说道何处了？",
    "重新连上了，能否请你再说一遍？",
    "好啦！我们刚才聊到哪儿了？"
  ],
  group: [
    "Okay we are back! What were you saying, MC?",
    "All fixed now! Please continue, MC."
  ]
};

// Spontaneous LI Check-Up Messages Pool (Casual, Short, Sweet Texts per Target Language)
const SPONTANEOUS_CHECKUPS = {
  bao: {
    vi: [
      { text: "Em ơi, rảnh không? Nói chuyện với anh xíu nè ☕", translation: "Hey sweetheart, are you free? Chat with me for a bit ☕", tip: "'Rảnh không?' means 'Are you free?'" },
      { text: "Đang làm gì đấy? Tự nhiên anh nhớ em xíu.", translation: "What are you doing? I suddenly missed you a bit.", tip: "'Đang làm gì đấy?' means 'What are you doing?'" },
      { text: "Rảnh tay chưa? Nhắn anh xíu nhé!", translation: "Are your hands free yet? Text me for a bit!", tip: "'Rảnh tay' means free from work/tasks." },
      { text: "Uống cà phê không em? Anh vừa pha xong nè ☕", translation: "Want some coffee? I just finished brewing ☕", tip: "'Vừa pha xong' means 'just finished brewing'." }
    ],
    en: [
      { text: "Hey there! Are you free for a quick chat? ☕", translation: "Hey there! Are you free for a quick chat? ☕", tip: "'Are you free' is a friendly invitation." },
      { text: "What are you up to? I was just thinking of you!", translation: "What are you up to? I was just thinking of you!", tip: "'What are you up to' asks about your current activity." },
      { text: "Care for a coffee break? I just brewed a fresh pot! ☕", translation: "Care for a coffee break? I just brewed a fresh pot! ☕", tip: "'Care for' is a warm offer." }
    ],
    ja: [
      { text: "こんにちは！今少しお時間ありますか？ ☕", romaji: "Konnichiwa! Ima sukoshi o-jikan arimasu ka?", translation: "Hello! Do you have a little time right now? ☕", tip: "'O-jikan arimasu ka?' asks if you have time." },
      { text: "何していますか？ふとあなたのことを思い出しました。", romaji: "Nani shite imasu ka? Futo anata no koto wo omoidashimashita.", translation: "What are you doing? I suddenly thought of you.", tip: "'Futo' means suddenly." },
      { text: "美味しいコーヒーはいかがですか？ ☕", romaji: "Oishii koohi1 wa ikaga desu ka?", translation: "Would you like some delicious coffee? ☕", tip: "'Ikaga desu ka' means 'How about...?'" }
    ]
  },
  julian: {
    vi: [
      { text: "Chào em. Em có rảnh trò chuyện một chút không? ☕", translation: "Hello. Are you free to chat for a bit? ☕", tip: "'Trò chuyện' means to chat." },
      { text: "Anh vừa tạm dừng đọc sách để nhắn tin cho em đó.", translation: "I just paused my reading to text you.", tip: "'Tạm dừng' means paused." }
    ],
    en: [
      { text: "Hey, are you free to talk a bit? ☕", translation: "Hey, are you free to talk a bit? ☕", tip: "A casual, friendly text opening." },
      { text: "Thinking of you. How is your day going?", translation: "Thinking of you. How is your day going?", tip: "A sweet, casual check-in." },
      { text: "Taking a study break? Talk to me when you can.", translation: "Taking a study break? Talk to me when you can.", tip: "Polite encouragement for your studies." }
    ],
    ja: [
      { text: "こんにちは。今、少しお話ししませんか？ 📚", romaji: "Konnichiwa. Ima, sukoshi o-hanashi shimasen ka?", translation: "Hello. Shall we chat for a bit right now? 📚", tip: "'O-hanashi shimasen ka?' is an invitation to chat." },
      { text: "読書の合間にメッセージを送りました。お時間ありますか？ ☕", romaji: "Dokusho no aimai ni messeegi wo okurimashita. O-jikan arimasu ka?", translation: "I sent a message between reading. Do you have time? ☕", tip: "'Aimai ni' means during breaks." }
    ]
  },
  ren: {
    vi: [
      { text: "Chào em... Em có rảnh không? Anh vừa pha trà nè. 🍵", translation: "Hello... Are you free? I just brewed tea. 🍵", tip: "'Vừa pha trà' means just brewed tea." },
      { text: "Đang làm gì vậy? Tự nhiên anh muốn trò chuyện chút.", translation: "What are you doing? I suddenly want to chat a bit.", tip: "'Trò chuyện' means chatting." }
    ],
    en: [
      { text: "Hello... Are you free right now? I brewed green tea. 🍵", translation: "Hello... Are you free right now? I brewed green tea. 🍵", tip: "A quiet, gentle check-in." },
      { text: "What are you doing? I suddenly felt like talking to you.", translation: "What are you doing? I suddenly felt like talking to you.", tip: "Expressing quiet interest." }
    ],
    ja: [
      { text: "こんにちは。今、少しお時間ありますか？ 🍵", romaji: "Konnichiwa. Ima, sukoshi o-jikan arimasu ka?", translation: "Hello. Do you have a moment right now? 🍵", tip: "'O-jikan arimasu ka?' asks 'Do you have time?'" },
      { text: "ふとお顔が浮かびました。お元気ですか？", romaji: "Futo o-kao ga ukabimashita. O-genki desu ka?", translation: "Your face suddenly came to mind. How are you?", tip: "'O-genki desu ka?' means 'How are you?'" }
    ]
  },
  group: {
    vi: [
      { text: "Bao & Julian: Em ơi, rảnh vào sảnh nhắn tin cùng hai anh nè! 💬", translation: "Bao & Julian: Sweetheart, are you free to text in the lounge! 💬", tip: "Group invite in Vietnamese." }
    ],
    en: [
      { text: "Bao & Julian: Free to chat? We're waiting in the lounge for you! 💬", translation: "Bao & Julian: Free to chat? We're waiting in the lounge for you! 💬", tip: "Group invite in English." }
    ],
    ja: [
      { text: "バオ & ジュリアン: 今お話しできますか？ラウンジで待っていますよ！ 💬", romaji: "Bao & Jurian: Ima o-hanashi dekimasu ka? Raunji de matte imasu yo!", translation: "Bao & Julian: Can you chat now? We are waiting in the lounge! 💬", tip: "Group invite in Japanese." }
    ]
  }
};

// Impatient Pout & Check-Up Sequence Pool (Natural & Cute Otome Pre-written Texts per Target Language)
const UNREPLIED_SEQUENCE = {
  bao: {
    vi: [
      { text: "Em ơi, rảnh không? Anh vừa pha ly cà phê thơm lắm nè!", translation: "Hey sweetheart, are you free? I just brewed a really fragrant coffee!", tip: "'Em ơi' is a sweet form of address." },
      { text: "Đang làm gì đấy? Tự nhiên anh nhớ em xíu.", translation: "What are you doing? I suddenly missed you a bit.", tip: "'Tự nhiên' means 'suddenly/out of nowhere'." },
      { text: "Em đi đâu rồi? Sao lỡ để anh đợi lâu thế này~ ☕", translation: "Where did you go? Why leave me waiting so long like this~", tip: "'Đợi lâu' means 'wait long'." },
      { text: "Hơ! Nhắn tin mà em lờ anh luôn, anh dỗi thật đấy! 😾💔", translation: "Hmph! I texted you but you ignored me, I'm pouting for real now! 😾💔", tip: "'Anh dỗi' means 'I am pouting'." },
      { text: "...", translation: "... (Silence... Bao is pouting in quiet until you reply)", tip: "Bao is pouting because you left him on read!" }
    ],
    en: [
      { text: "Hey sweetheart, are you free? I just brewed a fresh fragrant coffee! ☕", translation: "Hey sweetheart, are you free? I brewed fresh coffee! ☕", tip: "'Sweetheart' is a warm form of address." },
      { text: "What are you up to? I suddenly missed you a bit.", translation: "What are you up to? I suddenly missed you a bit.", tip: "'Up to' asks about your current activity." },
      { text: "Where did you go? Don't leave me waiting too long~ ☕", translation: "Where did you go? Don't leave me waiting too long~ ☕", tip: "Expressing mild impatience." },
      { text: "Hmph! Leaving me on read? I'm pouting for real now! 😾💔", translation: "Hmph! Leaving me on read? I'm pouting for real now! 😾💔", tip: "'Pouting' means acting cute and upset." },
      { text: "...", translation: "... (Silence... Bao is pouting in quiet until you reply)", tip: "Bao is pouting because you left him on read!" }
    ],
    ja: [
      { text: "ねえ、今時間ある？美味しいコーヒー淹れたよ！ ☕", romaji: "Nee, ima jikan aru? Oishii koohi1 ireta yo!", translation: "Hey, do you have time? I brewed delicious coffee! ☕", tip: "'Jikan aru?' asks if you have time." },
      { text: "何してるの？ふと君に会いたくなっちゃった。", romaji: "Nani shiteru no? Futo kimi ni aitaku natchatta.", translation: "What are you doing? I suddenly wanted to see you.", tip: "'Aitaku natchatta' means came to miss seeing you." },
      { text: "どこ行っちゃったの？こんなに待たせるなんて… ☕", romaji: "Doko itchatta no? Konna ni mataseru nante...", translation: "Where did you go? Leaving me waiting like this...", tip: "'Mataseru' means keeping someone waiting." },
      { text: "もう！既読スルーするなんて、いじけちゃうよ！ 😾💔", romaji: "Mou! Kidoku suruu suru nante, ijikechau yo!", translation: "Geez! Leaving me on read, I'm gonna pout! 😾💔", tip: "'Kidoku suruu' means leaving on read." },
      { text: "...", translation: "... (Silence... Bao is pouting in quiet until you reply)", tip: "Bao is pouting because you left him on read!" }
    ]
  },
  julian: {
    vi: [
      { text: "Chào em. Em có rảnh rỗi trò chuyện một chút không? ☕", translation: "Hello. Are you free for a brief chat? ☕", tip: "'Trò chuyện' means to chat." },
      { text: "Anh thấy mình tạm dừng đọc sách chỉ để xem em có ở đây không.", translation: "I found myself pausing my reading just to check if you were around.", tip: "'Tạm dừng' means pausing." },
      { text: "Có phải trang sách nào đó đã thu hút sự chú ý của em khỏi anh rồi? 📖", translation: "Has some book stolen your attention away from me?", tip: "'Thu hút sự chú ý' means attracting attention." },
      { text: "Để anh chờ đợi mà không hồi âm? Thật là tàn nhẫn quá đó... 😤💔", translation: "Leaving me waiting without a reply? How terribly cruel...", tip: "'Hồi âm' means reply." },
      { text: "...", translation: "... (Silence... Julian is pouting in quiet until you reply)", tip: "Julian is pouting! Message him to break the silence." }
    ],
    en: [
      { text: "Hey, are you free to talk a bit? ☕", translation: "Hey, are you free to talk a bit? ☕", tip: "A casual, friendly text opening." },
      { text: "I found myself pausing my reading just to check if you were around.", translation: "I found myself pausing my reading just to check if you were around.", tip: "'Pausing my reading' reflects taking time out for you." },
      { text: "Has a good book stolen your attention away from me? 📖", translation: "Has a good book stolen your attention away from me?", tip: "Playful romantic banter." },
      { text: "Leaving me waiting on read? How terribly cruel of a gentleman's heart... 😤💔", translation: "Leaving my message unread? How terribly cruel...", tip: "Charming expression of dismay." },
      { text: "...", translation: "... (Silence... Julian is pouting in quiet until you reply)", tip: "Julian is pouting! Message him to break the silence." }
    ],
    ja: [
      { text: "こんにちは。少しお話しする時間はありますか？ ☕", romaji: "Konnichiwa. Sukoshi o-hanashi suru jikan wa arimasu ka?", translation: "Hello. Do you have time for a short chat? ☕", tip: "'Sukoshi' means a little / a bit." },
      { text: "読書を止めて、あなたを探してしまいました。", romaji: "Dokusho wo tomete, anata wo sagashite shimaimashita.", translation: "I stopped my reading and found myself looking for you.", tip: "'Dokusho' means reading books." },
      { text: "私以外の何かに夢中になっているのですか…？ 📖", romaji: "Watashi igai no nanika ni mucchuu ni natte iru no desu ka...?", translation: "Are you absorbed in something other than me...?", tip: "'Mucchuu' means absorbed." },
      { text: "返事がないなんて… 私の心を焦らすのは罪深いですよ 😤💔", romaji: "Henji ga nai nante... Watashi no kokoro wo jirasu no wa tsumibukai desu yo", translation: "No reply... Teasing my heart like this is so cruel 😤💔", tip: "'Jirasu' means teasing." },
      { text: "...", translation: "... (Silence... Julian is pouting in quiet until you reply)", tip: "Julian is pouting! Message him to break the silence." }
    ]
  },
  ren: {
    vi: [
      { text: "Chào em... Anh vừa pha trà, em có muốn dùng thử không? 🍵", translation: "Hello... I just brewed tea, want to try some? 🍵", tip: "'Dùng thử' means try / taste." },
      { text: "Em đi đâu rồi...? Tự nhiên anh thấy hơi trống vắng.", translation: "Where did you go...? I suddenly feel a bit lonely.", tip: "'Trống vắng' means lonely." },
      { text: "Sao em không trả lời... Anh có nói gì sai không? 🍵💔", translation: "Why haven't you replied... Did I say something wrong? 🍵💔", tip: "'Trả lời' means reply." },
      { text: "...", translation: "... (Silence... Ren is quietly pouting over tea until you reply)", tip: "Ren is pouting! Text him to cheer him up." }
    ],
    en: [
      { text: "Hello... Shall I brew a pot of tea for us? 🍵", translation: "Hello... Shall I brew a pot of tea for us? 🍵", tip: "Gentle offer of tea." },
      { text: "Did you go somewhere...? I feel a bit lonely without you.", translation: "Did you go somewhere...? I feel a bit lonely without you.", tip: "'Lonely' shows he misses you." },
      { text: "No reply... Did I say something rude? 🍵💔", translation: "No reply... Did I say something rude? 🍵💔", tip: "Worrying if he upset you." },
      { text: "...", translation: "... (Silence... Ren is quietly pouting over tea until you reply)", tip: "Ren is pouting! Text him to cheer him up." }
    ],
    ja: [
      { text: "こんにちは。お茶 demo 淹れましょうか？ 🍵", romaji: "Konnichiwa. O-cha demo iremashou ka?", translation: "Hello. Shall I brew us some tea? 🍵", tip: "'O-cha' is green tea." },
      { text: "どこかへ行ってしまいましたか…？少し寂しいです。", romaji: "Dokoka he itte shimaimashita ka...? Sukoshi sabishii desu.", translation: "Did you go somewhere...? I feel a bit lonely.", tip: "'Sukoshi sabishii' means a bit lonely." },
      { text: "返事がありませんね… 私、何か失礼なことを言いましたか？ 🍵💔", romaji: "Henji ga arimasen ne... Watashi, nanika shitsurei na koto wo iimashita ka?", translation: "No reply... Did I say something rude? 🍵💔", tip: "'Henji ga arimasen' means there is no reply." },
      { text: "...", translation: "... (Silence... Ren is quietly pouting over tea until you reply)", tip: "Ren is pouting! Message him to cheer him up." }
    ]
  },
  group: {
    vi: [
      { text: "Bao & Julian: Em ơi, có rảnh vào sảnh nhắn tin cùng hai anh không? 💬", translation: "Bao & Julian: Sweetheart, are you free to text in the lounge? 💬", tip: "Group invitation." },
      { text: "Bao & Julian: Hai anh đang chờ em nè, đừng để tụi anh đợi lâu nha!", translation: "Bao & Julian: We are waiting for you, don't keep us waiting long!", tip: "Playful group waiting." },
      { text: "...", translation: "... (Silence in the lounge...)", tip: "Both love interests are waiting for your reply!" }
    ],
    en: [
      { text: "Bao & Julian: Free to chat? We're waiting in the lounge for you! 💬", translation: "Bao & Julian: Free to chat? We're waiting in the lounge for you! 💬", tip: "Group invite." },
      { text: "Bao & Julian: We're both waiting for you here, don't leave us hanging!", translation: "Bao & Julian: We're both waiting for you here, don't leave us hanging!", tip: "Playful waiting." },
      { text: "...", translation: "... (Silence in the lounge...)", tip: "Both love interests are waiting for your reply!" }
    ],
    ja: [
      { text: "バオ & ジュリアン: 今お話しできますか？ラウンジで待っていますよ！ 💬", romaji: "Bao & Jurian: Ima o-hanashi dekimasu ka? Raunji de matte imasu yo!", translation: "Bao & Julian: Can you chat now? We are waiting in the lounge! 💬", tip: "Group invite." },
      { text: "バオ & ジュリアン: 2人で待っていますよ！遅くならないでね！", romaji: "Bao & Jurian: Futari de matte imasu yo! Osoku naranaide ne!", translation: "Bao & Julian: The two of us are waiting! Don't be late!", tip: "Playful waiting." },
      { text: "...", translation: "... (Silence in the lounge...)", tip: "Both love interests are waiting for your reply!" }
    ]
  }
};

// Cooldown State Management (Short Debounce for Smooth Instant Chatting)
let lastMessageSendTimestamp = 0;
let cooldownIntervalId = null;
let isSendingMessage = false;

function checkSendCooldown() {
  if (isSendingMessage) return 1;
  const elapsed = Date.now() - lastMessageSendTimestamp;
  if (elapsed < 300) {
    return 1;
  }
  return 0;
}

function startSendCooldownTimer() {
  if (cooldownIntervalId) clearInterval(cooldownIntervalId);
  cooldownIntervalId = setInterval(() => {
    const remaining = checkSendCooldown();
    updateCooldownUI(remaining);
    if (remaining <= 0) {
      clearInterval(cooldownIntervalId);
      cooldownIntervalId = null;
    }
  }, 300);
  updateCooldownUI(checkSendCooldown());
}

function updateCooldownUI(remainingSec) {
  const submitBtn = document.getElementById("submitSentenceBtn");
  const sendFreeBtn = document.getElementById("sendFreeMsgBtn") || document.getElementById("sendFreeChatBtn");
  const freeInput = document.getElementById("freeChatInput");
  const cooldownBanner = document.getElementById("chatCooldownBanner");
  const chatControls = document.querySelector(".chat-controls");

  const lang = userState.uiLang || "en";
  const s = UI_STRINGS[lang] || UI_STRINGS.en;

  if (cooldownBanner) {
    cooldownBanner.style.display = "none";
  }

  if (chatControls) {
    chatControls.classList.remove("cooldown-active");
  }

  if (remainingSec > 0 && isSendingMessage) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
    }
    if (sendFreeBtn) {
      sendFreeBtn.disabled = true;
      sendFreeBtn.style.opacity = "0.7";
    }
  } else {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.style.cursor = "pointer";
      submitBtn.textContent = s.sendSentenceBtn || "Send Built Sentence ❤️";
    }
    if (sendFreeBtn) {
      sendFreeBtn.disabled = false;
      sendFreeBtn.style.opacity = "1";
      sendFreeBtn.style.cursor = "pointer";
      sendFreeBtn.textContent = "➤";
    }
    if (freeInput) {
      freeInput.disabled = false;
      if (freeInput.dataset.origPlaceholder) {
        freeInput.placeholder = freeInput.dataset.origPlaceholder;
      }
    }
  }
}

// Check if message is a farewell / goodbye message
function isFarewellMessage(text) {
  if (!text) return false;
  const norm = text.toLowerCase().trim();
  const farewellRegex = /\b(bye|goodbye|cya|see ya|talk to you later|g2g|gotta go|g9|good night|night|tạm biệt|gặp lại sau|hẹn gặp lại|chào anh|bye bye|ttyl|bye anh|chào nhé|cảm ơn anh)\b/i;
  return farewellRegex.test(norm);
}

// App Persistent State
let userState = {
  userId: localStorage.getItem("otome_user_id") || "user_" + Math.random().toString(36).substring(2, 9),
  targetLanguage: localStorage.getItem("otome_target_lang") || "vi",
  totalHearts: parseInt(localStorage.getItem("otome_hearts")) || 0,
  streak: parseInt(localStorage.getItem("otome_streak")) || 1,
  currentTiers: JSON.parse(localStorage.getItem("otome_tiers")) || { bao: 1, julian: 1, ren: 1, group: 1 },
  affection: JSON.parse(localStorage.getItem("otome_affection")) || { bao: 10, julian: 10, ren: 10, group: 10 },
  chatStep: JSON.parse(localStorage.getItem("otome_chat_step")) || { bao: 0, julian: 0, ren: 0, group: 0 },
  chatHistories: JSON.parse(localStorage.getItem("otome_chats")) || {},
  unreadMessages: JSON.parse(localStorage.getItem("otome_unread")) || { bao: 0, julian: 0, ren: 0, group: 0 },
  isPouting: JSON.parse(localStorage.getItem("otome_pouting")) || { bao: false, julian: false, ren: false, group: false },
  unrepliedCount: JSON.parse(localStorage.getItem("otome_unreplied_count")) || { bao: 0, julian: 0, ren: 0, group: 0 },
  saidGoodbye: JSON.parse(localStorage.getItem("otome_said_goodbye")) || { bao: false, julian: false, ren: false, group: false },
  selectedInputMode: JSON.parse(localStorage.getItem("otome_input_mode")) || {},
  showRomaji: localStorage.getItem("otome_show_romaji") !== "false",
  uiLang: localStorage.getItem("otome_ui_lang") || "en",
  userProfile: JSON.parse(localStorage.getItem("otome_user_profile")) || {
    name: localStorage.getItem("otome_user_name") || "MC",
    pronouns: localStorage.getItem("otome_user_pronouns") || "she/her",
    age: localStorage.getItem("otome_user_age") || "20",
  },
};

// Timestamps for LI messaging/impatience engine
let lastUserReplyTime = { bao: Date.now(), julian: Date.now(), ren: Date.now(), group: Date.now() };
let lastLiCheckupTime = { bao: Date.now(), julian: Date.now(), ren: Date.now(), group: Date.now() };
let lastMessageWasLi = { bao: false, julian: false, ren: false, group: false };
let nextSpontaneousDelay = {
  bao: (7 + Math.random() * 3) * 60 * 1000,
  julian: (7 + Math.random() * 3) * 60 * 1000,
  ren: (7 + Math.random() * 3) * 60 * 1000,
  group: (7 + Math.random() * 3) * 60 * 1000
};

// Runtime cache for dynamic AI generated next turn options
let dynamicWordBank = { bao: null, julian: null, ren: null, group: null };

// Save user id
localStorage.setItem("otome_user_id", userState.userId);

// Telemetry & Secret Dashboard State
let analyticsData = {
  clicks: 0,
  answersSubmitted: 0,
  startTime: Date.now(),
  timeSpentSeconds: 0,
  apiCalls: 0,
  convexSyncCount: 0,
  characterInteractions: { bao: 0, julian: 0 },
};

// Currently Active Chat Session
let activeCharacterId = null;

// User Profile Helpers
function saveUserProfile(name, pronouns, age) {
  const profile = {
    name: (name || "").trim() || "MC",
    pronouns: (pronouns || "she/her").trim(),
    age: (age || "").toString().trim() || "20",
  };
  userState.userProfile = profile;
  localStorage.setItem("otome_user_profile", JSON.stringify(profile));
  localStorage.setItem("otome_user_name", profile.name);
  localStorage.setItem("otome_user_pronouns", profile.pronouns);
  localStorage.setItem("otome_user_age", profile.age);
  localStorage.setItem("otome_profile_setup_done", "true");

  syncProfileInputsUI();
  logDashboardEvent(`👤 Profile saved: ${profile.name} (${profile.pronouns}, age ${profile.age})`);
}

function syncProfileInputsUI() {
  const profile = userState.userProfile || { name: "MC", pronouns: "she/her", age: "20" };

  const settingsName = document.getElementById("settingsUserName");
  if (settingsName) settingsName.value = profile.name === "MC" ? "" : profile.name;
  const settingsPronouns = document.getElementById("settingsUserPronouns");
  if (settingsPronouns && profile.pronouns) settingsPronouns.value = profile.pronouns;
  const settingsAge = document.getElementById("settingsUserAge");
  if (settingsAge) settingsAge.value = profile.age || "";

  const modalName = document.getElementById("modalUserName");
  if (modalName) modalName.value = profile.name === "MC" ? "" : profile.name;
  const modalPronouns = document.getElementById("modalUserPronouns");
  if (modalPronouns && profile.pronouns) modalPronouns.value = profile.pronouns;
  const modalAge = document.getElementById("modalUserAge");
  if (modalAge) modalAge.value = profile.age || "";

  const badge = document.getElementById("profileStatusBadge");
  if (badge) {
    badge.textContent = profile.name && profile.name !== "MC" ? `Saved (${profile.name})` : "Default (MC)";
  }
}

function checkAndShowUserProfileModal() {
  const setupDone = localStorage.getItem("otome_profile_setup_done");
  const modal = document.getElementById("userProfileModal");
  if (!setupDone && modal) {
    modal.style.display = "flex";
  } else if (modal) {
    modal.style.display = "none";
  }
  syncProfileInputsUI();
}

let modalSelectedTargetLang = userState.targetLanguage || "vi";

function selectModalTargetLang(lang) {
  if (!["vi", "en", "ja"].includes(lang)) lang = "vi";
  modalSelectedTargetLang = lang;
  document.getElementById("modalTargetViBtn")?.classList.toggle("active", lang === "vi");
  document.getElementById("modalTargetEnBtn")?.classList.toggle("active", lang === "en");
  document.getElementById("modalTargetJaBtn")?.classList.toggle("active", lang === "ja");
}
window.selectModalTargetLang = selectModalTargetLang;

function setAppTargetLanguage(lang) {
  if (!["vi", "en", "ja"].includes(lang)) lang = "vi";
  userState.targetLanguage = lang;
  localStorage.setItem("otome_target_lang", lang);

  updateTargetLangUI();

  currentGuidebookLang = lang;

  renderChatList();
  renderCharactersList();
  renderGuidebook();

  if (activeCharacterId && BASE_CHARACTERS[activeCharacterId]) {
    const char = CHARACTERS[activeCharacterId];
    const tierNum = userState.currentTiers[activeCharacterId] || 1;
    const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
    setupTierInputControls(tierObj, char, true);

    const romajiBtn = document.getElementById("romajiToggleBtn");
    if (romajiBtn) {
      romajiBtn.style.display = lang === "ja" ? "inline-block" : "none";
    }

    const headerName = document.getElementById("chatHeaderName");
    if (headerName) headerName.innerHTML = `${char.name} <span>${char.flag}</span>`;
  }
}
window.setAppTargetLanguage = setAppTargetLanguage;

function updateTargetLangUI() {
  const lang = userState.targetLanguage || "vi";

  document.getElementById("settingTargetViBtn")?.classList.toggle("active", lang === "vi");
  document.getElementById("settingTargetEnBtn")?.classList.toggle("active", lang === "en");
  document.getElementById("settingTargetJaBtn")?.classList.toggle("active", lang === "ja");

  document.getElementById("modalTargetViBtn")?.classList.toggle("active", lang === "vi");
  document.getElementById("modalTargetEnBtn")?.classList.toggle("active", lang === "en");
  document.getElementById("modalTargetJaBtn")?.classList.toggle("active", lang === "ja");

  const badge = document.getElementById("targetLangStatusBadge");
  if (badge) {
    if (lang === "vi") badge.textContent = "🇻🇳 Vietnamese";
    else if (lang === "en") badge.textContent = "🇬🇧 English";
    else if (lang === "ja") badge.textContent = "🇯🇵 Japanese";
  }
}

function saveUserProfileFromModal() {
  const modalName = document.getElementById("modalUserName")?.value || "";
  const modalPronouns = document.getElementById("modalUserPronouns")?.value || "she/her";
  const modalAge = document.getElementById("modalUserAge")?.value || "20";

  saveUserProfile(modalName, modalPronouns, modalAge);
  setAppTargetLanguage(modalSelectedTargetLang);

  const modal = document.getElementById("userProfileModal");
  if (modal) modal.style.display = "none";
}
window.saveUserProfileFromModal = saveUserProfileFromModal;

function handleSkipProfileModal() {
  saveUserProfile("MC", "she/her", "20");
  const modal = document.getElementById("userProfileModal");
  if (modal) modal.style.display = "none";
}
window.handleSkipProfileModal = handleSkipProfileModal;

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initKeybinds();
  initOpenRouterKey();
  checkAndShowUserProfileModal();
  startTimer();
  startCheckUpAndPoutEngine();
  renderChatList();
  renderCharactersList();
  renderGuidebook();
  
  // Initial Convex Sync
  syncUserDataToConvex("Initial app load sync");
});

// Timer for Session Analytics
function startTimer() {
  setInterval(() => {
    analyticsData.timeSpentSeconds = Math.floor((Date.now() - analyticsData.startTime) / 1000);
    updateClock();
    if (document.getElementById("secretDashboard").classList.contains("visible")) {
      updateDashboardUI();
    }
  }, 1000);
}

// Live Digital Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const clockEl = document.getElementById("liveClock");
  if (clockEl) {
    clockEl.textContent = `${formattedHours}:${minutes} ${ampm}`;
  }
}

// Global UI Click Listener for Telemetry
document.addEventListener("click", () => {
  analyticsData.clicks++;
  const dash = document.getElementById("secretDashboard");
  if (dash && dash.classList.contains("visible")) {
    const totalClicksEl = document.getElementById("dashTotalClicks");
    if (totalClicksEl) totalClicksEl.textContent = analyticsData.clicks;
  }
});

// Apply UI Language Strings across all view elements
function applyUiLanguage() {
  const lang = userState.uiLang || "en";
  const s = UI_STRINGS[lang] || UI_STRINGS.en;

  // Status Bar Toggle Button
  const toggleBtn = document.getElementById("uiLangToggleBtn");
  if (toggleBtn) {
    toggleBtn.textContent = lang === "en" ? "🌐 EN | VI" : "🌐 VI | EN";
  }

  // Section Titles & Subtitles
  const chatsHeader = document.querySelector("#view-chats .section-title span");
  if (chatsHeader) chatsHeader.textContent = s.chatsTitle;
  const chatsSubtitle = document.querySelector("#view-chats .section-subtitle");
  if (chatsSubtitle) chatsSubtitle.textContent = s.chatsSubtitle;

  const charHeader = document.querySelector("#view-characters .section-title");
  if (charHeader) charHeader.textContent = s.charactersTitle;
  const charSubtitle = document.querySelector("#view-characters .section-subtitle");
  if (charSubtitle) charSubtitle.textContent = s.charactersSubtitle;

  const guideHeader = document.querySelector("#view-progress .section-title");
  if (guideHeader) guideHeader.textContent = s.guidebookTitle;
  const guideSubtitle = document.querySelector("#view-progress .section-subtitle");
  if (guideSubtitle) guideSubtitle.textContent = s.guidebookSubtitle;

  const settingsHeader = document.querySelector("#view-settings .section-title");
  if (settingsHeader) settingsHeader.textContent = s.settingsTitle;
  const settingsSubtitle = document.querySelector("#view-settings .section-subtitle");
  if (settingsSubtitle) settingsSubtitle.textContent = s.settingsSubtitle;

  // Navigation Tab Labels
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    const tabName = btn.dataset.tab;
    const labelSpan = btn.querySelector("span:not(.material-symbols-outlined)");
    if (labelSpan) {
      if (tabName === "chats") labelSpan.textContent = s.tabChats;
      if (tabName === "characters") labelSpan.textContent = s.tabLIs;
      if (tabName === "progress" || tabName === "roadmap" || tabName === "guidebook") labelSpan.textContent = s.tabGuidebook;
      if (tabName === "settings") labelSpan.textContent = s.tabSettings;
    }
  });

  // Feature Input Mode Tabs
  const sentenceTabBtn = document.getElementById("modeSentenceBuilderBtn");
  if (sentenceTabBtn) sentenceTabBtn.textContent = s.sentenceBuilderTab;
  const freeTabBtn = document.getElementById("modeFreeTextBtn");
  if (freeTabBtn) freeTabBtn.textContent = s.freeTextTab;

  const submitSentenceBtn = document.getElementById("submitSentenceBtn");
  if (submitSentenceBtn && !submitSentenceBtn.disabled) submitSentenceBtn.textContent = s.sendSentenceBtn;

  const freeInput = document.getElementById("freeChatInput");
  if (freeInput) {
    freeInput.placeholder = s.freeInputPlaceholder;
    freeInput.dataset.origPlaceholder = s.freeInputPlaceholder;
  }

  const levelLabel = document.querySelector("label[for='tierSelectDropdown']");
  if (levelLabel) levelLabel.textContent = s.selectLevelLabel;

  // Settings Panel Labels
  const resetLabelEl = document.querySelector("#view-settings .settings-card h3");
  if (resetLabelEl && resetLabelEl.textContent.includes("Reset")) resetLabelEl.textContent = s.resetLabel;
  const resetDescEl = document.querySelector("#view-settings .settings-card p");
  if (resetDescEl && resetDescEl.textContent.includes("Wipe")) resetDescEl.textContent = s.resetDesc;
  const resetBtnEl = document.getElementById("resetStoryBtn");
  if (resetBtnEl) resetBtnEl.textContent = s.resetBtn;
  const resetSuccessEl = document.getElementById("resetSuccessMessage");
  if (resetSuccessEl) resetSuccessEl.textContent = s.resetSuccess;

  // Re-render lists with current language
  renderChatList();
  renderCharactersList();
  renderGuidebook();
  if (activeCharacterId) {
    renderChatHistory();
  }

  updateLangUi();
  updateThemeUi();
}

// Theme & Language Helper Functions
function setAppTheme(theme) {
  userState.theme = theme;
  localStorage.setItem("otome_theme", theme);
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
  updateThemeUi();
  logDashboardEvent(`🌙 Theme switched to: ${theme}`);
}
window.setAppTheme = setAppTheme;

function updateThemeUi() {
  const currentTheme = userState.theme || "light";
  const lightBtn = document.getElementById("themeLightBtn");
  const darkBtn = document.getElementById("themeDarkBtn");
  const statusBadge = document.getElementById("themeStatusBadge");

  if (lightBtn) lightBtn.classList.toggle("active", currentTheme === "light");
  if (darkBtn) darkBtn.classList.toggle("active", currentTheme === "dark");
  if (statusBadge) {
    statusBadge.textContent = currentTheme === "dark" ? "🌙 Dark Twilight" : "☀️ Light Mode";
  }
}

function setAppUiLanguage(lang) {
  userState.uiLang = lang;
  localStorage.setItem("otome_ui_lang", lang);
  applyUiLanguage();
  updateLangUi();
  logDashboardEvent(`🌐 UI Language switched to: ${lang.toUpperCase()}`);
}
window.setAppUiLanguage = setAppUiLanguage;

function updateLangUi() {
  const currentLang = userState.uiLang || "en";
  const enBtn = document.getElementById("settingLangEnBtn");
  const viBtn = document.getElementById("settingLangViBtn");
  if (enBtn) enBtn.classList.toggle("active", currentLang === "en");
  if (viBtn) viBtn.classList.toggle("active", currentLang === "vi");
}

// UI Event Handlers & Tab Navigation
function initUI() {
  // Restore initial theme & lang UI
  setAppTheme(userState.theme || "light");
  updateLangUi();

  // Language Switcher Button Listener
  const langBtn = document.getElementById("uiLangToggleBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const nextLang = userState.uiLang === "en" ? "vi" : "en";
      setAppUiLanguage(nextLang);
    });
  }

  // Initial apply of UI language
  applyUiLanguage();

  // Tab Buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab || btn.closest(".tab-btn")?.dataset?.tab;
      if (tabName) switchTab(tabName);
    });
  });

  // Feature Input Mode Switcher (Contextual Sentence Builder vs Free Text Chat)
  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");
  if (modeSentenceBtn && modeFreeBtn) {
    modeSentenceBtn.addEventListener("click", () => {
      if (activeCharacterId) {
        if (!userState.selectedInputMode) userState.selectedInputMode = {};
        userState.selectedInputMode[activeCharacterId] = "sentence";
        saveLocalState();
      }
      modeSentenceBtn.classList.add("active");
      modeSentenceBtn.style.border = "1px solid var(--primary-pink)";
      modeSentenceBtn.style.background = "rgba(217, 0, 87, 0.12)";
      modeSentenceBtn.style.color = "var(--primary-pink)";

      modeFreeBtn.classList.remove("active");
      modeFreeBtn.style.border = "1px solid rgba(160, 140, 190, 0.3)";
      modeFreeBtn.style.background = "rgba(255,255,255,0.6)";
      modeFreeBtn.style.color = "var(--text-muted)";

      document.getElementById("wordBankContainer").style.display = "flex";
      document.getElementById("freeInputContainer").style.display = "none";
    });

    modeFreeBtn.addEventListener("click", () => {
      if (activeCharacterId) {
        if (!userState.selectedInputMode) userState.selectedInputMode = {};
        userState.selectedInputMode[activeCharacterId] = "free";
        saveLocalState();
      }
      modeFreeBtn.classList.add("active");
      modeFreeBtn.style.border = "1px solid var(--primary-pink)";
      modeFreeBtn.style.background = "rgba(217, 0, 87, 0.12)";
      modeFreeBtn.style.color = "var(--primary-pink)";

      modeSentenceBtn.classList.remove("active");
      modeSentenceBtn.style.border = "1px solid rgba(160, 140, 190, 0.3)";
      modeSentenceBtn.style.background = "rgba(255,255,255,0.6)";
      modeSentenceBtn.style.color = "var(--text-muted)";

      document.getElementById("freeInputContainer").style.display = "flex";
      document.getElementById("wordBankContainer").style.display = "none";
    });
  }

  // Difficulty Tier Dropdown Listener
  const dropdownEl = document.getElementById("tierSelectDropdown");
  if (dropdownEl) {
    dropdownEl.addEventListener("change", (e) => {
      const selectedLevel = parseInt(e.target.value);
      if (activeCharacterId) {
        userState.currentTiers[activeCharacterId] = selectedLevel;
        if (userState.selectedInputMode) {
          delete userState.selectedInputMode[activeCharacterId];
        }
        saveLocalState();
        const tierObj = TIERS.find((t) => t.level === selectedLevel) || TIERS[0];
        const char = CHARACTERS[activeCharacterId];
        setupTierInputControls(tierObj, char, true);
        document.getElementById("chatHeaderTier").textContent = `Tier ${selectedLevel}: ${tierObj.name.split(":")[1] || tierObj.name}`;
      }
    });
  }

  // Reset Story Progress Button
  const resetBtn = document.getElementById("resetStoryBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      userState.chatStep = { bao: 0, julian: 0 };
      userState.chatHistories = {};
      userState.affection = { bao: 10, julian: 10 };
      userState.currentTiers = { bao: 1, julian: 1 };
      userState.totalHearts = 0;
      userState.streak = 1;
      userState.selectedInputMode = {};
      dynamicWordBank = { bao: null, julian: null };

      localStorage.removeItem("otome_chats");
      localStorage.removeItem("otome_chat_step");
      localStorage.removeItem("otome_input_mode");
      localStorage.setItem("otome_hearts", "0");
      localStorage.setItem("otome_streak", "1");
      localStorage.setItem("otome_tiers", JSON.stringify(userState.currentTiers));
      localStorage.setItem("otome_affection", JSON.stringify(userState.affection));
      saveLocalState();
      
      const heartsEl = document.getElementById("userHearts");
      if (heartsEl) heartsEl.textContent = "0";
      const streakEl = document.getElementById("userStreak");
      if (streakEl) streakEl.textContent = "1";

      const chatWin = document.getElementById("chatWindow");
      if (chatWin && chatWin.classList.contains("active")) {
        chatWin.classList.remove("active");
        activeCharacterId = null;
      }

      renderChatList();
      renderCharactersList();
      renderGuidebook();

      const successMsg = document.getElementById("resetSuccessMessage");
      if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 4000);
      }
    });
  }

  // Close Grammar Feedback Panel Button
  const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");
  if (closeFeedbackBtn) {
    closeFeedbackBtn.addEventListener("click", () => {
      const panel = document.getElementById("grammarFeedbackPanel");
      if (panel) panel.style.display = "none";
    });
  }

  // Japanese Romaji Toggle Button
  const romajiBtn = document.getElementById("romajiToggleBtn");
  if (romajiBtn) {
    romajiBtn.addEventListener("click", () => {
      userState.showRomaji = !userState.showRomaji;
      localStorage.setItem("otome_show_romaji", userState.showRomaji);
      romajiBtn.textContent = `🔤 Romaji: ${userState.showRomaji ? "ON" : "OFF"}`;
      romajiBtn.style.opacity = userState.showRomaji ? "1" : "0.6";
      renderChatHistory();
    });
  }

  // Translation & Tip Click Toggle Listener
  const chatHistoryContainer = document.getElementById("chatHistory");
  if (chatHistoryContainer) {
    chatHistoryContainer.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest(".assist-toggle-btn");
      if (toggleBtn) {
        const bubble = toggleBtn.closest(".msg-bubble");
        if (bubble) {
          const isExpanded = bubble.classList.toggle("expanded");
          toggleBtn.textContent = isExpanded ? "💡 Hide Translation & Tips" : "💡 Click for Translation & Tips";
        }
      }
    });
  }

  // User Profile Settings Save Listener
  const saveProfileBtn = document.getElementById("saveProfileSettingsBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      const name = document.getElementById("settingsUserName")?.value || "";
      const pronouns = document.getElementById("settingsUserPronouns")?.value || "she/her";
      const age = document.getElementById("settingsUserAge")?.value || "20";

      saveUserProfile(name, pronouns, age);

      const toast = document.getElementById("profileSavedToast");
      if (toast) {
        toast.style.display = "block";
        setTimeout(() => {
          toast.style.display = "none";
        }, 3500);
      }
    });
  }

  const skipModalBtn = document.getElementById("skipProfileModalBtn");
  if (skipModalBtn) {
    skipModalBtn.addEventListener("click", handleSkipProfileModal);
  }

  // OpenRouter Key Save
  const saveKeyBtn = document.getElementById("saveKeyBtn");
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener("click", () => {
      const keyInput = document.getElementById("openRouterKeyInput");
      const key = keyInput ? keyInput.value.trim() : "";
      if (key) {
        localStorage.setItem("openrouter_api_key", key);
        updateKeySavedStatus(true);
      }
    });
  }

  // Save Modal Key
  const saveModalKeyBtn = document.getElementById("saveModalKeyBtn");
  if (saveModalKeyBtn) {
    saveModalKeyBtn.addEventListener("click", () => {
      const modalKeyInput = document.getElementById("modalKeyInput");
      const key = modalKeyInput ? modalKeyInput.value.trim() : "";
      if (key) {
        localStorage.setItem("openrouter_api_key", key);
        updateKeySavedStatus(true);
      }
      const modal = document.getElementById("apiKeyModal");
      if (modal) modal.style.display = "none";
    });
  }

  // Skip Modal Key
  const skipModalKeyBtn = document.getElementById("skipModalKeyBtn");
  if (skipModalKeyBtn) {
    skipModalKeyBtn.addEventListener("click", () => {
      const modal = document.getElementById("apiKeyModal");
      if (modal) modal.style.display = "none";
    });
  }

  // Manual Convex Sync Button
  const manualSyncBtn = document.getElementById("manualSyncBtn");
  if (manualSyncBtn) {
    manualSyncBtn.addEventListener("click", () => {
      syncUserDataToConvex("Manual button trigger");
    });
  }

  // Close Active Chat Button (Back to Main Menu)
  const closeBtn = document.getElementById("closeChatBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeActiveChat);
  }

  // Free Form Text Message Send Button
  const sendFreeMsgBtn = document.getElementById("sendFreeMsgBtn");
  if (sendFreeMsgBtn) {
    sendFreeMsgBtn.addEventListener("click", handleSendFreeMessage);
  }

  const freeChatInput = document.getElementById("freeChatInput");
  if (freeChatInput) {
    freeChatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendFreeMessage();
      }
    });
  }

  // Submit Word Bank Sentence
  const submitSentenceBtn = document.getElementById("submitSentenceBtn");
  if (submitSentenceBtn) {
    submitSentenceBtn.addEventListener("click", handleSendWordBankMessage);
  }

  // Secret Dashboard Manual Upload Button
  const dashUploadBtn = document.getElementById("dashUploadBtn");
  if (dashUploadBtn) {
    dashUploadBtn.addEventListener("click", uploadAnalyticsToConvex);
  }

  // Close Dashboard Button
  const closeDashBtn = document.getElementById("closeDashBtn");
  if (closeDashBtn) {
    closeDashBtn.addEventListener("click", () => {
      const dash = document.getElementById("secretDashboard");
      if (dash) dash.classList.remove("visible");
    });
  }

  // Update Header Badges if present
  const heartsEl = document.getElementById("userHearts");
  if (heartsEl) heartsEl.textContent = userState.totalHearts;
  const streakEl = document.getElementById("userStreak");
  if (streakEl) streakEl.textContent = userState.streak;
}

function closeActiveChat() {
  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.remove("active");
    chatWin.style.display = "none";
  }
  const tabBar = document.querySelector(".tab-bar");
  if (tabBar) tabBar.classList.remove("hidden-in-chat");
  activeCharacterId = null;
  switchTab("chats");
}
window.closeActiveChat = closeActiveChat;

// Switch Bottom Tabs
function switchTab(tabName) {
  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.remove("active");
    chatWin.style.display = "none";
  }
  const tabBar = document.querySelector(".tab-bar");
  if (tabBar) tabBar.classList.remove("hidden-in-chat");
  activeCharacterId = null;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `view-${tabName}`);
  });

  if (tabName === "chats") renderChatList();
  if (tabName === "characters") renderCharactersList();
  if (tabName === "progress" || tabName === "guidebook") renderGuidebook();
}
window.switchTab = switchTab;

// OpenRouter Key Management
function getOpenRouterApiKey() {
  if (typeof HARDCODED_OPENROUTER_API_KEY !== "undefined" && HARDCODED_OPENROUTER_API_KEY && HARDCODED_OPENROUTER_API_KEY.trim()) {
    return HARDCODED_OPENROUTER_API_KEY.trim();
  }
  const localKey = localStorage.getItem("openrouter_api_key");
  if (localKey) return localKey;
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_OPENROUTER_API_KEY) {
      return import.meta.env.VITE_OPENROUTER_API_KEY;
    }
  } catch (e) {
    // Ignore env lookup error if not in bundler env
  }
  return "";
}

function initOpenRouterKey() {
  const savedKey = getOpenRouterApiKey();
  if (savedKey) {
    const inputEl = document.getElementById("openRouterKeyInput");
    if (inputEl) inputEl.value = savedKey;
    updateKeySavedStatus(true);
  } else {
    updateKeySavedStatus(false);
    setTimeout(() => {
      document.getElementById("apiKeyModal").style.display = "flex";
    }, 600);
  }
}

function updateKeySavedStatus(isSaved) {
  const statusEl = document.getElementById("keySavedStatus");
  if (isSaved) {
    statusEl.textContent = "Key Active";
    statusEl.style.color = "var(--accent-emerald)";
  } else {
    statusEl.textContent = "⚠️ Key Required";
    statusEl.style.color = "var(--accent-coral)";
  }
}

// Secret Keyboard Shortcut Listener (CTRL + SHIFT + ALT)
function initKeybinds() {
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.altKey) {
      e.preventDefault();
      const dash = document.getElementById("secretDashboard");
      dash.classList.toggle("visible");
      logDashboardEvent("Secret Keybind [CTRL + SHIFT + ALT] pressed.");
      updateDashboardUI();
    }
    if (e.key === "Escape") {
      document.getElementById("secretDashboard").classList.remove("visible");
    }
  });
}

// Update Dashboard UI Values
function updateDashboardUI() {
  document.getElementById("dashTotalClicks").textContent = analyticsData.clicks;
  document.getElementById("dashAnswersSubmitted").textContent = analyticsData.answersSubmitted;
  document.getElementById("dashApiCalls").textContent = analyticsData.apiCalls;
  document.getElementById("dashTotalHearts").textContent = userState.totalHearts;
  document.getElementById("dashConvexSyncCount").textContent = analyticsData.convexSyncCount;

  const s = analyticsData.timeSpentSeconds;
  const hrs = Math.floor(s / 3600).toString().padStart(2, "0");
  const mins = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const secs = (s % 60).toString().padStart(2, "0");
  document.getElementById("dashTimeSpent").textContent = `${hrs}:${mins}:${secs}`;
}

function logDashboardEvent(msg) {
  const box = document.getElementById("dashLogBox");
  if (!box) return;
  const time = new Date().toLocaleTimeString();
  box.innerHTML += `[${time}] ${msg}<br/>`;
  box.scrollTop = box.scrollHeight;
}

// Render Chatrooms List
function renderChatList() {
  const container = document.getElementById("chatListContainer");
  if (!container) return;
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const tierNum = userState.currentTiers[char.id] || 1;
    const affectionPct = userState.affection[char.id] || 0;
    const unreadCount = userState.unreadMessages[char.id] || 0;
    const isPout = userState.isPouting[char.id] || false;

    const history = userState.chatHistories[char.id] || [];
    const lastMsg = history.length > 0 ? history[history.length - 1].text : char.greeting;

    let badgeHtml = "";
    if (isPout) {
      badgeHtml = `<span class="pout-badge-chip">💢 Pouting!</span>`;
    } else if (unreadCount > 0) {
      badgeHtml = `<span class="unread-badge-chip">🔴 ${unreadCount} New</span>`;
    }

    let groupTagHtml = char.isGroup
      ? `<span style="background:rgba(124, 58, 237, 0.12); color:var(--accent-violet); border:1px solid rgba(124, 58, 237, 0.3); font-size:10px; font-weight:800; padding:2px 6px; border-radius:8px;">👥 Group Chat</span>`
      : "";

    const card = document.createElement("div");
    card.className = "chat-card";
    card.onclick = () => openChatroom(char.id);

    card.innerHTML = `
      <div class="chat-avatar-wrapper">
        <img src="${char.avatar}" class="chat-avatar" alt="${char.name}" />
        <div class="online-badge"></div>
      </div>
      <div class="chat-info">
        <div class="chat-top-row">
          <div class="chat-name">${char.name} <span class="flag-icon">${char.flag}</span> ${groupTagHtml} ${badgeHtml}</div>
          <div class="chat-time">${isPout ? 'Waiting...' : 'Active Now'}</div>
        </div>
        <div class="chat-snippet">${lastMsg}</div>
        <div class="chat-bottom-row">
          <div class="chat-meta">
            <span class="tier-badge">Tier ${tierNum}</span>
            <span class="affection-mini">❤️ ${affectionPct}%</span>
          </div>
          <button class="chat-now-btn" type="button" onclick="event.stopPropagation(); openChatroom('${char.id}');">
            <span>Click to Chat</span>
            <span class="material-symbols-outlined" style="font-size:15px;">chat</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Render Characters Tab
function renderCharactersList() {
  const container = document.getElementById("charactersListContainer");
  if (!container) return;
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const affectionPct = userState.affection[char.id] || 0;
    const tierNum = userState.currentTiers[char.id] || 1;

    const card = document.createElement("div");
    card.className = "character-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="char-header-row">
        <img src="${char.avatar}" class="char-img" alt="${char.name}" />
        <div class="char-details">
          <h3>${char.name} ${char.flag}</h3>
          <div class="char-tagline">${char.role} (${char.language})</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">"${char.personality}"</div>
        </div>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; margin-bottom:4px; color:var(--primary-pink);">
          <span>Affection Level</span>
          <span>❤️ ${affectionPct}%</span>
        </div>
        <div class="affection-progress-bar">
          <div class="affection-fill" style="width: ${affectionPct}%;"></div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
        <span class="tier-badge">Current Tier: ${tierNum} / 10</span>
        <button class="primary-btn chat-li-btn" style="padding:7px 16px; font-size:12px; width:auto; margin:0;" type="button">
          Chat with ${char.name.split(" ")[0]} ❤️
        </button>
      </div>
    `;

    const chatBtn = card.querySelector(".chat-li-btn");
    if (chatBtn) {
      chatBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openChatroom(char.id);
      });
    }

    card.addEventListener("click", () => {
      openChatroom(char.id);
    });

    container.appendChild(card);
  });
}

// Guidebook State (Default to Vietnamese guide)
let currentGuidebookLang = "vi";

function setGuidebookLang(lang) {
  currentGuidebookLang = lang;
  renderGuidebook();
}
window.setGuidebookLang = setGuidebookLang;

// Render Language Guidebook
function renderGuidebook() {
  const container = document.getElementById("guidebookContainer");
  if (!container) return;

  // Update tab buttons state
  const viTab = document.getElementById("guideTabViBtn");
  const enTab = document.getElementById("guideTabEnBtn");
  const jaTab = document.getElementById("guideTabJaBtn");
  const koTab = document.getElementById("guideTabKoBtn");
  const zhTab = document.getElementById("guideTabZhBtn");
  if (viTab) viTab.classList.toggle("active", currentGuidebookLang === "vi");
  if (enTab) enTab.classList.toggle("active", currentGuidebookLang === "en");
  if (jaTab) jaTab.classList.toggle("active", currentGuidebookLang === "ja");
  if (koTab) koTab.classList.toggle("active", currentGuidebookLang === "ko");
  if (zhTab) zhTab.classList.toggle("active", currentGuidebookLang === "zh");

  if (currentGuidebookLang === "ja") {
    container.innerHTML = `
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">🇯🇵</div>
          <div class="guide-card-title">Japanese Script & Romaji Guide (Ren Takahashi)</div>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">
          Japanese uses Hiragana (ひらがな), Katakana (カタカナ), and Kanji (漢字). Romaji translates native Japanese characters into the Latin alphabet for reading guide.
        </p>
        <div class="vocab-category-title">❤️ Romance & Polite Japanese Vocab</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">こんにちは (Konnichiwa)</span>
              <span class="vocab-trans">Hello / Good afternoon</span>
            </div>
          </div>
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">好きです (Suki desu)</span>
              <span class="vocab-trans">I like you / I love you</span>
            </div>
            <span class="vocab-tip">'Suki' expresses affection, '-desu' is polite.</span>
          </div>
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">お茶 (O-cha)</span>
              <span class="vocab-trans">Green Tea</span>
            </div>
            <span class="vocab-tip">Ren's favorite drink to share with you!</span>
          </div>
        </div>
      </div>
    `;
  } else if (currentGuidebookLang === "ko") {
    container.innerHTML = `
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">🇰🇷</div>
          <div class="guide-card-title">Korean Hangul & Romaja Guide (Min-jun Park)</div>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">
          Korean uses the phonetic Hangul alphabet (한글). Romaja provides clear pronunciation guidance so you can easily speak sweet words with Min-jun!
        </p>
        <div class="vocab-category-title">🎵 Music & Romance Korean Vocab</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">안녕하세요 (Annyeonghaseyo)</span>
              <span class="vocab-trans">Hello (Polite)</span>
            </div>
          </div>
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">좋아해요 (Joh-a-hae-yo)</span>
              <span class="vocab-trans">I like you</span>
            </div>
            <span class="vocab-tip">A classic, sweet expression of affection.</span>
          </div>
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">보고 싶어요 (Bogo sip-eoyo)</span>
              <span class="vocab-trans">I miss you</span>
            </div>
            <span class="vocab-tip">Literally 'I want to see you'.</span>
          </div>
        </div>
      </div>
    `;
  } else if (currentGuidebookLang === "zh") {
    container.innerHTML = `
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">🇨🇳</div>
          <div class="guide-card-title">Mandarin Characters & Pinyin Guide (Chen Wei)</div>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">
          Mandarin Chinese uses Chinese Characters (汉字). Pinyin provides the romanized phonetic spellings and tone marks to guide reading.
        </p>
        <div class="vocab-category-title">🍵 Poetic Tea & Romance Chinese Vocab</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">你好 (Nǐ hǎo)</span>
              <span class="vocab-trans">Hello</span>
            </div>
          </div>
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">喜欢你 (Xǐhuān nǐ)</span>
              <span class="vocab-trans">I like you / fond of you</span>
            </div>
          </div>
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">品茶 (Pǐn chá)</span>
              <span class="vocab-trans">Savor / Sample fine tea</span>
            </div>
            <span class="vocab-tip">Chen's gentle invitation for quiet moments together.</span>
          </div>
        </div>
      </div>
    `;
  } else if (currentGuidebookLang === "vi") {
    container.innerHTML = `
      <!-- Card 1: Special Letters & Accents -->
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">🔤</div>
          <div class="guide-card-title">Chữ Cái Đặc Biệt & Dấu Thanh (Special Letters)</div>
        </div>

        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">
          Tiếng Việt có các nguyên âm thêm dấu mũ (^) hoặc râu (ơ, ư), cùng 5 dấu thanh điều chỉnh cao độ giọng nói:
        </p>

        <div class="letters-grid">
          <div class="letter-pill">
            <span class="letter-symbol">Ă / ă</span>
            <span class="letter-desc">A nón ngửa (Short A)</span>
            <span class="letter-ex">Ex: <em>ăn</em> (to eat)</span>
          </div>
          <div class="letter-pill">
            <span class="letter-symbol">Â / â</span>
            <span class="letter-desc">A mũ úp (Deep A)</span>
            <span class="letter-ex">Ex: <em>anh</em> (you/brother)</span>
          </div>
          <div class="letter-pill">
            <span class="letter-symbol">Ê / ê</span>
            <span class="letter-desc">E mũ (Soft E)</span>
            <span class="letter-ex">Ex: <em>em</em> (sweetheart)</span>
          </div>
          <div class="letter-pill">
            <span class="letter-symbol">Ô / ô</span>
            <span class="letter-desc">O mũ (Round O)</span>
            <span class="letter-ex">Ex: <em>ô mai</em> (plum)</span>
          </div>
          <div class="letter-pill">
            <span class="letter-symbol">Ơ / ơ</span>
            <span class="letter-desc">O râu (Unrounded O)</span>
            <span class="letter-ex">Ex: <em>thơm</em> (fragrant)</span>
          </div>
          <div class="letter-pill">
            <span class="letter-symbol">Ư / ư</span>
            <span class="letter-desc">U râu (Unrounded U)</span>
            <span class="letter-ex">Ex: <em>thương</em> (cherish)</span>
          </div>
          <div class="letter-pill">
            <span class="letter-symbol">Đ / đ</span>
            <span class="letter-desc">D gạch ngang (Hard D)</span>
            <span class="letter-ex">Ex: <em>đẹp quá</em> (pretty)</span>
          </div>
        </div>

        <div style="margin-top:14px; background:#f8f5fa; padding:10px 12px; border-radius:12px; border:1px solid rgba(160,140,190,0.18);">
          <div style="font-size:12px; font-weight:800; color:var(--primary-pink); margin-bottom:6px;">🎵 5 Dấu Thanh (Tone Marks)</div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:6px; font-size:11.5px;">
            <div><strong>á</strong> (Sắc) - High Rising</div>
            <div><strong>à</strong> (Huyền) - Low Falling</div>
            <div><strong>ả</strong> (Hỏi) - Dipping Hook</div>
            <div><strong>ã</strong> (Ngã) - Wave Tilde</div>
            <div><strong>ạ</strong> (Nặng) - Drop Dot</div>
          </div>
        </div>
      </div>

      <!-- Card 2: How to Type Vietnamese -->
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">⌨️</div>
          <div class="guide-card-title">Cách Gõ Tiếng Việt (How to Type)</div>
        </div>

        <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
          Gõ kiểu <strong>TELEX</strong> đơn giản nhất: gõ 2 lần phím gốc hoặc dùng phím <span class="typing-code">w</span> để thêm mũ/râu, và gõ phím dấu ở cuối từ:
        </p>

        <table class="typing-table">
          <thead>
            <tr>
              <th>Kết quả</th>
              <th>Thao tác TELEX</th>
              <th>Ví dụ gõ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>â, ê, ô, đ</strong></td>
              <td><span class="typing-code">aa</span>, <span class="typing-code">ee</span>, <span class="typing-code">oo</span>, <span class="typing-code">dd</span></td>
              <td><span class="typing-code">a-n-h</span> → <em>anh</em></td>
            </tr>
            <tr>
              <td><strong>ă, ơ, ư</strong></td>
              <td><span class="typing-code">aw</span>, <span class="typing-code">ow</span>, <span class="typing-code">uw</span> hoặc <span class="typing-code">w</span></td>
              <td><span class="typing-code">a-n-w</span> → <em>ăn</em></td>
            </tr>
            <tr>
              <td><strong>Dấu Sắc (á)</strong></td>
              <td>Thêm phím <span class="typing-code">s</span></td>
              <td><span class="typing-code">n-h-o-s</span> → <em>nhớ</em></td>
            </tr>
            <tr>
              <td><strong>Dấu Huyền (à)</strong></td>
              <td>Thêm phím <span class="typing-code">f</span></td>
              <td><span class="typing-code">c-a-f</span> → <em>cà</em></td>
            </tr>
            <tr>
              <td><strong>Dấu Hỏi (ả)</strong></td>
              <td>Thêm phím <span class="typing-code">r</span></td>
              <td><span class="typing-code">r-a-n-h-r</span> → <em>rảnh</em></td>
            </tr>
            <tr>
              <td><strong>Dấu Ngã (ã)</strong></td>
              <td>Thêm phím <span class="typing-code">x</span></td>
              <td><span class="typing-code">d-e-e-x</span> → <em>dễ</em></td>
            </tr>
            <tr>
              <td><strong>Dấu Nặng (ạ)</strong></td>
              <td>Thêm phím <span class="typing-code">j</span></td>
              <td><span class="typing-code">d-e-e-p-j</span> → <em>đẹp</em></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card 3: Romance Vocabularies Learned -->
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">📖</div>
          <div class="guide-card-title">Từ Vựng Tình Cảm Đã Học (Learned Vocab)</div>
        </div>

        <div class="vocab-category-title">☕ Cà Phê & Quan Tâm Hằng Ngày</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Em ơi / Anh ơi</span>
              <span class="vocab-trans">Sweet address ("Hey sweetheart")</span>
            </div>
            <span class="vocab-tip">Dùng để gọi bạn đời hoặc crush ngọt ngào</span>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Rảnh không?</span>
              <span class="vocab-trans">Are you free right now?</span>
            </div>
            <span class="vocab-tip">Mở lời rủ đi chơi/nhắn tin tự nhiên</span>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Ăn cơm chưa?</span>
              <span class="vocab-trans">Have you eaten yet?</span>
            </div>
            <span class="vocab-tip">Lời hỏi thăm quan tâm chuẩn văn hóa Việt</span>
          </div>
        </div>

        <div class="vocab-category-title">❤️ Tình Cảm & Thả Thính</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Nhớ em / Nhớ anh</span>
              <span class="vocab-trans">Miss you so much</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Thương</span>
              <span class="vocab-trans">Deep affection & caring love</span>
            </div>
            <span class="vocab-tip">Sâu sắc hơn cả 'yêu' - vừa yêu vừa muốn che chở</span>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Đẹp quá / Dễ thương quá</span>
              <span class="vocab-trans">So beautiful / so cute</span>
            </div>
          </div>
        </div>

        <div class="vocab-category-title">✨ Từ Đệm Nhắn Tin Ngọt Ngào</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">nhé / nha</span>
              <span class="vocab-trans">Gentle particle ("okay?", "promise")</span>
            </div>
            <span class="vocab-tip">Thêm vào cuối câu giúp lời nhắn mềm mại</span>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">xíu</span>
              <span class="vocab-trans">A tiny bit / a moment</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // English Guidebook
    container.innerHTML = `
      <!-- Card 1: Word Forms Made Simple -->
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">🔤</div>
          <div class="guide-card-title">Word Forms Made Simple (Dạng Từ)</div>
        </div>

        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">
          English words transform smoothly between Nouns, Verbs, Adjectives, and Adverbs. Here is how root words evolve in romance chats:
        </p>

        <div class="word-forms-card">
          <div style="font-size:12.5px; font-weight:800; color:var(--primary-pink); margin-bottom:4px;">❤️ Love (Tình Yêu)</div>
          <div class="form-row">
            <div class="form-box">
              <div class="form-label">Noun</div>
              <div class="form-val">Love</div>
            </div>
            <div class="form-box">
              <div class="form-label">Verb</div>
              <div class="form-val">Love</div>
            </div>
            <div class="form-box">
              <div class="form-label">Adj</div>
              <div class="form-val">Lovely</div>
            </div>
            <div class="form-box">
              <div class="form-label">Adv</div>
              <div class="form-val">Lovingly</div>
            </div>
          </div>
        </div>

        <div class="word-forms-card">
          <div style="font-size:12.5px; font-weight:800; color:var(--accent-violet); margin-bottom:4px;">✨ Beauty (Vẻ Đẹp)</div>
          <div class="form-row">
            <div class="form-box">
              <div class="form-label">Noun</div>
              <div class="form-val">Beauty</div>
            </div>
            <div class="form-box">
              <div class="form-label">Verb</div>
              <div class="form-val">Beautify</div>
            </div>
            <div class="form-box">
              <div class="form-label">Adj</div>
              <div class="form-val">Beautiful</div>
            </div>
            <div class="form-box">
              <div class="form-label">Adv</div>
              <div class="form-val">Beautifully</div>
            </div>
          </div>
        </div>

        <div class="word-forms-card">
          <div style="font-size:12.5px; font-weight:800; color:var(--accent-emerald); margin-bottom:4px;">🍯 Sweetness (Ngọt Ngào)</div>
          <div class="form-row">
            <div class="form-box">
              <div class="form-label">Noun</div>
              <div class="form-val">Sweetness</div>
            </div>
            <div class="form-box">
              <div class="form-label">Verb</div>
              <div class="form-val">Sweeten</div>
            </div>
            <div class="form-box">
              <div class="form-label">Adj</div>
              <div class="form-val">Sweet</div>
            </div>
            <div class="form-box">
              <div class="form-label">Adv</div>
              <div class="form-val">Sweetly</div>
            </div>
          </div>
        </div>

        <div style="background:#f8f5fa; padding:10px 12px; border-radius:12px; border:1px solid rgba(160,140,190,0.18);">
          <div style="font-size:12px; font-weight:800; color:var(--primary-pink); margin-bottom:4px;">💡 Quick Pattern Tip</div>
          <div style="font-size:11.5px; color:var(--text-main); line-height:1.4;">
            • Add <strong>-ly</strong> to adjectives to describe actions: <em>gentle → gently</em>, <em>sweet → sweetly</em>.<br/>
            • Add <strong>-ful</strong> or <strong>-y</strong> to nouns to describe feelings: <em>charm → charming</em>, <em>sun → sunny</em>.
          </div>
        </div>
      </div>

      <!-- Card 2: Learned Romance Vocabulary -->
      <div class="guide-section-card">
        <div class="guide-card-header">
          <div class="guide-card-icon">📖</div>
          <div class="guide-card-title">English Romance Vocabularies Learned</div>
        </div>

        <div class="vocab-category-title">📚 Scholar & Literary Expressions (Julian)</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Stumbled upon</span>
              <span class="vocab-trans">Tình cờ thấy / va phải</span>
            </div>
            <span class="vocab-tip">Ex: "I stumbled upon this classic book for you."</span>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Devoted</span>
              <span class="vocab-trans">Dành trọn tình cảm / cống hiến</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Cherish / Savor</span>
              <span class="vocab-trans">Trân trọng / thưởng thức trọn vẹn</span>
            </div>
          </div>
        </div>

        <div class="vocab-category-title">☕ Barista & Casual Cafe Vibes (Bao)</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Brew fresh coffee</span>
              <span class="vocab-trans">Pha chế cà phê tươi</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Fragrant aroma</span>
              <span class="vocab-trans">Mùi thơm lừng nức mũi</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Taking a sweet break</span>
              <span class="vocab-trans">Tạm nghỉ ngơi ngọt ngào</span>
            </div>
          </div>
        </div>

        <div class="vocab-category-title">💬 Sweet Conversational Formulas</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">"Are you free right now?"</span>
              <span class="vocab-trans">"Cậu có rảnh lúc này không?"</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">"You made my day."</span>
              <span class="vocab-trans">"Cậu làm một ngày của tớ thêm vui tươi."</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">"Hope your day treating you gently."</span>
              <span class="vocab-trans">"Mong một ngày của cậu diễn ra thật dịu dàng."</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Open Active Chatroom
function openChatroom(charId) {
  activeCharacterId = charId;
  analyticsData.characterInteractions[charId] = (analyticsData.characterInteractions[charId] || 0) + 1;
  
  // Hide bottom tab bar while in chat window
  const tabBar = document.querySelector(".tab-bar");
  if (tabBar) tabBar.classList.add("hidden-in-chat");

  // Clear unread, pout status, and unreplied count when opening chat
  userState.unreadMessages[charId] = 0;
  userState.isPouting[charId] = false;
  if (!userState.unrepliedCount) userState.unrepliedCount = { bao: 0, julian: 0, group: 0 };
  userState.unrepliedCount[charId] = 0;
  lastUserReplyTime[charId] = Date.now();
  lastMessageWasLi[charId] = false;
  saveLocalState();
  renderChatList();

  const char = CHARACTERS[charId];
  if (!char) return;

  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
  const affectionPct = userState.affection[charId] || 0;

  // Set Chat Header Info
  const headerName = document.getElementById("chatHeaderName");
  if (headerName) headerName.innerHTML = `${char.name} <span>${char.flag}</span>`;
  const headerAvatar = document.getElementById("chatHeaderAvatar");
  if (headerAvatar) headerAvatar.src = char.avatar;
  const headerTier = document.getElementById("chatHeaderTier");
  if (headerTier) headerTier.textContent = `Tier ${tierNum}: ${tierObj.name.split(":")[1] || tierObj.name}`;
  const headerAffection = document.getElementById("chatHeaderAffection");
  if (headerAffection) headerAffection.textContent = `❤️ ${affectionPct}%`;

  // Romaji Toggle Button Visibility (Especially for Japanese)
  const romajiBtn = document.getElementById("romajiToggleBtn");
  if (romajiBtn) {
    if (char.language === "Japanese") {
      romajiBtn.style.display = "inline-block";
      romajiBtn.textContent = `🔤 Romaji: ${userState.showRomaji !== false ? "ON" : "OFF"}`;
      romajiBtn.style.opacity = userState.showRomaji !== false ? "1" : "0.6";
    } else {
      romajiBtn.style.display = "none";
    }
  }

  // Render History
  renderChatHistory();

  // Configure Input Bar for Active Tier
  setupTierInputControls(tierObj, char, true);

  // Show Window
  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.add("active");
    chatWin.style.display = "flex";
  }

  // Update Cooldown State in Chat Box UI
  updateCooldownUI(checkSendCooldown());
}

window.openChatroom = openChatroom;

// Klipy GIF API Helper Function
async function fetchKlipyGif(query, characterId) {
  try {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (characterId) params.append("characterId", characterId);
    params.append("limit", "10");

    const res = await fetch(`/api/klipy-gif?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.randomGif) {
        return json.randomGif.url;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch Klipy GIF:", err);
  }
  return null;
}

// Render Chat History Messages
function renderChatHistory() {
  const container = document.getElementById("chatHistory");
  if (!container) return;
  container.innerHTML = "";

  const char = CHARACTERS[activeCharacterId];
  if (!char) return;

  let history = userState.chatHistories[activeCharacterId] || [];

  // Seed greeting if history empty
  if (history.length === 0) {
    if (activeCharacterId === "group") {
      history = [
        {
          sender: "li",
          speaker: "bao",
          speakerName: "Bao Nguyen",
          text: "MC! I brew fresh coffee for you! It smells very thơm... Julian, my English is better than your Vietnamese, right? MC, you like my coffee or Julian's poetry more? ☕❤️",
          translation: "MC! I brewed fresh coffee for you! It smells very fragrant... Julian, my English is better than your Vietnamese, right? MC, do you like my coffee or Julian's poetry more?",
          tip: "Bao is showing off his coffee for you! 'Thơm' means fragrant.",
          time: "Just now",
        },
        {
          sender: "li",
          speaker: "julian",
          speakerName: "Julian Vance",
          text: "Nonsense, Bao! MC, em rất đẹp! I practiced that all night for you! Coffee is lovely, but my affection for MC is eternal. Who is speaking better today, MC?",
          translation: "Nonsense, Bao! MC, you are very beautiful! I practiced that all night for you! Coffee is lovely, but my affection for MC is eternal. Who is speaking better today, MC?",
          tip: "Julian is trying to win your favor! 'Em rất đẹp' means 'You are very beautiful'.",
          time: "Just now",
        }
      ];
    } else {
      history = [
        {
          sender: "li",
          text: char.greeting,
          romaji: char.romaji || null,
          translation: char.greetingTranslation,
          tip: char.greetingTip,
          time: "Just now",
        },
      ];
    }
    userState.chatHistories[activeCharacterId] = history;
    saveLocalState();

    // Asynchronously attach a Klipy GIF to the initial greeting!
    fetchKlipyGif(null, activeCharacterId).then((gifUrl) => {
      if (gifUrl && userState.chatHistories[activeCharacterId] && userState.chatHistories[activeCharacterId][0]) {
        userState.chatHistories[activeCharacterId][0].gifUrl = gifUrl;
        saveLocalState();
        renderChatHistory();
      }
    });
  }

  const showRomaji = userState.showRomaji !== false;

  history.forEach((msg) => {
    const group = document.createElement("div");
    group.className = "message-group " + (msg.sender === "user" ? "user-msg" : "li-msg");

    if (msg.sender === "li") {
      const romajiHtml = (msg.romaji && showRomaji)
        ? `<div class="romaji-text" style="font-size:12.5px; color:var(--accent-violet); font-weight:700; margin-top:4px; margin-bottom:2px; background:rgba(124, 58, 237, 0.08); border:1px solid rgba(124, 58, 237, 0.2); padding:3px 8px; border-radius:6px; display:inline-block;">🔤 ${msg.romaji}</div>`
        : "";

      let speakerAvatar = char.avatar;
      let speakerName = char.name;
      let speakerStyle = "";

      if (activeCharacterId === "group" || msg.speaker) {
        if (msg.speaker === "julian" || msg.speakerName === "Julian Vance") {
          speakerAvatar = CHARACTERS.julian.avatar;
          speakerName = "Julian Vance 🇬🇧";
          speakerStyle = "style='color: #d97706; font-weight:800;'";
        } else {
          speakerAvatar = CHARACTERS.bao.avatar;
          speakerName = "Bao Nguyen 🇻🇳";
          speakerStyle = "style='color: var(--accent-emerald); font-weight:800;'";
        }
      }

      const gifHtml = msg.gifUrl
        ? `<div class="msg-gif-card" style="margin-top:8px; border-radius:12px; overflow:hidden; border:1px solid rgba(217, 0, 87, 0.25); box-shadow:0 4px 12px rgba(0,0,0,0.12); background:#000;">
            <img src="${msg.gifUrl}" alt="Klipy GIF" style="width:100%; max-height:220px; object-fit:contain; display:block;" loading="lazy" />
            <div style="font-size:9.5px; color:rgba(255,255,255,0.75); background:rgba(0,0,0,0.6); padding:2px 8px; text-align:right;">Klipy GIF 🖼️</div>
          </div>`
        : "";

      group.innerHTML = `
        <img src="${speakerAvatar}" class="msg-avatar" alt="${speakerName}" />
        <div class="msg-body">
          <div class="msg-sender" ${speakerStyle}>${speakerName}</div>
          <div class="msg-bubble">
            <div style="font-size:15px; font-weight:700;">${msg.text}</div>
            ${gifHtml}
            ${romajiHtml}
            ${(msg.translation || msg.tip || msg.fix) ? `<button type="button" class="assist-toggle-btn">💡 Click for Translation & Tips</button>` : ''}
            ${msg.translation ? `<div class="translation-text">💬 ${msg.translation}</div>` : ""}
            ${msg.tip ? `<div class="tip-card"><div class="tip-title">💡 Language Tip</div>${msg.tip}</div>` : ""}
            ${msg.fix ? `<div class="fix-card"><div class="fix-title">❤️ Corrected Phrasing</div>${msg.fix}</div>` : ""}
          </div>
          <div class="msg-time">${msg.time || "11:42 PM"}</div>
        </div>
      `;
    } else {
      const userGifHtml = msg.gifUrl
        ? `<div class="msg-gif-card" style="margin-top:8px; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.3); box-shadow:0 4px 12px rgba(0,0,0,0.12); background:#000;">
            <img src="${msg.gifUrl}" alt="Klipy GIF" style="width:100%; max-height:220px; object-fit:contain; display:block;" loading="lazy" />
            <div style="font-size:9.5px; color:rgba(255,255,255,0.75); background:rgba(0,0,0,0.6); padding:2px 8px; text-align:right;">Klipy GIF 🖼️</div>
          </div>`
        : "";

      group.innerHTML = `
        <div class="msg-body">
          <div class="msg-bubble">
            <div>${msg.text}</div>
            ${userGifHtml}
          </div>
          <div class="msg-time">${msg.time || "11:42 PM"}</div>
        </div>
      `;
    }

    container.appendChild(group);
  });

  container.scrollTop = container.scrollHeight;
}

// Contextual Word Chips Generator for Sentence Builder
// Contextual Word Chips Generator for Sentence Builder
function generateContextualWordChips(charId, lastMsgText) {
  const text = (lastMsgText || "").toLowerCase();
  const targetLang = userState.targetLanguage || "vi";

  if (targetLang === "en") {
    let charName = charId === "bao" ? "Bao" : (charId === "julian" ? "Julian" : (charId === "ren" ? "Ren" : "Lounge"));
    let prompt = `Build your reply to ${charName} (English 🇬🇧):`;
    let chips = ["Hello", charName, "I am", "very happy", "to chat", "with you", "today", "thank you"];

    if (text.includes("coffee") || text.includes("tea") || text.includes("brew") || text.includes("drink")) {
      prompt = `Build reply: "Thank you! I would love a fresh cup!"`;
      chips = ["Thank you", charName, "I would", "love a", "fresh cup", "sounds wonderful", "so sweet"];
    } else if (text.includes("book") || text.includes("read") || text.includes("literature")) {
      prompt = `Build reply: "I would love to read together with you."`;
      chips = ["I would", "love to", "read together", "with you", charName, "delighted"];
    }
    return { prompt, chips };
  } else if (targetLang === "ja") {
    let charName = charId === "bao" ? "バオさん" : (charId === "julian" ? "ジュリアンさん" : (charId === "ren" ? "蓮さん" : "皆さん"));
    let prompt = `Build your reply to ${charName} (Japanese 🇯🇵):`;
    let chips = ["こんにちは", charName, "お話しできて", "嬉しいです", "ありがとう", "今日も", "元気です"];

    if (text.includes("お茶") || text.includes("コーヒー") || text.includes("飲み")) {
      prompt = `Build reply: "Thank you! Let's drink together!"`;
      chips = ["こんにちは", charName, "一緒に", "飲みましょう", "ありがとうございます", "美味しいです"];
    }
    return { prompt, chips };
  } else {
    // Default Vietnamese
    if (charId === "group") {
      let prompt = "Build your reply to Bao & Julian (Group Chat 💬):";
      let chips = ["Chào hai anh", "Cảm ơn nhé", "Cà phê", "Very nice", "I agree", "Học cùng nhau", "Bao", "Julian", "rất vui"];

      if (text.includes("cà phê") || text.includes("coffee")) {
        prompt = 'Build reply: "Thank you both! Coffee sounds wonderful."';
        chips = ["Cảm ơn hai anh", "Cà phê", "rất ngon", "delicious coffee", "Bao", "Julian", "nhé", "ạ"];
      } else {
        prompt = 'Build reply: "Hello Bao and Julian! I am happy to chat with both of you!"';
        chips = ["Chào hai anh", "Em rất vui", "nói chuyện với", "Bao và Julian", "thank you", "nhé", "ạ"];
      }
      return { prompt, chips };
    } else if (charId === "bao") {
      let prompt = "Build your reply to Bao (Vietnamese 🇻🇳):";
      let chips = ["Xin chào", "anh Bao", "ạ", "em", "rất", "vui", "được", "gặp", "anh"];

      if (text.includes("gọi món") || text.includes("cà phê") || text.includes("pha")) {
        prompt = 'Build reply: "Hello Bao! Give me a cup of delicious coffee please."';
        chips = ["Cho em", "một ly", "cà phê", "ngon", "nhé", "anh Bao", "cảm ơn", "ạ", "rất thích"];
      } else if (text.includes("rảnh") || text.includes("làm gì") || text.includes("ở đây") || text.includes("nhớ")) {
        prompt = 'Build reply: "I am free! I really enjoy chatting with you."';
        chips = ["Em đang", "rảnh nè", "nói chuyện", "với anh", "Bao", "rất vui", "thích lắm", "ạ", "em cũng nhớ anh"];
      } else if (text.includes("đợi") || text.includes("nguội") || text.includes("lờ") || text.includes("giận")) {
        prompt = 'Build reply: "Sorry Bao! I was busy, please don\'t be mad at me."';
        chips = ["Em xin lỗi", "anh Bao", "đừng giận", "em", "nhé", "thương anh", "mà", "em vừa bận chút"];
      }
      return { prompt, chips };
    } else if (charId === "ren") {
      let prompt = "Build your reply to Ren (Japanese 🇯🇵):";
      let chips = ["こんにちは", "蓮さん", "お茶", "大好き", "嬉しいです", "一緒に", "飲みましょう", "ありがとうございます"];

      if (text.includes("時間") || text.includes("time") || text.includes("元気")) {
        prompt = 'Build reply: "Hello Ren! I am happy to talk with you."';
        chips = ["こんにちは", "蓮さん", "はい", "元気です", "お話しできて", "嬉しいです", "ありがとう"];
      } else if (text.includes("茶") || text.includes("tea")) {
        prompt = 'Build reply: "Hello Ren! I would love to drink green tea with you."';
        chips = ["こんにちは", "蓮さん", "緑茶", "一緒に", "飲みましょう", "ありがとうございます", "美味しいです"];
      }
      return { prompt, chips };
    } else {
      let prompt = "Build your reply to Julian (English 🇬🇧):";
      let chips = ["Good day", "Julian", "I am", "happy to", "talk with", "you", "today"];

      if (text.includes("book") || text.includes("reading") || text.includes("poem") || text.includes("novel")) {
        prompt = 'Build reply: "I would love to read that poem together with you."';
        chips = ["I would", "love to", "read that", "poem", "with you", "Julian", "sounds wonderful"];
      } else if (text.includes("free") || text.includes("afternoon") || text.includes("thinking") || text.includes("around")) {
        prompt = 'Build reply: "I was hoping to hear from you as well."';
        chips = ["I was", "hoping to", "hear from", "you", "as well", "Julian", "delighted"];
      }
      return { prompt, chips };
    }
  }
}

// Setup Input Controls for Active Tier
function setupTierInputControls(tierObj, char, isInitialLoad = false) {
  const labelEl = document.getElementById("tierModeLabel");
  const multEl = document.getElementById("tierHeartMultiplier");
  const dropdownEl = document.getElementById("tierSelectDropdown");

  if (dropdownEl) {
    dropdownEl.value = tierObj.level.toString();
  }

  labelEl.textContent = `Tier ${tierObj.level}`;
  multEl.textContent = `+${tierObj.heartsPerAns} ❤️ / answer`;

  // Always configure Contextual Word Bank for current conversation step
  setupWordBankPrompt(tierObj, char);

  // Check and apply active 20s cooldown button states if running
  updateCooldownUI(checkSendCooldown());

  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");

  const savedMode = userState.selectedInputMode && userState.selectedInputMode[char.id];

  if (isInitialLoad) {
    if (savedMode === "free") {
      if (modeFreeBtn) modeFreeBtn.click();
    } else if (savedMode === "sentence") {
      if (modeSentenceBtn) modeSentenceBtn.click();
    } else {
      if (tierObj.level <= 5) {
        if (modeSentenceBtn) modeSentenceBtn.click();
      } else {
        if (modeFreeBtn) modeFreeBtn.click();
      }
    }
  } else {
    // Post-reply refresh: preserve whatever mode is currently active!
    const isFreeActive = modeFreeBtn && modeFreeBtn.classList.contains("active");
    const activeMode = savedMode || (isFreeActive ? "free" : "sentence");
    if (activeMode === "free") {
      if (modeFreeBtn) modeFreeBtn.click();
    } else {
      if (modeSentenceBtn) modeSentenceBtn.click();
    }
  }
}

// Setup Word Bank Prompt for Contextual Sentence Builder
let currentConstructedWords = [];
function setupWordBankPrompt(tierObj, char) {
  currentConstructedWords = [];
  const guideEl = document.getElementById("wordBankPromptGuide");
  const chipsGrid = document.getElementById("wordChipsGrid");
  const boxEl = document.getElementById("constructedSentenceBox");

  boxEl.innerHTML = `<span style="color:var(--text-muted); font-size:12px;" id="constructedPlaceholder">Click word chips below to build your sentence...</span>`;

  let history = userState.chatHistories[char.id] || [];
  let lastLiMsgText = "";
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].sender === "li") {
      lastLiMsgText = history[i].text;
      break;
    }
  }
  if (!lastLiMsgText) lastLiMsgText = char.greeting;

  let promptText = "";
  let chips = [];

  // Check if AI generated dynamic word bank exists
  if (dynamicWordBank[char.id] && dynamicWordBank[char.id].chips && dynamicWordBank[char.id].chips.length > 0) {
    promptText = dynamicWordBank[char.id].prompt || `Build your reply to ${char.name.split(" ")[0]}:`;
    chips = dynamicWordBank[char.id].chips;
  } else {
    const contextualData = generateContextualWordChips(char.id, lastLiMsgText);
    promptText = contextualData.prompt;
    chips = contextualData.chips;
  }

  guideEl.textContent = promptText;
  chipsGrid.innerHTML = "";

  chips.forEach((word) => {
    const chip = document.createElement("button");
    chip.className = "word-chip";
    chip.type = "button";
    chip.textContent = word;
    chip.onclick = () => {
      currentConstructedWords.push(word);
      updateConstructedBox();
    };
    chipsGrid.appendChild(chip);
  });
}

function updateConstructedBox() {
  const boxEl = document.getElementById("constructedSentenceBox");
  boxEl.innerHTML = "";

  if (currentConstructedWords.length === 0) {
    boxEl.innerHTML = `<span style="color:var(--text-muted); font-size:12px;">Click word chips below to build your sentence...</span>`;
    return;
  }

  currentConstructedWords.forEach((w, idx) => {
    const span = document.createElement("span");
    span.className = "word-chip";
    span.style.background = "var(--primary-pink)";
    span.textContent = w + " ✕";
    span.onclick = () => {
      currentConstructedWords.splice(idx, 1);
      updateConstructedBox();
    };
    boxEl.appendChild(span);
  });
}

// Submit Word Bank Constructed Message
async function handleSendWordBankMessage() {
  const freeInput = document.getElementById("freeChatInput");
  const freeText = freeInput ? freeInput.value.trim() : "";

  let messageText = currentConstructedWords.join(" ");
  if (!messageText) {
    messageText = freeText;
  }

  if (!messageText) {
    alert("Please click word chips to build a sentence or type in the chat box!");
    return;
  }

  if (isSendingMessage) return;
  isSendingMessage = true;

  if (freeInput) freeInput.value = "";
  currentConstructedWords = [];
  updateConstructedBox();

  analyticsData.answersSubmitted++;

  const charId = activeCharacterId || "bao";
  activeCharacterId = charId;

  // Add User Message
  addUserMessageToHistory(messageText);

  userState.chatStep[charId] = (userState.chatStep[charId] || 0) + 1;
  dynamicWordBank[charId] = null;

  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];

  addHearts(tierObj.heartsPerAns || 10);
  increaseAffection(charId, 8);
  triggerHeartBurst();

  try {
    await triggerLLMResponse(messageText, tierObj);
  } finally {
    isSendingMessage = false;
    updateCooldownUI(0);
  }
}

// Handle Free-Form Text Chat Message
async function handleSendFreeMessage() {
  const freeInput = document.getElementById("freeChatInput");
  let text = freeInput ? freeInput.value.trim() : "";

  if (!text && currentConstructedWords.length > 0) {
    text = currentConstructedWords.join(" ");
    currentConstructedWords = [];
    updateConstructedBox();
  }

  if (!text) return;

  if (isSendingMessage) return;
  isSendingMessage = true;

  if (freeInput) freeInput.value = "";
  analyticsData.answersSubmitted++;

  const charId = activeCharacterId || "bao";
  activeCharacterId = charId;

  addUserMessageToHistory(text);

  userState.chatStep[charId] = (userState.chatStep[charId] || 0) + 1;

  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];

  addHearts(tierObj.heartsPerAns || 10);
  increaseAffection(charId, 10);
  triggerHeartBurst();

  try {
    await triggerLLMResponse(text, tierObj);
  } finally {
    isSendingMessage = false;
    updateCooldownUI(0);
  }
}

// Add User Message to History & LocalStorage
function addUserMessageToHistory(text) {
  const charId = activeCharacterId || "bao";
  activeCharacterId = charId;

  if (!userState.chatHistories) userState.chatHistories = {};
  const history = userState.chatHistories[charId] || [];
  history.push({
    sender: "user",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  userState.chatHistories[charId] = history;

  // Reset unreplied tracking, pout state & timers when user responds
  if (!userState.unrepliedCount) userState.unrepliedCount = { bao: 0, julian: 0, group: 0 };
  if (!userState.isPouting) userState.isPouting = { bao: false, julian: false, group: false };
  if (!userState.saidGoodbye) userState.saidGoodbye = { bao: false, julian: false, group: false };

  userState.unrepliedCount[charId] = 0;
  userState.isPouting[charId] = false;

  if (isFarewellMessage(text)) {
    userState.saidGoodbye[charId] = true;
    if (lastMessageWasLi) lastMessageWasLi[charId] = false;
    logDashboardEvent(`👋 User said goodbye to ${CHARACTERS[charId]?.name || charId}. Stopping automatic texts for this chat.`);
  } else {
    userState.saidGoodbye[charId] = false;
  }

  if (typeof lastUserReplyTime === "object" && lastUserReplyTime) lastUserReplyTime[charId] = Date.now();
  if (typeof lastLiCheckupTime === "object" && lastLiCheckupTime) lastLiCheckupTime[charId] = Date.now();
  if (typeof lastMessageWasLi === "object" && lastMessageWasLi) lastMessageWasLi[charId] = false;
  if (typeof nextSpontaneousDelay === "object" && nextSpontaneousDelay) nextSpontaneousDelay[charId] = (7 + Math.random() * 3) * 60 * 1000;

  saveLocalState();
  renderChatHistory();
}

// Grammar Feedback & Encouragement Side Panel Helper
function showGrammarFeedback(isCorrect, correction, encouragement) {
  const panel = document.getElementById("grammarFeedbackPanel");
  const badge = document.getElementById("feedbackBadge");
  const icon = document.getElementById("feedbackIcon");
  const title = document.getElementById("feedbackTitle");
  const encouragementEl = document.getElementById("feedbackEncouragement");
  const correctionEl = document.getElementById("feedbackCorrection");

  if (!panel) return;

  panel.style.display = "flex";
  if (isCorrect) {
    panel.classList.remove("mistake");
    if (icon) icon.textContent = "verified";
    if (title) title.textContent = "Great Answer!";
    if (encouragementEl) encouragementEl.textContent = encouragement || "Awesome effort! Your phrase was accurate.";
    if (correctionEl) correctionEl.style.display = "none";
  } else {
    panel.classList.add("mistake");
    if (icon) icon.textContent = "auto_fix_high";
    if (title) title.textContent = "Grammar Tip";
    if (encouragementEl) encouragementEl.textContent = encouragement || "Good try! Here is a small tip:";
    if (correctionEl) {
      if (correction && correction !== "Spot on!") {
        correctionEl.textContent = `Correction: ${correction}`;
        correctionEl.style.display = "block";
      } else {
        correctionEl.style.display = "none";
      }
    }
  }
}

// LLM Integration with Google Gemini API via /api/chat endpoint (with Free Model Fallback)
async function triggerLLMResponse(userText, tierObj) {
  analyticsData.apiCalls++;
  const charId = activeCharacterId || "bao";
  const char = CHARACTERS[charId] || CHARACTERS.bao;

  showTypingIndicator(char);

  let responseData = null;

  try {
    logDashboardEvent(`Sending Gemini API request via /api/chat for ${char.name}...`);
    
    const history = userState.chatHistories[charId] || [];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId: char.id,
        characterName: char.name,
        characterLanguage: char.language,
        targetLanguage: userState.targetLanguage || "vi",
        isGroup: char.isGroup || false,
        userText: userText,
        tierLevel: tierObj ? tierObj.level : 1,
        recentHistory: history.slice(-4),
        apiKey: getOpenRouterApiKey(),
        userProfile: userState.userProfile || { name: "MC", pronouns: "she/her", age: "20" },
      }),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      responseData = json.data;
      if (responseData && responseData.contextualChips && responseData.contextualChips.length > 0) {
        dynamicWordBank[char.id] = {
          prompt: responseData.contextualChipsPrompt || `Build your reply to ${char.name.split(" ")[0]}:`,
          chips: responseData.contextualChips
        };
      }
      logDashboardEvent(`Gemini API response received successfully using model: ${json.usedModel}`);
    } else {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    logDashboardEvent(`Gemini API fallback for ${char.name}: ${err.message}`);
    responseData = generateInCharacterFallback(char, userText, tierObj);
  }

  removeTypingIndicator();

  if (responseData) {
    // Optionally fetch a Klipy GIF for character response
    let responseGifUrl = responseData.gifUrl || null;
    if (!responseGifUrl) {
      responseGifUrl = await fetchKlipyGif(responseData.gifQuery || null, charId);
    }

    showGrammarFeedback(
      responseData.isCorrect !== false,
      responseData.correction || responseData.fix,
      responseData.encouragement
    );

    const history = userState.chatHistories[charId] || [];

    if ((charId === "group" || char.isGroup) && responseData.groupResponses && responseData.groupResponses.length > 0) {
      responseData.groupResponses.forEach((resp, idx) => {
        history.push({
          sender: "li",
          speaker: resp.speaker || "bao",
          speakerName: resp.speakerName || (resp.speaker === "julian" ? "Julian Vance" : "Bao Nguyen"),
          text: resp.text,
          translation: resp.translation,
          tip: resp.tip,
          gifUrl: idx === 0 ? responseGifUrl : null,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      });
    } else {
      history.push({
        sender: "li",
        text: responseData.characterResponse || responseData.text || "Cảm ơn em! Tớ rất vui được trò chuyện với em ❤️",
        romaji: responseData.romaji || null,
        translation: responseData.translation || "Thank you! I am very happy chatting with you ❤️",
        tip: responseData.tip || "Keep practicing your conversation skills!",
        fix: responseData.correction || responseData.fix || null,
        gifUrl: responseGifUrl,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    userState.chatHistories[charId] = history;
    lastMessageWasLi[charId] = true;
    lastLiCheckupTime[charId] = Date.now();

    checkTierLevelUp(charId);
    saveLocalState();
    renderChatHistory();

    setupTierInputControls(tierObj || TIERS[0], char);
    syncUserDataToConvex(`Post-chat response sync (${char.name})`);
  }
}

function generateInCharacterFallback(char, userText, tierObj) {
  const isGroup = char.isGroup || char.id === "group";
  const normText = (userText || "").toLowerCase();
  const targetLang = userState.targetLanguage || "vi";

  if (isGroup) {
    let baoText = "Em nhắn gì dễ thương quá! Coi nè, anh pha ly cà phê thơm phức cho em rồi đó! ☕❤️";
    let julianText = "Ah, MC! Splendid message indeed! I must say, your company brightens my whole day! ✨";

    if (targetLang === "en") {
      baoText = "Your message is so sweet! Look, I brewed a fresh fragrant coffee for you! ☕❤️";
      julianText = "Splendid message indeed! Your company brightens my whole day! ✨";
    } else if (targetLang === "ja") {
      baoText = "とても可愛いメッセージですね！美味しいコーヒーを淹れましたよ！ ☕❤️";
      julianText = "素敵なメッセージですね！あなたとお話しできて一日が輝きます！ ✨";
    }

    return {
      isGroup: true,
      groupResponses: [
        {
          speaker: "bao",
          speakerName: "Bao Nguyen",
          text: baoText,
          translation: "Bao: What a sweet message! I brewed a fresh coffee for you! ☕❤️",
          tip: "Bao is showing his affectionate side with coffee brewing!"
        },
        {
          speaker: "julian",
          speakerName: "Julian Vance",
          text: julianText,
          translation: "Julian: Splendid message indeed! Your company brightens my day! ✨",
          tip: "Julian loves chatting with you in group chat!"
        }
      ],
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "Wonderful effort! Your phrase was natural and clear.",
      contextualChipsPrompt: "Build your reply to Bao & Julian:",
      contextualChips: ["Thank you both", "Coffee sounds great", "You two are so cute", "I love chatting with both of you", "Talk to you later"]
    };
  } else if (char.id === "bao") {
    let respText = "Cảm ơn em nha! Nghe em nói làm anh vui cả ngày luôn á. Em uống cà phê chưa? ☕";
    let trans = "Thank you sweetheart! Hearing you talk made my whole day happy. Have you had coffee yet?";
    let tip = "'Cảm ơn em' is a warm way to say thank you to someone younger or a sweetheart.";

    if (targetLang === "en") {
      respText = "Thank you so much! Hearing from you brightens my whole day. Have you had coffee yet? ☕";
      trans = "Thank you so much! Hearing from you brightens my whole day. Have you had coffee yet?";
      tip = "'Brightens my whole day' expresses warm affection.";
      if (normText.includes("hello") || normText.includes("hi") || normText.includes("chào")) {
        respText = "Hello sweetheart! How are you today? I just finished brewing a fresh batch of coffee!";
        trans = "Hello sweetheart! How are you today? I just finished brewing a fresh batch of coffee!";
        tip = "'Sweetheart' is an endearing romantic term.";
      }
    } else if (targetLang === "ja") {
      respText = "メッセージありがとうございます！君と話せて一日中嬉しい気分です。コーヒーはいかがですか？ ☕";
      trans = "Thank you for the message! I'm happy all day talking with you. How about some coffee? ☕";
      tip = "'Arigatou gozaimasu' is a polite thank you in Japanese.";
    } else {
      if (normText.includes("chào") || normText.includes("hello") || normText.includes("hi")) {
        respText = "Chào em! Hôm nay em thế nào? Anh vừa pha xong mẻ cà phê mới thơm lắm!";
        trans = "Hello! How are you today? I just finished brewing a fresh fragrant batch of coffee!";
        tip = "'Hôm nay em thế nào?' means 'How are you today?' in Vietnamese.";
      } else if (normText.includes("cà phê") || normText.includes("gọi món")) {
        respText = "Có liền nè em! Cà phê đặc biệt dành riêng cho em đó, ngọt ngào ngụm đầu tiên luôn nha!";
        trans = "Coming right up! Special coffee made just for you, sweet from the very first sip!";
        tip = "'Đặc biệt' means 'special'. Bao loves customizing drinks for you.";
      } else if (normText.includes("thích") || normText.includes("yêu") || normText.includes("dễ thương")) {
        respText = "Em làm anh ngại quá nè... Nhưng mà anh rất thích nói chuyện với em đó! ❤️";
        trans = "You are making me shy... But I really love talking with you! ❤️";
        tip = "'Ngại' means shy/embarrassed in a sweet romantic context.";
      }
    }

    return {
      characterResponse: respText,
      translation: trans,
      tip: tip,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "Tuyệt vời! Cụm từ của em rất chính xác và tự nhiên.",
      contextualChipsPrompt: `Build your reply to Bao:`,
      contextualChips: ["Thank you Bao", "Coffee sounds great", "You are so sweet", "I am free now", "Talk to you later"]
    };
  } else if (char.id === "ren") {
    const userName = userState.userProfile?.name || "MC";
    let respText = `メッセージありがとうございます、${userName}さん！君と話せてとても嬉しいです。🍵`;
    let romaji = `Messeoji arigatou gozaimasu, ${userName}-san! Kimi to hanasete totemo ureshii desu.`;
    let trans = `Thank you for the message, ${userName}! I am very happy to talk with you. 🍵`;
    let tip = "'-san' is a polite honorific attached to names in Japanese.";

    if (normText.includes("こんにちは") || normText.includes("hello") || normText.includes("hi")) {
      respText = `こんにちは、${userName}さん！今日はどんな一日でしたか？`;
      romaji = `Konnichiwa, ${userName}-san! Kyou wa donna ichinichi deshita ka?`;
      trans = `Hello, ${userName}! How was your day today?`;
      tip = "'Konnichiwa' is 'Hello' and 'donna ichinichi' asks about your day.";
    } else if (normText.includes("お茶") || normText.includes("tea") || normText.includes("drink")) {
      respText = "美味しい緑茶を淹れましたよ。一緒に飲みましょう！ 🍵";
      romaji = "Oishii ryokucha wo iremashita yo. Issho ni nomimashou!";
      trans = "I brewed delicious green tea. Let's drink together!";
      tip = "'Ryokucha' means Japanese green tea.";
    } else if (normText.includes("好き") || normText.includes("love") || normText.includes("cute")) {
      respText = `そんな風に言われると…照れますね。でも、私も${userName}さんのことが…好きです。❤️`;
      romaji = `Sonna fuu ni iware ru to... teremasu ne. Demo, watashi mo ${userName}-san no koto ga... suki desu.`;
      trans = `When you say it like that... I get shy. But, I also... like you, ${userName}. ❤️`;
      tip = "'Teremasu' means getting shy or blushing.";
    }

    return {
      characterResponse: respText,
      romaji: romaji,
      translation: trans,
      tip: tip,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "素晴らしい！ (Wonderful effort in Japanese!)",
      contextualChipsPrompt: "Build your reply to Ren (Japanese 🇯🇵):",
      contextualChips: ["こんにちは 蓮さん", "お茶を飲みましょう", "ありがとうございます", "私もうれしいです", "またね"]
    };
  } else if (char.id === "minjun") {
    const userName = userState.userProfile?.name || "MC";
    let respText = `메시지 고마워요, ${userName}님! 오늘 하루도 정말 수고 많았어요. 🎵❤️`;
    let romaji = `Meseiji gomawoyo, ${userName}-nim! Oneul harudo jeongmal sugo manasseoyo.`;
    let trans = `Thank you for the message, ${userName}! You worked so hard today as well. 🎵❤️`;
    let tip = "'-nim' is a respectful and sweet honorific in Korean.";

    if (normText.includes("안녕") || normText.includes("hello") || normText.includes("hi")) {
      respText = `안녕하세요, ${userName}님! 오늘 기분은 좀 어때요?`;
      romaji = `Annyeonghaseyo, ${userName}-nim! Oneul gibun-eun jom eotteoyo?`;
      trans = `Hello, ${userName}! How are you feeling today?`;
      tip = "'Annyeonghaseyo' is polite 'Hello' in Korean.";
    } else if (normText.includes("노래") || normText.includes("song") || normText.includes("music")) {
      respText = `${userName}님을 생각하며 새로 쓴 노래를 들려드리고 싶어요! 🎧`;
      romaji = `${userName}-nim-eul saenggak-hamyeo saero sseun norae-reul deullyeodeurigo sip-eoyo!`;
      trans = `I want to play you a new song I wrote while thinking of you, ${userName}! 🎧`;
      tip = "'Norae' means song in Korean.";
    } else if (normText.includes("좋아") || normText.includes("love") || normText.includes("cute")) {
      respText = `심장이 너무 빨리 뛰네요... 저도 ${userName}님이 정말 좋아요! ❤️`;
      romaji = `Simjang-i neomu ppalli ttwineyeo... Jeodo ${userName}-nim-i jeongmal joh-a-yo!`;
      trans = `My heart is beating so fast... I really like you too, ${userName}! ❤️`;
      tip = "'Simjang-i ttwineyeo' means my heart is racing.";
    }

    return {
      characterResponse: respText,
      romaji: romaji,
      translation: trans,
      tip: tip,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "대단해요! (Amazing effort in Korean!)",
      contextualChipsPrompt: "Build your reply to Min-jun (Korean 🇰🇷):",
      contextualChips: ["안녕하세요 민준씨", "노래 기대돼요", "감사합니다", "수고하셨어요", "안녕히 가세요"]
    };
  } else if (char.id === "chen") {
    const userName = userState.userProfile?.name || "MC";
    let respText = `收到你的消息真开心，${userName}。愿这道佳茗能带给你一丝温情。 🍃`;
    let romaji = `Shōudào nǐ de xiāoxī zhēn kāixīn, ${userName}. Yuàn zhè dào jiāmíng néng dài gěi nǐ yì sī wēnqíng.`;
    let trans = `So happy to receive your message, ${userName}. May this fine tea bring you a touch of warmth. 🍃`;
    let tip = "'Jiāmíng' is a poetic term for fine quality tea.";

    if (normText.includes("你好") || normText.includes("hello") || normText.includes("hi")) {
      respText = `你好，${userName}！今天过得可还顺心？`;
      romaji = `Nǐ hǎo, ${userName}! Jīntiān guò de kě hái shùnxīn?`;
      trans = `Hello, ${userName}! Has your day been pleasant?`;
      tip = "'Nǐ hǎo' is 'Hello' in Mandarin Chinese.";
    } else if (normText.includes("茶") || normText.includes("tea") || normText.includes("drink")) {
      respText = "我为你沏了一壶好茶，香气扑鼻，请品尝。 🍵";
      romaji = "Wǒ wèi nǐ qī le yì hú hǎo chá, xiāngqì pū bí, qǐng pǐncháng.";
      trans = "I brewed a pot of fine tea for you, overflowing with fragrance, please sample it.";
      tip = "'Qī chá' means to brew tea in Chinese.";
    } else if (normText.includes("喜欢") || normText.includes("love") || normText.includes("sweet")) {
      respText = `能得${userName}此般倾心，是我莫大的荣幸... 我亦对你一往情深。 ❤️`;
      romaji = `Néng dé ${userName} cǐ bān qīngxīn, shì wǒ mòdà de róngxìng... Wǒ yì duì nǐ yìwǎngqíngshēn.`;
      trans = `To have your affections, ${userName}, is my greatest honor... My heart belongs to you as well. ❤️`;
      tip = "'Yìwǎngqíngshēn' is a classic idiom meaning deeply devoted affection.";
    }

    return {
      characterResponse: respText,
      romaji: romaji,
      translation: trans,
      tip: tip,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "太棒了！ (Excellence in Mandarin Chinese!)",
      contextualChipsPrompt: "Build your reply to Chen (Chinese 🇨🇳):",
      contextualChips: ["你好 陈伟", "谢谢你的关心", "茶香真美好", "我也很高兴", "再见"]
    };
  } else {
    const userName = userState.userProfile?.name || "MC";
    let respText = `What a charming sentiment! Reading your words always brings a smile to my face, ${userName}.`;
    let trans = `What a charming sentiment! Reading your words always brings a smile to my face, ${userName}.`;
    let tip = "'Charming sentiment' expresses gentle romantic affection.";

    if (normText.includes("hello") || normText.includes("hi") || normText.includes("chào")) {
      respText = `Good day, ${userName}! I was just contemplating a lovely poem when your message arrived.`;
      trans = `Good day, ${userName}! I was just contemplating a lovely poem when your message arrived.`;
      tip = "'Good day' is a refined, polite greeting.";
    } else if (normText.includes("book") || normText.includes("read") || normText.includes("poem")) {
      respText = "How wonderful that you share a passion for literature! Shall we read together sometime?";
      trans = "How wonderful that you share a passion for literature! Shall we read together sometime?";
      tip = "'Literature' refers to romantic prose and classic books.";
    } else if (normText.includes("love") || normText.includes("like") || normText.includes("sweet")) {
      respText = `My heart flutters at your words... You possess a truly captivating presence, ${userName}. ❤️`;
      trans = `My heart flutters at your words... You possess a truly captivating presence, ${userName}. ❤️`;
      tip = "'My heart flutters' means feeling romantic excitement.";
    }

    return {
      characterResponse: respText,
      translation: trans,
      tip: tip,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "Splendid phrasing! Excellent work expressing your thoughts.",
      contextualChipsPrompt: "Build your reply to Julian (English 🇬🇧):",
      contextualChips: ["I would love to read with you", "Thank you Julian", "You are very kind", "I am happy to talk", "Talk to you later"]
    };
  }
}

// Typing Indicator Helpers
function showTypingIndicator(char) {
  const container = document.getElementById("chatHistory");
  if (!container) return;
  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className = "message-group li-msg";
  indicator.innerHTML = `
    <img src="${char.avatar}" class="msg-avatar" alt="${char.name}" />
    <div class="msg-body">
      <div class="msg-bubble" style="font-style:italic; color:var(--accent-emerald);">
        ${char.name} is typing... 💬
      </div>
    </div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

// Hearts & Affection Increment
function addHearts(amount) {
  userState.totalHearts += amount;
  const heartsEl = document.getElementById("userHearts");
  if (heartsEl) heartsEl.textContent = userState.totalHearts;
  saveLocalState();
}

function increaseAffection(charId, amount) {
  userState.affection[charId] = Math.min(100, (userState.affection[charId] || 0) + amount);
  saveLocalState();
  renderCharactersList();
}

// Spontaneous LI Check-Up & Impatience ("Mad/Pout") Messaging Loop
function startCheckUpAndPoutEngine() {
  setInterval(() => {
    const now = Date.now();
    const charIds = Object.keys(CHARACTERS);

    charIds.forEach(async (charId) => {
      const char = CHARACTERS[charId];
      if (!char) return;

      // If user typed goodbye or character is pouting, STOP sending automatic messages!
      if (userState.saidGoodbye && userState.saidGoodbye[charId]) {
        return;
      }
      if (userState.isPouting && userState.isPouting[charId]) {
        return;
      }

      const timeSinceCheckup = now - (lastLiCheckupTime[charId] || 0);
      const timeSinceUserReply = now - (lastUserReplyTime[charId] || 0);
      const delay = nextSpontaneousDelay[charId] || (7 * 60 * 1000);
      const targetLang = userState.targetLanguage || "vi";

      // 1. Unreplied Progression: If LI sent a message and user hasn't replied in > 7 minutes (420,000 ms)
      if (lastMessageWasLi[charId] && timeSinceCheckup > (7 * 60 * 1000)) {
        if (!userState.unrepliedCount) userState.unrepliedCount = { bao: 0, julian: 0, ren: 0, group: 0 };
        const stage = userState.unrepliedCount[charId] || 0;
        const charSeq = UNREPLIED_SEQUENCE[charId];
        const seq = charSeq ? (charSeq[targetLang] || charSeq.vi || charSeq.en || []) : [];

        if (seq && stage < seq.length) {
          const msgObj = seq[stage];
          if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          userState.chatHistories[charId].push({
            sender: "li",
            text: msgObj.text,
            romaji: msgObj.romaji || null,
            translation: msgObj.translation,
            tip: msgObj.tip,
            time: timeStr,
            timestamp: timeStr,
          });

          lastLiCheckupTime[charId] = now;
          userState.unrepliedCount[charId] = stage + 1;

          // Is this the final silence "..." stage?
          if (stage === seq.length - 1 || msgObj.text === "...") {
            userState.isPouting[charId] = true;
            lastMessageWasLi[charId] = false;
            userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
            showNotificationToast(char, "...", true);
            logDashboardEvent(`💢 ${char.name} pouted with "..." and stopped sending messages until user replies.`);
          } else if (stage === seq.length - 2) {
            // Pouting message right before "..."
            userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
            showNotificationToast(char, msgObj.text, true);
            logDashboardEvent(`😤 ${char.name} sent pouting message to user.`);
          } else {
            // Pre-written check-in message
            userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
            showNotificationToast(char, msgObj.text, false);
            logDashboardEvent(`💬 ${char.name} sent pre-written check-in #${stage + 1}.`);
          }

          if (activeCharacterId === charId) {
            renderChatHistory();
            const tierNum = userState.currentTiers[charId] || 1;
            const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
            setupWordBankPrompt(tierObj, char);
          }

          saveLocalState();
          renderChatList();
          return;
        }
      }

      // 2. Spontaneous Check-Up Trigger (Once every 7-10 minutes when both are idle)
      if (!lastMessageWasLi[charId] && timeSinceCheckup > delay && timeSinceUserReply > delay) {
        const charPool = SPONTANEOUS_CHECKUPS[charId];
        const pool = charPool ? (charPool[targetLang] || charPool.vi || charPool.en || []) : [];
        if (pool && pool.length > 0) {
          const checkup = pool[Math.floor(Math.random() * pool.length)];

          if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const checkupGif = await fetchKlipyGif(null, charId);

          userState.chatHistories[charId].push({
            sender: "li",
            text: checkup.text,
            romaji: checkup.romaji || null,
            translation: checkup.translation,
            tip: checkup.tip,
            gifUrl: checkupGif,
            time: timeStr,
            timestamp: timeStr
          });

          lastLiCheckupTime[charId] = now;
          lastMessageWasLi[charId] = true;
          userState.unrepliedCount[charId] = 0;
          nextSpontaneousDelay[charId] = (7 + Math.random() * 3) * 60 * 1000;

          if (activeCharacterId !== charId) {
            userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
            showNotificationToast(char, checkup.text, false);
          } else {
            renderChatHistory();
            const tierNum = userState.currentTiers[charId] || 1;
            const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
            setupWordBankPrompt(tierObj, char);
          }

          saveLocalState();
          renderChatList();
          logDashboardEvent(`💬 Spontaneous Check-Up Message sent by ${char.name} (Next checkup in 7-10 min)`);
        }
      }
    });
  }, 5000);
}

// Show In-App Top Banner Notification Toast
function showNotificationToast(char, msgText, isPout = false) {
  const toast = document.getElementById("liNotificationToast");
  if (!toast) return;

  const avatar = document.getElementById("toastAvatar");
  const name = document.getElementById("toastName");
  const tag = document.getElementById("toastTag");
  const text = document.getElementById("toastText");
  const replyBtn = document.getElementById("toastReplyBtn");

  if (avatar) avatar.src = char.avatar;
  if (name) name.textContent = char.name;
  if (tag) tag.textContent = isPout ? "💢 Getting Impatient!" : "💬 Incoming Message";
  if (text) text.textContent = msgText;

  if (isPout) {
    toast.classList.add("pout-mode");
  } else {
    toast.classList.remove("pout-mode");
  }

  toast.style.display = "flex";

  if (replyBtn) {
    replyBtn.onclick = () => {
      toast.style.display = "none";
      openChatroom(char.id);
    };
  }

  setTimeout(() => {
    if (toast.style.display !== "none") {
      toast.style.display = "none";
    }
  }, 6000);
}

// Check Tier Level-Up
function checkTierLevelUp(charId) {
  const aff = userState.affection[charId] || 0;
  const currentTier = userState.currentTiers[charId] || 1;
  const nextTierThreshold = currentTier * 10;

  if (aff >= nextTierThreshold && currentTier < 10) {
    userState.currentTiers[charId]++;
    logDashboardEvent(`🎉 LEVEL UP! ${CHARACTERS[charId].name} advanced to Tier ${userState.currentTiers[charId]}!`);
    triggerHeartBurst();
  }
}

// Heart Particle Visual Animation
function triggerHeartBurst() {
  const frame = document.getElementById("appFrame");
  const heart = document.createElement("div");
  heart.className = "heart-burst";
  heart.textContent = "❤️ +10";
  heart.style.left = Math.random() * 60 + 20 + "%";
  heart.style.bottom = "120px";
  if (frame) frame.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
}

// Save LocalStorage State
function saveLocalState() {
  localStorage.setItem("otome_hearts", userState.totalHearts);
  localStorage.setItem("otome_streak", userState.streak);
  localStorage.setItem("otome_tiers", JSON.stringify(userState.currentTiers));
  localStorage.setItem("otome_affection", JSON.stringify(userState.affection));
  localStorage.setItem("otome_chat_step", JSON.stringify(userState.chatStep));
  localStorage.setItem("otome_chats", JSON.stringify(userState.chatHistories));
  localStorage.setItem("otome_unread", JSON.stringify(userState.unreadMessages));
  localStorage.setItem("otome_pouting", JSON.stringify(userState.isPouting));
  localStorage.setItem("otome_unreplied_count", JSON.stringify(userState.unrepliedCount || { bao: 0, julian: 0 }));
  localStorage.setItem("otome_said_goodbye", JSON.stringify(userState.saidGoodbye || { bao: false, julian: false, group: false }));
  localStorage.setItem("otome_input_mode", JSON.stringify(userState.selectedInputMode || {}));
  localStorage.setItem("otome_ui_lang", userState.uiLang || "en");
  localStorage.setItem("otome_user_profile", JSON.stringify(userState.userProfile || { name: "MC", pronouns: "she/her", age: "20" }));
}

// Synchronize User Data to Convex Cloud (`/sync-user`)
async function syncUserDataToConvex(reason = "") {
  try {
    const statusEl = document.getElementById("convexSyncStatus");
    if (statusEl) statusEl.textContent = "🟡 Syncing...";

    const payload = {
      userId: userState.userId,
      totalHearts: userState.totalHearts,
      streak: userState.streak,
      tiers: userState.currentTiers,
      affection: userState.affection,
      syncedAt: new Date().toISOString(),
      syncReason: reason,
    };

    const res = await fetch(`${CONVEX_HTTP_SITE}/sync-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      analyticsData.convexSyncCount++;
      if (statusEl) statusEl.textContent = "🟢 Convex Synced";
      logDashboardEvent(`Convex [/sync-user] sync successful (${reason}).`);
    } else {
      if (statusEl) statusEl.textContent = "🔴 Sync Offline";
      logDashboardEvent(`Convex [/sync-user] returned status ${res.status}.`);
    }
  } catch (err) {
    const statusEl = document.getElementById("convexSyncStatus");
    if (statusEl) statusEl.textContent = "🔴 Sync Offline";
    logDashboardEvent(`Convex [/sync-user] fetch error: ${err.message}`);
  }
}

// Collect Full Telemetry & Device/Location/Bounce Metadata Payload
function collectFullTelemetryMetadata() {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isTablet = /iPad|Tablet/i.test(navigator.userAgent) || (isMobile && window.innerWidth >= 768);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  const isBounce = analyticsData.timeSpentSeconds < 10 && analyticsData.clicks <= 1;

  return {
    userId: userState.userId,
    userInfo: {
      totalHearts: userState.totalHearts,
      streak: userState.streak,
      tiers: userState.currentTiers,
      affection: userState.affection,
      unrepliedCount: userState.unrepliedCount,
    },
    device: {
      type: deviceType,
      userAgent: navigator.userAgent,
      platform: navigator.platform || "unknown",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio || 1,
      touchSupport: ("ontouchstart" in window) || (navigator.maxTouchPoints > 0),
    },
    location: {
      language: navigator.language || "en-US",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      referrer: document.referrer || "direct",
    },
    sessionMetrics: {
      sessionStartTime: new Date(analyticsData.startTime).toISOString(),
      sessionDurationSeconds: analyticsData.timeSpentSeconds,
      totalClicks: analyticsData.clicks,
      answersSubmitted: analyticsData.answersSubmitted,
      apiCalls: analyticsData.apiCalls,
      convexSyncCount: analyticsData.convexSyncCount,
      characterInteractions: analyticsData.characterInteractions,
      isBounce: isBounce,
      bounceRateRatio: isBounce ? 1.0 : 0.0,
      activeCharacterId: activeCharacterId,
    },
    timestamp: new Date().toISOString(),
  };
}

// Auto Telemetry Sync on Tab Close / Hide to calculate Bounce Rate & Session Metrics
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    const payload = collectFullTelemetryMetadata();
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", JSON.stringify(payload));
    }
  }
});

// Upload Analytics Telemetry Payload to Convex Cloud (`/analytics`)
async function uploadAnalyticsToConvex() {
  const statusEl = document.getElementById("dashUploadStatus");
  if (statusEl) statusEl.textContent = "Uploading telemetry...";

  try {
    const payload = collectFullTelemetryMetadata();

    // Send through server proxy (which adds IP & GEO metadata)
    const res = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      analyticsData.convexSyncCount++;
      if (statusEl) statusEl.textContent = "Status: Telemetry Synced to Convex 🟢";
      logDashboardEvent(`Uploaded analytics payload to Convex: ${JSON.stringify(json.convexData || json)}`);
    } else {
      if (statusEl) statusEl.textContent = `Status: Failed (${res.status}) 🔴`;
      logDashboardEvent(`Analytics upload failed with status ${res.status}`);
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = "Status: Error 🔴";
    logDashboardEvent(`Analytics upload error: ${err.message}`);
  }
}

// Klipy GIF Modal UI Controls
let currentKlipyGifs = [];

async function openKlipyGifModal(defaultQuery) {
  const modal = document.getElementById("klipyGifModal");
  if (modal) modal.style.display = "flex";

  const charId = activeCharacterId || "bao";
  const initialQuery = defaultQuery || (charId === "bao" ? "anime coffee" : charId === "julian" ? "anime reading" : charId === "ren" ? "anime tea" : "anime cute");

  const input = document.getElementById("klipySearchInput");
  if (input) input.value = initialQuery;

  await searchKlipyGifsInModal();
}
window.openKlipyGifModal = openKlipyGifModal;

function closeKlipyGifModal() {
  const modal = document.getElementById("klipyGifModal");
  if (modal) modal.style.display = "none";
}
window.closeKlipyGifModal = closeKlipyGifModal;

async function quickSearchKlipyGif(tag) {
  const input = document.getElementById("klipySearchInput");
  if (input) input.value = tag;
  await searchKlipyGifsInModal();
}
window.quickSearchKlipyGif = quickSearchKlipyGif;

async function searchKlipyGifsInModal() {
  const input = document.getElementById("klipySearchInput");
  const query = input ? input.value.trim() : "anime cute";
  const grid = document.getElementById("klipyGifGrid");
  if (!grid) return;

  grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">Searching Klipy GIF library... 🖼️</div>`;

  try {
    const res = await fetch(`/api/klipy-gif?q=${encodeURIComponent(query)}&limit=12`);
    if (!res.ok) throw new Error("Klipy GIF search failed");
    const json = await res.json();

    if (json.success && json.gifs && json.gifs.length > 0) {
      currentKlipyGifs = json.gifs;
      grid.innerHTML = "";
      json.gifs.forEach((gif) => {
        const item = document.createElement("div");
        item.style.cssText = "border-radius:12px; overflow:hidden; border:1px solid var(--border-color); cursor:pointer; aspect-ratio:1/1; position:relative; background:#000; transition:transform 0.2s ease;";
        item.innerHTML = `
          <img src="${gif.url}" alt="${gif.title}" style="width:100%; height:100%; object-fit:cover;" loading="lazy" />
          <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); color:#fff; font-size:10px; padding:3px 6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${gif.title || 'Send GIF'}
          </div>
        `;
        item.onmouseover = () => { item.style.transform = "scale(1.04)"; };
        item.onmouseout = () => { item.style.transform = "scale(1)"; };
        item.onclick = () => { sendUserKlipyGif(gif.url, gif.title); };
        grid.appendChild(item);
      });
    } else {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">No GIFs found on Klipy for "${query}". Try searching "coffee", "cute", or "anime"!</div>`;
    }
  } catch (err) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:var(--primary-pink); font-size:13px;">Failed to load Klipy GIFs. Check internet connection.</div>`;
  }
}
window.searchKlipyGifsInModal = searchKlipyGifsInModal;

async function sendUserKlipyGif(gifUrl, gifTitle) {
  closeKlipyGifModal();
  const charId = activeCharacterId || "bao";
  const char = CHARACTERS[charId] || CHARACTERS.bao;

  if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  userState.chatHistories[charId].push({
    sender: "user",
    text: "[Sent a GIF 🖼️]",
    gifUrl: gifUrl,
    gifTitle: gifTitle,
    time: timeStr
  });

  lastUserReplyTime[charId] = Date.now();
  lastMessageWasLi[charId] = false;
  if (userState.isPouting) userState.isPouting[charId] = false;

  renderChatHistory();
  saveLocalState();

  // Love Interest reacts enthusiastic to user's Klipy GIF!
  showTypingIndicator(char);
  setTimeout(async () => {
    removeTypingIndicator();

    const liReactionGif = await fetchKlipyGif(null, charId);

    let reactionText = "Aww! What a super cute GIF! You always know how to make me smile! ❤️";
    let reactionTrans = "Aww! What a super cute GIF! You always know how to make me smile! ❤️";
    const targetLang = userState.targetLanguage || "vi";

    if (charId === "bao") {
      if (targetLang === "vi") {
        reactionText = "Trời ơi! GIF em gửi dễ thương xỉu luôn! Làm anh muốn pha cho em ly cà phê hình trái tim liền nè! ☕❤️";
        reactionTrans = "Oh my goodness! The GIF you sent is super cute! Makes me want to brew you a heart-latte right away! ☕❤️";
      } else {
        reactionText = "Aww! That GIF you sent is so adorable! It makes me want to brew a special heart-latte for you right now! ☕❤️";
        reactionTrans = "Aww! That GIF you sent is so adorable! It makes me want to brew a special heart-latte for you right now!";
      }
    } else if (charId === "julian") {
      if (targetLang === "en") {
        reactionText = "Ah, what an exquisitely charming GIF! You truly bring a radiant joy to my day, MC. ✨";
        reactionTrans = "Ah, what an exquisitely charming GIF! You truly bring a radiant joy to my day, MC. ✨";
      } else {
        reactionText = "Thật là một GIF vô cùng ngọt ngào! Em luôn biết cách khiến anh mỉm cười đó, MC. ✨";
        reactionTrans = "What an incredibly sweet GIF! You always know how to make me smile, MC. ✨";
      }
    }

    userState.chatHistories[charId].push({
      sender: "li",
      text: reactionText,
      translation: reactionTrans,
      tip: "Sending Klipy GIFs boosts affection!",
      gifUrl: liReactionGif,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    lastLiCheckupTime[charId] = Date.now();
    lastMessageWasLi[charId] = true;
    userState.affection[charId] = Math.min(100, (userState.affection[charId] || 0) + 5);

    renderChatHistory();
    saveLocalState();
    renderChatList();
  }, 1200);
}
window.sendUserKlipyGif = sendUserKlipyGif;
