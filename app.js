/**
 * Otome Lingua - App Logic Engine
 * Duolingo competitor disguised as Mystic Messenger Otome Sim
 * Features 10-Tier progression, Gemma 4 OpenRouter LLM, Convex Sync & Secret Telemetry Dashboard
 */

// Global Configuration
const CONVEX_HTTP_SITE = "https://wary-reindeer-174.convex.site";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

// Character Definitions (Pure Target Language Greetings - Concise for Beginners)
const CHARACTERS = {
  ren: {
    id: "ren",
    name: "Ren Takahashi",
    language: "Japanese",
    flag: "🇯🇵",
    avatar: "/src/assets/images/default_avatar.svg",
    role: "Upperclassman & Musician",
    personality: "Cool, quiet upperclassman and guitarist. Starts calm and nonchalant, but grows warm and attentive as you talk.",
    greeting: "あ、こんにちは。何か用ですか？",
    romaji: "A, konnichiwa. Nani ka you desu ka?",
    greetingTranslation: "Ah, hello. Did you need something?",
    greetingTip: "'Nani ka you desu ka?' means 'Did you need something?' in a calm, neutral tone.",
    sampleVoice: "Gentle Japanese tenor",
  },
  bao: {
    id: "bao",
    name: "Bao Nguyen",
    language: "Vietnamese",
    flag: "🇻🇳",
    avatar: "/src/assets/images/default_avatar.svg",
    role: "Artisan Chef & Barista",
    personality: "Laid-back, nonchalant barista. Starts cool and casual, but gets intrigued as you chat in Vietnamese.",
    greeting: "Chào em. Em muốn gọi món gì không?",
    greetingTranslation: "Hello. Would you like to order anything?",
    greetingTip: "'Em muốn gọi món gì không?' is a standard way to ask for an order.",
    sampleVoice: "Warm energetic baritone",
  },
  julian: {
    id: "julian",
    name: "Julian Vance",
    language: "English",
    flag: "🇬🇧",
    avatar: "/src/assets/images/default_avatar.svg",
    role: "Literature Scholar & Architect",
    personality: "Composed, intellectual scholar. Starts reserved, but gets charmed as you chat.",
    greeting: "Good day. Did you need something?",
    greetingTranslation: "Good day. Did you need something?",
    greetingTip: "'Good day' is a polite formal greeting.",
    sampleVoice: "Refined British scholar",
  }
};

// Progressive Story Trees for Dynamic Story Evolution (Concise phrases for beginner learners)
const STORY_TREES = {
  ren: {
    mcStages: [
      {
        greeting: "あ、こんにちは。何か用ですか？",
        romaji: "A, konnichiwa. Nani ka you desu ka?",
        greetingTranslation: "Ah, hello. Did you need something?",
        greetingTip: "'Nani ka you desu ka?' (何か用ですか) means 'Did you need something?'.",
        options: [
          { text: "Konnichiwa, Ren-san. O-jama desu ka?", hint: "Hello Ren. Am I bothering you?" },
          { text: "Ren-san no guitar, kikitai desu.", hint: "I'd like to hear your guitar playing." },
          { text: "Kyou wa nihongo wo renshuu shitai desu!", hint: "I want to practice Japanese today!" }
        ]
      },
      {
        greeting: "邪魔じゃないですよ。少し話しをしましょう。",
        romaji: "Jama ja nai desu yo. Sukoshi hanashi wo shimashou.",
        greetingTranslation: "You're not bothering me. Let's talk a little bit.",
        greetingTip: "'Jama ja nai' (邪魔じゃない) means 'not in the way / not bothering'.",
        options: [
          { text: "Arigatou gozaimasu! Ren-san, kirei desu ne.", hint: "Thank you! Ren, that sounds lovely." },
          { text: "Renshuu no ato, o-cha wo nomimashou ka?", hint: "Shall we drink tea after practice?" },
          { text: "Anata no voice, calm desu ne.", hint: "Your voice is very calm." }
        ]
      },
      {
        greeting: "そう言われると、少し照れますね。",
        romaji: "Sou iwareru to, sukoshi teremasu ne.",
        greetingTranslation: "When you say that, I get a little embarrassed.",
        greetingTip: "'Teremasu' (照れます) means to feel shy or embarrassed.",
        options: [
          { text: "Motto Ren-san wo shiritai desu!", hint: "I want to know more about you, Ren!" },
          { text: "Ren-san ga hohoemu to, glad desu.", hint: "When you smile, I feel happy." },
          { text: "Ashita mo issho ni renshuu dekimasu ka?", hint: "Can we practice together again tomorrow?" }
        ]
      },
      {
        greeting: "実は、あなたと話すのが楽しみでした。",
        romaji: "Jitsu wa, anata to hanasu no ga tanoshimi deshita.",
        greetingTranslation: "Actually, I was looking forward to talking with you.",
        greetingTip: "'Tanoshimi' (楽しみ) means 'looking forward to something'.",
        options: [
          { text: "Hai! Ashita mo kanarazu aimashou.", hint: "Yes! Let's definitely meet tomorrow." },
          { text: "Ren-san no soba ni itai desu.", hint: "I want to stay by your side, Ren." },
          { text: "Anata no song wo kikitai desu!", hint: "I want to hear your song!" }
        ]
      },
      {
        greeting: "約束です。感謝しています。",
        romaji: "Yakusoku desu. Kansha shite imasu.",
        greetingTranslation: "It's a promise. I am truly grateful.",
        greetingTip: "'Yakusoku' (約束) means promise. 'Kansha' (感謝) means gratitude.",
        options: [
          { text: "Ren-san no smile ga my favorite desu.", hint: "Your smile is my favorite." },
          { text: "Issho ni iru jikan ga happy desu.", hint: "Time spent together makes me happy." },
          { text: "Komban mo anata no dream wo mimasu.", hint: "I'll dream of you tonight." }
        ]
      }
    ],
    wordBankStages: [
      {
        prompt: 'Translate: "I want to listen to your guitar songs."',
        translation: "Anata no guitar no kyoku wo kikitai desu.",
        chips: ["Anata no", "guitar no", "kyoku wo", "kikitai desu", "suki", "oishii"]
      },
      {
        prompt: 'Translate: "Talking with you makes me happy."',
        translation: "Anata to hanasu no ga tanoshii desu.",
        chips: ["Anata to", "hanasu no ga", "tanoshii desu", "itsumo", "kirei", "arigatou"]
      },
      {
        prompt: 'Translate: "Let\'s drink tea together tomorrow as well."',
        translation: "Ashita mo issho ni o-cha wo nomimashou.",
        chips: ["Ashita mo", "issho ni", "o-cha wo", "nomimashou", "daisuki", "shiawase"]
      }
    ]
  },
  bao: {
    mcStages: [
      {
        greeting: "Chào em. Em muốn gọi món gì không?",
        greetingTranslation: "Hello. Would you like to order anything?",
        greetingTip: "'Em muốn gọi món gì không?' is a standard way to ask for an order.",
        options: [
          { text: "Xin chào anh Bao! Cho em một ly cà phê ạ.", hint: "Hello Bao! Give me a coffee please." },
          { text: "Anh Bao bận rộn quá nhỉ!", hint: "You look busy, Bao!" },
          { text: "Em muốn học tiếng Việt cùng anh Bao!", hint: "I want to learn Vietnamese with you, Bao!" }
        ]
      },
      {
        greeting: "Ồ, em nói tiếng Việt à? Rất dễ thương.",
        greetingTranslation: "Oh, you speak Vietnamese? Very cute.",
        greetingTip: "'Dễ thương' means cute.",
        options: [
          { text: "Cà phê anh pha ngon tuyệt vời!", hint: "The coffee you brewed is wonderful!" },
          { text: "Cảm ơn anh Bao nhé!", hint: "Thank you so much, Bao!" },
          { text: "Anh Bao nói chuyện hay quá.", hint: "You speak so nicely, Bao." }
        ]
      },
      {
        greeting: "Nói chuyện với em rất vui.",
        greetingTranslation: "Talking with you is very fun.",
        greetingTip: "'Nói chuyện' means talking, and 'rất vui' means very fun.",
        options: [
          { text: "Em cũng thích nói chuyện với anh Bao!", hint: "I also love chatting with you, Bao!" },
          { text: "Mỗi ngày em sẽ ghé thăm anh.", hint: "I will visit you every day." },
          { text: "Anh làm em thấy rất vui vẻ.", hint: "You make me feel so happy." }
        ]
      },
      {
        greeting: "Ở lại uống cà phê với anh chút nữa nhé?",
        greetingTranslation: "Stay and drink coffee with me a bit longer okay?",
        greetingTip: "'Chút nữa' means a bit longer.",
        options: [
          { text: "Vâng ạ! Em rất muốn ở lại cùng anh.", hint: "Yes! I really want to stay with you." },
          { text: "Mình vừa uống cà phê vừa ngắm phố nhé!", hint: "Let's drink coffee and watch the street!" },
          { text: "Ở bên anh Bao làm em bình yên lắm.", hint: "Being by your side makes me feel peaceful." }
        ]
      }
    ],
    wordBankStages: [
      {
        prompt: 'Translate: "I love drinking coffee with you."',
        translation: "Em thích uống cà phê cùng anh.",
        chips: ["Em", "thích", "uống", "cà phê", "cùng anh", "rất", "ngon"]
      },
      {
        prompt: 'Translate: "Talking with you is so fun."',
        translation: "Nói chuyện cùng anh rất vui.",
        chips: ["Nói chuyện", "cùng anh", "rất vui", "thật sự", "đẹp"]
      }
    ]
  },
  julian: {
    mcStages: [
      {
        greeting: "Good day. Did you need something?",
        greetingTranslation: "Good day. Did you need something?",
        greetingTip: "'Good day' is a polite formal greeting.",
        options: [
          { text: "Good day, Julian! I didn't mean to disturb you.", hint: "Polite greeting" },
          { text: "What book are you reading?", hint: "Curious inquiry" },
          { text: "I'd love to learn literature with you today.", hint: "Enthusiastic engagement" }
        ]
      },
      {
        greeting: "Curious about books? That is wonderful.",
        greetingTranslation: "Curious about books? That is wonderful.",
        greetingTip: "'Wonderful' expresses delight or admiration.",
        options: [
          { text: "Classical literature has a timeless charm.", hint: "Thoughtful reply" },
          { text: "I find your taste in books sophisticated.", hint: "Subtle compliment" },
          { text: "Could you recommend a poem for me?", hint: "Eager request" }
        ]
      },
      {
        greeting: "I am really enjoying our chat today.",
        greetingTranslation: "I am really enjoying our chat today.",
        greetingTip: "'Enjoying' means deriving pleasure from an activity.",
        options: [
          { text: "I'm delighted to hear that, Julian.", hint: "Warm agreement" },
          { text: "Shall we share a warm cup of tea together?", hint: "Casual offer" },
          { text: "Your company makes reading wonderful.", hint: "Charming response" }
        ]
      },
      {
        greeting: "I was hoping you would visit today.",
        greetingTranslation: "I was hoping you would visit today.",
        greetingTip: "'Hoping' means holding a wish or desire.",
        options: [
          { text: "I was looking forward to seeing you too.", hint: "Reciprocating interest" },
          { text: "I'll always visit whenever you wish.", hint: "Devoted promise" },
          { text: "You bring so much joy into my afternoons.", hint: "Sweet reflection" }
        ]
      }
    ],
    wordBankStages: [
      {
        prompt: 'Translate: "I enjoy discussing books with you."',
        translation: "I enjoy discussing books with you.",
        chips: ["I", "enjoy", "discussing", "books", "with", "you", "dearly"]
      },
      {
        prompt: 'Translate: "Your conversation brings warmth to my day."',
        translation: "Your conversation brings warmth to my day.",
        chips: ["Your", "conversation", "brings", "warmth", "to", "my", "day"]
      }
    ]
  }
};

