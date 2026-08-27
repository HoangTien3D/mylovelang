/**
 * Otome Lingua - Story Date Scenarios & Question Database
 * 5 Rich Date Scenarios with 15 questions each (75 total questions)
 * Features dynamic character adaptations for Ado, Kou, and Ren
 * Supporting Vietnamese, English, and Japanese target learning languages.
 */

export const STORY_SCENARIOS = [
  {
    id: 1,
    level: 1,
    title: "Library Study Date & Secret Notes",
    titleVi: "Buổi Học Thư Viện & Những Mảnh Giấy Nhắn",
    titleJa: "図書館の勉強デートと秘密のメモ",
    icon: "📚",
    location: "Central Campus Library (Corner Table)",
    bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)",
    desc: "An after-school library session. Whisper sweet questions, share notes, and practice polite requests behind tall bookshelves.",
    descVi: "Buổi tự học chiều tại góc thư viện yên tĩnh. Trao đổi lời nhắn thì thầm, chia sẻ tài liệu và câu hỏi ngọt ngào.",
    passingScore: 10,
    totalQuestions: 15,
    rewardHearts: 50,
    affPassGain: 4.5,
    affFailPenalty: 2.5
  },
  {
    id: 2,
    level: 2,
    title: "Rainy Cafe & Warm Drinks",
    titleVi: "Quán Cà Phê Ngày Mưa & Ly Trà Ấm",
    titleJa: "雨の日のカフェと温かいドリンク",
    icon: "☕",
    location: "Sweet Blossom Indie Coffeehouse",
    bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #fde68a 100%)",
    desc: "Caught in a sudden afternoon rainstorm. Sit together by a rain-streaked window, order drinks, and warm each other's hearts.",
    descVi: "Cơn mưa rào bất chợt đưa hai người vào góc quán nhỏ. Cùng gọi đồ uống ấm và trò chuyện ngọt ngào.",
    passingScore: 10,
    totalQuestions: 15,
    rewardHearts: 75,
    affPassGain: 5.0,
    affFailPenalty: 2.5
  },
  {
    id: 3,
    level: 3,
    title: "Sunset Riverbank Walk & Street Food",
    titleVi: "Dạo Bờ Sông Hoàng Hôn & Ẩm Thực Phố",
    titleJa: "夕暮れの川辺散歩と屋台グルメ",
    icon: "🌅",
    location: "Scenic Riverside Promenade",
    bgGradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #fbcfe8 100%)",
    desc: "A breezy stroll along the river promenade at golden sunset. Buy tasty snacks, share bites, and walk side-by-side.",
    descVi: "Dạo bước bên bờ sông lộng gió lúc hoàng hôn buông xuống. Cùng thưởng thức bánh tráng nướng và chia sẻ khoảnh khắc vui vẻ.",
    passingScore: 10,
    totalQuestions: 15,
    rewardHearts: 100,
    affPassGain: 5.5,
    affFailPenalty: 3.0
  },
  {
    id: 4,
    level: 4,
    title: "Weekend Night Festival & Fireworks",
    titleVi: "Lễ Hội Đêm Cuối Tuần & Pháo Hoa",
    titleJa: "週末の夜祭りと打ち上げ花火",
    icon: "🎆",
    location: "Lakeside Festival Grounds & Lantern Way",
    bgGradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c4b5fd 100%)",
    desc: "Lively lantern-lit night festival with booth games, sweet treats, crowds, and breathtaking fireworks over the lake.",
    descVi: "Không khí lễ hội đêm lung linh ánh lồng đèn. Chơi trò chơi dân gian, nắm chặt tay qua đám đông và ngắm pháo hoa rực rỡ.",
    passingScore: 10,
    totalQuestions: 15,
    rewardHearts: 125,
    affPassGain: 6.0,
    affFailPenalty: 3.0
  },
  {
    id: 5,
    level: 5,
    title: "Rooftop Stargazing & Confession",
    titleVi: "Ngắm Sao Trên Sân Thượng & Lời Thổ Lộ",
    titleJa: "屋上の星空観察と愛の告白",
    icon: "✨",
    location: "School Rooftop Observatory (Under the Stars)",
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #ec4899 100%)",
    desc: "An intimate evening overlooking city lights and shimmering stars. Open your true heart and seal your bond.",
    descVi: "Buổi tối lãng mạn trên sân thượng lộng gió ngắm ánh đèn thành phố và ngàn sao. Khoảnh khắc bày tỏ tấm lòng chân thành.",
    passingScore: 10,
    totalQuestions: 15,
    rewardHearts: 150,
    affPassGain: 7.5,
    affFailPenalty: 3.5
  }
];

/**
 * Returns 15 tailored questions for a specific scenario, character, and target learning language.
 */
