/**
 * Otome Lingua - App Logic Engine
 * Duolingo competitor disguised as Mystic Messenger Otome Sim
 * Features 10-Tier progression, Gemma 4 OpenRouter LLM, Contextual Sentence Builder,
 * Free Text Chat, Convex Sync & Telemetry Dashboard
 */

import { inject } from "@vercel/analytics";
import { STORY_SCENARIOS, getScenarioQuestions } from "./storyData.js";
import { VN_SCENERY_SVGS, VN_SPRITES, playVNSound, speakVNLine } from "./src/vnVisuals.js";

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
  ado: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gAdo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gAdo)"/>
    <path d="M50 15 c-16 0 -26 12 -26 26 c0 11 6 18 14 22 c-18 6 -26 18 -26 35 h76 c0 -17 -8 -29 -26 -35 c18 -4 14 -11 14 -22 c0 -14 -10 -26 -26 -26 z" fill="#ffffff" opacity="0.95"/>
    <circle cx="50" cy="40" r="15" fill="#fce7f3"/>
    <path d="M30 32 q20 -12 40 0 q-18 24 -40 0" fill="#9d174d"/>
    <circle cx="42" cy="41" r="2.5" fill="#9d174d"/>
    <circle cx="58" cy="41" r="2.5" fill="#9d174d"/>
    <path d="M44 48 q6 6 12 0" stroke="#9d174d" stroke-width="2" fill="none"/>
  </svg>`),

  kou: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gKou" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e40af"/>
        <stop offset="100%" stop-color="#3b82f6"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gKou)"/>
    <path d="M50 15 c-16 0 -26 12 -26 26 c0 11 6 18 14 22 c-18 6 -26 18 -26 35 h76 c0 -17 -8 -29 -26 -35 c18 -4 14 -11 14 -22 c0 -14 -10 -26 -26 -26 z" fill="#ffffff" opacity="0.95"/>
    <circle cx="50" cy="40" r="15" fill="#dbeafe"/>
    <path d="M31 30 q18 -12 34 0 q-6 24 -38 0" fill="#1e3a8a"/>
    <circle cx="42" cy="41" r="2.5" fill="#1e3a8a"/>
    <circle cx="58" cy="41" r="2.5" fill="#1e3a8a"/>
    <path d="M46 49 q4 2 8 0" stroke="#1e3a8a" stroke-width="2" fill="none"/>
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
  </svg>`)
};

// Aliases for legacy avatars
SVG_AVATARS.bao = SVG_AVATARS.ado;
SVG_AVATARS.julian = SVG_AVATARS.kou;

function getUserVietnameseAddressTerms() {
  const pronouns = (typeof userState !== "undefined" && userState.userProfile && userState.userProfile.pronouns)
    ? String(userState.userProfile.pronouns).toLowerCase()
    : "she/her";
  const isMale = pronouns.includes("he") || pronouns.includes("him");
  const olderUserTerm = isMale ? "anh" : "chị";
  const olderUserCap = isMale ? "Anh" : "Chị";
  return {
    isMale,
    olderUserTerm, // Kou addresses user as 'anh' or 'chị'
    olderUserCap,  // 'Anh' or 'Chị'
    youngerUserTerm: "em", // Ren addresses user as 'em' / 'nhóc', Kou refers to himself as 'em'
    youngerUserCap: "Em",
    classmateTerm: "cậu",
    classmateSelf: "tớ"
  };
}

const BASE_CHARACTERS = {
  ado: {
    id: "ado",
    name: "Ado",
    avatar: "/assets/characters/ado_avatar.png",
    sprite: "/assets/characters/ado_fullbody.png",
    archetype: "Strict Classmate",
    role: "Strict & Reliable Classmate",
    personality: "Strict, dutiful classmate who keeps you on track. Tsundere at heart—acts tough and official, but blushes and softens up when you get close.",
    sampleVoice: "Clear, composed classmate voice",
    greetings: {
      vi: {
        text: "Này, cậu lại đi trễ đấy à? Tớ đã chuẩn bị sẵn tài liệu học tập cho cậu rồi... Đừng có nhìn tớ như thế, tớ chỉ làm tròn trách nhiệm lớp phó thôi!",
        translation: "Hey, are you late again? I prepared the study notes for you... Don't look at me like that, I'm just doing my duty as classmate!",
        tip: "'Trách nhiệm' means 'responsibility/duty'. Ado is secretly caring for you!"
      },
      en: {
        text: "Hey, running late again? I already prepared the study notes for you... Don't look at me like that, I'm just doing my duty as classmate!",
        translation: "Hey, running late again? I already prepared the study notes for you... Don't look at me like that, I'm just doing my duty as classmate!",
        tip: "Ado acts strict on the outside, but is secretly thoughtful and caring."
      },
      ja: {
        text: "ちょっと、また遅刻？勉強のノート、まとめておいたから… そんな目で見ないでよ、クラスメイトとして当然のことでしょ！",
        romaji: "Chotto, mata chikoku? Benkyou no nootu, matomete oita kara... sonna me de minai de yo, kurasumeito to shite touzen no koto desho!",
        translation: "Hey, late again? I put together study notes for you... Don't look at me like that, it's only natural as classmates!",
        tip: "'Touzen' means 'only natural/duty'. Ado is classic tsundere!"
      }
    }
  },
  kou: {
    id: "kou",
    name: "Kou",
    avatar: "/assets/characters/kou_avatar.png",
    sprite: "/assets/characters/kou_fullbody.png",
    archetype: "Cute Junior",
    role: "Cute & Clingy Underclassman",
    personality: "Cute, innocent, and clingy underclassman. Always follows you around, adores you, and seeks your attention and affection!",
    sampleVoice: "Sweet, energetic junior accent",
    greetings: {
      vi: {
        text: "Chị ơi! Kou tìm chị mãi đó! Hôm nay chị có rảnh chơi với em không?",
        translation: "Chị! Kou has been looking everywhere for you! Are you free to play with Kou today?",
        tip: "'Chị' (or 'Anh' depending on pronouns) is how younger people affectionately address an older person. Kou refers to himself as 'em'. 'Có rảnh' means 'Are you free'."
      },
      en: {
        text: "Senpai! Kou has been looking everywhere for you! Are you free to spend time with Kou today?",
        translation: "Senpai! Kou has been looking everywhere for you! Are you free to spend time with Kou today?",
        tip: "'Senpai' is a term of respect and affection for an upperclassman."
      },
      ja: {
        text: "先輩！Kou、ずっと先輩を探してたんですよ！今日はKouと一緒に過ごしてくれますか？",
        romaji: "Senpai! Kou, zutto senpai wo sagashitetan desu yo! Kyou wa Kou to issho ni tsugoshite kuremasu ka?",
        translation: "Senpai! Kou has been looking for you! Will you spend time with Kou today?",
        tip: "'Senpai' is an upperclassman. 'Issho ni' means 'together'."
      }
    }
  },
  ren: {
    id: "ren",
    name: "Ren",
    avatar: "/assets/characters/ren_avatar.png",
    sprite: "/assets/characters/ren_fullbody.png",
    archetype: "Flirty Senior",
    role: "Flirty & Assertive Senior",
    personality: "Aggressive, flirty, teasing senior (senpai). Loves to bully and tease you playfully, asserting his charm whenever you're around.",
    sampleVoice: "Sultry, confident senior accent",
    greetings: {
      vi: {
        text: "Thấy anh mà không chào sao, nhóc? Lại đây ngồi gần anh nào... Để xem hôm nay em ngoan tới đâu.",
        translation: "Not even gonna greet me when you see me? Come sit close to me... Let's see how good you'll be today, kid.",
        tip: "'Nhóc' is a playful term for a younger person. Ren loves teasing you."
      },
      en: {
        text: "Not even gonna greet me when you see me? Come sit close to me... Let's see how good you'll be today, kid.",
        translation: "Not even gonna greet me when you see me? Come sit close to me... Let's see how good you'll be today, kid.",
        tip: "Ren is an assertive, flirty senior who loves teasing you playfully."
      },
      ja: {
        text: "俺を見かけたのに挨拶もなしか？こっち来て隣に座れよ… 今日はどこまで聞き分けがいいか試してやる。",
        romaji: "Ore wo mikakata noni aisatsu mo nashi ka? Kocchi kite tonari ni suware yo... Kyou wa doko made kikiwake ga ii ka tameshite yaru.",
        translation: "Not even greeting me when you spot me? Come over here and sit next to me... Let me test how good you are today.",
        tip: "'Ore' is confident male 'I' in Japanese. Ren is bold and assertive."
      }
    }
  }
};

function getCharacter(charId) {
  const targetLang = (typeof userState !== "undefined" && userState.targetLanguage) ? userState.targetLanguage : "vi";
  let normalizedId = charId;
  if (charId === "bao") normalizedId = "ado";
  if (charId === "julian") normalizedId = "kou";

  const base = BASE_CHARACTERS[normalizedId] || BASE_CHARACTERS.ado;
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

  let greetingText = greetingObj.text;
  let greetingTranslation = greetingObj.translation;
  let greetingTip = greetingObj.tip;

  if (normalizedId === "kou" && targetLang === "vi") {
    const { olderUserTerm, olderUserCap, isMale } = getUserVietnameseAddressTerms();
    greetingText = `${olderUserCap} ơi! Kou tìm ${olderUserTerm} mãi đó! Hôm nay ${olderUserTerm} có rảnh chơi với em không?`;
    greetingTranslation = `${olderUserCap}! Kou has been looking everywhere for you! Are you free to play with Kou today?`;
    greetingTip = `'${olderUserCap}' is how younger people affectionately address an older ${isMale ? 'male' : 'female'}. Kou refers to himself as 'em'. 'Có rảnh' means 'Are you free'.`;
  }

  return {
    id: base.id,
    name: base.name,
    isGroup: !!base.isGroup,
    language: langLabel,
    flag: flag,
    avatar: base.avatar,
    sprite: base.sprite,
    archetype: base.archetype,
    role: base.role,
    personality: base.personality,
    greeting: greetingText,
    romaji: greetingObj.romaji || null,
    greetingTranslation: greetingTranslation,
    greetingTip: greetingTip,
    sampleVoice: base.sampleVoice,
  };
}

const CHARACTERS = new Proxy({}, {
  get(target, prop) {
    if (typeof prop === "symbol" || prop === "inspect" || prop === "toJSON") return undefined;
    if (BASE_CHARACTERS[prop]) {
      return getCharacter(prop);
    }
    if (prop === "bao") return getCharacter("ado");
    if (prop === "julian") return getCharacter("kou");
    return undefined;
  },
  ownKeys() {
    return Object.keys(BASE_CHARACTERS);
  },
  getOwnPropertyDescriptor(target, prop) {
    if (BASE_CHARACTERS[prop] || prop === "bao" || prop === "julian") {
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

// Clean Emoji Utility: Strips all emoji symbols from dialogues, choices, and inputs
function cleanEmojiText(str) {
  if (!str || typeof str !== "string") return str;
  return str
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA00}-\u{1FAFF}\u{200D}\u{FE0F}\u{FE0E}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
window.cleanEmojiText = cleanEmojiText;

// UI Language Dictionary (English, Vietnamese & Japanese)
const UI_STRINGS = {
  en: {
    appLangBtn: "English",
    appLangLabel: "App Language (UI)",
    landingSubtitle: "Learn romance, vocabulary & real-world conversations with charming love interests",
    landingPlayBtn: "Play Now",
    chatsTitle: "Messenger Chats",
    chatsSubtitle: "Select a Love Interest to start learning & chatting",
    charactersTitle: "Love Interests",
    charactersSubtitle: "Personality profiles, relationship levels & affection stats",
    guidebookTitle: "Language Guidebook",
    guidebookSubtitle: "Special letters, typing rules, word forms & romance vocabulary",
    settingsTitle: "App Settings",
    settingsSubtitle: "Customize theme, language preferences & story progress",
    apiKeyLabel: "Gemini API Key",
    keyActive: "Key Active",
    keyRequired: "Key Required",
    saveKeyBtn: "Save API Key",
    resetLabel: "Reset Story & Chat Progress",
    resetDesc: "Wipe all chat histories, reset affection levels back to initial nonchalant states, and restart story choices for a fresh experience.",
    resetBtn: "Reset All Story Progress & Replay",
    resetSuccess: "All story progress and chat histories have been reset!",
    tabLanding: "Landing",
    tabChats: "Chats",
    tabStory: "Story",
    tabLIs: "LIs",
    tabGuidebook: "Guidebook",
    tabSettings: "Settings",
    sentenceBuilderTab: "Sentence Builder",
    freeTextTab: "Free Text Chat",
    sendSentenceBtn: "Send Built Sentence",
    freeInputPlaceholder: "Type custom message in target language...",
    selectLevelLabel: "Select Level:",
    wordBankPlaceholder: "Click word chips below to build your sentence...",
    chatWith: "Chat with",
    affectionLevel: "Affection Level",
    currentTier: "Current Tier:",
    playTier: "Play Tier",
  },
  vi: {
    appLangBtn: "Tiếng Việt",
    appLangLabel: "Ngôn ngữ ứng dụng",
    landingSubtitle: "Học ngôn ngữ lãng mạn, từ vựng & giao tiếp đời thực cùng các chàng trai quyến rũ",
    landingPlayBtn: "Chơi Ngay",
    chatsTitle: "Đoạn Chat Messenger",
    chatsSubtitle: "Chọn một nhân vật để bắt đầu học và trò chuyện",
    charactersTitle: "Các Nhân Vật Nam",
    charactersSubtitle: "Hồ sơ cá tính, mức độ mối quan hệ & chỉ số tình cảm",
    guidebookTitle: "Cẩm Nang Ngôn Ngữ",
    guidebookSubtitle: "Chữ cái đặc biệt, quy tắc gõ, dạng từ & từ vựng tình cảm",
    settingsTitle: "Cài Đặt Ứng Dụng",
    settingsSubtitle: "Tùy chỉnh giao diện, ngôn ngữ & tiến trình câu chuyện",
    apiKeyLabel: "Mã Khóa Gemini API Key",
    keyActive: "Đã Hoạt Động",
    keyRequired: "Cần Mã Khóa",
    saveKeyBtn: "Lưu API Key",
    resetLabel: "Đặt Lại Câu Chuyện & Lịch Sử Chat",
    resetDesc: "Xóa toàn bộ lịch sử trò chuyện, đưa độ thiện cảm về ban đầu để trải nghiệm lại từ đầu.",
    resetBtn: "Đặt Lại Tiến Trình & Chơi Lại",
    resetSuccess: "Đã đặt lại toàn bộ tiến trình và lịch sử chat!",
    tabLanding: "Trang Đầu",
    tabChats: "Trò chuyện",
    tabStory: "Cốt Truyện",
    tabLIs: "Nhân vật",
    tabGuidebook: "Cẩm Nang",
    tabSettings: "Cài đặt",
    sentenceBuilderTab: "Ghép Câu",
    freeTextTab: "Nhắn Tự Do",
    sendSentenceBtn: "Gửi Câu Đã Ghép",
    freeInputPlaceholder: "Nhập tin nhắn bằng ngoại ngữ...",
    selectLevelLabel: "Chọn Cấp Độ:",
    wordBankPlaceholder: "Nhấn các thẻ từ bên dưới để ghép câu...",
    chatWith: "Nhắn với",
    affectionLevel: "Mức Độ Thiện Cảm",
    currentTier: "Cấp độ hiện tại:",
    playTier: "Chơi Cấp Độ",
  },
  ja: {
    appLangBtn: "日本語",
    appLangLabel: "アプリ言語 (UI)",
    landingSubtitle: "魅力的なキャラクターたちとロマンス、語彙、日常会話を学ぼう",
    landingPlayBtn: "今すぐプレイ",
    chatsTitle: "メッセンジャーチャット",
    chatsSubtitle: "キャラクターを選んで学習とチャットを始めましょう",
    charactersTitle: "攻略キャラクター",
    charactersSubtitle: "プロフィール、好感度、関係性ステータス",
    guidebookTitle: "言語ガイドブック",
    guidebookSubtitle: "特殊文字、入力規則、語形変化、ロマンス語彙",
    settingsTitle: "アプリ設定",
    settingsSubtitle: "テーマ、言語設定、ストーリー進行度の管理",
    apiKeyLabel: "Gemini APIキー",
    keyActive: "有効",
    keyRequired: "キーが必要です",
    saveKeyBtn: "APIキーを保存",
    resetLabel: "ストーリーと進行状況のリセット",
    resetDesc: "すべてのチャット履歴を消去し、好感度を初期状態に戻して最初からプレイします。",
    resetBtn: "すべてリセットして最初から",
    resetSuccess: "ストーリーとチャット履歴がリセットされました！",
    tabLanding: "タイトル",
    tabChats: "チャット",
    tabStory: "ストーリー",
    tabLIs: "キャラ",
    tabGuidebook: "ガイド",
    tabSettings: "設定",
    sentenceBuilderTab: "文章作成",
    freeTextTab: "フリーチャット",
    sendSentenceBtn: "作成した文を送信",
    freeInputPlaceholder: "学習言語でメッセージを入力...",
    selectLevelLabel: "レベル選択:",
    wordBankPlaceholder: "下の単語チップをタップして文章を作成...",
    chatWith: "チャット:",
    affectionLevel: "好感度レベル",
    currentTier: "現在のティア:",
    playTier: "ティアをプレイ",
  }
};

// Natural Glitch & Recovery Messages for Friendly Error Handling
function getErrorGlitchMessages(charId) {
  const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
  const normalizedId = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";

  if (normalizedId === "kou") {
    return [
      `${olderUserCap} ơi chờ Kou xíu nha, điện thoại Kou bị đơ đơ`,
      `Ơ tự nhiên mất mạng xíu, ${olderUserTerm} đừng bỏ Kou đi nha!`,
      "Đợi Kou một xíu thôi, máy Kou bị lag nhẹ...",
      `Ủa điện thoại Kou vừa giật giật, một giây thôi ${olderUserTerm} ơi!`
    ];
  } else if (normalizedId === "ado") {
    return [
      "Khụ... Điện thoại của tớ bị đơ một chút. Đừng tưởng là tớ cố ý ngắt lời đấy nhé",
      "Mạng bị gián đoạn xíu. Tớ đang khắc phục ngay đây, cậu chờ chút nhé!",
      "Lỗi ứng dụng chút thôi. Tớ sẽ khôi phục tín hiệu ngay lập tức...",
      "Đợi tớ một giây, kết nối vừa bị chập chờn..."
    ];
  } else {
    return [
      "Ơ kìa, sóng chập chờn làm gián đoạn câu chuyện của anh với em rồi",
      "Đừng vội đi đâu đấy nhé, mạng bị lag xíu thôi... Để anh chỉnh lại",
      "Máy anh hơi đơ chút, em ngoan ngoãn ngồi yên chờ anh đấy...",
      "Kết nối bị đứt xíu, anh quay lại chọc nhóc ngay đây..."
    ];
  }
}

function getErrorRecoveryMessages(charId) {
  const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
  const normalizedId = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";

  if (normalizedId === "kou") {
    return [
      `Kou quay lại rồi nè ${olderUserTerm} ơi! Hồi nãy ${olderUserTerm} nói gì với em thế?`,
      `Được rồi nè ${olderUserTerm} ơi! ${olderUserCap} nhắn lại cho em nha?`,
      `Mạng ngon lại rồi! ${olderUserCap} thương Kou đừng giận nha!`,
      `Hihi sửa xong rồi! Kou nghe ${olderUserTerm} nói tiếp đây!`
    ];
  } else if (normalizedId === "ado") {
    return [
      "Xong rồi đấy. Cậu vừa nói tới đâu rồi nhỉ? Đừng bảo là quên rồi nhé",
      "Khôi phục xong kết nối rồi. Cậu nói tiếp đi, tớ đang nghe đây...",
      "Tốt rồi. Tớ không muốn bỏ dở giữa chừng đâu, cậu lặp lại giúp tớ đi.",
      "Mọi thứ ổn rồi. Cậu nói tiếp nội dung lúc nãy đi."
    ];
  } else {
    return [
      "Xong rồi đây, nhóc. Hồi nãy định nói gì ngọt ngào với anh à?",
      "Anh quay lại rồi đây. Tiếp tục chọc em được rồi chứ?",
      "Xong rồi nè. Không có anh trò chuyện em có thấy thiếu thiếu không?",
      "Ổn rồi nhé. Mau nói tiếp cho anh nghe nào, nhóc."
    ];
  }
}

const ERROR_GLITCH_MESSAGES = new Proxy({}, {
  get(target, prop) {
    return getErrorGlitchMessages(prop);
  }
});

const ERROR_RECOVERY_MESSAGES = new Proxy({}, {
  get(target, prop) {
    return getErrorRecoveryMessages(prop);
  }
});

// Spontaneous LI Check-Up Messages Pool (Casual, Short, Sweet Texts per Target Language)
function getSpontaneousCheckups(charId, targetLang = "vi") {
  const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
  const normalizedId = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";

  if (normalizedId === "kou") {
    if (targetLang === "en") {
      return [
        { text: "Senpai! Kou misses you so much, please talk to me!", translation: "Senpai! Kou misses you so much, please talk to me!", tip: "Kou is a cute and clingy underclassman!" },
        { text: "What are you doing Senpai? Were you thinking of Kou?", translation: "What are you doing Senpai? Were you thinking of Kou?", tip: "Kou craves your attention!" },
        { text: "Kou is waiting for you! Text me back soon, Senpai!", translation: "Kou is waiting for you! Text me back soon, Senpai!", tip: "Clingy junior checking in." }
      ];
    } else if (targetLang === "ja") {
      return [
        { text: "先輩！Kou、先輩に会いたくてたまらないです！", romaji: "Senpai! Kou, senpai ni aitakute tamaranai desu!", translation: "Senpai! Kou misses you so much and wants to see you!", tip: "'Aitakute tamaranai' means dying to see you." },
        { text: "先輩、何してますか？Kouのこと考えてくれてましたか？", romaji: "Senpai, nani shitemasu ka? Kou no koto kangaete kuretemashita ka?", translation: "Senpai, what are you doing? Were you thinking about Kou?", tip: "Cute clingy check-in." }
      ];
    } else {
      return [
        { text: `${olderUserCap} ơi! Kou nhớ ${olderUserTerm} quá, nhắn tin với em đi mà!`, translation: `${olderUserCap}! Kou misses you so much, please text Kou!`, tip: "'Nhớ' means 'miss someone'. Kou is super sweet and clingy!" },
        { text: `${olderUserCap} đang làm gì đó? Có đang nghĩ tới em không thế?`, translation: `What are you doing ${olderUserCap}? Are you thinking about Kou?`, tip: "'Đang làm gì' asks what you are doing." },
        { text: `Kou đứng chờ ${olderUserTerm} ở hành lang nè, nhắn lại cho em nha!`, translation: `Kou is waiting for you in the hallway, text Kou back!`, tip: "Kou loves spending time with you!" }
      ];
    }
  } else if (normalizedId === "ado") {
    if (targetLang === "en") {
      return [
        { text: "Ahem... I just organized our study notes. Are you free to review them?", translation: "Ahem... I just organized our study notes. Are you free to review them?", tip: "Ado uses study notes as an excuse to text you!" },
        { text: "Don't get distracted! Text me if you need help with your lessons.", translation: "Don't get distracted! Text me if you need help with your lessons.", tip: "Strict classmate secretly checking on you." }
      ];
    } else if (targetLang === "ja") {
      return [
        { text: "コホン… 勉強のノートがまとまったよ。一緒に確認する？", romaji: "Kohon... Benkyou no nootu ga matomatta yo. Issho ni kakunin suru?", translation: "Ahem... The study notes are ready. Want to review together?", tip: "Tsundere excuse to study together." },
        { text: "さぼってないだろうね？分からないところがあったら教えるけど…", romaji: "Sabottenai darou ne? Wakaranai tokoro ga attara oshieru kedo...", translation: "You aren't slacking off, right? I can teach you if there's anything you don't get...", tip: "Tsundere classmate offer." }
      ];
    } else {
      return [
        { text: "Khụ... Tớ vừa tổng hợp xong lịch học nè. Cậu có rảnh xem qua không?", translation: "Ahem... I just finished summarizing the study schedule. Free to check it?", tip: "Ado is strict about studies but secretly wants to talk!" },
        { text: "Đừng có mải chơi mà quên học đấy nhé! Nhắn tớ nếu cần tớ giảng bài cho.", translation: "Don't get distracted playing! Text me if you need me to explain the lesson.", tip: "Tsundere classmate caring for you." }
      ];
    }
  } else {
    // Ren
    if (targetLang === "en") {
      return [
        { text: "What's up kid? Daydreaming about me again, aren't you?", translation: "What's up kid? Daydreaming about me again, aren't you?", tip: "Ren loves teasing you boldly." },
        { text: "Come sit close to me for a bit. Let me test how good you are today.", translation: "Come sit close to me for a bit. Let me test how good you are today.", tip: "Flirty, assertive senior vibe." }
      ];
    } else if (targetLang === "ja") {
      return [
        { text: "どうした、後輩ちゃん？俺のこと考えてたんだろ？", romaji: "Doushita, kouhai-chan? Ore no koto kangaetetandaro?", translation: "What's wrong, junior? You were thinking of me, right?", tip: "'Kouhai-chan' is his affectionate tease." },
        { text: "こっち来て俺の隣に座れよ。よしよししてやるから。", romaji: "Kocchi kite ore no tonari ni suware yo. Yoshi yoshi shite yaru kara.", translation: "Come sit next to me. I'll pat your head.", tip: "Assertive, flirty senior." }
      ];
    } else {
      return [
        { text: "Sao đấy nhóc? Lại đang ngơ ngẩn nghĩ đến anh đúng không?", translation: "What's up kid? Daydreaming about me again, right?", tip: "'Nhóc' and 'anh' is Ren's flirty addressing." },
        { text: "Lại đây ngồi với anh xíu nào. Để anh xem hôm nay em có ngoan không.", translation: "Come sit with me for a bit. Let me see if you're well-behaved today.", tip: "Ren is an aggressive, teasing senior." }
      ];
    }
  }
}

const SPONTANEOUS_CHECKUPS = new Proxy({}, {
  get(target, charProp) {
    return {
      get vi() { return getSpontaneousCheckups(charProp, "vi"); },
      get en() { return getSpontaneousCheckups(charProp, "en"); },
      get ja() { return getSpontaneousCheckups(charProp, "ja"); }
    };
  }
});

// Impatient Pout & Check-Up Sequence Pool (Natural & Cute Otome Pre-written Texts per Target Language)
function getUnrepliedSequence(charId, targetLang = "vi") {
  const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
  const normalizedId = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";

  if (normalizedId === "kou") {
    if (targetLang === "en") {
      return [
        { text: "Senpai! Kou bought yummy sweets, come eat with me!", translation: "Senpai! Kou bought yummy sweets, come eat with me!", tip: "Kou sharing treats." },
        { text: "Where did you go Senpai? Don't leave Kou all alone...", translation: "Where did you go Senpai? Don't leave Kou all alone...", tip: "Clingy underclassman." },
        { text: "Do you not care about Kou anymore? I'm gonna cry!", translation: "Do you not care about Kou anymore? I'm gonna cry!", tip: "Seeking affection." },
        { text: "Hmph! Leaving me on read? Kou is super pouting now!", translation: "Hmph! Leaving me on read? Kou is super pouting now!", tip: "Kou's pout face." },
        { text: "...", translation: "... (Kou is sitting in the corner pouting until you reply)", tip: "Kou is waiting for your reply!" }
      ];
    } else if (targetLang === "ja") {
      return [
        { text: "先輩！美味しいケーキ買ってきたから一緒に食べましょう！", romaji: "Senpai! Oishii keeki kattakita kara issho ni tabemashou!", translation: "Senpai! I bought delicious cake, let's eat together!", tip: "Sharing treats with Senpai." },
        { text: "先輩どこ行ったんですか？Kouを置いていかないで…", romaji: "Senpai doko ittan desu ka? Kou wo oite ikanaide...", translation: "Where did you go Senpai? Don't leave Kou behind...", tip: "Clingy junior." },
        { text: "もう… 既読無視なんてひどいです！Kou、スネちゃいますよ！", romaji: "Mou... kidoku mushi nante hidoi desu! Kou, sunechaimasu yo!", translation: "Geez... Leaving me on read is so mean! Kou will pout!", tip: "Pouting junior." },
        { text: "...", translation: "... (Kou is sitting in the corner pouting until you reply)", tip: "Kou is waiting for your reply!" }
      ];
    } else {
      return [
        { text: `${olderUserCap} ơi! Kou vừa mua bánh ngọt ngon lắm nè, ${olderUserTerm} ăn cùng em nha!`, translation: `${olderUserCap}! Kou bought delicious cake, eat with Kou!`, tip: "Kou sharing snacks with you." },
        { text: `${olderUserCap} đi đâu mất rồi? Đừng bỏ rơi em mà...`, translation: `Where did ${olderUserCap} go? Don't leave Kou behind...`, tip: "Kou getting clingy." },
        { text: `${olderUserCap} không thương Kou nữa sao? Em mếu đó nha!`, translation: `Does ${olderUserCap} not love Kou anymore? Kou will cry!`, tip: "Kou pouting for attention." },
        { text: `Mệt ${olderUserTerm} ghê... Kou dỗi thật rồi đó! Hu hu...`, translation: `${olderUserCap} is so mean... Kou is pouting for real now! Waaah...`, tip: "Cute clingy pout!" },
        { text: "...", translation: `... (Kou is sitting in the corner pouting until ${olderUserCap} replies)`, tip: "Kou is waiting for your reply!" }
      ];
    }
  } else if (normalizedId === "ado") {
    if (targetLang === "en") {
      return [
        { text: "Ahem... Homework is all prepared. Want me to review yours?", translation: "Ahem... Homework is all prepared. Want me to review yours?", tip: "Ado offering help." },
        { text: "Hey, what are you busy with? Don't just leave me on read...", translation: "Hey, what are you busy with? Don't just leave me on read...", tip: "Strict classmate getting restless." },
        { text: "I-I was only worried about your grades! Why keep me waiting like this!", translation: "I-I was only worried about your grades! Why keep me waiting like this!", tip: "Tsundere stuttering." },
        { text: "Fine! See if I ever remind you again!", translation: "Fine! See if I ever remind you again!", tip: "Tsundere pout." },
        { text: "...", translation: "... (Ado is looking away blushing and pouting until you reply)", tip: "Ado is pouting!" }
      ];
    } else if (targetLang === "ja") {
      return [
        { text: "コホン… 宿題のチェック、してあげてもいいけど？", romaji: "Kohon... Shukudai no chekku, shite agetemo ii kedo?", translation: "Ahem... I could check your homework if you want?", tip: "Tsundere offer." },
        { text: "ちょっと、無視しないでよ… 忙しいの？", romaji: "Chotto, mushi shinaide yo... Isogashii no?", translation: "Hey, don't ignore me... Are you busy?", tip: "Classmate getting restless." },
        { text: "べ、別に寂しいわけじゃないからね！ただノートを渡したいだけ！", romaji: "Be, betsu ni sabishii wake janai kara ne! Tada nootu wo watashitai dake!", translation: "I-It's not like I'm lonely or anything! I just want to hand you the notes!", tip: "Classic tsundere line!" },
        { text: "もう知らない！後で泣きついても遅いんだからね！", romaji: "Mou shiranai! Ato de nakitsuitemo osoi nda kara ne!", translation: "Fine, I don't care! Don't come crying to me later!", tip: "Tsundere pout." },
        { text: "...", translation: "... (Ado is looking away blushing and pouting until you reply)", tip: "Ado is pouting!" }
      ];
    } else {
      return [
        { text: "Khụ... Tớ chuẩn bị bài tập xong rồi. Cậu có cần tớ kiểm tra giúp không?", translation: "Ahem... Homework is ready. Want me to check yours?", tip: "Ado using homework as excuse." },
        { text: "Này, cậu bận gì mà không trả lời tớ thế? Đừng có lơ tớ đấy...", translation: "Hey, what are you busy with? Don't ignore me...", tip: "Tsundere getting flustered." },
        { text: "Tớ... tớ chỉ lo cậu không hiểu bài thôi! Làm gì mà bắt tớ chờ lâu thế!", translation: "I... I was just worried you didn't understand the lesson! Why make me wait so long!", tip: "Blushing tsundere classmate." },
        { text: "Tùy cậu đấy! Tớ sẽ không thèm nhắc cậu nữa đâu!", translation: "Whatever! I won't bother reminding you anymore!", tip: "Classic tsundere pout." },
        { text: "...", translation: "... (Ado is looking away blushing and pouting until you reply)", tip: "Ado is pouting!" }
      ];
    }
  } else {
    // Ren
    if (targetLang === "en") {
      return [
        { text: "Hey kid, daring to ignore my text? You're getting bold...", translation: "Hey kid, daring to ignore my text? You're getting bold...", tip: "Teasing senior." },
        { text: "I'm waiting for your reply. Don't make me come to your class to find you.", translation: "I'm waiting for your reply. Don't make me come to your class to find you.", tip: "Assertive senior warning." },
        { text: "Hmm, playing hard to get? I like your spirit, but you might get punished~", translation: "Hmm, playing hard to get? I like your spirit, but you might get punished~", tip: "Flirty tease." },
        { text: "...", translation: "... (Ren is leaning back smiling dangerously until you text back)", tip: "Ren is waiting assertively!" }
      ];
    } else if (targetLang === "ja") {
      return [
        { text: "おいおい、俺のメッセージ無視するか？いい度胸だな、後輩ちゃん…", romaji: "Oi oi, ore no messeegi mushi suru ka? Ii dokyou dana, kouhai-chan...", translation: "Hey hey, ignoring my message? Bold move, junior...", tip: "Teasing senior." },
        { text: "返事まだ？教室まで迎えに行ってもいいんだぞ？", romaji: "Henji mada? Kyoushitsu made mukae ni ittemo ii nda zo?", translation: "No reply yet? Should I come pick you up at your classroom?", tip: "Assertive senior." },
        { text: "焦らすねぇ… そういう生意気なところ、嫌いじゃないけどお仕置きだな", romaji: "Jirasu nee... souiu namaiki na tokoro, kirai janai kedo oshioki dana", translation: "Teasing me, huh? I don't hate that cheeky side, but you need punishment", tip: "Flirty bully trope." },
        { text: "...", translation: "... (Ren is leaning back smiling dangerously until you text back)", tip: "Ren is waiting assertively!" }
      ];
    } else {
      return [
        { text: "Này nhóc, dám ngó lơ tin nhắn của anh à? Can gan nhỉ...", translation: "Hey kid, daring to ignore my message? How bold...", tip: "Ren's teasing tone." },
        { text: "Anh đang chờ em trả lời đấy. Đừng để anh phải đến tận lớp tìm em nhé.", translation: "I'm waiting for your reply. Don't make me come to your classroom to find you.", tip: "Aggressive, assertive senior." },
        { text: "Hừm, giả vờ kiêu với anh sao? Hợp gu anh đấy, nhưng coi chừng anh phạt đó nha~", translation: "Hmm, playing hard to get? Right up my alley, but watch out or I'll punish you~", tip: "Flirty senior bully trope." },
        { text: "...", translation: "... (Ren is leaning back smiling dangerously until you text back)", tip: "Ren is waiting assertively!" }
      ];
    }
  }
}

const UNREPLIED_SEQUENCE = new Proxy({}, {
  get(target, charProp) {
    return {
      get vi() { return getUnrepliedSequence(charProp, "vi"); },
      get en() { return getUnrepliedSequence(charProp, "en"); },
      get ja() { return getUnrepliedSequence(charProp, "ja"); }
    };
  }
});

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
  currentTiers: JSON.parse(localStorage.getItem("otome_tiers")) || { ado: 1, kou: 1, ren: 1, group: 1 },
  affection: JSON.parse(localStorage.getItem("otome_affection")) || { ado: 10, kou: 10, ren: 10, group: 10 },
  chatStep: JSON.parse(localStorage.getItem("otome_chat_step")) || { ado: 0, kou: 0, ren: 0, group: 0 },
  chatHistories: JSON.parse(localStorage.getItem("otome_chats")) || {},
  unreadMessages: JSON.parse(localStorage.getItem("otome_unread")) || { ado: 0, kou: 0, ren: 0, group: 0 },
  isPouting: JSON.parse(localStorage.getItem("otome_pouting")) || { ado: false, kou: false, ren: false, group: false },
  unrepliedCount: JSON.parse(localStorage.getItem("otome_unreplied_count")) || { ado: 0, kou: 0, ren: 0, group: 0 },
  saidGoodbye: JSON.parse(localStorage.getItem("otome_said_goodbye")) || { ado: false, kou: false, ren: false, group: false },
  unlockedModes: JSON.parse(localStorage.getItem("otome_unlocked_modes")) || { ado: 1, kou: 1, ren: 1, group: 1 },
  modeProgress: JSON.parse(localStorage.getItem("otome_mode_progress")) || { ado: 0, kou: 0, ren: 0, group: 0 },
  selectedInputMode: JSON.parse(localStorage.getItem("otome_input_mode")) || {},
  showRomaji: localStorage.getItem("otome_show_romaji") !== "false",
  uiLang: localStorage.getItem("otome_ui_lang") || "en",
  userProfile: JSON.parse(localStorage.getItem("otome_user_profile")) || {
    name: localStorage.getItem("otome_user_name") || "MC",
    pronouns: localStorage.getItem("otome_user_pronouns") || "she/her",
    age: localStorage.getItem("otome_user_age") || "20",
  },
  storyProgress: JSON.parse(localStorage.getItem("otome_story_progress")) || { ado: {}, kou: {}, ren: {} },
  selectedStoryChar: localStorage.getItem("otome_story_char") || "ado",
};

// OpenKoto Guidebook State
let currentGuidebookSubMode = "openkoto"; // 'openkoto' | 'library'
let openkotoState = {
  activeSource: "upload", // 'upload' | 'text' | 'chat' | 'camera'
  selectedChatChar: "ado",
  selectedChatMsgs: [],
  mediaFile: null,
  mediaBase64: null,
  mediaMimeType: null,
  mediaType: null, // 'image' | 'audio' | 'video' | 'text'
  fileName: "",
  pastedText: "",
  targetLang: "vi",
  customFocus: "Romance, Flirting & Everyday Life",
  isLoading: false,
  activeLesson: null,
  activeQuizMode: "mc", // 'mc' | 'scramble' | 'cloze' | 'roleplay'
  activeQuizState: {
    scramblePicked: [],
    scrambleRemaining: [],
    answered: {},
    roleplayAnswered: null,
    score: 0
  },
  bilingualVisible: true,
  phoneticsVisible: true,
  savedLessons: JSON.parse(localStorage.getItem("openkoto_saved_lessons") || "[]"),
  savedFlashcards: JSON.parse(localStorage.getItem("openkoto_saved_flashcards") || "[]")
};
window.openkotoState = openkotoState;
window.currentGuidebookSubMode = currentGuidebookSubMode;

// Map legacy character keys to new character keys in userState
["currentTiers", "affection", "chatStep", "unreadMessages", "isPouting", "unrepliedCount", "saidGoodbye", "unlockedModes", "modeProgress"].forEach(prop => {
  if (userState[prop]) {
    if (userState[prop].bao !== undefined && userState[prop].ado === undefined) userState[prop].ado = userState[prop].bao;
    if (userState[prop].julian !== undefined && userState[prop].kou === undefined) userState[prop].kou = userState[prop].julian;
    if (userState[prop].ado === undefined) userState[prop].ado = prop === "affection" ? 10 : (prop === "unlockedModes" ? 1 : (prop === "isPouting" || prop === "saidGoodbye" ? false : (prop === "currentTiers" ? 1 : 0)));
    if (userState[prop].kou === undefined) userState[prop].kou = prop === "affection" ? 10 : (prop === "unlockedModes" ? 1 : (prop === "isPouting" || prop === "saidGoodbye" ? false : (prop === "currentTiers" ? 1 : 0)));
    if (userState[prop].ren === undefined) userState[prop].ren = prop === "affection" ? 10 : (prop === "unlockedModes" ? 1 : (prop === "isPouting" || prop === "saidGoodbye" ? false : (prop === "currentTiers" ? 1 : 0)));
    if (userState[prop].group === undefined) userState[prop].group = prop === "affection" ? 10 : (prop === "unlockedModes" ? 1 : (prop === "isPouting" || prop === "saidGoodbye" ? false : (prop === "currentTiers" ? 1 : 0)));
  }
});

// Timestamps for LI messaging/impatience engine
let lastUserReplyTime = { ado: Date.now(), kou: Date.now(), ren: Date.now(), group: Date.now() };
let lastLiCheckupTime = { ado: Date.now(), kou: Date.now(), ren: Date.now(), group: Date.now() };
let lastMessageWasLi = { ado: false, kou: false, ren: false, group: false };
let nextSpontaneousDelay = {
  ado: (7 + Math.random() * 3) * 60 * 1000,
  kou: (7 + Math.random() * 3) * 60 * 1000,
  ren: (7 + Math.random() * 3) * 60 * 1000,
  group: (7 + Math.random() * 3) * 60 * 1000
};

// Runtime cache for dynamic AI generated next turn options
let dynamicWordBank = { ado: null, kou: null, ren: null, group: null };
let dynamicStarterChoices = { ado: null, kou: null, ren: null, group: null };

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

// Mobile Fullscreen & Hide Browser Bar Engine
function isAppFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    (window.navigator && window.navigator.standalone === true) ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    (window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches)
  );
}

function updateFullscreenUI() {
  const isFull = isAppFullscreen();
  const badge = document.getElementById("fullscreenStatusBadge");
  const settingsIcon = document.getElementById("settingsFullscreenIcon");
  const settingsText = document.getElementById("settingsFullscreenText");
  const vnIcon = document.getElementById("vnFullscreenIcon");

  if (badge) {
    badge.textContent = isFull ? "Fullscreen Active" : "Standard View";
    badge.style.background = isFull ? "rgba(5, 150, 105, 0.12)" : "";
    badge.style.color = isFull ? "var(--accent-emerald)" : "";
  }
  if (settingsIcon) {
    settingsIcon.textContent = isFull ? "fullscreen_exit" : "fullscreen";
  }
  if (settingsText) {
    settingsText.textContent = isFull ? "Exit Fullscreen Mode" : "Expand to Full Screen";
  }
  if (vnIcon) {
    vnIcon.textContent = isFull ? "fullscreen_exit" : "fullscreen";
  }
}

async function toggleAppFullscreen() {
  try {
    const docEl = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      } else {
        // Fallback for iOS Safari
        window.scrollTo(0, 1);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  } catch (err) {
    console.warn("Fullscreen request warning:", err);
  }
  setTimeout(updateFullscreenUI, 300);
}
window.toggleAppFullscreen = toggleAppFullscreen;
window.isAppFullscreen = isAppFullscreen;
window.updateFullscreenUI = updateFullscreenUI;

document.addEventListener("fullscreenchange", updateFullscreenUI);
document.addEventListener("webkitfullscreenchange", updateFullscreenUI);
document.addEventListener("mozfullscreenchange", updateFullscreenUI);
document.addEventListener("MSFullscreenChange", updateFullscreenUI);

// Mobile Add to Home Screen Accordion and Platform Tab Controls
function toggleMobileInstallAccordion() {
  const guide = document.getElementById("mobileInstallGuide");
  if (guide) {
    guide.classList.toggle("expanded");
  }
}
window.toggleMobileInstallAccordion = toggleMobileInstallAccordion;

function switchInstallPlatformTab(platform) {
  const iosBtn = document.getElementById("installTabIosBtn");
  const androidBtn = document.getElementById("installTabAndroidBtn");
  const iosPanel = document.getElementById("installPanelIos");
  const androidPanel = document.getElementById("installPanelAndroid");

  if (platform === 'ios') {
    iosBtn?.classList.add("active");
    androidBtn?.classList.remove("active");
    iosPanel?.classList.add("active");
    androidPanel?.classList.remove("active");
  } else {
    androidBtn?.classList.add("active");
    iosBtn?.classList.remove("active");
    androidPanel?.classList.add("active");
    iosPanel?.classList.remove("active");
  }
}
window.switchInstallPlatformTab = switchInstallPlatformTab;

function autoDetectAndSelectMobilePlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  switchInstallPlatformTab(isIOS ? 'ios' : 'android');
}