// 10-Tier Difficulty Progression System
const TIERS = [
  { level: 1, name: "Tier 1: Baby Talk (Greetings)", mode: "mc", heartsPerAns: 10, desc: "Basic hellos, polite greetings & high-frequency phrases." },
  { level: 2, name: "Tier 2: First Impressions", mode: "mc", heartsPerAns: 12, desc: "Sharing favorite foods, hobbies & polite introductions." },
  { level: 3, name: "Tier 3: Coffee Date", mode: "mc", heartsPerAns: 15, desc: "Ordering drinks, warm gratitude & simple compliments." },
  { level: 4, name: "Tier 4: Word Builder", mode: "wordbank", heartsPerAns: 18, desc: "Building 4–6 word sentences with Word Bank chips." },
  { level: 5, name: "Tier 5: Daily Routines", mode: "wordbank", heartsPerAns: 20, desc: "Expressing daily schedule, time & weather feelings." },
  { level: 6, name: "Tier 6: Flirting & Compliments", mode: "wordbank", heartsPerAns: 22, desc: "Crafting romantic compliments & sweet invitations." },
  { level: 7, name: "Tier 7: Heart-to-Heart", mode: "wordbank", heartsPerAns: 25, desc: "Deeper personal conversations & shared dreams." },
  { level: 8, name: "Tier 8: Advanced Romance", mode: "free", heartsPerAns: 30, desc: "Free-form text input evaluated by Gemma 4 AI." },
  { level: 9, name: "Tier 9: Poetic Fluency", mode: "free", heartsPerAns: 35, desc: "Metaphors, romantic idioms & emotional nuances." },
  { level: 10, name: "Tier 10: Soulmate Mastery", mode: "free", heartsPerAns: 50, desc: "Full immersion, natural speed & romantic soulmate bond." }
];

