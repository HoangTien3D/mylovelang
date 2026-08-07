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

/// Character Definitions
const CHARACTERS = {
  bao: {
    id: "bao",
    name: "Bao Nguyen",
    language: "Vietnamese",
    flag: "🇻🇳",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdCYW8iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDU5NjY5Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ0JhbykiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZDFmYWU1Ii8+PHBhdGggZD0iTTMwIDMwIHEyMCAtMTAgNDAgMCBxLTE4IDI0IC00MCAwIiBmaWxsPSIjMDY0ZTMiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiMwNjRlMyIvPjxjaXJjbGUgY3g9IjU4IiBjeT0iNDEiIHI9IjIuNSIgZmlsbD0iIzA2NGUzIi8+PHBhdGggZD0iTTQ1IDQ5IHE1IDUgMTAgMCIgc3Ryb2tlPSIjMDY0ZTMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    role: "Artisan Chef & Barista",
    personality: "Laid-back, nonchalant barista. Starts cool and casual, but gets intrigued as you chat in Vietnamese.",
    greeting: "Chào em. Em muốn gọi món gì không?",
    greetingTranslation: "Hello. Would you like to order anything?",
    greetingTip: "'Chào em' is 'Hello'. 'Em muốn gọi món gì không?' is a polite cafe greeting in Vietnamese.",
    sampleVoice: "Warm energetic baritone",
  },
  julian: {
    id: "julian",
    name: "Julian Vance",
    language: "English",
    flag: "🇬🇧",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdKdWwiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjYjkxYzFjIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ0p1bCkiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmVmM2M3Ii8+PHBhdGggZD0iTTMxIDMwIHExOCAtMTIgMzQgMCBxLTYgMjQgLTM4IDAiIGZpbGw9IiM3ODM1MGYiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiM3ODM1MGYiLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiM3ODM1MGYiLz48cGF0aCBkPSJNNTYgNDkgcTQgMyA4IDAiIHN0cm9rZT0iIzc4MzUwZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
    role: "Literature Scholar & Architect",
    personality: "Composed, intellectual scholar. Starts reserved, but gets charmed as you chat.",
    greeting: "Good day. Did you need something?",
    greetingTranslation: "Good day. Did you need something?",
    greetingTip: "'Good day' is a formal polite greeting. 'Did you need something?' is a reserved inquiry.",
    sampleVoice: "Refined British scholar",
  },
  group: {
    id: "group",
    name: "Bao & Julian Lounge 💬",
    isGroup: true,
    language: "Vietnamese & English",
    flag: "🇻🇳🇬🇧",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdHcm91cCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwNTk2NjkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNiOTFjMWMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0idXJsKCNnR3JvdXApIi8+PHBhdGggZD0iTTM1IDIzIGMtMTAgMCAtMTYgOCAtMTYgMTcgYzAgNyA0IDExIDkgMTQgYy0xMSA0IC0xNiAxMSAtMTYgMjIgaDQ3IGMwIC0xMSAtNSAtMTggLTE2IC0yMiBjMTEgLTMgOSAtNyA5IC0xNCBjMCAtOSAtNiAtMTcgLTE2IC0xNyB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjk1Ii8+PHBhdGggZD0iTTY1IDMwIGMtOCAwIC0xMyA2IC0xMyAxNCBjMCA2IDMgOSA3IDExIGMtOSAzIC0xMyA5IC0xMyAxOCBoMzggYzAgLTkgLTQgLTE1IC0xMyAtMTggYzkgLTIgNyAtNSA3IC0xMSBjMCAtOCAtNSAtMTQgLTEzIC0xNCB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjc1Ii8+PC9zdmc+',
    role: "Bao Nguyen & Julian Vance",
    personality: "Playful 3-way romantic rivalry & language exchange! Bao (broken English) and Julian (broken Vietnamese) compete for MC's affection and praise while practicing languages together!",
    greeting: "Welcome to our group chat! Bao and Julian are both competing to win your heart while practicing languages with you!",
    greetingTranslation: "Welcome to our group chat! Bao and Julian are both competing to win your heart while practicing languages with you!",
    greetingTip: "Both love interests will try to impress you—give compliments to your favorite or both!",
    sampleVoice: "Trilingual group harmony",
  }
};

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
    settingsTitle: "Messenger Settings",
    settingsSubtitle: "Configure AI model & Convex Cloud connection",
    apiKeyLabel: "🔑 Gemini API Key",
    keyActive: "Key Active",
    keyRequired: "⚠️ Key Required",
    saveKeyBtn: "Save API Key to LocalStorage",
    convexSyncLabel: "☁️ Convex Cloud Backend Sync",
    syncBtn: "Sync Progress",
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
    settingsTitle: "Cài Đặt Messenger",
    settingsSubtitle: "Cấu hình mô hình AI & kết nối Convex Cloud",
    apiKeyLabel: "🔑 Mã Khóa Gemini API Key",
    keyActive: "Đã Hoạt Động",
    keyRequired: "⚠️ Cần Mã Khóa",
    saveKeyBtn: "Lưu API Key vào Bộ Nhớ LocalStorage",
    convexSyncLabel: "☁️ Đồng Bộ Hậu Cần Convex Cloud",
    syncBtn: "Đồng Bộ Tiến Trình",
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
  group: [
    "Wait, my phone is lagging! Julian, did your screen freeze too?",
    "Mine glitched for a moment as well! Give us just a second, MC."
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
  group: [
    "Okay we are back! What were you saying, MC?",
    "All fixed now! Please continue, MC."
  ]
};

