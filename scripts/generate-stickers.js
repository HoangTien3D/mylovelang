import sharp from "sharp";
import fs from "fs";
import path from "path";

// 256x256 SVG illustrations with die-cut sticker borders and vibrant chibi art
const adoStickerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="adoHair" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>

  <!-- Sticker White Die-cut Outline Background with Soft Shadow -->
  <g filter="url(#shadow)">
    <!-- Die cut bubble silhouette -->
    <path d="M 128,12 
             C 175,12 215,40 226,85 
             C 245,115 244,160 218,190 
             C 195,225 155,244 110,244 
             C 65,244 26,218 16,175 
             C 4,125 24,65 72,28 
             C 89,16 108,12 128,12 Z" 
          fill="#ffffff" stroke="#e2e8f0" stroke-width="4" stroke-linejoin="round"/>
  </g>

  <!-- Sparkles & Stars -->
  <path d="M48,58 L52,42 L56,58 L72,62 L56,66 L52,82 L48,66 L32,62 Z" fill="#fbbf24"/>
  <path d="M210,50 L212,38 L214,50 L226,52 L214,54 L212,66 L210,54 L198,52 Z" fill="#34d399"/>
  <circle cx="218" cy="140" r="5" fill="#f472b6"/>
  <circle cx="42" cy="130" r="4" fill="#38bdf8"/>

  <!-- Chibi Ado Body -->
  <g transform="translate(0, 5)">
    <!-- School Uniform / Shoulders -->
    <path d="M78,172 Q128,154 178,172 L186,210 Q128,222 70,210 Z" fill="#1e293b"/>
    <!-- Collar & Tie -->
    <path d="M106,172 L128,198 L150,172 Z" fill="#f8fafc"/>
    <path d="M124,178 L132,178 L130,206 L126,206 Z" fill="#10b981"/>

    <!-- Left Arm holding Book / Thumbs Up -->
    <rect x="52" y="162" width="34" height="42" rx="4" transform="rotate(-15 52 162)" fill="#059669" stroke="#ffffff" stroke-width="2"/>
    <rect x="56" y="166" width="26" height="34" rx="2" transform="rotate(-15 52 162)" fill="#ecfdf5"/>
    <text x="56" y="188" font-family="sans-serif" font-size="10" font-weight="bold" fill="#047857" transform="rotate(-15 52 162)">A+</text>

    <!-- Head / Face -->
    <ellipse cx="128" cy="115" rx="54" ry="46" fill="#fef2f2"/>
    
    <!-- Hair Back -->
    <path d="M72,110 Q128,45 184,110 Q192,150 178,165 Q165,130 160,125 Q128,140 96,125 Q85,145 78,165 Q64,145 72,110 Z" fill="url(#adoHair)"/>

    <!-- Hair Bangs -->
    <path d="M72,100 Q100,60 128,62 Q156,60 184,100 Q168,90 148,94 Q132,84 122,96 Q110,84 94,95 Q82,90 72,100 Z" fill="url(#adoHair)"/>

    <!-- Stylish Red-framed Glasses -->
    <rect x="88" y="100" width="32" height="20" rx="6" fill="none" stroke="#dc2626" stroke-width="3"/>
    <rect x="136" y="100" width="32" height="20" rx="6" fill="none" stroke="#dc2626" stroke-width="3"/>
    <line x1="120" y1="108" x2="136" y2="108" stroke="#dc2626" stroke-width="3"/>

    <!-- Cute Eyes behind Glasses -->
    <ellipse cx="104" cy="110" rx="8" ry="9" fill="#0f766e"/>
    <circle cx="107" cy="107" r="3" fill="#ffffff"/>
    <circle cx="102" cy="113" r="1.5" fill="#ffffff"/>

    <ellipse cx="152" cy="110" rx="8" ry="9" fill="#0f766e"/>
    <circle cx="155" cy="107" r="3" fill="#ffffff"/>
    <circle cx="150" cy="113" r="1.5" fill="#ffffff"/>

    <!-- Blushing Tsundere Cheeks -->
    <ellipse cx="90" cy="122" rx="9" ry="5" fill="#f87171" opacity="0.6"/>
    <ellipse cx="166" cy="122" rx="9" ry="5" fill="#f87171" opacity="0.6"/>
    <line x1="86" y1="120" x2="94" y2="124" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="162" y1="120" x2="170" y2="124" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Determined Smiling Mouth -->
    <path d="M120,126 Q128,134 136,126" fill="none" stroke="#991b1b" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- Motivational Banner Ribbon -->
  <g transform="translate(128, 222)">
    <rect x="-85" y="-14" width="170" height="28" rx="14" fill="url(#badgeGrad)" stroke="#ffffff" stroke-width="2"/>
    <text x="0" y="5" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5px">CỐ LÊN NHÉ! 📚</text>
  </g>