// App Persistent State
let userState = {
  userId: localStorage.getItem("otome_user_id") || "user_" + Math.random().toString(36).substring(2, 9),
  totalHearts: parseInt(localStorage.getItem("otome_hearts")) || 0,
  streak: parseInt(localStorage.getItem("otome_streak")) || 1,
  currentTiers: JSON.parse(localStorage.getItem("otome_tiers")) || { ren: 1, bao: 1, julian: 1 },
  affection: JSON.parse(localStorage.getItem("otome_affection")) || { ren: 10, bao: 10, julian: 10 },
  chatStep: JSON.parse(localStorage.getItem("otome_chat_step")) || { ren: 0, bao: 0, julian: 0 },
  chatHistories: JSON.parse(localStorage.getItem("otome_chats")) || {},
  unlockedMemories: JSON.parse(localStorage.getItem("otome_memories")) || [],
  unreadMessages: JSON.parse(localStorage.getItem("otome_unread")) || { ren: 0, bao: 0, julian: 0 },
  isPouting: JSON.parse(localStorage.getItem("otome_pouting")) || { ren: false, bao: false, julian: false },
  unrepliedCount: JSON.parse(localStorage.getItem("otome_unreplied_count")) || { ren: 0, bao: 0, julian: 0 },
  showRomaji: localStorage.getItem("otome_show_romaji") !== "false",
};

// Timestamps for LI messaging/impatience engine
let lastUserReplyTime = { ren: Date.now(), bao: Date.now(), julian: Date.now() };
let lastLiCheckupTime = { ren: Date.now(), bao: Date.now(), julian: Date.now() };
let lastMessageWasLi = { ren: false, bao: false, julian: false };

// Romantic Memory CG Cards Milestones Data (25%, 50%, 75%, 100% Affection)
const MEMORY_CARDS = [
  // REN TAKAHASHI
  {
    id: "ren_25",
    charId: "ren",
    milestone: 25,
    title: "Moonlight Strumming",
    subtitle: "25% Affection Milestone CG",
    romanticQuote: "君の聴いている顔が、すごく綺麗だった。",
    romaji: "Kimi no kiite iru kao ga, sugoku kirei datta.",
    translation: "The expression on your face as you listened was so beautiful.",
    description: "After practice, Ren played a gentle solo acoustic song just for you under the silver moonlight outside the music room.",
    themeColor: "linear-gradient(135deg, #1e1b4b, #4c1d95, #831843)",
    icon: "🎸"
  },
  {
    id: "ren_50",
    charId: "ren",
    milestone: 50,
    title: "Shared Earbuds",
    subtitle: "50% Affection Milestone CG",
    romanticQuote: "片方、貸してあげる。このメロディ、君に一番に聴かせたかった。",
    romaji: "Katahou, kashite ageru. Kono melody, kimi ni ichiban ni kikasetakatta.",
    translation: "Here, take one earbud. I wanted you to be the very first person to hear this melody.",
    description: "Sitting side-by-side on the courtyard bench, Ren leaned in close and placed an earbud into your ear, his heart beating fast.",
    themeColor: "linear-gradient(135deg, #31103f, #6b21a8, #be185d)",
    icon: "🎧"
  },
  {
    id: "ren_75",
    charId: "ren",
    milestone: 75,
    title: "Rainy Bus Stop Shelter",
    subtitle: "75% Affection Milestone CG",
    romanticQuote: "濡れないで。僕の肩にもっと寄って…離れたくない。",
    romaji: "Nurenaide. Boku no kata ni motto yotte... Hanaretakunai.",
    translation: "Don't get wet. Lean closer against my shoulder... I don't want to let you go.",
    description: "A sudden downpour trapped you two under a tiny bus stop canopy. Ren wrapped his arm around your waist to protect you.",
    themeColor: "linear-gradient(135deg, #0f172a, #1e3a8a, #701a75)",
    icon: "🌧️"
  },
  {
    id: "ren_100",
    charId: "ren",
    milestone: 100,
    title: "Starlit Concert Dedication",
    subtitle: "100% Affection Soulmate CG",
    romanticQuote: "この歌は君だけに捧げる。一生、僕の隣にいてほしい。",
    romaji: "Kono uta wa kimi dake ni sasageru. Isshou, boku no tonari ni ite hoshii.",
    translation: "This song is dedicated only to you. I want you by my side for the rest of my life.",
    description: "On stage before thousands of cheering fans, Ren looked directly into your eyes in the VIP section, playing the melody written for your love.",
    themeColor: "linear-gradient(135deg, #020617, #581c87, #db2777)",
    icon: "💖"
  },

  // BAO NGUYEN
  {
    id: "bao_25",
    charId: "bao",
    milestone: 25,
    title: "Heart-Shaped Latte Art",
    subtitle: "25% Affection Milestone CG",
    romanticQuote: "Anh pha ly này riêng cho em đấy. Thấy hình trái tim không?",
    translation: "I brewed this cup specially for you. Do you see the heart shape?",
    description: "Bao slid a freshly brewed steaming latte across the wooden bar with a shy smile, a delicate heart crafted perfectly in milk foam.",
    themeColor: "linear-gradient(135deg, #2d1810, #78350f, #92400e)",
    icon: "☕"
  },
  {
    id: "bao_50",
    charId: "bao",
    milestone: 50,
    title: "Secret Recipe Tasting",
    subtitle: "50% Affection Milestone CG",
    romanticQuote: "Nếm thử đi. Anh muốn em là người đầu tiên thử món này.",
    translation: "Taste this. I wanted you to be the very first person to try my new creation.",
    description: "Late at night in the dimly lit cafe kitchen, Bao gently brought a spoonful of his signature dessert to your lips with a tender gaze.",
    themeColor: "linear-gradient(135deg, #1c1917, #7c2d12, #b45309)",
    icon: "🍰"
  },
  {
    id: "bao_75",
    charId: "bao",
    milestone: 75,
    title: "Rainy Cafe Evening",
    subtitle: "75% Affection Milestone CG",
    romanticQuote: "Ở lại đây với anh. Ngoài trời mưa to, nhưng bên em anh thấy ấm áp lắm.",
    translation: "Stay here with me. It's raining heavily outside, but beside you I feel so warm.",
    description: "With rain pattering against the cafe glass, Bao wrapped a soft blanket around your shoulders and held your hands.",
    themeColor: "linear-gradient(135deg, #0f172a, #047857, #065f46)",
    icon: "☕"
  },
  {
    id: "bao_100",
    charId: "bao",
    milestone: 100,
    title: "Sunset Beach Promise",
    subtitle: "100% Affection Soulmate CG",
    romanticQuote: "Anh muốn làm cà phê cho em mỗi buổi sáng, suốt đời này.",
    translation: "I want to brew coffee for you every single morning, for the rest of my life.",
    description: "As the golden sun dipped over the ocean waves, Bao cupped your cheeks gently and kissed you under the crimson sky.",
    themeColor: "linear-gradient(135deg, #451a03, #9a3412, #be123c)",
    icon: "🌅"
  },

  // JULIAN VANCE
  {
    id: "julian_25",
    charId: "julian",
    milestone: 25,
    title: "Vintage Library Alcove",
    subtitle: "25% Affection Milestone CG",
    romanticQuote: "I rarely share my quiet alcove with anyone... but you are a rare exception.",
    translation: "I rarely share my quiet alcove with anyone... but you are a rare exception.",
    description: "In the cozy dust-mote filled archway of the antique library, Julian reached up to pull down a classic leatherbound poetry volume for you.",
    themeColor: "linear-gradient(135deg, #1e1b4b, #3730a3, #4338ca)",
    icon: "📚"
  },
  {
    id: "julian_50",
    charId: "julian",
    milestone: 50,
    title: "Candlelit Poetry Reading",
    subtitle: "50% Affection Milestone CG",
    romanticQuote: "Every romantic sonnet I read tonight seems to describe your eyes.",
    translation: "Every romantic sonnet I read tonight seems to describe your eyes.",
    description: "By warm flickering candlelight, Julian recited a passage in his velvety British accent, looking up to meet your gaze with emotion.",
    themeColor: "linear-gradient(135deg, #2e1065, #5b21b6, #831843)",
    icon: "🕯️"
  },
  {
    id: "julian_75",
    charId: "julian",
    milestone: 75,
    title: "Clocktower Stargazing",
    subtitle: "75% Affection Milestone CG",
    romanticQuote: "The stars above are constant, yet none shine as brilliantly as you.",
    translation: "The stars above are constant, yet none shine as brilliantly as you.",
    description: "Atop the clocktower overlooking the foggy city lights, Julian wrapped his tailored coat around you to keep you warm.",
    themeColor: "linear-gradient(135deg, #020617, #1e1b4b, #1e40af)",
    icon: "🌌"
  },
  {
    id: "julian_100",
    charId: "julian",
    milestone: 100,
    title: "Eternity Promise Ring",
    subtitle: "100% Affection Soulmate CG",
    romanticQuote: "My heart has found its permanent home in yours. Will you stay with me forever?",
    translation: "My heart has found its permanent home in yours. Will you stay with me forever?",
    description: "In the private botanical courtyard garden, Julian dropped to one knee with a vintage engraved silver ring, tears of joy in his eyes.",
    themeColor: "linear-gradient(135deg, #0f172a, #4c1d95, #9d174d)",
    icon: "💍"
  }
];