// Spontaneous LI Check-Up Messages Pool (Casual, Short, Sweet Texts)
const SPONTANEOUS_CHECKUPS = {
  bao: [
    { text: "Em ơi, rảnh không? Nói chuyện với anh xíu nè ☕", translation: "Hey sweetheart, are you free? Chat with me for a bit ☕", tip: "'Rảnh không?' means 'Are you free?'" },
    { text: "Đang làm gì đấy? Tự nhiên anh nhớ em xíu.", translation: "What are you doing? I suddenly missed you a bit.", tip: "'Đang làm gì đấy?' means 'What are you doing?'" },
    { text: "Rảnh tay chưa? Nhắn anh xíu nhé!", translation: "Are your hands free yet? Text me for a bit!", tip: "'Rảnh tay' means free from work/tasks." },
    { text: "Uống cà phê không em? Anh vừa pha xong nè ☕", translation: "Want some coffee? I just finished brewing ☕", tip: "'Vừa pha xong' means 'just finished brewing'." },
    { text: "Hôm nay em thế nào rồi? Có bận lắm không?", translation: "How are you today? Are you very busy?", tip: "'Hôm nay thế nào' means 'how are you today'." },
    { text: "Hey, em có ở đó không?", translation: "Hey, are you there?", tip: "'Có ở đó không' means 'are you there'." }
  ],
  julian: [
    { text: "Hey, are you free to talk a bit? ☕", translation: "Hey, are you free to talk a bit? ☕", tip: "A casual, friendly text opening." },
    { text: "Thinking of you. How is your day going?", translation: "Thinking of you. How is your day going?", tip: "A sweet, casual check-in." },
    { text: "Taking a study break? Talk to me when you can.", translation: "Taking a study break? Talk to me when you can.", tip: "Polite encouragement for your studies." },
    { text: "Are you busy right now, or free for a quick chat?", translation: "Are you busy right now, or free for a quick chat?", tip: "Checking on your availability." },
    { text: "Hope your day is treating you nicely. Free for a moment?", translation: "Hope your day is treating you nicely. Free for a moment?", tip: "Expressing gentle care." },
    { text: "Hello! Learned any interesting words today?", translation: "Hello! Learned any interesting words today?", tip: "Asking about your language progress." }
  ],
  group: [
    { text: "MC, free to chat? Julian and I are hanging out!", translation: "MC, free to chat? Julian and I are hanging out!", tip: "Group invitation to chat." },
    { text: "Bao is brewing coffee, come join our conversation when you can!", translation: "Bao is brewing coffee, come join our conversation when you can!", tip: "Friendly group invite." }
  ]
};