</svg>
`;

const kouStickerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <filter id="shadowKou" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#78350f" flood-opacity="0.3"/>
    </filter>
    <linearGradient id="kouHair" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="kouBadge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Sticker White Die-cut Background -->
  <g filter="url(#shadowKou)">
    <path d="M 128,10 
             C 178,8 220,38 230,86 
             C 248,120 242,166 216,195 
             C 192,228 152,246 110,246 
             C 62,246 22,216 14,170 
             C 2,120 22,58 74,24 
             C 90,14 109,10 128,10 Z" 
          fill="#ffffff" stroke="#fef3c7" stroke-width="4" stroke-linejoin="round"/>
  </g>

  <!-- Sparkling Cheering Hearts & Stars -->
  <path d="M38,52 C38,44 48,38 54,46 C60,38 70,44 70,52 C70,64 54,74 54,74 C54,74 38,64 38,52 Z" fill="#f43f5e"/>
  <path d="M210,65 C210,58 218,54 222,60 C226,54 234,58 234,65 C234,74 222,82 222,82 C222,82 210,74 210,65 Z" fill="#ec4899"/>
  <path d="M208,138 L212,126 L216,138 L228,142 L216,146 L212,158 L208,146 L196,142 Z" fill="#fbbf24"/>

  <!-- Cheering Pom-poms / Paws -->
  <g transform="translate(0, 4)">
    <circle cx="48" cy="150" r="18" fill="#fbbf24" stroke="#ffffff" stroke-width="2"/>
    <circle cx="52" cy="146" r="14" fill="#f59e0b"/>
    <circle cx="208" cy="150" r="18" fill="#fbbf24" stroke="#ffffff" stroke-width="2"/>
    <circle cx="204" cy="146" r="14" fill="#f59e0b"/>

    <!-- Cozy Oversized Knit Hoodie -->
    <path d="M78,172 Q128,158 178,172 L188,212 Q128,224 68,212 Z" fill="#fef3c7"/>
    <path d="M105,172 Q128,196 151,172 Z" fill="#fbbf24"/>

    <!-- Chibi Kou Head -->
    <ellipse cx="128" cy="112" rx="55" ry="46" fill="#fffbeb"/>

    <!-- Hair Back & Fluffy Curls -->
    <path d="M68,105 Q128,38 188,105 Q200,140 185,160 Q170,128 162,122 Q128,136 94,122 Q86,132 71,160 Q56,138 68,105 Z" fill="url(#kouHair)"/>

    <!-- Cute Ahoge Cowlick bounce -->
    <path d="M128,42 Q145,15 160,25 Q145,35 136,44 Z" fill="#d97706"/>

    <!-- Hair Bangs -->
    <path d="M70,98 Q96,55 128,58 Q160,55 186,98 Q168,88 152,94 Q134,82 124,96 Q112,82 96,94 Q82,88 70,98 Z" fill="url(#kouHair)"/>

    <!-- Big Sparkling Puppy Eyes -->
    <ellipse cx="102" cy="112" rx="10" ry="12" fill="#b45309"/>
    <ellipse cx="102" cy="110" rx="9" ry="10" fill="#d97706"/>
    <circle cx="105" cy="106" r="4.5" fill="#ffffff"/>
    <circle cx="98" cy="115" r="2.5" fill="#ffffff"/>
    <polygon points="106,112 108,115 105,116 103,113" fill="#fef08a"/>

    <ellipse cx="154" cy="112" rx="10" ry="12" fill="#b45309"/>
    <ellipse cx="154" cy="110" rx="9" ry="10" fill="#d97706"/>
    <circle cx="157" cy="106" r="4.5" fill="#ffffff"/>
    <circle cx="150" cy="115" r="2.5" fill="#ffffff"/>
    <polygon points="158,112 160,115 157,116 155,113" fill="#fef08a"/>

    <!-- Rosy Happy Cheeks -->
    <ellipse cx="88" cy="124" rx="10" ry="6" fill="#fb7185" opacity="0.65"/>
    <ellipse cx="168" cy="124" rx="10" ry="6" fill="#fb7185" opacity="0.65"/>

    <!-- Sweet Cat/Happy Smile :3 -->
    <path d="M118,126 Q124,133 128,128 Q132,133 138,126" fill="none" stroke="#881337" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- Motivational Banner Ribbon -->
  <g transform="translate(128, 222)">
    <rect x="-85" y="-14" width="170" height="28" rx="14" fill="url(#kouBadge)" stroke="#ffffff" stroke-width="2"/>
    <text x="0" y="5" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5px">CHỊ GIỎI LẮM! 💕</text>
  </g>
</svg>
`;

const renStickerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <filter id="shadowRen" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#2e1065" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="renHair" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="renBadge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
  </defs>

  <!-- Sticker White Die-cut Background -->
  <g filter="url(#shadowRen)">
    <path d="M 128,12 
             C 176,10 218,40 228,88 
             C 246,118 244,164 218,192 
             C 194,226 154,244 110,244 
             C 64,244 24,216 16,172 
             C 4,124 22,64 74,28 
             C 90,16 108,12 128,12 Z" 
          fill="#ffffff" stroke="#f3e8ff" stroke-width="4" stroke-linejoin="round"/>
  </g>

  <!-- Cool Sparkles & Musical Notes -->
  <text x="36" y="65" font-size="22" fill="#a855f7">🎸</text>
  <path d="M214,48 L217,34 L220,48 L234,51 L220,54 L217,68 L214,54 L200,51 Z" fill="#c084fc"/>
  <circle cx="218" cy="132" r="4.5" fill="#f43f5e"/>
  <path d="M36,140 Q46,130 52,142 Q42,154 36,140 Z" fill="#ec4899"/>

  <!-- Chibi Ren Body -->
  <g transform="translate(0, 5)">
    <!-- Stylish Dark Leather Jacket & Purple Shirt -->
    <path d="M76,172 Q128,154 180,172 L188,212 Q128,224 68,212 Z" fill="#1e1b4b"/>
    <!-- Purple V-neck & Choker -->
    <path d="M106,172 L128,202 L150,172 Z" fill="#7c3aed"/>
    <rect x="114" y="162" width="28" height="5" rx="2" fill="#09090b"/>
    <circle cx="128" cy="165" r="2.5" fill="#fbbf24"/>

    <!-- Hand with Guitar Pick / Finger Gun / Peace Sign -->
    <g transform="translate(182, 140)">
      <circle cx="14" cy="16" r="14" fill="#fdf4ff" stroke="#7c3aed" stroke-width="2"/>
      <text x="7" y="21" font-size="14" font-weight="bold" fill="#7c3aed">✌️</text>
    </g>

    <!-- Chibi Ren Head -->
    <ellipse cx="128" cy="114" rx="54" ry="46" fill="#fdf4ff"/>

    <!-- Wavy Dark Violet Hair Back -->
    <path d="M70,108 Q128,40 186,108 Q198,142 182,162 Q168,132 160,126 Q128,138 96,126 Q86,136 74,162 Q60,140 70,108 Z" fill="url(#renHair)"/>

    <!-- Sassy Swept Bangs -->
    <path d="M68,102 Q100,55 130,58 Q162,56 186,96 Q164,88 146,92 Q130,78 116,92 Q98,78 84,94 Q76,88 68,102 Z" fill="url(#renHair)"/>

    <!-- Left Eye: Confident Seductive Smirk / Half-lid -->
    <path d="M92,108 Q102,100 114,108" fill="none" stroke="#581c87" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="103" cy="112" rx="7" ry="7" fill="#6b21a8"/>
    <circle cx="105" cy="110" r="2.5" fill="#ffffff"/>

    <!-- Right Eye: Playful Charming Wink! -->
    <path d="M142,112 Q152,102 162,112" fill="none" stroke="#581c87" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M145,116 L159,108" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>

    <!-- Playful Blush & Smirk Fang -->
    <ellipse cx="88" cy="124" rx="9" ry="5" fill="#f43f5e" opacity="0.5"/>
    <ellipse cx="168" cy="124" rx="9" ry="5" fill="#f43f5e" opacity="0.5"/>

    <!-- Smirking mouth with tiny tooth/fang -->
    <path d="M120,128 Q128,134 136,126" fill="none" stroke="#4c1d95" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="130,128 133,133 135,128" fill="#ffffff" stroke="#4c1d95" stroke-width="1"/>
  </g>

  <!-- Motivational Banner Ribbon -->
  <g transform="translate(128, 222)">
    <rect x="-85" y="-14" width="170" height="28" rx="14" fill="url(#renBadge)" stroke="#ffffff" stroke-width="2"/>
    <text x="0" y="5" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5px">NGOAN LẮM, NHÓC! 💜</text>
  </g>