// Spontaneous LI Check-Up Messages Pool
const SPONTANEOUS_CHECKUPS = {
  ren: [
    { text: "ねえ、今何してる？", romaji: "Nee, ima nani shiteru?", translation: "Hey, what are you doing right now?", tip: "'Nee' is a friendly casual way to catch someone's attention." },
    { text: "ギターの練習が終わったよ。少し話せる？", romaji: "Guitar no renshuu ga owatta yo. Sukoshi hanaseru?", translation: "Finished guitar practice. Can we talk for a bit?", tip: "'Sukoshi hanaseru?' means 'Can we talk for a little bit?'" },
    { text: "静かだな…君の声が聞きたくなった。", romaji: "Shizuka da na... Kimi no koe ga kikitaku natta.", translation: "It's quiet... I wanted to hear your voice.", tip: "'Kikitaku natta' means 'came to want to hear'." }
  ],
  bao: [
    { text: "Em ơi, rảnh không? Anh vừa pha ly cà phê mới nè!", translation: "Hey, free? I just brewed a fresh cup of coffee!", tip: "'Rảnh không?' means 'Are you free?'" },
    { text: "Đang làm gì đấy? Có nhớ anh không?", translation: "What are you doing? Do you miss me?", tip: "'Có nhớ anh không?' means 'Do you miss me?'" },
    { text: "Quán vắng quá, ước gì có em ở đây nói chuyện.", translation: "The cafe is so quiet today, I wish you were here chatting with me.", tip: "'Ước gì' means 'I wish'." }
  ],
  julian: [
    { text: "Are you free at the moment? I stumbled upon a fascinating poem.", translation: "Are you free at the moment? I stumbled upon a fascinating poem.", tip: "'Fascinating' means captivating and full of charm." },
    { text: "I found myself thinking of you while reading by the window.", translation: "I found myself thinking of you while reading by the window.", tip: "A sincere expression of affection." },
    { text: "Good day! Just wanted to hear how your afternoon is going.", translation: "Good day! Just wanted to hear how your afternoon is going.", tip: "A polite and thoughtful check-in." }
  ]
};

// Impatient Pout Messages Pool (Mad if no response fast enough)
const POUT_MESSAGES = {
  ren: [
    { text: "…返事遅い。忙しいの？ 💢", romaji: "...Henji osoi. Isogashii no?", translation: "...Slow reply. Are you busy?", tip: "'Henji osoi' means 'reply is slow'. 'Isogashii' means 'busy'." },
    { text: "既読スルー？ひどいな… 💔", romaji: "Kidoku suruu? Hidoi na...", translation: "Left on read? That's mean...", tip: "'Kidoku suruu' is Japanese slang for leaving someone on read." },
    { text: "返事してくれないと、もうギター弾かないよ。 😤", romaji: "Henji shite kurenai to, mou guitar hikanai yo.", translation: "If you don't answer, I won't play guitar anymore.", tip: "'Mou hikanai' means 'won't play anymore'." }
  ],
  bao: [
    { text: "Sao không trả lời anh? Giận rồi đấy! 💢", translation: "Why aren't you answering me? I'm pouting now!", tip: "'Giận rồi' means 'getting angry / pouting'." },
    { text: "Cà phê nguội hết rồi nè! Em bận gì à? ☕💔", translation: "The coffee got completely cold! What are you busy with?", tip: "'Nguội hết' means 'turned completely cold'." },
    { text: "Đừng lờ tin nhắn của anh mà~ 🥺", translation: "Don't ignore my messages~", tip: "'Đừng lờ' means 'don't ignore'." }
  ],
  julian: [
    { text: "Leaving my message unread? How terribly cruel of you... 💔", translation: "Leaving my message unread? How terribly cruel of you...", tip: "An expression of playful dramatic dismay." },
    { text: "Did a vintage book catch your attention more than my message? 📖💢", translation: "Did a vintage book catch your attention more than my message?", tip: "'Catch attention' means to attract notice." },
    { text: "I suppose I'll sit here waiting... impatiently. ⏳", translation: "I suppose I'll sit here waiting... impatiently.", tip: "Expressing eager or restless waiting." }
  ]
};

// Runtime cache for dynamic AI generated next turn options
let dynamicMcOptions = { ren: null, bao: null, julian: null };
let dynamicWordBank = { ren: null, bao: null, julian: null };

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
  characterInteractions: { ren: 0, bao: 0, julian: 0 },
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
  renderRoadmap();
  
  // Initial Convex Sync & Start 30-Second Periodic Auto-Sync Engine
  syncUserDataToConvex("Initial app load sync");
  startConvexAutoSyncEngine();
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