// Impatient Pout & Check-Up Sequence Pool (Natural & Cute Otome Pre-written Texts)
const UNREPLIED_SEQUENCE = {
  bao: [
    {
      text: "Em ơi, rảnh không? Anh vừa pha ly cà phê thơm lắm nè!",
      translation: "Hey sweetheart, are you free? I just brewed a really fragrant coffee!",
      tip: "'Em ơi' is a sweet form of address. 'Rảnh không?' means 'Are you free?'."
    },
    {
      text: "Đang làm gì đấy? Tự nhiên anh nhớ em xíu.",
      translation: "What are you doing? I suddenly missed you a bit.",
      tip: "'Tự nhiên' means 'suddenly/out of nowhere'."
    },
    {
      text: "Em đi đâu rồi? Sao lỡ để anh đợi lâu thế này~ ☕",
      translation: "Where did you go? Why leave me waiting so long like this~",
      tip: "'Đi đâu rồi' means 'where did you go'. 'Đợi lâu' means 'wait long'."
    },
    {
      text: "Hơ! Nhắn tin mà em lờ anh luôn, anh dỗi thật đấy! 😾💔",
      translation: "Hmph! I texted you but you ignored me, I'm pouting for real now! 😾💔",
      tip: "'Lờ anh' means 'ignored me'. 'Anh dỗi' means 'I am pouting'."
    },
    {
      text: "...",
      translation: "... (Silence... Bao is pouting in quiet until you reply)",
      tip: "Bao is pouting because you left him on read! Message him to break the silence."
    }
  ],
  julian: [
    {
      text: "Hey, are you free to talk a bit? ☕",
      translation: "Hey, are you free to talk a bit? ☕",
      tip: "A casual, friendly text opening."
    },
    {
      text: "I found myself pausing my reading just to check if you were around.",
      translation: "I found myself pausing my reading just to check if you were around.",
      tip: "'Pausing my reading' reflects taking time out of his favorite activity for you."
    },
    {
      text: "Has a good book stolen your attention away from me? 📖",
      translation: "Has a good book stolen your attention away from me?",
      tip: "'Stolen your attention' playfully compares reading to his rival for your time."
    },
    {
      text: "Leaving me waiting on read? How terribly cruel of a gentleman's heart... 😤💔",
      translation: "Leaving my message unread? How terribly cruel of a gentleman's heart...",
      tip: "A witty, charming expression of romantic dramatic dismay."
    },
    {
      text: "...",
      translation: "... (Silence... Julian is pouting in quiet until you reply)",
      tip: "Julian is pouting because you left him on read! Message him to break the silence."
    }
  ]
};

// Cooldown State Management (20-Second Send Cooldown)
let lastMessageSendTimestamp = 0;
let cooldownIntervalId = null;

function checkSendCooldown() {
  const elapsed = Date.now() - lastMessageSendTimestamp;
  if (elapsed < 20000) {
    return Math.ceil((20000 - elapsed) / 1000);
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
  }, 500);
  updateCooldownUI(checkSendCooldown());
}