</svg>
`;

async function generateAllStickers() {
  console.log("Generating 256x256 chibi stickers...");

  const stickers = [
    { name: "chibi_ado.png", svg: adoStickerSvg },
    { name: "chibi_kou.png", svg: kouStickerSvg },
    { name: "chibi_ren.png", svg: renStickerSvg }
  ];

  const targets = ["public/stickers", "stickers"];

  for (const targetDir of targets) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const item of stickers) {
      const outPath = path.join(targetDir, item.name);
      await sharp(Buffer.from(item.svg))
        .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 100 })
        .toFile(outPath);
      console.log(`Saved: ${outPath} (256x256px PNG)`);
    }

    // Write a helpful README in the stickers folder
    const readmeContent = `# Otome Chibi Texting Stickers Folder

Welcome! This folder holds the chibi motivator stickers sent by the love interests during chat texting.

## Sticker Specifications:
- **Dimensions**: Exactly **256 × 256 pixels**
- **Format**: PNG (transparent background strongly recommended for authentic die-cut sticker look)
- **Names**:
  1. \`chibi_ado.png\` (Ado's motivator sticker)
  2. \`chibi_kou.png\` (Kou's motivator sticker)
  3. \`chibi_ren.png\` (Ren's motivator sticker)

## How to add your own custom stickers:
Simply replace the existing \`chibi_kou.png\`, \`chibi_ren.png\`, or \`chibi_ado.png\` files in this folder with your own custom 256x256 artwork! The game will immediately display your custom drawings whenever the characters cheer for you or send a sticker in chat.
`;
    fs.writeFileSync(path.join(targetDir, "README.md"), readmeContent);
  }

  console.log("All stickers generated successfully!");
}

generateAllStickers().catch((err) => {
  console.error("Error generating stickers:", err);
  process.exit(1);
});
