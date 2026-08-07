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

//// Character Definitions
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
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdKdWwiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjYjkxYzFjIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ0p1bCkiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmVmM2M3Ii8+PHBhdGggZD0iTTMxIDMwIHExOCAtMTIgMzQgMCBxLTYgMjQgLTM4IDAiIGZpbGw9IiM3ODM5MGYiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiM3ODM5MGYiLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiM3ODM5MGYiLz48cGF0aCBkPSJNNTYgNDkgcTQgMyA4IDAiIHN0cm9rZT0iIzc4MzUwZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
    role: "Literature Scholar & Architect",
    personality: "Composed, intellectual scholar. Starts reserved, but gets charmed as you chat.",
    greeting: "Good day. Did you need something?",
    greetingTranslation: "Good day. Did you need something?",
    greetingTip: "'Good day' is a formal polite greeting. 'Did you need something?' is a reserved inquiry.",
    sampleVoice: "Refined British scholar",
  },
  ren: {
    id: "ren",
    name: "Ren Takahashi (高橋 蓮)",
    language: "Japanese",
    flag: "🇯🇵",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdSZW4iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNDMxNDA3Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjYjkxYzFjIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ1JlikiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmVlMmUyIi8+PHBhdGggZD0iTTI4IDI4IHExNSAtMTQgNDQgMCBxLTEwIDI2IC00NCAwIiBmaWxsPSIjMTgxODE4Ii8+PHBhdGggZD0iTTQyIDQwIGwyIDMgbTExIC0zIGwtMiAzIiBzdHJva2U9IiMxODE4MTgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTQ2IDQ4IHE0IDIgOCAwIiBzdHJva2U9IiMxODE4MTgiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    role: "Manga Illustrator & Tea Master",
    personality: "Tsundere artistic soul. Acts slightly cool and aloof, but gets soft and blushes when you text him in Japanese.",
    greeting: "こんにちは。何か用ですか？",
    romaji: "Konnichiwa. Nanika you desu ka?",
    greetingTranslation: "Hello. Do you have business with me?",
    greetingTip: "'Konnichiwa' is 'Hello'. 'Nanika you desu ka?' is a polite 'Do you need something?'",
    sampleVoice: "Cool soft-spoken Tokyo accent",
  },
  minjun: {
    id: "minjun",
    name: "Min-jun Park (박민준)",
    language: "Korean",
    flag: "🇰🇷",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdNaW4iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWU0MGFmIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM2IxODY4Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ01pbikiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZGJlYWZlIi8+PHBhdGggZD0iTTI5IDI3IHExOCAtMTMgMzYgMCBxLTggMjUgLTM2IDAiIGZpbGw9IiMxZTI5M2IiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQwIiByPSIyLjUiIGZpbGw9IiMxZTI5M2IiLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjQwIiByPSIyLjUiIGZpbGw9IiMxZTI5M2IiLz48cGF0aCBkPSJNNDQgNDggcTYgNCAxMiAwIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    role: "K-Pop Producer & Music Director",
    personality: "Warm, energetic, and protective oppa. Always asks if you've eaten and sends cheerful music updates.",
    greeting: "안녕하세요! 오늘 기분은 어때요?",
    romaji: "Annyeonghaseyo! Oneul gibun-eun eotteoyo?",
    greetingTranslation: "Hello! How are you feeling today?",
    greetingTip: "'Annyeonghaseyo' is polite 'Hello'. 'Oneul gibun-eun eotteoyo?' asks about your mood.",
    sampleVoice: "Warm cheerful Seoul cadence",
  },
  chen: {
    id: "chen",
    name: "Chen Wei (陈伟)",
    language: "Chinese",
    flag: "🇨🇳",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdDaGVuIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzk5MWIxYiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2Q5NzcwNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSJ1cmwoI2dDaGVuKSIvPjxwYXRoIGQ9Ik01MCAxNSBjLTE2IDAgLTI2IDEyIC0yNiAyNiBjMCAxMSA2IDE4IDE0IDIyIGMtMTggNiAtMjYgMTggLTI2IDM1IGg3NiBjMCAtMTcgLTggLTI5IC0yNiAtMzUgYzE4IC00IDE0IC0xMSAxNCAtMjIgYzAgLTE0IC0xMCAtMjYgLTI2IC0yNiB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjk1Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI0MCIgcj0iMTUiIGZpbGw9IiNmZWYzYzciLz48cGF0aCBkPSJNMzAgMjYgcTE3IC0xMiAzNCAwIHEtNyAyNCAtMzQgMCIgZmlsbD0iIzI3MjcyNyIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iNDAiIHI9IjIuNSIgZmlsbD0iIzI3MjcyNyIvPjxjaXJjbGUgY3g9IjU4IiBjeT0iNDAiIHI9IjIuNSIgZmlsbD0iIzI3MjcyNyIvPjxwYXRoIGQ9Ik00NSA0OCBxNSA0IDEwIDAiIHN0cm9rZT0iIzI3MjcyNyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
    role: "Calligrapher & Tech Founder",
    personality: "Deeply chivalrous and attentive gentleman. Speaks poetic and sweet Mandarin, caring for your peace of mind.",
    greeting: "你好，今天过得怎么样？",
    romaji: "Nǐ hǎo, jīntiān guò de zěnmeyàng?",
    greetingTranslation: "Hello, how has your day been going?",
    greetingTip: "'Nǐ hǎo' is 'Hello'. 'Jīntiān guò de zěnmeyàng?' asks how your day is going.",
    sampleVoice: "Resonant gentle Mandarin tone",
  },
  group: {
    id: "group",
    name: "Global Otome Lounge 💬",
    isGroup: true,
    language: "Multilingual Exchange",
    flag: "🇻🇳🇬🇧🇯🇵🇰🇷🇨🇳",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdHcm91cCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwNTk2NjkiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNiOTFjMWMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0idXJsKCNnR3JvdXApIi8+PHBhdGggZD0iTTM1IDIzIGMtMTAgMCAtMTYgOCAtMTYgMTcgYzAgNyA0IDExIDkgMTQgYy0xMSA0IC0xNiAxMSAtMTYgMjIgaDQ3IGMwIC0xMSAtNSAtMTggLTE2IC0yMiBjMTEgLTMgOSAtNyA5IC0xNCBjMCAtOSAtNiAtMTcgLTE2IC0xNyB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjk1Ii8+PHBhdGggZD0iTTY1IDMwIGMtOCAwIC0xMyA2IC0xMyAxNCBjMCA2IDMgOSA3IDExIGMtOSAzIC0xMyA5IC0xMyA0OCBoMzggYzAgLTkgLTQgLTE1IC0xMyAtMTggYzkgLTIgNyAtNSA3IC0xMSBjMCAtOCAtNSAtMTQgLTEzIC0xNCB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjc1Ii8+PC9zdmc+',
    role: "Bao, Julian, Ren, Min-jun & Chen",
    personality: "Playful multi-way romantic rivalry & language lounge! All five love interests compete for your affection while sharing phrases with native script and Romaji!",
    greeting: "Welcome to the lounge! All 5 love interests are competing to charm you while teaching you languages with script & Romaji!",
    greetingTranslation: "Welcome to the lounge! All 5 love interests are competing to charm you while teaching you languages with script & Romaji!",
    greetingTip: "Give compliments to your favorite love interest or practice phrases with all of them!",
    sampleVoice: "Multilingual group harmony",
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
  ren: [
    { text: "こんにちは。今、少しお時間ありますか？ 🍵", romaji: "Konnichiwa. Ima, sukoshi o-jikan arimasu ka?", translation: "Hello. Do you have a moment right now? 🍵", tip: "'O-jikan arimasu ka?' asks 'Do you have time?' in polite Japanese." },
    { text: "ふとお顔が浮かびました。お元気ですか？", romaji: "Futo o-kao ga ukabimashita. O-genki desu ka?", translation: "Your face suddenly came to mind. How are you?", tip: "'O-genki desu ka?' means 'How are you?'" },
    { text: "美味しいお茶が入りました。一緒にいかがですか？", romaji: "Oishii o-cha ga hairimashita. Issho ni ikaga desu ka?", translation: "I brewed some delicious green tea. Would you like to join me?", tip: "'Oishii o-cha' means delicious green tea." }
  ],
  minjun: [
    { text: "안녕하세요! 지금 잠시 시간 있으신가요? 🎵", romaji: "Annyeonghaseyo! Jigeum jamsi sigan isseusingayo?", translation: "Hello! Do you have a moment right now? 🎵", tip: "'Sigan isseusingayo?' is a polite check for availability." },
    { text: "갑자기 생각나서 연락했어요. 오늘 하루 어땠어요?", romaji: "Gapjagi saenggangnaseo yeollakhaessoyo. Oneul haru eottaessoyo?", translation: "I texted because I suddenly thought of you. How was your day?", tip: "'Gapjagi' means 'suddenly'." },
    { text: "새 노래 작업하다가 생각났어요.", romaji: "Sae norae jageobhadaga saenggangnassoyo.", translation: "I thought of you while working on a new song.", tip: "'Sae norae' means 'new song'." }
  ],
  chen: [
    { text: "你好，此刻有空聊聊天吗？ 🍵", romaji: "Nǐ hǎo, cǐkè yǒu kòng liáoliáo tiān ma?", translation: "Hello, do you have time to chat right now? 🍵", tip: "'Yǒu kòng' means to have free time." },
    { text: "泡了一壶好茶，不知不觉便想起了你。", romaji: "Pào le yì hú hǎo chá, bù zhī bù jué biàn xiǎng qǐ le nǐ.", translation: "I brewed a pot of fine tea and unwittingly thought of you.", tip: "'Bù zhī bù jué' means unconsciously / unwittingly." },
    { text: "今天过得可好？愿你一切顺意。", romaji: "Jīntiān guò de kě hǎo? Yuàn nǐ yíqiè shùnyì.", translation: "How is your day going? Wishing you all the best.", tip: "'Yuàn nǐ yíqiè shùnyì' means wishing you everything goes smoothly." }
  ],
  group: [
    { text: "MC, free to chat? Everyone is hanging out in the lounge!", translation: "MC, free to chat? Everyone is hanging out in the lounge!", tip: "Group invitation to chat." },
    { text: "We are all sharing tea and music, come join us when you can!", translation: "We are all sharing tea and music, come join us when you can!", tip: "Friendly group invite." }
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
  ],
  ren: [
    {
      text: "こんにちは。お茶でも淹れましょうか？",
      romaji: "Konnichiwa. O-cha demo iremashou ka?",
      translation: "Hello. Shall I brew us some tea?",
      tip: "'O-cha' is green tea, a staple of Japanese hospitality."
    },
    {
      text: "どこかへ行ってしまいましたか…？少し寂しいです。",
      romaji: "Dokoka he itte shimaimashita ka...? Sukoshi sabishii desu.",
      translation: "Did you go somewhere...? I feel a bit lonely.",
      tip: "'Sukoshi sabishii' means 'a bit lonely'."
    },
    {
      text: "返事がありませんね… 私、何か失礼なことを言いましたか？ 🍵💔",
      romaji: "Henji ga arimasen ne... Watashi, nanika shitsurei na koto wo iimashita ka?",
      translation: "No reply... Did I say something rude? 🍵💔",
      tip: "'Henji ga arimasen' means 'there is no reply'."
    },
    {
      text: "...",
      translation: "... (Silence... Ren is quietly pouting over tea until you reply)",
      tip: "Ren is pouting! Message him to cheer him up."
    }
  ],
  minjun: [
    {
      text: "안녕하세요! 밥은 먹었어요?",
      romaji: "Annyeonghaseyo! Babeun meogeosseoyo?",
      translation: "Hello! Have you eaten rice yet?",
      tip: "'Babeun meogeosseoyo?' is a warm Korean way to show care."
    },
    {
      text: "어디 갔어요? 보고 싶어서 연락했어요~ 🎵",
      romaji: "Eodi gasseoyo? Bogo sip-eoseo yeollakhaessoyo~",
      translation: "Where did you go? I messaged because I missed you~",
      tip: "'Bogo sip-eoseo' means 'because I missed seeing you'."
    },
    {
      text: "안 답해주면 삐칠 거예요! 😾💔",
      romaji: "An dap-hae-jumeon ppichil geoyeyo!",
      translation: "If you don't reply I'm going to pout! 😾💔",
      tip: "'Ppichil geoyeyo' means 'I will pout'."
    },
    {
      text: "...",
      translation: "... (Silence... Min-jun is listening to music in quiet pout until you reply)",
      tip: "Min-jun is pouting! Text him to make his day."
    }
  ],
  chen: [
    {
      text: "你好，今日一切可顺遂？",
      romaji: "Nǐ hǎo, jīnrì yíqiè kě shùnsuì?",
      translation: "Hello, has everything been going smoothly today?",
      tip: "'Shùnsuì' means smooth / favorable."
    },
    {
      text: "看到这壶茶慢慢变凉，忽然很想念你。",
      romaji: "Kàndào zhè hú chá mànmàn biàn liáng, hūrán hěn xiǎngniàn nǐ.",
      translation: "Seeing this pot of tea slowly grow cold, I suddenly missed you deeply.",
      tip: "'Mànmàn biàn liáng' means slowly growing cold."
    },
    {
      text: "尚在等候你的音讯... 🍵💔",
      romaji: "Shàng zài děnghòu nǐ de yīnxùn...",
      translation: "Still awaiting your news... 🍵💔",
      tip: "'Děnghòu' means patiently awaiting."
    },
    {
      text: "...",
      translation: "... (Silence... Chen is quietly pouting in reflection until you reply)",
      tip: "Chen is pouting! Send a text to warm his heart."
    }
  ]
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
  userProfile: JSON.parse(localStorage.getItem("otome_user_profile")) || {
    name: localStorage.getItem("otome_user_name") || "MC",
    pronouns: localStorage.getItem("otome_user_pronouns") || "she/her",
    age: localStorage.getItem("otome_user_age") || "20",
  },
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

function saveUserProfileFromModal() {
  const modalName = document.getElementById("modalUserName")?.value || "";
  const modalPronouns = document.getElementById("modalUserPronouns")?.value || "she/her";
  const modalAge = document.getElementById("modalUserAge")?.value || "20";

  saveUserProfile(modalName, modalPronouns, modalAge);

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
  } else if (charId === "minjun") {
    let prompt = "Build your reply to Min-jun (Korean 🇰🇷):";
    let chips = ["안녕하세요", "민준씨", "감사합니다", "좋아요", "노래", "보고 싶어요", "오늘 하루도", "수고했어요"];

    if (text.includes("기분") || text.includes("시간") || text.includes("time")) {
      prompt = 'Build reply: "Hello Min-jun! I am doing great today."';
      chips = ["안녕하세요", "민준씨", "오늘", "기분 정말", "좋아요", "감사합니다", "수고하셨어요"];
    } else if (text.includes("노래") || text.includes("song") || text.includes("music")) {
      prompt = 'Build reply: "Hello Min-jun! Your new song sounds wonderful."';
      chips = ["안녕하세요", "민준씨", "노래가", "정말 좋아요", "감사합니다", "자주 들을게요"];
    }
    return { prompt, chips };
  } else if (charId === "chen") {
    let prompt = "Build your reply to Chen (Chinese 🇨🇳):";
    let chips = ["你好", "陈伟", "谢谢你", "很高兴", "喝茶", "一起", "今天", "很开心"];

    if (text.includes("茶") || text.includes("tea")) {
      prompt = 'Build reply: "Hello Chen! Thank you for brewing tea for me."';
      chips = ["你好", "陈伟", "谢谢你的茶", "茶香真美好", "我也很高兴", "很高兴见到你"];
    } else if (text.includes("样") || text.includes("心") || text.includes("how")) {
      prompt = 'Build reply: "Hello Chen! I am having a wonderful day."';
      chips = ["你好", "陈伟", "我今天", "过得很好", "谢谢你的关心", "非常开心"];
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
    showGrammarFeedback(
      responseData.isCorrect !== false,
      responseData.correction || responseData.fix,
      responseData.encouragement
    );

    const history = userState.chatHistories[charId] || [];

    if ((charId === "group" || char.isGroup) && responseData.groupResponses && responseData.groupResponses.length > 0) {
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
        text: responseData.characterResponse || responseData.text || "Cảm ơn em! Tớ rất vui được trò chuyện với em ❤️",
        romaji: responseData.romaji || null,
        translation: responseData.translation || "Thank you! I am very happy chatting with you ❤️",
        tip: responseData.tip || "Keep practicing your conversation skills!",
        fix: responseData.correction || responseData.fix || null,
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

  if (isGroup) {
    let baoText = "Em nhắn gì dễ thương quá! Coi nè, anh pha ly cà phê thơm phức cho em rồi đó! ☕❤️";
    let julianText = "Ah, MC! Splendid message indeed! I must say, your company brightens my whole day! ✨";

    if (normText.includes("cà phê") || normText.includes("coffee")) {
      baoText = "Đó thấy chưa! Cà phê anh pha là ngon nhất luôn! Em uống ngụm nữa nha? ☕";
      julianText = "Bao's coffee is acceptable, but my passion for literature with you is unmatched, MC!";
    } else if (normText.includes("cả hai") || normText.includes("both") || normText.includes("thích")) {
      baoText = "Cảm ơn em nhiều nha! Em khen anh làm anh vui ghê luôn á! ❤️";
      julianText = "You are far too kind, MC! Your warmth touches my heart deeply.";
    }

    return {
      isGroup: true,
      groupResponses: [
        {
          speaker: "bao",
          speakerName: "Bao Nguyen 🇻🇳",
          text: baoText,
          translation: "Bao: What a sweet message! Look, I brewed a fragrant coffee for you! ☕❤️",
          tip: "Bao is showing his affectionate side! 'Thơm phức' means very fragrant."
        },
        {
          speaker: "julian",
          speakerName: "Julian Vance 🇬🇧",
          text: julianText,
          translation: "Julian: Splendid message indeed! Your company brightens my day! ✨",
          tip: "Julian loves chatting with you in group chat!"
        }
      ],
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "Wonderful effort! Your phrase was natural and clear.",
      contextualChipsPrompt: "Build your reply to Bao & Julian:",
      contextualChips: ["Cảm ơn hai anh", "Hai anh dễ thương quá", "Cà phê ngon lắm", "I love chatting with both of you", "Gặp lại sau nhé"]
    };
  } else if (char.id === "bao") {
    let respText = "Cảm ơn em nha! Nghe em nói làm anh vui cả ngày luôn á. Em uống cà phê chưa? ☕";
    let trans = "Thank you sweetheart! Hearing you talk made my whole day happy. Have you had coffee yet?";
    let tip = "'Cảm ơn em' is a warm way to say thank you to someone younger or a sweetheart.";

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

    return {
      characterResponse: respText,
      translation: trans,
      tip: tip,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: "Tuyệt vời! Cụm từ của em rất chính xác và tự nhiên.",
      contextualChipsPrompt: "Build your reply to Bao (Vietnamese 🇻🇳):",
      contextualChips: ["Cho em một ly cà phê", "Cảm ơn anh Bao", "Anh Bao rất dễ thương", "Em rảnh nè", "Hẹn gặp lại anh"]
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