export function getScenarioQuestions(scenarioId, charId = "ado", targetLang = "vi", userProfile = {}) {
  const charKey = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";
  const name = charKey === "ado" ? "Ado" : (charKey === "kou" ? "Kou" : "Ren");
  const pronouns = (userProfile && userProfile.pronouns) ? String(userProfile.pronouns).toLowerCase() : "she/her";
  const isMale = pronouns.includes("he") || pronouns.includes("him");
  
  // Vietnamese address pronouns
  const selfAddress = charKey === "ado" ? "tớ" : (charKey === "kou" ? (isMale ? "anh" : "chị") : "em");
  const partnerAddress = charKey === "ado" ? "cậu" : (charKey === "kou" ? "em" : "anh");
  const partnerCap = charKey === "ado" ? "Cậu" : (charKey === "kou" ? "Em" : "Anh");
  const selfCap = charKey === "ado" ? "Tớ" : (charKey === "kou" ? (isMale ? "Anh" : "Chị") : "Em");

  // Helper generators for Vietnamese questions
  const getViQuestions = (id) => {
    if (id === 1) {
      return [
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu ngồi xuống đây đi, tớ đã giữ chỗ sẵn cạnh cửa sổ rồi."
            : (charKey === "kou" ? `${selfCap} ơi! Em giữ ghế cạnh em cho ${selfAddress} nè!` : "Lại đây ngồi cạnh anh. Thư viện đông lắm, chậm chân là hết chỗ đấy, nhóc."),
          dialogueTrans: "Sit down here, I saved a seat next to me by the window.",
          prompt: "How do you politely thank your partner for saving a seat for you?",
          options: [
            { text: `Cảm ơn ${partnerAddress} nhiều nhé, chu đáo quá!`, sub: `Thank you so much, ${partnerAddress}, you are so thoughtful!` },
            { text: "Để đó đi, tớ tự tìm chỗ khác.", sub: "Leave it, I will find another place myself." },
            { text: "Ghế này cứng quá tớ không thích.", sub: "This chair is too hard, I don't like it." }
          ],
          correctIndex: 0,
          explanation: "Expressing warm appreciation with 'chu đáo quá' (so thoughtful) and the softening particle 'nhé' creates instant romantic connection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bài tập ngữ pháp này hơi khó một chút, cậu đã làm thử chưa?"
            : (charKey === "kou" ? `${selfCap} ơi, câu này Kou chưa hiểu rõ, ${selfAddress} giảng cho em với!` : "Đoạn này ngữ pháp rắc rối đấy, nhóc có cần anh chỉ cho một chút không?"),
          dialogueTrans: "This grammar exercise is a bit tricky, have you tried it yet?",
          prompt: "Which phrase properly asks for guidance or offers to study together?",
          options: [
            { text: `Chúng mình cùng nhau ôn tập ${partnerAddress} nhé!`, sub: `Let's review it together, ${partnerAddress}!` },
            { text: "Khó quá dẹp đi không học nữa.", sub: "Too hard, let's quit studying." },
            { text: "Tự làm đi, hỏi nhiều mệt quá.", sub: "Do it yourself, asking too much is tiring." }
          ],
          correctIndex: 0,
          explanation: "'Chúng mình cùng nhau ôn tập nhé' means 'Let's review together'—encouraging and collaborative!"
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Thư viện phải giữ trật tự đấy nhé, nói nhỏ thôi không cô thủ thư nhắc."
            : (charKey === "kou" ? "Suỵt! Kou sẽ nói thật khẽ vào tai của người ta nè..." : "Nói nhỏ thôi nhóc, xích lại gần đây anh nghe cho rõ."),
          dialogueTrans: "We have to stay quiet in the library, whisper so the librarian doesn't scold us.",
          prompt: "Which word in Vietnamese means 'to whisper / speaking softly'?",
          options: [
            { text: "Thì thầm / Nói nhỏ", sub: "To whisper / speak softly" },
            { text: "Hét to", sub: "To shout loudly" },
            { text: "Cười ầm", sub: "To burst into loud laughter" }
          ],
          correctIndex: 0,
          explanation: "'Thì thầm' means to whisper intimately, and 'nói nhỏ' means to speak quietly."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tớ có ghi chú sẵn từ vựng trong vở này, cậu xem qua đi."
            : (charKey === "kou" ? "Kou vẽ hình trái tim nhỏ trong tập của mình nè!" : "Chữ anh đẹp thế này, nhóc mượn vở anh là có phước lắm đấy."),
          dialogueTrans: "I prepared vocabulary notes in this notebook, take a look.",
          prompt: "How do you compliment their clean, neat handwriting?",
          options: [
            { text: `Chữ của ${partnerAddress} nắn nót và đẹp thật đấy!`, sub: `Your handwriting is truly neat and beautiful!` },
            { text: "Chữ xấu như gà bới vậy.", sub: "Your handwriting looks like chicken scratches." },
            { text: "Vở này bẩn quá tớ không đọc đâu.", sub: "This notebook is too dirty, I won't read it." }
          ],
          correctIndex: 0,
          explanation: "'Nắn nót' describes meticulously neat and beautiful handwriting—a great compliment for your crush."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có mang theo bút dạ quang màu hồng không? Tớ để quên ở lớp rồi."
            : (charKey === "kou" ? `${selfCap} cho Kou mượn cây bút chì với ạ!` : "Nhóc đưa anh cây bút nhớ xem nào, anh gạch ý chính cho."),
          dialogueTrans: "Do you have a highlighter/pen I can borrow for a moment?",
          prompt: "How do you lend your stationery with a sweet smile?",
          options: [
            { text: `Đây nè, ${partnerAddress} cứ dùng thoải mái nha!`, sub: `Here you go, feel free to use it as much as you like!` },
            { text: "Không có, tự đi mua đi.", sub: "Don't have any, go buy your own." },
            { text: "Dùng xong phải trả một trăm nghìn.", sub: "After using you must pay 100k." }
          ],
          correctIndex: 0,
          explanation: "'Cứ dùng thoải mái nha' (Feel free to use it) paired with 'nha' is polite, warm, and inviting."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Học với cậu cảm giác thời gian trôi qua nhanh thật đấy."
            : (charKey === "kou" ? `Ở cạnh ${selfAddress}, Kou chẳng muốn về nhà xíu nào hết á!` : "Ở cạnh anh thấy dễ chịu đúng không? Chứ ngồi một mình buồn ngủ chết."),
          dialogueTrans: "Studying with you makes time fly by so fast.",
          prompt: "What is the best affectionate response to this feeling?",
          options: [
            { text: `${selfCap} cũng thấy thời gian trôi nhanh khi ở bên ${partnerAddress}.`, sub: `I also feel time flies when I am by your side.` },
            { text: "Mới có 10 phút mà kêu nhanh.", sub: "It's only been 10 minutes and you complain." },
            { text: "Tớ thấy chán muốn xỉu đây này.", sub: "I'm bored to death here." }
          ],
          correctIndex: 0,
          explanation: "'Ở bên...' (to be beside / with someone) conveys sweet companionship and emotional closeness."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu học chăm chỉ như vậy, chắc chắn kỳ thi này sẽ đạt điểm cao!"
            : (charKey === "kou" ? `Senpai của Kou giỏi nhất luôn! Cố lên nha ${selfAddress} ơi!` : "Ngoan ngoãn tập trung như thế thì anh mới thương chứ."),
          dialogueTrans: "Working so hard like this, you will definitely achieve top marks!",
          prompt: "Which tone mark does the word 'chăm' (in chăm chỉ - hardworking) carry?",
          options: [
            { text: "Thanh Ngang (Level tone, no tone mark)", sub: "Unmarked natural level pitch" },
            { text: "Dấu Sắc (High rising mark: á)", sub: "Rising pitch" },
            { text: "Dấu Nặng (Drop dot mark: ạ)", sub: "Heavy dot pitch" }
          ],
          correctIndex: 0,
          explanation: "'Chăm' in 'chăm chỉ' has no tone mark, so it is pronounced with the standard Level tone (Thanh Ngang)."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có thấy khát nước không? Tớ có mang bình trà hoa cúc nè."
            : (charKey === "kou" ? "Kou có hộp kẹo dâu ngọt lịm nè, mình chia nhau ăn nhé!" : "Uống miếng nước đi nhóc, học nhiều khô họng rồi kìa."),
          dialogueTrans: "Are you thirsty? I brought some tea/treats to share.",
          prompt: "How do you accept the kind offer warmly?",
          options: [
            { text: `Cảm ơn ${partnerAddress}, ${partnerAddress} chu đáo quá à!`, sub: `Thank you, you are so thoughtful!` },
            { text: "Trà gì dở ẹc, không uống đâu.", sub: "What bad tea, I won't drink." },
            { text: "Để đó lát nữa tính.", sub: "Leave it there, I will deal with it later." }
          ],
          correctIndex: 0,
          explanation: "'Chu đáo quá à' highlights how attentive and caring your date is being."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Á... ngón tay chạm vào nhau rồi... C-cậu có giật mình không?"
            : (charKey === "kou" ? "Hihi tay em chạm tay người ta rồi nè! Ấm ghê á!" : "Đụng trúng tay anh rồi đấy nhé, nhóc có ngại không?"),
          dialogueTrans: "Ah... our fingers brushed against each other... Did I startle you?",
          prompt: "How do you react to this cute heart-fluttering moment?",
          options: [
            { text: `Không sao đâu, tay của ${partnerAddress} ấm lắm...`, sub: `It's totally okay, your hand is so warm...` },
            { text: "Tránh xa tớ ra, đừng có chạm vào!", sub: "Stay away from me, don't touch!" },
            { text: "Đi rửa tay ngay đi nhé.", sub: "Go wash your hands right away." }
          ],
          correctIndex: 0,
          explanation: "Saying 'tay ấm lắm' (your hand is so warm) shows genuine romantic receptiveness."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tớ vừa gấp một mảnh giấy ghi chú nhỏ kẹp vào sách của cậu đấy..."
            : (charKey === "kou" ? "Em viết một lời chúc bí mật trong trang sách nè!" : "Anh lén vẽ hình nhóc vào sổ rồi đấy, về nhà hẵng mở ra xem."),
          dialogueTrans: "I slipped a small secret note into your book page...",
          prompt: "What does the phrase 'mảnh giấy ghi chú' mean in English?",
          options: [
            { text: "A small sticky note / note paper", sub: "Handwritten note slip" },
            { text: "A heavy dictionary book", sub: "Large reference text" },
            { text: "A receipt from a store", sub: "Payment bill" }
          ],
          correctIndex: 0,
          explanation: "'Mảnh giấy ghi chú' translates to a small note slip or study note paper."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đoạn văn này có từ 'Thương', cậu có biết nghĩa của nó sâu sắc thế nào không?"
            : (charKey === "kou" ? "Kou thích từ 'Thương' lắm, vừa yêu vừa muốn che chở đó ạ!" : "Anh thấy từ 'Thương' hợp với nhóc nhất đấy."),
          dialogueTrans: "This sentence contains the word 'Thương'. Do you know how deeply meaningful it is?",
          prompt: "What is the emotional nuance of the word 'Thương' in Vietnamese?",
          options: [
            { text: "Deep protective caring, cherishing & love beyond just liking", sub: "Cherishing & caring love" },
            { text: "A cold polite business greeting", sub: "Formal greeting" },
            { text: "A minor annoyance or complaint", sub: "Negative reaction" }
          ],
          correctIndex: 0,
          explanation: "'Thương' is a profound Vietnamese concept combining deep affectionate love with the earnest desire to protect and care for someone."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Sắp tới giờ thư viện đóng cửa rồi, nhanh thật đấy..."
            : (charKey === "kou" ? "Ước gì thư viện mở cửa suốt đêm để được ở cạnh hoài!" : "Đến giờ về rồi à? Anh còn chưa muốn buông nhóc ra đâu."),
          dialogueTrans: "It's almost closing time for the library, that was fast...",
          prompt: "Which phrase suggests walking home together after studying?",
          options: [
            { text: `Chúng mình cùng đi về chung ${partnerAddress} nhé?`, sub: `Shall we walk home together?` },
            { text: "Tớ về trước đây, mặc kệ cậu.", sub: "I'm going home first, don't care about you." },
            { text: "Cậu ở lại quét rác một mình đi.", sub: "You stay and sweep trash alone." }
          ],
          correctIndex: 0,
          explanation: "'Đi về chung... nhé' is the classic sweet invitation to walk home together after study hours."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có muốn ngày mai chúng mình lại tiếp tục học cùng nhau không?"
            : (charKey === "kou" ? "Mai mình lại hẹn nhau ở đây nữa nha, hứa với Kou đi!" : "Mai lại ngoan ngoãn đến đây học với anh tiếp, nghe chưa?"),
          dialogueTrans: "Would you like to study together again tomorrow?",
          prompt: "How do you make a cute, firm promise to meet again tomorrow?",
          options: [
            { text: `Chắc chắn rồi! ${selfCap} hứa với ${partnerAddress} nha!`, sub: `Definitely! I promise you!` },
            { text: "Không rảnh, mai tớ đi chơi với người khác.", sub: "Not free, tomorrow I hang out with someone else." },
            { text: "Phiền phức quá, đừng rủ nữa.", sub: "So annoying, don't invite me again." }
          ],
          correctIndex: 0,
          explanation: "'Chắc chắn rồi! Hứa nha!' conveys enthusiasm and commitment to your blooming romance."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mảnh giấy lúc nãy tớ viết... cậu nhớ về nhà mới được mở ra đọc đấy nhé!"
            : (charKey === "kou" ? "Về tới phòng hẵng xem nha, không Kou ngại đỏ mặt mất!" : "Mảnh giấy anh để trong túi áo nhóc đấy, nhớ đọc kỹ từng chữ."),
          dialogueTrans: "The note from earlier... remember to only open it when you get home, okay?",
          prompt: "Which particle adds a gentle, playful teasing tone to your agreement?",
          options: [
            { text: `Dạ được rồi, ${selfAddress} nghe lời ${partnerAddress} nè!`, sub: `Yes okay, I will listen to you!` },
            { text: "Tớ vứt vào sọt rác rồi.", sub: "I threw it in the trash can already." },
            { text: "Viết nhảm nhí thì đọc làm gì.", sub: "If you wrote nonsense why read it." }
          ],
          correctIndex: 0,
          explanation: "'Nghe lời... nè!' shows endearing cooperation and playful affection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Hôm nay... tớ rất vui vì có cậu ở bên cạnh."
            : (charKey === "kou" ? "Hôm nay là ngày Kou vui và hạnh phúc nhất luôn á!" : "Nhờ có nhóc mà hôm nay anh thấy vui hơn hẳn ngày thường."),
          dialogueTrans: "Today... I was truly so happy to have you by my side.",
          prompt: "Select the final sweet line to conclude your library study date:",
          options: [
            { text: `${selfCap} cũng rất hạnh phúc vì có ${partnerAddress} trong đời.`, sub: `I am also so happy to have you in my life.` },
            { text: "Bình thường thôi, không có gì đặc biệt.", sub: "Just normal, nothing special." },
            { text: "Mau về đi, nói nhiều quá.", sub: "Hurry home, talking too much." }
          ],
          correctIndex: 0,
          explanation: "'Hạnh phúc vì có bạn trong đời' is a breathtakingly romantic closing line for a high-scoring date!"
        }
      ];
    } else if (id === 2) {
      // Scenario 2: Rainy Cafe & Warm Drinks
      return [
        {
          partnerDialogue: charKey === "ado" 
            ? "Mưa lớn quá! Mau vào đây trú đi cậu, kẻo ướt hết áo bây giờ."
            : (charKey === "kou" ? `${selfCap} ơi mau vào quán với Kou, mưa to ướt tóc ${selfAddress} rồi kìa!` : "Vào đây nhanh nào nhóc, đứng ngoài đấy để bị cảm à?"),
          dialogueTrans: "It's raining so heavily! Quick, step inside so you don't get soaked.",
          prompt: "How do you respond as you step into the cozy warm cafe?",
          options: [
            { text: `May mà có ${partnerAddress} kéo ${selfAddress} vào kịp lúc!`, sub: `Good thing you pulled me inside just in time!` },
            { text: "Mưa thì mặc kệ tớ, quan tâm làm gì.", sub: "If it rains leave me alone, why care." },
            { text: "Quán này trông tối tăm quá.", sub: "This cafe looks too dim." }
          ],
          correctIndex: 0,
          explanation: "Acknowledging their timely rescue builds warmth and shared intimacy immediately."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu ngồi xuống chiếc bàn cạnh cửa kính này nhé, ngắm mưa rất đẹp."
            : (charKey === "kou" ? "Kou thích ngồi sát bên cạnh người ta như vầy nè!" : "Ngồi sát vào trong đây với anh, ngoài này gió lùa lạnh đấy."),
          dialogueTrans: "Sit down at this table by the glass window, watching the rain is lovely.",
          prompt: "Which word means 'rain' in Vietnamese?",
          options: [
            { text: "Cơn mưa / Mưa", sub: "Rain / Rain shower" },
            { text: "Nắng gắt", sub: "Harsh sunlight" },
            { text: "Tuyết rơi", sub: "Snowfall" }
          ],
          correctIndex: 0,
          explanation: "'Mưa' (or 'Cơn mưa') is the Vietnamese word for rain."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu muốn uống gì nào? Để tớ ra quầy gọi cho."
            : (charKey === "kou" ? "Kou gọi món cho hai đứa mình nha! Người ta thích uống gì nè?" : "Muốn uống gì nào nhóc? Hôm nay anh bao hết."),
          dialogueTrans: "What would you like to drink? Let me order at the counter.",
          prompt: "How do you order an iced milk coffee or hot peach tea politely?",
          options: [
            { text: `Cho ${selfAddress} một ly trà đào cam sả ấm nhé!`, sub: `Please give me a warm lemongrass orange peach tea!` },
            { text: "Lấy cái gì đắt nhất ra đây.", sub: "Bring out whatever is most expensive." },
            { text: "Không uống gì hết, ngồi nhìn thôi.", sub: "Won't drink anything, just sit and stare." }
          ],
          correctIndex: 0,
          explanation: "'Cho... một ly trà... nhé' is the standard natural Vietnamese phrasing for cafe orders."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Khăn giấy đây nè, để tớ lau bớt giọt nước mưa trên trán cho cậu."
            : (charKey === "kou" ? "Để em nhẹ nhàng lau nước mưa trên má cho nha!" : "Lại gần đây anh lau nước mưa trên tóc cho, đừng cựa quậy."),
          dialogueTrans: "Here is a napkin, let me wipe the raindrops off your forehead/cheek.",
          prompt: "What is the sweetest reaction to this tender gesture?",
          options: [
            { text: `Cảm ơn ${partnerAddress}, ${partnerAddress} dịu dàng quá à...`, sub: `Thank you, you are so gentle and caring...` },
            { text: "Tránh ra, dơ bẩn quá!", sub: "Get away, so gross!" },
            { text: "Tự lau được không cần phiền.", sub: "Can wipe myself, don't need the trouble." }
          ],
          correctIndex: 0,
          explanation: "'Dịu dàng quá à' (so gentle and sweet) highlights the emotional connection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Trà ấm vừa mang ra rồi, thơm mùi hoa cúc và đào mật ong ghê."
            : (charKey === "kou" ? "Thơm phức luôn nè! Người ta thử một ngụm xem có ngon không nha!" : "Thơm đấy chứ? Thử một ngụm xem có vừa miệng không, nhóc."),
          dialogueTrans: "The hot tea just arrived, it smells delightfully like chamomile and honey peach.",
          prompt: "Which adjective means 'fragrant / pleasantly aromatic' in Vietnamese?",
          options: [
            { text: "Thơm / Thơm phức", sub: "Fragrant / wonderfully aromatic" },
            { text: "Cay xè", sub: "Burning spicy" },
            { text: "Đắng ngắt", sub: "Extremely bitter" }
          ],
          correctIndex: 0,
          explanation: "'Thơm' means fragrant, and 'thơm phức' emphasizes rich, delicious aromas."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu uống cẩn thận kẻo nóng đấy nhé, thổi nhẹ một chút đã."
            : (charKey === "kou" ? "Nóng đó nha, để Kou thổi phù phù cho nguội bớt nè!" : "Uống từ từ thôi kẻo bỏng lưỡi, anh lại phải xót."),
          dialogueTrans: "Drink carefully so you don't burn yourself, blow gently on it first.",
          prompt: "How do you thank them for being so considerate?",
          options: [
            { text: `Biết rồi nè, cảm ơn vì đã luôn quan tâm đến ${selfAddress} nha!`, sub: `I know, thank you for always caring about me!` },
            { text: "Nói nhiều như bà già vậy.", sub: "Talking as much as an old woman." },
            { text: "Bỏng thì kệ tớ, liên quan gì.", sub: "If I burn it's my business, what's it to you." }
          ],
          correctIndex: 0,
          explanation: "'Cảm ơn vì đã luôn quan tâm...' acknowledges their steady care and affection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Nhìn mưa rơi ngoài cửa kính thế này... bình yên thật đấy."
            : (charKey === "kou" ? "Ngồi bên cạnh người ta trong quán ấm áp như vầy thích ghê á!" : "Bên ngoài mưa lạnh nhưng trong này có nhóc ngồi kế bên ấm áp hẳn."),
          dialogueTrans: "Watching rain against the glass like this... it feels so peaceful.",
          prompt: "Which word expresses 'peaceful / serene' in Vietnamese?",
          options: [
            { text: "Bình yên / Yên ả", sub: "Peaceful / tranquil & serene" },
            { text: "Ồn ào náo nhiệt", sub: "Noisy and chaotic" },
            { text: "Tức giận", sub: "Angry / frustrated" }
          ],
          correctIndex: 0,
          explanation: "'Bình yên' captures tranquil, heartwarming peace shared between close partners."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "À... trên mép môi cậu dính một chút bọt sữa kìa..."
            : (charKey === "kou" ? "Hihi bọt sữa dính trên môi dễ thương như mèo con vậy á!" : "Dính bọt sữa trên môi rồi kìa nhóc, nhìn ngố mà cưng ghê."),
          dialogueTrans: "Ah... there's a little bit of milk foam on your upper lip...",
          prompt: "How do you respond playfully as they point it out?",
          options: [
            { text: `Ủa thật hả? ${partnerAddress} lau giúp ${selfAddress} với được không?`, sub: `Really? Could you help me wipe it off?` },
            { text: "Cười cái gì mà cười, vô duyên!", sub: "What are you laughing at, rude!" },
            { text: "Dính thì kệ người ta, soi mói quá.", sub: "So what if it's there, stop nitpicking." }
          ],
          correctIndex: 0,
          explanation: "Asking 'Lau giúp với được không?' turns a clumsy moment into an adorable romantic spark."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mỗi khi trời mưa, tớ thường nghe vài bản nhạc lofi nhẹ nhàng. Cậu có thích nghe nhạc không?"
            : (charKey === "kou" ? "Kou chia cho người ta một bên tai nghe nè, cùng nghe bài hát Kou thích nha!" : "Đeo một bên tai nghe vào đây với anh, bài này anh nghe hoài không chán."),
          dialogueTrans: "Whenever it rains I love soft lofi music. Do you want to share earphones?",
          prompt: "How do you accept the shared earphone warmly?",
          options: [
            { text: `Giai điệu hay quá, nghe cùng ${partnerAddress} càng thấy tuyệt hơn!`, sub: `The melody is lovely, listening with you makes it even better!` },
            { text: "Nhạc dở tệ, tắt ngay đi.", sub: "Terrible music, turn it off immediately." },
            { text: "Tai nghe bẩn lắm không thèm đeo.", sub: "Earphones too dirty, won't wear them." }
          ],
          correctIndex: 0,
          explanation: "Complimenting the shared music enhances the intimate cafe atmosphere."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tớ có mang theo cuốn sổ tay mini, hay là chúng mình cùng vẽ vài hình ngộ nghĩnh đi?"
            : (charKey === "kou" ? "Kou vẽ hình hai đứa mình cầm chung một cây dù nè!" : "Để anh phác họa chân dung nhóc xem có ra dáng tiểu thư không."),
          dialogueTrans: "I have a mini sketchbook, shall we doodle something cute together?",
          prompt: "Which sentence accurately compliments their drawing in Vietnamese?",
          options: [
            { text: `Bức tranh ${partnerAddress} vẽ trông đáng yêu và sống động quá!`, sub: `The drawing you made looks so adorable and lively!` },
            { text: "Vẽ xấu như ma cà rồng.", sub: "Drawing looks as ugly as a vampire." },
            { text: "Đừng có vẽ bậy bạ vào sổ.", sub: "Don't doodle nonsense in the notebook." }
          ],
          correctIndex: 0,
          explanation: "'Đáng yêu và sống động' (adorable and lively) is a charming compliment."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có thấy lạnh không? Tớ để áo khoác qua vai cậu nhé."
            : (charKey === "kou" ? "Kou cho người ta mượn áo khoác nè, áo em thơm mùi nắng ấm lắm!" : "Khoác áo của anh vào đi, người nhỏ xíu mà chịu lạnh dở ẹc."),
          dialogueTrans: "Are you feeling chilly? Let me drape my jacket over your shoulders.",
          prompt: "How do you accept the warm jacket with heart-fluttering gratitude?",
          options: [
            { text: `Cảm ơn ${partnerAddress}, áo khoác vừa ấm vừa thơm mùi của ${partnerAddress} nữa...`, sub: `Thank you, the jacket is so warm and smells like you...` },
            { text: "Áo hôi quá, không thèm khoác.", sub: "Jacket smells bad, won't wear it." },
            { text: "Tôi không có lạnh, bỏ ra đi.", sub: "I'm not cold, take it off." }
          ],
          correctIndex: 0,
          explanation: "Noticing that the jacket smells sweet and comforting is an otome staple that raises affection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Hôm nay tớ khao ly nước này nhé, đừng từ chối đấy."
            : (charKey === "kou" ? "Lần này Kou bao nha, lần sau người ta lại đi chơi với em là được!" : "Anh trả tiền rồi, nhóc chỉ việc uống cho ngon miệng thôi."),
          dialogueTrans: "I'll treat you to this drink today, please don't refuse.",
          prompt: "What does the informal Vietnamese verb 'khao' or 'bao' mean in this context?",
          options: [
            { text: "To treat someone / pay for the bill", sub: "Cover the expenses as a treat" },
            { text: "To demand a refund", sub: "Ask for money back" },
            { text: "To spill the drink accidentally", sub: "Knock over liquid" }
          ],
          correctIndex: 0,
          explanation: "'Khao' (or 'Bao') is the casual, friendly term for treating someone to a meal or drink."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mưa bên ngoài bắt đầu tạnh dần rồi... hơi tiếc một chút nhỉ?"
            : (charKey === "kou" ? "Mưa tạnh rồi kìa... Em ước gì trời cứ mưa hoài để được ngồi ngắm người ta mãi!" : "Mưa tạnh nhanh thế? Anh còn đang muốn ở riêng với nhóc lâu thêm chút nữa."),
          dialogueTrans: "The rain outside is starting to clear up... a bit bittersweet, isn't it?",
          prompt: "How do you express that you also wished the moment lasted longer?",
          options: [
            { text: `${selfCap} cũng ước thời gian ngừng lại lúc này...`, sub: `I also wish time could stop right at this moment...` },
            { text: "Tạnh mưa rồi thì mau biến về đi.", sub: "Rain stopped, so hurry up and go home." },
            { text: "Cuối cùng cũng hết mưa, ngồi đây mỏi lưng quá.", sub: "Finally stopped raining, my back hurts sitting here." }
          ],
          correctIndex: 0,
          explanation: "'Ước thời gian ngừng lại lúc này' conveys genuine romantic longing and deep attachment."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Lần sau nếu trời lại mưa, cậu có đồng ý cùng tớ đến đây nữa không?"
            : (charKey === "kou" ? "Lần sau trời mưa lại dẫn em đi cafe nữa nha, hứa nhé!" : "Lần tới có mưa hay không thì nhóc cũng phải đi cafe với anh tiếp đấy."),
          dialogueTrans: "Next time it rains, will you come here with me again?",
          prompt: "Which sentence confirms the promise with endearing warmth?",
          options: [
            { text: `Nhất định rồi! Hễ trời mưa là ${selfAddress} sẽ nhớ tới ${partnerAddress} đầu tiên!`, sub: `Definitely! Whenever it rains, you'll be the first one I think of!` },
            { text: "Tùy tâm trạng, chưa chắc đâu.", sub: "Depends on my mood, not for sure." },
            { text: "Đi một lần là ngán tới cổ rồi.", sub: "Going once is already more than enough." }
          ],
          correctIndex: 0,
          explanation: "'Hễ trời mưa là nhớ tới...' is an unforgettable romantic affirmation."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cảm ơn cậu vì một buổi chiều mưa thật ấm áp."
            : (charKey === "kou" ? "Kou thích buổi hẹn cafe hôm nay nhiều lắm lắm luôn á!" : "Hôm nay đi chơi với nhóc làm tâm trạng anh tốt lên nhiều đấy."),
          dialogueTrans: "Thank you for such a warm and sweet rainy afternoon.",
          prompt: "Choose the perfect farewell line as you step out under the refreshed sky:",
          options: [
            { text: `Về nhà cẩn thận và nhắn tin cho ${selfAddress} khi tới nơi nhé!`, sub: `Get home safely and text me when you arrive!` },
            { text: "Về lẹ đi, đứng đây hoài.", sub: "Go home fast, standing here forever." },
            { text: "Hôm nay tốn thời gian quá.", sub: "Today wasted so much time." }
          ],
          correctIndex: 0,
          explanation: "'Nhắn tin cho mình khi tới nơi nhé' (Text me when you arrive) shows tender, loving care."
        }
      ];
    } else if (id === 3) {
      // Scenario 3: Sunset Riverbank Walk & Street Food
      return [
        {
          partnerDialogue: charKey === "ado" 
            ? "Gió sông lúc hoàng hôn mát thật đấy, cậu đi cẩn thận kẻo vấp bậc thang nhé."
            : (charKey === "kou" ? "Bờ sông hoàng hôn đẹp quá kìa! Kou muốn đi dạo cạnh người ta mãi thôi!" : "Đi sát vào lề trong này nhóc, xe cộ đông đúc coi chừng đấy."),
          dialogueTrans: "The river breeze at sunset is so refreshing, watch your step on the promenade.",
          prompt: "How do you comment on the breathtaking sunset view in Vietnamese?",
          options: [
            { text: "Hoàng hôn hôm nay đẹp và lãng mạn quá!", sub: "The sunset today is so beautiful and romantic!" },
            { text: "Trời tối thui chẳng thấy gì cả.", sub: "Sky is pitch black can't see anything." },
            { text: "Gió thổi bụi bay vào mắt rát quá.", sub: "Wind blowing dust into eyes hurts." }
          ],
          correctIndex: 0,
          explanation: "'Hoàng hôn hôm nay đẹp và lãng mạn quá!' sets the perfect tone for a riverside stroll."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Phía trước có xe bánh tráng nướng và xiên que kìa, cậu có đói bụng không?"
            : (charKey === "kou" ? "Oa! Mùi bánh tráng nướng thơm phức kìa! Em thèm ăn quá!" : "Ngửi thấy mùi đồ nướng thơm chưa nhóc? Lại đây anh mua cho."),
          dialogueTrans: "There's a grilled rice paper and skewer street vendor ahead, are you hungry?",
          prompt: "Which Vietnamese food is famous as the 'Vietnamese street pizza' (crispy grilled rice paper)?",
          options: [
            { text: "Bánh tráng nướng", sub: "Crispy grilled rice paper with egg & toppings" },
            { text: "Bánh chưng", sub: "Square sticky rice cake" },
            { text: "Canh chua", sub: "Sour fish tamarind soup" }
          ],
          correctIndex: 0,
          explanation: "'Bánh tráng nướng' is celebrated street food often called Vietnamese street pizza."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có ăn cay được không để tớ bảo người ta giảm bớt ớt lại?"
            : (charKey === "kou" ? "Kou không ăn cay giỏi đâu, người ta có ăn cay được không nè?" : "Nhóc ăn cay được không đấy? Coi chừng vừa ăn vừa khóc nhè nhé."),
          dialogueTrans: "Can you handle spicy food so I can ask them to adjust the chili sauce?",
          prompt: "How do you communicate your spice preference politely?",
          options: [
            { text: "Cho ít cay thôi nhé, vừa ăn là ngon nhất!", sub: "Just a little mild spice please, mild is the tastiest!" },
            { text: "Cho cay đến chết người xem nào.", sub: "Make it deadly spicy." },
            { text: "Bỏ đại đi hỏi nhiều quá.", sub: "Just throw whatever in, asking too much." }
          ],
          correctIndex: 0,
          explanation: "'Cho ít cay thôi nhé' is polite and clearly conveys mild spice preference."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bánh nóng hổi vừa ra lò đây, để tớ bẻ đôi chia cho cậu miếng to hơn nè."
            : (charKey === "kou" ? "Nóng giòn rụm luôn nè! Người ta cắn miếng đầu tiên đi ạ!" : "Há miệng ra anh đút cho miếng này, giòn tan luôn."),
          dialogueTrans: "It's piping hot fresh from the grill, let me share the crispy piece with you.",
          prompt: "Which Vietnamese onomatopoeia describes crispy, crunchy food?",
          options: [
            { text: "Giòn rụm / Giòn tan", sub: "Crispy & crunchy" },
            { text: "Mềm nhũn", sub: "Soggy and limp" },
            { text: "Dai nhách", sub: "Extremely chewy" }
          ],
          correctIndex: 0,
          explanation: "'Giòn rụm' and 'giòn tan' are sensory words describing delicious crispy street snacks."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu ăn thấy có vừa miệng không? Vị béo của phô mai và trứng cút ngon nhỉ."
            : (charKey === "kou" ? "Ngon xỉu luôn đúng không ạ! Được ăn chung với người ta là ngon gấp bội luôn á!" : "Ngon không nhóc? Thấy nhóc ăn ngon miệng anh cũng vui lây."),
          dialogueTrans: "How does it taste? The cheese and quail egg flavor is delicious, right?",
          prompt: "How do you praise the street snack enthusiastically?",
          options: [
            { text: "Ngon tuyệt vời luôn! Ăn cùng bạn lại càng ngon hơn nữa!", sub: "Incredibly delicious! Eating with you makes it even tastier!" },
            { text: "Dở ẹc chẳng ra làm sao.", sub: "Tastes terrible, not good at all." },
            { text: "Bình thường, thua đồ mẹ nấu.", sub: "Ordinary, worse than mom's cooking." }
          ],
          correctIndex: 0,
          explanation: "Highlighting that eating together makes food taste twice as good boosts romance."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Á... trên má cậu có dính một chút mỡ hành kìa, đứng yên tớ lấy khăn lau cho."
            : (charKey === "kou" ? "Hihi dính sốt trên má rồi kìa, để Kou lau nhẹ cho nha!" : "Ăn mà dính tùm lum như con nít vậy, lại đây anh lau cho nào."),
          dialogueTrans: "Ah... there's a little green onion oil on your cheek, hold still while I wipe it.",
          prompt: "How do you react to their close, caring touch?",
          options: [
            { text: `Ngại quá à... Cảm ơn ${partnerAddress} đã chu đáo chăm sóc ${selfAddress} nha!`, sub: `So bashful... Thank you for taking such sweet care of me!` },
            { text: "Tự lau được, đừng có đụng vào mặt tôi!", sub: "Can wipe myself, don't touch my face!" },
            { text: "Khăn giấy bẩn quá vứt đi.", sub: "Dirty tissue, throw it away." }
          ],
          correctIndex: 0,
          explanation: "Expressing sweet shyness ('Ngại quá à') paired with gratitude deepens the bond."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Ánh nắng hoàng hôn chiếu lên mắt cậu lấp lánh như mặt nước sông vậy..."
            : (charKey === "kou" ? "Mắt của người ta đẹp long lanh dưới ánh hoàng hôn luôn á!" : "Nhìn nghiêng dưới ánh hoàng hôn trông nhóc cũng ra dáng xinh xắn đấy nhỉ."),
          dialogueTrans: "The sunset glow reflecting in your eyes sparkles just like the river water...",
          prompt: "Which phrase means 'sparkling / glistening' in Vietnamese?",
          options: [
            { text: "Lấp lánh / Long lanh", sub: "Sparkling / glistening beautifully" },
            { text: "U ám tối tăm", sub: "Gloomy and dark" },
            { text: "Bụi bặm", sub: "Dusty and dirty" }
          ],
          correctIndex: 0,
          explanation: "'Lấp lánh' and 'long lanh' describe sparkling, radiant light."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Chúng mình cùng chụp chung một tấm ảnh hoàng hôn làm kỷ niệm nhé?"
            : (charKey === "kou" ? "Chụp hình đôi đi ạ! Em muốn lưu giữ khoảnh khắc này làm hình nền điện thoại!" : "Lại đây đứng sát vào anh chụp tấm ảnh nào, cười tươi lên nhóc."),
          dialogueTrans: "Shall we take a selfie together with the sunset as a souvenir?",
          prompt: "How do you accept the photo invitation with a bright smile?",
          options: [
            { text: `Được chứ! Cùng cười thật tươi nào 1... 2... 3 cheese!`, sub: `Of course! Let's smile brightly 1... 2... 3 cheese!` },
            { text: "Không chụp, mặt tôi xấu lắm.", sub: "Won't take photos, my face is ugly." },
            { text: "Chụp hình tốn pin điện thoại.", sub: "Taking photos drains phone battery." }
          ],
          correctIndex: 0,
          explanation: "Posing warmly for a couple souvenir photo is a major milestone in dating."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Gió sông thổi mạnh hơn rồi đấy, cậu có thấy lạnh tay không?"
            : (charKey === "kou" ? "Tay em lạnh nè, người ta sưởi ấm cho Kou được không ạ?" : "Tay nhóc lạnh ngắt rồi kìa, đưa đây anh ủ ấm cho."),
          dialogueTrans: "The river wind is picking up, are your hands getting cold?",
          prompt: "How do you gently hold hands or share warmth?",
          options: [
            { text: `Tay ${partnerAddress} ấm ghê... Được nắm tay ${partnerAddress} thế này thích thật.`, sub: `Your hand is so warm... Holding hands like this feels wonderful.` },
            { text: "Bỏ tay ra mau lên, kỳ cục quá!", sub: "Let go of my hand quickly, so weird!" },
            { text: "Lạnh thì kệ tôi liên quan gì đến cậu.", sub: "If I'm cold it's my problem." }
          ],
          correctIndex: 0,
          explanation: "'Được nắm tay thế này thích thật' conveys honest romantic affection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Nhìn các cặp đôi xung quanh thả hoa đăng trên sông kìa, cậu có muốn thả thử một chiếc không?"
            : (charKey === "kou" ? "Mình cùng thả hoa đăng ước nguyện nha! Kou ước được ở bên người ta mãi mãi!" : "Mua một chiếc hoa đăng đi nhóc, cầu cho nhóc lúc nào cũng ngoan ngoãn bên anh."),
          dialogueTrans: "Look at the floating lanterns on the river, want to release a wish lantern together?",
          prompt: "What is a 'hoa đăng' in Vietnamese cultural tradition?",
          options: [
            { text: "A floating paper flower lantern for making wishes on rivers", sub: "Floating river lantern" },
            { text: "A heavy stone anchor", sub: "Boat equipment" },
            { text: "A type of sour soup bowl", sub: "Cooking dish" }
          ],
          correctIndex: 0,
          explanation: "'Hoa đăng' is a traditional floating candle lantern released onto rivers to carry sincere heartfelt wishes."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Chiếc hoa đăng trôi trên mặt nước lung linh quá... Cậu vừa ước điều gì thế?"
            : (charKey === "kou" ? "Kou ước điều bí mật liên quan đến người ta á, còn người ta ước gì nè?" : "Ước gì đấy nhóc? Có phải ước ngày nào cũng được gặp anh không?"),
          dialogueTrans: "The lantern floating on the water is so luminous... What did you just wish for?",
          prompt: "What is the sweetest, most romantic answer to their question?",
          options: [
            { text: `${selfCap} ước rằng chúng mình sẽ luôn đồng hành và bên nhau thật lâu.`, sub: `I wished that we will always walk together and stay side by side for a long time.` },
            { text: "Ước cho cậu biến mất khỏi mắt tôi.", sub: "Wished for you to disappear from my sight." },
            { text: "Nói ra mất linh, không thèm nói.", sub: "Saying it ruins the magic, won't tell." }
          ],
          correctIndex: 0,
          explanation: "Wishing to stay together for a long time ('bên nhau thật lâu') melts hearts."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đèn đường dọc bờ sông bắt đầu sáng rực lên rồi, thành phố lên đèn đẹp ghê."
            : (charKey === "kou" ? "Đèn lấp lánh như trong truyện cổ tích luôn á!" : "Đèn phố lên rồi kìa, nhìn nhóc trong ánh đèn lung linh hơn đấy."),
          dialogueTrans: "The streetlamps along the river are lighting up, the city looks so lovely.",
          prompt: "Which Vietnamese verb means 'to light up / shine bright'?",
          options: [
            { text: "Thắp sáng / Sáng rực", sub: "To light up / shine radiantly" },
            { text: "Tắt ngúm", sub: "To go completely dark" },
            { text: "Chìm nghỉm", sub: "To sink into water" }
          ],
          correctIndex: 0,
          explanation: "'Thắp sáng' (to light up) and 'sáng rực' (radiantly glowing) describe luminous city evenings."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đi bộ dạo nãy giờ, chân cậu có bị mỏi không?"
            : (charKey === "kou" ? "Nếu mỏi chân thì Kou cõng người ta về nha!" : "Mỏi chân chưa nhóc? Lại ghế đá đằng kia ngồi nghỉ với anh một lát."),
          dialogueTrans: "We've been walking for a while, are your feet getting tired?",
          prompt: "How do you reply as you sit down together on a riverbank bench?",
          options: [
            { text: `Có hơi mỏi một xíu, nhưng ngồi nghỉ cạnh ${partnerAddress} là thấy khỏe liền!`, sub: `A tiny bit tired, but resting beside you makes me energized right away!` },
            { text: "Mỏi chết đi được, tại cậu rủ đi bộ đấy.", sub: "Exhausted to death, because you invited me to walk." },
            { text: "Ghế đá này dơ quá không thèm ngồi.", sub: "Stone bench is too dirty, won't sit." }
          ],
          correctIndex: 0,
          explanation: "Saying that resting beside them makes you feel instantly better is sweet and affectionate."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tối nay... tớ cảm thấy gần gũi với cậu hơn rất nhiều."
            : (charKey === "kou" ? "Hôm nay đi chơi vui đến mức tối nay về Kou sẽ thao thức không ngủ được mất!" : "Đi dạo với nhóc làm anh thấy nhẹ nhõm hẳn. Lần sau lại đi nữa nhé."),
          dialogueTrans: "Tonight... I feel so much closer to you.",
          prompt: "What does 'gần gũi' mean in Vietnamese?",
          options: [
            { text: "Close / Intimate / Emotionally connected", sub: "Warm intimate connection" },
            { text: "Distant and cold", sub: "Unfriendly and aloof" },
            { text: "Angry and bitter", sub: "Resentful emotion" }
          ],
          correctIndex: 0,
          explanation: "'Gần gũi' signifies closeness, intimacy, and warm emotional bonding."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Để tớ đưa cậu về tận cổng nhà nhé, trời tối rồi đi một mình nguy hiểm lắm."
            : (charKey === "kou" ? "Kou đưa người ta về tận nhà nha, để bảo vệ người ta mà!" : "Anh hộ tống nhóc về tận nhà, không được từ chối đâu đấy."),
          dialogueTrans: "Let me walk you all the way back to your doorstep, it's dark outside.",
          prompt: "Select the sweetest final line for this sunset riverbank date:",
          options: [
            { text: `Cảm ơn ${partnerAddress} vì một buổi tối tuyệt vời và ấm áp!`, sub: `Thank you for such a wonderful and warm evening!` },
            { text: "Khỏi cần, tôi tự về được đừng đi theo.", sub: "No need, I can go home alone don't follow." },
            { text: "Phiền phức quá đi mau lên.", sub: "So troublesome, hurry up." }
          ],
          correctIndex: 0,
          explanation: "Expressing heartfelt gratitude for the wonderful night completes the date scenario with maximum romance!"
        }
      ];
    } else if (id === 4) {
      // Scenario 4: Weekend Night Festival & Fireworks
      return [
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu đến rồi à? Trang phục hôm nay của cậu... trông rất hợp và xinh đẹp lắm."
            : (charKey === "kou" ? "Oa! Hôm nay người ta mặc đồ đẹp xỉu luôn! Kou nhìn mà tim đập thình thịch nè!" : "Nhóc tới rồi đấy à? Hôm nay ăn diện xinh xắn thế này làm anh suýt nhận không ra đấy."),
          dialogueTrans: "You arrived! Your festival outfit today looks so lovely and suits you so well.",
          prompt: "How do you return the compliment on their festival attire?",
          options: [
            { text: `${partnerCap} hôm nay cũng bảnh bao và cuốn hút lắm đó nha!`, sub: `You look so dashing and attractive today too!` },
            { text: "Mặc đồ xấu thế mà cũng khen.", sub: "Wearing ugly clothes and you still praise." },
            { text: "Đương nhiên rồi, nhìn lại cậu xem.", sub: "Of course, look at yourself instead." }
          ],
          correctIndex: 0,
          explanation: "'Bảnh bao và cuốn hút' (dashing and attractive) is an irresistible compliment."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Lễ hội đông người lắm, cậu nắm chặt lấy tay tớ kẻo bị lạc giữa đám đông nhé."
            : (charKey === "kou" ? "Đông người quá, Kou nắm chặt tay người ta nha, không buông ra đâu đó!" : "Đưa tay đây anh dắt đi. Lóng ngóng như nhóc lạc một cái là anh không tìm đâu đấy."),
          dialogueTrans: "The festival is so crowded, hold my hand tightly so we don't get separated.",
          prompt: "Which Vietnamese verb phrase means 'to hold hands'?",
          options: [
            { text: "Nắm tay / Nắm chặt tay", sub: "To hold hands / hold hands tightly" },
            { text: "Bỏ chạy", sub: "To run away" },
            { text: "Xô đẩy", sub: "To shove and push" }
          ],
          correctIndex: 0,
          explanation: "'Nắm tay' is the essential romantic expression for holding hands."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Phía trước có gian hàng ném vòng trúng thưởng kìa, cậu có muốn thử không?"
            : (charKey === "kou" ? "Gian hàng trò chơi kìa! Kou muốn ném trúng con gấu bông tặng người ta!" : "Thích con thú bông nào trong quầy kia nhóc? Anh ném trúng đem về cho."),
          dialogueTrans: "There's a ring-toss prize booth ahead, do you want to try winning a prize?",
          prompt: "How do you cheer enthusiastically for your partner at the game booth?",
          options: [
            { text: `Cố lên ${partnerAddress} ơi! ${selfCap} tin chắc ${partnerAddress} sẽ làm được!`, sub: `You can do it! I firmly believe you will make it!` },
            { text: "Ném trượt là quê một cục ráng chịu.", sub: "If you miss it's your embarrassment." },
            { text: "Trò con nít này chơi làm gì.", sub: "Why play this childish game." }
          ],
          correctIndex: 0,
          explanation: "Cheering enthusiastically builds camaraderie and romantic excitement."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Trúng rồi! Tớ đổi được chú gấu bông nhỏ này tặng cho cậu nè."
            : (charKey === "kou" ? "Trúng rồi trúng rồi! Gấu bông xinh xắn này Kou tặng riêng cho người ta nè!" : "Thấy tài thiện xạ của anh chưa? Cầm lấy con gấu này mà ôm mỗi tối nhớ đến anh nhé."),
          dialogueTrans: "Bullseye! I won this plushie to give to you.",
          prompt: "How do you express delight upon receiving the prize?",
          options: [
            { text: `Ôi dễ thương quá! Cảm ơn ${partnerAddress}, ${selfAddress} sẽ trân trọng nó thật nhiều!`, sub: `Oh so cute! Thank you, I will cherish it so much!` },
            { text: "Con gấu xấu xí này cho con nít à.", sub: "This ugly bear is for toddlers." },
            { text: "Thắng có con thú nhỏ xíu cũng khoe.", sub: "Winning a tiny animal and you brag." }
          ],
          correctIndex: 0,
          explanation: "'Trân trọng nó thật nhiều' (cherish it deeply) communicates sincere gratitude."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mùi kẹo bông gòn ngọt ngào ghê, chúng mình mua một cây kẹo bông màu hồng nhé?"
            : (charKey === "kou" ? "Kẹo bông gòn khổng lồ luôn nè! Hai đứa mình cùng cắn chung một miếng nha!" : "Ăn kẹo bông gòn không nhóc? Cắn một miếng xem có ngọt bằng giọng của nhóc không."),
          dialogueTrans: "The cotton candy smells so sweet, shall we share a giant pink one?",
          prompt: "What is 'kẹo bông gòn' in Vietnamese?",
          options: [
            { text: "Cotton candy / Fairy floss", sub: "Sweet spun sugar cloud" },
            { text: "Chewing gum", sub: "Bubble gum" },
            { text: "Sour hard candy", sub: "Citrus hard drops" }
          ],
          correctIndex: 0,
          explanation: "'Kẹo bông gòn' is Vietnamese for cotton candy."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Hàng lồng đèn rực rỡ này lung linh quá, màu sắc ngập tràn khắp phố."
            : (charKey === "kou" ? "Lồng đèn sáng rực rỡ như bầu trời đầy sao vậy á!" : "Đứng dưới dàn đèn lồng này trông nhóc nổi bật nhất cả khu phố đấy."),
          dialogueTrans: "These colorful lanterns along the avenue are glowing brilliantly.",
          prompt: "Which pair of adjectives describes radiant festive lights in Vietnamese?",
          options: [
            { text: "Rực rỡ và lung linh", sub: "Radiant and magical/shimmering" },
            { text: "U tối và ảm đạm", sub: "Dark and gloomy" },
            { text: "Đơn điệu và nhạt nhòa", sub: "Monotonous and faded" }
          ],
          correctIndex: 0,
          explanation: "'Rực rỡ và lung linh' conveys vibrant colors and sparkling festive lighting."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Sắp tới giờ bắn pháo hoa rồi, tớ biết một chỗ trên đồi cỏ nhìn ra hồ rất thoáng."
            : (charKey === "kou" ? "Mau lên đồi cỏ ngắm pháo hoa với em nè, chỗ đó đẹp nhất luôn á!" : "Lại đây với anh, lên mỏm đồi này ngắm pháo hoa vừa riêng tư vừa rõ nét."),
          dialogueTrans: "It's almost fireworks time, I know an elevated grassy knoll overlooking the lake.",
          prompt: "How do you agree to follow them to the secret viewing spot?",
          options: [
            { text: `Tuyệt vời quá! ${partnerCap} dẫn đường, ${selfAddress} đi theo ${partnerAddress} ngay nè!`, sub: `Wonderful! Lead the way, I'll follow you right away!` },
            { text: "Đứng đây xem cũng được, đi chi cho mỏi giò.", sub: "Standing here is fine, why walk and tire feet." },
            { text: "Chỗ đó muỗi cắn chết không đi đâu.", sub: "Mosquitoes there will bite to death, won't go." }
          ],
          correctIndex: 0,
          explanation: "Following their lead enthusiastically creates romantic excitement."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đứng trên đồi này gió mát thật, nhìn toàn cảnh lễ hội bên dưới như một dải ngân hà."
            : (charKey === "kou" ? "Đẹp quá đi mất! Kou được đứng ngắm cảnh cùng người ta là mãn nguyện lắm rồi!" : "Ở đây yên tĩnh hơn hẳn dưới kia rồi. Giờ thì chỉ có anh với nhóc thôi đấy."),
          dialogueTrans: "Standing on this hill the breeze is so cool, the festival below looks like a galaxy.",
          prompt: "What does 'toàn cảnh' mean in Vietnamese?",
          options: [
            { text: "Panoramic view / full landscape overview", sub: "Wide panoramic scenery" },
            { text: "A narrow alleyway", sub: "Small side street" },
            { text: "A dark tunnel", sub: "Underground passage" }
          ],
          correctIndex: 0,
          explanation: "'Toàn cảnh' translates directly to panoramic overview or wide landscape vista."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bùm! Pháo hoa bắt đầu nổ rồi kìa! Đẹp quá cậu ơi!"
            : (charKey === "kou" ? "Pháo hoa sáng rực cả bầu trời kìa người ta ơi! Đẹp lung linh luôn!" : "Pháo hoa nở rồi đấy nhóc. Nhìn lên trời kìa, rực rỡ chưa?"),
          dialogueTrans: "Boom! The fireworks are bursting! Look how gorgeous it is!",
          prompt: "Which Vietnamese word means 'fireworks'?",
          options: [
            { text: "Pháo hoa", sub: "Fireworks / aerial displays" },
            { text: "Sấm chớp", sub: "Thunder & lightning storm" },
            { text: "Mưa đá", sub: "Hailstones" }
          ],
          correctIndex: 0,
          explanation: "'Pháo hoa' is the Vietnamese word for festive fireworks."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Ánh sáng pháo hoa chiếu rọi khuôn mặt cậu... đẹp đến mức tớ không thể rời mắt được."
            : (charKey === "kou" ? "Pháo hoa đẹp nhưng Kou thấy người ta còn xinh đẹp hơn gấp vạn lần!" : "Pháo hoa sáng rực trên trời nhưng mắt anh chỉ muốn nhìn nhóc thôi."),
          dialogueTrans: "The fireworks illumination on your face is so breathtaking I cannot take my eyes away.",
          prompt: "How do you react to this deeply romantic confession under the fireworks?",
          options: [
            { text: `Tim ${selfAddress} đang đập nhanh lắm... vì ${partnerAddress} đấy.`, sub: `My heart is beating so fast... because of you.` },
            { text: "Nói xàm quá, ngắm pháo hoa đi.", sub: "Nonsense, watch the fireworks." },
            { text: "Bị lé mắt hay sao mà nhìn hoài.", sub: "Are you cross-eyed looking all the time." }
          ],
          correctIndex: 0,
          explanation: "'Tim đang đập nhanh vì bạn đấy' acknowledges mutual vulnerability and romantic tension."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tiếng pháo hoa nổ to quá, để tớ che tai lại cho cậu đỡ giật mình nhé."
            : (charKey === "kou" ? "Để Kou ôm che chở cho người ta khỏi sợ tiếng pháo nổ nha!" : "Lại đây nép vào ngực anh này, pháo nổ to thế giật bắn cả mình."),
          dialogueTrans: "The fireworks booms are so loud, let me shield your ears so you don't get startled.",
          prompt: "What does this protective action symbolize in romantic storytelling?",
          options: [
            { text: "Attentive protection and emotional reassurance", sub: "Caring protective intimacy" },
            { text: "A sign of hostility and rejection", sub: "Negative distancing" },
            { text: "A prank to confuse the partner", sub: "Playful trick" }
          ],
          correctIndex: 0,
          explanation: "Shielding ears or drawing closer during loud fireworks is an iconic expression of protective devotion."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Những chùm pháo hoa nở rộ trên trời... tớ ước khoảnh khắc này kéo dài mãi mãi."
            : (charKey === "kou" ? "Em ước đêm lễ hội này đừng bao giờ kết thúc để hai đứa mình mãi ở bên nhau!" : "Nhìn pháo hoa tàn làm anh thấy tiếc. Nhưng nếu năm nào cũng đi với nhóc thì anh không tiếc nữa."),
          dialogueTrans: "The bursts of fireworks in the sky... I wish this moment could last forever.",
          prompt: "Which Vietnamese idiom/phrase expresses 'everlasting / timeless bond'?",
          options: [
            { text: "Bền lâu mãi mãi / Dài lâu", sub: "Everlasting / timeless and enduring" },
            { text: "Chốc lát thoáng qua", sub: "Fleeting moment" },
            { text: "Hời hợt qua loa", sub: "Superficial" }
          ],
          correctIndex: 0,
          explanation: "'Bền lâu mãi mãi' represents enduring, everlasting romantic dedication."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Lễ hội năm sau, và những năm sau nữa... chúng mình vẫn cùng nhau đi như thế này nhé?"
            : (charKey === "kou" ? "Năm sau người ta cũng phải đi lễ hội với Kou nữa đấy nha, ngoắc tay thề nè!" : "Hứa với anh đi nhóc, lễ hội nào sau này cũng chỉ được đi riêng với anh thôi."),
          dialogueTrans: "Next year's festival, and all the years after... we will still come together like this, right?",
          prompt: "How do you lock in the pinky promise in Vietnamese?",
          options: [
            { text: `Ngoắc tay hứa nè! ${selfCap} hứa sẽ luôn đi cùng ${partnerAddress}!`, sub: `Pinky promise! I promise to always go with you!` },
            { text: "Hứa suông làm gì, mệt người.", sub: "Why make empty promises, tiring." },
            { text: "Năm sau tôi đi với người yêu mới.", sub: "Next year I go with a new lover." }
          ],
          correctIndex: 0,
          explanation: "'Ngoắc tay hứa nè' is the endearing pinky promise ritual."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đám đông đang tản dần ra rồi, đường về đêm mát mẻ và yên bình ghê."
            : (charKey === "kou" ? "Đường về có ánh trăng sáng soi đường cho hai đứa mình nè!" : "Dắt nhóc đi dạo trong đêm thế này làm anh chẳng nỡ buông tay ra xíu nào."),
          dialogueTrans: "The crowds are dispersing, the night path home is cool and serene.",
          prompt: "Which word means 'moonlight' in Vietnamese?",
          options: [
            { text: "Ánh trăng / Vầng trăng", sub: "Moonlight / glowing moon" },
            { text: "Cơn bão tố", sub: "Heavy storm" },
            { text: "Ánh mặt trời", sub: "Sunlight" }
          ],
          correctIndex: 0,
          explanation: "'Ánh trăng' refers to gentle, romantic moonlight."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đêm nay là kỷ niệm đẹp nhất mà tớ từng có... Ngủ ngon nhé, người đặc biệt của tớ."
            : (charKey === "kou" ? "Cảm ơn vì đã cho Kou một đêm tuyệt vời nhất trần đời! Ngủ ngon và mơ thấy Kou nha!" : "Về phòng ngủ ngoan nhé nhóc. Tối nay chắc chắn anh sẽ mơ thấy em."),
          dialogueTrans: "Tonight is the sweetest memory I've ever had... Sleep well, my special one.",
          prompt: "Choose the most heartwarming goodnight message in Vietnamese:",
          options: [
            { text: `Chúc ${partnerAddress} ngủ thật ngon và có những giấc mơ ngọt ngào nhé!`, sub: `Wishing you a good sleep and sweet dreams!` },
            { text: "Tắt máy ngủ đi, đừng làm phiền nữa.", sub: "Turn off phone and sleep, don't bother me." },
            { text: "Biết rồi, khỏi chúc.", sub: "I know, no need to wish." }
          ],
          correctIndex: 0,
          explanation: "'Chúc ngủ ngon và có những giấc mơ ngọt ngào' is the sweetest goodnight farewell."
        }
      ];
    } else {
      // Scenario 5: Rooftop Stargazing & Confession
      return [
        {
          partnerDialogue: charKey === "ado" 
            ? "Khẽ thôi nào, tớ vừa mở được cánh cửa lên sân thượng rồi... Cậu lên đây đi."
            : (charKey === "kou" ? "Suỵt! Lên sân thượng bí mật với Kou nè! Nơi này chỉ có hai đứa mình biết thôi á!" : "Lên đây với anh nhóc, đêm nay trời đầy sao, ở đây ngắm là tuyệt nhất."),
          dialogueTrans: "Quietly now, I unlocked the rooftop door... come up here with me.",
          prompt: "How do you respond as you step out onto the quiet stargazing rooftop?",
          options: [
            { text: `Bầu trời đêm ở đây nhìn rộng lớn và huyền ảo quá!`, sub: `The night sky from here looks so vast and magical!` },
            { text: "Gió lạnh muốn chết, kéo lên đây làm gì.", sub: "Freezing wind, why drag me up here." },
            { text: "Bị bảo vệ bắt là tôi đổ thừa cậu đấy.", sub: "If security catches us I'll blame you." }
          ],
          correctIndex: 0,
          explanation: "'Rộng lớn và huyền ảo' captures the vast, enchanting starlit atmosphere."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu nhìn kìa, hàng ngàn ánh đèn thành phố bên dưới lấp lánh như một biển sao thứ hai."
            : (charKey === "kou" ? "Đèn thành phố lung linh lấp lánh đẹp như tranh vẽ luôn á!" : "Nhìn thành phố bên dưới xem, nhỏ bé hẳn. Nhưng đứng cạnh nhóc thì anh thấy trọn vẹn."),
          dialogueTrans: "Look down there, thousands of city lights sparkling like a second sea of stars.",
          prompt: "Which Vietnamese phrase means 'city lights at night'?",
          options: [
            { text: "Ánh đèn thành phố / Đèn đêm rực rỡ", sub: "City lights / radiant night lights" },
            { text: "Rừng cây rậm rạp", sub: "Dense forest trees" },
            { text: "Ruộng lúa mênh mông", sub: "Vast rice paddies" }
          ],
          correctIndex: 0,
          explanation: "'Ánh đèn thành phố' refers to the glittering city night lights."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Thật ra... tớ đã muốn dẫn cậu lên đây từ rất lâu rồi."
            : (charKey === "kou" ? "Kou giữ bí mật chỗ này lâu lắm rồi, chỉ muốn dành riêng cho người ta thôi á!" : "Chỗ này là góc bí mật của anh, chưa từng dẫn ai lên ngoại trừ nhóc."),
          dialogueTrans: "Truth is... I have wanted to bring you up here for such a long time.",
          prompt: "How do you ask why they chose to share this secret spot with you?",
          options: [
            { text: `Tại sao ${partnerAddress} lại chọn chia sẻ nơi đặc biệt này với ${selfAddress}?`, sub: `Why did you choose to share this special place with me?` },
            { text: "Chắc dẫn cả chục đứa lên đây rồi chứ gì.", sub: "Probably brought dozens of people here already." },
            { text: "Chỗ này có gì đâu mà làm quá lên.", sub: "Nothing special here why exaggerate." }
          ],
          correctIndex: 0,
          explanation: "Asking with sincere curiosity allows them to open their heart in return."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bởi vì... trong lòng tớ, cậu là người duy nhất tớ muốn cùng chia sẻ những điều quý giá nhất."
            : (charKey === "kou" ? "Bởi vì Kou thương người ta nhất trên đời! Chỉ muốn ngắm sao cùng người ta thôi!" : "Bởi vì trong mắt anh chỉ có mỗi nhóc là xứng đáng đứng cạnh anh ở đây."),
          dialogueTrans: "Because... in my heart, you are the only one I want to share my most precious moments with.",
          prompt: "Which Vietnamese word means 'the only one / unique'?",
          options: [
            { text: "Duy nhất / Người duy nhất", sub: "The only one / sole special person" },
            { text: "Bất kỳ ai", sub: "Anyone at all" },
            { text: "Người xa lạ", sub: "A stranger" }
          ],
          correctIndex: 0,
          explanation: "'Duy nhất' means unique / the only one—the highest tier of otome romantic confession."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Từ ngày có cậu xuất hiện, cuộc sống học đường của tớ trở nên tươi sáng hơn rất nhiều."
            : (charKey === "kou" ? "Có người ta ở bên là mỗi ngày của Kou đều tràn ngập niềm vui và tiếng cười!" : "Có nhóc bên cạnh trêu chọc làm anh thấy cuộc sống này bớt nhàm chán hẳn."),
          dialogueTrans: "Since you appeared in my life, my school days have become so much brighter.",
          prompt: "How do you express that they also brought warmth and light into your life?",
          options: [
            { text: `${selfCap} cũng cảm ơn ${partnerAddress} vì đã luôn là ánh sáng ấm áp của ${selfAddress}.`, sub: `I also thank you for always being my warm guiding light.` },
            { text: "Nói năng cải lương sến súa quá đi.", sub: "So cheesy and theatrical." },
            { text: "Tự nhiên làm tôi thấy phiền thêm thì có.", sub: "You actually brought me more trouble." }
          ],
          correctIndex: 0,
          explanation: "'Ánh sáng ấm áp' (warm light) responds with poetic balance and deep tenderness."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Kìa... một ngôi sao băng vừa lướt qua bầu trời đêm!"
            : (charKey === "kou" ? "Sao băng kìa! Mau nhắm mắt lại ước đi người ta ơi!" : "Sao băng rơi kìa nhóc, ước nhanh lên xem điều ước có linh nghiệm không."),
          dialogueTrans: "Look... a shooting star just streaked across the night sky!",
          prompt: "What is a 'sao băng' in Vietnamese?",
          options: [
            { text: "Shooting star / Meteor", sub: "Falling star across the sky" },
            { text: "Airplane light", sub: "Aircraft beacon" },
            { text: "Hot air balloon", sub: "Festival craft" }
          ],
          correctIndex: 0,
          explanation: "'Sao băng' translates to a shooting star or meteor."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu đã ước điều gì thế? Có thể chia sẻ cho tớ nghe được không?"
            : (charKey === "kou" ? "Kou ước điều ước lớn nhất cuộc đời mình rồi, còn người ta thì sao nè?" : "Ước xong chưa nhóc? Bật mí cho anh nghe xem nào."),
          dialogueTrans: "What did you wish for? Could you share it with me?",
          prompt: "Choose the romantic confession line to confess your wish:",
          options: [
            { text: `${selfCap} ước rằng tình cảm của hai chúng mình sẽ đơm hoa kết trái thật ngọt ngào.`, sub: `I wished that our feelings for each other will blossom into sweet romance.` },
            { text: "Ước trúng số một trăm tỷ chứ ước gì.", sub: "Wished to win the lottery jackpot." },
            { text: "Không liên quan đến cậu, đừng tò mò.", sub: "Not related to you, don't be curious." }
          ],
          correctIndex: 0,
          explanation: "'Tình cảm đơm hoa kết trái' is a graceful, poetic expression for love blooming into reality."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tim tớ... đang đập rất nhanh. Tớ không muốn giấu giếm cảm xúc này thêm một giây phút nào nữa."
            : (charKey === "kou" ? "Kou hồi hộp quá nè, tim em đập thình thịch như muốn nhảy ra ngoài luôn!" : "Nhìn thẳng vào mắt anh này nhóc. Anh có chuyện nghiêm túc muốn nói với em."),
          dialogueTrans: "My heart... is racing so fast. I don't want to hide my feelings for another second.",
          prompt: "Which Vietnamese phrase means 'to confess love / pour out one's feelings'?",
          options: [
            { text: "Thổ lộ tình cảm / Tỏ tình", sub: "To confess romantic feelings / confession" },
            { text: "Tranh cãi gay gắt", sub: "Heated argument" },
            { text: "Bỏ cuộc giữa chừng", sub: "Giving up midway" }
          ],
          correctIndex: 0,
          explanation: "'Thổ lộ tình cảm' or 'Tỏ tình' means to confess romantic feelings."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tớ thích cậu. Không phải chỉ như bạn bè bình thường... mà là muốn che chở và yêu thương cậu bằng cả trái tim."
            : (charKey === "kou" ? "Kou yêu người ta nhiều lắm! Xin hãy cho Kou cơ hội được làm bạn trai của người ta nhé!" : "Anh thích nhóc rồi đấy. Từ nay về sau, em chính thức là người yêu duy nhất của anh."),
          dialogueTrans: "I love you. Not just as a friend... but I want to cherish and love you with all my heart.",
          prompt: "How do you respond to this direct romantic confession with full devotion?",
          options: [
            { text: `${selfCap} cũng yêu ${partnerAddress} rất nhiều! ${selfCap} đồng ý!`, sub: `I love you so much too! I happily say yes!` },
            { text: "Xin lỗi, tôi chỉ xem cậu là bạn học.", sub: "Sorry, I only see you as a classmate." },
            { text: "Để tôi suy nghĩ mười năm nữa rồi trả lời.", sub: "Let me think for 10 years then answer." }
          ],
          correctIndex: 0,
          explanation: "Saying 'Em cũng yêu anh / Tớ cũng yêu cậu rất nhiều! Em đồng ý!' is the peak climax moment of romantic success!"
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu đồng ý rồi sao...? Tớ... tớ hạnh phúc đến mức không biết phải nói gì nữa..."
            : (charKey === "kou" ? "Aaaaa! Người ta đồng ý rồi! Kou vui sướng nhất trần đời luôn nè!" : "Ngoan lắm. Từ giờ nhóc là của anh rồi nhé, không được chạy đi đâu nữa."),
          dialogueTrans: "You agreed...? I'm... I'm so blissfully happy I don't even know what to say...",
          prompt: "Which word describes overwhelming romantic joy and bliss in Vietnamese?",
          options: [
            { text: "Hạnh phúc ngập tràn / Vui sướng", sub: "Overwhelming happiness & joy" },
            { text: "Buồn bã tuyệt vọng", sub: "Sadness and despair" },
            { text: "Thất vọng chán nản", sub: "Disappointed and discouraged" }
          ],
          correctIndex: 0,
          explanation: "'Hạnh phúc ngập tràn' conveys overflowing, pure romantic bliss."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Gió đêm se lạnh... để tớ ôm cậu một cái thật chặt để sưởi ấm nhé?"
            : (charKey === "kou" ? "Cho Kou ôm người ta một cái thật chặt nha! Ấm áp quá à!" : "Lại đây anh ôm một cái nào, từ giờ có anh sưởi ấm rồi không sợ lạnh nữa."),
          dialogueTrans: "The night breeze is chilly... let me hold you in a warm hug, okay?",
          prompt: "Which phrase means 'a warm embrace / tight hug' in Vietnamese?",
          options: [
            { text: "Ôm thật chặt / Vòng tay ấm áp", sub: "A tight hug / warm embrace" },
            { text: "Đẩy ra xa", sub: "Pushing far away" },
            { text: "Bỏ chạy trốn", sub: "Running away" }
          ],
          correctIndex: 0,
          explanation: "'Ôm thật chặt' and 'Vòng tay ấm áp' represent a loving, comforting embrace."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mùi hương của cậu thật dịu nhẹ... Tớ hứa sẽ luôn ở bên và trân trọng cậu mỗi ngày."
            : (charKey === "kou" ? "Kou hứa sẽ luôn nghe lời và làm cho người ta cười mỗi ngày luôn á!" : "Anh hứa sẽ luôn bảo vệ nhóc, không để ai bắt nạt em đâu."),
          dialogueTrans: "Your scent is so gentle... I promise to always stay by your side and cherish you every day.",
          prompt: "How do you reciprocate their vow of devotion?",
          options: [
            { text: `${selfCap} cũng hứa sẽ luôn tin tưởng và yêu thương ${partnerAddress} trọn vẹn.`, sub: `I also promise to always trust and love you completely.` },
            { text: "Hứa cho vui mồm chứ tin sao được.", sub: "Promises are just words, can't trust them." },
            { text: "Đừng có thề thốt lung tung.", sub: "Don't make random vows." }
          ],
          correctIndex: 0,
          explanation: "'Tin tưởng và yêu thương trọn vẹn' promises unwavering trust and wholehearted love."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bầu trời đêm hôm nay có hàng triệu vì sao, nhưng ngôi sao sáng nhất trong lòng tớ... chính là cậu."
            : (charKey === "kou" ? "Người ta là ngôi sao sáng nhất trong tim Kou luôn nè!" : "Trời có bao nhiêu sao cũng không sánh bằng nụ cười của nhóc trong mắt anh."),
          dialogueTrans: "There are millions of stars in the night sky, but the brightest star in my heart... is you.",
          prompt: "What does 'ngôi sao sáng nhất' mean in English?",
          options: [
            { text: "The brightest star", sub: "Most radiant star" },
            { text: "A dark cloud", sub: "Storm cloud" },
            { text: "A cold winter wind", sub: "Freezing gust" }
          ],
          correctIndex: 0,
          explanation: "'Ngôi sao sáng nhất' translates directly to 'the brightest star'."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Hãy cùng nhau nắm tay đi qua những năm tháng học trò thật đẹp nhé."
            : (charKey === "kou" ? "Từ mai hai đứa mình cùng đi học chung, đi ăn chung nha!" : "Từ giờ nhóc là người yêu của anh rồi, sẵn sàng đón nhận tình cảm của anh chưa?"),
          dialogueTrans: "Let us walk hand-in-hand through all our beautiful school years together.",
          prompt: "Which Vietnamese phrase means 'hand-in-hand together'?",
          options: [
            { text: "Tay trong tay / Đồng hành bên nhau", sub: "Hand in hand / walking side by side" },
            { text: "Mỗi người một ngả", sub: "Parting separate ways" },
            { text: "Quay lưng bước đi", sub: "Turning back and walking away" }
          ],
          correctIndex: 0,
          explanation: "'Tay trong tay' is the classic Vietnamese phrase for hand in hand."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Đêm nay... tớ sẽ ghi nhớ mãi khoảnh khắc ngọt ngào này trên sân thượng cùng cậu. Yêu cậu nhiều lắm."
            : (charKey === "kou" ? "Kou yêu người ta nhiều nhất trên đời luôn! Hôn trán một cái nha!" : "Nhóc ngoan lắm. Đêm nay ngủ ngon nhé, người yêu bé nhỏ của anh."),
          dialogueTrans: "Tonight... I will cherish this sweet rooftop moment with you forever. I love you so much.",
          prompt: "Select the ultimate loving reply to seal your completed Soulmate Date Scenario:",
          options: [
            { text: `${selfCap} cũng yêu ${partnerAddress} bằng cả trái tim và tâm hồn!`, sub: `I love you with all my heart and soul!` },
            { text: "Hết phim rồi, giải tán đi về.", sub: "Movie over, disperse and go home." },
            { text: "Nói nhiều mỏi miệng quá.", sub: "Talking too much makes mouth tired." }
          ],
          correctIndex: 0,
          explanation: "'Yêu bạn bằng cả trái tim và tâm hồn' seals the master tier Soulmate level date scenario with absolute perfection!"
        }
      ];
    }
  };

  return getViQuestions(scenarioId);
}
