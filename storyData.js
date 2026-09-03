/**
 * Otome Lingua - Story Date Scenarios & Question Database
 * 5 Rich Date Scenarios with 7 questions each (35 total questions)
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
    tone: "Whispered, Cozy & Sweet",
    bgImage: "/assets/scenarios/scenario_1.jpg",
    altImage: "/assets/scenarios/library.jpg",
    bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)",
    description: "An after-school library session. Whisper sweet questions, share notes, and practice polite requests behind tall bookshelves.",
    desc: "An after-school library session. Whisper sweet questions, share notes, and practice polite requests behind tall bookshelves.",
    descVi: "Buổi tự học chiều tại góc thư viện yên tĩnh. Trao đổi lời nhắn thì thầm, chia sẻ tài liệu và câu hỏi ngọt ngào.",
    passingScore: 5,
    totalQuestions: 7,
    rewardHearts: 50,
    affPassGain: 4.5,
    affFailPenalty: 2.0,
    partnerReactionPass: {
      ado: "Hôm nay học cùng cậu hiệu quả và vui lắm... Mảnh giấy tớ viết, về nhà nhớ đọc nhé.",
      kou: "Yay! Senpai học giỏi xuất sắc luôn! Kou vui ơi là vui, mai mình lại học chung nha!",
      ren: "Nhóc tiếp thu nhanh đấy. Được ngồi cạnh một người thông minh như em làm anh thấy dễ chịu."
    },
    partnerReactionFail: {
      ado: "Có vẻ hôm nay cậu mất tập trung rồi... Lần sau chúng mình cùng ôn kỹ hơn nhé.",
      kou: "Hic, khó quá hả Senpai? Để lần sau Kou kèm cho người ta từ từ nha!",
      ren: "Chưa tập trung lắm đâu đấy nhóc. Lần sau anh sẽ nghiêm khắc hơn đấy."
    }
  },
  {
    id: 2,
    level: 2,
    title: "Rainy Cafe & Warm Drinks",
    titleVi: "Quán Cà Phê Ngày Mưa & Ly Trà Ấm",
    titleJa: "雨の日のカフェと温かいドリンク",
    icon: "☕",
    location: "Sweet Blossom Indie Coffeehouse",
    tone: "Rainy, Intimate & Warm",
    bgImage: "/assets/scenarios/scenario_2.jpg",
    altImage: "/assets/scenarios/cafe.jpg",
    bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #fde68a 100%)",
    description: "Caught in a sudden afternoon rainstorm. Sit together by a rain-streaked window, order drinks, and warm each other's hearts.",
    desc: "Caught in a sudden afternoon rainstorm. Sit together by a rain-streaked window, order drinks, and warm each other's hearts.",
    descVi: "Cơn mưa rào bất chợt đưa hai người vào góc quán nhỏ. Cùng gọi đồ uống ấm và trò chuyện ngọt ngào.",
    passingScore: 5,
    totalQuestions: 7,
    rewardHearts: 75,
    affPassGain: 5.0,
    affFailPenalty: 2.0,
    partnerReactionPass: {
      ado: "Cảm ơn cậu vì một buổi chiều mưa thật bình yên... Lần sau trời mưa lại đi cafe với tớ nhé.",
      kou: "Buổi hẹn cafe ngày mưa ngọt ngào nhất trần đời luôn á! Kou yêu khoảnh khắc bên người ta lắm!",
      ren: "Trời mưa lạnh nhưng ở bên nhóc ấm áp hẳn. Anh trả tiền rồi, lần sau nhóc lại đi với anh là được."
    },
    partnerReactionFail: {
      ado: "Buổi hẹn hôm nay hơi gượng gạo nhỉ... Lần sau tớ sẽ chọn quán yên tĩnh hơn.",
      kou: "Hic, Kou làm gì khiến người ta không vui sao? Lần sau em sẽ cố gắng hơn mà!",
      ren: "Tâm trạng nhóc hôm nay trôi đi đâu rồi đấy. Lần tới phải chú ý đến anh nhiều hơn nghe chưa."
    }
  },
  {
    id: 3,
    level: 3,
    title: "Sunset Riverbank Walk & Street Food",
    titleVi: "Dạo Bờ Sông Hoàng Hôn & Ẩm Thực Phố",
    titleJa: "夕暮れの川辺散歩と屋台グルメ",
    icon: "🌅",
    location: "Scenic Riverside Promenade",
    tone: "Breezy, Romantic & Delicious",
    bgImage: "/assets/scenarios/scenario_3.jpg",
    altImage: "/assets/scenarios/riverbank.jpg",
    bgGradient: "linear-gradient(135deg, #831843 0%, #db2777 50%, #fbcfe8 100%)",
    description: "A breezy stroll along the river promenade at golden sunset. Buy tasty snacks, share bites, and walk side-by-side.",
    desc: "A breezy stroll along the river promenade at golden sunset. Buy tasty snacks, share bites, and walk side-by-side.",
    descVi: "Dạo bước bên bờ sông lộng gió lúc hoàng hôn buông xuống. Cùng thưởng thức bánh tráng nướng và chia sẻ khoảnh khắc vui vẻ.",
    passingScore: 5,
    totalQuestions: 7,
    rewardHearts: 100,
    affPassGain: 5.5,
    affFailPenalty: 2.5,
    partnerReactionPass: {
      ado: "Bờ sông hoàng hôn hôm nay thật lãng mạn... Điều ước thả hoa đăng của tớ là được bên cậu mãi.",
      kou: "Ăn vặt bờ sông với người ta ngon xỉu luôn! Tay người ta ấm ơi là ấm, Kou chẳng muốn buông ra đâu!",
      ren: "Hoàng hôn đẹp, thức ăn ngon, nhưng người đứng cạnh anh mới là tuyệt nhất. Nhóc làm anh xiêu lòng rồi."
    },
    partnerReactionFail: {
      ado: "Gió sông lạnh làm cậu mệt rồi sao? Chúng mình về sớm nghỉ ngơi nhé.",
      kou: "Em xin lỗi vì dắt người ta đi bộ nhiều làm mỏi chân nha...",
      ren: "Chuyến đi dạo hôm nay hơi nhạt đấy nhóc. Lần sau anh sẽ nghĩ ra chỗ thú vị hơn."
    }
  },
  {
    id: 4,
    level: 4,
    title: "Weekend Night Festival & Fireworks",
    titleVi: "Lễ Hội Đêm Cuối Tuần & Pháo Hoa",
    titleJa: "週末の夜祭りと打ち上げ花火",
    icon: "🎆",
    location: "Lakeside Festival Grounds & Lantern Way",
    tone: "Festive, Exciting & Heart-Fluttering",
    bgImage: "/assets/scenarios/scenario_4.jpg",
    altImage: "/assets/scenarios/festival.jpg",
    bgGradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c4b5fd 100%)",
    description: "Lively lantern-lit night festival with booth games, sweet treats, crowds, and breathtaking fireworks over the lake.",
    desc: "Lively lantern-lit night festival with booth games, sweet treats, crowds, and breathtaking fireworks over the lake.",
    descVi: "Không khí lễ hội đêm lung linh ánh lồng đèn. Chơi trò chơi dân gian, nắm chặt tay qua đám đông và ngắm pháo hoa rực rỡ.",
    passingScore: 5,
    totalQuestions: 7,
    rewardHearts: 125,
    affPassGain: 6.0,
    affFailPenalty: 2.5,
    partnerReactionPass: {
      ado: "Pháo hoa sáng rực trên trời... nhưng người duy nhất tớ nhìn là cậu. Năm sau lại cùng đi nhé!",
      kou: "Đêm lễ hội tuyệt vời nhất cuộc đời Kou! Ngắm pháo hoa nắm tay người ta hạnh phúc muốn khóc luôn á!",
      ren: "Pháo hoa tàn rồi nhưng ánh mắt nhóc tối nay sẽ đọng mãi trong tâm trí anh. Ngoan lắm, người yêu bé nhỏ."
    },
    partnerReactionFail: {
      ado: "Đông người quá làm chúng mình bị phân tâm... Lần sau tớ sẽ nắm tay cậu chặt hơn.",
      kou: "Hic, festival đông quá làm người ta mệt rồi sao... Kou thương người ta nhiều lắm á!",
      ren: "Nhóc lơ đãng quá đấy. Đứng cạnh anh mà mắt cứ nhìn đi đâu là anh phạt đấy nhé."
    }
  },
  {
    id: 5,
    level: 5,
    title: "Rooftop Stargazing & Confession",
    titleVi: "Ngắm Sao Trên Sân Thượng & Lời Thổ Lộ",
    titleJa: "屋上の星空観察と愛の告白",
    icon: "✨",
    location: "School Rooftop Observatory (Under the Stars)",
    tone: "Starlit, Deep Romance & Soulmate Bond",
    bgImage: "/assets/scenarios/scenario_5.jpg",
    altImage: "/assets/scenarios/rooftop.jpg",
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #ec4899 100%)",
    description: "An intimate evening overlooking city lights and shimmering stars. Open your true heart and seal your bond.",
    desc: "An intimate evening overlooking city lights and shimmering stars. Open your true heart and seal your bond.",
    descVi: "Buổi tối lãng mạn trên sân thượng lộng gió ngắm ánh đèn thành phố và ngàn sao. Khoảnh khắc bày tỏ tấm lòng chân thành.",
    passingScore: 5,
    totalQuestions: 7,
    rewardHearts: 150,
    affPassGain: 7.5,
    affFailPenalty: 3.0,
    partnerReactionPass: {
      ado: "Cậu đã đồng ý rồi... Tớ hứa sẽ dùng cả thanh xuân để yêu thương và bảo vệ cậu thật trọn vẹn!",
      kou: "Aaaaa! Người ta đồng ý làm người yêu của Kou rồi! Kou là người hạnh phúc nhất vũ trụ này luôn nè!",
      ren: "Từ giây phút này nhóc chính thức là của anh. Anh sẽ nắm chặt tay em, không bao giờ buông đâu."
    },
    partnerReactionFail: {
      ado: "Có lẽ tớ hơi vội vàng... Nhưng tớ sẽ kiên nhẫn chờ đợi đến khi cậu sẵn sàng đón nhận tình cảm này.",
      kou: "Kou sẽ không bỏ cuộc đâu! Em sẽ chứng minh cho người ta thấy tình cảm chân thành của Kou!",
      ren: "Từ chối anh à? Nhóc bướng bỉnh thật đấy. Nhưng chính sự bướng bỉnh đó làm anh càng muốn chinh phục em hơn."
    }
  }
];

/**
 * Returns 7 tailored questions for a specific scenario, character, and target learning language.
 */