// UI Event Handlers & Tab Navigation
function initUI() {
  // Tab Buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabName = btn.dataset.tab || btn.closest(".tab-btn")?.dataset?.tab;
      if (tabName) switchTab(tabName);
    });
  });

  // Difficulty Tier Dropdown Listener
  const dropdownEl = document.getElementById("tierSelectDropdown");
  if (dropdownEl) {
    dropdownEl.addEventListener("change", (e) => {
      const selectedLevel = parseInt(e.target.value);
      if (activeCharacterId) {
        userState.currentTiers[activeCharacterId] = selectedLevel;
        saveLocalState();
        const tierObj = TIERS.find((t) => t.level === selectedLevel) || TIERS[0];
        const char = CHARACTERS[activeCharacterId];
        setupTierInputControls(tierObj, char);
        document.getElementById("chatHeaderTier").textContent = `Tier ${selectedLevel}: ${tierObj.name.split(":")[1] || tierObj.name}`;
      }
    });
  }

  // Reset Story Progress Button
  const resetBtn = document.getElementById("resetStoryBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      userState.chatStep = { ren: 0, bao: 0, julian: 0 };
      userState.chatHistories = {};
      userState.affection = { ren: 10, bao: 10, julian: 10 };
      userState.currentTiers = { ren: 1, bao: 1, julian: 1 };
      userState.totalHearts = 0;
      userState.streak = 1;
      dynamicMcOptions = { ren: null, bao: null, julian: null };
      dynamicWordBank = { ren: null, bao: null, julian: null };

      localStorage.removeItem("otome_chats");
      localStorage.removeItem("otome_chat_step");
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
      renderRoadmap();

      const successMsg = document.getElementById("resetSuccessMessage");
      if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 4000);
      }
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

  // Memory Unlock & Gallery Modals Handlers
  const headerGalleryBtn = document.getElementById("headerGalleryBtn");
  if (headerGalleryBtn) {
    headerGalleryBtn.addEventListener("click", () => openMemoryGallery("all"));
  }

  const closeGalleryModalBtn = document.getElementById("closeGalleryModalBtn");
  if (closeGalleryModalBtn) {
    closeGalleryModalBtn.addEventListener("click", () => {
      document.getElementById("memoryGalleryModal").style.display = "none";
    });
  }

  const closeUnlockModalBtn = document.getElementById("closeUnlockModalBtn");
  if (closeUnlockModalBtn) {
    closeUnlockModalBtn.addEventListener("click", () => {
      document.getElementById("memoryUnlockModal").style.display = "none";
    });
  }

  const openGalleryBtn = document.getElementById("openGalleryBtn");
  if (openGalleryBtn) {
    openGalleryBtn.addEventListener("click", () => {
      document.getElementById("memoryUnlockModal").style.display = "none";
      openMemoryGallery("all");
    });
  }

  // Gallery Filter Tabs
  document.querySelectorAll(".gallery-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".gallery-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter || "all";
      renderGalleryGrid(filter);
    });
  });

  // Update Header Badges
  document.getElementById("userHearts").textContent = userState.totalHearts;
  document.getElementById("userStreak").textContent = userState.streak;
}

// Switch Bottom Tabs
function switchTab(tabName) {
  // Always dismiss open chat window overlay when switching bottom tabs
  const chatWin = document.getElementById("chatWindow");
  if (chatWin) {
    chatWin.classList.remove("active");
  }
  activeCharacterId = null;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `view-${tabName}`);
  });

  if (tabName === "chats") renderChatList();
  if (tabName === "characters") renderCharactersList();
  if (tabName === "progress") renderRoadmap();
}

// OpenRouter Key Management
function initOpenRouterKey() {
  const savedKey = localStorage.getItem("openrouter_api_key");
  if (savedKey) {
    document.getElementById("openRouterKeyInput").value = savedKey;
    updateKeySavedStatus(true);
  } else {
    updateKeySavedStatus(false);
    // Show modal on first load if key missing
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
    statusEl.textContent = "Fallback AI Mode";
    statusEl.style.color = "var(--accent-gold)";
  }
}