// Landing Page Navigation & Setup Menu Controls
function openLandingSetupMenu() {
  const modal = document.getElementById("userProfileModal");
  if (modal) {
    modal.style.display = "flex";
    void modal.offsetWidth;
    modal.classList.add("active");
    syncProfileInputsUI();
    selectModalTargetLang(userState.targetLanguage || "vi");
    autoDetectAndSelectMobilePlatform();
  }
}
window.openLandingSetupMenu = openLandingSetupMenu;
window.openUserProfileModal = openLandingSetupMenu;

function closeLandingSetupMenu() {
  const modal = document.getElementById("userProfileModal");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
    }, 250);
  }
}
window.closeLandingSetupMenu = closeLandingSetupMenu;

// Routing & Subdomain Navigation Engine
function parseRouteFromLocation() {
  const hostname = (window.location.hostname || "").toLowerCase();
  
  // 1. Subdomain resolution support (e.g. chats.domain.com, story.domain.com, guidebook.domain.com, settings.domain.com)
  if (hostname.startsWith("chats.") || hostname.startsWith("chat.")) {
    return { view: "chats" };
  }
  if (hostname.startsWith("story.") || hostname.startsWith("stories.")) {
    return { view: "story" };
  }
  if (hostname.startsWith("guidebook.") || hostname.startsWith("guide.") || hostname.startsWith("progress.")) {
    return { view: "guidebook" };
  }
  if (hostname.startsWith("settings.") || hostname.startsWith("setting.")) {
    return { view: "settings" };
  }

  // 2. Hash-based routing resolution fallback
  const rawHash = (window.location.hash || "").replace(/^#\/?/, "").toLowerCase().trim();
  if (rawHash) {
    if (rawHash === "chats" || rawHash === "chat") {
      return { view: "chats" };
    }
    if (rawHash.startsWith("chats/") || rawHash.startsWith("chat/")) {
      const parts = rawHash.split("/");
      const charId = parts[1] || "ado";
      return { view: "chat_single", charId };
    }
    if (rawHash === "story" || rawHash === "stories") {
      return { view: "story" };
    }
    if (rawHash === "guidebook" || rawHash === "guide" || rawHash === "progress") {
      return { view: "guidebook" };
    }
    if (rawHash === "settings" || rawHash === "setting") {
      return { view: "settings" };
    }
    if (rawHash === "home" || rawHash === "landing" || rawHash === "index" || rawHash === "") {
      return { view: "landing" };
    }
  }

  // 3. Pathname routing resolution
  const path = (window.location.pathname || "/").toLowerCase().trim();
  const normalizedPath = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  if (normalizedPath.startsWith("/chats/") || normalizedPath.startsWith("/chat/")) {
    const parts = normalizedPath.split("/").filter(Boolean);
    const charId = parts[1] || "ado";
    return { view: "chat_single", charId };
  }
  if (normalizedPath === "/chats" || normalizedPath === "/chat") {
    return { view: "chats" };
  }
  if (normalizedPath === "/story" || normalizedPath === "/stories") {
    return { view: "story" };
  }
  if (normalizedPath === "/guidebook" || normalizedPath === "/guide" || normalizedPath === "/progress") {
    return { view: "guidebook" };
  }
  if (normalizedPath === "/settings" || normalizedPath === "/setting") {
    return { view: "settings" };
  }
  
  // Default to Main Domain Landing (Home)
  return { view: "landing" };
}
window.parseRouteFromLocation = parseRouteFromLocation;

function updateRouteUrl(path, replace = false) {
  try {
    const targetPath = path.startsWith("/") ? path : `/${path}`;
    const currentPath = window.location.pathname;
    
    if (currentPath !== targetPath) {
      if (window.history && window.history.pushState) {
        if (replace) {
          window.history.replaceState({ path: targetPath }, "", targetPath);
        } else {
          window.history.pushState({ path: targetPath }, "", targetPath);
        }
      }
    }
  } catch (e) {
    try {
      const hashTarget = path === "/" ? "" : `#${path.replace(/^\//, "")}`;
      if (window.location.hash !== hashTarget) {
        window.location.hash = hashTarget;
      }
    } catch (err) {
      // Ignore URL update error in sandboxed iframes
    }
  }
}
window.updateRouteUrl = updateRouteUrl;

function navigateRoute(routeObj, updateHistory = true) {
  if (!routeObj) routeObj = { view: "landing" };

  if (routeObj.view === "landing") {
    returnToLandingPage(false);
    if (updateHistory) updateRouteUrl("/", false);
  } else if (routeObj.view === "chats") {
    enterAppFromLanding(false);
    closeActiveChat(false);
    switchTab("chats", false);
    if (updateHistory) updateRouteUrl("/chats", false);
  } else if (routeObj.view === "story") {
    enterAppFromLanding(false);
    closeActiveChat(false);
    switchTab("story", false);
    if (updateHistory) updateRouteUrl("/story", false);
  } else if (routeObj.view === "guidebook") {
    enterAppFromLanding(false);
    closeActiveChat(false);
    switchTab("progress", false);
    if (updateHistory) updateRouteUrl("/guidebook", false);
  } else if (routeObj.view === "settings") {
    enterAppFromLanding(false);
    closeActiveChat(false);
    switchTab("settings", false);
    if (updateHistory) updateRouteUrl("/settings", false);
  } else if (routeObj.view === "chat_single") {
    enterAppFromLanding(false);
    switchTab("chats", false);
    const validCharId = (BASE_CHARACTERS && BASE_CHARACTERS[routeObj.charId]) || (CHARACTERS && CHARACTERS[routeObj.charId]) ? routeObj.charId : "ado";
    openChatroom(validCharId, false);
    if (updateHistory) updateRouteUrl(`/chats/${validCharId}`, false);
  }
}
window.navigateRoute = navigateRoute;

function enterAppFromLanding(updateUrl = true) {
  const landing = document.getElementById("landingPage");
  const appLayout = document.getElementById("appLayoutWrapper");

  if (landing) {
    landing.classList.remove("active");
    landing.style.opacity = "0";
    landing.style.transform = "scale(0.96)";
    landing.style.pointerEvents = "none";
    setTimeout(() => {
      landing.style.display = "none";
    }, 400);
  }

  if (appLayout) {
    appLayout.style.display = "flex";
    appLayout.classList.add("active");
  }

  renderChatList();
  renderCharactersList();
  renderGuidebook();

  if (updateUrl) {
    updateRouteUrl("/chats");
  }
}
window.enterAppFromLanding = enterAppFromLanding;

function returnToLandingPage(updateUrl = true) {
  const landing = document.getElementById("landingPage");
  const appLayout = document.getElementById("appLayoutWrapper");
  const chatWin = document.getElementById("chatWindow");

  if (chatWin) {
    chatWin.classList.remove("active");
    chatWin.style.display = "none";
  }
  const desktopStage = document.getElementById("desktopFloatingStage");
  if (desktopStage) desktopStage.style.display = "none";
  activeCharacterId = null;

  if (landing) {
    landing.style.display = "flex";
    landing.style.pointerEvents = "auto";
    void landing.offsetWidth;
    landing.classList.add("active");
    landing.style.opacity = "1";
    landing.style.transform = "scale(1)";
  }

  if (appLayout) {
    appLayout.style.display = "none";
    appLayout.classList.remove("active");
  }

  if (updateUrl) {
    updateRouteUrl("/");
  }
}
window.returnToLandingPage = returnToLandingPage;

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
  const landing = document.getElementById("landingPage");
  if (landing && landing.classList.contains("active") && landing.style.display !== "none") {
    const modal = document.getElementById("userProfileModal");
    if (modal) modal.style.display = "none";
    return;
  }
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

  // Clear stale dynamic starter choices and word banks so they immediately reflect the new target language
  dynamicStarterChoices = {};
  dynamicWordBank = {};

  updateTargetLangUI();

  if (typeof openkotoState !== "undefined") {
    openkotoState.targetLang = lang;
  }

  renderChatList();
  renderCharactersList();
  renderGuidebook();

  if (activeCharacterId && (BASE_CHARACTERS[activeCharacterId] || CHARACTERS[activeCharacterId])) {
    const char = CHARACTERS[activeCharacterId] || BASE_CHARACTERS[activeCharacterId];
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

function cycleChatTargetLang() {
  const current = userState.targetLanguage || "vi";
  const order = ["vi", "ja", "en"];
  const nextIdx = (order.indexOf(current) + 1) % order.length;
  setAppTargetLanguage(order[nextIdx]);
}
window.cycleChatTargetLang = cycleChatTargetLang;

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

  const vnLangFlagIcon = document.getElementById("vnLangFlagIcon");
  const vnLangCodeText = document.getElementById("vnLangCodeText");
  if (vnLangFlagIcon && vnLangCodeText) {
    if (lang === "vi") {
      vnLangFlagIcon.textContent = "🇻🇳";
      vnLangCodeText.textContent = "VI";
    } else if (lang === "ja") {
      vnLangFlagIcon.textContent = "🇯🇵";
      vnLangCodeText.textContent = "JA";
    } else if (lang === "en") {
      vnLangFlagIcon.textContent = "🇬🇧";
      vnLangCodeText.textContent = "EN";
    }
  }
}

function saveUserProfileFromModal() {
  const modalName = document.getElementById("modalUserName")?.value || "";
  const modalPronouns = document.getElementById("modalUserPronouns")?.value || "she/her";
  const modalAge = document.getElementById("modalUserAge")?.value || "20";

  saveUserProfile(modalName, modalPronouns, modalAge);
  setAppTargetLanguage(modalSelectedTargetLang || "vi");

  closeLandingSetupMenu();
  enterAppFromLanding();
}
window.saveUserProfileFromModal = saveUserProfileFromModal;

function handleSkipProfileModal() {
  const currentProfile = userState.userProfile || { name: "MC", pronouns: "she/her", age: "20" };
  saveUserProfile(currentProfile.name || "MC", currentProfile.pronouns || "she/her", currentProfile.age || "20");
  setAppTargetLanguage(modalSelectedTargetLang || userState.targetLanguage || "vi");
  closeLandingSetupMenu();
  enterAppFromLanding();
}
window.handleSkipProfileModal = handleSkipProfileModal;

// Initialize App on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initKeybinds();
  initOpenRouterKey();
  checkAndShowUserProfileModal();
  startTimer();
  renderChatList();
  renderCharactersList();
  renderGuidebook();
  
  // Initial Subdomain & Route Resolution
  const initialRoute = parseRouteFromLocation();
  if (initialRoute.view !== "landing") {
    navigateRoute(initialRoute, false);
  }

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

  // Landing Page Subtitle, Play Button & UI Language Button
  const landingSub = document.getElementById("landingSubtitle");
  if (landingSub) landingSub.textContent = s.landingSubtitle || "Learn romance, vocabulary & real-world conversations with charming love interests";

  const landingPlayText = document.querySelector("#landingPlayBtn .landing-play-text");
  if (landingPlayText) landingPlayText.textContent = s.landingPlayBtn || "Play Now";

  const landingUiLangText = document.getElementById("landingUiLangText");
  const landingUiLangFlag = document.getElementById("landingUiLangFlag");
  if (landingUiLangText) {
    if (lang === "vi") {
      landingUiLangText.textContent = "Giao diện: Tiếng Việt";
      if (landingUiLangFlag) landingUiLangFlag.textContent = "🇻🇳";
    } else if (lang === "ja") {
      landingUiLangText.textContent = "アプリ言語: 日本語";
      if (landingUiLangFlag) landingUiLangFlag.textContent = "🇯🇵";
    } else {
      landingUiLangText.textContent = "App Language: English";
      if (landingUiLangFlag) landingUiLangFlag.textContent = "🇬🇧";
    }
  }

  // Active checkmarks in landing dropdown
  document.getElementById("landingOptEn")?.classList.toggle("active", lang === "en");
  document.getElementById("landingOptVi")?.classList.toggle("active", lang === "vi");
  document.getElementById("landingOptJa")?.classList.toggle("active", lang === "ja");

  const checkEn = document.getElementById("checkLangEn");
  const checkVi = document.getElementById("checkLangVi");
  const checkJa = document.getElementById("checkLangJa");
  if (checkEn) checkEn.style.display = lang === "en" ? "inline-block" : "none";
  if (checkVi) checkVi.style.display = lang === "vi" ? "inline-block" : "none";
  if (checkJa) checkJa.style.display = lang === "ja" ? "inline-block" : "none";

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
      if (tabName === "landing") labelSpan.textContent = s.tabLanding || "Landing";
      if (tabName === "chats") labelSpan.textContent = s.tabChats || "Chats";
      if (tabName === "story") labelSpan.textContent = s.tabStory || "Story";
      if (tabName === "characters") labelSpan.textContent = s.tabLIs || "LIs";
      if (tabName === "progress" || tabName === "roadmap" || tabName === "guidebook") labelSpan.textContent = s.tabGuidebook || "Guidebook";
      if (tabName === "settings") labelSpan.textContent = s.tabSettings || "Settings";
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

// Landing Page Language Switcher Helpers
function toggleLandingLangDropdown(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const dropdown = document.getElementById("landingLangDropdown");
  const btn = document.getElementById("landingUiLangBtn");
  if (!dropdown) return;
  const isShown = dropdown.style.display === "block" || dropdown.classList.contains("show");
  if (isShown) {
    closeLandingLangDropdown();
  } else {
    dropdown.style.display = "block";
    dropdown.classList.add("show");
    btn?.setAttribute("aria-expanded", "true");
  }
}
window.toggleLandingLangDropdown = toggleLandingLangDropdown;

function closeLandingLangDropdown() {
  const dropdown = document.getElementById("landingLangDropdown");
  const btn = document.getElementById("landingUiLangBtn");
  if (dropdown) {
    dropdown.style.display = "none";
    dropdown.classList.remove("show");
  }
  btn?.setAttribute("aria-expanded", "false");
}
window.closeLandingLangDropdown = closeLandingLangDropdown;

function selectLandingUiLang(lang) {
  setAppUiLanguage(lang);
  closeLandingLangDropdown();
}
window.selectLandingUiLang = selectLandingUiLang;

// Global click outside listener to close landing language dropdown
document.addEventListener("click", (e) => {
  const wrapper = document.getElementById("landingLangWrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    closeLandingLangDropdown();
  }
});

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
  const jaBtn = document.getElementById("settingLangJaBtn");
  if (enBtn) enBtn.classList.toggle("active", currentLang === "en");
  if (viBtn) viBtn.classList.toggle("active", currentLang === "vi");
  if (jaBtn) jaBtn.classList.toggle("active", currentLang === "ja");
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

  // History Popstate & Hash Navigation Listeners
  window.addEventListener("popstate", () => {
    const route = parseRouteFromLocation();
    navigateRoute(route, false);
  });

  window.addEventListener("hashchange", () => {
    const route = parseRouteFromLocation();
    navigateRoute(route, false);
  });

  // Initial apply of UI language
  applyUiLanguage();

  // Tab Buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab || btn.closest(".tab-btn")?.dataset?.tab;
      if (tabName) switchTab(tabName);
    });
  });

  // Feature Input Mode Switcher (Starter Options vs Sentence Builder vs Free Text Chat)
  const modeStarterBtn = document.getElementById("modeStarterChoiceBtn");
  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");

  const starterContainer = document.getElementById("starterChoiceContainer");
  const wordBankContainer = document.getElementById("wordBankContainer");
  const freeContainer = document.getElementById("freeInputContainer");

  function setModeActive(activeMode) {
    if (activeCharacterId) {
      if (!userState.selectedInputMode) userState.selectedInputMode = {};
      userState.selectedInputMode[activeCharacterId] = activeMode;
      saveLocalState();
    }

    [modeStarterBtn, modeSentenceBtn, modeFreeBtn].forEach((btn) => {
      if (btn) {
        btn.classList.remove("active");
        btn.style.border = "1px solid rgba(160, 140, 190, 0.3)";
        btn.style.background = "rgba(255,255,255,0.6)";
        btn.style.color = "var(--text-muted)";
      }
    });

    if (starterContainer) starterContainer.style.display = "none";
    if (wordBankContainer) wordBankContainer.style.display = "none";
    if (freeContainer) freeContainer.style.display = "none";

    if (activeMode === "starter") {
      if (modeStarterBtn) {
        modeStarterBtn.classList.add("active");
        modeStarterBtn.style.border = "1px solid var(--primary-pink)";
        modeStarterBtn.style.background = "rgba(217, 0, 87, 0.12)";
        modeStarterBtn.style.color = "var(--primary-pink)";
      }
      if (starterContainer) starterContainer.style.display = "flex";
    } else if (activeMode === "sentence") {
      if (modeSentenceBtn) {
        modeSentenceBtn.classList.add("active");
        modeSentenceBtn.style.border = "1px solid var(--primary-pink)";
        modeSentenceBtn.style.background = "rgba(217, 0, 87, 0.12)";
        modeSentenceBtn.style.color = "var(--primary-pink)";
      }
      if (wordBankContainer) wordBankContainer.style.display = "flex";
    } else if (activeMode === "free") {
      if (modeFreeBtn) {
        modeFreeBtn.classList.add("active");
        modeFreeBtn.style.border = "1px solid var(--primary-pink)";
        modeFreeBtn.style.background = "rgba(217, 0, 87, 0.12)";
        modeFreeBtn.style.color = "var(--primary-pink)";
      }
      if (freeContainer) freeContainer.style.display = "flex";
    }
  }

  if (modeStarterBtn) {
    modeStarterBtn.addEventListener("click", () => setModeActive("starter"));
  }
  if (modeSentenceBtn) {
    modeSentenceBtn.addEventListener("click", () => setModeActive("sentence"));
  }
  if (modeFreeBtn) {
    modeFreeBtn.addEventListener("click", () => setModeActive("free"));
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
      
      userState.chatStep = { ado: 0, kou: 0, ren: 0, group: 0 };
      userState.chatHistories = {};
      userState.affection = { ado: 10, kou: 10, ren: 10, group: 10 };
      userState.currentTiers = { ado: 1, kou: 1, ren: 1, group: 1 };
      userState.unlockedModes = { ado: 1, kou: 1, ren: 1, group: 1 };
      userState.modeProgress = { ado: 0, kou: 0, ren: 0, group: 0 };
      userState.totalHearts = 0;
      userState.streak = 1;
      userState.selectedInputMode = {};
      dynamicWordBank = { ado: null, kou: null, ren: null, group: null };
      dynamicStarterChoices = { ado: null, kou: null, ren: null, group: null };

      localStorage.removeItem("otome_chats");
      localStorage.removeItem("otome_chat_step");
      localStorage.removeItem("otome_input_mode");
      localStorage.removeItem("otome_unlocked_modes");
      localStorage.removeItem("otome_mode_progress");
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
      romajiBtn.title = `Romaji: ${userState.showRomaji ? "ON" : "OFF"}`;
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

function closeActiveChat(updateUrl = true) {
  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.remove("active");
    chatWin.style.display = "none";
  }
  const navDock = document.querySelector(".bottom-nav-dock");
  if (navDock) navDock.classList.remove("hidden-in-chat");
  const tabBar = document.querySelector(".tab-bar");
  if (tabBar) tabBar.classList.remove("hidden-in-chat");
  
  const desktopStage = document.getElementById("desktopFloatingStage");
  if (desktopStage) desktopStage.style.display = "none";

  activeCharacterId = null;
  switchTab("chats", updateUrl);
}
window.closeActiveChat = closeActiveChat;

// Interactive Floating Companion Dialogue & Stage Manager
function getCompanionInteractions(charId) {
  const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
  const normalizedId = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";

  if (normalizedId === "kou") {
    return [
      `${olderUserCap} ơi! Kou đứng đây ngắm ${olderUserTerm} học nè!`,
      `Senpai! You're doing so well, Kou is proud of you!`,
      `${olderUserCap} xoa đầu Kou một cái được không ạ?`,
      `Hôm nay ${olderUserTerm} nói chuyện với em nhiều hơn nha!`,
      "Senpai! Keep going! Kou is always cheering for you!"
    ];
  } else if (normalizedId === "ado") {
    return [
      "C-cậu nhìn tớ làm gì? Tập trung vào bài học đi chứ...",
      "D-don't stare so much! Make sure your grammar is correct!",
      "Thật ra... cậu tiến bộ nhanh lắm. Tớ chỉ nhắc nhở vậy thôi.",
      "Tớ đã chuẩn bị thêm tài liệu rồi, học xong tớ đưa cho.",
      "Đừng có cười lén tớ đấy nhé! Khụ... tớ là lớp phó nghiêm túc mà!"
    ];
  } else {
    return [
      "Sao thế nhóc? Bị vẻ đẹp trai của anh làm phân tâm rồi à?",
      "Come closer, kid. Don't be shy around your senior...",
      "Học chăm chỉ rồi anh sẽ thưởng cho một buổi đi chơi riêng nhé.",
      "Em ngoan ngoãn như vầy làm anh càng muốn trêu hơn đấy.",
      "You're getting bolder with every text, I love that about you."
    ];
  }
}

const COMPANION_INTERACTIONS = new Proxy({}, {
  get(target, prop) {
    return getCompanionInteractions(prop);
  }
});

let currentCompanionQuoteIndex = 0;
let companionQuoteTimeout = null;