export function getScenarioQuestions(scenarioId, charId = "ado", targetLang = "vi", userProfile = {}) {
  const scId = Number(scenarioId) || 1;
  const charKey = (charId === "bao" ? "ado" : (charId === "julian" ? "kou" : charId)) || "ado";
  const pronouns = (userProfile && userProfile.pronouns) ? String(userProfile.pronouns).toLowerCase() : "she/her";
  const isMale = pronouns.includes("he") || pronouns.includes("him");
  
  // Vietnamese address pronouns
  const selfAddress = charKey === "ado" ? "tớ" : (charKey === "kou" ? (isMale ? "anh" : "chị") : "em");
  const partnerAddress = charKey === "ado" ? "cậu" : (charKey === "kou" ? "em" : "anh");
  const partnerCap = charKey === "ado" ? "Cậu" : (charKey === "kou" ? "Em" : "Anh");
  const selfCap = charKey === "ado" ? "Tớ" : (charKey === "kou" ? (isMale ? "Anh" : "Chị") : "Em");

  // Format and normalize helper
  const normalize = (qList) => {
    return qList.slice(0, 7).map(q => {
      const correctIdx = (q.correctIdx !== undefined) ? q.correctIdx : (q.correctIndex !== undefined ? q.correctIndex : 0);
      const dialogue = q.promptDialogue || q.partnerDialogue || "";
      const trans = q.promptTrans || q.dialogueTrans || "";
      const situation = q.situation || q.prompt || "";
      const options = (q.options || []).map(opt => ({
        text: opt.text || "",
        trans: opt.trans || opt.sub || "",
        sub: opt.sub || opt.trans || "",
        phonetic: opt.phonetic || ""
      }));

      return {
        promptDialogue: dialogue,
        partnerDialogue: dialogue,
        promptTrans: trans,
        dialogueTrans: trans,
        situation: situation,
        prompt: situation,
        options: options,
        correctIdx: correctIdx,
        correctIndex: correctIdx,
        explanation: q.explanation || "Select the most polite, charming, and contextually accurate response."
      };
    });
  };

  // =========================================================================
  // VIETNAMESE TARGET LANGUAGE (Rich romantic dialogues & cultural vocabulary)
  // =========================================================================
  if (targetLang === "vi" || !targetLang) {
    if (scId === 1) {
      // Scenario 1: Library Study Date (7 Questions)
      return normalize([
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu ngồi xuống đây đi, tớ đã giữ chỗ sẵn cạnh cửa sổ cho cậu rồi."
            : (charKey === "kou" ? `${selfCap} ơi! Em giữ chiếc ghế êm nhất cạnh em cho ${selfAddress} nè!` : "Lại đây ngồi cạnh anh. Thư viện đông lắm, chậm chân là hết chỗ đấy, nhóc."),
          dialogueTrans: "Sit down here, I saved a seat next to me by the window for you.",
          situation: "Act 1/7: Your partner saved a quiet seat for you by the library window. How do you politely thank them?",
          options: [
            { text: "Để đó đi, tớ tự tìm chỗ khác.", trans: "Leave it, I will find another place myself." },
            { text: `Cảm ơn ${partnerAddress} nhiều nhé, chu đáo quá!`, trans: `Thank you so much, ${partnerAddress}, you are so thoughtful!` },
            { text: "Ghế này cứng quá tớ không thích.", trans: "This chair is too hard, I don't like it." }
          ],
          correctIdx: 1,
          explanation: "Expressing warm appreciation with 'chu đáo quá' (so thoughtful) and the softening particle 'nhé' creates an instant romantic connection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bài tập ngữ pháp này hơi khó một chút, cậu có muốn chúng mình cùng làm không?"
            : (charKey === "kou" ? `${selfCap} ơi, câu này Kou chưa hiểu rõ, ${selfAddress} giảng cho em với!` : "Đoạn này ngữ pháp rắc rối đấy, nhóc có cần anh chỉ cho một chút không?"),
          dialogueTrans: "This grammar exercise is a bit tricky, would you like to do it together?",
          situation: "Act 2/7: Your partner opens their study workbook. Which phrase properly invites collaborative studying?",
          options: [
            { text: `Chúng mình cùng nhau ôn tập ${partnerAddress} nhé!`, trans: `Let's review and study together, ${partnerAddress}!` },
            { text: "Khó quá dẹp đi không học nữa.", trans: "Too hard, let's quit studying." },
            { text: "Tự làm đi, hỏi nhiều mệt quá.", trans: "Do it yourself, asking too much is tiring." }
          ],
          correctIdx: 0,
          explanation: "'Chúng mình cùng nhau ôn tập nhé' means 'Let's review together'—encouraging, collaborative, and friendly!"
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Thư viện phải giữ trật tự đấy nhé, nói nhỏ thôi không cô thủ thư nhắc."
            : (charKey === "kou" ? "Suỵt! Kou sẽ nói thật khẽ vào tai của người ta nè..." : "Nói nhỏ thôi nhóc, xích lại gần đây anh nghe cho rõ."),
          dialogueTrans: "We have to stay quiet in the library, whisper softly so the librarian doesn't scold us.",
          situation: "Act 3/7: Language Check: Which Vietnamese word means 'to whisper / speaking softly'?",
          options: [
            { text: "Hét to", trans: "To shout loudly" },
            { text: "Cười ầm", trans: "To burst into loud laughter" },
            { text: "Thì thầm / Nói nhỏ", trans: "To whisper / speak softly" }
          ],
          correctIdx: 2,
          explanation: "'Thì thầm' means to whisper intimately, and 'nói nhỏ' means to speak softly and politely in quiet spaces."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có mang theo bút dạ quang màu hồng không? Tớ để quên ở lớp rồi."
            : (charKey === "kou" ? `${selfCap} cho Kou mượn cây bút chì với ạ!` : "Nhóc đưa anh cây bút nhớ xem nào, anh gạch ý chính cho."),
          dialogueTrans: "Do you have a highlighter/pen I can borrow for a moment?",
          situation: "Act 4/7: Your date needs stationery. How do you lend it with a sweet smile?",
          options: [
            { text: `Đây nè, ${partnerAddress} cứ dùng thoải mái nha!`, trans: `Here you go, feel free to use it as much as you like!` },
            { text: "Không có, tự đi mua đi.", trans: "Don't have any, go buy your own." },
            { text: "Dùng xong phải trả một trăm nghìn.", trans: "After using you must pay 100k." }
          ],
          correctIdx: 0,
          explanation: "'Cứ dùng thoải mái nha' (Feel free to use it) paired with the friendly particle 'nha' is polite, warm, and inviting."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Á... ngón tay chạm vào nhau rồi... C-cậu có giật mình không?"
            : (charKey === "kou" ? "Hihi tay em chạm tay người ta rồi nè! Ấm ghê á!" : "Đụng trúng tay anh rồi đấy nhé, nhóc có ngại không?"),
          dialogueTrans: "Ah... our fingers brushed against each other... Did I startle you?",
          situation: "Act 5/7: Your hands brush over the textbook. How do you react to this heart-fluttering moment?",
          options: [
            { text: "Tránh xa tớ ra, đừng có chạm vào!", trans: "Stay away from me, don't touch!" },
            { text: `Không sao đâu, tay của ${partnerAddress} ấm lắm...`, trans: `It's totally okay, your hand is so warm...` },
            { text: "Đi rửa tay ngay đi nhé.", trans: "Go wash your hands right away." }
          ],
          correctIdx: 1,
          explanation: "Saying 'tay ấm lắm' (your hand is so warm) shows genuine romantic receptiveness and gentle charm."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tớ vừa gấp một mảnh giấy ghi chú nhỏ kẹp vào sách của cậu đấy..."
            : (charKey === "kou" ? "Em viết một lời chúc bí mật trong trang sách nè!" : "Anh lén vẽ hình nhóc vào sổ rồi đấy, về nhà hẵng mở ra xem."),
          dialogueTrans: "I slipped a small secret folded note into your book page...",
          situation: "Act 6/7: Vocabulary Check: What does the phrase 'mảnh giấy ghi chú' mean?",
          options: [
            { text: "A heavy dictionary book", trans: "Cuốn từ điển dày" },
            { text: "A receipt from a store", trans: "Hóa đơn thanh toán" },
            { text: "A small memo note slip", trans: "Mảnh giấy ghi chú / giấy nhớ" }
          ],
          correctIdx: 2,
          explanation: "'Mảnh giấy ghi chú' translates to a small handwritten note paper or study memo slip."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Sắp tới giờ thư viện đóng cửa rồi, nhanh thật đấy... Chúng mình cùng về nhé?"
            : (charKey === "kou" ? "Hết giờ học rồi, Kou đưa người ta đi bộ về chung nha!" : "Đến giờ về rồi à? Để anh dắt nhóc về tận nhà."),
          dialogueTrans: "It's almost closing time for the library, that was fast... Shall we walk home together?",
          situation: "Act 7/7: Closing Scene: Select the sweetest line to conclude your library study date:",
          options: [
            { text: `Được chứ! Chúng mình cùng đi về chung ${partnerAddress} nhé!`, trans: `Of course! Let's walk home together!` },
            { text: "Tớ về trước đây, mặc kệ cậu.", trans: "I'm going home first, don't care about you." },
            { text: "Cậu ở lại quét rác một mình đi.", trans: "You stay and sweep trash alone." }
          ],
          correctIdx: 0,
          explanation: "'Đi về chung... nhé' is the classic sweet invitation to walk home together after study hours."
        }
      ]);
    } else if (scId === 2) {
      // Scenario 2: Rainy Cafe & Warm Drinks (7 Questions)
      return normalize([
        {
          partnerDialogue: charKey === "ado" 
            ? "Mưa lớn quá! Mau vào quán này trú đi cậu, kẻo ướt hết áo bây giờ."
            : (charKey === "kou" ? `${selfCap} ơi mau vào quán với Kou, mưa to ướt tóc ${selfAddress} rồi kìa!` : "Vào đây nhanh nào nhóc, đứng ngoài đấy để bị cảm à?"),
          dialogueTrans: "It's raining so heavily! Quick, step into this cafe so you don't get soaked.",
          situation: "Act 1/7: A sudden rainstorm hits. How do you respond as you step into the cozy warm cafe?",
          options: [
            { text: "Mưa thì mặc kệ tớ, quan tâm làm gì.", trans: "If it rains leave me alone, why care." },
            { text: `May mà có ${partnerAddress} kéo ${selfAddress} vào kịp lúc!`, trans: `Good thing you pulled me inside just in time!` },
            { text: "Quán này trông tối tăm quá.", trans: "This cafe looks too dim." }
          ],
          correctIdx: 1,
          explanation: "Acknowledging their timely rescue builds warmth and shared intimacy immediately."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu muốn uống gì nào? Để tớ ra quầy gọi đồ uống cho hai đứa mình."
            : (charKey === "kou" ? "Kou gọi món cho hai đứa mình nha! Người ta thích uống gì nè?" : "Muốn uống gì nào nhóc? Hôm nay anh bao hết."),
          dialogueTrans: "What would you like to drink? Let me order at the counter for the two of us.",
          situation: "Act 2/7: Ordering Drinks: How do you politely order a warm peach lemongrass tea?",
          options: [
            { text: `Cho ${selfAddress} một ly trà đào cam sả ấm nhé!`, trans: `Please give me a warm lemongrass orange peach tea!` },
            { text: "Lấy cái gì đắt nhất ra đây.", trans: "Bring out whatever is most expensive." },
            { text: "Không uống gì hết, ngồi nhìn thôi.", trans: "Won't drink anything, just sit and stare." }
          ],
          correctIdx: 0,
          explanation: "'Cho... một ly trà... nhé' is the standard natural, polite Vietnamese phrasing for cafe orders."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Khăn giấy đây nè, để tớ lau bớt giọt nước mưa trên trán cho cậu nhé."
            : (charKey === "kou" ? "Để em nhẹ nhàng lau giọt nước mưa trên má cho nha!" : "Lại gần đây anh lau nước mưa trên tóc cho, đừng cựa quậy."),
          dialogueTrans: "Here is a napkin, let me wipe the raindrops off your forehead/cheek.",
          situation: "Act 3/7: Your date gently leans in with a napkin. What is the sweetest reaction to this tender gesture?",
          options: [
            { text: "Tránh ra, dơ bẩn quá!", trans: "Get away, so gross!" },
            { text: "Tự lau được không cần phiền.", trans: "Can wipe myself, don't need the trouble." },
            { text: `Cảm ơn ${partnerAddress}, ${partnerAddress} dịu dàng quá à...`, trans: `Thank you, you are so gentle and caring...` }
          ],
          correctIdx: 2,
          explanation: "'Dịu dàng quá à' (so gentle and sweet) highlights the emotional bond and sparks romance."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Trà ấm vừa mang ra rồi, thơm mùi hoa cúc và đào mật ong ghê."
            : (charKey === "kou" ? "Thơm phức luôn nè! Người ta thử một ngụm xem có ngon không nha!" : "Thơm đấy chứ? Thử một ngụm xem có vừa miệng không, nhóc."),
          dialogueTrans: "The hot tea just arrived, it smells delightfully of chamomile and honey peach.",
          situation: "Act 4/7: Vocabulary Check: Which Vietnamese adjective means 'fragrant / delightfully aromatic'?",
          options: [
            { text: "Thơm / Thơm phức", trans: "Fragrant / wonderfully aromatic" },
            { text: "Cay xè", trans: "Burning spicy" },
            { text: "Đắng ngắt", trans: "Extremely bitter" }
          ],
          correctIdx: 0,
          explanation: "'Thơm' means fragrant, and 'thơm phức' emphasizes rich, mouth-watering aromas."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "À... trên mép môi cậu dính một chút bọt sữa kìa..."
            : (charKey === "kou" ? "Hihi bọt sữa dính trên môi dễ thương như mèo con vậy á!" : "Dính bọt sữa trên môi rồi kìa nhóc, nhìn ngố mà cưng ghê."),
          dialogueTrans: "Ah... there's a little bit of milk foam on your upper lip...",
          situation: "Act 5/7: You took a sip and milk foam got on your lip. How do you respond playfully?",
          options: [
            { text: "Cười cái gì mà cười, vô duyên!", trans: "What are you laughing at, rude!" },
            { text: `Ủa thật hả? ${partnerAddress} lau giúp ${selfAddress} với được không?`, trans: `Really? Could you help me wipe it off?` },
            { text: "Dính thì kệ người ta, soi mói quá.", trans: "So what if it's there, stop nitpicking." }
          ],
          correctIdx: 1,
          explanation: "Asking 'Lau giúp với được không?' turns an awkward moment into an adorable romantic interaction."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mỗi khi trời mưa, tớ thường nghe nhạc lofi nhẹ nhàng. Chúng mình cùng đeo chung tai nghe nhé?"
            : (charKey === "kou" ? "Kou chia cho người ta một bên tai nghe nè, cùng nghe bài hát Kou thích nha!" : "Đeo một bên tai nghe vào đây với anh, bài này anh nghe hoài không chán."),
          dialogueTrans: "Whenever it rains I love soft lofi music. Shall we share earphones together?",
          situation: "Act 6/7: Your date offers one side of their earphones. How do you accept warmly?",
          options: [
            { text: "Nhạc dở tệ, tắt ngay đi.", trans: "Terrible music, turn it off immediately." },
            { text: "Tai nghe bẩn lắm không thèm đeo.", trans: "Earphones too dirty, won't wear them." },
            { text: `Giai điệu hay quá, nghe cùng ${partnerAddress} càng thấy tuyệt hơn!`, trans: `The melody is lovely, listening with you makes it even better!` }
          ],
          correctIdx: 2,
          explanation: "Complimenting the shared music enhances the intimate, cozy cafe atmosphere."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Mưa tạnh rồi kìa... Lần sau nếu trời lại mưa, cậu có đồng ý cùng tớ đến đây nữa không?"
            : (charKey === "kou" ? "Lần sau trời mưa lại đi cafe với em nữa nha, hứa nhé!" : "Lần tới có mưa hay không thì nhóc cũng phải đi cafe với anh tiếp đấy."),
          dialogueTrans: "The rain has cleared up... Next time it rains, will you come here with me again?",
          situation: "Act 7/7: Closing Scene: Which sentence confirms the date promise with endearing warmth?",
          options: [
            { text: `Nhất định rồi! Hễ trời mưa là ${selfAddress} sẽ nhớ tới ${partnerAddress} đầu tiên!`, trans: `Definitely! Whenever it rains, you'll be the first one I think of!` },
            { text: "Tùy tâm trạng, chưa chắc đâu.", trans: "Depends on my mood, not for sure." },
            { text: "Đi một lần là ngán tới cổ rồi.", trans: "Going once is already more than enough." }
          ],
          correctIdx: 0,
          explanation: "'Hễ trời mưa là nhớ tới bạn đầu tiên' is an unforgettable, deeply romantic affirmation."
        }
      ]);
    } else if (scId === 3) {
      // Scenario 3: Sunset Riverbank Walk & Street Food (7 Questions)
      return normalize([
        {
          partnerDialogue: charKey === "ado" 
            ? "Gió sông lúc hoàng hôn mát thật đấy, cậu đi cẩn thận kẻo vấp bậc thang nhé."
            : (charKey === "kou" ? "Bờ sông hoàng hôn đẹp quá kìa! Kou muốn đi dạo cạnh người ta mãi thôi!" : "Đi sát vào lề trong này nhóc, xe cộ đông đúc coi chừng đấy."),
          dialogueTrans: "The river breeze at sunset is so refreshing, watch your step on the promenade.",
          situation: "Act 1/7: Strolling along the riverbank at sunset. How do you comment on the breathtaking view?",
          options: [
            { text: "Trời tối thui chẳng thấy gì cả.", trans: "Sky is pitch dark can't see anything." },
            { text: "Hoàng hôn hôm nay đẹp và lãng mạn quá!", trans: "The sunset today is so beautiful and romantic!" },
            { text: "Gió thổi bụi bay vào mắt rát quá.", trans: "Wind blowing dust into eyes hurts." }
          ],
          correctIdx: 1,
          explanation: "'Hoàng hôn hôm nay đẹp và lãng mạn quá!' sets the perfect tone for a riverside stroll."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Phía trước có xe bánh tráng nướng thơm phức kìa, cậu có muốn thử không?"
            : (charKey === "kou" ? "Oa! Mùi bánh tráng nướng giòn rụm kìa! Em thèm ăn quá!" : "Ngửi thấy mùi bánh tráng nướng thơm chưa nhóc? Lại đây anh mua cho."),
          dialogueTrans: "There's a crispy grilled rice paper vendor ahead, do you want to try some?",
          situation: "Act 2/7: Cultural Food Check: Which dish is famous as the 'Vietnamese street pizza'?",
          options: [
            { text: "Bánh chưng", trans: "Square sticky rice cake" },
            { text: "Canh chua", trans: "Sour tamarind fish soup" },
            { text: "Bánh tráng nướng", trans: "Crispy grilled rice paper with egg & toppings" }
          ],
          correctIdx: 2,
          explanation: "'Bánh tráng nướng' is a famous street food snack frequently dubbed 'Vietnamese street pizza'."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu có ăn cay được không để tớ bảo người ta giảm bớt tương ớt lại?"
            : (charKey === "kou" ? "Kou không ăn cay giỏi đâu, người ta có ăn cay được không nè?" : "Nhóc ăn cay được không đấy? Coi chừng vừa ăn vừa khóc nhè nhé."),
          dialogueTrans: "Can you handle spicy food so I can ask them to adjust the chili sauce?",
          situation: "Act 3/7: Customizing the snack: How do you communicate your spice preference politely?",
          options: [
            { text: "Cho ít cay thôi nhé, vừa ăn là ngon nhất!", trans: "Just a little mild spice please, mild is the tastiest!" },
            { text: "Cho cay đến chết người xem nào.", trans: "Make it deadly spicy." },
            { text: "Bỏ đại đi hỏi nhiều quá.", trans: "Just throw whatever in, asking too much." }
          ],
          correctIdx: 0,
          explanation: "'Cho ít cay thôi nhé' is polite, clear, and ensures a pleasant tasting experience."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bánh nóng hổi vừa ra lò đây, để tớ bẻ đôi chia cho cậu miếng to hơn nè."
            : (charKey === "kou" ? "Nóng giòn rụm luôn nè! Người ta cắn miếng đầu tiên đi ạ!" : "Há miệng ra anh đút cho miếng này, giòn tan luôn."),
          dialogueTrans: "It's piping hot fresh from the grill, let me break it in half and give you the bigger piece.",
          situation: "Act 4/7: Sensory Vocabulary: Which Vietnamese phrase describes crispy, crunchy street food?",
          options: [
            { text: "Mềm nhũn", trans: "Soggy and limp" },
            { text: "Giòn rụm / Giòn tan", trans: "Crispy & crunchy" },
            { text: "Dai nhách", trans: "Extremely chewy" }
          ],
          correctIdx: 1,
          explanation: "'Giòn rụm' and 'giòn tan' are sensory words describing delicious crispy street snacks."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Gió sông thổi mạnh hơn rồi đấy, tay cậu có bị lạnh không?"
            : (charKey === "kou" ? "Tay em lạnh nè, người ta sưởi ấm cho Kou được không ạ?" : "Tay nhóc lạnh ngắt rồi kìa, đưa đây anh ủ ấm cho."),
          dialogueTrans: "The river wind is picking up, are your hands getting cold?",
          situation: "Act 5/7: Your date notices the cold breeze. How do you gently hold hands and share warmth?",
          options: [
            { text: "Bỏ tay ra mau lên, kỳ cục quá!", trans: "Let go of my hand quickly, so weird!" },
            { text: "Lạnh thì kệ tôi liên quan gì đến cậu.", trans: "If I'm cold it's my problem." },
            { text: `Tay ${partnerAddress} ấm ghê... Được nắm tay ${partnerAddress} thế này thích thật.`, trans: `Your hand is so warm... Holding hands like this feels wonderful.` }
          ],
          correctIdx: 2,
          explanation: "'Được nắm tay thế này thích thật' conveys honest, sweet romantic affection."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Nhìn các cặp đôi xung quanh thả hoa đăng trên sông kìa, cậu có muốn thả thử một chiếc không?"
            : (charKey === "kou" ? "Mình cùng thả hoa đăng ước nguyện nha! Kou ước được ở bên người ta mãi mãi!" : "Mua một chiếc hoa đăng đi nhóc, cầu cho nhóc lúc nào cũng ngoan ngoãn bên anh."),
          dialogueTrans: "Look at the floating lanterns on the river, want to release a wish lantern together?",
          situation: "Act 6/7: Tradition Check: What is a 'hoa đăng' in Vietnamese culture?",
          options: [
            { text: "A floating paper flower lantern for making wishes on rivers", trans: "Đèn hoa thả sông cầu nguyện" },
            { text: "A heavy iron boat anchor", trans: "Mỏ neo thuyền bằng sắt" },
            { text: "A traditional bowl of spicy noodles", trans: "Bát mì cay truyền thống" }
          ],
          correctIdx: 0,
          explanation: "'Hoa đăng' is a traditional floating candle flower lantern released onto rivers to carry sincere heartfelt wishes."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Chiếc hoa đăng trôi trên mặt nước lung linh quá... Cậu vừa ước điều gì thế?"
            : (charKey === "kou" ? "Kou ước điều bí mật liên quan đến người ta á, còn người ta ước gì nè?" : "Ước gì đấy nhóc? Có phải ước ngày nào cũng được gặp anh không?"),
          dialogueTrans: "The lantern floating on the water is so luminous... What did you just wish for?",
          situation: "Act 7/7: Closing Scene: What is the most romantic answer to their question about your wish?",
          options: [
            { text: "Ước cho cậu biến mất khỏi mắt tôi.", trans: "Wished for you to disappear from my sight." },
            { text: `${selfCap} ước rằng chúng mình sẽ luôn đồng hành và bên nhau thật lâu.`, trans: `I wished that we will always walk together and stay side by side for a long time.` },
            { text: "Nói ra mất linh, không thèm nói.", trans: "Saying it ruins the magic, won't tell." }
          ],
          correctIdx: 1,
          explanation: "Wishing to stay together for a long time ('bên nhau thật lâu') melts hearts and seals the date."
        }
      ]);
    } else if (scId === 4) {
      // Scenario 4: Weekend Night Festival & Fireworks (7 Questions)
      return normalize([
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu đến rồi à? Trang phục hôm nay của cậu... trông rất hợp và xinh đẹp lắm."
            : (charKey === "kou" ? "Oa! Hôm nay người ta mặc đồ đẹp xỉu luôn! Kou nhìn mà tim đập thình thịch nè!" : "Nhóc tới rồi đấy à? Hôm nay ăn diện xinh xắn thế này làm anh suýt nhận không ra đấy."),
          dialogueTrans: "You arrived! Your festival outfit today looks so lovely and suits you so well.",
          situation: "Act 1/7: Meeting at the festival entrance: How do you return the compliment on their attire?",
          options: [
            { text: `${partnerCap} hôm nay cũng bảnh bao và cuốn hút lắm đó nha!`, trans: `You look so dashing and attractive today too!` },
            { text: "Mặc đồ xấu thế mà cũng khen.", trans: "Wearing ugly clothes and you still praise." },
            { text: "Đương nhiên rồi, nhìn lại cậu xem.", trans: "Of course, look at yourself instead." }
          ],
          correctIdx: 0,
          explanation: "'Bảnh bao và cuốn hút' (dashing and attractive) is an irresistible compliment."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Lễ hội đông người lắm, cậu nắm chặt lấy tay tớ kẻo bị lạc giữa đám đông nhé."
            : (charKey === "kou" ? "Đông người quá, Kou nắm chặt tay người ta nha, không buông ra đâu đó!" : "Đưa tay đây anh dắt đi. Lóng ngóng như nhóc lạc một cái là anh không tìm đâu đấy."),
          dialogueTrans: "The festival is so crowded, hold my hand tightly so we don't get separated.",
          situation: "Act 2/7: Romance Phrase Check: Which Vietnamese verb phrase means 'to hold hands tightly'?",
          options: [
            { text: "Bỏ chạy", trans: "To run away" },
            { text: "Nắm tay / Nắm chặt tay", trans: "To hold hands / hold hands tightly" },
            { text: "Xô đẩy", trans: "To shove and push" }
          ],
          correctIdx: 1,
          explanation: "'Nắm tay' (or 'nắm chặt tay') is the essential romantic expression for holding hands securely."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Phía trước có gian hàng ném vòng trúng thưởng kìa, để tớ ném lấy gấu bông cho cậu nhé!"
            : (charKey === "kou" ? "Gian hàng trò chơi kìa! Kou muốn ném trúng con gấu bông tặng người ta!" : "Thích con thú bông nào trong quầy kia nhóc? Anh ném trúng đem về cho."),
          dialogueTrans: "There's a ring-toss prize booth ahead, let me win that cute plushie for you!",
          situation: "Act 3/7: Game Booth: How do you cheer enthusiastically for your partner at the game?",
          options: [
            { text: "Ném trượt là quê một cục ráng chịu.", trans: "If you miss it's your embarrassment." },
            { text: "Trò con nít này chơi làm gì.", trans: "Why play this childish game." },
            { text: `Cố lên ${partnerAddress} ơi! ${selfCap} tin chắc ${partnerAddress} sẽ làm được!`, trans: `You can do it! I firmly believe you will make it!` }
          ],
          correctIdx: 2,
          explanation: "Cheering enthusiastically builds team camaraderie and high spirits."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Trúng rồi! Tớ đổi được chú gấu bông nhỏ này tặng riêng cho cậu nè."
            : (charKey === "kou" ? "Trúng rồi trúng rồi! Gấu bông xinh xắn này Kou tặng cho người ta nè!" : "Thấy tài thiện xạ của anh chưa? Cầm lấy con gấu này mà ôm mỗi tối nhớ đến anh nhé."),
          dialogueTrans: "Bullseye! I won this plushie to give especially to you.",
          situation: "Act 4/7: Receiving the Prize: How do you express delight upon receiving the gift?",
          options: [
            { text: `Ôi dễ thương quá! Cảm ơn ${partnerAddress}, ${selfAddress} sẽ trân trọng nó thật nhiều!`, trans: `Oh so cute! Thank you, I will cherish it so much!` },
            { text: "Con gấu xấu xí này cho con nít à.", trans: "This ugly bear is for toddlers." },
            { text: "Thắng có con thú nhỏ xíu cũng khoe.", trans: "Winning a tiny animal and you brag." }
          ],
          correctIdx: 0,
          explanation: "'Trân trọng nó thật nhiều' (cherish it deeply) communicates sincere appreciation."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Sắp tới giờ bắn pháo hoa rồi, tớ biết một chỗ trên đồi cỏ nhìn ra hồ rất thoáng và vắng."
            : (charKey === "kou" ? "Mau lên đồi cỏ ngắm pháo hoa với em nè, chỗ đó đẹp nhất luôn á!" : "Lại đây với anh, lên mỏm đồi này ngắm pháo hoa vừa riêng tư vừa rõ nét."),
          dialogueTrans: "It's almost fireworks time, I know an elevated grassy knoll overlooking the lake.",
          situation: "Act 5/7: Moving to Secret Spot: How do you agree to follow them to the secret fireworks knoll?",
          options: [
            { text: "Đứng đây xem cũng được, đi chi cho mỏi giò.", trans: "Standing here is fine, why walk and tire feet." },
            { text: `Tuyệt vời quá! ${partnerCap} dẫn đường, ${selfAddress} đi theo ${partnerAddress} ngay nè!`, trans: `Wonderful! Lead the way, I'll follow you right away!` },
            { text: "Chỗ đó muỗi cắn chết không đi đâu.", trans: "Mosquitoes there will bite to death, won't go." }
          ],
          correctIdx: 1,
          explanation: "Following their lead enthusiastically creates adventure and romantic anticipation."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bùm! Pháo hoa bắt đầu nổ rồi kìa! Đẹp quá cậu ơi!"
            : (charKey === "kou" ? "Pháo hoa sáng rực cả bầu trời kìa người ta ơi! Đẹp lung linh luôn!" : "Pháo hoa nở rồi đấy nhóc. Nhìn lên trời kìa, rực rỡ chưa?"),
          dialogueTrans: "Boom! The fireworks are bursting! Look how gorgeous it is!",
          situation: "Act 6/7: Vocabulary Check: Which Vietnamese term means 'fireworks'?",
          options: [
            { text: "Sấm chớp", trans: "Thunder & lightning" },
            { text: "Mưa đá", trans: "Hailstones" },
            { text: "Pháo hoa", trans: "Fireworks / aerial flower sparks" }
          ],
          correctIdx: 2,
          explanation: "'Pháo hoa' is the Vietnamese word for fireworks."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Ánh sáng pháo hoa chiếu rọi khuôn mặt cậu... đẹp đến mức tớ không thể rời mắt được."
            : (charKey === "kou" ? "Pháo hoa đẹp nhưng Kou thấy người ta còn xinh đẹp hơn gấp vạn lần!" : "Pháo hoa sáng rực trên trời nhưng mắt anh chỉ muốn nhìn nhóc thôi."),
          dialogueTrans: "The fireworks light illuminating your face is so breathtaking I cannot look away.",
          situation: "Act 7/7: Fireworks Climax: How do you react to this deeply romantic confession under the fireworks?",
          options: [
            { text: `Tim ${selfAddress} đang đập nhanh lắm... vì ${partnerAddress} đấy.`, trans: `My heart is beating so fast... because of you.` },
            { text: "Nói xàm quá, ngắm pháo hoa đi.", trans: "Nonsense, watch the fireworks." },
            { text: "Bị lé mắt hay sao mà nhìn hoài.", trans: "Are you cross-eyed looking all the time." }
          ],
          correctIdx: 0,
          explanation: "'Tim đang đập nhanh vì bạn đấy' acknowledges mutual vulnerability and romantic tension."
        }
      ]);
    } else {
      // Scenario 5: Rooftop Stargazing & Confession (7 Questions)
      return normalize([
        {
          partnerDialogue: charKey === "ado" 
            ? "Khẽ thôi nào, tớ vừa mở được cánh cửa lên sân thượng rồi... Cậu lên đây với tớ đi."
            : (charKey === "kou" ? "Suỵt! Lên sân thượng bí mật với Kou nè! Nơi này chỉ có hai đứa mình biết thôi á!" : "Lên đây với anh nhóc, đêm nay trời đầy sao, ở đây ngắm là tuyệt nhất."),
          dialogueTrans: "Quietly now, I unlocked the rooftop door... come up here with me under the stars.",
          situation: "Act 1/7: Stepping onto the rooftop: How do you react to the quiet starlit view?",
          options: [
            { text: "Gió lạnh muốn chết, kéo lên đây làm gì.", trans: "Freezing wind, why drag me up here." },
            { text: `Bầu trời đêm ở đây nhìn rộng lớn và huyền ảo quá!`, trans: `The night sky from here looks so vast and magical!` },
            { text: "Bị bảo vệ bắt là tôi đổ thừa cậu đấy.", trans: "If security catches us I'll blame you." }
          ],
          correctIdx: 1,
          explanation: "'Rộng lớn và huyền ảo' captures the vast, enchanting starlit atmosphere."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu nhìn kìa, hàng ngàn ánh đèn thành phố bên dưới lấp lánh như một biển sao thứ hai."
            : (charKey === "kou" ? "Đèn thành phố lung linh lấp lánh đẹp như tranh vẽ luôn á!" : "Nhìn thành phố bên dưới xem, nhỏ bé hẳn. Nhưng đứng cạnh nhóc thì anh thấy trọn vẹn."),
          dialogueTrans: "Look down there, thousands of city lights sparkling like a second sea of stars.",
          situation: "Act 2/7: Cityscape Vocabulary: Which Vietnamese phrase means 'glittering city night lights'?",
          options: [
            { text: "Rừng cây rậm rạp", trans: "Dense forest trees" },
            { text: "Ruộng lúa mênh mông", trans: "Vast rice paddies" },
            { text: "Ánh đèn thành phố rực rỡ", trans: "Radiant city night lights" }
          ],
          correctIdx: 2,
          explanation: "'Ánh đèn thành phố rực rỡ' refers to the glittering city skyline lights."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Bởi vì... trong lòng tớ, cậu là người duy nhất tớ muốn cùng chia sẻ những điều quý giá nhất."
            : (charKey === "kou" ? "Bởi vì Kou thương người ta nhất trên đời! Chỉ muốn ngắm sao cùng người ta thôi!" : "Bởi vì trong mắt anh chỉ có mỗi nhóc là xứng đáng đứng cạnh anh ở đây."),
          dialogueTrans: "Because... in my heart, you are the only one I want to share my most precious moments with.",
          situation: "Act 3/7: Vocabulary Check: Which Vietnamese word means 'the only one / unique special person'?",
          options: [
            { text: "Duy nhất / Người duy nhất", trans: "The only one / sole special person" },
            { text: "Bất kỳ ai", trans: "Anyone at all" },
            { text: "Người xa lạ", trans: "A stranger" }
          ],
          correctIdx: 0,
          explanation: "'Duy nhất' means unique / the only one—the highest tier of otome romantic devotion."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Kìa... một ngôi sao băng vừa lướt qua bầu trời đêm!"
            : (charKey === "kou" ? "Sao băng kìa! Mau nhắm mắt lại ước đi người ta ơi!" : "Sao băng rơi kìa nhóc, ước nhanh lên xem điều ước có linh nghiệm không."),
          dialogueTrans: "Look... a shooting star just streaked across the night sky!",
          situation: "Act 4/7: Vocabulary Check: What is a 'sao băng' in Vietnamese?",
          options: [
            { text: "Hot air balloon", trans: "Khinh khí cầu" },
            { text: "Shooting star / Meteor", trans: "Sao băng / Vệt sao băng" },
            { text: "Airplane light", trans: "Đèn máy bay" }
          ],
          correctIdx: 1,
          explanation: "'Sao băng' translates to a shooting star or meteor."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Cậu đã ước điều gì thế? Có thể chia sẻ cho tớ nghe được không?"
            : (charKey === "kou" ? "Kou ước điều ước lớn nhất cuộc đời mình rồi, còn người ta thì sao nè?" : "Ước xong chưa nhóc? Bật mí cho anh nghe xem nào."),
          dialogueTrans: "What did you wish for? Could you share it with me?",
          situation: "Act 5/7: Confession of Wish: Choose the most poetic line to confess your wish:",
          options: [
            { text: "Ước trúng số một trăm tỷ chứ ước gì.", trans: "Wished to win the lottery jackpot." },
            { text: "Không liên quan đến cậu, đừng tò mò.", trans: "Not related to you, don't be curious." },
            { text: `${selfCap} ước rằng tình cảm của hai chúng mình sẽ đơm hoa kết trái thật ngọt ngào.`, trans: `I wished that our feelings for each other will blossom into sweet romance.` }
          ],
          correctIdx: 2,
          explanation: "'Tình cảm đơm hoa kết trái' is a graceful, poetic Vietnamese expression for love blooming into reality."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tim tớ đang đập rất nhanh... Tớ muốn chính thức thổ lộ tình cảm với cậu đêm nay."
            : (charKey === "kou" ? "Kou hồi hộp quá nè... Em muốn tỏ tình với người ta dưới bầu trời sao này!" : "Nhìn thẳng vào mắt anh này nhóc. Anh muốn thổ lộ với em."),
          dialogueTrans: "My heart is racing so fast... I want to formally confess my feelings to you tonight.",
          situation: "Act 6/7: Terminology Check: Which phrase means 'to confess love / confession of feelings'?",
          options: [
            { text: "Thổ lộ tình cảm / Tỏ tình", trans: "To confess romantic feelings / confession" },
            { text: "Tranh cãi gay gắt", trans: "Heated argument" },
            { text: "Bỏ cuộc giữa chừng", trans: "Giving up midway" }
          ],
          correctIdx: 0,
          explanation: "'Thổ lộ tình cảm' and 'Tỏ tình' signify the heartfelt confession of love."
        },
        {
          partnerDialogue: charKey === "ado" 
            ? "Tớ thích cậu. Không phải chỉ như bạn bè... mà là muốn yêu thương và che chở cậu trọn vẹn. Cậu làm người yêu tớ nhé?"
            : (charKey === "kou" ? "Kou yêu người ta nhiều lắm! Xin hãy cho Kou cơ hội được làm bạn trai của người ta nhé!" : "Anh thích nhóc rồi đấy. Từ nay về sau, em chính thức là người yêu của anh nhé?"),
          dialogueTrans: "I love you. Not just as friends... but I want to cherish and care for you completely. Will you be mine?",
          situation: "Act 7/7: Climax Confession: How do you respond to their confession to seal the Soulmate bond?",
          options: [
            { text: "Xin lỗi, tôi chỉ xem cậu là bạn học.", trans: "Sorry, I only see you as a classmate." },
            { text: `${selfCap} cũng yêu ${partnerAddress} rất nhiều! ${selfCap} đồng ý!`, trans: `I love you so much too! I happily say yes!` },
            { text: "Để tôi suy nghĩ mười năm nữa rồi trả lời.", trans: "Let me think for 10 years then answer." }
          ],
          correctIdx: 1,
          explanation: "Saying 'Em cũng yêu anh / Tớ cũng yêu cậu rất nhiều! Em đồng ý!' seals the Soulmate level date scenario with absolute bliss!"
        }
      ]);
    }
  }

  // =========================================================================
  // JAPANESE TARGET LANGUAGE (Romaji, Hiragana/Kanji & English translations)
  // =========================================================================
  if (targetLang === "ja") {
    if (scId === 1) {
      return normalize([
        {
          partnerDialogue: charKey === "ado" ? "ここに座って。窓側の席をとっておいたから。" : (charKey === "kou" ? "先輩！隣の席あけて待ってました！" : "ここ座れよ。図書館混んでるから席取っといたぞ。"),
          dialogueTrans: "Sit down here. I saved a window seat for you.",
          situation: "Act 1/7: Thanking your partner for saving a seat in the library:",
          options: [
            { text: "自分で探すからいいよ。", trans: "I'll find my own seat." },
            { text: "ありがとう！すごく助かったよ。", trans: "Thank you so much! That helped a lot." },
            { text: "この椅子硬いから嫌だ。", trans: "This chair is too hard, I dislike it." }
          ],
          correctIdx: 1,
          explanation: "'ありがとう！すごく助かったよ' expresses warm and polite gratitude."
        },
        {
          partnerDialogue: "この文法問題、少し難しいけど一緒にやってみる？",
          dialogueTrans: "This grammar exercise is a bit tricky, shall we study it together?",
          situation: "Act 2/7: Inviting collaborative studying in Japanese:",
          options: [
            { text: "うん！一緒に勉強しよう！", trans: "Yes! Let's study together!" },
            { text: "難しすぎるからやめる。", trans: "Too hard, quitting." },
            { text: "自分でやってよ。", trans: "Do it by yourself." }
          ],
          correctIdx: 0,
          explanation: "'一緒に勉強しよう' (Let's study together) is encouraging and friendly."
        },
        {
          partnerDialogue: "図書館だから静かにね。小声で話そう。",
          dialogueTrans: "We are in the library, so stay quiet. Let's speak in whispers.",
          situation: "Act 3/7: Vocabulary: What does '小声' (kogoe) mean?",
          options: [
            { text: "Loud scream", trans: "大声" },
            { text: "Singing voice", trans: "歌声" },
            { text: "Whisper / low soft voice", trans: "ささやき声 / 小さな声" }
          ],
          correctIdx: 2,
          explanation: "'小声' (kogoe) means speaking in a quiet, low whisper."
        },
        {
          partnerDialogue: "ピンクの蛍光ペン忘れてきちゃって…借りてもいい？",
          dialogueTrans: "I forgot my pink highlighter... may I borrow one?",
          situation: "Act 4/7: Lending stationery with a warm response:",
          options: [
            { text: "どうぞ！自由に使ってね！", trans: "Here you go! Feel free to use it!" },
            { text: "貸したくない。", trans: "Don't want to lend." },
            { text: "有料だよ。", trans: "That will cost money." }
          ],
          correctIdx: 0,
          explanation: "'どうぞ！自由に使ってね' is welcoming, polite, and friendly."
        },
        {
          partnerDialogue: "あっ…指が触れちゃった…びっくりした？",
          dialogueTrans: "Ah... our fingers touched... did I startle you?",
          situation: "Act 5/7: Responding to accidental hand touch:",
          options: [
            { text: "触らないでよ！", trans: "Don't touch me!" },
            { text: "大丈夫だよ、手が温かいね…", trans: "It's okay, your hand is so warm..." },
            { text: "手を洗ってきて。", trans: "Go wash your hands." }
          ],
          correctIdx: 1,
          explanation: "Saying '手が温かいね' (your hand is warm) shows sweet emotional openness."
        },
        {
          partnerDialogue: "ノートに秘密のメモを挟んでおいたよ…",
          dialogueTrans: "I slipped a secret memo into your notebook...",
          situation: "Act 6/7: Vocabulary: What is a 'メモ' (memo)?",
          options: [
            { text: "Heavy textbook", trans: "教科書" },
            { text: "Store bill", trans: "レシート" },
            { text: "Short written note", trans: "短いメモ用紙" }
          ],
          correctIdx: 2,
          explanation: "'メモ' refers to a handwritten note or memo slip."
        },
        {
          partnerDialogue: "もうすぐ閉館時間だね。一緒に帰ろうか？",
          dialogueTrans: "It's almost closing time. Shall we walk home together?",
          situation: "Act 7/7: Accepting the invitation to walk home together:",
          options: [
            { text: "うん！一緒に帰ろう！", trans: "Yes! Let's walk home together!" },
            { text: "一人で帰る。", trans: "I'll go home alone." },
            { text: "面倒くさい。", trans: "Too troublesome." }
          ],
          correctIdx: 0,
          explanation: "'一緒に帰ろう' (Let's walk home together) is the classic sweet dating closing line."
        }
      ]);
    } else {
      // Default Japanese scenarios (7 questions)
      return normalize([
        {
          partnerDialogue: "今日は会えてすごく嬉しいよ！",
          dialogueTrans: "I'm so glad to see you today!",
          situation: "Act 1/7: Greeting your date warmly:",
          options: [
            { text: "帰りたい。", trans: "I want to go home." },
            { text: "私も会えて嬉しいよ！", trans: "I'm so happy to see you too!" },
            { text: "別に普通。", trans: "Nothing special." }
          ],
          correctIdx: 1,
          explanation: "'私も会えて嬉しいよ' expresses mutual romantic happiness."
        },
        {
          partnerDialogue: "何が飲みたい？頼んでくるね。",
          dialogueTrans: "What would you like to drink? I'll go order.",
          situation: "Act 2/7: Ordering a warm drink in Japanese:",
          options: [
            { text: "温かいお茶をお願いします！", trans: "Warm tea, please!" },
            { text: "何もいらない。", trans: "Don't want anything." },
            { text: "一番高いやつ。", trans: "The most expensive one." }
          ],
          correctIdx: 0,
          explanation: "'温かいお茶をお願いします' is a polite, natural cafe order."
        },
        {
          partnerDialogue: "寒くない？風が冷たいね。",
          dialogueTrans: "Aren't you cold? The wind is chilly.",
          situation: "Act 3/7: Caring about comfort & warmth:",
          options: [
            { text: "ほっといて。", trans: "Leave me alone." },
            { text: "うるさいな。", trans: "You're noisy." },
            { text: "少し寒いけど、一緒にいるから温かいよ。", trans: "A bit chilly, but warm being with you." }
          ],
          correctIdx: 2,
          explanation: "Saying being with them makes you warm is an adorable romantic line."
        },
        {
          partnerDialogue: "この景色、すごく綺麗だね！",
          dialogueTrans: "This scenery is so beautiful!",
          situation: "Act 4/7: Agreeing on the beautiful view:",
          options: [
            { text: "本当に綺麗！感動しちゃうね。", trans: "Really beautiful! So touching." },
            { text: "全然綺麗じゃない。", trans: "Not pretty at all." },
            { text: "早く次行こう。", trans: "Let's hurry to next place." }
          ],
          correctIdx: 0,
          explanation: "'本当に綺麗！' shares the romantic appreciation."
        },
        {
          partnerDialogue: "手をつないでもいい…？",
          dialogueTrans: "May I hold your hand...?",
          situation: "Act 5/7: Holding hands romantically:",
          options: [
            { text: "嫌だ。", trans: "No way." },
            { text: "うん、つなごう！", trans: "Yes, let's hold hands!" },
            { text: "触らないで。", trans: "Don't touch." }
          ],
          correctIdx: 1,
          explanation: "'うん、つなごう' accepts holding hands lovingly."
        },
        {
          partnerDialogue: "君のことが…ずっと好きだったんだ。",
          dialogueTrans: "I... have always loved you.",
          situation: "Act 6/7: Vocabulary: What does '好き' (suki) mean?",
          options: [
            { text: "Hate / dislike", trans: "嫌い" },
            { text: "Bored", trans: "退屈" },
            { text: "Love / like romantically", trans: "好き / 愛情" }
          ],
          correctIdx: 2,
          explanation: "'好き' (suki) means to love or like someone romantically."
        },
        {
          partnerDialogue: "僕と付き合ってくれますか？",
          dialogueTrans: "Will you go out with me?",
          situation: "Act 7/7: Climax Confession: Responding 'Yes' to the confession:",
          options: [
            { text: "はい！喜んで！よろしくお願いします！", trans: "Yes! With joy! Please treat me well!" },
            { text: "無理です。", trans: "Impossible." },
            { text: "考えておきます。", trans: "I'll think about it." }
          ],
          correctIdx: 0,
          explanation: "'はい！喜んで！' is the happiest possible romantic response!"
        }
      ]);
    }
  }

  // =========================================================================
  // ENGLISH TARGET LANGUAGE (Conversational dating fluency)
  // =========================================================================
  return normalize([
    {
      partnerDialogue: "I saved a seat right next to the window for you! Come sit down.",
      dialogueTrans: "Tôi đã giữ chỗ cạnh cửa sổ cho bạn rồi! Lại đây ngồi đi.",
      situation: "Act 1/7: Thanking your partner for saving a seat:",
      options: [
        { text: "I'd rather sit alone over there.", trans: "Tôi thà ngồi một mình đằng kia." },
        { text: "Thank you so much, you are so thoughtful!", trans: "Cảm ơn bạn nhiều nhé, bạn chu đáo quá!" },
        { text: "This chair looks uncomfortable.", trans: "Ghế này trông không thoải mái." }
      ],
      correctIdx: 1,
      explanation: "Expressing genuine gratitude with 'so thoughtful' is polite and charming."
    },
    {
      partnerDialogue: "This grammar exercise looks a bit tough. Want to study it together?",
      dialogueTrans: "Bài tập này trông hơi khó. Chúng mình cùng học nhé?",
      situation: "Act 2/7: Agreeing to study together:",
      options: [
        { text: "Yes, let's review it together!", trans: "Được chứ, cùng nhau ôn tập nào!" },
        { text: "No, do it yourself.", trans: "Không, tự làm đi." },
        { text: "I'm quitting studying today.", trans: "Hôm nay tôi dẹp không học nữa." }
      ],
      correctIdx: 0,
      explanation: "'Let's review it together' is encouraging and collaborative."
    },
    {
      partnerDialogue: "Shh, we need to keep our voices down in here. Let's whisper.",
      dialogueTrans: "Suỵt, chúng mình phải nói nhỏ thôi. Thì thầm nhé.",
      situation: "Act 3/7: Vocabulary: What does 'whisper' mean?",
      options: [
        { text: "To shout loudly", trans: "Hét lớn tiếng" },
        { text: "To laugh hysterically", trans: "Cười nghiêng ngả" },
        { text: "To speak very softly", trans: "Nói thì thầm thật nhỏ" }
      ],
      correctIdx: 2,
      explanation: "'Whisper' means speaking in a quiet, soft breath."
    },
    {
      partnerDialogue: "Do you have a pink highlighter I could borrow for a second?",
      dialogueTrans: "Bạn có bút dạ quang cho mình mượn một lát được không?",
      situation: "Act 4/7: Lending stationery politely:",
      options: [
        { text: "Here you go, feel free to use it!", trans: "Đây nè, bạn cứ dùng tự nhiên nha!" },
        { text: "No, buy your own.", trans: "Không, tự đi mua đi." },
        { text: "It costs $5 per minute.", trans: "Mượn tốn 5 đô mỗi phút." }
      ],
      correctIdx: 0,
      explanation: "'Feel free to use it' is warm, polite, and generous."
    },
    {
      partnerDialogue: "Ah... our hands brushed against each other. Did I startle you?",
      dialogueTrans: "Á... tay chúng mình chạm nhau rồi. Mình làm bạn giật mình à?",
      situation: "Act 5/7: Reacting to an accidental hand touch:",
      options: [
        { text: "Don't touch me ever again.", trans: "Đừng bao giờ chạm vào tôi nữa." },
        { text: "Not at all, your hand is so warm...", trans: "Không sao đâu, tay bạn ấm lắm..." },
        { text: "Go wash your hands immediately.", trans: "Đi rửa tay ngay đi." }
      ],
      correctIdx: 1,
      explanation: "Saying 'your hand is so warm' shows sweet vulnerability."
    },
    {
      partnerDialogue: "I slipped a secret note into your book page for later...",
      dialogueTrans: "Mình lén kẹp một mảnh giấy nhắn vào sách của bạn đấy...",
      situation: "Act 6/7: Reacting to a cute secret note:",
      options: [
        { text: "I'll throw it away.", trans: "Tôi sẽ vứt nó đi." },
        { text: "Notes are useless.", trans: "Ghi chú thật vô ích." },
        { text: "I can't wait to read it when I get home!", trans: "Mình nóng lòng được đọc nó khi về nhà!" }
      ],
      correctIdx: 2,
      explanation: "Anticipating reading their note shows affection and interest."
    },
    {
      partnerDialogue: "The library is closing soon... Shall we walk home together?",
      dialogueTrans: "Thư viện sắp đóng cửa rồi... Chúng mình cùng đi về chung nhé?",
      situation: "Act 7/7: Closing the study date:",
      options: [
        { text: "I'd love to walk home with you!", trans: "Mình rất thích được đi về cùng bạn!" },
        { text: "Leave me alone.", trans: "Để tôi yên." },
        { text: "Walk behind me ten paces.", trans: "Đi cách xa tôi 10 bước." }
      ],
      correctIdx: 0,
      explanation: "'I'd love to walk home with you' is the sweetest romantic finale for the date."
    }
  ]);
}