function updateCooldownUI(remainingSec) {
  const submitBtn = document.getElementById("submitSentenceBtn");
  const sendFreeBtn = document.getElementById("sendFreeMsgBtn") || document.getElementById("sendFreeChatBtn");
  const freeInput = document.getElementById("freeChatInput");
  const cooldownBanner = document.getElementById("chatCooldownBanner");
  const cooldownText = document.getElementById("chatCooldownText");
  const chatControls = document.querySelector(".chat-controls");

  const lang = userState.uiLang || "en";
  const s = UI_STRINGS[lang] || UI_STRINGS.en;

  if (remainingSec > 0) {
    if (cooldownBanner) {
      cooldownBanner.style.display = "flex";
      if (cooldownText) {
        cooldownText.textContent = lang === "vi" 
          ? `Thời gian chờ — Vui lòng đợi ${remainingSec}s trước khi gửi tin tiếp theo...`
          : `Cooldown active — Please wait ${remainingSec}s before sending next message...`;
      }
    }

    if (chatControls) {
      chatControls.classList.add("cooldown-active");
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.cursor = "not-allowed";
      submitBtn.textContent = s.sendSentenceBtn || "Send Built Sentence ❤️";
    }
    if (sendFreeBtn) {
      sendFreeBtn.disabled = true;
      sendFreeBtn.style.cursor = "not-allowed";
      sendFreeBtn.textContent = "➤";
    }
    if (freeInput) {
      freeInput.disabled = true;
      if (!freeInput.dataset.origPlaceholder) {
        freeInput.dataset.origPlaceholder = freeInput.placeholder || "Type custom message in target language...";
      }
      freeInput.placeholder = lang === "vi" ? `Đang trong thời gian chờ (${remainingSec}s)...` : `Cooldown active (${remainingSec}s)...`;
    }
  } else {
    if (cooldownBanner) {
      cooldownBanner.style.display = "none";
    }

    if (chatControls) {
      chatControls.classList.remove("cooldown-active");
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.cursor = "pointer";
      submitBtn.textContent = s.sendSentenceBtn || "Send Built Sentence ❤️";
    }
    if (sendFreeBtn) {
      sendFreeBtn.disabled = false;
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
  totalHearts: parseInt(localStorage.getItem("otome_hearts")) || 0,
  streak: parseInt(localStorage.getItem("otome_streak")) || 1,
  currentTiers: JSON.parse(localStorage.getItem("otome_tiers")) || { bao: 1, julian: 1, group: 1 },
  affection: JSON.parse(localStorage.getItem("otome_affection")) || { bao: 10, julian: 10, group: 10 },
  chatStep: JSON.parse(localStorage.getItem("otome_chat_step")) || { bao: 0, julian: 0, group: 0 },
  chatHistories: JSON.parse(localStorage.getItem("otome_chats")) || {},
  unreadMessages: JSON.parse(localStorage.getItem("otome_unread")) || { bao: 0, julian: 0, group: 0 },
  isPouting: JSON.parse(localStorage.getItem("otome_pouting")) || { bao: false, julian: false, group: false },
  unrepliedCount: JSON.parse(localStorage.getItem("otome_unreplied_count")) || { bao: 0, julian: 0, group: 0 },
  saidGoodbye: JSON.parse(localStorage.getItem("otome_said_goodbye")) || { bao: false, julian: false, group: false },
  selectedInputMode: JSON.parse(localStorage.getItem("otome_input_mode")) || {},
  showRomaji: localStorage.getItem("otome_show_romaji") !== "false",
  uiLang: localStorage.getItem("otome_ui_lang") || "en",
};

// Timestamps for LI messaging/impatience engine
let lastUserReplyTime = { bao: Date.now(), julian: Date.now(), group: Date.now() };
let lastLiCheckupTime = { bao: Date.now(), julian: Date.now(), group: Date.now() };
let lastMessageWasLi = { bao: false, julian: false, group: false };
let nextSpontaneousDelay = {
  bao: (7 + Math.random() * 3) * 60 * 1000,
  julian: (7 + Math.random() * 3) * 60 * 1000,
  group: (7 + Math.random() * 3) * 60 * 1000
};

// Runtime cache for dynamic AI generated next turn options
let dynamicWordBank = { bao: null, julian: null, group: null };

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

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initKeybinds();
  initOpenRouterKey();
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
  if (document.getElementById("secretDashboard").classList.contains("visible")) {
    document.getElementById("dashTotalClicks").textContent = analyticsData.clicks;
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
}

// UI Event Handlers & Tab Navigation
function initUI() {
  // Language Switcher Button Listener
  const langBtn = document.getElementById("uiLangToggleBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      userState.uiLang = userState.uiLang === "en" ? "vi" : "en";
      localStorage.setItem("otome_ui_lang", userState.uiLang);
      applyUiLanguage();
      logDashboardEvent(`🌐 UI Language switched to: ${userState.uiLang.toUpperCase()}`);
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

  // OpenRouter Key Save
  document.getElementById("saveKeyBtn").addEventListener("click", () => {
    const key = document.getElementById("openRouterKeyInput").value.trim();
    if (key) {
      localStorage.setItem("openrouter_api_key", key);
      updateKeySavedStatus(true);
    }
  });

  // Save Modal Key
  document.getElementById("saveModalKeyBtn").addEventListener("click", () => {
    const key = document.getElementById("modalKeyInput").value.trim();
    if (key) {
      localStorage.setItem("openrouter_api_key", key);
      updateKeySavedStatus(true);
    }
    document.getElementById("apiKeyModal").style.display = "none";
  });

  // Skip Modal Key
  document.getElementById("skipModalKeyBtn").addEventListener("click", () => {
    document.getElementById("apiKeyModal").style.display = "none";
  });

  // Manual Convex Sync Button
  document.getElementById("manualSyncBtn").addEventListener("click", () => {
    syncUserDataToConvex("Manual button trigger");
  });

  // Close Active Chat Button
  document.getElementById("closeChatBtn").addEventListener("click", () => {
    document.getElementById("chatWindow").classList.remove("active");
    const tabBar = document.querySelector(".tab-bar");
    if (tabBar) tabBar.classList.remove("hidden-in-chat");
    activeCharacterId = null;
    renderChatList();
  });

  // Free Form Text Message Send Button
  document.getElementById("sendFreeMsgBtn").addEventListener("click", handleSendFreeMessage);
  document.getElementById("freeChatInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendFreeMessage();
  });

  // Submit Word Bank Sentence
  document.getElementById("submitSentenceBtn").addEventListener("click", handleSendWordBankMessage);

  // Secret Dashboard Manual Upload Button
  document.getElementById("dashUploadBtn").addEventListener("click", uploadAnalyticsToConvex);

  // Close Dashboard Button
  document.getElementById("closeDashBtn").addEventListener("click", () => {
    document.getElementById("secretDashboard").classList.remove("visible");
  });

  // Update Header Badges if present
  const heartsEl = document.getElementById("userHearts");
  if (heartsEl) heartsEl.textContent = userState.totalHearts;
  const streakEl = document.getElementById("userStreak");
  if (streakEl) streakEl.textContent = userState.streak;
}

// Switch Bottom Tabs
function switchTab(tabName) {
  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.remove("active");
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
        <div class="chat-meta">
          <span class="tier-badge">Tier ${tierNum}</span>
          <span class="affection-mini">❤️ ${affectionPct}% Affection</span>
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
  if (viTab) viTab.classList.toggle("active", currentGuidebookLang === "vi");
  if (enTab) enTab.classList.toggle("active", currentGuidebookLang === "en");

  if (currentGuidebookLang === "vi") {
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
  analyticsData.characterInteractions[charId]++;
  
  // Hide bottom tab bar while in chat window
  const tabBar = document.querySelector(".tab-bar");
  if (tabBar) tabBar.classList.add("hidden-in-chat");

  // Clear unread, pout status, and unreplied count when opening chat
  userState.unreadMessages[charId] = 0;
  userState.isPouting[charId] = false;
  if (!userState.unrepliedCount) userState.unrepliedCount = { bao: 0, julian: 0 };
  userState.unrepliedCount[charId] = 0;
  lastUserReplyTime[charId] = Date.now();
  lastMessageWasLi[charId] = false;
  saveLocalState();
  renderChatList();

  const char = CHARACTERS[charId];
  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
  const affectionPct = userState.affection[charId] || 0;

  // Set Chat Header Info
  document.getElementById("chatHeaderName").innerHTML = `${char.name} <span>${char.flag}</span>`;
  document.getElementById("chatHeaderAvatar").src = char.avatar;
  document.getElementById("chatHeaderTier").textContent = `Tier ${tierNum}: ${tierObj.name.split(":")[1] || tierObj.name}`;
  document.getElementById("chatHeaderAffection").textContent = `❤️ ${affectionPct}%`;

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
  document.getElementById("chatWindow").classList.add("active");

  // Update Cooldown State in Chat Box UI
  updateCooldownUI(checkSendCooldown());
}

window.openChatroom = openChatroom;

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

      group.innerHTML = `
        <img src="${speakerAvatar}" class="msg-avatar" alt="${speakerName}" />
        <div class="msg-body">
          <div class="msg-sender" ${speakerStyle}>${speakerName}</div>
          <div class="msg-bubble">
            <div style="font-size:15px; font-weight:700;">${msg.text}</div>
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
      group.innerHTML = `
        <div class="msg-body">
          <div class="msg-bubble">${msg.text}</div>
          <div class="msg-time">${msg.time || "11:42 PM"}</div>
        </div>
      `;
    }

    container.appendChild(group);
  });

  container.scrollTop = container.scrollHeight;
}

// Contextual Word Chips Generator for Sentence Builder
function generateContextualWordChips(charId, lastMsgText) {
  const text = (lastMsgText || "").toLowerCase();

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
  } else {
    let prompt = "Build your reply to Julian (English 🇬🇧):";
    let chips = ["Good day", "Julian", "I am", "happy to", "talk with", "you", "today"];

    if (text.includes("book") || text.includes("reading") || text.includes("poem") || text.includes("novel")) {
      prompt = 'Build reply: "I would love to read that poem together with you."';
      chips = ["I would", "love to", "read that", "poem", "with you", "Julian", "sounds wonderful"];
    } else if (text.includes("free") || text.includes("afternoon") || text.includes("thinking") || text.includes("around")) {
      prompt = 'Build reply: "I was hoping to hear from you as well."';
      chips = ["I was", "hoping to", "hear from", "you", "as well", "Julian", "delighted"];
    } else if (text.includes("cruel") || text.includes("read") || text.includes("cold") || text.includes("wait")) {
      prompt = 'Build reply: "Forgive me Julian! I was distracted for a moment."';
      chips = ["Forgive me", "Julian", "I was", "distracted", "I missed", "you too", "my apologies"];
    }
    return { prompt, chips };
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
  const remaining = checkSendCooldown();
  if (remaining > 0) return;

  if (currentConstructedWords.length === 0) {
    alert("Please click word chips to build a sentence first!");
    return;
  }

  // Trigger 20s cooldown
  lastMessageSendTimestamp = Date.now();
  startSendCooldownTimer();

  const constructedText = currentConstructedWords.join(" ");
  analyticsData.answersSubmitted++;

  // Add User Message
  addUserMessageToHistory(constructedText);

  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;
  dynamicWordBank[activeCharacterId] = null;

  const tierNum = userState.currentTiers[activeCharacterId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];

  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 8);
  triggerHeartBurst();

  // Fetch AI Response
  await triggerLLMResponse(constructedText, tierObj);
}

// Handle Free-Form Text Chat Message
async function handleSendFreeMessage() {
  const remaining = checkSendCooldown();
  if (remaining > 0) return;

  const input = document.getElementById("freeChatInput");
  const text = input.value.trim();
  if (!text) return;

  // Trigger 20s cooldown
  lastMessageSendTimestamp = Date.now();
  startSendCooldownTimer();

  input.value = "";
  analyticsData.answersSubmitted++;

  addUserMessageToHistory(text);

  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;

  const tierNum = userState.currentTiers[activeCharacterId] || 8;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[7];

  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 10);
  triggerHeartBurst();

  await triggerLLMResponse(text, tierObj);
}

// Add User Message to History & LocalStorage
function addUserMessageToHistory(text) {
  const history = userState.chatHistories[activeCharacterId] || [];
  history.push({
    sender: "user",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  userState.chatHistories[activeCharacterId] = history;

  // Reset unreplied tracking, pout state & timers when user responds
  if (!userState.unrepliedCount) userState.unrepliedCount = { bao: 0, julian: 0, group: 0 };
  if (!userState.saidGoodbye) userState.saidGoodbye = { bao: false, julian: false, group: false };

  userState.unrepliedCount[activeCharacterId] = 0;
  userState.isPouting[activeCharacterId] = false;

  if (isFarewellMessage(text)) {
    userState.saidGoodbye[activeCharacterId] = true;
    lastMessageWasLi[activeCharacterId] = false;
    logDashboardEvent(`👋 User said goodbye to ${CHARACTERS[activeCharacterId].name}. Stopping automatic texts for this chat.`);
  } else {
    userState.saidGoodbye[activeCharacterId] = false;
  }

  lastUserReplyTime[activeCharacterId] = Date.now();
  lastLiCheckupTime[activeCharacterId] = Date.now();
  lastMessageWasLi[activeCharacterId] = false;
  nextSpontaneousDelay[activeCharacterId] = (7 + Math.random() * 3) * 60 * 1000;

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
  const char = CHARACTERS[activeCharacterId];

  showTypingIndicator(char);

  let responseData = null;

  try {
    logDashboardEvent(`Sending Gemini API request via /api/chat for ${char.name}...`);
    
    const history = userState.chatHistories[activeCharacterId] || [];

    // TOKEN SAVING STRATEGY: Limit history context to last 4 messages (2 turns)
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId: char.id,
        characterName: char.name,
        characterLanguage: char.language,
        isGroup: char.isGroup || false,
        userText: userText,
        tierLevel: tierObj.level,
        recentHistory: history.slice(-4),
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
    logDashboardEvent(`Gemini API call glitch/error: ${err.message}. Sending in-character recovery text.`);
    removeTypingIndicator();

    const history = userState.chatHistories[activeCharacterId] || [];
    const charKey = activeCharacterId === "group" ? "group" : activeCharacterId;

    const glitchPool = ERROR_GLITCH_MESSAGES[charKey] || ERROR_GLITCH_MESSAGES.julian;
    const recoveryPool = ERROR_RECOVERY_MESSAGES[charKey] || ERROR_RECOVERY_MESSAGES.julian;

    const glitchText = glitchPool[Math.floor(Math.random() * glitchPool.length)];
    const recoveryText = recoveryPool[Math.floor(Math.random() * recoveryPool.length)];

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Send Glitch Message
    if (charKey === "group") {
      history.push({
        sender: "li",
        speaker: "bao",
        speakerName: "Bao Nguyen",
        text: glitchText,
        translation: "Glitch message.",
        tip: "Phone signal recovery.",
        time: timeStr,
      });
    } else {
      history.push({
        sender: "li",
        text: glitchText,
        translation: "Hold on a second, my phone is glitching... let me fix it.",
        tip: "Phone signal recovery.",
        time: timeStr,
      });
    }

    userState.chatHistories[activeCharacterId] = history;
    saveLocalState();
    renderChatHistory();

    // Show typing indicator again and send recovery message after 1.5s
    setTimeout(() => {
      showTypingIndicator(char);
      setTimeout(() => {
        removeTypingIndicator();
        const updatedHistory = userState.chatHistories[activeCharacterId] || [];
        const recoveryTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (charKey === "group") {
          updatedHistory.push({
            sender: "li",
            speaker: "julian",
            speakerName: "Julian Vance",
            text: recoveryText,
            translation: "All fixed now! What were you saying?",
            tip: "Recovery message.",
            time: recoveryTimeStr,
          });
        } else {
          updatedHistory.push({
            sender: "li",
            text: recoveryText,
            translation: "Okay fixed! What were you saying?",
            tip: "Recovery message.",
            time: recoveryTimeStr,
          });
        }

        userState.chatHistories[activeCharacterId] = updatedHistory;
        saveLocalState();
        renderChatHistory();
        setupTierInputControls(tierObj, char);
      }, 1500);
    }, 1000);

    return;
  }

  removeTypingIndicator();

  // Show Side Grammar Feedback & Encouragement Panel
  showGrammarFeedback(
    responseData.isCorrect !== false,
    responseData.correction || responseData.fix,
    responseData.encouragement
  );

  const history = userState.chatHistories[activeCharacterId] || [];

  if (activeCharacterId === "group" && responseData.groupResponses && responseData.groupResponses.length > 0) {
    responseData.groupResponses.forEach((resp) => {
      history.push({
        sender: "li",
        speaker: resp.speaker || "bao",
        speakerName: resp.speakerName || (resp.speaker === "julian" ? "Julian Vance" : "Bao Nguyen"),
        text: resp.text,
        translation: resp.translation,
        tip: resp.tip,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    });
  } else {
    history.push({
      sender: "li",
      text: responseData.characterResponse || responseData.text,
      romaji: responseData.romaji || null,
      translation: responseData.translation,
      tip: responseData.tip,
      fix: responseData.correction || responseData.fix,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  }

  userState.chatHistories[activeCharacterId] = history;

  lastMessageWasLi[activeCharacterId] = true;
  lastLiCheckupTime[activeCharacterId] = Date.now();

  checkTierLevelUp(activeCharacterId);

  saveLocalState();
  renderChatHistory();

  // Refresh input controls for NEXT turn
  setupTierInputControls(tierObj, char);

  // Auto Sync to Convex Cloud
  syncUserDataToConvex(`Post-chat response sync (${char.name})`);
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

    charIds.forEach((charId) => {
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

      // 1. Unreplied Progression: If LI sent a message and user hasn't replied in >25 seconds
      if (lastMessageWasLi[charId] && timeSinceCheckup > 25000) {
        if (!userState.unrepliedCount) userState.unrepliedCount = { bao: 0, julian: 0 };
        const stage = userState.unrepliedCount[charId] || 0;
        const seq = UNREPLIED_SEQUENCE[charId];

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
        const pool = SPONTANEOUS_CHECKUPS[charId];
        if (pool && pool.length > 0) {
          const checkup = pool[Math.floor(Math.random() * pool.length)];

          if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          userState.chatHistories[charId].push({
            sender: "li",
            text: checkup.text,
            romaji: checkup.romaji || null,
            translation: checkup.translation,
            tip: checkup.tip,
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
