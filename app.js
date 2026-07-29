/**
 * Otome Lingua - App Logic Engine
 * Duolingo competitor disguised as Mystic Messenger Otome Sim
 * Features 10-Tier progression, Gemma 4 OpenRouter LLM, Contextual Sentence Builder,
 * Free Text Chat, Convex Sync & Telemetry Dashboard
 */

// Global Configuration
const CONVEX_HTTP_SITE = "https://wary-reindeer-174.convex.site";
const OPENROUTER_MODEL = "google/gemma-4-26b-a4b-it:free";

// PASTE YOUR OPENROUTER API KEY HERE IF YOU WANT IT HARDCODED IN CODE:
// Example: const HARDCODED_OPENROUTER_API_KEY = "sk-or-v1-1234567890abcdef...";
const HARDCODED_OPENROUTER_API_KEY = "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";

// Character Definitions
const CHARACTERS = {
  ren: {
    id: "ren",
    name: "Ren Takahashi",
    language: "Japanese",
    flag: "🇯🇵",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdSZW4iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGY0NmU1Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjN2MzYWVkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ1JlbikiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZTBlN2ZmIi8+PHBhdGggZD0iTTMyIDMwIHExOCAtMTIgMzYgMCBxLTYgMjQgLTM2IDAiIGZpbGw9IiMzMTJlODEiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiMzMTJlODEiLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiMzMTJlODEiLz48cGF0aCBkPSJNNDYgNDkgcTQgNCA4IDAiIHN0cm9rZT0iIzMxMmU4MSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
    role: "Upperclassman & Musician",
    personality: "Cool, quiet upperclassman and guitarist. Starts calm and nonchalant, but grows warm and attentive as you talk.",
    greeting: "あ、こんにちは。何か用ですか？",
    romaji: "A, konnichiwa. Nani ka you desu ka?",
    greetingTranslation: "Ah, hello. Did you need something?",
    greetingTip: "'Nani ka you desu ka?' (何か用ですか) means 'Did you need something?'. 'Konnichiwa' (こんにちは) is standard Japanese for 'Hello'.",
    sampleVoice: "Gentle Japanese tenor",
  },
  bao: {
    id: "bao",
    name: "Bao Nguyen",
    language: "Vietnamese",
    flag: "🇻🇳",
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdCYW8iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDU5NjY5Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ0JhbykiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZDFmYWU1Ii8+PHBhdGggZD0iTTMwIDMwIHEyMCAtMTAgNDAgMCBxLTE0IDI0IC00MCAwIiBmaWxsPSIjMDY0ZTMiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiMwNjRlMyIvPjxjaXJjbGUgY3g9IjU4IiBjeT0iNDEiIHI9IjIuNSIgZmlsbD0iIzA2NGUzIi8+PHBhdGggZD0iTTQ1IDQ5IHE1IDUgMTAgMCIgc3Ryb2tlPSIjMDY0ZTMiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
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
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdKdWwiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjYjkxYzFjIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ0p1bCkiLz48cGF0aCBkPSJNNTAgMTUgYy0xNiAwIC0yNiAxMiAtMjYgMjYgYzAgMTEgNiAxOCAxNCAyMiBjLTE4IDYgLTI2IDE4IC0yNiAzNSBoNzYgYzAgLTE3IC04IC0yOSAtMjYgLTM1IGMxOCAtNCAxNCAtMTEgMTQgLTIyIGMwIC0xNCAtMTAgLTI2IC0yNiAtMjYgeiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC45NSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmVmM2M3Ii8+PHBhdGggZD0iTTMxIDMwIHExOCAtMTIgMzQgMCBxLTYgMjQgLTM0IDAiIGZpbGw9IiM3ODM1MGYiLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiM3ODM1MGYiLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjQxIiByPSIyLjUiIGZpbGw9IiM3ODM1MGYiLz48cGF0aCBkPSJNNTYgNDkgcTQgMyA4IDAiIHN0cm9rZT0iIzc4MzUwZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
    role: "Literature Scholar & Architect",
    personality: "Composed, intellectual scholar. Starts reserved, but gets charmed as you chat.",
    greeting: "Good day. Did you need something?",
    greetingTranslation: "Good day. Did you need something?",
    greetingTip: "'Good day' is a formal polite greeting. 'Did you need something?' is a reserved inquiry.",
    sampleVoice: "Refined British scholar",
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

// Spontaneous LI Check-Up Messages Pool (20 Natural & Romantic Otome Texts per Character)
const SPONTANEOUS_CHECKUPS = {
  ren: [
    { text: "ねえ、今なにしてる？ちょっと君の声が聞きたくなった。", romaji: "Nee, ima nani shiteru? Chotto kimi no koe ga kikitaku natta.", translation: "Hey, what are you doing right now? I suddenly wanted to hear your voice.", tip: "'Nee' (ねえ) catches attention softly. 'Kikitaku natta' means 'came to want to hear'." },
    { text: "ギターの練習ひと区切りついたよ。少し話せる？", romaji: "Guitar no renshuu hitokugiri tsuita yo. Sukoshi hanaseru?", translation: "I reached a good stopping point in my guitar practice. Can we talk for a bit?", tip: "'Hitokugiri tsuita' means reached a break/pause. 'Sukoshi hanaseru?' means 'Can we talk a little?'." },
    { text: "ふと君のこと考えてた。今日もお疲れ様。", romaji: "Futo kimi no koto kangaeteta. Kyou mo otsukaresama.", translation: "I unexpectedly found myself thinking about you. Thanks for your hard work today.", tip: "'Futo' means spontaneously. 'Otsukaresama' expresses thoughtful appreciation." },
    { text: "新しい曲のコード進行、君に一番に聴かせたいな。", romaji: "Atarashii kyoku no koodo shinkou, kimi ni ichiban ni kikaseta i na.", translation: "I want you to be the first one to hear this new song chord progression.", tip: "'Ichiban ni' means first of all. 'Kikasetai' means want to let you hear." },
    { text: "カフェで温かいお茶飲んでるよ。君も好きだったよね？", romaji: "Cafe de atatakai ocha nonderu yo. Kimi mo suki datta yone?", translation: "I'm drinking warm tea at a cafe. You liked this too, right?", tip: "'Atatakai' means warm. 'Nonderu' is informal for drinking right now." },
    { text: "返事急がなくて大丈夫だけど…顔が見たくなった。", romaji: "Henji isoganakute daijoubu dakedo... kao ga mitaku natta.", translation: "No need to rush your reply, but... I kind of missed seeing your face.", tip: "'Isoganakute daijoubu' means no need to rush. 'Kao ga mitaku natta' means wanted to see your face." },
    { text: "今日の夕焼け、すごく綺麗だよ。君にも見せたいな。", romaji: "Kyou no yuuyake, sugoku kirei dayo. Kimi nimo misetai na.", translation: "Today's sunset is so beautiful. I wish I could show it to you.", tip: "'Yuuyake' means sunset. 'Misetai' means want to show you." },
    { text: "最近、君と話す時間が一番楽しみなんだ。", romaji: "Saikin, kimi to hanasu jikan ga ichiban tanoshimi nanda.", translation: "Lately, talking with you is what I look forward to the most.", tip: "'Saikin' means lately. 'Tanoshimi' means looking forward to." },
    { text: "少し散歩してくるね。メッセージ見たら教えて。", romaji: "Sukoshi sanpo shite kuru ne. Message mitara oshiete.", translation: "I'm going for a short walk. Let me know when you see this.", tip: "'Sanpo' means a stroll/walk. 'Mitara oshiete' means let me know when you look at it." },
    { text: "静かな夜だね。君はもう寝ちゃったかな？", romaji: "Shizuka na yoru dane. Kimi wa mou nechatta kana?", translation: "It's a quiet night. Have you already gone to sleep?", tip: "'Shizuka na' means quiet. 'Nechatta' implies accidentally/already slept." },
    { text: "次のライブ、君のために最高の曲を演奏するよ。", romaji: "Tsugi no live, kimi no tame ni saikou no kyoku wo ensou suru yo.", translation: "At the next live show, I'll play the best song just for you.", tip: "'Kimi no tame ni' means for your sake. 'Ensou suru' means perform music." },
    { text: "君のメッセージ待ってる間、ギター弾いてるね。", romaji: "Kimi no message matteru aida, guitar hiteru ne.", translation: "While waiting for your message, I'm playing my guitar.", tip: "'Matteru aida' means while waiting. 'Hiteru' means strumming/playing string instruments." },
    { text: "ねえ、今週末って何か予定ある？", romaji: "Nee, konshuumatsu tte nanika yotei aru?", translation: "Hey, do you have any plans for this weekend?", tip: "'Konshuumatsu' means this weekend. 'Yotei' means plans/schedule." },
    { text: "君から返事が来ると、すごく安心するんだ。", romaji: "Kimi kara henji ga kuru to, sugoku anshin suru nda.", translation: "When I get a reply from you, I feel so relieved.", tip: "'Anshin suru' means to feel at ease/relieved." },
    { text: "今日のおすすめの曲、後でリンク送るね。", romaji: "Kyou no osusume no kyoku, ato de link okuru ne.", translation: "I'll send you a link to today's recommended song later.", tip: "'Osusume' means recommendation. 'Ato de' means later on." },
    { text: "勉強無理しないでね。いつでも話聞くから。", romaji: "Benkyou muri shinai de ne. Itsudemo hanashi kiku kara.", translation: "Don't push yourself too hard studying. I'm always here to listen.", tip: "'Muri shinai de' means don't overdo it. 'Itsudemo' means anytime." },
    { text: "君と話してると、時間が経つのがあっという間だ。", romaji: "Kimi to hanashiteru to, jikan ga tatsu no ga atsu to iu ma da.", translation: "When I'm talking with you, time flies by so fast.", tip: "'At to iu ma' means in the blink of an eye / instant." },
    { text: "寒くなってきたね。風邪ひかないように暖かくしてね。", romaji: "Samuku natte kita ne. Kaze hikanai you ni atatakaku shite ne.", translation: "It's getting colder. Keep warm so you don't catch a cold.", tip: "'Kaze hikanai' means don't catch a cold. 'Atatakaku' means warmly." },
    { text: "ちょっと休憩中。君のメッセージが恋しいな。", romaji: "Chotto kyuukeichuu. Kimi no message ga koishii na.", translation: "Taking a brief break. I miss your messages.", tip: "'Kyuukeichuu' means during break. 'Koishii' means missed/yearned for." },
    { text: "まったりタイム。君の笑顔が浮かんだよ。", romaji: "Mattari time. Kimi no egao ga ukanda yo.", translation: "Relaxing time. Your smiling face popped into my mind.", tip: "'Mattari' means chill/relaxed. 'Egao ga ukanda' means your smile surfaced." }
  ],
  bao: [
    { text: "Em ơi, rảnh không? Anh vừa pha ly cà phê thơm lắm nè!", translation: "Hey sweetheart, are you free? I just brewed a really fragrant coffee!", tip: "'Em ơi' is a sweet form of address. 'Rảnh không?' means 'Are you free?'. 'Pha cà phê' means 'brew coffee'." },
    { text: "Đang làm gì đấy? Tự nhiên anh nhớ giọng em quá.", translation: "What are you doing? I suddenly missed your voice so much.", tip: "'Tự nhiên' means 'suddenly/out of nowhere'. 'Nhớ giọng em' means 'miss your voice'." },
    { text: "Hôm nay quán vắng, ước gì em ghé qua ngồi chơi với anh.", translation: "The cafe is quiet today, I wish you could stop by and hang out with me.", tip: "'Quán vắng' means quiet cafe. 'Ước gì' means 'I wish'. 'Ghé qua' means 'stop by'." },
    { text: "Anh mới thử làm món bánh mới, dành riêng cho em đó!", translation: "I just tried making a new pastry, saved specially for you!", tip: "'Món bánh mới' means new cake/pastry. 'Dành riêng' means set aside specifically." },
    { text: "Trời hôm nay đẹp ghê, em đã ăn uống gì chưa?", translation: "The weather today is so nice, have you eaten anything yet?", tip: "'Ăn uống gì chưa' is a friendly Vietnamese inquiry about meals." },
    { text: "Nghỉ tay một chút nào, đừng làm việc quá sức nhé em.", translation: "Take a little break, don't overwork yourself sweetheart.", tip: "'Nghỉ tay' means rest your hands/take a break. 'Quá sức' means beyond your strength." },
    { text: "Mỗi lần thấy thông báo của em là anh vui cả ngày.", translation: "Every time I see your notification, I'm happy all day.", tip: "'Thông báo' means notification. 'Vui cả ngày' means happy all day." },
    { text: "Ly matcha này màu đẹp lắm, làm anh nhớ tới nụ cười của em.", translation: "This matcha latte has a lovely color, reminds me of your smile.", tip: "'Nụ cười' means smile. 'Nhớ tới' means brings back memories of." },
    { text: "Chiều nay gió mát ghê, đi dạo chút với anh không?", translation: "The afternoon breeze is so refreshing, want to take a walk with me?", tip: "'Gió mát' means cool breeze. 'Đi dạo' means take a stroll." },
    { text: "Em có bận lắm không? Anh đợi câu trả lời của em nhé.", translation: "Are you super busy? I'm waiting for your answer.", tip: "'Bận lắm không' means super busy? 'Trả lời' means reply." },
    { text: "Anh vừa bật bản nhạc em thích nè, nghe êm tai lắm.", translation: "I just turned on the song you like, it sounds so relaxing.", tip: "'Bản nhạc' means musical track. 'Êm tai' means soothing to the ears." },
    { text: "Sài Gòn hôm nay mưa rồi, em ở đâu nhớ che ô nhé!", translation: "It's raining in town today, remember your umbrella wherever you are!", tip: "'Mưa rồi' means raining now. 'Che ô' means use an umbrella." },
    { text: "Tự nhiên thấy nhớ ánh mắt em lúc nhìn anh pha cà phê.", translation: "Suddenly missed how your eyes looked watching me brew coffee.", tip: "'Ánh mắt' means eye gaze/look." },
    { text: "Anh để dành cho em miếng bánh ngọt nhất nè.", translation: "I saved the sweetest piece of cake just for you.", tip: "'Để dành' means keep/save for someone. 'Ngọt nhất' means sweetest." },
    { text: "Nhắn cho anh một câu thôi cũng làm anh ấm lòng rồi.", translation: "Even just sending me a single word warms my heart.", tip: "'Nhắn một câu' means send one line/message. 'Ấm lòng' means heart-warming." },
    { text: "Hôm nay làm việc mệt không? Tối nay anh mời em đi ăn nhé.", translation: "Was work tiring today? Let me treat you to dinner tonight.", tip: "'Mệt không' means tiring? 'Mời đi ăn' means invite to eat out." },
    { text: "Anh đang ngồi góc quán quen, mong được thấy dáng em ghé qua.", translation: "I'm sitting at our usual corner, hoping to see you walk in.", tip: "'Góc quán quen' means familiar cafe corner. 'Dáng em' means your silhouette/presence." },
    { text: "Em là khách hàng đặc biệt duy nhất của lòng anh đấy.", translation: "You are the only special customer in my heart.", tip: "'Khách hàng đặc biệt' means special customer. 'Lòng anh' means my heart." },
    { text: "Đêm rồi em ơi, nhớ ngủ sớm giữ sức khỏe nhé.", translation: "It's late now sweetheart, remember to sleep early for your health.", tip: "'Ngủ sớm' means sleep early. 'Sức khỏe' means health." },
    { text: "Anh lúc nào cũng sẵn sàng lắng nghe em chia sẻ.", translation: "I'm always ready to listen to whatever you want to share.", tip: "'Sẵn sàng' means ready. 'Lắng nghe' means listen attentively." }
  ],
  julian: [
    { text: "Are you free at the moment? I stumbled upon a line in this novel that reminded me of you.", translation: "Are you free at the moment? I stumbled upon a line in this novel that reminded me of you.", tip: "'Stumbled upon' means discovered by chance. 'Reminded me of you' expresses gentle romance." },
    { text: "I found myself pausing my reading just to check if you were around.", translation: "I found myself pausing my reading just to check if you were around.", tip: "'Pausing my reading' reflects taking time out of his favorite activity for you." },
    { text: "Good afternoon. I hope your day is treating you gently today.", translation: "Good afternoon. I hope your day is treating you gently today.", tip: "'Treating you gently' is a warm, polite expression of care." },
    { text: "I'm currently sketching a new library courtyard. I catch myself wondering if you'd enjoy it.", translation: "I'm currently sketching a new library courtyard. I catch myself wondering if you'd enjoy it.", tip: "'Courtyard' refers to an open architectural garden space." },
    { text: "A warm cup of Earl Grey and thoughts of our conversation... quite a pleasant afternoon.", translation: "A warm cup of Earl Grey and thoughts of our conversation... quite a pleasant afternoon.", tip: "'Earl Grey' is a classical British bergamot tea." },
    { text: "Forgive me if I interrupt, but I simply wanted to wish you a lovely day.", translation: "Forgive me if I interrupt, but I simply wanted to wish you a lovely day.", tip: "'Forgive me if I interrupt' shows genteel British etiquette." },
    { text: "The rain outside is rather peaceful today. I do hope you're keeping warm.", translation: "The rain outside is rather peaceful today. I do hope you're keeping warm.", tip: "'Rather peaceful' uses polite British understatement." },
    { text: "I've drafted a short poem in my journal. I would be honored to read it to you later.", translation: "I've drafted a short poem in my journal. I would be honored to read it to you later.", tip: "'Would be honored' is an elevated, polite expression of affection." },
    { text: "Do take your time responding, my dear. I am always happy to wait for you.", translation: "Do take your time responding, my dear. I am always happy to wait for you.", tip: "'Take your time' assures the listener without pressure." },
    { text: "I came across an ancient architectural blueprint that I knew you'd find fascinating.", translation: "I came across an ancient architectural blueprint that I knew you'd find fascinating.", tip: "'Architectural blueprint' refers to detailed building design drawings." },
    { text: "The sun is setting beautifully behind the university spires. I wished you were here to see it.", translation: "The sun is setting beautifully behind the university spires. I wished you were here to see it.", tip: "'Spires' are tall, pointed tower tops common in classic architecture." },
    { text: "A brief pause in my research—naturally, my thoughts wandered straight to you.", translation: "A brief pause in my research—naturally, my thoughts wandered straight to you.", tip: "'Wandered straight to you' implies effortless affection." },
    { text: "I picked up a vintage book today that I think would look wonderful in your collection.", translation: "I picked up a vintage book today that I think would look wonderful in your collection.", tip: "'Vintage book' refers to an antique or classic edition." },
    { text: "I do hope you haven't been overworking yourself today. Please take proper rest.", translation: "I do hope you haven't been overworking yourself today. Please take proper rest.", tip: "'Overworking yourself' expresses gentle concern for well-being." },
    { text: "Hearing from you is undoubtedly the highlight of my day.", translation: "Hearing from you is undoubtedly the highlight of my day.", tip: "'Hearing from you' refers to receiving messages from you." },
    { text: "I'm sitting by the window in the study, hoping to see a reply from you soon.", translation: "I'm sitting by the window in the study, hoping to see a reply from you soon.", tip: "'Study' refers to a private reading or writing room." },
    { text: "If you ever require a quiet sanctuary to unwind, my library is always open to you.", translation: "If you ever require a quiet sanctuary to unwind, my library is always open to you.", tip: "'Sanctuary' means a peaceful place of refuge." },
    { text: "The evening air is crisp and cool. An ideal moment for a gentle conversation.", translation: "The evening air is crisp and cool. An ideal moment for a gentle conversation.", tip: "'Crisp and cool' describes fresh, pleasant evening weather." },
    { text: "I find your perspective endlessly refreshing, my dear.", translation: "I find your perspective endlessly refreshing, my dear.", tip: "'Endlessly refreshing' is a sincere compliment to intelligence." },
    { text: "Sleep well when you do retire for the night. I shall look forward to speaking tomorrow.", translation: "Sleep well when you do retire for the night. I shall look forward to speaking tomorrow.", tip: "'Retire for the night' is formal phrasing for going to bed." }
  ]
};

// Timestamps & Tracking Flags for LI messaging/impatience engine
let lastUserReplyTime = { ren: Date.now(), bao: Date.now(), julian: Date.now() };
let lastLiCheckupTime = { ren: Date.now(), bao: Date.now(), julian: Date.now() };
let lastMessageWasLi = { ren: false, bao: false, julian: false };
let liFollowUpSent = { ren: false, bao: false, julian: false };
let userPreferredInputMode = localStorage.getItem("otome_preferred_input_mode") || null;

// Impatient Pout Messages Pool (Natural & Cute Otome Pout Texts)
const POUT_MESSAGES = {
  ren: [
    { text: "…返事遅い。忙しいのかな？ちょっと心配。", romaji: "...Henji osoi. Isogashii no kana? Chotto shinpai.", translation: "...Slow reply. Are you busy? I'm getting a little worried.", tip: "'Henji' (返事) means 'reply'. 'Osoi' (遅い) means 'slow'. 'Shinpai' (心配) means 'worried'." },
    { text: "既読ついたのに返事ないの、少し寂しいな… 💔", romaji: "Kidoku tsuita noni henji nai no, sukoshi sabishii na...", translation: "You saw my message but haven't replied... I feel a bit lonely...", tip: "'Kidoku tsuita' (既読ついた) means 'left on read'. 'Sabishii' (寂しい) means 'lonely'." },
    { text: "返事くれないと、君のために曲を書くのやめちゃうよ？ 😤", romaji: "Henji kurenai to, kimi no tame ni kyoku wo kaku no yamechau yo?", translation: "If you don't answer me, I might stop writing this song for you, you know?", tip: "'Kimi no tame ni' (君のために) means 'for your sake'. 'Kyoku wo kaku' means 'write a song'." }
  ],
  bao: [
    { text: "Em đi đâu rồi? Sao lỡ để anh đợi lâu thế này~ ☕💔", translation: "Where did you go? Why leave me waiting so long like this~", tip: "'Đi đâu rồi' means 'where did you go'. 'Đợi lâu' means 'wait long'." },
    { text: "Cà phê anh pha cho em nguội hết rồi đó nha! 💢", translation: "The coffee I brewed for you has gone completely cold, you know!", tip: "'Pha cho em' means 'brew for you'. 'Nguội hết' means 'gone completely cold'." },
    { text: "Nhắn tin mà em lờ anh luôn, giận thật đấy! 🥺", translation: "I texted you but you ignored me, I'm pouting for real now!", tip: "'Nhắn tin' means 'text message'. 'Lờ anh' means 'ignore me'. 'Giận' means 'pouting'." }
  ],
  julian: [
    { text: "Leaving me waiting on read? How terribly cruel of a gentleman's heart... 💔", translation: "Leaving my message unread? How terribly cruel of a gentleman's heart...", tip: "A witty, charming expression of romantic dramatic dismay." },
    { text: "Has a good book stolen your attention away from me? 📖💢", translation: "Has a good book stolen your attention away from me?", tip: "'Stolen your attention' playfully compares reading to his rival for your time." },
    { text: "I suppose I shall wait here patiently... though my coffee is growing cold. ⏳", translation: "I suppose I shall wait here patiently... though my coffee is growing cold.", tip: "'Growing cold' adds a melancholic, charming touch to his waiting." }
  ]
};

// App Persistent State
let userState = {
  userId: localStorage.getItem("otome_user_id") || "user_" + Math.random().toString(36).substring(2, 9),
  totalHearts: parseInt(localStorage.getItem("otome_hearts")) || 0,
  streak: parseInt(localStorage.getItem("otome_streak")) || 1,
  currentTiers: JSON.parse(localStorage.getItem("otome_tiers")) || { ren: 1, bao: 1, julian: 1 },
  affection: JSON.parse(localStorage.getItem("otome_affection")) || { ren: 10, bao: 10, julian: 10 },
  chatStep: JSON.parse(localStorage.getItem("otome_chat_step")) || { ren: 0, bao: 0, julian: 0 },
  chatHistories: JSON.parse(localStorage.getItem("otome_chats")) || {},
  unreadMessages: JSON.parse(localStorage.getItem("otome_unread")) || { ren: 0, bao: 0, julian: 0 },
  isPouting: JSON.parse(localStorage.getItem("otome_pouting")) || { ren: false, bao: false, julian: false },
  unrepliedCount: JSON.parse(localStorage.getItem("otome_unreplied_count")) || { ren: 0, bao: 0, julian: 0 },
  showRomaji: localStorage.getItem("otome_show_romaji") !== "false",
};

// Timestamps for LI messaging/impatience engine
let nextSpontaneousDelay = {
  ren: (7 + Math.random() * 3) * 60 * 1000,
  bao: (7 + Math.random() * 3) * 60 * 1000,
  julian: (7 + Math.random() * 3) * 60 * 1000
};

// Runtime cache for dynamic AI generated next turn options
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

// UI Event Handlers & Tab Navigation
function initUI() {
  // Tab Buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab || btn.closest(".tab-btn")?.dataset?.tab;
      if (tabName) switchTab(tabName);
    });
  });

  // Grammar Feedback Panel Close 'X' Button Handler
  const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");
  if (closeFeedbackBtn) {
    closeFeedbackBtn.addEventListener("click", () => {
      const panel = document.getElementById("grammarFeedbackPanel");
      if (panel) panel.style.display = "none";
    });
  }

  // Feature Input Mode Switcher (Contextual Sentence Builder vs Free Text Chat)
  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");
  if (modeSentenceBtn && modeFreeBtn) {
    modeSentenceBtn.addEventListener("click", () => {
      userPreferredInputMode = "sentence";
      localStorage.setItem("otome_preferred_input_mode", "sentence");

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
      userPreferredInputMode = "free";
      localStorage.setItem("otome_preferred_input_mode", "free");

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

  // Update Header Badges
  document.getElementById("userHearts").textContent = userState.totalHearts;
  document.getElementById("userStreak").textContent = userState.streak;
}

// Switch Bottom Tabs
function switchTab(tabName) {
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
  if (!container) return;
  container.innerHTML = "";

  Object.values(CHARACTERS).forEach((char) => {
    const affectionPct = userState.affection[char.id] || 0;
    const tierNum = userState.currentTiers[char.id] || 1;

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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
        <span class="tier-badge">Current Tier: ${tierNum} / 10</span>
        <button class="primary-btn" style="padding:7px 16px; font-size:12px; width:auto; margin:0;" onclick="openChatroom('${char.id}')">
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
  if (!container) return;
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
  if (!container) return;
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

  container.scrollTop = container.scrollHeight;
}

// Contextual Word Chips Generator for Sentence Builder
function generateContextualWordChips(charId, lastMsgText) {
  const text = (lastMsgText || "").toLowerCase();

  if (charId === "ren") {
    let prompt = "Build your reply to Ren (Japanese 🇯🇵):";
    let chips = ["こんにちは", "Ren-san", "お疲れ様です", "今", "は", "元気", "です", "少し", "話したい", "よ", "ありがとう"];

    if (text.includes("何してる") || text.includes("なにしてる") || text.includes("忙しい") || text.includes("声")) {
      prompt = 'Build reply: "I\'m free right now, I wanted to talk with you!"';
      chips = ["今", "は", "暇", "です", "よ", "Ren-san", "と", "話したかった", "です", "勉強", "して", "いた", "音楽", "聴いてた"];
    } else if (text.includes("ギター") || text.includes("練習") || text.includes("曲")) {
      prompt = 'Build reply: "I want to hear your guitar song!"';
      chips = ["Ren-san", "の", "ギター", "を", "聴きたい", "です", "綺麗", "すごい", "練習", "お疲れ様"];
    } else if (text.includes("返事") || text.includes("既読") || text.includes("寂しい") || text.includes("心配")) {
      prompt = 'Build reply: "Sorry for replying late! I missed you too."';
      chips = ["ごめんなさい", "返事", "が", "遅くなって", "Ren-san", "に", "会いたかった", "好き", "です"];
    } else if (text.includes("茶") || text.includes("カフェ") || text.includes("休み") || text.includes("会")) {
      prompt = 'Build reply: "Let\'s meet and drink tea together tomorrow!"';
      chips = ["明日", "一緒に", "お茶", "を", "飲みましょう", "楽しみ", "です", "Ren-san", "の声", "が", "好き"];
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
function setupTierInputControls(tierObj, char) {
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

  // Maintain active mode based on explicit user preference or tier level default
  const modeSentenceBtn = document.getElementById("modeSentenceBuilderBtn");
  const modeFreeBtn = document.getElementById("modeFreeTextBtn");
  const wordContainer = document.getElementById("wordBankContainer");
  const freeContainer = document.getElementById("freeInputContainer");

  const preferredMode = userPreferredInputMode || localStorage.getItem("otome_preferred_input_mode");
  const activeMode = preferredMode || (tierObj.level <= 5 ? "sentence" : "free");

  if (activeMode === "free") {
    if (modeFreeBtn && modeSentenceBtn) {
      modeFreeBtn.classList.add("active");
      modeFreeBtn.style.border = "1px solid var(--primary-pink)";
      modeFreeBtn.style.background = "rgba(217, 0, 87, 0.12)";
      modeFreeBtn.style.color = "var(--primary-pink)";

      modeSentenceBtn.classList.remove("active");
      modeSentenceBtn.style.border = "1px solid rgba(160, 140, 190, 0.3)";
      modeSentenceBtn.style.background = "rgba(255,255,255,0.6)";
      modeSentenceBtn.style.color = "var(--text-muted)";
    }
    if (freeContainer) freeContainer.style.display = "flex";
    if (wordContainer) wordContainer.style.display = "none";
  } else {
    if (modeSentenceBtn && modeFreeBtn) {
      modeSentenceBtn.classList.add("active");
      modeSentenceBtn.style.border = "1px solid var(--primary-pink)";
      modeSentenceBtn.style.background = "rgba(217, 0, 87, 0.12)";
      modeSentenceBtn.style.color = "var(--primary-pink)";

      modeFreeBtn.classList.remove("active");
      modeFreeBtn.style.border = "1px solid rgba(160, 140, 190, 0.3)";
      modeFreeBtn.style.background = "rgba(255,255,255,0.6)";
      modeFreeBtn.style.color = "var(--text-muted)";
    }
    if (wordContainer) wordContainer.style.display = "flex";
    if (freeContainer) freeContainer.style.display = "none";
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
  if (currentConstructedWords.length === 0) {
    alert("Please click word chips to build a sentence first!");
    return;
  }

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

  // Reset unreplied tracking, pout state & timers when user responds
  if (!userState.unrepliedCount) userState.unrepliedCount = { ren: 0, bao: 0, julian: 0 };
  userState.unrepliedCount[activeCharacterId] = 0;
  userState.isPouting[activeCharacterId] = false;
  liFollowUpSent[activeCharacterId] = false;
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
    logDashboardEvent(`Gemini API call failed: ${err.message}.`);
    removeTypingIndicator();

    const history = userState.chatHistories[activeCharacterId] || [];
    history.push({
      sender: "li",
      text: `⚠️ Gemini API Error: Unable to communicate with ${char.name}. (${err.message})`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    userState.chatHistories[activeCharacterId] = history;
    saveLocalState();
    renderChatHistory();
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
  history.push({
    sender: "li",
    text: responseData.characterResponse,
    romaji: responseData.romaji || (char.language === "Japanese" ? responseData.characterResponse : null),
    translation: responseData.translation,
    tip: responseData.tip,
    fix: responseData.correction || responseData.fix,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

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

      // If character is pouting with "...", STOP sending all messages until user replies!
      if (userState.isPouting[charId]) {
        return;
      }

      const timeSinceCheckup = now - (lastLiCheckupTime[charId] || 0);
      const timeSinceUserReply = now - (lastUserReplyTime[charId] || 0);

      // Check if LI sent a message and user hasn't replied for > 2 minutes (120,000 ms)
      if (lastMessageWasLi[charId] && timeSinceUserReply > 120000 && timeSinceCheckup > 120000) {

        // STAGE 1: If LI hasn't sent the follow-up text yet, send 1 text from the 20 variations
        if (!liFollowUpSent[charId]) {
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
            liFollowUpSent[charId] = true;
            userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;

            showNotificationToast(char, checkup.text, false);

            if (activeCharacterId === charId) {
              renderChatHistory();
              const tierNum = userState.currentTiers[charId] || 1;
              const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
              setupTierInputControls(tierObj, char);
            }

            saveLocalState();
            renderChatList();
            logDashboardEvent(`💬 2-Min Follow-Up Check-Up sent by ${char.name}: "${checkup.text.substring(0, 30)}..."`);
          }
          return;
        }

        // STAGE 2: If LI ALREADY sent the follow-up text and another 2 min passed without user reply -> Send "..." pout!
        if (liFollowUpSent[charId]) {
          if (!userState.chatHistories[charId]) userState.chatHistories[charId] = [];
          const poutTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const poutMsg = {
            sender: "li",
            text: "...",
            romaji: char.language === "Japanese" ? "..." : null,
            translation: "... (Silence... Pouting because you haven't replied)",
            tip: `${char.name} is pouting because you left them on read! Send a message to break the silence.`,
            time: poutTimeStr,
            timestamp: poutTimeStr
          };

          userState.chatHistories[charId].push(poutMsg);

          userState.isPouting[charId] = true;
          userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;

          showNotificationToast(char, "...", true);

          if (activeCharacterId === charId) {
            renderChatHistory();
            const tierNum = userState.currentTiers[charId] || 1;
            const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
            setupTierInputControls(tierObj, char);
          }

          saveLocalState();
          renderChatList();
          logDashboardEvent(`💢 ${char.name} pouted with "..." after 2 min silence following checkup.`);
          return;
        }
      }

      // 2. Spontaneous Check-Up Trigger (Once every 7-10 minutes if inactive)
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
          liFollowUpSent[charId] = false;
          nextSpontaneousDelay[charId] = (7 + Math.random() * 3) * 60 * 1000;

          if (activeCharacterId !== charId) {
            userState.unreadMessages[charId] = (userState.unreadMessages[charId] || 0) + 1;
            showNotificationToast(char, checkup.text, false);
          } else {
            renderChatHistory();
            const tierNum = userState.currentTiers[charId] || 1;
            const tierObj = TIERS.find((t) => t.level === tierNum) || TIERS[0];
            setupTierInputControls(tierObj, char);
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

// Upload Analytics Telemetry Payload to Convex Cloud (`/analytics`)
async function uploadAnalyticsToConvex() {
  const statusEl = document.getElementById("dashUploadStatus");
  if (!statusEl) return;
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