// Secret Keyboard Shortcut Listener (CTRL + SHIFT + ALT)
function initKeybinds() {
  window.addEventListener("keydown", (e) => {
    // Secret Keybind: CTRL + SHIFT + ALT
    if (e.ctrlKey && e.shiftKey && e.altKey) {
      e.preventDefault();
      const dash = document.getElementById("secretDashboard");
      dash.classList.toggle("visible");
      logDashboardEvent("Secret Keybind [CTRL + SHIFT + ALT] pressed.");
      updateDashboardUI();
    }
    // ESC to close dashboard
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

  // Format time spent HH:MM:SS
  const s = analyticsData.timeSpentSeconds;
  const hrs = Math.floor(s / 3600).toString().padStart(2, "0");
  const mins = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const secs = (s % 60).toString().padStart(2, "0");
  document.getElementById("dashTimeSpent").textContent = `${hrs}:${mins}:${secs}`;
}

function logDashboardEvent(msg) {
  const box = document.getElementById("dashLogBox");
  const time = new Date().toLocaleTimeString();
  box.innerHTML += `[${time}] ${msg}<br/>`;
  box.scrollTop = box.scrollHeight;
}

// Render Chatrooms List
function renderChatList() {
  const container = document.getElementById("chatListContainer");
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const tierNum = userState.currentTiers[char.id] || 1;
    const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
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
          <div class="chat-name">${char.name} <span class="flag-icon">${char.flag}</span> ${badgeHtml}</div>
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
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const affectionPct = userState.affection[char.id] || 0;
    const tierNum = userState.currentTiers[char.id] || 1;
    const unlockedCount = MEMORY_CARDS.filter(m => m.charId === char.id && userState.unlockedMemories.includes(m.id)).length;

    const card = document.createElement("div");
    card.className = "character-card";

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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span style="font-size:11px; font-weight:700; color:var(--accent-gold);">
          🖼️ CGs: ${unlockedCount}/4 Unlocked
        </span>
        <button class="primary-btn" style="padding:4px 10px; font-size:11px; width:auto; margin:0; background:rgba(124, 58, 237, 0.25); border:1px solid rgba(124, 58, 237, 0.5);" onclick="openMemoryGallery('${char.id}')">
          Gallery
        </button>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span class="tier-badge">Current Tier: ${tierNum} / 10</span>
        <button class="primary-btn" style="padding:6px 14px; font-size:12px; width:auto; margin:0;" onclick="openChatroom('${char.id}')">
          Chat with ${char.name.split(" ")[0]} ❤️
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Render 10-Tier Roadmap
function renderRoadmap() {
  const container = document.getElementById("roadmapContainer");
  container.innerHTML = "";

  TIERS.forEach((tier) => {
    const node = document.createElement("div");
    node.className = "tier-node" + (tier.level === 1 ? " active-tier" : "");
    node.style.cursor = "pointer";

    node.innerHTML = `
      <div class="tier-number-badge">${tier.level}</div>
      <div style="flex:1;">
        <div style="font-size:14px; font-weight:700; color:var(--text-main);">${tier.name}</div>
        <div style="font-size:12px; color:var(--text-muted);">${tier.desc}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px; font-weight:700; color:var(--primary-pink);">+${tier.heartsPerAns} ❤️</div>
        <button class="primary-btn" style="padding:4px 10px; font-size:10px; margin-top:4px; width:auto; pointer-events:none;">Play Tier</button>
      </div>
    `;

    node.onclick = () => {
      const choice = prompt(`Select Love Interest to replay ${tier.name}:\n\n1. Ren Takahashi (Japanese 🇯🇵)\n2. Bao Nguyen (Vietnamese 🇻🇳)\n3. Julian Vance (English 🇬🇧)\n\nEnter 1, 2, or 3:`, "1");
      let selectedId = "ren";
      if (choice === "2") selectedId = "bao";
      if (choice === "3") selectedId = "julian";
      if (choice) {
        userState.currentTiers[selectedId] = tier.level;
        saveLocalState();
        openChatroom(selectedId);
      }
    };

    container.appendChild(node);
  });
}

// Open Active Chatroom
function openChatroom(charId) {
  activeCharacterId = charId;
  analyticsData.characterInteractions[charId]++;
  
  // Clear unread, pout status, and unreplied count when opening chat
  userState.unreadMessages[charId] = 0;
  userState.isPouting[charId] = false;
  if (!userState.unrepliedCount) userState.unrepliedCount = { ren: 0, bao: 0, julian: 0 };
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
  setupTierInputControls(tierObj, char);

  // Show Window
  document.getElementById("chatWindow").classList.add("active");
}

// Render Chat History Messages
function renderChatHistory() {
  const container = document.getElementById("chatHistory");
  container.innerHTML = "";

  const char = CHARACTERS[activeCharacterId];
  if (!char) return;

  let history = userState.chatHistories[activeCharacterId] || [];

  // Seed greeting if history empty
  if (history.length === 0) {
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

      group.innerHTML = `
        <img src="${char.avatar}" class="msg-avatar" alt="${char.name}" />
        <div class="msg-body">
          <div class="msg-sender">${char.name}</div>
          <div class="msg-bubble">
            <div style="font-size:15px; font-weight:700;">${msg.text}</div>
            ${romajiHtml}
            ${(msg.translation || msg.tip || msg.fix) ? `<button type="button" class="assist-toggle-btn">💡 Click for Translation & Tips</button>` : ''}
            ${msg.translation ? `<div class="translation-text">💬 ${msg.translation}</div>` : ""}
            ${msg.tip ? `<div class="tip-card"><div class="tip-title">💡 Grammar/Vocab Tip</div>${msg.tip}</div>` : ""}
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

  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Setup Input Bar based on Tier Mode (MC vs WordBank vs FreeForm)
function setupTierInputControls(tierObj, char) {
  const mcContainer = document.getElementById("mcContainer");
  const wordBankContainer = document.getElementById("wordBankContainer");
  const freeInputContainer = document.getElementById("freeInputContainer");
  const labelEl = document.getElementById("tierModeLabel");
  const multEl = document.getElementById("tierHeartMultiplier");
  const dropdownEl = document.getElementById("tierSelectDropdown");

  if (dropdownEl) {
    dropdownEl.value = tierObj.level.toString();
  }

  labelEl.textContent = `Tier ${tierObj.level}`;
  multEl.textContent = `+${tierObj.heartsPerAns} ❤️ / answer`;

  mcContainer.style.display = "none";
  wordBankContainer.style.display = "none";
  freeInputContainer.style.display = "none";

  if (tierObj.mode === "mc") {
    // Tier 1–3 Multiple Choice Mode
    mcContainer.style.display = "flex";
    renderMultipleChoiceOptions(tierObj, char);
  } else if (tierObj.mode === "wordbank") {
    // Tier 4–7 Word Bank Sentence Builder
    wordBankContainer.style.display = "flex";
    setupWordBankPrompt(tierObj, char);
  } else {
    // Tier 8–10 Free Form Text Chat
    freeInputContainer.style.display = "flex";
  }
}

// Render Progressive Multiple Choice Options for Tier 1–3
function renderMultipleChoiceOptions(tierObj, char) {
  const container = document.getElementById("mcContainer");
  container.innerHTML = "";

  let options = [];

  // Check if AI generated dynamic next-turn options exist
  if (dynamicMcOptions[char.id] && dynamicMcOptions[char.id].length > 0) {
    options = dynamicMcOptions[char.id];
  } else {
    // Fallback to progressive story tree stages based on current chatStep
    const tree = STORY_TREES[char.id] || STORY_TREES.ren;
    const stepIndex = (userState.chatStep[char.id] || 0) % tree.mcStages.length;
    const stage = tree.mcStages[stepIndex];
    options = stage.options;
  }

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "mc-option-btn";
    btn.innerHTML = `
      <span>${opt.text}</span>
      <span class="mc-hint">${opt.hint}</span>
    `;
    btn.onclick = () => handleSelectMCOption(opt, tierObj);
    container.appendChild(btn);
  });
}

// Handle Multiple Choice Choice Click
async function handleSelectMCOption(option, tierObj) {
  analyticsData.answersSubmitted++;

  // Add User Message
  addUserMessageToHistory(option.text);

  // Advance Chat Step
  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;
  // Clear consumed dynamic options so next stage loads
  dynamicMcOptions[activeCharacterId] = null;

  // Award Hearts & Affection
  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 5);

  // Trigger Heart Visual Particles
  triggerHeartBurst();

  // Fetch AI or Fallback Response
  await triggerLLMResponse(option.text, tierObj);
}

// Setup Word Bank Prompt for Tier 4–7
let currentConstructedWords = [];
function setupWordBankPrompt(tierObj, char) {
  currentConstructedWords = [];
  const guideEl = document.getElementById("wordBankPromptGuide");
  const chipsGrid = document.getElementById("wordChipsGrid");
  const boxEl = document.getElementById("constructedSentenceBox");

  boxEl.innerHTML = `<span style="color:var(--text-muted); font-size:12px;" id="constructedPlaceholder">Click word chips below to build your sentence...</span>`;

  let promptText = "";
  let chips = [];

  if (dynamicWordBank[char.id] && dynamicWordBank[char.id].prompt) {
    promptText = dynamicWordBank[char.id].prompt;
    chips = dynamicWordBank[char.id].chips || [];
  } else {
    const tree = STORY_TREES[char.id] || STORY_TREES.ren;
    const stepIndex = (userState.chatStep[char.id] || 0) % tree.wordBankStages.length;
    const stage = tree.wordBankStages[stepIndex];
    promptText = stage.prompt;
    chips = stage.chips;
  }

  guideEl.textContent = promptText;
  chipsGrid.innerHTML = "";

  chips.forEach((word) => {
    const chip = document.createElement("button");
    chip.className = "word-chip";
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
  if (currentConstructedWords.length === 0) {
    alert("Please click word chips to build a sentence first!");
    return;
  }

  const constructedText = currentConstructedWords.join(" ");
  analyticsData.answersSubmitted++;

  // Add User Message
  addUserMessageToHistory(constructedText);

  // Advance Chat Step
  userState.chatStep[activeCharacterId] = (userState.chatStep[activeCharacterId] || 0) + 1;
  dynamicWordBank[activeCharacterId] = null;

  const tierNum = userState.currentTiers[activeCharacterId] || 4;
  const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[3];

  addHearts(tierObj.heartsPerAns);
  increaseAffection(activeCharacterId, 8);
  triggerHeartBurst();

  // Fetch AI Response
  await triggerLLMResponse(constructedText, tierObj);
}

// Handle Free-Form Text Chat Message
async function handleSendFreeMessage() {
  const input = document.getElementById("freeChatInput");
  const text = input.value.trim();
  if (!text) return;

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

  // Reset unreplied tracking & pout state when user responds
  if (!userState.unrepliedCount) userState.unrepliedCount = { ren: 0, bao: 0, julian: 0 };
  userState.unrepliedCount[activeCharacterId] = 0;
  userState.isPouting[activeCharacterId] = false;
  lastUserReplyTime[activeCharacterId] = Date.now();
  lastMessageWasLi[activeCharacterId] = false;

  saveLocalState();
  renderChatHistory();
}

// LLM Integration with Gemma 4 via OpenRouter API (+ Fallback Engine)
async function triggerLLMResponse(userText, tierObj) {
  analyticsData.apiCalls++;
  const apiKey = localStorage.getItem("openrouter_api_key");
  const char = CHARACTERS[activeCharacterId];

  // Show "Typing..." indicator in chat
  showTypingIndicator(char);

  let responseData = null;

  if (apiKey) {
    try {
      logDashboardEvent(`Sending OpenRouter API call (${OPENROUTER_MODEL}) for ${char.name}...`);
      
      const prompt = `You are playing the role of ${char.name}, a handsome Otome dating sim character from Otome Lingua.
Target Language taught: ${char.language}.
Personality & Evolution Directive: ${char.personality}.

CRITICAL SHORT TEXT RULE FOR BEGINNERS:
- Keep 'characterResponse' EXTREMELY SHORT and simple (1 short sentence, 3 to 8 words maximum).
- The user is a beginner language learner. Never write long, complex sentences or multiple paragraphs!

CRITICAL DYNAMIC TONE INSTRUCTION:
- You start off composed, cool, nonchalant, and slightly reserved or casual.
- As the user chats and affection increases, you gradually become more interested, intrigued, warm, and subtly affectionate.

Current User Difficulty Tier: ${tierObj.name}.
User just said: "${userText}".

CRITICAL LANGUAGE RULE:
1. 'characterResponse' MUST BE 100% IN ${char.language.toUpperCase()} ONLY! Do NOT mix English inside 'characterResponse' (unless target language is English).
${char.language === "Japanese" ? "2. CRITICAL JAPANESE ROMAJI RULE: Provide the exact Romanji (latin alphabet pronunciation) in 'romaji' (e.g. 'A, konnichiwa. Nani ka you desu ka?')." : "2. Set 'romaji' to null."}
3. Provide full English translation in 'translation'.
4. Provide a helpful grammar/vocabulary tip in 'tip'.
5. Provide a gentle correction in 'fix' if the user made a grammar/vocab mistake (or null if none).
6. For Tier 1-3, provide 3 short, simple options in ${char.language} for the user's NEXT turn in 'nextMcOptions': [{"text": "short phrase in ${char.language}", "hint": "English hint"}].

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

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Otome Lingua",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "system", content: "You are a language tutor in a romantic Otome game. Always reply in valid JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices[0].message.content;
        try {
          responseData = JSON.parse(content);
        } catch {
          // If JSON wrapped in ```json block
          const clean = content.replace(/```json/g, "").replace(/```/g, "").trim();
          responseData = JSON.parse(clean);
        }
        if (responseData && responseData.nextMcOptions) {
          dynamicMcOptions[char.id] = responseData.nextMcOptions;
        }
        logDashboardEvent(`OpenRouter API response received successfully.`);
      } else {
        logDashboardEvent(`OpenRouter API returned status ${res.status}. Switching to Fallback Engine.`);
      }
    } catch (err) {
      logDashboardEvent(`OpenRouter API call failed: ${err.message}. Using Fallback Engine.`);
    }
  }

  // Fallback Engine if API key missing or call failed
  if (!responseData) {
    responseData = generateFallbackResponse(char, userText, tierObj);
  }

  // Remove typing indicator
  removeTypingIndicator();

  // Push LI Message to History
  const history = userState.chatHistories[activeCharacterId] || [];
  history.push({
    sender: "li",
    text: responseData.characterResponse,
    romaji: responseData.romaji || (char.language === "Japanese" ? responseData.characterResponse : null),
    translation: responseData.translation,
    tip: responseData.tip,
    fix: responseData.fix,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  userState.chatHistories[activeCharacterId] = history;

  // Check for Tier Level Up if Affection hits threshold
  checkTierLevelUp(activeCharacterId);

  saveLocalState();
  renderChatHistory();

  // Refresh input controls for NEXT turn so options progress!
  setupTierInputControls(tierObj, char);

  // Auto Sync to Convex Cloud
  syncUserDataToConvex(`Post-chat response sync (${char.name})`);
}

// Fallback Response Generator (100% Pure Target Language)
function generateFallbackResponse(char, userText, tierObj) {
  const tree = STORY_TREES[char.id] || STORY_TREES.ren;
  const step = userState.chatStep[char.id] || 0;
  const stageIndex = Math.min(step, tree.mcStages.length - 1);
  const nextStage = tree.mcStages[stageIndex] || tree.mcStages[0];

  return {
    characterResponse: nextStage.greeting,
    romaji: nextStage.romaji || null,
    translation: nextStage.greetingTranslation,
    tip: nextStage.greetingTip,
    fix: userText.length < 3 ? "Tip: Try writing a slightly longer response for bonus affection points!" : null,
    affectionChange: 10,
  };
}

// Typing Indicator Helpers
function showTypingIndicator(char) {
  const container = document.getElementById("chatHistory");
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
  document.getElementById("userHearts").textContent = userState.totalHearts;
  saveLocalState();
}

function increaseAffection(charId, amount) {
  userState.affection[charId] = Math.min(100, (userState.affection[charId] || 0) + amount);
  saveLocalState();
  renderCharactersList();
  checkAffectionMilestones(charId);
}

// Memory Unlock & Gallery Engine
function checkAffectionMilestones(charId) {
  const currentAff = userState.affection[charId] || 0;
  const charMems = MEMORY_CARDS.filter((m) => m.charId === charId);

  charMems.forEach((mem) => {
    if (currentAff >= mem.milestone && !userState.unlockedMemories.includes(mem.id)) {
      userState.unlockedMemories.push(mem.id);
      saveLocalState();
      triggerMemoryUnlockModal(mem);
      logDashboardEvent(`🎉 CG MEMORY UNLOCKED: ${mem.title} (${charId} @ ${mem.milestone}%)`);
    }
  });
}

function triggerMemoryUnlockModal(mem) {
  const modal = document.getElementById("memoryUnlockModal");
  if (!modal) return;

  const frame = document.getElementById("unlockCgFrame");
  const icon = document.getElementById("unlockCgIcon");
  const title = document.getElementById("unlockCgTitle");
  const sub = document.getElementById("unlockCgSub");
  const quote = document.getElementById("unlockQuoteText");
  const romaji = document.getElementById("unlockQuoteRomaji");
  const trans = document.getElementById("unlockQuoteTrans");
  const desc = document.getElementById("unlockDescText");

  if (frame) frame.style.background = mem.themeColor;
  if (icon) icon.textContent = mem.icon;
  if (title) title.textContent = mem.title;
  if (sub) sub.textContent = mem.subtitle;
  if (quote) quote.textContent = `"${mem.romanticQuote}"`;

  if (romaji) {
    if (mem.romaji) {
      romaji.textContent = mem.romaji;
      romaji.style.display = "block";
    } else {
      romaji.style.display = "none";
    }
  }

  if (trans) trans.textContent = `💬 "${mem.translation}"`;
  if (desc) desc.textContent = mem.description;

  modal.style.display = "flex";
  triggerHeartBurst();
}

function openMemoryGallery(filterCharId = "all") {
  const modal = document.getElementById("memoryGalleryModal");
  if (!modal) return;

  // Set active filter tab
  document.querySelectorAll(".gallery-tab").forEach((tab) => {
    tab.classList.toggle("active", (tab.dataset.filter || "all") === filterCharId);
  });

  renderGalleryGrid(filterCharId);
  modal.style.display = "flex";
}

function renderGalleryGrid(filterCharId = "all") {
  const container = document.getElementById("galleryGridContainer");
  if (!container) return;
  container.innerHTML = "";

  const filtered = MEMORY_CARDS.filter((m) => filterCharId === "all" || m.charId === filterCharId);

  filtered.forEach((mem) => {
    const isUnlocked = userState.unlockedMemories.includes(mem.id);
    const char = CHARACTERS[mem.charId];

    const card = document.createElement("div");
    card.className = `gallery-card ${isUnlocked ? "" : "locked"}`;

    if (isUnlocked) {
      card.style.background = mem.themeColor;
      card.onclick = () => triggerMemoryUnlockModal(mem);

      card.innerHTML = `
        <div class="gallery-card-top">
          <span class="gallery-card-icon">${mem.icon}</span>
          <span class="gallery-card-milestone">❤️ ${mem.milestone}% Milestone</span>
        </div>
        <div>
          <div class="gallery-card-title">${mem.title}</div>
          <div class="gallery-card-li">${char ? char.name : ''} ${char ? char.flag : ''}</div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="gallery-card-top">
          <span class="gallery-card-icon" style="filter:grayscale(1);">🔒</span>
          <span class="gallery-card-milestone" style="color:#aaa; border-color:#666;">Locked</span>
        </div>
        <div>
          <div class="gallery-card-title" style="color:var(--text-muted);">???</div>
          <div class="gallery-card-li">Unlocks at ${mem.milestone}% Affection</div>
        </div>
      `;
    }

    container.appendChild(card);
  });
}

// Spontaneous LI Check-Up & Impatience ("Mad/Pout") Messaging Loop
function startCheckUpAndPoutEngine() {
  setInterval(() => {
    const now = Date.now();
    const charIds = Object.keys(CHARACTERS);

    charIds.forEach((charId) => {
      const char = CHARACTERS[charId];
      if (!char) return;

      if (!userState.unrepliedCount) userState.unrepliedCount = { ren: 0, bao: 0, julian: 0 };
      const unreplied = userState.unrepliedCount[charId] || 0;

      // STOP spamming if the character has sent 3 consecutive messages without user response
      if (unreplied >= 3) {
        return;
      }

      // 1. Spontaneous Check-Up Trigger (~25-35s idle check)
      const timeSinceCheckup = now - (lastLiCheckupTime[charId] || 0);
      const timeSinceUserReply = now - (lastUserReplyTime[charId] || 0);

      if (timeSinceCheckup > 30000 && timeSinceUserReply > 20000) {
        if (Math.random() < 0.5) {
          const pool = SPONTANEOUS_CHECKUPS[charId];
          if (pool && pool.length > 0) {
            const checkup = pool[Math.floor(Math.random() * pool.length)];

            if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];
            userState.chatHistories[charId].push({
              sender: charId,
              text: checkup.text,
              romaji: checkup.romaji || null,
              translation: checkup.translation,
              tip: checkup.tip,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            lastLiCheckupTime[charId] = now;
            lastMessageWasLi[charId] = true;
            userState.unrepliedCount[charId] = (userState.unrepliedCount[charId] || 0) + 1;

            if (activeCharacterId !== charId) {
              userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
              showNotificationToast(char, checkup.text, false);
            } else {
              renderChatHistory();
            }

            saveLocalState();
            renderChatList();
            logDashboardEvent(`💬 Check-Up Message (${userState.unrepliedCount[charId]}/3) sent by ${char.name}`);
            return;
          }
        }
      }

      // 2. Impatience / Pout Trigger (If LI sent last message and user didn't reply in >20s)
      if (lastMessageWasLi[charId] && !userState.isPouting[charId] && timeSinceUserReply > 20000) {
        const pool = POUT_MESSAGES[charId];
        if (pool && pool.length > 0) {
          const pout = pool[Math.floor(Math.random() * pool.length)];

          if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];
          userState.chatHistories[charId].push({
            sender: charId,
            text: pout.text,
            romaji: pout.romaji || null,
            translation: pout.translation,
            tip: pout.tip,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });

          userState.isPouting[charId] = true;
          userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
          userState.unrepliedCount[charId] = (userState.unrepliedCount[charId] || 0) + 1;
          lastMessageWasLi[charId] = false;

          showNotificationToast(char, pout.text, true);

          if (activeCharacterId === charId) {
            renderChatHistory();
          }

          saveLocalState();
          renderChatList();
          logDashboardEvent(`💢 ${char.name} got impatient (${userState.unrepliedCount[charId]}/3) & sent pout message!`);
        }
      }
    });
  }, 8000);
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
  localStorage.setItem("otome_memories", JSON.stringify(userState.unlockedMemories));
  localStorage.setItem("otome_unread", JSON.stringify(userState.unreadMessages));
  localStorage.setItem("otome_pouting", JSON.stringify(userState.isPouting));
  localStorage.setItem("otome_unreplied_count", JSON.stringify(userState.unrepliedCount || { ren: 0, bao: 0, julian: 0 }));
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
      chatStep: userState.chatStep,
      chatHistories: userState.chatHistories,
      unlockedMemories: userState.unlockedMemories,
      unreadMessages: userState.unreadMessages,
      isPouting: userState.isPouting,
      unrepliedCount: userState.unrepliedCount,
      activities: {
        totalClicks: analyticsData.clicks,
        answersSubmitted: analyticsData.answersSubmitted,
        timeSpentSeconds: analyticsData.timeSpentSeconds,
        apiCalls: analyticsData.apiCalls,
        convexSyncCount: analyticsData.convexSyncCount,
        characterInteractions: analyticsData.characterInteractions,
      },
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

// 30-Second Periodic Auto-Sync Engine to Convex
function startConvexAutoSyncEngine() {
  setInterval(() => {
    syncUserDataToConvex("Automated 30-second activity & user data sync");
    uploadAnalyticsToConvex();
  }, 30000);
}

// Upload Analytics Telemetry Payload to Convex Cloud (`/analytics`)
async function uploadAnalyticsToConvex() {
  const statusEl = document.getElementById("dashUploadStatus");
  statusEl.textContent = "Uploading telemetry...";

  try {
    const payload = {
      userId: userState.userId,
      telemetry: {
        totalClicks: analyticsData.clicks,
        answersSubmitted: analyticsData.answersSubmitted,
        timeSpentSeconds: analyticsData.timeSpentSeconds,
        apiCalls: analyticsData.apiCalls,
        convexSyncCount: analyticsData.convexSyncCount,
        characterInteractions: analyticsData.characterInteractions,
        totalHeartsEarned: userState.totalHearts,
      },
      uploadedAt: new Date().toISOString(),
    };

    const res = await fetch(`${CONVEX_HTTP_SITE}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      statusEl.textContent = "Status: Upload Success! 🟢";
      logDashboardEvent(`Uploaded analytics to Convex HTTP endpoint: ${JSON.stringify(json)}`);
    } else {
      statusEl.textContent = `Status: Failed (${res.status}) 🔴`;
      logDashboardEvent(`Analytics upload failed with status ${res.status}`);
    }
  } catch (err) {
    statusEl.textContent = "Status: Error 🔴";
    logDashboardEvent(`Analytics upload error: ${err.message}`);
  }
}
