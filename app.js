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
    apiKeyLabel: "Gemini API Key",
    keyActive: "Key Active",
    keyRequired: "Key Required",
    saveKeyBtn: "Save API Key",
    resetLabel: "Reset Story & Chat Progress",
    resetDesc: "Wipe all chat histories, reset affection levels back to initial nonchalant states, and restart story choices for a fresh experience.",
    resetBtn: "Reset All Story Progress & Replay",
    resetSuccess: "All story progress and chat histories have been reset!",
    tabChats: "Chats",
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
    tabChats: "Trò chuyện",
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
};

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
  
  // 1. Subdomain resolution support (e.g. chats.domain.com, guidebook.domain.com, settings.domain.com)
  if (hostname.startsWith("chats.") || hostname.startsWith("chat.")) {
    return { view: "chats" };
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

  currentGuidebookLang = lang;

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

function updateFloatingCompanion(charId, quoteOverride = null, mood = null) {
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

  let spriteSrc = char.sprite || `/assets/characters/${normalizedId}_fullbody.png`;
  let archetypeText = char.archetype || char.role || "Love Interest";
  if (normalizedId === "ado") {
    spriteSrc = char.sprite || "/assets/characters/ado_fullbody.png";
    archetypeText = "Strict Classmate";
  } else if (normalizedId === "kou") {
    spriteSrc = char.sprite || "/assets/characters/kou_fullbody.png";
    archetypeText = "Cute Junior";
  } else if (normalizedId === "ren") {
    spriteSrc = char.sprite || "/assets/characters/ren_fullbody.png";
    archetypeText = "Flirty Senior";
  }

  if (desktopSprite) {
    desktopSprite.onerror = function() {
      if (this.src.endsWith("_fullbody.png")) {
        // Try capitalized single name e.g. Ado.png or SVG placeholder
        const capName = normalizedId.charAt(0).toUpperCase() + normalizedId.slice(1);
        this.src = `/assets/characters/${capName}.png`;
      } else if (this.src.endsWith(".png")) {
        this.src = `/assets/characters/${normalizedId}_fullbody.svg`;
      }
    };
    desktopSprite.src = spriteSrc;
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

  triggerHeartBurst();
  increaseAffection(normalizedId, 1);
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

// Render Chatrooms List
function renderChatList() {
  const container = document.getElementById("chatListContainer");
  if (!container) return;
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const affectionPct = userState.affection[char.id] || 0;
    const unreadCount = userState.unreadMessages[char.id] || 0;
    const isPout = userState.isPouting[char.id] || false;

    const history = userState.chatHistories[char.id] || [];
    const lastMsg = history.length > 0 ? history[history.length - 1].text : char.greeting;

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
        ${badgeHtml ? badgeHtml : `<span class="square-affection-pill"><span class="material-symbols-outlined" style="font-size:12px; color:var(--primary-pink);">favorite</span> ${affectionPct}%</span>`}
      </div>

      <div class="square-card-bottom-info">
        <div class="square-char-name">
          <span>${char.name}</span>
          <span class="flag-icon">${char.flag}</span>
        </div>
        <div class="square-char-role">${char.archetype || char.role}</div>
        <div class="square-action-row">
          <span class="square-snippet">${isPout ? 'Waiting for reply...' : (lastMsg || 'Tap to chat')}</span>
          <button class="square-chat-btn" type="button" aria-label="Chat with ${char.name}" onclick="event.stopPropagation(); openChatroom('${char.id}');">
            <span class="material-symbols-outlined">chat</span>
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
        <span class="square-affection-pill">
          <span class="material-symbols-outlined" style="font-size:12px; color:var(--primary-pink);">favorite</span>
          ${affectionPct}%
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

        <div class="vocab-category-title">📚 Strict & Reliable Classmate Vocab (Ado)</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Study schedule / Notes</span>
              <span class="vocab-trans">Lịch học / Tài liệu ôn tập</span>
            </div>
            <span class="vocab-tip">Ex: "I prepared the study notes for you!"</span>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Duty / Responsibility</span>
              <span class="vocab-trans">Trách nhiệm / Bổn phận</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Secretly caring (Tsundere)</span>
              <span class="vocab-trans">Quan tâm âm thầm / Ngoài lạnh trong nóng</span>
            </div>
          </div>
        </div>

        <div class="vocab-category-title">🥺 Cute & Clingy Underclassman Vocab (Kou)</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Affectionate Senior (Anh / Chị)</span>
              <span class="vocab-trans">Anh / Chị (Cách xưng hô thân mật)</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Looking for you / Clingy</span>
              <span class="vocab-trans">Tìm kiếm / Bám dính đáng yêu</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Spending time together</span>
              <span class="vocab-trans">Dành thời gian bên nhau</span>
            </div>
          </div>
        </div>

        <div class="vocab-category-title">😏 Flirty & Assertive Senior Vocab (Ren)</div>
        <div class="vocab-list">
          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Daydreaming about me</span>
              <span class="vocab-trans">Mơ màng nghĩ đến anh</span>
            </div>
          </div>

          <div class="vocab-item">
            <div class="vocab-item-row">
              <span class="vocab-term">Sit close to me / Teasing</span>
              <span class="vocab-trans">Ngồi gần anh / Trêu ghẹo quyến rũ</span>
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
function openChatroom(charId, updateUrl = true) {
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

  const tierObj = TIERS[0];
  const affectionPct = userState.affection[charId] || 0;

  // Set Chat Header Info
  const headerName = document.getElementById("chatHeaderName");
  if (headerName) headerName.innerHTML = `${char.name} <span>${char.flag}</span>`;
  const headerAvatar = document.getElementById("chatHeaderAvatar");
  if (headerAvatar) headerAvatar.src = char.avatar;
  const headerAffection = document.getElementById("chatHeaderAffection");
  if (headerAffection) headerAffection.textContent = "❤️";

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

// Klipy GIF API Helper Function
async function fetchKlipyGif(query, characterId) {
  try {
    let q = (query || "").trim();
    if (!q) {
      if (characterId === "bao") q = "funny coffee meme";
      else if (characterId === "julian") q = "shrek reaction meme";
      else if (characterId === "ren") q = "ishowspeed reaction meme";
      else q = "trending meme reaction";
    }

    const res = await fetch(`/api/klipy-gif?q=${encodeURIComponent(q)}&characterId=${characterId || ""}&limit=8`);
    if (!res.ok) return null;
    const json = await res.json();

    if (json.success && json.randomGif && json.randomGif.url) {
      return json.randomGif.url;
    }
    if (json.success && json.gifs && json.gifs.length > 0) {
      return json.gifs[Math.floor(Math.random() * json.gifs.length)].url;
    }
    return null;
  } catch (e) {
    console.warn("fetchKlipyGif error:", e);
    return null;
  }
}
window.fetchKlipyGif = fetchKlipyGif;

// Render Chat History Messages
let currentVnSpeechText = "";
let currentVnSpeechLang = "vi-VN";

function updateVnDialogueBox(latestLiMsg, char) {
  // 1. Floating Speech Bubble on Top of the Love Interest
  const bubbleEl = document.getElementById("companionSpeechBubble");
  const speakerNameEl = document.getElementById("companionSpeakerName");
  const speechTextEl = document.getElementById("companionSpeechText");
  const bubbleRomajiEl = document.getElementById("companionSpeechRomaji");
  const bubbleGifWrapperEl = document.getElementById("companionSpeechGifWrapper");
  const bubbleGifImgEl = document.getElementById("companionSpeechGif");

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

  // Update center floating guy sprite in background!
  if (centerSprite) {
    let spriteSrc = `/assets/characters/${speakerId}_fullbody.png`;
    centerSprite.onerror = function() {
      if (this.src.endsWith("_fullbody.png")) {
        const capName = speakerId.charAt(0).toUpperCase() + speakerId.slice(1);
        this.src = `/assets/characters/${capName}.png`;
      } else if (this.src.endsWith(".png")) {
        this.src = `/assets/characters/${speakerId}_fullbody.svg`;
      }
    };
    centerSprite.src = spriteSrc;
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
  if (speechTextEl) speechTextEl.textContent = text || "";

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

  // GIF inside speech bubble
  if (bubbleGifWrapperEl && bubbleGifImgEl) {
    if (latestLiMsg && latestLiMsg.gifUrl) {
      bubbleGifImgEl.src = latestLiMsg.gifUrl;
      bubbleGifWrapperEl.style.display = "block";
    } else {
      bubbleGifWrapperEl.style.display = "none";
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

  // Trigger slight animation bounce on character when speaking
  if (spriteWrapper) {
    spriteWrapper.classList.remove("vn-talk-bounce");
    void spriteWrapper.offsetWidth;
    spriteWrapper.classList.add("vn-talk-bounce");
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

  history.forEach((msg) => {
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

      if (msg.isGifOnly || (!msg.text && msg.gifUrl)) {
        // Pure standalone GIF message without container box wrapper
        group.innerHTML = `
          <img src="${speakerAvatar}" class="msg-avatar" alt="${speakerName}" />
          <div class="msg-body">
            <div class="msg-sender" ${speakerStyle}>${speakerName}</div>
            <img src="${msg.gifUrl}" alt="Klipy GIF" class="standalone-gif-img" style="max-width:240px; width:100%; height:auto; border-radius:16px; display:block; box-shadow:0 4px 14px rgba(0,0,0,0.12); border:none; margin-top:2px;" loading="lazy" />
            <div class="msg-time">${msg.time || ""}</div>
          </div>
        `;
      } else {
        const romajiHtml = (msg.romaji && showRomaji)
          ? `<div class="romaji-text" style="font-size:12.5px; color:var(--accent-violet); font-weight:700; margin-top:4px; margin-bottom:2px; background:rgba(124, 58, 237, 0.08); border:1px solid rgba(124, 58, 237, 0.2); padding:3px 8px; border-radius:6px; display:inline-block;">${cleanEmojiText(msg.romaji)}</div>`
          : "";

        const gifHtml = msg.gifUrl
          ? `<img src="${msg.gifUrl}" alt="Klipy GIF" class="standalone-gif-img" style="max-width:240px; width:100%; height:auto; border-radius:14px; display:block; margin-top:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" loading="lazy" />`
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
              <div style="font-size:15px; font-weight:700;">${cleanEmojiText(msg.text)}</div>
              ${gifHtml}
              ${romajiHtml}
              ${(msg.translation || msg.tip || msg.fix) ? `<button type="button" class="assist-toggle-btn">Translation & Tips</button>` : ''}
              ${msg.translation ? `<div class="translation-text">${cleanEmojiText(msg.translation)}</div>` : ""}
              ${msg.tip ? `<div class="tip-card ${colorClass}"><div class="tip-title ${colorClass}">${tipTitleText}</div>${cleanEmojiText(msg.tip)}</div>` : ""}
              ${msg.fix ? `<div class="fix-card ${colorClass}"><div class="fix-title ${colorClass}">${cleanEmojiText(msg.fix)}</div>${cleanEmojiText(msg.fix)}</div>` : ""}
            </div>
            <div class="msg-time">${msg.time || "11:42 PM"}</div>
          </div>
        `;
      }
    } else {
      if (msg.isGifOnly || ((!msg.text || msg.text === "[Sent a GIF 🖼️]") && msg.gifUrl)) {
        // Pure standalone GIF message for user without container box wrapper
        group.innerHTML = `
          <div class="msg-body" style="align-items:flex-end;">
            <img src="${msg.gifUrl}" alt="Klipy GIF" class="standalone-gif-img" style="max-width:240px; width:100%; height:auto; border-radius:16px; display:block; box-shadow:0 4px 14px rgba(0,0,0,0.12); border:none; margin-top:2px;" loading="lazy" />
            <div class="msg-time">${msg.time || ""}</div>
          </div>
        `;
      } else {
        const userGifHtml = msg.gifUrl
          ? `<img src="${msg.gifUrl}" alt="Klipy GIF" class="standalone-gif-img" style="max-width:240px; width:100%; height:auto; border-radius:14px; display:block; margin-top:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" loading="lazy" />`
          : "";

        group.innerHTML = `
          <div class="msg-body">
            <div class="msg-bubble">
              <div>${cleanEmojiText(msg.text)}</div>
              ${userGifHtml}
            </div>
            <div class="msg-time">${msg.time || "11:42 PM"}</div>
          </div>
        `;
      }
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
  increaseAffection(charId, 10);
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
    // Only fetch/send a GIF ONCE IN A WHILE (~20% chance) or if user explicitly asked for a GIF
    const userWantsGif = /gif|meme|photo|picture|shrek|speed/i.test(userText || "");
    const shouldSendGif = userWantsGif || (responseData.gifQuery && Math.random() < 0.22);

    let responseGifUrl = null;
    if (shouldSendGif) {
      responseGifUrl = await fetchKlipyGif(responseData.gifQuery || null, charId);
    }

    showGrammarFeedback(
      responseData.evalColor,
      responseData.isCorrect !== false,
      responseData.correction || responseData.fix,
      responseData.tip,
      responseData.encouragement
    );

    const history = userState.chatHistories[charId] || [];

    history.push({
      sender: "li",
      text: responseData.characterResponse || responseData.text || "Chào bạn nha! Rất vui được gặp! ❤️",
      romaji: responseData.romaji || null,
      translation: responseData.translation || "Hello! So happy to talk with you! ❤️",
      tip: responseData.tip || "Keep practicing your conversation skills!",
      fix: responseData.correction || responseData.fix || null,
      evalColor: responseData.evalColor || "green",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    // Send GIF as a SEPARATE message entry if triggered
    if (responseGifUrl) {
      history.push({
        sender: "li",
        isGifOnly: true,
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

    // Update Floating Companion with recent response & mood
    const companionQuote = responseData.characterResponse || null;
    updateFloatingCompanion(charId, companionQuote, responseData.evalColor === "green" ? "Blushing & Impressed 💕" : "Observing carefully ✨");

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

// Spontaneous LI Check-Up messaging loop disabled per user request
function startCheckUpAndPoutEngine() {
  // Disabled: Characters do not text the user first
}

// Show In-App Top Banner Notification Toast disabled per user request
function showNotificationToast(char, msgText, isPout = false) {
  // Disabled: No notification toasts
}

// Check Tier Level-Up (Disabled)
function checkTierLevelUp(charId) {
  triggerHeartBurst();
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
  localStorage.setItem("otome_unlocked_modes", JSON.stringify(userState.unlockedModes || { ado: 1, kou: 1, ren: 1, group: 1 }));
  localStorage.setItem("otome_mode_progress", JSON.stringify(userState.modeProgress || { ado: 0, kou: 0, ren: 0, group: 0 }));
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
  const initialQuery = defaultQuery || (charId === "bao" ? "funny coffee meme" : charId === "julian" ? "shrek meme" : charId === "ren" ? "ishowspeed meme" : "trending meme");

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
  const query = input ? input.value.trim() : "shrek meme";
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
      json.gifs.forEach((gif, index) => {
        const item = document.createElement("div");
        const isFeatured = (index === 0 || index === 5);
        item.className = isFeatured ? "bento-card bento-card-featured" : "bento-card";
        item.innerHTML = `
          <img src="${gif.url}" alt="${gif.title}" class="bento-card-img" loading="lazy" />
          <div class="bento-card-overlay">
            <span class="bento-card-title">${gif.title || 'Klipy GIF'}</span>
          </div>
        `;
        item.onclick = () => { sendUserKlipyGif(gif.url, gif.title); };
        grid.appendChild(item);
      });
    } else {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">No GIFs found on Klipy for "${query}". Try searching "shrek", "ishowspeed", or "memes"!</div>`;
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
    isGifOnly: true,
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

    // 25% chance LI also sends a reaction GIF
    const liReactionGif = (Math.random() < 0.25) ? await fetchKlipyGif("funny reaction meme", charId) : null;

    let reactionText = "Aww! What a funny GIF! You always know how to make me laugh! 😂❤️";
    let reactionTrans = "Aww! What a funny GIF! You always know how to make me laugh! 😂❤️";
    const targetLang = userState.targetLanguage || "vi";

    if (charId === "bao") {
      if (targetLang === "vi") {
        reactionText = "Trời ơi! GIF em gửi buồn cười xỉu luôn! 🤣 Làm anh muốn pha cho em ly cà phê hình trái tim liền nè! ☕❤️";
        reactionTrans = "Oh my goodness! The GIF you sent is hilarious! 🤣 Makes me want to brew you a heart-latte right away! ☕❤️";
      } else {
        reactionText = "Aww! That GIF you sent is hilarious! 🤣 It makes me want to brew a special heart-latte for you right now! ☕❤️";
        reactionTrans = "Aww! That GIF you sent is hilarious! 🤣 It makes me want to brew a special heart-latte for you right now!";
      }
    } else if (charId === "julian") {
      if (targetLang === "en") {
        reactionText = "Ah, what a delightful and witty GIF! You truly bring joy to my day, MC. ✨";
        reactionTrans = "Ah, what a delightful and witty GIF! You truly bring joy to my day, MC. ✨";
      } else {
        reactionText = "Thật là một GIF vô cùng hài hước! Em luôn biết cách khiến anh mỉm cười đó, MC. ✨";
        reactionTrans = "What an incredibly funny GIF! You always know how to make me smile, MC. ✨";
      }
    }

    userState.chatHistories[charId].push({
      sender: "li",
      text: reactionText,
      translation: reactionTrans,
      tip: "Sending memes & GIFs boosts affection!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (liReactionGif) {
      userState.chatHistories[charId].push({
        sender: "li",
        isGifOnly: true,
        gifUrl: liReactionGif,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    lastLiCheckupTime[charId] = Date.now();
    lastMessageWasLi[charId] = true;
    userState.affection[charId] = Math.min(100, (userState.affection[charId] || 0) + 5);

    renderChatHistory();
    saveLocalState();
    renderChatList();
  }, 1200);
}
window.sendUserKlipyGif = sendUserKlipyGif;