function updateFloatingCompanion(charId, quoteOverride = null, mood = null, emotion = "normal") {
  if (!charId) charId = activeCharacterId || "ado";
  let normalizedId = charId;
  if (charId === "bao") normalizedId = "ado";
  if (charId === "julian") normalizedId = "kou";

  const char = CHARACTERS[normalizedId] || CHARACTERS.ado;
  const affectionPct = (userState.affection && userState.affection[normalizedId]) || 0;
  
  // 1. In-Chat Floating Mini Companion
  const inChatAvatar = document.getElementById("chatCompanionAvatarImg");
  const inChatName = document.getElementById("companionNameTag");
  const inChatBubble = document.getElementById("companionSpeechBubble");
  const inChatBubbleText = document.getElementById("companionSpeechText");
  const inChatSpeakerName = document.getElementById("companionSpeakerName");
  const inChatBadge = document.getElementById("companionHeartBadge");
  const inChatCompanion = document.getElementById("chatFloatingCompanion");

  let avatarSrc = char.avatar || "/assets/characters/ado_avatar.png";
  if (inChatAvatar) {
    inChatAvatar.onerror = function() {
      if (this.src.endsWith(".png")) {
        this.src = `/assets/characters/${normalizedId}_avatar.svg`;
      }
    };
    inChatAvatar.src = avatarSrc;
  }
  if (inChatName) inChatName.textContent = char.name.split(" ")[0];
  if (inChatSpeakerName) inChatSpeakerName.textContent = char.name.split(" ")[0];
  if (inChatBadge) inChatBadge.textContent = `${affectionPct}%`;
  if (inChatCompanion) inChatCompanion.style.display = "flex";

  // 2. Desktop Floating Side Stage
  const desktopStage = document.getElementById("desktopFloatingStage");
  const desktopSprite = document.getElementById("desktopSpriteImg");
  const desktopName = document.getElementById("stageCharName");
  const desktopArchetype = document.getElementById("stageCharArchetype");
  const desktopAffBar = document.getElementById("stageAffBarFill");
  const desktopAffText = document.getElementById("stageAffText");
  const desktopStatusMood = document.getElementById("stageStatusMood");
  const stageBubbleText = document.getElementById("stageSpeechText");
  const stageBubble = document.getElementById("stageSpeechBubble");

  let archetypeText = char.archetype || char.role || "Love Interest";
  if (normalizedId === "ado") {
    archetypeText = "Strict Classmate";
  } else if (normalizedId === "kou") {
    archetypeText = "Cute Junior";
  } else if (normalizedId === "ren") {
    archetypeText = "Flirty Senior";
  }

  if (desktopSprite) {
    const primarySrc = `/assets/characters/${normalizedId}/${emotion || 'normal'}.png`;
    const normalSrc = `/assets/characters/${normalizedId}/normal.png`;
    const fullbodySrc = `/assets/characters/${normalizedId}_fullbody.png`;
    const vectorSvg = (window.VN_SPRITES && window.VN_SPRITES[normalizedId] && (window.VN_SPRITES[normalizedId][emotion] || window.VN_SPRITES[normalizedId].normal)) || `/assets/characters/${normalizedId}_fullbody.svg`;

    let step = 0;
    desktopSprite.onerror = function() {
      step++;
      if (step === 1) {
        this.src = normalSrc;
      } else if (step === 2) {
        this.src = fullbodySrc;
      } else if (step === 3) {
        this.src = vectorSvg;
      } else {
        this.onerror = null;
      }
    };
    desktopSprite.src = primarySrc;
  }

  if (desktopName) desktopName.innerHTML = `${char.name}`;
  if (desktopArchetype) desktopArchetype.textContent = archetypeText;
  if (desktopAffBar) desktopAffBar.style.width = `${Math.min(100, Math.max(0, affectionPct))}%`;
  if (desktopAffText) desktopAffText.textContent = `${affectionPct}%`;
  if (desktopStatusMood) desktopStatusMood.textContent = mood ? cleanEmojiText(mood) : "Listening to you attentively...";
  if (desktopStage) desktopStage.style.display = "none";

  // Speech bubble quote
  let quote = quoteOverride;
  if (!quote) {
    const quotes = COMPANION_INTERACTIONS[normalizedId] || COMPANION_INTERACTIONS.ado;
    quote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  if (inChatBubbleText) inChatBubbleText.textContent = quote;
  if (stageBubbleText) stageBubbleText.textContent = quote;

  // Show speech bubble on top of character (persists until next message)
  if (inChatBubble) {
    inChatBubble.style.display = "flex";
    inChatBubble.classList.remove("pop-anim");
    void inChatBubble.offsetWidth;
    inChatBubble.classList.add("pop-anim");
  }
  if (stageBubble) {
    stageBubble.style.display = "block";
    stageBubble.classList.remove("pop-anim");
    void stageBubble.offsetWidth;
    stageBubble.classList.add("pop-anim");
  }

  if (companionQuoteTimeout) {
    clearTimeout(companionQuoteTimeout);
    companionQuoteTimeout = null;
  }
}
window.updateFloatingCompanion = updateFloatingCompanion;

function interactWithFloatingCompanion() {
  const charId = activeCharacterId || "ado";
  let normalizedId = charId;
  if (charId === "bao") normalizedId = "ado";
  if (charId === "julian") normalizedId = "kou";

  const quotes = COMPANION_INTERACTIONS[normalizedId] || COMPANION_INTERACTIONS.ado;
  
  currentCompanionQuoteIndex = (currentCompanionQuoteIndex + 1) % quotes.length;
  const selectedQuote = quotes[currentCompanionQuoteIndex];
  
  let mood = "Happy & Chatty 💕";
  if (normalizedId === "kou") mood = "Blushing Tsundere 😳";
  if (normalizedId === "ren") mood = "Playfully Teasing 😏";
  if (normalizedId === "ado") mood = "Adoring Junior 🥺✨";

  // Gentle interaction bonus: +0.2% up to 5 times per session to feel natural
  if (!userState.companionPokeCount) userState.companionPokeCount = 0;
  if (userState.companionPokeCount < 5) {
    userState.companionPokeCount++;
    increaseAffection(normalizedId, 0.2);
  } else {
    triggerHeartBurst("💕");
  }
  updateFloatingCompanion(normalizedId, selectedQuote, mood);

  // Add bounce effect to sprite and avatar
  const inChatAvatarRing = document.querySelector(".companion-avatar-ring");
  const desktopSpriteImg = document.getElementById("desktopSpriteImg");
  if (inChatAvatarRing) {
    inChatAvatarRing.classList.remove("bounce-anim");
    void inChatAvatarRing.offsetWidth;
    inChatAvatarRing.classList.add("bounce-anim");
  }
  if (desktopSpriteImg) {
    desktopSpriteImg.classList.remove("bounce-anim");
    void desktopSpriteImg.offsetWidth;
    desktopSpriteImg.classList.add("bounce-anim");
  }
}
window.interactWithFloatingCompanion = interactWithFloatingCompanion;

// Switch Bottom Tabs
function switchTab(tabName, updateUrl = true) {
  if (tabName === "landing") {
    returnToLandingPage(updateUrl);
    return;
  }

  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.remove("active");
    chatWin.style.display = "none";
  }
  const navDock = document.querySelector(".bottom-nav-dock");
  if (navDock) navDock.classList.remove("hidden-in-chat");
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
  if (tabName === "story") renderStoryMode();
  if (tabName === "progress" || tabName === "guidebook") renderGuidebook();

  if (updateUrl) {
    const routePath = (tabName === "progress" || tabName === "guidebook") ? "/guidebook" : `/${tabName}`;
    updateRouteUrl(routePath);
  }
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

// Render Chatrooms List Carousel
function renderChatList() {
  const container = document.getElementById("chatListContainer");
  const dotsContainer = document.getElementById("messengerCarouselIndicators");
  if (!container) return;
  container.innerHTML = "";

  const charList = Object.values(CHARACTERS);
  const totalCards = charList.length + 1; // Includes future update card

  charList.forEach((char, idx) => {
    const affectionPct = userState.affection[char.id] || 0;
    const unreadCount = userState.unreadMessages[char.id] || 0;
    const isPout = userState.isPouting[char.id] || false;

    const history = userState.chatHistories[char.id] || [];
    const lastMsg = history.length > 0 ? history[history.length - 1].text : char.greeting;

    const relInfo = getRelationshipInfo(affectionPct);
    let badgeHtml = "";
    if (isPout) {
      badgeHtml = `<span class="square-pout-badge">💢 Pouting</span>`;
    } else if (unreadCount > 0) {
      badgeHtml = `<span class="square-unread-badge">🔴 ${unreadCount}</span>`;
    }

    let pfpCoverHtml = `
      <img src="${char.avatar}" class="square-pfp-img" alt="${char.name}" onerror="this.onerror=null; this.src='/assets/characters/${char.id}_avatar.png';" />
    `;

    const card = document.createElement("div");
    card.className = "chat-card square-char-card";
    card.setAttribute("data-card-index", idx);
    card.onclick = () => openChatroom(char.id);

    card.innerHTML = `
      <div class="square-pfp-bg-wrap">
        ${pfpCoverHtml}
        <div class="square-card-scrim"></div>
      </div>

      <div class="square-card-top-badges">
        <div class="square-status-badge">
          <span class="square-online-dot ${isPout ? 'pout-dot' : ''}"></span>
          <span>${isPout ? 'Waiting' : 'Online'}</span>
        </div>
        ${badgeHtml ? badgeHtml : `<span class="square-affection-pill relationship-milestone-badge ${relInfo.badgeClass}"><span class="material-symbols-outlined" style="font-size:12px; color:var(--primary-pink);">favorite</span> ${relInfo.icon} ${affectionPct}%</span>`}
      </div>

      <div class="square-card-bottom-info">
        <div class="square-char-name">
          <span>${char.name}</span>
          <span class="flag-icon">${char.flag}</span>
        </div>
        <div class="square-char-role">${char.archetype || char.role}</div>
        
        <div class="square-aff-bar-row">
          <div class="square-aff-bar-wrap">
            <div class="square-aff-bar-fill" style="width: ${affectionPct}%;"></div>
          </div>
          <span class="square-aff-pct">${affectionPct}%</span>
        </div>

        <div class="square-action-row">
          <span class="square-snippet" title="${lastMsg || ''}">${isPout ? 'Waiting for your reply...' : (lastMsg || 'Tap to start conversation')}</span>
          <button class="square-chat-btn" type="button" aria-label="Chat with ${char.name}" onclick="event.stopPropagation(); openChatroom('${char.id}');">
            <span class="material-symbols-outlined">chat</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Future Update Locked Dark Card with Cross
  const lockedCard = document.createElement("div");
  lockedCard.className = "chat-card square-char-card locked-future-card";
  lockedCard.setAttribute("data-card-index", charList.length);
  lockedCard.onclick = () => openFutureCharacterModal();

  lockedCard.innerHTML = `
    <div class="square-pfp-bg-wrap locked-pfp-bg-wrap">
      <div class="locked-dark-backdrop"></div>
      <div class="locked-card-scrim"></div>
    </div>

    <div class="square-card-top-badges">
      <div class="square-status-badge locked-status-badge">
        <span class="material-symbols-outlined" style="font-size:12px; color:#a78bfa;">lock</span>
        <span>Coming Soon</span>
      </div>
      <span class="square-affection-pill locked-pill">
        <span class="material-symbols-outlined" style="font-size:12px; color:#c4b5fd;">auto_awesome</span>
        <span>Expansion</span>
      </span>
    </div>

    <!-- Centered Dark Cross / Plus Feature -->
    <div class="locked-cross-center">
      <div class="locked-cross-box">
        <span class="material-symbols-outlined locked-cross-glyph">add</span>
      </div>
      <span class="locked-cross-tag">Future Update</span>
    </div>

    <div class="square-card-bottom-info">
      <div class="square-char-name locked-name">
        <span>New Companion</span>
        <span class="locked-name-icon">🔒</span>
      </div>
      <div class="square-char-role locked-role">Upcoming Story &amp; Love Interest</div>
      <div class="square-action-row">
        <span class="square-snippet locked-snippet">New character storyline currently in development</span>
        <button class="square-chat-btn locked-chat-btn" type="button" aria-label="Future update info" onclick="event.stopPropagation(); openFutureCharacterModal();">
          <span class="material-symbols-outlined">lock</span>
        </button>
      </div>
    </div>
  `;

  container.appendChild(lockedCard);

  // Render Carousel Dots Indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute("aria-label", i < charList.length ? `Go to ${charList[i].name}` : "Go to Coming Soon card");
      dot.onclick = () => scrollToMessengerCard(i);
      dotsContainer.appendChild(dot);
    }
  }

  // Bind scroll event to update indicators
  if (!container.dataset.scrollBound) {
    container.dataset.scrollBound = "true";
    container.addEventListener("scroll", updateMessengerCarouselIndicators, { passive: true });
  }

  // Initial indicator update
  updateMessengerCarouselIndicators();
}

function updateMessengerCarouselIndicators() {
  const container = document.getElementById("chatListContainer");
  const dotsContainer = document.getElementById("messengerCarouselIndicators");
  if (!container || !dotsContainer) return;
  const cards = container.querySelectorAll(".square-char-card");
  if (!cards.length) return;

  const scrollLeft = container.scrollLeft;
  const center = scrollLeft + container.clientWidth / 2;

  let activeIndex = 0;
  let minDistance = Infinity;

  cards.forEach((card, idx) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const dist = Math.abs(center - cardCenter);
    if (dist < minDistance) {
      minDistance = dist;
      activeIndex = idx;
    }
  });

  const dots = dotsContainer.querySelectorAll(".carousel-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeIndex);
  });

  const prevBtn = document.getElementById("msgCarouselPrev");
  const nextBtn = document.getElementById("msgCarouselNext");
  if (prevBtn) prevBtn.disabled = container.scrollLeft <= 5;
  if (nextBtn) nextBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;
}

window.scrollMessengerCarousel = function(direction) {
  const container = document.getElementById("chatListContainer");
  if (!container) return;
  const cards = container.querySelectorAll(".square-char-card");
  if (!cards.length) return;
  const cardWidth = (cards[0].offsetWidth || 340) + 20;
  container.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
};

window.scrollToMessengerCard = function(index) {
  const container = document.getElementById("chatListContainer");
  if (!container) return;
  const cards = container.querySelectorAll(".square-char-card");
  if (cards[index]) {
    cards[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
};

window.openFutureCharacterModal = function() {
  // Check if modal already exists
  let modal = document.getElementById("futureCharModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "futureCharModal";
    modal.className = "locked-modal-backdrop";
    modal.onclick = (e) => {
      if (e.target === modal) closeFutureCharacterModal();
    };
    modal.innerHTML = `
      <div class="locked-modal-content">
        <div class="locked-modal-cross-wrap">
          <span class="material-symbols-outlined locked-modal-cross">add</span>
        </div>
        <h3 class="locked-modal-title">New Love Interest Coming Soon</h3>
        <p class="locked-modal-desc">
          We're crafting brand new character personalities, interactive voice lines, and romantic story date scenarios for future updates!
        </p>
        <div class="locked-modal-features">
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">auto_awesome</span>
            <span>New Voice Lines &amp; AI Dialogue</span>
          </div>
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">favorite</span>
            <span>Unique Date Challenges &amp; Scenarios</span>
          </div>
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">translate</span>
            <span>Advanced Fluency &amp; Grammar Drills</span>
          </div>
        </div>
        <button type="button" class="locked-modal-close-btn" onclick="closeFutureCharacterModal()">
          <span>Got it!</span>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
};

window.closeFutureCharacterModal = function() {
  const modal = document.getElementById("futureCharModal");
  if (modal) {
    modal.classList.remove("active");
  }
};

// Render Characters Tab
function renderCharactersList() {
  const container = document.getElementById("charactersListContainer");
  if (!container) return;
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const affectionPct = userState.affection[char.id] || 0;
    const relInfo = getRelationshipInfo(affectionPct);

    let pfpCoverHtml = `
      <img src="${char.avatar}" class="square-pfp-img" alt="${char.name}" onerror="this.onerror=null; this.src='/assets/characters/${char.id}_avatar.png';" />
    `;

    const card = document.createElement("div");
    card.className = "character-card square-char-card";
    card.onclick = () => openChatroom(char.id);

    card.innerHTML = `
      <div class="square-pfp-bg-wrap">
        ${pfpCoverHtml}
        <div class="square-card-scrim"></div>
      </div>

      <div class="square-card-top-badges">
        <span class="square-status-badge">
          <span class="square-online-dot"></span>
          <span>${char.language || 'Multi'}</span>
        </span>
        <span class="square-affection-pill relationship-milestone-badge ${relInfo.badgeClass}">
          <span class="material-symbols-outlined" style="font-size:12px; color:var(--primary-pink);">favorite</span>
          ${relInfo.icon} ${relInfo.stage} (${affectionPct}%)
        </span>
      </div>

      <div class="square-card-bottom-info">
        <div class="square-char-name">
          <span>${char.name}</span>
          <span class="flag-icon">${char.flag}</span>
        </div>
        <div class="square-char-role">${char.role}</div>
        <div class="square-char-desc">${char.personality}</div>
        <div class="square-action-row" style="margin-top:6px;">
          <div class="square-aff-bar-wrap">
            <div class="square-aff-bar-fill" style="width: ${affectionPct}%;"></div>
          </div>
          <button class="square-chat-btn" type="button" aria-label="Chat with ${char.name}" onclick="event.stopPropagation(); openChatroom('${char.id}');">
            <span class="material-symbols-outlined">chat</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ============================================================================
// OPENKOTO AI MEDIA LEARNING LAB ENGINE
// Inspired by hikariming/openkoto
// ============================================================================

function setOpenkotoTargetLang(lang) {
  openkotoState.targetLang = lang;
  renderGuidebook();
}
window.setOpenkotoTargetLang = setOpenkotoTargetLang;

function setOpenkotoCustomFocus(focus) {
  openkotoState.customFocus = focus;
}
window.setOpenkotoCustomFocus = setOpenkotoCustomFocus;

function setGuidebookSubMode(mode) {
  currentGuidebookSubMode = mode;
  window.currentGuidebookSubMode = mode;
  renderGuidebook();
}
window.setGuidebookSubMode = setGuidebookSubMode;

function setOpenkotoSource(source) {
  openkotoState.activeSource = source;
  renderGuidebook();
}
window.setOpenkotoSource = setOpenkotoSource;

function toggleOpenkotoBilingual() {
  openkotoState.bilingualVisible = !openkotoState.bilingualVisible;
  renderGuidebook();
}
window.toggleOpenkotoBilingual = toggleOpenkotoBilingual;

function toggleOpenkotoPhonetics() {
  openkotoState.phoneticsVisible = !openkotoState.phoneticsVisible;
  renderGuidebook();
}
window.toggleOpenkotoPhonetics = toggleOpenkotoPhonetics;

function setOpenkotoQuizMode(mode) {
  openkotoState.activeQuizMode = mode;
  // Initialize scramble state if needed
  if (mode === "scramble" && openkotoState.activeLesson && openkotoState.activeLesson.quizzes) {
    const scrambleQuiz = openkotoState.activeLesson.quizzes.find((q) => q.type === "sentence_scramble");
    if (scrambleQuiz) {
      openkotoState.activeQuizState.scramblePicked = [];
      openkotoState.activeQuizState.scrambleRemaining = [...(scrambleQuiz.scrambledWords || [])];
    }
  }
  renderGuidebook();
}
window.setOpenkotoQuizMode = setOpenkotoQuizMode;

// Speech Synthesis Helper
function speakOpenkotoPhrase(text, lang = "vi") {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap = {
    vi: "vi-VN",
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN"
  };
  utterance.lang = langMap[lang] || "vi-VN";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}
window.speakOpenkotoPhrase = speakOpenkotoPhrase;

// Preset Media Samples
const OPENKOTO_PRESETS = {
  cafe_date: {
    title: "Cafe Date Dialogue (Hẹn Hò Quán Cà Phê)",
    type: "text",
    lang: "vi",
    focus: "Romance & Everyday Dating",
    text: "Hôm nay được đi cà phê với em vui thật đấy. Lần sau chúng mình lại cùng đi uống trà sữa nữa nhé! Anh muốn được ở bên em nhiều hơn."
  },
  anime_romance: {
    title: "Anime Confession & Banter (アニメの告白)",
    type: "text",
    lang: "ja",
    focus: "Anime Dialogue & Sweet Banter",
    text: "今日は来てくれてありがとう。君と一緒に過ごす時間が一番好きだよ。また明日も会えるかな？ずっと隣にいてほしいな。"
  },
  kpop_lyrics: {
    title: "Romantic Ballad Lyrics (달콤한 발라드)",
    type: "text",
    lang: "ko",
    focus: "Song Lyrics & Affection",
    text: "오늘 너를 만나서 정말 행복했어. 내일도 우리 다시 만날 수 있을까? 언제나 네 곁에 있고 싶어. 사랑해."
  },
  tea_poetry: {
    title: "Savoring Tea & Poetry (品茶时光)",
    type: "text",
    lang: "zh",
    focus: "Tea Culture & Gentle Whispers",
    text: "今天和你一起喝茶很开心。希望明天我们还能再见。有你陪伴的时光最温柔。"
  }
};

function applyOpenkotoPreset(presetKey) {
  const preset = OPENKOTO_PRESETS[presetKey];
  if (!preset) return;
  openkotoState.activeSource = "text";
  openkotoState.pastedText = preset.text;
  openkotoState.targetLang = preset.lang;
  openkotoState.customFocus = preset.focus;
  openkotoState.mediaFile = null;
  openkotoState.mediaBase64 = null;
  openkotoState.mediaMimeType = null;
  openkotoState.mediaType = "text";
  openkotoState.fileName = preset.title;
  renderGuidebook();
}
window.applyOpenkotoPreset = applyOpenkotoPreset;

// Chat Importer Helpers for OpenKoto AI Media Lab
function setOpenkotoChatChar(charId) {
  openkotoState.selectedChatChar = charId;
  openkotoState.selectedChatMsgs = [];
  renderGuidebook();
}
window.setOpenkotoChatChar = setOpenkotoChatChar;

function toggleOpenkotoChatMsgSelection(msgIndex) {
  const idx = parseInt(msgIndex, 10);
  if (isNaN(idx)) return;
  if (!openkotoState.selectedChatMsgs) openkotoState.selectedChatMsgs = [];
  const foundPos = openkotoState.selectedChatMsgs.indexOf(idx);
  if (foundPos >= 0) {
    openkotoState.selectedChatMsgs.splice(foundPos, 1);
  } else {
    openkotoState.selectedChatMsgs.push(idx);
  }
  renderGuidebook();
}
window.toggleOpenkotoChatMsgSelection = toggleOpenkotoChatMsgSelection;

function selectAllOpenkotoChatMsgs() {
  const charId = openkotoState.selectedChatChar || "ado";
  const history = userState.chatHistories[charId] || [];
  openkotoState.selectedChatMsgs = history.map((_, i) => i);
  renderGuidebook();
}
window.selectAllOpenkotoChatMsgs = selectAllOpenkotoChatMsgs;

function clearOpenkotoChatMsgSelection() {
  openkotoState.selectedChatMsgs = [];
  renderGuidebook();
}
window.clearOpenkotoChatMsgSelection = clearOpenkotoChatMsgSelection;

function importRecentChatExchanges(charId, count = 6, autoAnalyze = false) {
  if (!charId) charId = openkotoState.selectedChatChar || "ado";
  const history = userState.chatHistories[charId] || [];
  const char = CHARACTERS[charId] || CHARACTERS.ado;
  if (history.length === 0) {
    alert(`No messages yet with ${char.name}. Say hello in their chatroom first!`);
    return;
  }
  const slice = history.slice(-count);
  const formattedText = slice.map((m) => {
    const speaker = m.sender === "user" ? (userState.userProfile?.name || "You") : (m.speakerName || char.name);
    return `${speaker}: ${cleanEmojiText(m.text || "")}`;
  }).join("\n");

  openkotoState.pastedText = formattedText;
  openkotoState.mediaType = "text";
  openkotoState.mediaFile = null;
  openkotoState.mediaBase64 = null;
  openkotoState.mediaMimeType = null;
  openkotoState.fileName = `${char.name} Dialogue (Last ${slice.length} messages)`;
  openkotoState.targetLang = userState.targetLanguage || "vi";

  if (autoAnalyze) {
    generateOpenkotoLesson();
  } else {
    openkotoState.activeSource = "text";
    renderGuidebook();
  }
}
window.importRecentChatExchanges = importRecentChatExchanges;

function importSelectedChatMsgsToOpenkoto(autoAnalyze = false) {
  const charId = openkotoState.selectedChatChar || "ado";
  const history = userState.chatHistories[charId] || [];
  const char = CHARACTERS[charId] || CHARACTERS.ado;
  const indices = (openkotoState.selectedChatMsgs || []).sort((a, b) => a - b);
  
  if (indices.length === 0) {
    alert("Please select at least one message using the checkboxes, or choose '⚡ Last 6 Msgs'.");
    return;
  }

  const selected = indices.map(i => history[i]).filter(Boolean);
  if (selected.length === 0) return;

  const formattedText = selected.length === 1 && selected[0].text
    ? cleanEmojiText(selected[0].text)
    : selected.map(m => {
        const speaker = m.sender === "user" ? (userState.userProfile?.name || "You") : (m.speakerName || char.name);
        return `${speaker}: ${cleanEmojiText(m.text || "")}`;
      }).join("\n");

  openkotoState.pastedText = formattedText;
  openkotoState.mediaType = "text";
  openkotoState.mediaFile = null;
  openkotoState.mediaBase64 = null;
  openkotoState.mediaMimeType = null;
  openkotoState.fileName = `${char.name} Chat (${selected.length} message${selected.length > 1 ? "s" : ""})`;
  openkotoState.targetLang = userState.targetLanguage || "vi";

  if (autoAnalyze) {
    generateOpenkotoLesson();
  } else {
    openkotoState.activeSource = "text";
    renderGuidebook();
  }
}
window.importSelectedChatMsgsToOpenkoto = importSelectedChatMsgsToOpenkoto;

function importSingleChatMsgToMediaLab(charId, msgIndex, autoAnalyze = true) {
  if (!charId) charId = activeCharacterId || "ado";
  const history = userState.chatHistories[charId] || [];
  const char = CHARACTERS[charId] || CHARACTERS.ado;
  const msg = history[msgIndex];
  if (!msg || !msg.text) return;

  const cleanText = cleanEmojiText(msg.text);
  const speaker = msg.sender === "user" ? (userState.userProfile?.name || "You") : (msg.speakerName || char.name);

  openkotoState.pastedText = cleanText;
  openkotoState.mediaFile = null;
  openkotoState.mediaBase64 = null;
  openkotoState.mediaMimeType = null;
  openkotoState.mediaType = "text";
  openkotoState.fileName = `${speaker} Message: "${cleanText.slice(0, 30)}${cleanText.length > 30 ? "..." : ""}"`;
  openkotoState.targetLang = userState.targetLanguage || "vi";
  openkotoState.selectedChatChar = charId;
  openkotoState.activeSource = "text";

  // Visual toast feedback
  const toast = document.createElement("div");
  toast.className = "reset-success-toast";
  toast.style.cssText = "position:fixed; top:24px; left:50%; transform:translateX(-50%); z-index:9999; display:flex; align-items:center; gap:8px; background:linear-gradient(135deg, #364895 0%, #9083C4 100%); color:#ffffff; font-weight:800; font-size:13.5px; padding:12px 22px; border-radius:30px; box-shadow:0 8px 24px rgba(54,72,149,0.45); pointer-events:none;";
  toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px;">auto_awesome</span> <span>Imported message to <strong>AI Media Lab</strong>!</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);

  // Switch to progress / AI Media Lab
  if (typeof enterAppFromLanding === "function") enterAppFromLanding(false);
  if (typeof closeActiveChat === "function") closeActiveChat(false);
  switchTab("progress", true);
  setGuidebookSubMode("openkoto");

  if (autoAnalyze) {
    setTimeout(() => {
      generateOpenkotoLesson();
    }, 150);
  }
}
window.importSingleChatMsgToMediaLab = importSingleChatMsgToMediaLab;

function exportCurrentChatToMediaLab() {
  const charId = activeCharacterId || "ado";
  openkotoState.selectedChatChar = charId;
  openkotoState.activeSource = "chat";
  openkotoState.selectedChatMsgs = [];
  
  if (typeof enterAppFromLanding === "function") enterAppFromLanding(false);
  if (typeof closeActiveChat === "function") closeActiveChat(false);
  switchTab("progress", true);
  setGuidebookSubMode("openkoto");
}
window.exportCurrentChatToMediaLab = exportCurrentChatToMediaLab;

function importCurrentSpeechBubbleToMediaLab() {
  const charId = activeCharacterId || "ado";
  const char = CHARACTERS[charId] || CHARACTERS.ado;
  const textEl = document.getElementById("companionSpeechText");
  const text = textEl ? textEl.innerText.trim() : "";
  if (!text) return;
  
  openkotoState.pastedText = cleanEmojiText(text);
  openkotoState.mediaFile = null;
  openkotoState.mediaBase64 = null;
  openkotoState.mediaMimeType = null;
  openkotoState.mediaType = "text";
  openkotoState.fileName = `${char.name} Speech: "${text.slice(0, 30)}${text.length > 30 ? "..." : ""}"`;
  openkotoState.targetLang = userState.targetLanguage || "vi";
  openkotoState.selectedChatChar = charId;
  openkotoState.activeSource = "text";

  const toast = document.createElement("div");
  toast.className = "reset-success-toast";
  toast.style.cssText = "position:fixed; top:24px; left:50%; transform:translateX(-50%); z-index:9999; display:flex; align-items:center; gap:8px; background:linear-gradient(135deg, #364895 0%, #9083C4 100%); color:#ffffff; font-weight:800; font-size:13.5px; padding:12px 22px; border-radius:30px; box-shadow:0 8px 24px rgba(54,72,149,0.45); pointer-events:none;";
  toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px;">auto_awesome</span> <span>Imported message to <strong>AI Media Lab</strong>!</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3500);

  if (typeof enterAppFromLanding === "function") enterAppFromLanding(false);
  if (typeof closeActiveChat === "function") closeActiveChat(false);
  switchTab("progress", true);
  setGuidebookSubMode("openkoto");

  setTimeout(() => {
    generateOpenkotoLesson();
  }, 150);
}
window.importCurrentSpeechBubbleToMediaLab = importCurrentSpeechBubbleToMediaLab;

// File Upload Handler
function handleOpenkotoFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  processUploadedMediaFile(file);
}
window.handleOpenkotoFileSelect = handleOpenkotoFileSelect;

function handleOpenkotoDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const dt = e.dataTransfer;
  if (dt && dt.files && dt.files[0]) {
    processUploadedMediaFile(dt.files[0]);
  }
}
window.handleOpenkotoDrop = handleOpenkotoDrop;

function processUploadedMediaFile(file) {
  openkotoState.mediaFile = file;
  openkotoState.fileName = file.name;
  
  if (file.type.startsWith("image/")) {
    openkotoState.mediaType = "image";
  } else if (file.type.startsWith("audio/")) {
    openkotoState.mediaType = "audio";
  } else if (file.type.startsWith("video/")) {
    openkotoState.mediaType = "video";
  } else {
    openkotoState.mediaType = "text";
  }

  const reader = new FileReader();
  if (openkotoState.mediaType === "text") {
    reader.onload = (e) => {
      openkotoState.pastedText = e.target.result;
      openkotoState.mediaBase64 = null;
      openkotoState.mediaMimeType = file.type || "text/plain";
      renderGuidebook();
    };
    reader.readAsText(file);
  } else {
    reader.onload = (e) => {
      openkotoState.mediaBase64 = e.target.result;
      openkotoState.mediaMimeType = file.type;
      renderGuidebook();
    };
    reader.readAsDataURL(file);
  }
}

function clearOpenkotoMedia() {
  openkotoState.mediaFile = null;
  openkotoState.mediaBase64 = null;
  openkotoState.mediaMimeType = null;
  openkotoState.mediaType = null;
  openkotoState.fileName = "";
  openkotoState.pastedText = "";
  renderGuidebook();
}
window.clearOpenkotoMedia = clearOpenkotoMedia;

// Generate OpenKoto AI Learning Pack
// Generate Client-Side Fallback OpenKoto Lesson if offline/server error
function buildClientFallbackLesson(targetLang, mediaType, customFocus, text) {
  const langNames = {
    vi: "Vietnamese",
    en: "English",
    ja: "Japanese",
    ko: "Korean",
    zh: "Mandarin Chinese"
  };
  const langName = langNames[targetLang] || "Vietnamese";
  
  if (targetLang === "ja") {
    return {
      title: "メディア学習: " + (customFocus || "Daily Romance Dialogue"),
      summary: "Explore essential Japanese expressions, polite and romantic nuances, and sentence structure.",
      level: "Beginner (N5/A1)",
      language: langName,
      mediaType: mediaType || "text",
      estimatedStudyTime: "6 mins",
      sentences: [
        {
          index: 1,
          original: text && text.trim() ? text.trim().slice(0, 50) : "一緒にカフェに行きませんか？",
          phonetic: "Issho ni kafe ni ikimasen ka?",
          translation: "Would you like to go to a cafe together?",
          grammarNote: "Polite invitation using negative form 〜ませんか (masen ka).",
          tokens: [
            { word: "一緒に", lemma: "一緒", pos: "Adverb", phonetic: "issho ni", meaning: "together", note: "Used for joint actions." },
            { word: "カフェ", lemma: "カフェ", pos: "Noun", phonetic: "kafe", meaning: "cafe", note: "Katakana loanword." },
            { word: "に", lemma: "に", pos: "Particle", phonetic: "ni", meaning: "to/at", note: "Destination marker." },
            { word: "行きませんか", lemma: "行く", pos: "Verb", phonetic: "ikimasen ka", meaning: "won't we go?", note: "Inviting someone gently." }
          ]
        },
        {
          index: 2,
          original: "楽しみにしています！",
          phonetic: "Tanoshimi ni shiteimasu!",
          translation: "I'm looking forward to it!",
          grammarNote: "Natural expression showing positive anticipation.",
          tokens: [
            { word: "楽しみに", lemma: "楽しみ", pos: "Noun", phonetic: "tanoshimi ni", meaning: "with anticipation", note: "Adverbial form." },
            { word: "しています", lemma: "する", pos: "Verb", phonetic: "shiteimasu", meaning: "doing / am", note: "Continuous polite state." }
          ]
        }
      ],
      coreVocabulary: [
        { word: "一緒", phonetic: "issho", pos: "Noun", meaning: "together", difficulty: "N5", example: "一緒に行こう！", exampleTranslation: "Let's go together!" },
        { word: "カフェ", phonetic: "kafe", pos: "Noun", meaning: "cafe", difficulty: "N5", example: "駅前のカフェ", exampleTranslation: "The cafe in front of the station." },
        { word: "楽しみ", phonetic: "tanoshimi", pos: "Noun", meaning: "pleasure / anticipation", difficulty: "N5", example: "明日が楽しみです。", exampleTranslation: "I'm excited for tomorrow." }
      ],
      grammarPoints: [
        {
          title: "Polite Invitation: 〜ませんか (masen ka)",
          pattern: "Verb [Stem] + ませんか",
          explanation: "Used to gently and courteously invite someone to do something together without sounding pushy.",
          romanceContext: "Standard polite romantic invitation for initial dates."
        }
      ],
      culturalInsights: [
        {
          title: "Indirect Invitations in Japanese Dating",
          category: "Romance & Etiquette",
          description: "Phrasing invitations in the negative (won't you?) allows the other person to easily decline without losing face."
        }
      ],
      quizzes: [
        {
          type: "multiple_choice",
          question: "What does '一緒に' (issho ni) mean in this sentence?",
          options: ["Alone", "Together", "Quickly", "Tomorrow"],
          correctIndex: 1,
          explanation: "'一緒に' means together with someone."
        },
        {
          type: "sentence_scramble",
          targetSentence: "一緒に カフェ に 行きませんか",
          translation: "Would you like to go to a cafe together?",
          scrambledWords: ["行きませんか", "に", "一緒に", "カフェ"],
          correctWords: ["一緒に", "カフェ", "に", "行きませんか"]
        },
        {
          type: "cloze",
          sentenceWithBlank: "明日が ___ です。(I am looking forward to tomorrow.)",
          blankWord: "楽しみ",
          options: ["楽しみ", "悲しみ", "怒り", "静か"],
          correctIndex: 0,
          explanation: "'楽しみ' (tanoshimi) expresses looking forward to something."
        },
        {
          type: "roleplay",
          scenario: "Ado looks over at your notes in the library.",
          characterPrompt: "Ado: 'B-betsu ni... If you need help with this chapter, you can just ask me.'",
          characterName: "Ado",
          options: [
            { reply: "Arigatou! Let's study together.", feedback: "Ado blushes slightly: 'Hmph, fine. Make sure you pay attention!'" },
            { reply: "I'm fine on my own.", feedback: "Ado pouts: 'Suit yourself... don't come crying if the test is hard.'" }
          ]
        }
      ]
    };
  }

  // Default: Vietnamese / General
  return {
    title: "Bài Học Tương Tác: " + (customFocus || "Giao Tiếp Tình Cảm"),
    summary: "Khám phá từ vựng trọng tâm, cấu trúc xưng hô tự nhiên và mẫu câu biểu cảm trong tiếng Việt.",
    level: "Cơ Bản (A1/A2)",
    language: langName,
    mediaType: mediaType || "text",
    estimatedStudyTime: "5-8 phút",
    sentences: [
      {
        index: 1,
        original: text && text.trim() ? text.trim().slice(0, 60) : "Hôm nay cậu có rảnh không, chúng mình cùng đi dạo nhé?",
        phonetic: "Hom nay cau co ranh khong, chung minh cung di dao nhe?",
        translation: "Are you free today, shall we go for a walk together?",
        grammarNote: "Cấu trúc rủ rê thân mật bằng trợ từ 'nhé' và xưng hô 'cậu - mình'.",
        tokens: [
          { word: "Hôm nay", lemma: "hôm nay", pos: "Danh từ", phonetic: "hom nay", meaning: "today", note: "Thời điểm hiện tại." },
          { word: "cậu", lemma: "cậu", pos: "Đại từ", phonetic: "cau", meaning: "you (classmate)", note: "Xưng hô ngang hàng thân thiện." },
          { word: "có rảnh không", lemma: "rảnh", pos: "Cụm vị từ", phonetic: "co ranh khong", meaning: "are you free?", note: "Câu hỏi thăm thời gian rảnh." },
          { word: "đi dạo", lemma: "đi dạo", pos: "Động từ", phonetic: "di dao", meaning: "stroll / walk", note: "Hoạt động dạo phố thư giãn." },
          { word: "nhé", lemma: "nhé", pos: "Trợ từ", phonetic: "nhe", meaning: "okay? / shall we?", note: "Tạo cảm giác ngọt ngào, mời gọi." }
        ]
      },
      {
        index: 2,
        original: "Mình rất muốn được trò chuyện cùng cậu nhiều hơn.",
        phonetic: "Minh rat muon duoc tro chuyen cung cau nhieu hon.",
        translation: "I really want to talk with you more.",
        grammarNote: "Bày tỏ mong muốn chân thành với 'rất muốn' và 'nhiều hơn'.",
        tokens: [
          { word: "Mình", lemma: "mình", pos: "Đại từ", phonetic: "minh", meaning: "I / me", note: "Xưng hô gần gũi." },
          { word: "rất muốn", lemma: "muốn", pos: "Cụm động từ", phonetic: "rat muon", meaning: "really want to", note: "Biểu đạt nguyện vọng." },
          { word: "trò chuyện", lemma: "trò chuyện", pos: "Động từ", phonetic: "tro chuyen", meaning: "to chat / converse", note: "Nói chuyện thân mật." },
          { word: "nhiều hơn", lemma: "nhiều", pos: "Phó từ", phonetic: "nhieu hon", meaning: "more", note: "So sánh mức độ tăng thêm." }
        ]
      }
    ],
    coreVocabulary: [
      { word: "Hôm nay", phonetic: "hom nay", pos: "Danh từ", meaning: "today", difficulty: "A1", example: "Hôm nay thời tiết đẹp quá.", exampleTranslation: "The weather is so nice today." },
      { word: "Đi dạo", phonetic: "di dao", pos: "Động từ", meaning: "go for a walk", difficulty: "A1", example: "Chúng mình đi dạo một chút nhé.", exampleTranslation: "Let's take a short walk." },
      { word: "Trò chuyện", phonetic: "tro chuyen", pos: "Động từ", meaning: "chat / talk", difficulty: "A2", example: "Tớ thích trò chuyện với cậu.", exampleTranslation: "I love chatting with you." }
    ],
    grammarPoints: [
      {
        title: "Cấu trúc rủ rê thân mật: ... nhé?",
        pattern: "[Mệnh đề hành động] + nhé?",
        explanation: "Trợ từ 'nhé' đặt cuối câu để biến câu trần thuật thành lời rủ rê dịu dàng, đáng yêu.",
        romanceContext: "Cực kỳ phổ biến khi nhắn tin với crush hoặc người thương."
      }
    ],
    culturalInsights: [
      {
        title: "Nghệ thuật xưng hô trong tình cảm",
        category: "Giao Tiếp & Tình Cảm",
        description: "Từ xưng hô 'cậu - mình' mang nét học đường trong sáng, chuyển dần sang 'anh - em' khi mối quan hệ tiến triển sâu sắc hơn."
      }
    ],
    quizzes: [
      {
        type: "multiple_choice",
        question: "Từ 'đi dạo' trong bài học có nghĩa là gì?",
        options: ["Đi ngủ", "Đi dạo / tản bộ", "Đi ăn", "Đi học"],
        correctIndex: 1,
        explanation: "'Đi dạo' nghĩa là đi bách bộ, tản bộ thong thả."
      },
      {
        type: "sentence_scramble",
        targetSentence: "Hôm nay cậu có rảnh không",
        translation: "Are you free today?",
        scrambledWords: ["rảnh không", "cậu", "Hôm nay", "có"],
        correctWords: ["Hôm nay", "cậu", "có", "rảnh không"]
      },
      {
        type: "cloze",
        sentenceWithBlank: "Chúng mình cùng đi dạo ___?",
        blankWord: "nhé",
        options: ["nhé", "không", "gì", "đâu"],
        correctIndex: 0,
        explanation: "Trợ từ 'nhé' dùng để rủ rê một cách ngọt ngào, nhẹ nhàng."
      },
      {
        type: "roleplay",
        scenario: "Kou rụt rè đưa cho bạn một ly trà sữa sau giờ học.",
        characterPrompt: "Kou: 'Em mua cho cậu này... Cậu có muốn uống cùng em không ạ?'",
        characterName: "Kou",
        options: [
          { reply: "Cảm ơn Kou nhé, chúng mình cùng uống!", feedback: "Kou cười rạng rỡ: 'Dạ! Em vui lắm ạ!'" },
          { reply: "Để lát nữa tớ uống nha.", feedback: "Kou chớp mắt: 'Vâng ạ, khi nào cậu uống nhớ nhắn em nhé!'" }
        ]
      }
    ]
  };
}

async function generateOpenkotoLesson() {
  const textInput = document.getElementById("openkotoTextInput");
  if (textInput) {
    openkotoState.pastedText = textInput.value;
  }
  const focusSelect = document.getElementById("openkotoFocusSelect");
  if (focusSelect) {
    openkotoState.customFocus = focusSelect.value;
  }
  const langSelect = document.getElementById("openkotoLangSelect");
  if (langSelect) {
    openkotoState.targetLang = langSelect.value;
  }

  openkotoState.isLoading = true;
  renderGuidebook();

  try {
    const key = typeof getOpenRouterApiKey === "function" ? getOpenRouterApiKey() : (userState.openRouterKey || "");
    const payload = {
      mediaType: openkotoState.mediaType || "text",
      targetLanguage: openkotoState.targetLang || "vi",
      text: openkotoState.pastedText,
      mediaBase64: openkotoState.mediaBase64,
      mimeType: openkotoState.mediaMimeType,
      fileName: openkotoState.fileName,
      customFocus: openkotoState.customFocus,
      apiKey: key
    };

    let lessonData = null;

    try {
      const resp = await fetch("/api/media-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        const resData = await resp.json();
        if (resData && resData.success && resData.data) {
          lessonData = resData.data;
        }
      }
    } catch (netErr) {
      console.warn("[OpenKoto] Server endpoint unreachable, using client engine:", netErr);
    }

    if (!lessonData) {
      lessonData = buildClientFallbackLesson(
        openkotoState.targetLang || "vi",
        openkotoState.mediaType || "text",
        openkotoState.customFocus,
        openkotoState.pastedText
      );
    }

    openkotoState.activeLesson = lessonData;
    openkotoState.activeLesson.id = "lesson_" + Date.now();
    openkotoState.activeLesson.createdAt = new Date().toISOString();
    
    // Auto-initialize Scramble Quiz
    if (openkotoState.activeLesson.quizzes) {
      const scrambleQuiz = openkotoState.activeLesson.quizzes.find((q) => q.type === "sentence_scramble");
      if (scrambleQuiz) {
        openkotoState.activeQuizState.scramblePicked = [];
        openkotoState.activeQuizState.scrambleRemaining = [...(scrambleQuiz.scrambledWords || [])];
      }
    }
    openkotoState.activeQuizState.answered = {};
    openkotoState.activeQuizState.roleplayAnswered = null;
    openkotoState.activeQuizState.score = 0;
  } catch (err) {
    console.error("[OpenKoto] Generation error:", err);
  } finally {
    openkotoState.isLoading = false;
    renderGuidebook();
  }
}
window.generateOpenkotoLesson = generateOpenkotoLesson;

function resetOpenkotoStudio() {
  openkotoState.activeLesson = null;
  openkotoState.activeWordPopover = null;
  clearOpenkotoMedia();
  renderGuidebook();
}
window.resetOpenkotoStudio = resetOpenkotoStudio;

// Word Token Inspector
function inspectOpenkotoToken(word, lemma, pos, phonetic, meaning, note) {
  openkotoState.activeWordPopover = {
    word: decodeURIComponent(word),
    lemma: decodeURIComponent(lemma),
    pos: decodeURIComponent(pos),
    phonetic: decodeURIComponent(phonetic),
    meaning: decodeURIComponent(meaning),
    note: decodeURIComponent(note)
  };
  renderGuidebook();
}
window.inspectOpenkotoToken = inspectOpenkotoToken;

function closeOpenkotoWordPopover() {
  openkotoState.activeWordPopover = null;
  renderGuidebook();
}
window.closeOpenkotoWordPopover = closeOpenkotoWordPopover;

// Add Word to Flashcards
function saveOpenkotoFlashcard(term, reading, pos, meaning, example = "") {
  const card = {
    id: "fc_" + Date.now(),
    term: decodeURIComponent(term),
    reading: decodeURIComponent(reading),
    pos: decodeURIComponent(pos),
    meaning: decodeURIComponent(meaning),
    example: decodeURIComponent(example),
    lang: openkotoState.targetLang || "vi",
    mastered: false,
    addedAt: new Date().toISOString()
  };
  openkotoState.savedFlashcards.unshift(card);
  localStorage.setItem("openkoto_saved_flashcards", JSON.stringify(openkotoState.savedFlashcards));
  
  // Visual Toast Feedback
  const toast = document.createElement("div");
  toast.className = "reset-success-toast";
  toast.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:9999; display:block; background:#10b981; color:#ffffff; font-weight:800; padding:10px 18px; border-radius:30px; box-shadow:0 6px 20px rgba(16,185,129,0.4);";
  toast.innerHTML = `⭐ Saved "<strong>${card.term}</strong>" to Flashcard Deck!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);

  renderGuidebook();
}
window.saveOpenkotoFlashcard = saveOpenkotoFlashcard;

// Save Full Lesson to Library
function saveCurrentOpenkotoLesson() {
  if (!openkotoState.activeLesson) return;
  const existing = openkotoState.savedLessons.find((l) => l.id === openkotoState.activeLesson.id);
  if (!existing) {
    openkotoState.savedLessons.unshift(openkotoState.activeLesson);
    localStorage.setItem("openkoto_saved_lessons", JSON.stringify(openkotoState.savedLessons));
  }
  const toast = document.createElement("div");
  toast.className = "reset-success-toast";
  toast.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:9999; display:block; background:#7c3aed; color:#ffffff; font-weight:800; padding:10px 18px; border-radius:30px; box-shadow:0 6px 20px rgba(124,58,237,0.4);";
  toast.innerHTML = `💾 Lesson saved to your Media Library!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
window.saveCurrentOpenkotoLesson = saveCurrentOpenkotoLesson;

function loadSavedOpenkotoLesson(lessonId) {
  const lesson = openkotoState.savedLessons.find((l) => l.id === lessonId);
  if (lesson) {
    openkotoState.activeLesson = lesson;
    currentGuidebookSubMode = "openkoto";
    renderGuidebook();
  }
}
window.loadSavedOpenkotoLesson = loadSavedOpenkotoLesson;

function deleteSavedOpenkotoLesson(lessonId) {
  openkotoState.savedLessons = openkotoState.savedLessons.filter((l) => l.id !== lessonId);
  localStorage.setItem("openkoto_saved_lessons", JSON.stringify(openkotoState.savedLessons));
  renderGuidebook();
}
window.deleteSavedOpenkotoLesson = deleteSavedOpenkotoLesson;

function deleteOpenkotoFlashcard(cardId) {
  openkotoState.savedFlashcards = openkotoState.savedFlashcards.filter((c) => c.id !== cardId);
  localStorage.setItem("openkoto_saved_flashcards", JSON.stringify(openkotoState.savedFlashcards));
  renderGuidebook();
}
window.deleteOpenkotoFlashcard = deleteOpenkotoFlashcard;

function toggleOpenkotoFlashcardMastery(cardId) {
  const card = openkotoState.savedFlashcards.find((c) => c.id === cardId);
  if (card) {
    card.mastered = !card.mastered;
    localStorage.setItem("openkoto_saved_flashcards", JSON.stringify(openkotoState.savedFlashcards));
    renderGuidebook();
  }
}
window.toggleOpenkotoFlashcardMastery = toggleOpenkotoFlashcardMastery;

// Export Deck (JSON / Markdown / Anki)
function exportOpenkotoDeck(format) {
  let content = "";
  let mimeType = "text/plain";
  let fileName = `OpenKoto_Vocabulary_${Date.now()}`;

  if (format === "json") {
    content = JSON.stringify(openkotoState.savedFlashcards, null, 2);
    mimeType = "application/json";
    fileName += ".json";
  } else if (format === "anki") {
    // Front \t Back format for Anki Import
    content = openkotoState.savedFlashcards.map((c) => `${c.term} (${c.reading})\t${c.meaning} [${c.pos}]<br/><em>${c.example || ""}</em>`).join("\n");
    mimeType = "text/tab-separated-values";
    fileName += "_Anki.tsv";
  } else {
    // Markdown format
    content = `# OpenKoto AI Study Deck\nGenerated on ${new Date().toLocaleDateString()}\n\n` +
      openkotoState.savedFlashcards.map((c) => `### **${c.term}** (${c.reading})\n- **Part of Speech:** ${c.pos}\n- **Meaning:** ${c.meaning}\n- **Example:** ${c.example || "N/A"}\n`).join("\n---\n\n");
    mimeType = "text/markdown";
    fileName += ".md";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
window.exportOpenkotoDeck = exportOpenkotoDeck;

// Quiz Interaction Handlers
function answerOpenkotoMC(optionIdx, correctIdx) {
  openkotoState.activeQuizState.answered["mc"] = { optionIdx, correctIdx, isCorrect: optionIdx === correctIdx };
  renderGuidebook();
}
window.answerOpenkotoMC = answerOpenkotoMC;

function answerOpenkotoCloze(optionIdx, correctIdx) {
  openkotoState.activeQuizState.answered["cloze"] = { optionIdx, correctIdx, isCorrect: optionIdx === correctIdx };
  renderGuidebook();
}
window.answerOpenkotoCloze = answerOpenkotoCloze;

function pickOpenkotoScrambleChip(word, index) {
  openkotoState.activeQuizState.scramblePicked.push(word);
  openkotoState.activeQuizState.scrambleRemaining.splice(index, 1);
  renderGuidebook();
}
window.pickOpenkotoScrambleChip = pickOpenkotoScrambleChip;

function removeOpenkotoScramblePicked(word, index) {
  openkotoState.activeQuizState.scrambleRemaining.push(word);
  openkotoState.activeQuizState.scramblePicked.splice(index, 1);
  renderGuidebook();
}
window.removeOpenkotoScramblePicked = removeOpenkotoScramblePicked;

function resetOpenkotoScramble() {
  if (openkotoState.activeLesson && openkotoState.activeLesson.quizzes) {
    const scrambleQuiz = openkotoState.activeLesson.quizzes.find((q) => q.type === "sentence_scramble");
    if (scrambleQuiz) {
      openkotoState.activeQuizState.scramblePicked = [];
      openkotoState.activeQuizState.scrambleRemaining = [...(scrambleQuiz.scrambledWords || [])];
      renderGuidebook();
    }
  }
}
window.resetOpenkotoScramble = resetOpenkotoScramble;

function answerOpenkotoRoleplay(optionIdx, correctIdx, feedback) {
  openkotoState.activeQuizState.roleplayAnswered = {
    optionIdx,
    correctIdx,
    feedback: decodeURIComponent(feedback)
  };
  renderGuidebook();
}
window.answerOpenkotoRoleplay = answerOpenkotoRoleplay;

// Primary OpenKoto AI Media Lab Render Function
function renderGuidebook() {
  const container = document.getElementById("guidebookContainer");
  if (!container) return;

  // Sub-Navigation Tabs Update
  const navOpenkoto = document.getElementById("guideSubNavOpenkoto");
  const navLibrary = document.getElementById("guideSubNavLibrary");

  if (navOpenkoto) navOpenkoto.classList.toggle("active", currentGuidebookSubMode === "openkoto");
  if (navLibrary) navLibrary.classList.toggle("active", currentGuidebookSubMode === "library");

  // SUB-MODE 1: OPENKOTO AI MEDIA LEARNING LAB
  if (currentGuidebookSubMode === "openkoto") {
    renderOpenkotoStudioView(container);
    return;
  }

  // SUB-MODE 2: SAVED FLASHCARD DECK & LESSON LIBRARY
  if (currentGuidebookSubMode === "library") {
    renderOpenkotoLibraryView(container);
    return;
  }

  // Default fallback
  renderOpenkotoStudioView(container);
}

// RENDER OPENKOTO STUDIO VIEW
function renderOpenkotoStudioView(container) {
  // If active lesson exists, render the interactive Studio
  if (openkotoState.activeLesson) {
    const lesson = openkotoState.activeLesson;
    const isImage = openkotoState.mediaType === "image" && openkotoState.mediaBase64;
    const isAudio = openkotoState.mediaType === "audio" && openkotoState.mediaBase64;
    const isVideo = openkotoState.mediaType === "video" && openkotoState.mediaBase64;

    const mcQuiz = (lesson.quizzes || []).find((q) => q.type === "multiple_choice");
    const scrambleQuiz = (lesson.quizzes || []).find((q) => q.type === "sentence_scramble");
    const clozeQuiz = (lesson.quizzes || []).find((q) => q.type === "cloze_fill");
    const roleplayQuiz = (lesson.quizzes || []).find((q) => q.type === "roleplay_reply");

    container.innerHTML = `
      <div class="openkoto-lesson-studio">
        <!-- Studio Header Banner -->
        <div class="openkoto-studio-header">
          <div class="openkoto-studio-title-row">
            <div class="openkoto-studio-title">
              ✨ ${lesson.title || "AI Media Learning Pack"}
            </div>
            <span class="openkoto-level-tag">${lesson.level || "Beginner (A1)"}</span>
          </div>
          <p class="openkoto-studio-summary">${lesson.summary || "Interactive multimodal language lesson generated from your media."}</p>
          
          <div class="openkoto-studio-toolbar">
            <button class="openkoto-tool-btn" type="button" onclick="speakOpenkotoPhrase('${encodeURIComponent(lesson.transcription || "").replace(/'/g, "\\'")}', '${openkotoState.targetLang}')">
              <span class="material-symbols-outlined" style="font-size:16px;">volume_up</span>
              <span>Listen Full</span>
            </button>
            <button class="openkoto-tool-btn ${openkotoState.bilingualVisible ? "active" : ""}" type="button" onclick="toggleOpenkotoBilingual()">
              <span class="material-symbols-outlined" style="font-size:16px;">translate</span>
              <span>Bilingual</span>
            </button>
            <button class="openkoto-tool-btn ${openkotoState.phoneticsVisible ? "active" : ""}" type="button" onclick="toggleOpenkotoPhonetics()">
              <span class="material-symbols-outlined" style="font-size:16px;">record_voice_over</span>
              <span>Phonetics</span>
            </button>
            <button class="openkoto-tool-btn" type="button" onclick="saveCurrentOpenkotoLesson()">
              <span class="material-symbols-outlined" style="font-size:16px;">bookmark_add</span>
              <span>Save Lesson</span>
            </button>
            <button class="openkoto-tool-btn" type="button" onclick="resetOpenkotoStudio()">
              <span class="material-symbols-outlined" style="font-size:16px;">replay</span>
              <span>New Media</span>
            </button>
          </div>
        </div>

        <!-- Media Stage Visualizer (if image/audio/video attached) -->
        ${isImage ? `
          <div class="openkoto-media-preview-box">
            <img src="${openkotoState.mediaBase64}" alt="Uploaded Learning Media" />
          </div>
        ` : ""}
        ${isAudio ? `
          <div class="openkoto-card" style="padding:12px;">
            <audio controls src="${openkotoState.mediaBase64}" style="width:100%;"></audio>
          </div>
        ` : ""}
        ${isVideo ? `
          <div class="openkoto-media-preview-box">
            <video controls src="${openkotoState.mediaBase64}" style="width:100%; max-height:240px;"></video>
          </div>
        ` : ""}

        <!-- SMART INTERACTIVE READER (Line-by-line + Clickable Word Tokens) -->
        <div class="openkoto-reader-card">
          <div class="openkoto-reader-title">
            <span>📖 Interactive Smart Reader (Tap any word for details)</span>
            <span style="font-size:13px; font-weight:700; color:var(--text-muted);">${(lesson.sentences || []).length} Sentences</span>
          </div>

          <div class="openkoto-sentences-list">
            ${(lesson.sentences || []).map((sent) => `
              <div class="openkoto-sentence-item">
                <div class="openkoto-sentence-tokens-row">
                  ${(sent.tokens || []).map((tok) => `
                    <button class="openkoto-token" type="button" onclick="inspectOpenkotoToken('${encodeURIComponent(tok.word || "")}', '${encodeURIComponent(tok.lemma || tok.word || "")}', '${encodeURIComponent(tok.pos || "Word")}', '${encodeURIComponent(tok.phonetic || "")}', '${encodeURIComponent(tok.meaning || "")}', '${encodeURIComponent(tok.note || "")}')">
                      ${openkotoState.phoneticsVisible && tok.phonetic ? `<span class="openkoto-token-ruby">${tok.phonetic}</span>` : ""}
                      <span>${tok.word}</span>
                    </button>
                  `).join("")}
                  
                  <button class="openkoto-tool-btn" style="padding:4px 8px; font-size:12px; background:rgba(69,90,159,0.1); color:var(--text-main); border:none; margin-left:auto;" type="button" onclick="speakOpenkotoPhrase('${encodeURIComponent(sent.original || "").replace(/'/g, "\\'")}', '${openkotoState.targetLang}')">
                    🔊
                  </button>
                </div>

                ${openkotoState.phoneticsVisible && sent.phonetic ? `
                  <div class="openkoto-sentence-phonetic">${sent.phonetic}</div>
                ` : ""}

                ${openkotoState.bilingualVisible && sent.translation ? `
                  <div class="openkoto-sentence-translation">${sent.translation}</div>
                ` : ""}

                ${sent.grammarNotes ? `
                  <div class="openkoto-sentence-notes">💡 ${sent.grammarNotes}</div>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>

        <!-- CORE VOCABULARY DECK -->
        ${(lesson.vocabularyList || []).length > 0 ? `
          <div class="openkoto-card">
            <div style="font-size:15.5px; font-weight:800; color:var(--primary-pink); display:flex; align-items:center; justify-content:space-between;">
              <span>⭐ Key Vocabulary Extracted</span>
              <span style="font-size:13px; color:var(--text-muted);">${lesson.vocabularyList.length} words</span>
            </div>
            
            <div class="openkoto-vocab-grid">
              ${lesson.vocabularyList.map((v) => `
                <div class="openkoto-vocab-card">
                  <div class="openkoto-vocab-top">
                    <span class="openkoto-vocab-term">${v.term}</span>
                    <span class="openkoto-vocab-level">${v.difficulty || "A1"} • ${v.pos || "Word"}</span>
                  </div>
                  <div style="font-size:12.5px; color:var(--text-muted); font-style:italic;">${v.reading || ""}</div>
                  <div class="openkoto-vocab-def">${v.meaning}</div>
                  ${v.example ? `
                    <div class="openkoto-vocab-ex">
                      <strong>Ex:</strong> ${v.example}
                      ${v.exampleTrans ? `<br/><span style="color:var(--text-muted);">${v.exampleTrans}</span>` : ""}
                    </div>
                  ` : ""}
                  <div style="display:flex; gap:8px; margin-top:6px;">
                    <button class="openkoto-tool-btn" style="flex:1; background:rgba(69,90,159,0.08); color:var(--text-main); border:1px solid rgba(69,90,159,0.2); justify-content:center; font-size:13px; padding:8px;" type="button" onclick="speakOpenkotoPhrase('${encodeURIComponent(v.term || "").replace(/'/g, "\\'")}', '${openkotoState.targetLang}')">
                      🔊 Listen
                    </button>
                    <button class="openkoto-tool-btn" style="flex:1; background:rgba(217,0,87,0.08); color:var(--primary-pink); border:1px solid rgba(217,0,87,0.25); justify-content:center; font-size:13px; padding:8px;" type="button" onclick="saveOpenkotoFlashcard('${encodeURIComponent(v.term)}', '${encodeURIComponent(v.reading || "")}', '${encodeURIComponent(v.pos || "")}', '${encodeURIComponent(v.meaning)}', '${encodeURIComponent(v.example || "")}')">
                      ⭐ Bookmark
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- GRAMMAR PATTERNS & CULTURAL INSIGHTS -->
        ${(lesson.grammarPoints || []).length > 0 ? `
          <div class="openkoto-card">
            <div style="font-size:15.5px; font-weight:800; color:var(--accent-violet);">
              🎓 Sentence Formulas &amp; Romance Nuances
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              ${lesson.grammarPoints.map((g) => `
                <div style="background:#fdfbff; border:1px solid rgba(124,58,237,0.2); border-radius:14px; padding:12px 14px;">
                  <div style="font-size:15px; font-weight:800; color:var(--accent-violet); margin-bottom:6px;">
                    📌 ${g.pattern}
                  </div>
                  <div style="font-size:14px; color:var(--text-main); margin-bottom:6px; line-height:1.45;">
                    ${g.explanation}
                  </div>
                  ${g.example ? `<div style="font-size:13px; color:var(--text-muted); background:rgba(124,58,237,0.05); padding:6px 10px; border-radius:8px; margin-bottom:6px;">Ex: ${g.example}</div>` : ""}
                  ${g.romanceContext ? `<div style="font-size:13px; color:var(--primary-pink); font-weight:700;">💕 Dating Tip: ${g.romanceContext}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- INTERACTIVE PRACTICE SUITE (4 Modes) -->
        <div class="openkoto-quiz-card">
          <div style="font-size:15.5px; font-weight:800; color:var(--text-main); margin-bottom:10px;">
            🎯 Interactive Practice Arena (Media Quizzes)
          </div>

          <div class="openkoto-quiz-mode-tabs">
            ${mcQuiz ? `<button class="openkoto-quiz-tab-btn ${openkotoState.activeQuizMode === "mc" ? "active" : ""}" type="button" onclick="setOpenkotoQuizMode('mc')">1. Comprehension</button>` : ""}
            ${scrambleQuiz ? `<button class="openkoto-quiz-tab-btn ${openkotoState.activeQuizMode === "scramble" ? "active" : ""}" type="button" onclick="setOpenkotoQuizMode('scramble')">2. Word Scramble</button>` : ""}
            ${clozeQuiz ? `<button class="openkoto-quiz-tab-btn ${openkotoState.activeQuizMode === "cloze" ? "active" : ""}" type="button" onclick="setOpenkotoQuizMode('cloze')">3. Fill-in-the-Blank</button>` : ""}
            ${roleplayQuiz ? `<button class="openkoto-quiz-tab-btn ${openkotoState.activeQuizMode === "roleplay" ? "active" : ""}" type="button" onclick="setOpenkotoQuizMode('roleplay')">4. Romance Reaction</button>` : ""}
          </div>

          <!-- Mode 1: Multiple Choice -->
          ${openkotoState.activeQuizMode === "mc" && mcQuiz ? `
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="font-size:15px; font-weight:800; color:var(--text-main); margin-bottom:6px;">
                ${mcQuiz.question}
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${(mcQuiz.options || []).map((opt, idx) => {
                  const state = openkotoState.activeQuizState.answered["mc"];
                  let btnClass = "openkoto-quiz-option";
                  if (state) {
                    if (idx === mcQuiz.correctIndex) btnClass += " correct";
                    else if (state.optionIdx === idx) btnClass += " wrong";
                  }
                  return `
                    <button class="${btnClass}" type="button" onclick="answerOpenkotoMC(${idx}, ${mcQuiz.correctIndex})">
                      ${opt}
                    </button>
                  `;
                }).join("")}
              </div>
              ${openkotoState.activeQuizState.answered["mc"] ? `
                <div style="padding:12px 14px; background:rgba(16,185,129,0.1); border-radius:12px; font-size:13.5px; color:#065f46; line-height:1.45;">
                  💡 <strong>Explanation:</strong> ${mcQuiz.explanation || "Great job!"}
                </div>
              ` : ""}
            </div>
          ` : ""}

          <!-- Mode 2: Sentence Scramble -->
          ${openkotoState.activeQuizMode === "scramble" && scrambleQuiz ? `
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="font-size:13.5px; color:var(--text-muted);">
                ${scrambleQuiz.prompt || "Reconstruct the sentence in correct order:"}
              </div>
              <div style="font-size:15px; font-weight:800; color:var(--primary-pink); margin-bottom:6px;">
                "${scrambleQuiz.translation}"
              </div>

              <!-- Picked Chips Tray -->
              <div class="openkoto-scramble-tray">
                ${openkotoState.activeQuizState.scramblePicked.length === 0 ? `
                  <span style="font-size:13.5px; color:var(--text-muted);">Tap words below to assemble sentence...</span>
                ` : openkotoState.activeQuizState.scramblePicked.map((word, idx) => `
                  <button class="openkoto-scramble-chip" style="background:var(--primary-pink); color:#ffffff; border-color:var(--primary-pink);" type="button" onclick="removeOpenkotoScramblePicked('${word}', ${idx})">
                    ${word} ✕
                  </button>
                `).join("")}
              </div>

              <!-- Available Chips Tray -->
              <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                ${openkotoState.activeQuizState.scrambleRemaining.map((word, idx) => `
                  <button class="openkoto-scramble-chip" type="button" onclick="pickOpenkotoScrambleChip('${word}', ${idx})">
                    ${word}
                  </button>
                `).join("")}
              </div>

              <div style="display:flex; gap:10px; align-items:center;">
                <button class="openkoto-tool-btn" style="background:rgba(69,90,159,0.1); color:var(--text-main); border:1px solid rgba(69,90,159,0.25); padding:8px 14px; font-size:13px;" type="button" onclick="resetOpenkotoScramble()">
                  🔄 Reset Words
                </button>
                ${openkotoState.activeQuizState.scrambleRemaining.length === 0 ? `
                  <div style="font-size:13.5px; font-weight:800; color:#10b981; display:flex; align-items:center;">
                    ✓ Perfect assembly! Target: "${scrambleQuiz.targetSentence}"
                  </div>
                ` : ""}
              </div>
            </div>
          ` : ""}

          <!-- Mode 3: Cloze Fill-in-the-Blank -->
          ${openkotoState.activeQuizMode === "cloze" && clozeQuiz ? `
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="font-size:15px; font-weight:800; color:var(--text-main); margin-bottom:6px;">
                ${clozeQuiz.sentenceWithBlank}
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${(clozeQuiz.options || []).map((opt, idx) => {
                  const state = openkotoState.activeQuizState.answered["cloze"];
                  let btnClass = "openkoto-quiz-option";
                  if (state) {
                    if (idx === clozeQuiz.correctIndex) btnClass += " correct";
                    else if (state.optionIdx === idx) btnClass += " wrong";
                  }
                  return `
                    <button class="${btnClass}" type="button" onclick="answerOpenkotoCloze(${idx}, ${clozeQuiz.correctIndex})">
                      ${opt}
                    </button>
                  `;
                }).join("")}
              </div>
              ${openkotoState.activeQuizState.answered["cloze"] ? `
                <div style="padding:12px 14px; background:rgba(16,185,129,0.1); border-radius:12px; font-size:13.5px; color:#065f46; line-height:1.45;">
                  💡 ${clozeQuiz.explanation || "Correct choice!"}
                </div>
              ` : ""}
            </div>
          ` : ""}

          <!-- Mode 4: Otome Character Dialogue Reaction -->
          ${openkotoState.activeQuizMode === "roleplay" && roleplayQuiz ? `
            <div style="background:#fdfbff; border:1.5px solid rgba(217,0,87,0.25); border-radius:14px; padding:16px;">
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                <div style="font-size:28px;">💬</div>
                <div>
                  <div style="font-size:15px; font-weight:800; color:var(--primary-pink);">${roleplayQuiz.partnerName || "Character"}</div>
                  <div style="font-size:14.5px; font-weight:700; color:var(--text-main);">"${roleplayQuiz.partnerDialogue}"</div>
                  ${roleplayQuiz.partnerTrans ? `<div style="font-size:13px; color:var(--text-muted); font-style:italic;">(${roleplayQuiz.partnerTrans})</div>` : ""}
                </div>
              </div>

              <div style="font-size:13.5px; font-weight:800; color:var(--text-muted); margin-bottom:10px;">Choose your reply:</div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                ${(roleplayQuiz.options || []).map((opt, idx) => `
                  <button class="openkoto-quiz-option" type="button" onclick="answerOpenkotoRoleplay(${idx}, ${roleplayQuiz.correctIndex || 0}, '${encodeURIComponent(opt.feedback || "")}')">
                    <div style="font-size:14.5px; font-weight:800;">${opt.text}</div>
                    ${opt.trans ? `<div style="font-size:12.5px; opacity:0.85; font-weight:normal; margin-top:2px;">${opt.trans}</div>` : ""}
                  </button>
                `).join("")}
              </div>

              ${openkotoState.activeQuizState.roleplayAnswered ? `
                <div style="margin-top:12px; padding:12px 14px; background:rgba(217,0,87,0.08); border-radius:12px; font-size:13.5px; color:var(--primary-pink); font-weight:700; line-height:1.45;">
                  💌 ${openkotoState.activeQuizState.roleplayAnswered.feedback}
                </div>
              ` : ""}
            </div>
          ` : ""}
        </div>
      </div>

      <!-- FLOATING SMART WORD INSPECTOR MODAL -->
      ${openkotoState.activeWordPopover ? `
        <div class="openkoto-word-modal">
          <div class="openkoto-word-header">
            <div>
              <div class="openkoto-word-lemma">${openkotoState.activeWordPopover.word}</div>
              <div style="font-size:11px; color:var(--text-muted); font-style:italic;">
                ${openkotoState.activeWordPopover.phonetic || openkotoState.activeWordPopover.lemma}
              </div>
            </div>
            <span class="openkoto-word-pos">${openkotoState.activeWordPopover.pos}</span>
          </div>

          <div class="openkoto-word-meaning">${openkotoState.activeWordPopover.meaning}</div>
          ${openkotoState.activeWordPopover.note ? `
            <div class="openkoto-word-tip">💡 ${openkotoState.activeWordPopover.note}</div>
          ` : ""}

          <div class="openkoto-word-actions">
            <button class="openkoto-word-action-btn" style="background:rgba(69,90,159,0.1); color:var(--text-main);" type="button" onclick="speakOpenkotoPhrase('${encodeURIComponent(openkotoState.activeWordPopover.word).replace(/'/g, "\\'")}', '${openkotoState.targetLang}')">
              🔊 Pronounce
            </button>
            <button class="openkoto-word-action-btn" style="background:var(--primary-pink); color:#ffffff;" type="button" onclick="saveOpenkotoFlashcard('${encodeURIComponent(openkotoState.activeWordPopover.word)}', '${encodeURIComponent(openkotoState.activeWordPopover.phonetic)}', '${encodeURIComponent(openkotoState.activeWordPopover.pos)}', '${encodeURIComponent(openkotoState.activeWordPopover.meaning)}', '')">
              ⭐ Add Flashcard
            </button>
            <button class="openkoto-word-action-btn" style="background:#f1f5f9; color:var(--text-muted);" type="button" onclick="closeOpenkotoWordPopover()">
              ✕ Close
            </button>
          </div>
        </div>
      ` : ""}
    `;
    return;
  }

  // If no active lesson, render Studio Upload / Builder Form
  container.innerHTML = `
    <div class="openkoto-container">
      <!-- Studio Input Card -->
      <div class="openkoto-card">
        <!-- Media Source Tabs -->
        <div class="openkoto-source-tabs">
          <button class="openkoto-source-btn ${openkotoState.activeSource === "upload" ? "active" : ""}" type="button" onclick="setOpenkotoSource('upload')">
            <span class="material-symbols-outlined">upload_file</span>
            <span>Upload File</span>
          </button>
          <button class="openkoto-source-btn ${openkotoState.activeSource === "text" ? "active" : ""}" type="button" onclick="setOpenkotoSource('text')">
            <span class="material-symbols-outlined">edit_note</span>
            <span>Paste Text</span>
          </button>
          <button class="openkoto-source-btn ${openkotoState.activeSource === "chat" ? "active" : ""}" type="button" onclick="setOpenkotoSource('chat')">
            <span class="material-symbols-outlined">forum</span>
            <span>Import Chat</span>
          </button>
          <button class="openkoto-source-btn ${openkotoState.activeSource === "camera" ? "active" : ""}" type="button" onclick="setOpenkotoSource('camera')">
            <span class="material-symbols-outlined">photo_camera</span>
            <span>Take Photo</span>
          </button>
        </div>

        <!-- 1. FILE UPLOAD DROPZONE -->
        ${openkotoState.activeSource === "upload" ? `
          <div class="openkoto-dropzone" ondragover="this.classList.add('dragover'); event.preventDefault();" ondragleave="this.classList.remove('dragover');" ondrop="this.classList.remove('dragover'); handleOpenkotoDrop(event);" onclick="document.getElementById('openkotoFileInput').click();">
            <input type="file" id="openkotoFileInput" style="display:none;" accept="image/*,audio/*,video/*,.txt,.srt,.vtt,.lrc,.md,.json" onchange="handleOpenkotoFileSelect(event)" />
            <span class="material-symbols-outlined openkoto-dropzone-icon">cloud_upload</span>
            <div class="openkoto-dropzone-title">Drop image, audio, video or text file here</div>
            <div class="openkoto-dropzone-sub">Supports PNG, JPG, MP3, WAV, MP4, SRT, LRC &amp; TXT</div>
          </div>
        ` : ""}

        <!-- 2. PASTE TEXT / LYRICS -->
        ${openkotoState.activeSource === "text" ? `
          <textarea id="openkotoTextInput" class="openkoto-textarea" placeholder="Paste dialogue, lyrics, romance messages, article excerpts, or video subtitles here...">${openkotoState.pastedText}</textarea>
        ` : ""}

        <!-- 3. CHAT IMPORTER DECK -->
        ${openkotoState.activeSource === "chat" ? (() => {
          const charId = openkotoState.selectedChatChar || "ado";
          const char = CHARACTERS[charId] || CHARACTERS.ado;
          const history = userState.chatHistories[charId] || [];
          const selectedIndices = openkotoState.selectedChatMsgs || [];
          const selectedCount = selectedIndices.length;

          const charsList = [
            { id: "ado", name: "Ado", avatar: "/assets/characters/ado_avatar.png", count: (userState.chatHistories.ado || []).length },
            { id: "kou", name: "Kou", avatar: "/assets/characters/kou_avatar.png", count: (userState.chatHistories.kou || []).length },
            { id: "ren", name: "Ren", avatar: "/assets/characters/ren_avatar.png", count: (userState.chatHistories.ren || []).length },
            { id: "group", name: "Study Group", avatar: "/assets/characters/ado_avatar.png", count: (userState.chatHistories.group || []).length }
          ];

          return `
            <div class="openkoto-chat-importer">
              <!-- Character Selector Tabs -->
              <div class="openkoto-chat-char-tabs">
                ${charsList.map(c => `
                  <button type="button" class="openkoto-chat-char-tab ${c.id === charId ? "active" : ""}" onclick="setOpenkotoChatChar('${c.id}')">
                    <img src="${c.avatar}" alt="${c.name}" class="openkoto-chat-tab-avatar" />
                    <div class="openkoto-chat-tab-info">
                      <div class="openkoto-chat-tab-name">${c.name}</div>
                      <div class="openkoto-chat-tab-count">${c.count} msg${c.count !== 1 ? 's' : ''}</div>
                    </div>
                  </button>
                `).join('')}
              </div>

              <!-- Quick Action Toolbar -->
              <div class="openkoto-chat-toolbar">
                <div class="openkoto-chat-toolbar-left">
                  <span class="material-symbols-outlined" style="font-size:17px; color:var(--primary-pink);">forum</span>
                  <span><strong>${char.name}</strong> (${history.length} messages)</span>
                </div>
                <div class="openkoto-chat-toolbar-actions">
                  ${history.length > 0 ? `
                    <button type="button" class="openkoto-chat-tool-btn" onclick="importRecentChatExchanges('${charId}', 6, false)" title="Load last 3 exchanges into text">
                      ⚡ Last 6 Msgs
                    </button>
                    <button type="button" class="openkoto-chat-tool-btn" onclick="selectAllOpenkotoChatMsgs()">
                      ☑️ Select All
                    </button>
                    ${selectedCount > 0 ? `
                      <button type="button" class="openkoto-chat-tool-btn danger" onclick="clearOpenkotoChatMsgSelection()">
                        ✕ Clear (${selectedCount})
                      </button>
                    ` : ''}
                  ` : ''}
                </div>
              </div>

              <!-- Message Deck List -->
              ${history.length === 0 ? `
                <div class="openkoto-chat-empty">
                  <span class="material-symbols-outlined" style="font-size:38px; color:var(--primary-pink); opacity:0.85;">chat_bubble_outline</span>
                  <div style="font-weight:700; color:var(--text-main); font-size:14.5px; margin-top:6px;">No conversation messages yet with ${char.name}</div>
                  <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">Chat with ${char.name} in the Chatroom first, or use a sample preset!</div>
                  <div style="display:flex; gap:8px; margin-top:12px;">
                    <button type="button" class="primary-btn" style="font-size:12px; padding:6px 16px; border-radius:10px;" onclick="openChat('${charId}')">
                      💬 Open ${char.name}'s Chat
                    </button>
                  </div>
                </div>
              ` : `
                <div class="openkoto-chat-msg-list">
                  ${history.map((msg, idx) => {
                    const isSelected = selectedIndices.includes(idx);
                    const isLi = msg.sender === "li";
                    const speakerName = isLi ? (msg.speakerName || char.name) : (userState.userProfile?.name || "You");
                    const speakerAvatar = isLi ? (msg.speaker === "ren" ? CHARACTERS.ren.avatar : (msg.speaker === "kou" ? CHARACTERS.kou.avatar : char.avatar)) : (userState.userProfile?.avatar || "/assets/icons/icon-192.png");
                    
                    return `
                      <div class="openkoto-chat-msg-row ${isSelected ? "selected" : ""}" onclick="toggleOpenkotoChatMsgSelection(${idx})">
                        <input type="checkbox" class="openkoto-chat-checkbox" ${isSelected ? "checked" : ""} onclick="event.stopPropagation(); toggleOpenkotoChatMsgSelection(${idx});" />
                        <img src="${speakerAvatar}" class="openkoto-chat-msg-avatar" alt="${speakerName}" />
                        <div class="openkoto-chat-msg-body">
                          <div class="openkoto-chat-msg-header">
                            <span class="openkoto-chat-msg-sender ${isLi ? "partner" : "user"}">${speakerName}</span>
                            <span class="openkoto-chat-msg-time">${msg.time || ""}</span>
                          </div>
                          <div class="openkoto-chat-msg-text">${cleanEmojiText(msg.text || "")}</div>
                          ${msg.translation ? `<div class="openkoto-chat-msg-trans">${cleanEmojiText(msg.translation)}</div>` : ""}
                        </div>
                        <button type="button" class="openkoto-chat-quick-import-btn" title="Import this message into text" onclick="event.stopPropagation(); importSingleChatMsgToMediaLab('${charId}', ${idx}, false);">
                          <span class="material-symbols-outlined" style="font-size:15px;">arrow_forward</span>
                          <span>Import</span>
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}

              <!-- Bottom Selection Action Bar -->
              ${selectedCount > 0 ? `
                <div class="openkoto-chat-selected-bar">
                  <div class="openkoto-chat-selected-info">
                    <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary-pink);">check_circle</span>
                    <span><strong>${selectedCount}</strong> message${selectedCount > 1 ? "s" : ""} selected</span>
                  </div>
                  <div class="openkoto-chat-selected-actions">
                    <button type="button" class="openkoto-chat-import-btn" onclick="importSelectedChatMsgsToOpenkoto(false)">
                      📋 Load into Text
                    </button>
                    <button type="button" class="openkoto-chat-import-btn primary" onclick="importSelectedChatMsgsToOpenkoto(true)">
                      ⚡ Analyze Now
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        })() : ""}

        <!-- 4. CAMERA SNAPSHOT -->
        ${openkotoState.activeSource === "camera" ? `
          <div class="openkoto-dropzone" onclick="document.getElementById('openkotoCameraInput').click();">
            <input type="file" id="openkotoCameraInput" style="display:none;" accept="image/*" capture="environment" onchange="handleOpenkotoFileSelect(event)" />
            <span class="material-symbols-outlined openkoto-dropzone-icon">photo_camera</span>
            <div class="openkoto-dropzone-title">Snap photo of text, menu, manga or signs</div>
            <div class="openkoto-dropzone-sub">Uses camera to scan and extract language lessons</div>
          </div>
        ` : ""}

        <!-- Attached Media Preview Bar -->
        ${openkotoState.fileName || openkotoState.mediaBase64 ? `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#f1f5f9; border-radius:12px; font-size:12px; font-weight:700;">
            <div style="display:flex; align-items:center; gap:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              <span class="material-symbols-outlined" style="font-size:18px; color:var(--primary-pink);">attach_file</span>
              <span style="color:var(--text-main);">${openkotoState.fileName || "Media Attached"}</span>
            </div>
            <button type="button" onclick="clearOpenkotoMedia()" style="background:none; border:none; color:#ef4444; font-size:16px; cursor:pointer; font-weight:800;">✕</button>
          </div>
        ` : ""}


        <!-- Custom Controls Grid -->
        <div class="openkoto-controls-grid">
          <div class="openkoto-control-group">
            <label for="openkotoLangSelect" class="openkoto-control-label">Target Learning Language</label>
            <select id="openkotoLangSelect" class="openkoto-select" onchange="setOpenkotoTargetLang(this.value)">
              <option value="vi" ${openkotoState.targetLang === "vi" ? "selected" : ""}>🇻🇳 Vietnamese</option>
              <option value="en" ${openkotoState.targetLang === "en" ? "selected" : ""}>🇬🇧 English</option>
              <option value="ja" ${openkotoState.targetLang === "ja" ? "selected" : ""}>🇯🇵 Japanese</option>
              <option value="ko" ${openkotoState.targetLang === "ko" ? "selected" : ""}>🇰🇷 Korean</option>
              <option value="zh" ${openkotoState.targetLang === "zh" ? "selected" : ""}>🇨🇳 Chinese</option>
            </select>
          </div>

          <div class="openkoto-control-group">
            <label for="openkotoFocusSelect" class="openkoto-control-label">Learning Focus / Context</label>
            <select id="openkotoFocusSelect" class="openkoto-select" onchange="setOpenkotoCustomFocus(this.value)">
              <option value="Romance, Flirting & Everyday Life">💕 Romance &amp; Flirting</option>
              <option value="Everyday Natural Slang & Banter">💬 Colloquial Slang</option>
              <option value="Polite & Respectful Forms">🎓 Polite Forms</option>
              <option value="Travel & Food Culture">🍜 Travel &amp; Food</option>
              <option value="Anime & Drama Dialogue">🎌 Anime &amp; Drama</option>
            </select>
          </div>
        </div>

        <!-- Primary Action Trigger -->
        <button class="openkoto-action-btn" type="button" onclick="generateOpenkotoLesson()" ${openkotoState.isLoading ? "disabled" : ""}>
          ${openkotoState.isLoading ? `
            <span class="material-symbols-outlined" style="animation:spin 1s linear infinite;">sync</span>
            <span>OpenKoto AI is analyzing media &amp; building lesson...</span>
          ` : `
            <span class="material-symbols-outlined">auto_awesome</span>
            <span>Generate OpenKoto AI Learning Pack</span>
          `}
        </button>
      </div>
    </div>
  `;
}

// RENDER SAVED MEDIA & VOCABULARY LIBRARY VIEW
function renderOpenkotoLibraryView(container) {
  const lessons = openkotoState.savedLessons || [];
  const cards = openkotoState.savedFlashcards || [];

  container.innerHTML = `
    <div class="openkoto-container">
      <!-- Export Deck Header -->
      <div class="openkoto-card" style="padding:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <div style="font-size:16px; font-weight:800; color:var(--text-main);">⭐ My Saved Flashcard Deck</div>
            <div style="font-size:13.5px; color:var(--text-muted); margin-top:2px;">${cards.length} saved terms • ${lessons.length} saved lessons</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="openkoto-tool-btn" style="background:var(--primary-pink); color:#ffffff; border:none; font-size:13px; padding:8px 14px;" type="button" onclick="exportOpenkotoDeck('anki')">
              Export Anki
            </button>
            <button class="openkoto-tool-btn" style="background:#455A9F; color:#ffffff; border:none; font-size:13px; padding:8px 14px;" type="button" onclick="exportOpenkotoDeck('md')">
              Export Markdown
            </button>
          </div>
        </div>
      </div>

      <!-- Saved Vocabulary Cards -->
      <div class="openkoto-card">
        <div style="font-size:15.5px; font-weight:800; color:var(--primary-pink); margin-bottom:12px;">
          📚 Bookmarked Vocabulary Terms
        </div>

        ${cards.length === 0 ? `
          <div style="text-align:center; padding:28px 14px; color:var(--text-muted); font-size:14px; line-height:1.5;">
            No flashcards saved yet. Tap "⭐ Add Flashcard" on any word in the OpenKoto AI Reader!
          </div>
        ` : `
          <div class="openkoto-vocab-grid">
            ${cards.map((c) => `
              <div class="openkoto-vocab-card" style="${c.mastered ? "background:#f0fdf4; border-color:#86efac;" : ""}">
                <div class="openkoto-vocab-top">
                  <span class="openkoto-vocab-term">${c.term}</span>
                  <button class="openkoto-tool-btn" style="font-size:11px; padding:3px 10px; background:${c.mastered ? "#10b981" : "#e2e8f0"}; color:${c.mastered ? "#ffffff" : "var(--text-main)"}; border:none;" type="button" onclick="toggleOpenkotoFlashcardMastery('${c.id}')">
                    ${c.mastered ? "✓ Mastered" : "Learning"}
                  </button>
                </div>
                ${c.reading ? `<div style="font-size:12.5px; color:var(--text-muted); font-style:italic;">${c.reading}</div>` : ""}
                <div class="openkoto-vocab-def">${c.meaning}</div>
                <div style="display:flex; gap:8px; margin-top:8px;">
                  <button class="openkoto-tool-btn" style="flex:1; background:rgba(69,90,159,0.08); color:var(--text-main); justify-content:center; font-size:14px; padding:8px;" type="button" onclick="speakOpenkotoPhrase('${encodeURIComponent(c.term).replace(/'/g, "\\'")}', '${c.lang || "vi"}')">
                    🔊 Listen
                  </button>
                  <button class="openkoto-tool-btn" style="background:rgba(239,68,68,0.1); color:#ef4444; border:none; padding:8px 12px; font-size:13px;" type="button" onclick="deleteOpenkotoFlashcard('${c.id}')">
                    ✕
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>

      <!-- Saved Media Lessons -->
      <div class="openkoto-card">
        <div style="font-size:15.5px; font-weight:800; color:var(--accent-violet); margin-bottom:12px;">
          💾 Saved Media Lessons (${lessons.length})
        </div>

        ${lessons.length === 0 ? `
          <div style="text-align:center; padding:28px 14px; color:var(--text-muted); font-size:14px; line-height:1.5;">
            No saved media lessons yet. When generating a lesson in AI Media Lab, tap "Save Lesson" to keep it here!
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${lessons.map((l) => `
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:14px 16px; background:#ffffff; border:1.5px solid rgba(160,140,190,0.2); border-radius:14px;">
                <div>
                  <div style="font-size:15px; font-weight:800; color:var(--text-main);">${l.title || "Media Lesson"}</div>
                  <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">${l.level || "Beginner"} • ${(l.sentences || []).length} Sentences</div>
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="openkoto-tool-btn" style="background:var(--primary-pink); color:#ffffff; border:none; font-size:13px; padding:8px 14px;" type="button" onclick="loadSavedOpenkotoLesson('${l.id}')">
                    Study Now
                  </button>
                  <button class="openkoto-tool-btn" style="background:#f1f5f9; color:#ef4444; border:none; padding:8px 12px; font-size:13px;" type="button" onclick="deleteSavedOpenkotoLesson('${l.id}')">
                    ✕
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `;
}

// Open Active Chatroom
function openChatroom(charId, updateUrl = true) {
  activeCharacterId = charId;
  analyticsData.characterInteractions[charId] = (analyticsData.characterInteractions[charId] || 0) + 1;
  
  // Hide bottom tab bar while in chat window
  const navDock = document.querySelector(".bottom-nav-dock");
  if (navDock) navDock.classList.add("hidden-in-chat");
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

  const tierObj = TIERS[0];
  const affectionPct = userState.affection[charId] || 0;

  // Set Chat Header Info
  const headerName = document.getElementById("chatHeaderName");
  if (headerName) headerName.innerHTML = `${char.name} <span>${char.flag}</span>`;
  const headerAvatar = document.getElementById("chatHeaderAvatar");
  if (headerAvatar) headerAvatar.src = char.avatar;
  const relInfo = getRelationshipInfo(affectionPct);
  const headerAffection = document.getElementById("chatHeaderAffection");
  if (headerAffection) {
    headerAffection.innerHTML = `<span class="relationship-milestone-badge ${relInfo.badgeClass}">${relInfo.icon} ${relInfo.stage} (${affectionPct}%)</span>`;
  }

  // Populate Phonetic & Tone helper chips for current language
  renderPhoneticChips(charId, userState.targetLanguage || "vi");

  // Romaji Toggle Button Visibility (Especially for Japanese)
  const romajiBtn = document.getElementById("romajiToggleBtn");
  if (romajiBtn) {
    if (char.language === "Japanese") {
      romajiBtn.style.display = "inline-flex";
      romajiBtn.title = `Romaji: ${userState.showRomaji !== false ? "ON" : "OFF"}`;
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

  // Update In-Chat Floating Companion and Desktop Floating Stage
  updateFloatingCompanion(charId);

  if (updateUrl) {
    updateRouteUrl(`/chats/${charId}`);
  }
}

window.openChatroom = openChatroom;

// Render Chat History Messages
let currentVnSpeechText = "";
let currentVnSpeechLang = "vi-VN";

function updateVnDialogueBox(latestLiMsg, char) {
  // 1. Floating Speech Bubble on Top of the Love Interest
  const bubbleEl = document.getElementById("companionSpeechBubble");
  const speakerNameEl = document.getElementById("companionSpeakerName");
  const emotionBadgeEl = document.getElementById("companionEmotionBadge");
  const speechTextEl = document.getElementById("companionSpeechText");
  const bubbleRomajiEl = document.getElementById("companionSpeechRomaji");

  // 2. Dedicated Language Insight Box (Roomy & Clean)
  const insightBoxEl = document.getElementById("vnDialogueBox");
  const insightTitleEl = document.getElementById("vnInsightTitle");
  const insightStatusTagEl = document.getElementById("vnInsightStatusTag");
  const grammarTipEl = document.getElementById("vnGrammarTip");
  const grammarCorrCardEl = document.getElementById("vnGrammarCorrectionCard");
  const grammarCorrEl = document.getElementById("vnGrammarCorrection");
  const centerSprite = document.getElementById("vnCenterGuySprite");
  const spriteWrapper = document.getElementById("vnSpriteWrapper");

  if (!char) char = CHARACTERS[activeCharacterId] || CHARACTERS.ado;
  let charId = char.id || activeCharacterId || "ado";

  // Determine active speaker (in single vs group chat)
  let speakerId = charId;
  let speakerName = char.name.split(" ")[0];
  if (latestLiMsg && latestLiMsg.speaker) {
    speakerId = latestLiMsg.speaker;
    if (speakerId === "ren") speakerName = "Ren";
    else if (speakerId === "kou" || speakerId === "julian") speakerName = "Kou";
    else speakerName = "Ado";
  }

  // Determine emotional expression (idle, fear, happy, angry, pout, sad, normal)
  let emotion = (latestLiMsg && latestLiMsg.emotion) ? latestLiMsg.emotion.toLowerCase().trim() : "normal";
  if (!["idle", "fear", "happy", "angry", "pout", "sad", "normal"].includes(emotion)) {
    if (latestLiMsg && latestLiMsg.evalColor === "red") emotion = "angry";
    else if (latestLiMsg && latestLiMsg.evalColor === "yellow") emotion = "pout";
    else emotion = "normal";
  }

  // Update center floating guy sprite in background with emotion-specific image!
  if (centerSprite) {
    const primaryEmotionPng = `/assets/characters/${speakerId}/${emotion}.png`;
    const normalPng = `/assets/characters/${speakerId}/normal.png`;
    const fullbodyPng = `/assets/characters/${speakerId}_fullbody.png`;
    const vectorSvg = (window.VN_SPRITES && window.VN_SPRITES[speakerId] && (window.VN_SPRITES[speakerId][emotion] || window.VN_SPRITES[speakerId].normal)) || `/assets/characters/${speakerId}_fullbody.svg`;

    let step = 0;
    centerSprite.onerror = function() {
      step++;
      if (step === 1) {
        this.src = normalPng;
      } else if (step === 2) {
        this.src = fullbodyPng;
      } else if (step === 3) {
        this.src = vectorSvg;
      } else {
        this.onerror = null;
      }
    };
    centerSprite.src = primaryEmotionPng;
  }


  // Group side sprites
  const sideLeft = document.getElementById("vnGroupSideLeft");
  const sideRight = document.getElementById("vnGroupSideRight");
  if (charId === "group") {
    if (sideLeft) sideLeft.style.display = "block";
    if (sideRight) sideRight.style.display = "block";
  } else {
    if (sideLeft) sideLeft.style.display = "none";
    if (sideRight) sideRight.style.display = "none";
  }

  // Speech text setup for bubble & TTS
  let text = latestLiMsg ? latestLiMsg.text : char.greeting;
  currentVnSpeechText = text || "";
  
  const targetLang = userState.targetLanguage || "vi";
  if (targetLang === "ja") currentVnSpeechLang = "ja-JP";
  else if (targetLang === "en") currentVnSpeechLang = "en-US";
  else currentVnSpeechLang = "vi-VN";

  // Render dialogue onto speech bubble on top of the Love Interest
  if (speakerNameEl) speakerNameEl.textContent = speakerName;
  if (emotionBadgeEl) {
    const emotionLabels = {
      idle: "🌿 Idle",
      fear: "⚡ Fear",
      happy: "✨ Happy",
      angry: "🔥 Angry",
      pout: "💢 Pout",
      sad: "💧 Sad",
      normal: "💬 Talking"
    };
    emotionBadgeEl.textContent = emotionLabels[emotion] || "💬 Talking";
    emotionBadgeEl.className = `vn-emotion-badge emotion-${emotion}`;
    emotionBadgeEl.style.display = "inline-flex";
  }
  if (speechTextEl) {
    speechTextEl.innerHTML = wrapInteractiveScaffoldWords(cleanEmojiText(text || ""), targetLang);
  }


  // Romaji on speech bubble
  const showRomaji = userState.showRomaji !== false;
  if (bubbleRomajiEl) {
    if (latestLiMsg && latestLiMsg.romaji && showRomaji) {
      bubbleRomajiEl.textContent = `🔤 ${latestLiMsg.romaji}`;
      bubbleRomajiEl.style.display = "inline-block";
    } else {
      bubbleRomajiEl.style.display = "none";
    }
  }

  // Ensure speech bubble is visible and stays until next message!
  if (bubbleEl) {
    bubbleEl.style.display = "flex";
  }

  // Populate Dedicated Language Insight Box
  const tip = latestLiMsg ? latestLiMsg.tip : (char.greetingTip || "Practice your conversational phrases! Ado loves friendly and natural responses.");
  const fix = latestLiMsg ? latestLiMsg.fix : null;
  const colorClass = latestLiMsg ? (latestLiMsg.evalColor || "green") : "green";

  if (insightBoxEl) {
    insightBoxEl.className = `vn-insight-box ${colorClass}`;
  }

  if (insightTitleEl) {
    if (colorClass === "yellow") insightTitleEl.textContent = "Slang & Casual Reminder";
    else if (colorClass === "red") insightTitleEl.textContent = "Grammar Rule & Correction";
    else insightTitleEl.textContent = "Language Insight";
  }

  if (insightStatusTagEl) {
    if (colorClass === "yellow") insightStatusTagEl.textContent = "Casual / Slang";
    else if (colorClass === "red") insightStatusTagEl.textContent = "Revision Needed";
    else insightStatusTagEl.textContent = "Natural & Fluent";
  }

  if (grammarTipEl) {
    grammarTipEl.textContent = tip || "Great conversational effort! Keep practicing to build affection and unlock new modes.";
  }

  if (grammarCorrCardEl && grammarCorrEl) {
    if (fix && fix !== "Spot on!" && !fix.startsWith("Spot")) {
      grammarCorrEl.textContent = fix;
      grammarCorrCardEl.style.display = "flex";
    } else {
      grammarCorrCardEl.style.display = "none";
    }
  }

  // Trigger emotion animation & bounce on character when speaking
  if (spriteWrapper) {
    spriteWrapper.classList.remove("vn-talk-bounce", "emotion-fear", "emotion-happy", "emotion-angry", "emotion-pout", "emotion-sad", "emotion-idle", "emotion-normal");
    void spriteWrapper.offsetWidth;
    spriteWrapper.classList.add("vn-talk-bounce", `emotion-${emotion}`);
  }

}
window.updateVnDialogueBox = updateVnDialogueBox;

function toggleVnBacklog(forceState) {
  const drawer = document.getElementById("vnBacklogDrawer");
  if (!drawer) return;
  if (typeof forceState === "boolean") {
    drawer.style.display = forceState ? "flex" : "none";
  } else {
    drawer.style.display = (drawer.style.display === "none" || !drawer.style.display) ? "flex" : "none";
  }
}
window.toggleVnBacklog = toggleVnBacklog;

function toggleVnTranslation() {
  const transRow = document.getElementById("vnTranslationRow");
  if (transRow) {
    transRow.style.display = transRow.style.display === "none" ? "block" : "none";
  }
}
window.toggleVnTranslation = toggleVnTranslation;

function speakCurrentVnDialogue() {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported.");
    return;
  }
  if (!currentVnSpeechText) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentVnSpeechText);
  utterance.lang = currentVnSpeechLang || "vi-VN";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
window.speakCurrentVnDialogue = speakCurrentVnDialogue;

function toggleRomajiSetting() {
  userState.showRomaji = !userState.showRomaji;
  localStorage.setItem("otome_show_romaji", userState.showRomaji);
  const romajiBtn = document.getElementById("romajiToggleBtn");
  if (romajiBtn) {
    romajiBtn.title = `Romaji: ${userState.showRomaji ? "ON" : "OFF"}`;
    romajiBtn.style.opacity = userState.showRomaji ? "1" : "0.6";
  }
  renderChatHistory();
}
window.toggleRomajiSetting = toggleRomajiSetting;

function toggleInputUiCollapse(forceCollapse) {
  const inputSec = document.getElementById("vnInputSection");
  const collapseIcon = document.getElementById("collapseInputIcon");
  const collapsedBar = document.getElementById("inputCollapsedBar");
  if (!inputSec) return;

  const isCurrentlyCollapsed = inputSec.classList.contains("collapsed");
  const shouldCollapse = typeof forceCollapse === "boolean" ? forceCollapse : !isCurrentlyCollapsed;

  if (shouldCollapse) {
    inputSec.classList.add("collapsed");
    if (collapseIcon) collapseIcon.textContent = "expand_less";
    if (collapsedBar) collapsedBar.style.display = "flex";
  } else {
    inputSec.classList.remove("collapsed");
    if (collapseIcon) collapseIcon.textContent = "expand_more";
    if (collapsedBar) collapsedBar.style.display = "none";
  }
}
window.toggleInputUiCollapse = toggleInputUiCollapse;

function setChatMode(modeNum) {
  const modeStarterBtn = document.getElementById("modeStarterChoiceBtn");
  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");
  if (modeNum === 1 && modeStarterBtn) modeStarterBtn.click();
  else if (modeNum === 2 && modeSentenceBtn) modeSentenceBtn.click();
  else if (modeNum === 3 && modeFreeBtn) modeFreeBtn.click();
}
window.setChatMode = setChatMode;

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
          speaker: "ado",
          speakerName: "Ado",
          text: "MC! I prepared fresh notes for our study session today... What would you like to practice?",
          translation: "MC! I prepared fresh notes for our study session today... What would you like to practice?",
          tip: "Ado is eager to study with you.",
          time: "Just now",
        },
        {
          sender: "li",
          speaker: "kou",
          speakerName: "Kou",
          text: "Senpai, I wanted to practice speaking with you too today! Are you ready?",
          translation: "Senpai, I wanted to practice speaking with you too today! Are you ready?",
          tip: "Kou is happy to practice speaking together.",
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

  history.forEach((msg, idx) => {
    const group = document.createElement("div");
    group.className = "message-group " + (msg.sender === "user" ? "user-msg" : "li-msg");

    if (msg.sender === "li") {
      let speakerAvatar = char.avatar;
      let speakerName = char.name;
      let speakerStyle = "";

      if (activeCharacterId === "group" || msg.speaker) {
        if (msg.speaker === "ren" || msg.speakerName === "Ren") {
          speakerAvatar = CHARACTERS.ren.avatar;
          speakerName = "Ren";
          speakerStyle = "style='color: #7c3aed; font-weight:800;'";
        } else if (msg.speaker === "kou" || msg.speaker === "julian" || msg.speakerName === "Kou" || msg.speakerName === "Julian Vance") {
          speakerAvatar = CHARACTERS.kou.avatar;
          speakerName = "Kou";
          speakerStyle = "style='color: #d97706; font-weight:800;'";
        } else {
          speakerAvatar = CHARACTERS.ado.avatar;
          speakerName = "Ado";
          speakerStyle = "style='color: var(--accent-emerald); font-weight:800;'";
        }
      }

        const romajiHtml = (msg.romaji && showRomaji)
          ? `<div class="romaji-text" style="font-size:12.5px; color:var(--accent-violet); font-weight:700; margin-top:4px; margin-bottom:2px; background:rgba(124, 58, 237, 0.08); border:1px solid rgba(124, 58, 237, 0.2); padding:3px 8px; border-radius:6px; display:inline-block;">${cleanEmojiText(msg.romaji)}</div>`
          : "";

        const colorClass = msg.evalColor || (msg.fix && !msg.fix.startsWith("Spot") ? "red" : "green");

        let tipTitleText = "Language Insight";
        let fixTitleText = "Correction";
        if (colorClass === "yellow") {
          tipTitleText = "Slang Meaning & Context";
          fixTitleText = "Standard / Formal Term";
        } else if (colorClass === "red") {
          tipTitleText = "Grammar Rule Insight";
          fixTitleText = "Corrected Phrasing";
        }

        group.innerHTML = `
          <img src="${speakerAvatar}" class="msg-avatar" alt="${speakerName}" />
          <div class="msg-body">
            <div class="msg-sender" ${speakerStyle}>${speakerName}</div>
            <div class="msg-bubble">
              <div style="font-size:15px; font-weight:700;">${wrapInteractiveScaffoldWords(cleanEmojiText(msg.text), userState.targetLanguage || "vi")}</div>
              ${romajiHtml}
              <div class="msg-action-row" style="display:flex; align-items:center; gap:6px; margin-top:6px; flex-wrap:wrap;">
                ${(msg.translation || msg.tip || msg.fix) ? `<button type="button" class="assist-toggle-btn">Translation & Tips</button>` : ''}
                ${msg.text ? `<button type="button" class="msg-study-media-btn" onclick="importSingleChatMsgToMediaLab('${activeCharacterId}', ${idx})" title="Import message to AI Media Lab for deep study & breakdown"><span class="material-symbols-outlined" style="font-size:16px;">auto_awesome</span> <span>Import to Media Lab</span></button>` : ''}
              </div>
              ${msg.translation ? `<div class="translation-text">${cleanEmojiText(msg.translation)}</div>` : ""}
              ${msg.tip ? `<div class="tip-card ${colorClass}"><div class="tip-title ${colorClass}">${tipTitleText}</div>${cleanEmojiText(msg.tip)}</div>` : ""}
              ${msg.fix ? `<div class="fix-card ${colorClass}"><div class="fix-title ${colorClass}">${cleanEmojiText(msg.fix)}</div>${cleanEmojiText(msg.fix)}</div>` : ""}
            </div>
            <div class="msg-time">${msg.time || "11:42 PM"}</div>
          </div>
        `;
    } else {
      group.innerHTML = `
        <div class="msg-body">
          <div class="msg-bubble">
            <div>${cleanEmojiText(msg.text)}</div>
            ${msg.text ? `
              <div class="msg-action-row" style="display:flex; justify-content:flex-end; gap:6px; margin-top:6px;">
                <button type="button" class="msg-study-media-btn user-side" onclick="importSingleChatMsgToMediaLab('${activeCharacterId}', ${idx})" title="Import message to AI Media Lab"><span class="material-symbols-outlined" style="font-size:16px;">auto_awesome</span> <span>Import to Media Lab</span></button>
              </div>
            ` : ''}
          </div>
          <div class="msg-time">${msg.time || "11:42 PM"}</div>
        </div>
      `;
    }

    container.appendChild(group);
  });

  container.scrollTop = container.scrollHeight;

  // Find latest LI message to update Visual Novel dialogue box
  let latestLiMsg = null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].sender === "li") {
      latestLiMsg = history[i];
      break;
    }
  }
  updateVnDialogueBox(latestLiMsg, char);
}

// Starter Options Generator (3 Premade Multiple-Choice Options for Beginners)
function generateStarterChoices(charId, lastMsgText) {
  const text = (lastMsgText || "").toLowerCase();
  const targetLang = userState.targetLanguage || "vi";

  if (targetLang === "en") {
    let charName = charId === "ado" ? "Ado" : (charId === "kou" ? "Kou" : (charId === "ren" ? "Ren" : "Everyone"));
    let prompt = `Choose your reply to ${charName} (Beginner Choices):`;
    let options = [
      { text: `Thank you so much, ${charName}!`, translation: "Express gratitude sweetly" },
      { text: `What are you up to today, ${charName}?`, translation: "Ask what they are doing" },
      { text: `I am very happy to talk with you!`, translation: "Express happiness talking to them" }
    ];

    if (text.includes("coffee") || text.includes("tea") || text.includes("hang out") || text.includes("play")) {
      options = [
        { text: "I would love to hang out with you!", translation: "Agree enthusiastically to hang out" },
        { text: "Where would you like to go today?", translation: "Ask about their preferred spot" },
        { text: "Let's definitely go together soon!", translation: "Promise to go together soon" }
      ];
    } else if (text.includes("study") || text.includes("book") || text.includes("class") || text.includes("late")) {
      options = [
        { text: "Thank you for the notes! I'll study hard!", translation: "Thank them and promise to study" },
        { text: "Please teach me if I have questions!", translation: "Politely ask for study help" },
        { text: "Don't worry, I won't disappoint you!", translation: "Reassure them with confidence" }
      ];
    }
    return { prompt, options };
  } else if (targetLang === "ja") {
    let charName = charId === "ado" ? "Ado" : (charId === "kou" ? "Kou" : (charId === "ren" ? "Ren" : "みんな"));
    let prompt = `Choose your reply to ${charName} (Beginner Choices):`;
    let options = [
      { text: `ありがとう、${charName}くん！`, romaji: `Arigatou, ${charName}-kun!`, translation: "Thank you very much!" },
      { text: "今日も一日お疲れ様でした！", romaji: "Kyou mo ichinichi otsukaresama deshita!", translation: "Great job today!" },
      { text: "お話しできてすごく嬉しいです！", romaji: "Ohanashi dekite sugoku ureshii desu!", translation: "I'm very happy to talk with you!" }
    ];

    if (text.includes("お出かけ") || text.includes("一緒") || text.includes("遊")) {
      options = [
        { text: "うん、一緒にお出かけしよう！", romaji: "Un, issho ni odekake shiyou!", translation: "Yeah, let's go out together!" },
        { text: "どこに行きたいか教えて？", romaji: "Doko ni ikitai ka oshiete?", translation: "Tell me where you want to go!" },
        { text: "すっごく楽しみにしてるね！", romaji: "Suggoku tanoshimi ni shiteru ne!", translation: "I'm really looking forward to it!" }
      ];
    }
    return { prompt, options };
  } else {
    // Default Vietnamese
    if (charId === "ado") {
      let prompt = "Choose your reply to Ado (Beginner Choices):";
      let options = [
        { text: "Cảm ơn Ado nhé, tớ sẽ học hành chăm chỉ!", translation: "Thanks Ado, I will study diligently!" },
        { text: "Ado chu đáo quá, đừng nghiêm khắc quá nha.", translation: "You're so thoughtful, don't be too strict." },
        { text: "Chút nữa Ado giảng lại bài này giúp tớ nhé?", translation: "Could you explain this lesson to me later?" }
      ];
      return { prompt, options };
    } else if (charId === "kou") {
      const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
      let prompt = "Choose your reply to Kou (Beginner Choices):";
      let options = [
        { text: `Chào Kou, ${olderUserTerm} cũng nhớ em lắm nè!`, translation: `Hello Kou, ${olderUserTerm} misses you too!` },
        { text: "Được chứ, đi chơi thôi Kou ơi!", translation: "Sure, let's hang out Kou!" },
        { text: `Kou hôm nay ngoan quá, ${olderUserTerm} thưởng nha!`, translation: `Kou is so well-behaved, ${olderUserTerm} will reward you!` }
      ];
      if (text.includes("chơi") || text.includes("rảnh") || text.includes("tìm")) {
        options = [
          { text: `${olderUserCap} rảnh nè, Kou muốn đi đâu chơi nào?`, translation: `I am free, where does Kou want to go?` },
          { text: `Được đi chơi với Kou thì ${olderUserTerm} vui lắm!`, translation: `I'd be so happy to hang out with Kou!` },
          { text: `Kou đứng chờ ${olderUserTerm} xíu nhé, tới ngay đây!`, translation: "Wait for me a bit, I'm coming right away!" }
        ];
      }
      return { prompt, options };
    } else if (charId === "ren") {
      let prompt = "Choose your reply to Ren (Beginner Choices):";
      let options = [
        { text: "Anh Ren lại trêu em rồi, em chào anh!", translation: "Teasing me again Ren, hello!" },
        { text: "Em ngồi gần anh rồi nè, vừa ý anh chưa?", translation: "Sitting close to you now, satisfied?" },
        { text: "Em không phải là nhóc con đâu nhé!", translation: "I am not a little kid, you know!" }
      ];
      return { prompt, options };
    } else {
      let prompt = `Choose your reply to ${charId} (Beginner Choices):`;
      let options = [
        { text: "Cảm ơn bạn rất nhiều nhé!", translation: "Thank you so much!" },
        { text: "Rất vui được trò chuyện cùng bạn!", translation: "Nice talking with you!" },
        { text: "Hôm nay bạn thấy thế nào?", translation: "How are you feeling today?" }
      ];
      return { prompt, options };
    }
  }
}

// Setup Starter Choice Options (3 Premade Choices for Beginners)
function setupStarterChoicesPrompt(char) {
  const guideEl = document.getElementById("starterChoicePromptGuide");
  const listEl = document.getElementById("starterOptionsList");
  if (!listEl) return;

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
  let options = [];

  if (dynamicStarterChoices[char.id] && dynamicStarterChoices[char.id].options && dynamicStarterChoices[char.id].options.length > 0) {
    promptText = dynamicStarterChoices[char.id].prompt || `Choose a response to ${char.name.split(" ")[0]} (Beginner Choices):`;
    options = dynamicStarterChoices[char.id].options;
  } else {
    const starterData = generateStarterChoices(char.id, lastLiMsgText);
    promptText = starterData.prompt;
    options = starterData.options;
  }

  // Ensure exactly 3 options
  options = options.slice(0, 3);

  if (guideEl) guideEl.textContent = promptText;
  listEl.innerHTML = "";

  options.forEach((opt) => {
    const card = document.createElement("div");
    card.className = "starter-option-card";
    card.setAttribute("role", "button");
    card.tabIndex = 0;

    const romajiHtml = (opt.romaji && userState.showRomaji !== false)
      ? `<div class="starter-option-romaji">${opt.romaji}</div>`
      : "";

    card.innerHTML = `
      <div class="starter-option-content">
        <div class="starter-option-text">${opt.text}</div>
        ${romajiHtml}
        <div class="starter-option-trans">${opt.translation || ""}</div>
      </div>
      <div class="starter-option-send-icon">➤</div>
    `;

    card.onclick = () => {
      handleSendStarterChoice(opt.text);
    };

    listEl.appendChild(card);
  });
}

// Submit Starter Choice Message
async function handleSendStarterChoice(chosenText) {
  if (!chosenText) return;
  if (isSendingMessage) return;
  isSendingMessage = true;

  const freeInput = document.getElementById("freeChatInput");
  if (freeInput) freeInput.value = "";
  currentConstructedWords = [];
  updateConstructedBox();

  analyticsData.answersSubmitted++;

  const charId = activeCharacterId || "ado";
  activeCharacterId = charId;

  // Add User Message
  addUserMessageToHistory(chosenText);

  userState.chatStep[charId] = (userState.chatStep[charId] || 0) + 1;
  dynamicStarterChoices[charId] = null;
  dynamicWordBank[charId] = null;

  // Progress mode unlock count
  checkModeProgression(charId, 1);

  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];

  addHearts(tierObj.heartsPerAns || 10);
  increaseAffection(charId, null, { mode: "starter" });
  triggerHeartBurst();

  try {
    await triggerLLMResponse(chosenText, tierObj);
  } finally {
    isSendingMessage = false;
    updateCooldownUI(0);
  }
}
window.handleSendStarterChoice = handleSendStarterChoice;

// Contextual Word Chips Generator for Sentence Builder
function generateContextualWordChips(charId, lastMsgText) {
  const text = (lastMsgText || "").toLowerCase();
  const targetLang = userState.targetLanguage || "vi";

  if (targetLang === "en") {
    let charName = charId === "ado" ? "Ado" : (charId === "kou" ? "Kou" : (charId === "ren" ? "Ren" : "Lounge"));
    let prompt = `Build your reply to ${charName} (English):`;
    let chips = ["Hello", charName, "I", "am", "very", "happy", "to", "chat", "with", "you", "today", "thank", "you"];

    if (text.includes("coffee") || text.includes("tea") || text.includes("drink") || text.includes("hang out")) {
      prompt = `Build reply: "Thank you! I would love to hang out with you!"`;
      chips = ["Thank", "you", charName, "I", "would", "love", "to", "hang", "out", "with", "you", "so", "much"];
    } else if (text.includes("book") || text.includes("study") || text.includes("class")) {
      prompt = `Build reply: "I will study hard and do my best."`;
      chips = ["I", "will", "study", "hard", "and", "do", "my", "best", "with", charName, "today"];
    }
    return { prompt, chips };
  } else if (targetLang === "ja") {
    let charName = charId === "ado" ? "Ado" : (charId === "kou" ? "Kou" : (charId === "ren" ? "Ren" : "みんな"));
    let prompt = `Build your reply to ${charName} (Japanese):`;
    let chips = ["こんにちは", charName, "私", "は", "お話し", "できて", "嬉しい", "です", "ありがとう"];

    if (text.includes("お茶") || text.includes("コーヒー") || text.includes("飲み")) {
      prompt = `Build reply: "Thank you! Let's drink together!"`;
      chips = ["こんにちは", charName, "一緒", "に", "飲みましょう", "ありがとう", "ございます"];
    }
    return { prompt, chips };
  } else {
    // Default Vietnamese
    if (charId === "ado") {
      let prompt = "Build your reply to Ado (Vietnamese):";
      let chips = ["Cảm", "ơn", "Ado", "chu", "đáo", "quá", "tớ", "sẽ", "học", "chăm", "chỉ", "đừng", "lo", "nhé", "ạ"];
      return { prompt, chips };
    } else if (charId === "kou") {
      const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();
      let prompt = "Build your reply to Kou (Vietnamese):";
      let chips = ["Cảm", "ơn", "Kou", "em", "ngoan", "quá", "đi", "chơi", "với", olderUserTerm, "nhé", "ạ"];

      if (text.includes("chơi") || text.includes("tìm") || text.includes("senpai")) {
        prompt = `Build reply: "${olderUserCap} cũng muốn đi chơi với Kou lắm."`;
        chips = [olderUserCap, "cũng", "rất", "muốn", "đi", "chơi", "với", "Kou", "nhé", "ngoan", "á"];
      }
      return { prompt, chips };
    } else if (charId === "ren") {
      let prompt = "Build your reply to Ren (Vietnamese):";
      let chips = ["Cảm", "ơn", "anh", "Ren", "anh", "lại", "trêu", "em", "rồi", "em", "không", "phải", "nhóc", "đâu"];
      return { prompt, chips };
    } else {
      let prompt = `Build your reply to ${charId}:`;
      let chips = ["Cảm", "ơn", "rất", "vui", "được", "gặp", "nói", "chuyện", "cùng", "bạn"];
      return { prompt, chips };
    }
  }
}

// Setup Input Controls for Active Chat
function setupTierInputControls(tierObj, char, isInitialLoad = false) {
  const labelEl = document.getElementById("tierModeLabel");
  const multEl = document.getElementById("tierHeartMultiplier");
  const dropdownEl = document.getElementById("tierSelectDropdown");

  if (dropdownEl && tierObj) {
    dropdownEl.value = tierObj.level.toString();
  }

  if (labelEl && tierObj) labelEl.textContent = `Tier ${tierObj.level}`;
  if (multEl && tierObj) multEl.textContent = `+${tierObj.heartsPerAns || 10} ❤️ / answer`;

  // Always configure both Starter Choice Options and Contextual Word Bank for current conversation step
  setupStarterChoicesPrompt(char);
  setupWordBankPrompt(tierObj, char);

  // Check and apply active cooldown button states if running
  updateCooldownUI(checkSendCooldown());

  const progBar = document.getElementById("modeProgressionBar");
  if (progBar) progBar.style.display = "none";

  const modeSwitcher = document.getElementById("inputModeSwitcher");
  if (modeSwitcher) modeSwitcher.style.display = "flex";

  const modeStarterBtn = document.getElementById("modeStarterChoiceBtn");
  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");

  const savedMode = userState.selectedInputMode && userState.selectedInputMode[char.id];
  const isFreeActive = modeFreeBtn && modeFreeBtn.classList.contains("active");
  const isSentenceActive = modeSentenceBtn && modeSentenceBtn.classList.contains("active");
  const isStarterActive = modeStarterBtn && modeStarterBtn.classList.contains("active");

  const currentMode = isInitialLoad
    ? (savedMode || "starter")
    : (isStarterActive ? "starter" : (isSentenceActive ? "sentence" : "free"));

  if (currentMode === "starter") {
    if (modeStarterBtn) modeStarterBtn.click();
  } else if (currentMode === "sentence") {
    if (modeSentenceBtn) modeSentenceBtn.click();
  } else {
    if (modeFreeBtn) modeFreeBtn.click();
  }
}

// Mode Progression Engine
function checkModeProgression(charId, currentStepMode) {
  // Free mode selection enabled directly across all chats
}

function showModeUnlockBanner(text) {
  const banner = document.getElementById("modeUnlockBanner");
  if (banner) {
    banner.textContent = text;
    banner.style.display = "block";
    setTimeout(() => {
      banner.style.display = "none";
    }, 4500);
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
  let rawChips = [];

  // Check if AI generated dynamic word bank exists
  if (dynamicWordBank[char.id] && dynamicWordBank[char.id].chips && dynamicWordBank[char.id].chips.length > 0) {
    promptText = dynamicWordBank[char.id].prompt || `Build your reply to ${char.name.split(" ")[0]}:`;
    rawChips = dynamicWordBank[char.id].chips;
  } else {
    const contextualData = generateContextualWordChips(char.id, lastLiMsgText);
    promptText = contextualData.prompt;
    rawChips = contextualData.chips;
  }

  // Ensure ALL chips are strictly single words by splitting any multi-word phrases
  let flatChips = [];
  rawChips.forEach((item) => {
    if (typeof item === "string") {
      const words = item.trim().split(/\s+/).filter(Boolean);
      flatChips.push(...words);
    }
  });

  // Deduplicate while preserving order
  const chips = Array.from(new Set(flatChips));

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

  const charId = activeCharacterId || "ado";
  activeCharacterId = charId;

  // Add User Message
  addUserMessageToHistory(messageText);

  userState.chatStep[charId] = (userState.chatStep[charId] || 0) + 1;
  dynamicWordBank[charId] = null;
  dynamicStarterChoices[charId] = null;

  // Progress mode unlock count for Sentence Builder mode
  checkModeProgression(charId, 2);

  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];

  addHearts(tierObj.heartsPerAns || 10);
  increaseAffection(charId, null, { mode: "sentence" });
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

  const charId = activeCharacterId || "ado";
  activeCharacterId = charId;

  addUserMessageToHistory(text);

  userState.chatStep[charId] = (userState.chatStep[charId] || 0) + 1;
  dynamicWordBank[charId] = null;
  dynamicStarterChoices[charId] = null;

  // Progress mode unlock count for Free Chat mode
  checkModeProgression(charId, 3);

  const tierNum = userState.currentTiers[charId] || 1;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];

  addHearts(tierObj.heartsPerAns || 10);
  increaseAffection(charId, null, { mode: "free" });
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
  const charId = activeCharacterId || "ado";
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
  if (!userState.unrepliedCount) userState.unrepliedCount = { ado: 0, kou: 0, ren: 0 };
  if (!userState.isPouting) userState.isPouting = { ado: false, kou: false, ren: false };
  if (!userState.saidGoodbye) userState.saidGoodbye = { ado: false, kou: false, ren: false };

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
function showGrammarFeedback(evalColor, isCorrect, correction, tip, encouragement) {
  const panel = document.getElementById("grammarFeedbackPanel");
  const badge = document.getElementById("feedbackBadge");
  const icon = document.getElementById("feedbackIcon");
  const title = document.getElementById("feedbackTitle");
  const encouragementEl = document.getElementById("feedbackEncouragement");
  const correctionEl = document.getElementById("feedbackCorrection");
  const tipEl = document.getElementById("feedbackTip");

  if (!panel) return;

  panel.style.display = "flex";
  panel.classList.remove("red", "yellow", "green", "mistake");

  let color = (evalColor || "").toLowerCase();
  if (!["red", "yellow", "green"].includes(color)) {
    if (isCorrect === false) color = "red";
    else if (correction && correction !== "Spot on!" && !correction.startsWith("Spot")) color = "yellow";
    else color = "green";
  }

  panel.classList.add(color);

  if (color === "red") {
    if (icon) icon.textContent = "error";
    if (title) title.textContent = "Severely Broken Language";
    if (encouragementEl) encouragementEl.textContent = encouragement ? cleanEmojiText(encouragement) : "Grammar fix needed! Here is the corrected structure:";
    if (correctionEl) {
      if (correction && correction !== "Spot on!") {
        correctionEl.textContent = `Correction: ${cleanEmojiText(correction)}`;
        correctionEl.style.display = "block";
      } else {
        correctionEl.style.display = "none";
      }
    }
    if (tipEl) {
      if (tip) {
        tipEl.textContent = cleanEmojiText(tip);
        tipEl.style.display = "block";
      } else {
        tipEl.style.display = "none";
      }
    }
  } else if (color === "yellow") {
    if (icon) icon.textContent = "forum";
    if (title) title.textContent = "Slang & Casual Reminder";
    if (encouragementEl) encouragementEl.textContent = encouragement ? cleanEmojiText(encouragement) : "Fun casual slang! Here is a reminder of the formal term:";
    if (correctionEl) {
      if (correction && correction !== "Spot on!") {
        correctionEl.textContent = `Standard / Formal: ${cleanEmojiText(correction)}`;
        correctionEl.style.display = "block";
      } else {
        correctionEl.style.display = "none";
      }
    }
    if (tipEl) {
      if (tip) {
        tipEl.textContent = cleanEmojiText(tip);
        tipEl.style.display = "block";
      } else {
        tipEl.style.display = "none";
      }
    }
  } else {
    // Green
    if (icon) icon.textContent = "verified";
    if (title) title.textContent = "Good Grammar & Vocab";
    if (encouragementEl) encouragementEl.textContent = encouragement ? cleanEmojiText(encouragement) : "Awesome effort! Excellent grammar & vocabulary usage.";
    if (correctionEl) {
      correctionEl.style.display = "none";
    }
    if (tipEl) {
      if (tip) {
        tipEl.textContent = cleanEmojiText(tip);
        tipEl.style.display = "block";
      } else {
        tipEl.style.display = "none";
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
      if (responseData && responseData.starterOptions && responseData.starterOptions.length > 0) {
        dynamicStarterChoices[char.id] = {
          prompt: `Choose your reply to ${char.name.split(" ")[0]} (Beginner Choices):`,
          options: responseData.starterOptions
        };
      }
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
      responseData.evalColor,
      responseData.isCorrect !== false,
      responseData.correction || responseData.fix,
      responseData.tip,
      responseData.encouragement
    );

    const history = userState.chatHistories[charId] || [];

    // Extract emotion (idle, fear, happy, angry, pout, sad, normal)
    let charEmotion = responseData.emotion ? responseData.emotion.toLowerCase().trim() : null;
    if (!charEmotion || !["idle", "fear", "happy", "angry", "pout", "sad", "normal"].includes(charEmotion)) {
      if (responseData.evalColor === "red") charEmotion = "angry";
      else if (responseData.evalColor === "yellow") charEmotion = "pout";
      else if (/sad|sorry|cry|buồn|tiếc|khóc|miss|đau|lonely|heartbroken/i.test(responseData.characterResponse || "")) charEmotion = "sad";
      else if (/love|sweet|thank|cute|happy|smile|great|fun|yay|nhớ|yêu|thương|vui/i.test(responseData.characterResponse || "")) charEmotion = "happy";
      else charEmotion = "normal";
    }

    history.push({
      sender: "li",
      text: responseData.characterResponse || responseData.text || "Chào bạn nha! Rất vui được gặp! ❤️",
      romaji: responseData.romaji || null,
      translation: responseData.translation || "Hello! So happy to talk with you! ❤️",
      tip: responseData.tip || "Keep practicing your conversation skills!",
      fix: responseData.correction || responseData.fix || null,
      evalColor: responseData.evalColor || "green",
      emotion: charEmotion,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    userState.chatHistories[charId] = history;
    lastMessageWasLi[charId] = true;
    lastLiCheckupTime[charId] = Date.now();

    checkTierLevelUp(charId);
    saveLocalState();
    renderChatHistory();

    // Update Floating Companion with recent response & mood & emotion
    const companionQuote = responseData.characterResponse || null;
    updateFloatingCompanion(charId, companionQuote, responseData.evalColor === "green" ? "Blushing & Impressed 💕" : "Observing carefully ✨", charEmotion);


    setupTierInputControls(tierObj || TIERS[0], char);
    syncUserDataToConvex(`Post-chat response sync (${char.name})`);
  }
}

function generateInCharacterFallback(char, userText, tierObj) {
  const normText = (userText || "").toLowerCase();
  const targetLang = userState.targetLanguage || "vi";

  let evalColor = "green";
  let fallbackFix = "Spot on!";
  let fallbackTip = "Great beginner phrase! Clear and natural.";
  let fallbackEncouragement = "Awesome effort! Excellent vocabulary usage.";

  const slangRegex = /\b(idk|gonna|wanna|u|r|ko|được ko|bùn|chơi luôn|vcl|vl|omg|imho|idfc|tbh|omw)\b/i;
  if (slangRegex.test(normText)) {
    evalColor = "yellow";
    fallbackFix = "Standard formal term: Expand abbreviations into full formal terms (e.g. 'I do not know' or 'Được không')";
    fallbackTip = "Slang Insight: You used informal slang/abbreviation. Remember standard words for learning!";
    fallbackEncouragement = "Fun casual slang! Here is a reminder of the standard term:";
  } else if (normText.length > 25 && !normText.includes(" ")) {
    evalColor = "red";
    fallbackFix = "Grammar Fix: Ensure clear word spacing and sentence structure";
    fallbackTip = "Grammar Rule: Severely broken text structure without proper word division.";
    fallbackEncouragement = "Grammar fix needed! Here is the corrected structure:";
  }

  if (char.id === "ado") {
    let respText = "Chào tiền bối nha! Đi chơi thôi!";
    let trans = "Hello Senpai! Let's go hang out!";
    let tip = "'Chào tiền bối' is a sweet greeting to an upperclassman.";

    if (targetLang === "en") {
      respText = "Hello Senpai! Let's hang out together!";
      trans = "Hello Senpai! Let's hang out together!";
      tip = "Ado loves spending time with Senpai.";
    } else if (targetLang === "ja") {
      respText = "先輩！一緒にお出かけしましょう！";
      trans = "Senpai! Let's go out together!";
      tip = "'Senpai' is how Ado addresses you affectionately.";
    }

    return {
      characterResponse: respText,
      translation: trans,
      tip: tip || fallbackTip,
      evalColor: evalColor,
      isCorrect: evalColor !== "red",
      correction: fallbackFix,
      encouragement: fallbackEncouragement,
      starterOptions: [
        { text: "Chào Ado, tiền bối cũng nhớ Ado!", translation: "Hello Ado, I miss you too!" },
        { text: "Được chứ, đi chơi thôi Ado ơi!", translation: "Sure, let's hang out Ado!" },
        { text: "Ado hôm nay ngoan quá nha!", translation: "Ado is so well-behaved today!" }
      ],
      contextualChipsPrompt: `Build your reply to Ado:`,
      contextualChips: ["Chào", "Ado", "tiền", "bối", "cũng", "nhớ", "em", "đi", "chơi", "ngoan", "quá", "nhé"]
    };
  } else if (char.id === "kou") {
    let respText = "Hừm... Cậu làm tốt lắm.";
    let trans = "Hmph... You did very well.";
    let tip = "Kou is strict, but gives subtle praise!";

    if (targetLang === "en") {
      respText = "Hmph... You did quite well.";
      trans = "Hmph... You did quite well.";
      tip = "Kou is a tsundere classmate who secretly cares.";
    } else if (targetLang === "ja") {
      respText = "ふん… よく出来てるじゃない。";
      trans = "Hmph... You did quite well.";
      tip = "Classic tsundere expression of praise.";
    }

    return {
      characterResponse: respText,
      translation: trans,
      tip: tip || fallbackTip,
      evalColor: evalColor,
      isCorrect: evalColor !== "red",
      correction: fallbackFix,
      encouragement: fallbackEncouragement,
      starterOptions: [
        { text: "Cảm ơn Kou nhé, tớ sẽ cố gắng!", translation: "Thanks Kou, I will do my best!" },
        { text: "Kou chu đáo quá, đừng ngại nha.", translation: "You're so thoughtful, don't be shy." },
        { text: "Kou giảng bài giúp tớ nhé?", translation: "Could you help explain the lesson?" }
      ],
      contextualChipsPrompt: `Build your reply to Kou:`,
      contextualChips: ["Cảm", "ơn", "Kou", "tớ", "sẽ", "học", "chăm", "chỉ", "giúp", "bài", "nhé"]
    };
  } else if (char.id === "ren") {
    let respText = "Chào nhóc nhé. Ngoan lắm!";
    let trans = "Hello kid. Good job!";
    let tip = "Ren is an assertive senior who loves teasing you.";

    if (targetLang === "en") {
      respText = "Hey there kid. Good job!";
      trans = "Hey there kid. Good job!";
      tip = "Ren loves teasing you playfully.";
    } else if (targetLang === "ja") {
      respText = "ほら、いい子にしてたな、後輩。";
      trans = "See? You were a good kid, junior.";
      tip = "Ren's teasing tone.";
    }

    return {
      characterResponse: respText,
      translation: trans,
      tip: tip || fallbackTip,
      evalColor: evalColor,
      isCorrect: evalColor !== "red",
      correction: fallbackFix,
      encouragement: fallbackEncouragement,
      starterOptions: [
        { text: "Em chào anh Ren nhé!", translation: "Hello Ren!" },
        { text: "Em không phải là nhóc đâu!", translation: "I am not a kid!" },
        { text: "Anh Ren lại trêu em rồi!", translation: "Ren is teasing me again!" }
      ],
      contextualChipsPrompt: `Build your reply to Ren:`,
      contextualChips: ["Chào", "anh", "Ren", "em", "không", "phải", "nhóc", "con", "đâu", "nhé", "ạ"]
    };
  } else {
    return {
      characterResponse: "Chào bạn nhé! Rất vui được gặp!",
      translation: "Hello! So happy to meet you!",
      tip: fallbackTip,
      evalColor: evalColor,
      isCorrect: true,
      correction: "Spot on!",
      encouragement: fallbackEncouragement,
      starterOptions: [
        { text: "Cảm ơn bạn rất nhiều nhé!", translation: "Thank you so much!" },
        { text: "Rất vui được nói chuyện với bạn!", translation: "Nice talking with you!" },
        { text: "Hôm nay bạn thế nào?", translation: "How are you today?" }
      ],
      contextualChipsPrompt: `Build your reply:`,
      contextualChips: ["Cảm", "ơn", "rất", "vui", "được", "nói", "chuyện", "cùng", "bạn", "nhé"]
    };
  }
}

// Typing Indicator Helpers
function showTypingIndicator(char) {
  const vnTyping = document.getElementById("vnTypingIndicator");
  const vnTypingName = document.getElementById("vnTypingName");
  if (vnTyping) {
    if (vnTypingName) vnTypingName.textContent = `${char.name.split(" ")[0]} is thinking...`;
    vnTyping.style.display = "flex";
  }

  const container = document.getElementById("chatHistory");
  if (!container) return;
  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className = "message-group li-msg";
  indicator.innerHTML = `
    <img src="${char.avatar}" class="msg-avatar" alt="${char.name}" />
    <div class="msg-body">
      <div class="msg-bubble" style="font-style:italic; color:var(--accent-emerald);">
        ${char.name} is typing...
      </div>
    </div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const vnTyping = document.getElementById("vnTypingIndicator");
  if (vnTyping) vnTyping.style.display = "none";

  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

// ==========================================================================
// BALANCED AFFECTION CURVE & NATURAL RELATIONSHIP PROGRESSION ENGINE
// ==========================================================================
function getRelationshipInfo(affectionPct) {
  const pct = Math.max(0, Math.min(100, Math.round((affectionPct || 0) * 10) / 10));
  if (pct < 20) {
    return {
      stage: "Acquaintance",
      stageVi: "Người Quen",
      stageJa: "知人",
      icon: "🤍",
      badgeClass: "stage-acquaintance",
      desc: "Polite & formal. Icebreaking conversations.",
      nextThreshold: 20
    };
  } else if (pct < 45) {
    return {
      stage: "Casual Friend",
      stageVi: "Bạn Thân Thiết",
      stageJa: "友達",
      icon: "💛",
      badgeClass: "stage-casual-friend",
      desc: "Warm smiles & shared banter. Barriers dropping.",
      nextThreshold: 45
    };
  } else if (pct < 70) {
    return {
      stage: "Close Confidant",
      stageVi: "Tri Kỷ Tri Âm",
      stageJa: "親友",
      icon: "💖",
      badgeClass: "stage-close-confidant",
      desc: "Heart flutters & mutual trust. Private moments shared.",
      nextThreshold: 70
    };
  } else if (pct < 90) {
    return {
      stage: "Romantic Spark",
      stageVi: "Tình Cảm Chớm Nở",
      stageJa: "恋の予感",
      icon: "💘",
      badgeClass: "stage-romantic-spark",
      desc: "Unmistakable romantic tension & gentle blushes.",
      nextThreshold: 90
    };
  } else {
    return {
      stage: "Sweethearts",
      stageVi: "Người Yêu Đắm Say",
      stageJa: "恋人",
      icon: "💍",
      badgeClass: "stage-sweethearts",
      desc: "Devoted bond. Deep emotional intimacy and true love.",
      nextThreshold: 100
    };
  }
}
window.getRelationshipInfo = getRelationshipInfo;

function calculateAffectionGain(charId, mode = "starter", evalColor = "green") {
  const currentAff = userState.affection[charId] || 0;
  
  // 1. Natural Diminishing Returns Base Curve
  let baseGain = 2.2;
  if (currentAff >= 90) {
    baseGain = 0.35; // Final devoted stage requires intentional dedication
  } else if (currentAff >= 70) {
    baseGain = 0.65; // Romance stage: slow, tender build
  } else if (currentAff >= 45) {
    baseGain = 1.05; // Confidant stage
  } else if (currentAff >= 20) {
    baseGain = 1.5;  // Casual friend stage
  } else {
    baseGain = 2.2;  // Acquaintance stage
  }

  // 2. Input Mode Multiplier (Rewarding active effort)
  let modeMult = 1.0;
  if (mode === "free") modeMult = 1.35;
  else if (mode === "sentence") modeMult = 1.15;
  else modeMult = 1.0;

  // 3. Grammar Quality Bonus
  let qualityBonus = 0;
  if (evalColor === "green") qualityBonus = 0.25;
  else if (evalColor === "yellow") qualityBonus = 0.15;
  else if (evalColor === "red") qualityBonus = 0.05;

  const totalGain = (baseGain * modeMult) + qualityBonus;
  return Math.round(totalGain * 10) / 10;
}
window.calculateAffectionGain = calculateAffectionGain;

function showMilestoneToast(charName, newStageObj) {
  let toast = document.getElementById("milestoneToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "milestoneToast";
    toast.className = "milestone-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${newStageObj.icon}</span> <span>Relationship with <strong>${charName}</strong> is now <strong>${newStageObj.stage}</strong>!</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
window.showMilestoneToast = showMilestoneToast;

function increaseAffection(charId, amount = null, options = {}) {
  if (!charId) return;
  let normalizedId = charId;
  if (charId === "bao") normalizedId = "ado";
  if (charId === "julian") normalizedId = "kou";

  const prevAff = userState.affection[normalizedId] || 0;
  const prevStage = getRelationshipInfo(prevAff);

  let gain = 0;
  if (typeof amount === "number") {
    gain = Math.min(amount, 2.5);
  } else {
    const mode = options.mode || "starter";
    const evalColor = options.evalColor || "green";
    gain = calculateAffectionGain(normalizedId, mode, evalColor);
  }

  const newAff = Math.min(100, Math.round((prevAff + gain) * 10) / 10);
  userState.affection[normalizedId] = newAff;
  
  const newStage = getRelationshipInfo(newAff);
  if (newStage.stage !== prevStage.stage && newAff > prevAff) {
    const charName = CHARACTERS[normalizedId]?.name?.split(" ")[0] || normalizedId;
    showMilestoneToast(charName, newStage);
  }

  saveLocalState();
  renderCharactersList();
  renderChatList();

  // If active chatroom is open, update top header milestone badge
  if (activeCharacterId === normalizedId) {
    const headerAffection = document.getElementById("chatHeaderAffection");
    if (headerAffection) {
      headerAffection.innerHTML = `<span class="relationship-milestone-badge ${newStage.badgeClass}">${newStage.icon} ${newStage.stage} (${newAff}%)</span>`;
    }
  }
}
window.increaseAffection = increaseAffection;

// Hearts & Affection Increment
function addHearts(amount) {
  userState.totalHearts += amount;
  const heartsEl = document.getElementById("userHearts");
  if (heartsEl) heartsEl.textContent = userState.totalHearts;
  saveLocalState();
}

// Check Tier Level-Up (Disabled)
function checkTierLevelUp(charId) {
  triggerHeartBurst();
}

// Heart Particle Visual Animation
function triggerHeartBurst(customText = "❤️ +10") {
  const frame = document.getElementById("appFrame");
  const heart = document.createElement("div");
  heart.className = "heart-burst";
  heart.textContent = customText;
  heart.style.left = Math.random() * 60 + 20 + "%";
  heart.style.bottom = "120px";
  if (frame) frame.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
}

// Decrease Affection (Used for Failed Date Scenarios)
function decreaseAffection(charId, amount = 2.5) {
  if (!charId) return;
  let normalizedId = charId;
  if (charId === "bao") normalizedId = "ado";
  if (charId === "julian") normalizedId = "kou";

  const prevAff = userState.affection[normalizedId] || 0;
  const prevStage = getRelationshipInfo(prevAff);

  const penalty = Math.max(0.5, amount);
  const newAff = Math.max(0, Math.round((prevAff - penalty) * 10) / 10);
  userState.affection[normalizedId] = newAff;

  saveLocalState();
  renderCharactersList();
  renderChatList();

  const newStage = getRelationshipInfo(newAff);
  if (newStage.stage !== prevStage.stage && newAff < prevAff) {
    const charName = CHARACTERS[normalizedId]?.name?.split(" ")[0] || normalizedId;
    let toast = document.getElementById("milestoneToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "milestoneToast";
      toast.className = "milestone-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>💔</span> <span>Relationship with <strong>${charName}</strong> dropped to <strong>${newStage.stage}</strong> (${newAff}%)</span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
}
window.decreaseAffection = decreaseAffection;

// ==========================================
// STORY DATE SCENARIO GAMEPLAY ENGINE
// ==========================================

let activeStorySession = null;
let selectedScenarioForPartner = null;

function selectStoryCharacter(charId) {
  if (!charId) return;
  userState.selectedStoryChar = charId;
  saveLocalState();
  renderStoryMode();
}
window.selectStoryCharacter = selectStoryCharacter;

function openStoryPartnerSelect(scenarioId) {
  selectedScenarioForPartner = Number(scenarioId);
  if (typeof playVNSound === "function") playVNSound("click");
  renderStoryMode();
}
window.openStoryPartnerSelect = openStoryPartnerSelect;

function backToStoryScenarios() {
  selectedScenarioForPartner = null;
  if (typeof playVNSound === "function") playVNSound("click");
  renderStoryMode();
}
window.backToStoryScenarios = backToStoryScenarios;

function renderStoryMode() {
  const container = document.getElementById("view-story");
  if (!container) return;

  // 1. If in active gameplay, render VN visual novel gameplay screen
  if (activeStorySession) {
    renderStoryGameplay();
    return;
  }

  const availableChars = [
    { 
      id: "ado", 
      name: "Ado", 
      role: "Class Vice-President", 
      color: "pink", 
      avatar: "/assets/characters/ado_avatar.png",
      teasers: {
        1: "“Don't let your guard down during our library study session... I'm grading you!”",
        2: "“A coffee break together? Well, I suppose you've earned a short chat.”",
        3: "“The sunset along the riverbank... don't walk too fast, stay close.”",
        4: "“A festival together? Just don't let go of my hand in the crowd.”",
        5: "“Up here on the starlit roof... there's something important I need to tell you.”"
      }
    },
    { 
      id: "kou", 
      name: "Kou", 
      role: "Gentle Junior Artist", 
      color: "blue", 
      avatar: "/assets/characters/kou_avatar.png",
      teasers: {
        1: "“Senpai, look at these art books with me in the library corner!”",
        2: "“I ordered extra whipped cream on our lattes so we could share sweets!”",
        3: "“The breeze by the river is so refreshing... I want to sketch your smile.”",
        4: "“Can we watch the festival fireworks side by side, Senpai?”",
        5: "“Under the constellations on this rooftop... my heart is beating so fast.”"
      }
    },
    { 
      id: "ren", 
      name: "Ren", 
      role: "Charming Musician Senior", 
      color: "purple", 
      avatar: "/assets/characters/ren_avatar.png",
      teasers: {
        1: "“Whispering in the library stacks? That's my favorite secret melody.”",
        2: "“Rainy afternoon cafe date with warm espresso... perfect atmosphere with you.”",
        3: "“Golden hour river stroll with cherry blossoms drifting... truly romantic.”",
        4: "“Festival lights and firework bursts... none of them shine as bright as you.”",
        5: "“Starlight shining down on the rooftop... let me play a song just for your heart.”"
      }
    }
  ];

  // 2. If a Date Scenario Square was selected, render the LOVE INTEREST CHOICE SCREEN
  if (selectedScenarioForPartner) {
    const sc = STORY_SCENARIOS.find(s => s.id === selectedScenarioForPartner) || STORY_SCENARIOS[0];
    const bgKey = getScenarioBackgroundKey(sc.id);
    const bgSvg = (window.VN_SCENERY_SVGS && window.VN_SCENERY_SVGS[bgKey]) || "";

    const partnerCardsHtml = availableChars.map(c => {
      const cAff = (userState.affection && userState.affection[c.id]) || 10;
      const cRel = getRelationshipInfo(cAff);
      const cProgress = (userState.storyProgress && userState.storyProgress[c.id]) || {};
      const scRecord = cProgress[sc.id];
      const isCleared = scRecord && scRecord.passed;
      const teaserQuote = (c.teasers && c.teasers[sc.id]) || "“Let's embark on this memorable date together!”";

      return `
        <div class="story-partner-choice-card" onclick="startStoryScenario(${sc.id}, '${c.id}')">
          <div class="story-partner-avatar-wrap">
            <img src="${c.avatar}" onerror="this.onerror=null; this.src='/assets/characters/${c.id}_avatar.svg';" alt="${c.name}" class="story-partner-avatar-img" />
          </div>
          <div class="story-partner-char-name">${c.name}</div>
          <div class="story-partner-char-role">${c.role}</div>
          <div class="story-partner-aff-badge">
            <span>${cRel.icon} ${cRel.stage}</span>
            <span>•</span>
            <span>${cAff}% Affection</span>
          </div>
          <div class="story-partner-teaser-quote">${teaserQuote}</div>
          <button class="story-partner-select-start-btn" type="button">
            <span>${isCleared ? `Replay with ${c.name}` : `Date with ${c.name}`}</span>
            <span class="material-symbols-outlined" style="font-size:18px;">favorite</span>
          </button>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="story-partner-screen">
        <div class="story-partner-nav-bar">
          <button class="story-back-scenarios-btn" onclick="backToStoryScenarios()" type="button">
            <span class="material-symbols-outlined" style="font-size:18px;">arrow_back</span>
            <span>Back to All Date Scenarios</span>
          </button>
          <div class="story-hero-badge">STEP 2: SELECT YOUR LOVE INTEREST</div>
        </div>

        <div class="story-scenario-preview-card">
          <div class="story-scenario-preview-bg" style="background-image: url('${sc.bgImage || `/assets/scenarios/scenario_${sc.id}.jpg`}'), url('${bgSvg}');"></div>
          <div class="story-scenario-preview-info">
            <div class="story-square-level-tag" style="width: fit-content;">Level ${sc.level} Date</div>
            <div class="story-scenario-preview-title">
              <span>${sc.icon}</span>
              <span>${sc.title}</span>
            </div>
            <div class="story-scenario-preview-desc">${sc.description || sc.desc}</div>
            <div class="story-scenario-preview-tags">
              <span class="story-meta-tag">📍 ${sc.location}</span>
              <span class="story-meta-tag">🎭 ${sc.tone}</span>
              <span class="story-meta-tag">🎯 ${sc.totalQuestions || 7} Interactive Acts</span>
              <span class="story-meta-tag">🏆 Pass: ≥${sc.passingScore || 5}/${sc.totalQuestions || 7} Correct</span>
            </div>
          </div>
        </div>

        <div class="story-section-title" style="margin-top: 10px;">
          <span>Choose Your Date Partner:</span>
        </div>

        <div class="story-partner-cards-grid">
          ${partnerCardsHtml}
        </div>
      </div>
    `;
    return;
  }

  // 3. DEFAULT VIEW: DATE SCENARIOS AS SQUARE CAROUSEL
  const squaresHtml = STORY_SCENARIOS.map((sc, idx) => {
    const bgKey = getScenarioBackgroundKey(sc.id);
    const bgSvg = (window.VN_SCENERY_SVGS && window.VN_SCENERY_SVGS[bgKey]) || "";

    // Check if cleared by ANY character
    let clearedByAny = false;
    availableChars.forEach(c => {
      const cProg = (userState.storyProgress && userState.storyProgress[c.id]) || {};
      if (cProg[sc.id] && cProg[sc.id].passed) clearedByAny = true;
    });

    return `
      <div class="story-scenario-square ${clearedByAny ? 'passed' : ''}" data-scenario-idx="${idx}" onclick="openStoryPartnerSelect(${sc.id})" title="Click to choose partner and start ${sc.title}">
        <div class="story-square-backdrop" style="background-image: url('${sc.bgImage || `/assets/scenarios/scenario_${sc.id}.jpg`}'), url('${bgSvg}');"></div>
        <div class="story-square-gradient-overlay"></div>

        <div class="story-square-top-row">
          <div class="story-square-level-tag">Level ${sc.level}</div>
          <div class="story-square-status-pill ${clearedByAny ? 'cleared' : ''}">
            ${clearedByAny ? '✨ Cleared' : `⭐ ${sc.totalQuestions || 7} Questions`}
          </div>
        </div>

        <div class="story-square-center-icon">
          ${sc.icon}
        </div>

        <div class="story-square-bottom-content">
          <div class="story-square-title">${sc.title}</div>
          <div class="story-square-loc">📍 ${sc.location}</div>
          <div class="story-square-action-row">
            <span class="story-square-theme-tag">${sc.tone}</span>
            <div class="story-square-select-btn">
              <span>Choose Partner</span>
              <span class="material-symbols-outlined" style="font-size:14px;">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const futureScenarioCardHtml = `
    <div class="story-scenario-square locked-future-scenario-card" data-scenario-idx="5" onclick="openFutureScenarioModal()" title="Coming Soon: Future Expansion Scenarios">
      <div class="story-square-backdrop locked-scenario-dark-bg">
        <div class="locked-dark-backdrop"></div>
        <div class="locked-card-scrim"></div>
      </div>
      <div class="story-square-gradient-overlay"></div>

      <div class="story-square-top-row">
        <div class="story-square-level-tag locked-level-tag">Level 6+</div>
        <div class="story-square-status-pill locked-status-pill">
          <span class="material-symbols-outlined" style="font-size:13px; color:#a78bfa;">lock</span>
          <span>Coming Soon</span>
        </div>
      </div>

      <!-- Centered Glowing Dark Cross / Plus Emblem -->
      <div class="locked-cross-center">
        <div class="locked-cross-box">
          <span class="material-symbols-outlined locked-cross-glyph">add</span>
        </div>
        <span class="locked-cross-tag">Future Update</span>
      </div>

      <div class="story-square-bottom-content">
        <div class="story-square-title locked-name">Special Date Episodes</div>
        <div class="story-square-loc locked-role">📍 Secret Hot Springs &amp; Travel</div>
        <div class="story-square-action-row">
          <span class="story-square-theme-tag locked-snippet">Upcoming Romance Stories</span>
          <div class="story-square-select-btn locked-select-btn">
            <span>Expansion</span>
            <span class="material-symbols-outlined" style="font-size:14px;">lock</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="story-squares-wrapper">
      <div class="story-hub-hero">
        <div class="story-hero-badge">💕 VISUAL NOVEL DATE SCENARIOS</div>
        <h2 class="story-hero-title">Choose Your Date Scenario</h2>
        <p class="story-hero-subtitle">
          Swipe or scroll through the date settings below to begin your visual novel experience. 
          Pick a scenario, then choose which love interest (Ado, Kou, or Ren) to take on the date!
        </p>
      </div>

      <div class="messenger-section-header story-carousel-header">
       
        <div class="messenger-carousel-arrows">
          <button class="messenger-arrow-btn" id="storyCarouselPrev" type="button" aria-label="Previous date scenario" onclick="scrollStoryCarousel(-1)">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button class="messenger-arrow-btn" id="storyCarouselNext" type="button" aria-label="Next date scenario" onclick="scrollStoryCarousel(1)">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div class="messenger-carousel-outer story-carousel-outer">
        <div class="story-squares-carousel" id="storyCarouselContainer">
          ${squaresHtml}
          ${futureScenarioCardHtml}
        </div>
        <div class="messenger-carousel-indicators" id="storyCarouselIndicators">
          <!-- Dots populated dynamically -->
        </div>
      </div>
    </div>
  `;

  // Initialize carousel indicators & scroll listener
  setTimeout(() => {
    initStoryCarousel();
  }, 50);
}
window.renderStoryMode = renderStoryMode;

function initStoryCarousel() {
  const container = document.getElementById("storyCarouselContainer");
  const dotsContainer = document.getElementById("storyCarouselIndicators");
  if (!container || !dotsContainer) return;

  const cards = container.querySelectorAll(".story-scenario-square");
  if (!cards.length) return;

  dotsContainer.innerHTML = Array.from({ length: cards.length }).map((_, idx) => `
    <button class="carousel-dot ${idx === 0 ? 'active' : ''}" type="button" aria-label="Go to scenario ${idx + 1}" onclick="scrollToStoryCard(${idx})"></button>
  `).join("");

  container.removeEventListener("scroll", updateStoryCarouselIndicators);
  container.addEventListener("scroll", updateStoryCarouselIndicators, { passive: true });
  updateStoryCarouselIndicators();
}

function updateStoryCarouselIndicators() {
  const container = document.getElementById("storyCarouselContainer");
  const dotsContainer = document.getElementById("storyCarouselIndicators");
  if (!container || !dotsContainer) return;

  const cards = container.querySelectorAll(".story-scenario-square");
  if (!cards.length) return;

  const scrollLeft = container.scrollLeft;
  const containerWidth = container.clientWidth;
  const center = scrollLeft + containerWidth / 2;

  let activeIndex = 0;
  let minDistance = Infinity;

  cards.forEach((card, idx) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const dist = Math.abs(center - cardCenter);
    if (dist < minDistance) {
      minDistance = dist;
      activeIndex = idx;
    }
  });

  const dots = dotsContainer.querySelectorAll(".carousel-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeIndex);
  });

  const prevBtn = document.getElementById("storyCarouselPrev");
  const nextBtn = document.getElementById("storyCarouselNext");
  if (prevBtn) prevBtn.disabled = container.scrollLeft <= 5;
  if (nextBtn) nextBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;
}
window.updateStoryCarouselIndicators = updateStoryCarouselIndicators;

window.scrollStoryCarousel = function(direction) {
  const container = document.getElementById("storyCarouselContainer");
  if (!container) return;
  const cards = container.querySelectorAll(".story-scenario-square");
  if (!cards.length) return;
  const cardWidth = (cards[0].offsetWidth || 340) + 20;
  container.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
};

window.scrollToStoryCard = function(index) {
  const container = document.getElementById("storyCarouselContainer");
  if (!container) return;
  const cards = container.querySelectorAll(".story-scenario-square");
  if (cards[index]) {
    cards[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }
};

window.openFutureScenarioModal = function() {
  let modal = document.getElementById("futureScenarioModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "futureScenarioModal";
    modal.className = "locked-modal-backdrop";
    modal.onclick = function(e) {
      if (e.target === modal) window.closeFutureScenarioModal();
    };
    modal.innerHTML = `
      <div class="locked-modal-content">
        <div class="locked-modal-cross-wrap">
          <span class="material-symbols-outlined locked-modal-cross">add</span>
        </div>
        <h3 class="locked-modal-title">Upcoming Date Scenarios</h3>
        <p class="locked-modal-desc">
          Brand-new romantic destinations, interactive visual novel storylines, and seasonal events are currently in development for future updates!
        </p>
        <div class="locked-modal-features">
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">hot_tub</span>
            <span>Level 6: Starlit Mountain Hot Springs Getaway</span>
          </div>
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">attractions</span>
            <span>Level 7: Midnight Amusement Park &amp; Ferris Wheel</span>
          </div>
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">beach_access</span>
            <span>Level 8: Summer Beach House Vacation</span>
          </div>
          <div class="locked-modal-feat-item">
            <span class="material-symbols-outlined">videogame_asset</span>
            <span>Level 9: Rainy Arcade &amp; Purikura Photo Booth</span>
          </div>
        </div>
        <button class="locked-modal-close-btn" type="button" onclick="window.closeFutureScenarioModal()">
          <span>Got it! Stay Tuned</span>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
};

window.closeFutureScenarioModal = function() {
  const modal = document.getElementById("futureScenarioModal");
  if (modal) {
    modal.classList.remove("active");
  }
};


function getScenarioBackgroundKey(scenarioId) {
  switch (Number(scenarioId)) {
    case 1: return "library";
    case 2: return "cafe";
    case 3: return "riverbank";
    case 4: return "festival";
    case 5: return "rooftop";
    default: return "library";
  }
}

function getScenarioParticlesHtml(scenarioId) {
  const scId = Number(scenarioId);
  if (scId === 1) {
    // Library: floating golden dust motes
    return `
      <div class="vn-particles vn-particles-dust">
        <span class="vn-dust-dot d1"></span>
        <span class="vn-dust-dot d2"></span>
        <span class="vn-dust-dot d3"></span>
        <span class="vn-dust-dot d4"></span>
        <span class="vn-dust-dot d5"></span>
      </div>
    `;
  } else if (scId === 2) {
    // Cafe: animated window rain streaks & mist
    return `
      <div class="vn-particles vn-particles-rain">
        <span class="vn-rain-drop r1"></span>
        <span class="vn-rain-drop r2"></span>
        <span class="vn-rain-drop r3"></span>
        <span class="vn-rain-drop r4"></span>
        <span class="vn-rain-drop r5"></span>
      </div>
    `;
  } else if (scId === 3) {
    // Riverbank: drifting sakura petals
    return `
      <div class="vn-particles vn-particles-sakura">
        <span class="vn-petal p1">🌸</span>
        <span class="vn-petal p2">🌸</span>
        <span class="vn-petal p3">🌸</span>
        <span class="vn-petal p4">🌸</span>
      </div>
    `;
  } else if (scId === 4) {
    // Festival: glowing sparks & lantern embers
    return `
      <div class="vn-particles vn-particles-festival">
        <span class="vn-spark s1">✨</span>
        <span class="vn-spark s2">🏮</span>
        <span class="vn-spark s3">✨</span>
        <span class="vn-spark s4">🎆</span>
      </div>
    `;
  } else if (scId === 5) {
    // Rooftop: twinkling stars & celestial motes
    return `
      <div class="vn-particles vn-particles-stars">
        <span class="vn-star st1">✨</span>
        <span class="vn-star st2">⭐</span>
        <span class="vn-star st3">✨</span>
        <span class="vn-shooting-star"></span>
      </div>
    `;
  }
  return "";
}

function startStoryScenario(scenarioId, charId = null) {
  const chosenChar = charId || userState.selectedStoryChar || "ado";
  const scenario = STORY_SCENARIOS.find(s => s.id === scenarioId) || STORY_SCENARIOS[0];
  const targetLang = userState.targetLanguage || "vi";

  const questions = getScenarioQuestions(scenario.id, chosenChar, targetLang, userState.userProfile);

  activeStorySession = {
    scenarioId: scenario.id,
    charId: chosenChar,
    currentQuestionIdx: 0,
    score: 0,
    userAnswers: [],
    questions: questions,
    isAnsweringLocked: false,
    spriteEmotion: "normal",
    isUiHidden: false,
    showTranslation: true,
    dialogueHistory: []
  };

  playVNSound("click");
  renderStoryGameplay();

  // Play opening voice line for first question
  setTimeout(() => {
    if (activeStorySession && activeStorySession.questions[0]) {
      speakVNLine(activeStorySession.questions[0].promptDialogue, targetLang);
    }
  }, 400);
}
window.startStoryScenario = startStoryScenario;

function toggleVnBacklogModal(show = true) {
  const modal = document.getElementById("vnBacklogModal");
  if (!modal) return;
  modal.style.display = show ? "flex" : "none";
  playVNSound("click");
}
window.toggleVnBacklogModal = toggleVnBacklogModal;

function toggleVnUiVisibility() {
  if (!activeStorySession) return;
  activeStorySession.isUiHidden = !activeStorySession.isUiHidden;
  playVNSound("click");
  renderStoryGameplay();
}
window.toggleVnUiVisibility = toggleVnUiVisibility;

function toggleVnSubtitles() {
  if (!activeStorySession) return;
  activeStorySession.showTranslation = !activeStorySession.showTranslation;
  playVNSound("click");
  renderStoryGameplay();
}
window.toggleVnSubtitles = toggleVnSubtitles;

function playCurrentVnVoiceLine() {
  if (!activeStorySession) return;
  const session = activeStorySession;
  const currentQ = session.questions[session.currentQuestionIdx];
  const targetLang = userState.targetLanguage || "vi";
  if (currentQ && currentQ.promptDialogue) {
    speakVNLine(currentQ.promptDialogue, targetLang);
    // Subtle sprite reaction bounce
    const spriteEl = document.querySelector(".vn-stage-sprite-standee");
    if (spriteEl) {
      spriteEl.classList.remove("vn-sprite-bounce");
      void spriteEl.offsetWidth; // trigger reflow
      spriteEl.classList.add("vn-sprite-bounce");
    }
  }
}
window.playCurrentVnVoiceLine = playCurrentVnVoiceLine;

function reactToSpriteClick() {
  if (!activeStorySession) return;
  const session = activeStorySession;
  session.spriteEmotion = session.spriteEmotion === "blush" ? "happy" : "blush";
  playVNSound("heart");
  triggerHeartBurst("💖");
  playCurrentVnVoiceLine();
  renderStoryGameplay();
}
window.reactToSpriteClick = reactToSpriteClick;

function renderStoryGameplay() {
  const container = document.getElementById("view-story");
  if (!container || !activeStorySession) return;

  const session = activeStorySession;
  const scenario = STORY_SCENARIOS.find(s => s.id === session.scenarioId) || STORY_SCENARIOS[0];
  const charData = CHARACTERS[session.charId] || CHARACTERS.ado;
  const qIndex = session.currentQuestionIdx;
  const totalQ = session.questions.length || 7;
  const currentQ = session.questions[qIndex];
  const progressPct = Math.round(((qIndex) / totalQ) * 100);

  const bgKey = getScenarioBackgroundKey(scenario.id);
  const bgSvg = (window.VN_SCENERY_SVGS && window.VN_SCENERY_SVGS[bgKey]) || VN_SCENERY_SVGS.library;
  const currentEmotion = session.spriteEmotion || "normal";
  const primaryEmotionPng = `/assets/characters/${session.charId}/${currentEmotion}.png`;
  const normalPng = `/assets/characters/${session.charId}/normal.png`;
  const fullbodyPng = `/assets/characters/${session.charId}_fullbody.png`;
  const spriteSvg = (window.VN_SPRITES && window.VN_SPRITES[session.charId] && (window.VN_SPRITES[session.charId][currentEmotion] || window.VN_SPRITES[session.charId].normal)) || VN_SPRITES.ado.normal;
  const targetLang = userState.targetLanguage || "vi";

  // Check if current question has already been answered in this session
  const existingAns = session.userAnswers[qIndex];
  const isAnswered = existingAns !== undefined;
  const correctIdx = (currentQ.correctIdx !== undefined) ? currentQ.correctIdx : (currentQ.correctIndex !== undefined ? currentQ.correctIndex : 0);

  // Build choice cards HTML
  let optionsHtml = (currentQ.options || []).map((opt, idx) => {
    let optClass = "vn-choice-card";
    let statusPill = "";

    if (isAnswered) {
      if (idx === correctIdx) {
        optClass += " choice-correct";
        statusPill = `<span class="vn-choice-status-badge badge-correct">✓ Match (+1💖)</span>`;
      } else if (idx === existingAns.selectedIdx) {
        optClass += " choice-incorrect";
        statusPill = `<span class="vn-choice-status-badge badge-incorrect">✗ Miss</span>`;
      } else {
        optClass += " choice-disabled";
      }
    }

    const optTrans = opt.trans || opt.sub || "";

    return `
      <button class="${optClass}" onclick="handleStoryOptionSelect(${idx})" ${isAnswered ? 'disabled' : ''} type="button">
        <div class="vn-choice-letter-badge">${String.fromCharCode(65 + idx)}</div>
        <div class="vn-choice-body">
          <div class="vn-choice-text">${opt.text}</div>
          ${opt.phonetic ? `<div class="vn-choice-phonetic">${opt.phonetic}</div>` : ''}
          ${session.showTranslation && optTrans ? `<div class="vn-choice-trans">${optTrans}</div>` : ''}
        </div>
        ${statusPill}
      </button>
    `;
  }).join("");

  // Feedback explanation card
  let feedbackHtml = "";
  if (isAnswered) {
    const isCorrect = existingAns.isCorrect;
    const isLastQuestion = qIndex === totalQ - 1;
    feedbackHtml = `
      <div class="vn-feedback-overlay ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
        <div class="vn-feedback-header">
          <div class="vn-feedback-icon">${isCorrect ? '💖' : '💧'}</div>
          <div class="vn-feedback-title">
            <strong>${isCorrect ? 'Charming Response! (+1 Heart Point)' : 'Not Quite What They Hoped For'}</strong>
            <span class="vn-feedback-sub">${isCorrect ? `${charData.name} smiles warmly at your words.` : `${charData.name} looks a bit caught off guard.`}</span>
          </div>
        </div>
        <p class="vn-feedback-expl">${currentQ.explanation || 'Express genuine feelings and politeness.'}</p>
        <div class="vn-feedback-action">
          <button class="vn-next-act-btn" onclick="handleNextStoryQuestion()" type="button">
            <span>${isLastQuestion ? 'Complete Date & See Ending 🎉' : 'Next Scene (Act ' + (qIndex + 2) + ') →'}</span>
            <span class="material-symbols-outlined" style="font-size:18px;">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  // Emotion floating reaction badge above character head
  let emotionBubble = "";
  if (session.spriteEmotion === "blush") {
    emotionBubble = `<div class="vn-sprite-reaction-bubble blush">😳 💖</div>`;
  } else if (session.spriteEmotion === "happy") {
    emotionBubble = `<div class="vn-sprite-reaction-bubble happy">✨ 💖</div>`;
  }

  // Generate Backlog History items
  const backlogItemsHtml = session.dialogueHistory.length > 0 ? session.dialogueHistory.map((item, i) => `
    <div class="vn-backlog-item">
      <div class="vn-backlog-header">
        <span class="vn-backlog-act">Act ${i + 1}</span>
        <span class="vn-backlog-speaker ${item.charId === 'user' ? 'speaker-user' : 'speaker-li'}">${item.speaker}:</span>
      </div>
      <div class="vn-backlog-dialogue">${item.promptDialogue}</div>
      ${item.promptTrans ? `<div class="vn-backlog-trans">"${item.promptTrans}"</div>` : ''}
      <div class="vn-backlog-choice ${item.isCorrect ? 'choice-pass' : 'choice-miss'}">
        <span>Your Response: <strong>${item.userChoice}</strong> ${item.isCorrect ? '💖 (Correct)' : '⚠️'}</span>
      </div>
    </div>
  `).join("") : `<div class="vn-backlog-empty">No past acts in this date yet. Make your first choice!</div>`;

  const passReq = scenario.passingScore || 5;
  const heartsGaugeHtml = Array.from({ length: totalQ }).map((_, i) => 
    i < session.score ? `<span class="vn-heart-icon active">💖</span>` : `<span class="vn-heart-icon inactive">🤍</span>`
  ).join("");

  const currentDialogue = currentQ.promptDialogue || currentQ.partnerDialogue || "";
  const currentTrans = currentQ.promptTrans || currentQ.dialogueTrans || "";
  const currentSituation = currentQ.situation || currentQ.prompt || `Act ${qIndex + 1}/${totalQ}`;

  // Scaffolded interactive words in partner dialogue
  const wrappedDialogue = wrapInteractiveScaffoldWords(currentDialogue, targetLang);

  container.innerHTML = `
    <div class="vn-date-stage ${session.isUiHidden ? 'vn-cg-hidden-ui' : ''}" id="vnDateStage">
      <!-- Background Scenery Layer -->
      <div class="vn-stage-backdrop" style="background-image: url('${bgSvg}');">
        ${getScenarioParticlesHtml(scenario.id)}
      </div>

      <!-- Character Standee Sprite Layer -->
      <div class="vn-stage-sprite-container" onclick="reactToSpriteClick()" title="Tap ${charData.name} for voice & reactions">
        ${emotionBubble}
        <img src="${primaryEmotionPng}" onerror="if(this.src.endsWith('${currentEmotion}.png')){this.src='${normalPng}';}else if(this.src.endsWith('normal.png')){this.src='${fullbodyPng}';}else{this.src='${spriteSvg}';this.onerror=null;}" alt="${charData.name}" class="vn-stage-sprite-standee emotion-${currentEmotion} ${session.spriteEmotion === 'blush' ? 'sprite-blushing' : ''}" />

      </div>

      <!-- Top Visual Novel HUD Bar -->
      <div class="vn-hud-bar">
        <div class="vn-hud-left">
          <button class="vn-hud-btn vn-exit-btn" onclick="exitStoryGameplay(true)" type="button" title="Exit Date">
            <span class="material-symbols-outlined" style="font-size:16px;">arrow_back</span>
            <span>Exit</span>
          </button>
          <div class="vn-scene-badge">
            <span class="vn-scene-level">LVL ${scenario.level}</span>
            <span class="vn-scene-title">${scenario.icon} ${scenario.title}</span>
          </div>
        </div>

        <div class="vn-hud-center">
          <div class="vn-hearts-gauge" title="Affection Pass Gauge: ${session.score}/${passReq} Needed">
            <div class="vn-hearts-row">${heartsGaugeHtml}</div>
            <div class="vn-hearts-label">Score: <strong>${session.score}</strong> / ${totalQ} (${session.score >= passReq ? '✨ PASSING' : `${passReq} to Pass`})</div>
          </div>
        </div>

        <div class="vn-hud-right">
          <button class="vn-hud-btn" onclick="toggleVnBacklogModal(true)" type="button" title="Dialogue History Log">
            <span class="material-symbols-outlined" style="font-size:16px;">history_edu</span>
            <span>Log</span>
          </button>
          <button class="vn-hud-btn" onclick="toggleVnSubtitles()" type="button" title="Toggle Translations">
            <span class="material-symbols-outlined" style="font-size:16px;">translate</span>
            <span>${session.showTranslation ? 'Sub: ON' : 'Sub: OFF'}</span>
          </button>
          <button class="vn-hud-btn" onclick="toggleVnUiVisibility()" type="button" title="Hide UI / CG Mode">
            <span class="material-symbols-outlined" style="font-size:16px;">visibility_off</span>
            <span>CG</span>
          </button>
        </div>
      </div>

      <!-- Situation Cue Narrative Ribbon -->
      <div class="vn-scene-cue-ribbon">
        <span class="vn-cue-tag">📍 Act ${qIndex + 1}/${totalQ}</span>
        <span class="vn-cue-text">${currentSituation}</span>
      </div>

      <!-- Floating Visual Novel Choice Branches Tray -->
      <div class="vn-choices-tray ${isAnswered ? 'tray-locked' : ''}">
        <div class="vn-choices-tray-header">
          <span>💖 Choose Your Response to ${charData.name}:</span>
        </div>
        <div class="vn-choices-list">
          ${optionsHtml}
        </div>
      </div>

      <!-- Classic Visual Novel ADV Bottom Dialogue Textbox -->
      <div class="vn-adv-textbox">
        <div class="vn-adv-nameplate-row">
          <div class="vn-adv-nameplate char-${session.charId}">
            <span class="vn-nameplate-gem">💎</span>
            <span class="vn-nameplate-text">${charData.name}</span>
            <span class="vn-nameplate-role">(${charData.role || 'Love Interest'})</span>
          </div>

          <div class="vn-adv-controls">
            <button class="vn-voice-play-btn" onclick="playCurrentVnVoiceLine()" type="button" title="Listen to ${charData.name}'s voice">
              <span class="material-symbols-outlined" style="font-size:16px;">volume_up</span>
              <span>Voice</span>
            </button>
          </div>
        </div>

        <div class="vn-adv-dialogue-content">
          <div class="vn-adv-dialogue-text">
            ${wrappedDialogue}
          </div>
          ${session.showTranslation ? `
            <div class="vn-adv-dialogue-trans">
              "${currentTrans}"
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Feedback Overlay upon answering -->
      ${feedbackHtml}

      <!-- CG Mode Floating Hint (visible only when UI is hidden) -->
      <div class="vn-cg-overlay-hint" onclick="toggleVnUiVisibility()">
        <span>👁️ CG Viewing Mode • Tap anywhere to restore Visual Novel UI</span>
      </div>

      <!-- Dialogue Backlog History Modal -->
      <div class="vn-backlog-modal" id="vnBacklogModal" style="display:none;">
        <div class="vn-backlog-dialog">
          <div class="vn-backlog-dialog-header">
            <div class="vn-backlog-title">
              <span class="material-symbols-outlined">history_edu</span>
              <span>Dialogue Backlog • ${scenario.title}</span>
            </div>
            <button class="vn-backlog-close-btn" onclick="toggleVnBacklogModal(false)" type="button">✕</button>
          </div>
          <div class="vn-backlog-dialog-body">
            ${backlogItemsHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}
window.renderStoryGameplay = renderStoryGameplay;

function handleStoryOptionSelect(selectedIdx) {
  if (!activeStorySession || activeStorySession.isAnsweringLocked) return;
  
  const session = activeStorySession;
  const qIndex = session.currentQuestionIdx;
  const q = session.questions[qIndex];
  const charData = CHARACTERS[session.charId] || CHARACTERS.ado;
  
  const correctIdx = (q.correctIdx !== undefined) ? q.correctIdx : (q.correctIndex !== undefined ? q.correctIndex : 0);
  const isCorrect = selectedIdx === correctIdx;
  session.isAnsweringLocked = true;

  if (isCorrect) {
    session.score++;
    session.spriteEmotion = "happy";
    playVNSound("correct");
    triggerHeartBurst("💕 Charming Response!");
  } else {
    session.spriteEmotion = "sad";
    playVNSound("wrong");
  }

  const chosenOption = q.options[selectedIdx];
  const promptText = q.promptDialogue || q.partnerDialogue || "";
  const promptTrans = q.promptTrans || q.dialogueTrans || "";
  const optTrans = chosenOption.trans || chosenOption.sub || "";

  // Save answer
  session.userAnswers[qIndex] = {
    selectedIdx: selectedIdx,
    isCorrect: isCorrect
  };

  // Add to backlog history
  session.dialogueHistory.push({
    actIndex: qIndex + 1,
    charId: session.charId,
    speaker: charData.name,
    promptDialogue: promptText,
    promptTrans: promptTrans,
    userChoice: chosenOption.text + (optTrans ? ` (${optTrans})` : ''),
    isCorrect: isCorrect
  });

  renderStoryGameplay();
}
window.handleStoryOptionSelect = handleStoryOptionSelect;

function handleNextStoryQuestion() {
  if (!activeStorySession) return;
  const session = activeStorySession;
  const targetLang = userState.targetLanguage || "vi";
  
  playVNSound("click");

  if (session.currentQuestionIdx < session.questions.length - 1) {
    session.currentQuestionIdx++;
    session.isAnsweringLocked = false;
    session.spriteEmotion = "normal";
    renderStoryGameplay();

    // Auto voice current line
    setTimeout(() => {
      if (activeStorySession) {
        const nextQ = activeStorySession.questions[activeStorySession.currentQuestionIdx];
        if (nextQ) {
          const nextDialogue = nextQ.promptDialogue || nextQ.partnerDialogue;
          if (nextDialogue) speakVNLine(nextDialogue, targetLang);
        }
      }
    }, 300);
  } else {
    completeStoryScenario();
  }
}
window.handleNextStoryQuestion = handleNextStoryQuestion;

function completeStoryScenario() {
  const container = document.getElementById("view-story");
  if (!container || !activeStorySession) return;

  const session = activeStorySession;
  const scenario = STORY_SCENARIOS.find(s => s.id === session.scenarioId) || STORY_SCENARIOS[0];
  const charId = session.charId;
  const charData = CHARACTERS[charId] || CHARACTERS.ado;
  const score = session.score;
  const total = session.questions.length || 7;
  const passReq = scenario.passingScore || 5;
  const isPassed = score >= passReq;

  const bgKey = getScenarioBackgroundKey(scenario.id);
  const bgSvg = VN_SCENERY_SVGS[bgKey] || VN_SCENERY_SVGS.library;
  const endEmotion = isPassed ? 'happy' : 'sad';
  const primaryEndingPng = `/assets/characters/${charId}/${endEmotion}.png`;
  const normalEndingPng = `/assets/characters/${charId}/normal.png`;
  const fullbodyEndingPng = `/assets/characters/${charId}_fullbody.png`;
  const endSpriteSvg = (window.VN_SPRITES && window.VN_SPRITES[charId] && (window.VN_SPRITES[charId][endEmotion] || window.VN_SPRITES[charId].normal)) || VN_SPRITES.ado.normal;
  const targetLang = userState.targetLanguage || "vi";

  if (!userState.storyProgress) userState.storyProgress = {};
  if (!userState.storyProgress[charId]) userState.storyProgress[charId] = {};

  userState.storyProgress[charId][scenario.id] = {
    passed: isPassed,
    score: score,
    total: total,
    completedAt: Date.now()
  };

  const prevAff = userState.affection[charId] || 10;
  let newAff = prevAff;
  let penaltyOrGainText = "";

  if (isPassed) {
    playVNSound("clear");
    // Reward player with affection and hearts
    newAff = Math.min(100, Math.round((prevAff + scenario.affPassGain) * 10) / 10);
    userState.affection[charId] = newAff;
    userState.totalHearts += scenario.rewardHearts;
    penaltyOrGainText = `+${scenario.affPassGain}% Affection Gain & +${scenario.rewardHearts} 💖 Hearts`;
    triggerHeartBurst(`🎉 Date Passed! +${scenario.affPassGain}%`);
  } else {
    playVNSound("wrong");
    // Fail: Decrease relationship status
    newAff = Math.max(0, Math.round((prevAff - scenario.affFailPenalty) * 10) / 10);
    userState.affection[charId] = newAff;
    penaltyOrGainText = `-${scenario.affFailPenalty}% Relationship Affection Penalty`;
  }

  saveLocalState();
  renderCharactersList();
  renderChatList();

  const relInfo = getRelationshipInfo(newAff);
  const partnerDialogue = isPassed 
    ? (scenario.partnerReactionPass && (scenario.partnerReactionPass[charId] || scenario.partnerReactionPass.ado)) || "Hôm nay tuyệt vời lắm!" 
    : (scenario.partnerReactionFail && (scenario.partnerReactionFail[charId] || scenario.partnerReactionFail.ado)) || "Lần sau chúng mình cố gắng hơn nhé.";

  // Speak partner's ending quote
  setTimeout(() => {
    speakVNLine(partnerDialogue, targetLang);
  }, 400);

  container.innerHTML = `
    <div class="vn-date-stage vn-ending-stage">
      <!-- Background Scenery Layer -->
      <div class="vn-stage-backdrop" style="background-image: url('${bgSvg}');">
        ${getScenarioParticlesHtml(scenario.id)}
      </div>

      <!-- Large Ending Character Standee -->
      <div class="vn-stage-sprite-container vn-ending-sprite">
        <img src="${primaryEndingPng}" onerror="if(!this.dataset.step){this.dataset.step=1;this.src='${normalEndingPng}';}else if(this.dataset.step=='1'){this.dataset.step=2;this.src='${fullbodyEndingPng}';}else if(this.dataset.step=='2'){this.dataset.step=3;this.src='${endSpriteSvg}';}" alt="${charData.name}" class="vn-stage-sprite-standee emotion-${endEmotion}" />
      </div>

      <!-- Ending Card Overlay -->
      <div class="vn-ending-card-overlay ${isPassed ? 'ending-passed' : 'ending-failed'}">
        <div class="vn-ending-badge">
          <span>${isPassed ? '🏆 S-RANK ROMANTIC CLEAR' : '💔 AWKWARD MOMENT ENDING'}</span>
        </div>

        <h3 class="vn-ending-title">${isPassed ? `True Romance Clear with ${charData.name}!` : `Awkward Date with ${charData.name}`}</h3>
        
        <div class="vn-ending-score-pill">
          <span class="vn-score-num">${score} / ${total} Correct</span>
          <span class="vn-score-req">${isPassed ? `✨ Target Met (≥${passReq}/${total})` : `⚠️ ${passReq}/${total} Required to Pass`}</span>
        </div>

        <!-- Ending Partner Reaction Dialogue -->
        <div class="vn-ending-speech-box">
          <div class="vn-ending-speaker-row">
            <span class="vn-ending-speaker">${charData.name}:</span>
            <button class="vn-voice-play-btn mini" onclick="speakVNLine('${partnerDialogue.replace(/'/g, "\\'")}', '${targetLang}')" type="button">
              <span class="material-symbols-outlined" style="font-size:14px;">volume_up</span>
              <span>Voice</span>
            </button>
          </div>
          <p class="vn-ending-quote">"${partnerDialogue}"</p>
        </div>

        <!-- Relationship Status Delta -->
        <div class="vn-ending-stakes-delta ${isPassed ? 'delta-gain' : 'delta-loss'}">
          <strong>${isPassed ? '✨ Bond Deepened:' : '⚠️ Relationship Status Decreased:'}</strong>
          <div>${penaltyOrGainText}</div>
          <div style="font-size:12px; margin-top:4px; opacity:0.9;">Current Affection: <strong>${newAff}%</strong> (${relInfo.icon} ${relInfo.stage})</div>
        </div>

        <!-- Action Buttons -->
        <div class="vn-ending-actions">
          <button class="vn-ending-btn-primary" onclick="startStoryScenario(${scenario.id}, '${charId}')" type="button">
            <span class="material-symbols-outlined" style="font-size:18px;">refresh</span>
            <span>${isPassed ? 'Replay Date' : 'Retry Date Now'}</span>
          </button>
          
          ${isPassed && scenario.id < 5 ? `
            <button class="vn-ending-btn-next" onclick="startStoryScenario(${scenario.id + 1}, '${charId}')" type="button">
              <span>Next Level (${scenario.id + 1}) →</span>
            </button>
          ` : ''}

          <button class="vn-ending-btn-secondary" onclick="exitStoryGameplay(false)" type="button">
            <span>Back to Story Hub</span>
          </button>
        </div>
      </div>
    </div>
  `;

  activeStorySession = null;
}
window.completeStoryScenario = completeStoryScenario;

window.showVnExitConfirmModal = function() {
  let modal = document.getElementById("vnExitConfirmModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "vnExitConfirmModal";
    modal.className = "locked-modal-backdrop vn-exit-modal-backdrop";
    modal.onclick = function(e) {
      if (e.target === modal) window.closeVnExitConfirmModal();
    };
    modal.innerHTML = `
      <div class="locked-modal-content vn-exit-modal-content">
        <div class="vn-exit-modal-icon-wrap">
          <span class="material-symbols-outlined vn-exit-modal-icon">arrow_back</span>
        </div>
        <h3 class="locked-modal-title">Leave Date Scenario?</h3>
        <p class="locked-modal-desc">
          Are you sure you want to return to the Date Hub? Any unsaved score for this current date round will be reset.
        </p>
        <div class="vn-exit-modal-btn-row">
          <button type="button" class="vn-exit-stay-btn" onclick="window.closeVnExitConfirmModal()">
            <span>Stay on Date</span>
          </button>
          <button type="button" class="vn-exit-leave-btn" onclick="window.confirmExitStoryNow()">
            <span>Exit to Hub</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });
};

window.closeVnExitConfirmModal = function() {
  const modal = document.getElementById("vnExitConfirmModal");
  if (modal) {
    modal.classList.remove("active");
  }
};

window.confirmExitStoryNow = function() {
  window.closeVnExitConfirmModal();
  if (typeof playVNSound === "function") playVNSound("click");
  activeStorySession = null;
  renderStoryMode();
};

function exitStoryGameplay(confirmExit = true) {
  if (confirmExit && activeStorySession && activeStorySession.currentQuestionIdx < (activeStorySession.questions.length - 1)) {
    window.showVnExitConfirmModal();
    return;
  }
  if (typeof playVNSound === "function") playVNSound("click");
  activeStorySession = null;
  renderStoryMode();
}
window.exitStoryGameplay = exitStoryGameplay;

// ==========================================================================
// SCAFFOLDED LEARNING TOOLS: DICTIONARY, HOVER TOOLTIPS, PHONETICS, GRAMMAR DRAWER
// ==========================================================================

const SCAFFOLD_DICTIONARY = {
  vi: {
    "anh": { phonetic: "ănh [Level tone]", def: "Older male / romantic partner / you", note: "Used when addressing an older guy or romantic love interest." },
    "em": { phonetic: "em [Level tone]", def: "Younger person / sweetheart / me / you", note: "Sweet, affectionate way to address a younger partner or oneself." },
    "chị": { phonetic: "chị [Drop dot tone (Nặng)]", def: "Older female / older sister / you", note: "Respectful and affectionate term for an older female." },
    "tớ": { phonetic: "tớ [High rising tone (Sắc)]", def: "I / me (peer / classmate)", note: "Casual, friendly pronoun among classmates like Ado." },
    "cậu": { phonetic: "cậu [Drop dot tone (Nặng)]", def: "You (peer / classmate)", note: "Friendly address to equal-aged friends." },
    "nhóc": { phonetic: "nhóc [High rising tone (Sắc)]", def: "Kid / little one", note: "Playful teasing address used by seniors like Ren." },
    "tiền bối": { phonetic: "tiền bối [Low falling + High rising]", def: "Senior / Upperclassman", note: "Equivalent to Japanese 'Senpai'." },
    "senpai": { phonetic: "sen-pai", def: "Upperclassman / senior mentor", note: "Affectionate term for a respected senior." },
    "nhớ": { phonetic: "nhớ [High rising tone (Sắc)]", def: "To miss (someone) / to remember", note: "Ex: 'Nhớ em' = 'I miss you dearly'." },
    "thương": { phonetic: "thương [Level tone (Ngang)]", def: "To cherish / deeply care for & love", note: "Deeper than 'yêu'—expresses protective caring love." },
    "thích": { phonetic: "thích [High rising tone (Sắc)]", def: "To like / fond of", note: "Ex: 'Thích cậu' = 'I like you'." },
    "yêu": { phonetic: "yêu [Level tone (Ngang)]", def: "To love", note: "Classic romantic declaration of love." },
    "quan tâm": { phonetic: "quan tâm [Level tones]", def: "To care about / pay attention to", note: "Thoughtful affection." },
    "chăm chỉ": { phonetic: "chăm chỉ [Level + Dipping tone (Hỏi)]", def: "Diligent / hardworking", note: "Ex: 'Học chăm chỉ' = 'Study diligently'." },
    "học": { phonetic: "học [Drop dot tone (Nặng)]", def: "To study / to learn", note: "Essential school verb." },
    "chơi": { phonetic: "chơi [Level tone (Ngang)]", def: "To play / hang out", note: "Ex: 'Đi chơi' = 'Go out on a date / hang out'." },
    "rảnh": { phonetic: "rảnh [Dipping tone (Hỏi)]", def: "Free / available", note: "Ex: 'Có rảnh không?' = 'Are you free?'." },
    "uống": { phonetic: "uống [High rising tone (Sắc)]", def: "To drink", note: "Ex: 'Uống cà phê' = 'Drink coffee'." },
    "cà phê": { phonetic: "cà phê [Low falling + Level]", def: "Coffee", note: "Quintessential Vietnamese hangout date." },
    "trà": { phonetic: "trà [Low falling tone (Huyền)]", def: "Tea", note: "Calming beverage." },
    "chu đáo": { phonetic: "chu đáo [Level + High rising]", def: "Thoughtful / attentive", note: "Great compliment for a caring crush." },
    "nghiêm khắc": { phonetic: "nghiêm khắc [Level + High rising]", def: "Strict / rigorous", note: "Describes Ado's vice-president persona." },
    "dễ thương": { phonetic: "dễ thương [Tilde tone (Ngã) + Level]", def: "Cute / adorable", note: "High-frequency romantic compliment." },
    "đẹp trai": { phonetic: "đẹp trai [Drop dot + Level]", def: "Handsome / good looking", note: "Compliment for male love interests." },
    "ngoan": { phonetic: "ngoan [Level tone (Ngang)]", def: "Well-behaved / good / obedient", note: "Affectionate praise (ex: 'Ngoan lắm')." },
    "nhé": { phonetic: "nhé [High rising tone (Sắc)]", def: "Gentle sentence-ending particle ('okay?', 'please')", note: "Softens sentences and invites friendly agreement." },
    "nha": { phonetic: "nha [Level tone (Ngang)]", def: "Cute pleading particle ('promise?', 'okay?')", note: "Southern dialect, adds endearing warmth." },
    "ạ": { phonetic: "ạ [Drop dot tone (Nặng)]", def: "Polite reverent particle", note: "Placed at end of sentences to show respect to seniors." },
    "á": { phonetic: "á [High rising tone (Sắc)]", def: "Surprised / curious ending particle", note: "Ex: 'Thật á?' = 'Really?'" },
    "nhỉ": { phonetic: "nhỉ [Dipping tone (Hỏi)]", def: "Right? / Isn't it?", note: "Invites shared sentiment (ex: 'Đẹp nhỉ')." },
    "hả": { phonetic: "hả [Dipping tone (Hỏi)]", def: "Huh? / Really?", note: "Casual question tone." },
    "đấy": { phonetic: "đấy [High rising tone (Sắc)]", def: "There / that / emphatic particle", note: "Adds emphasis to advice or teasing." },
    "cảm ơn": { phonetic: "cảm ơn [Dipping tone + Level]", def: "Thank you", note: "Polite gratitude." },
    "xin lỗi": { phonetic: "xin lỗi [Level + Tilde tone (Ngã)]", def: "Sorry / excuse me", note: "Apology." },
    "chào": { phonetic: "chào [Low falling tone (Huyền)]", def: "Hello / greetings / goodbye", note: "Standard greeting." },
    "tạm biệt": { phonetic: "tạm biệt [Drop dot tones]", def: "Goodbye / farewell", note: "Parting phrase." }
  },
  ja: {
    "先輩": { phonetic: "せんぱい (Senpai)", def: "Senior / upperclassman", note: "Respectful and affectionate title for an upperclassman." },
    "ありがとう": { phonetic: "Arigatou", def: "Thank you", note: "Standard warm expression of gratitude." },
    "好き": { phonetic: "すき (Suki)", def: "Like / Fond of / Love", note: "Direct romantic expression of affection." },
    "お茶": { phonetic: "おちゃ (O-cha)", def: "Tea", note: "Traditional Japanese green tea." },
    "一緒": { phonetic: "いっしょ (Issho)", def: "Together", note: "Ex: 'Issho ni' = 'Together with'." },
    "可愛い": { phonetic: "かわいい (Kawaii)", def: "Cute / lovely", note: "Endearing compliment." },
    "嬉しい": { phonetic: "うれしい (Ureshii)", def: "Happy / glad", note: "Ex: 'Ohanashi dekite ureshii' = 'Glad to talk with you'." }
  },
  en: {
    "senpai": { phonetic: "sen-pai", def: "Senior student / mentor", note: "Upperclassman who guides and cares for you." },
    "classmate": { phonetic: "class-mate", def: "Peer in same grade", note: "Fellow student like Ado." },
    "sweetheart": { phonetic: "sweet-heart", def: "Beloved partner", note: "Affectionate term of endearment." },
    "notes": { phonetic: "nohts", def: "Study materials / summaries", note: "Ado's thoughtful study preparation for you." }
  }
};

function getScaffoldWordData(rawWord, lang = "vi") {
  if (!rawWord) return null;
  const cleanWord = rawWord.toLowerCase().trim().replace(/[.,!?:;"'()]/g, "");
  const dict = SCAFFOLD_DICTIONARY[lang] || SCAFFOLD_DICTIONARY.vi;
  return dict[cleanWord] || null;
}

function wrapInteractiveScaffoldWords(text, lang = "vi") {
  if (!text) return "";
  const dict = SCAFFOLD_DICTIONARY[lang] || SCAFFOLD_DICTIONARY.vi;
  
  // Split into tokens preserving punctuation and whitespace
  const tokens = text.split(/(\s+|[.,!?:;"'()]+)/);
  return tokens.map((tok) => {
    if (!tok || /^\s+$/.test(tok) || /^[.,!?:;"'()]+$/.test(tok)) {
      return tok;
    }
    const cleanTok = tok.toLowerCase().replace(/[.,!?:;"'()]/g, "").trim();
    const data = dict[cleanTok];
    if (data) {
      const defEsc = (data.def || "").replace(/"/g, "&quot;");
      const pronEsc = (data.phonetic || "").replace(/"/g, "&quot;");
      const noteEsc = (data.note || "").replace(/"/g, "&quot;");
      return `<span class="hover-trans-word" data-word="${tok}" data-def="${defEsc}" data-phonetic="${pronEsc}" data-note="${noteEsc}" tabindex="0" role="button">${tok}</span>`;
    }
    return tok;
  }).join("");
}
window.wrapInteractiveScaffoldWords = wrapInteractiveScaffoldWords;

// Global Floating Tooltip Engine
function initScaffoldTooltipEngine() {
  const tooltip = document.getElementById("scaffoldTooltip");
  if (!tooltip) return;

  function showTooltip(target, e) {
    const word = target.getAttribute("data-word") || target.textContent;
    const phonetic = target.getAttribute("data-phonetic") || "";
    const def = target.getAttribute("data-def") || "";
    const note = target.getAttribute("data-note") || "";

    if (!def && !phonetic) return;

    tooltip.innerHTML = `
      <div class="scaffold-tooltip-word">
        <span>${word}</span>
        ${phonetic ? `<span class="scaffold-tooltip-phonetic">${phonetic}</span>` : ""}
      </div>
      <div class="scaffold-tooltip-def">${def}</div>
      ${note ? `<div class="scaffold-tooltip-note">💡 ${note}</div>` : ""}
    `;

    const rect = target.getBoundingClientRect();
    const topPos = rect.top - 8;
    const leftPos = rect.left + (rect.width / 2);

    tooltip.style.top = `${Math.max(10, topPos)}px`;
    tooltip.style.left = `${Math.min(window.innerWidth - 130, Math.max(130, leftPos))}px`;
    tooltip.style.display = "block";
    tooltip.style.opacity = "1";
  }

  function hideTooltip() {
    tooltip.style.display = "none";
    tooltip.style.opacity = "0";
  }

  document.addEventListener("mouseenter", (e) => {
    const target = e.target.closest(".hover-trans-word");
    if (target) showTooltip(target, e);
  }, true);

  document.addEventListener("mouseleave", (e) => {
    const target = e.target.closest(".hover-trans-word");
    if (target) hideTooltip();
  }, true);

  document.addEventListener("click", (e) => {
    const target = e.target.closest(".hover-trans-word");
    if (target) {
      e.stopPropagation();
      showTooltip(target, e);
    } else if (!e.target.closest("#scaffoldTooltip")) {
      hideTooltip();
    }
  });
}

// 1. Phonetic & Tone Helper Pill Bar Engine
function togglePhoneticHelper(forceState) {
  const bar = document.getElementById("vnPhoneticsGuideBar");
  if (!bar) return;
  const isCurrentlyOpen = (bar.style.display === "flex" || (bar.style.display !== "none" && bar.style.display !== ""));
  const shouldOpen = (typeof forceState === "boolean") ? forceState : !isCurrentlyOpen;
  bar.style.display = shouldOpen ? "flex" : "none";
  if (shouldOpen) {
    renderPhoneticChips(activeCharacterId || "ado", userState.targetLanguage || "vi");
  }
}
window.togglePhoneticHelper = togglePhoneticHelper;

function renderPhoneticChips(charId, targetLang = "vi") {
  const container = document.getElementById("vnPhoneticChipsContainer");
  const title = document.getElementById("vnPhoneticsBarTitle");
  if (!container) return;

  container.innerHTML = "";

  if (targetLang === "ja") {
    if (title) title.textContent = "Japanese Romaji & Pitch Guide 🇯🇵";
    const jaChips = [
      { text: "Senpai", note: "Senior / Upperclassman", sym: "★" },
      { text: "Arigatou", note: "Thank you (Gratitude)", sym: "♡" },
      { text: "Suki desu", note: "I like you (Romance)", sym: "♥" },
      { text: "Issho ni", note: "Together with you", sym: "✦" },
      { text: "Kawaii", note: "Cute / Endearing", sym: "✿" },
      { text: "Ohanashi", note: "Conversation / Chat", sym: "♪" }
    ];
    jaChips.forEach((item) => {
      const chip = document.createElement("div");
      chip.className = "phonetic-chip-pill hover-trans-word";
      chip.setAttribute("data-word", item.text);
      chip.setAttribute("data-def", item.note);
      chip.setAttribute("data-phonetic", "Japanese Romaji");
      chip.innerHTML = `<span class="tone-symbol">${item.sym}</span> <span>${item.text}</span>`;
      chip.onclick = () => insertFormulaIntoChat(item.text);
      container.appendChild(chip);
    });
  } else if (targetLang === "en") {
    if (title) title.textContent = "English Pronunciation & Accent Guide 🇬🇧";
    const enChips = [
      { text: "Senpai", note: "Upperclassman mentor", sym: "★" },
      { text: "Hang out", note: "Spend time together", sym: "☕" },
      { text: "Thoughtful", note: "Caring & considerate", sym: "♡" },
      { text: "Study notes", note: "Prepared learning materials", sym: "📚" },
      { text: "Miss you", note: "Affectionate longing", sym: "♥" }
    ];
    enChips.forEach((item) => {
      const chip = document.createElement("div");
      chip.className = "phonetic-chip-pill hover-trans-word";
      chip.setAttribute("data-word", item.text);
      chip.setAttribute("data-def", item.note);
      chip.setAttribute("data-phonetic", "Stress marker");
      chip.innerHTML = `<span class="tone-symbol">${item.sym}</span> <span>${item.text}</span>`;
      chip.onclick = () => insertFormulaIntoChat(item.text);
      container.appendChild(chip);
    });
  } else {
    if (title) title.textContent = "Vietnamese 6 Tones & Vowel Guide 🇻🇳";
    const viChips = [
      { text: "Sắc (á) ↗", note: "High rising tone (e.g. nhớ, thích)", sym: "↗" },
      { text: "Huyền (à) ↘", note: "Low falling tone (e.g. cà phê, chào)", sym: "↘" },
      { text: "Hỏi (ả) ⤵", note: "Dipping hook tone (e.g. rảnh, cảm ơn)", sym: "⤵" },
      { text: "Ngã (ã) ~", note: "High broken glottal tone (e.g. dễ thương)", sym: "~" },
      { text: "Nặng (ạ) •", note: "Drop dot tone (e.g. đẹp, học, ạ)", sym: "•" },
      { text: "Ngang (a) —", note: "Level neutral tone (e.g. em, anh, ngoan)", sym: "—" },
      { text: "nhé / nha", note: "Gentle sweet ending particles", sym: "♡" },
      { text: "ạ", note: "Polite reverence to seniors", sym: "★" }
    ];
    viChips.forEach((item) => {
      const chip = document.createElement("div");
      chip.className = "phonetic-chip-pill hover-trans-word";
      chip.setAttribute("data-word", item.text);
      chip.setAttribute("data-def", item.note);
      chip.setAttribute("data-phonetic", "Vietnamese Tone");
      chip.innerHTML = `<span class="tone-symbol">${item.sym}</span> <span>${item.text}</span>`;
      container.appendChild(chip);
    });
  }
}
window.renderPhoneticChips = renderPhoneticChips;

// 2. Grammar Hints & Sentence Formula Drawer Engine
let currentGrammarCategory = "romance";

function toggleGrammarDrawer(forceState) {
  const drawer = document.getElementById("vnGrammarDrawer");
  if (!drawer) return;
  const isCurrentlyOpen = (drawer.style.display === "flex" || (drawer.style.display !== "none" && drawer.style.display !== ""));
  const shouldOpen = (typeof forceState === "boolean") ? forceState : !isCurrentlyOpen;
  drawer.style.display = shouldOpen ? "flex" : "none";
  if (shouldOpen) {
    renderGrammarDrawer(currentGrammarCategory);
  }
}
window.toggleGrammarDrawer = toggleGrammarDrawer;

function renderGrammarDrawer(category = "romance") {
  currentGrammarCategory = category;
  const body = document.getElementById("vnGrammarDrawerBody");
  if (!body) return;

  const targetLang = userState.targetLanguage || "vi";
  const { olderUserTerm, olderUserCap } = getUserVietnameseAddressTerms();

  body.innerHTML = `
    <div class="grammar-cat-bar">
      <button class="grammar-cat-btn ${category === 'romance' ? 'active' : ''}" onclick="renderGrammarDrawer('romance')">💖 Romance & Compliments</button>
      <button class="grammar-cat-btn ${category === 'polite' ? 'active' : ''}" onclick="renderGrammarDrawer('polite')">🙏 Polite Gratitude</button>
      <button class="grammar-cat-btn ${category === 'hangout' ? 'active' : ''}" onclick="renderGrammarDrawer('hangout')">☕ Dates & Hangouts</button>
      <button class="grammar-cat-btn ${category === 'teasing' ? 'active' : ''}" onclick="renderGrammarDrawer('teasing')">😏 Playful Teasing</button>
      <button class="grammar-cat-btn ${category === 'pronouns' ? 'active' : ''}" onclick="renderGrammarDrawer('pronouns')">👥 Pronoun Matrix</button>
      <button class="grammar-cat-btn ${category === 'particles' ? 'active' : ''}" onclick="renderGrammarDrawer('particles')">💬 Emotion Particles</button>
    </div>
    <div id="grammarCardsList" style="display:flex; flex-direction:column; gap:10px; margin-top:8px;"></div>
  `;

  const list = document.getElementById("grammarCardsList");

  if (category === "pronouns") {
    list.innerHTML = `
      <div class="grammar-formula-card">
        <div class="grammar-formula-header">
          <span class="grammar-formula-name">👥 Character Addressing Matrix</span>
          <span class="grammar-formula-badge">Essential Culture</span>
        </div>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.4;">
          Vietnamese pronouns dynamically reflect age hierarchy and chemistry:
        </p>
        <div class="pronoun-matrix-grid">
          <div class="pronoun-matrix-col">
            <span class="pronoun-col-title">Ado (Classmate)</span>
            <span class="pronoun-chip-tag">tớ (I/me)</span>
            <span class="pronoun-chip-tag">cậu (You)</span>
            <span class="pronoun-chip-tag">Ado ơi</span>
          </div>
          <div class="pronoun-matrix-col">
            <span class="pronoun-col-title">Kou (Junior)</span>
            <span class="pronoun-chip-tag">${olderUserTerm} (I/me)</span>
            <span class="pronoun-chip-tag">em / Kou (You)</span>
            <span class="pronoun-chip-tag">senpai</span>
          </div>
          <div class="pronoun-matrix-col">
            <span class="pronoun-col-title">Ren (Senior)</span>
            <span class="pronoun-chip-tag">em (I/me)</span>
            <span class="pronoun-chip-tag">anh / Ren (You)</span>
            <span class="pronoun-chip-tag">nhóc (teasing)</span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (category === "particles") {
    list.innerHTML = `
      <div class="grammar-formula-card">
        <div class="grammar-formula-header">
          <span class="grammar-formula-name">✨ Sentence-Ending Tone Modifiers</span>
          <span class="grammar-formula-badge">Emotional Scaffolding</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
          <div style="background:#f8fafc; padding:8px 10px; border-radius:8px;">
            <strong>nhé / nha:</strong> Softens statements into sweet invitations. <em>"Đi cà phê nhé?" (Let's grab coffee, okay?)</em>
          </div>
          <div style="background:#f8fafc; padding:8px 10px; border-radius:8px;">
            <strong>ạ:</strong> Expresses polite reverence to upperclassmen like Ren. <em>"Em chào anh ạ!" (Hello Senior!)</em>
          </div>
          <div style="background:#f8fafc; padding:8px 10px; border-radius:8px;">
            <strong>á / hả:</strong> Adds cute curiosity or playful surprise. <em>"Thật á? (Really?)"</em>
          </div>
          <div style="background:#f8fafc; padding:8px 10px; border-radius:8px;">
            <strong>đấy nhé:</strong> Gentle reminder / tsundere confirmation. <em>"Học chăm chỉ đấy nhé!"</em>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // General Category Formula Cards
  let formulas = [];
  if (category === "romance") {
    formulas = [
      {
        name: "Sweet Compliment Formula",
        badge: "Romance + Affection",
        pattern: "[Pronoun] + [chu đáo / dễ thương / đẹp trai] + quá à!",
        example: "Ado chu đáo quá à! / Anh Ren đẹp trai quá à!",
        trans: "You are so thoughtful / cute / handsome!",
        template: "chu đáo quá à!"
      },
      {
        name: "Affectionate Longing (Miss You)",
        badge: "Heart Flutter",
        pattern: "[Pronoun] + cũng rất nhớ + [Pronoun] + nè!",
        example: `${olderUserCap} cũng rất nhớ Kou nè!`,
        trans: "I miss you so much too!",
        template: "cũng rất nhớ nè!"
      },
      {
        name: "Protective Caring (Thương)",
        badge: "Deep Bond",
        pattern: "[Pronoun] + thương + [Pronoun] + nhiều lắm!",
        example: "Em thương anh nhiều lắm!",
        trans: "I cherish and care for you deeply!",
        template: "thương nhiều lắm!"
      }
    ];
  } else if (category === "polite") {
    formulas = [
      {
        name: "Heartfelt Gratitude with Particle",
        badge: "Polite Respect",
        pattern: "Cảm ơn + [Pronoun] + đã giúp đỡ + [Pronoun] + nhé!",
        example: "Cảm ơn Ado đã giúp đỡ tớ nhé!",
        trans: "Thank you for helping me!",
        template: "Cảm ơn đã giúp đỡ nhé!"
      },
      {
        name: "Promise to Strive / Study Hard",
        badge: "Diligence",
        pattern: "[Pronoun] + sẽ cố gắng học hành chăm chỉ!",
        example: "Tớ sẽ cố gắng học hành chăm chỉ!",
        trans: "I will study hard and do my best!",
        template: "sẽ cố gắng học hành chăm chỉ!"
      }
    ];
  } else if (category === "hangout") {
    formulas = [
      {
        name: "Coffee & Hangout Invitation",
        badge: "Date Request",
        pattern: "Hôm nào + [Pronoun] + đi uống cà phê với + [Pronoun] + nhé?",
        example: `Hôm nào Kou đi uống cà phê với ${olderUserTerm} nhé?`,
        trans: "Let's go drink coffee together sometime, okay?",
        template: "Hôm nào đi uống cà phê với nhau nhé?"
      },
      {
        name: "Checking Availability (Are you free?)",
        badge: "Icebreaker",
        pattern: "[Pronoun] + ơi, lúc này + [Pronoun] + có rảnh không?",
        example: "Ado ơi, lúc này cậu có rảnh không?",
        trans: "Hey, are you free right now?",
        template: "ơi, lúc này có rảnh không?"
      }
    ];
  } else if (category === "teasing") {
    formulas = [
      {
        name: "Playful Tsundere Pushback",
        badge: "Playful Banter",
        pattern: "[Pronoun] + đừng có mà + trêu chọc + [Pronoun] + nữa mà!",
        example: "Anh Ren đừng có mà trêu chọc em nữa mà!",
        trans: "Stop teasing me already!",
        template: "đừng có mà trêu chọc nữa mà!"
      },
      {
        name: "Proud Reassurance",
        badge: "Playful",
        pattern: "[Pronoun] + không phải là nhóc con đâu nhé!",
        example: "Em không phải là nhóc con đâu nhé!",
        trans: "I'm not a little kid, you know!",
        template: "không phải là nhóc con đâu nhé!"
      }
    ];
  }

  formulas.forEach((item) => {
    const card = document.createElement("div");
    card.className = "grammar-formula-card";
    card.innerHTML = `
      <div class="grammar-formula-header">
        <span class="grammar-formula-name">${item.name}</span>
        <span class="grammar-formula-badge">${item.badge}</span>
      </div>
      <div class="grammar-pattern-box">
        <code>${item.pattern}</code>
        <button class="grammar-formula-insert-btn" type="button">
          <span class="material-symbols-outlined" style="font-size:13px;">add_circle</span> Insert
        </button>
      </div>
      <div class="grammar-example-item">
        <strong>Ex:</strong> <em>${item.example}</em>
        <div class="grammar-example-trans">(${item.trans})</div>
      </div>
    `;

    card.querySelector(".grammar-formula-insert-btn").onclick = () => {
      insertFormulaIntoChat(item.example);
    };

    list.appendChild(card);
  });
}
window.renderGrammarDrawer = renderGrammarDrawer;

function insertFormulaIntoChat(textToInsert) {
  if (!textToInsert) return;

  // Switch to free text or insert into active box
  const freeBtn = document.getElementById("modeFreeTextBtn");
  if (freeBtn) freeBtn.click();

  const freeInput = document.getElementById("freeChatInput");
  if (freeInput) {
    freeInput.value = textToInsert;
    freeInput.focus();
    freeInput.classList.add("input-highlight-glow");
    setTimeout(() => freeInput.classList.remove("input-highlight-glow"), 1200);
  }

  toggleGrammarDrawer(false);
  triggerHeartBurst("💡 Inserted!");
}
window.insertFormulaIntoChat = insertFormulaIntoChat;

// Initialize Scaffold Tooltip Engine on startup
initScaffoldTooltipEngine();


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
  localStorage.setItem("otome_unlocked_modes", JSON.stringify(userState.unlockedModes || { ado: 1, kou: 1, ren: 1, group: 1 }));
  localStorage.setItem("otome_mode_progress", JSON.stringify(userState.modeProgress || { ado: 0, kou: 0, ren: 0, group: 0 }));
  localStorage.setItem("otome_input_mode", JSON.stringify(userState.selectedInputMode || {}));
  localStorage.setItem("otome_ui_lang", userState.uiLang || "en");
  localStorage.setItem("otome_user_profile", JSON.stringify(userState.userProfile || { name: "MC", pronouns: "she/her", age: "20" }));
  localStorage.setItem("otome_story_progress", JSON.stringify(userState.storyProgress || {}));
  localStorage.setItem("otome_story_char", userState.selectedStoryChar || "ado");
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

