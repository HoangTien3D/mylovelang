/**
 * Otome Lingua - Visual Novel Stage Engine & Scenic Vector Art Assets
 * Contains scenic backgrounds, expressive character sprites, Web Audio chime synthesis,
 * and speech synthesis for the Story Date Scenarios mode.
 */

// Helper to convert inline SVG string to clean Data URL
export function svgDataUrl(svgString) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString.trim())
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

// ==========================================================================
// 1. SCENIC VISUAL NOVEL BACKGROUNDS (5 DATE LOCATIONS)
// ==========================================================================
export const VN_SCENERY_SVGS = {
  // Scenario 1: Central Campus Library (Evening, Mahogany shelves, stained-glass, warm lamps)
  library: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="libSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="60%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#312e81"/>
      </linearGradient>
      <linearGradient id="libWood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1f1527"/>
        <stop offset="50%" stop-color="#2d1f3d"/>
        <stop offset="100%" stop-color="#191020"/>
      </linearGradient>
      <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.85"/>
        <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="windowGlow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#818cf8" stop-opacity="0.1"/>
      </linearGradient>
    </defs>

    <!-- Wall & Night Window -->
    <rect width="1200" height="800" fill="url(#libSky)"/>
    <path d="M450 80 Q600 30 750 80 L750 420 L450 420 Z" fill="url(#windowGlow)"/>
    <path d="M450 80 Q600 30 750 80 L750 420 L450 420 Z" fill="none" stroke="#6366f1" stroke-width="6" opacity="0.6"/>
    <line x1="600" y1="50" x2="600" y2="420" stroke="#6366f1" stroke-width="4" opacity="0.5"/>
    <line x1="450" y1="230" x2="750" y2="230" stroke="#6366f1" stroke-width="4" opacity="0.5"/>

    <!-- Left Tall Bookshelves -->
    <rect x="0" y="60" width="340" height="740" fill="url(#libWood)"/>
    <rect x="30" y="110" width="280" height="20" fill="#432857"/>
    <!-- Shelf 1 Books -->
    <rect x="40" y="130" width="260" height="100" fill="#170f20"/>
    <rect x="45" y="140" width="24" height="90" fill="#be185d" rx="2"/>
    <rect x="72" y="145" width="20" height="85" fill="#4338ca" rx="2"/>
    <rect x="95" y="138" width="28" height="92" fill="#047857" rx="2"/>
    <rect x="126" y="142" width="22" height="88" fill="#d97706" rx="2"/>
    <rect x="151" y="148" width="30" height="82" fill="#701a75" rx="2"/>
    <rect x="184" y="140" width="26" height="90" fill="#1e40af" rx="2"/>
    <rect x="213" y="144" width="22" height="86" fill="#be123c" rx="2"/>
    <rect x="238" y="138" width="32" height="92" fill="#0f766e" rx="2"/>
    <rect x="273" y="146" width="24" height="84" fill="#b45309" rx="2"/>

    <!-- Shelf 2 -->
    <rect x="30" y="250" width="280" height="20" fill="#432857"/>
    <rect x="40" y="270" width="260" height="110" fill="#170f20"/>
    <rect x="45" y="280" width="30" height="100" fill="#1e3a8a" rx="2"/>
    <rect x="78" y="285" width="26" height="95" fill="#9d174d" rx="2"/>
    <rect x="107" y="278" width="24" height="102" fill="#065f46" rx="2"/>
    <rect x="134" y="288" width="32" height="92" fill="#854d0e" rx="2"/>
    <rect x="169" y="282" width="26" height="98" fill="#581c87" rx="2"/>
    <rect x="198" y="278" width="28" height="102" fill="#1e40af" rx="2"/>
    <rect x="229" y="284" width="34" height="96" fill="#be185d" rx="2"/>
    <rect x="266" y="280" width="28" height="100" fill="#0f766e" rx="2"/>

    <!-- Shelf 3 -->
    <rect x="30" y="400" width="280" height="20" fill="#432857"/>
    <rect x="40" y="420" width="260" height="120" fill="#170f20"/>
    <rect x="50" y="430" width="34" height="110" fill="#4c1d95" rx="2"/>
    <rect x="87" y="435" width="28" height="105" fill="#b91c1c" rx="2"/>
    <rect x="118" y="428" width="32" height="112" fill="#15803d" rx="2"/>
    <rect x="153" y="440" width="24" height="100" fill="#c2410c" rx="2"/>
    <rect x="180" y="432" width="30" height="108" fill="#1d4ed8" rx="2"/>
    <rect x="213" y="436" width="26" height="104" fill="#a21caf" rx="2"/>
    <rect x="242" y="430" width="32" height="110" fill="#047857" rx="2"/>

    <!-- Right Tall Bookshelves -->
    <rect x="860" y="60" width="340" height="740" fill="url(#libWood)"/>
    <rect x="890" y="110" width="280" height="20" fill="#432857"/>
    <rect x="900" y="130" width="260" height="100" fill="#170f20"/>
    <rect x="910" y="140" width="28" height="90" fill="#047857" rx="2"/>
    <rect x="941" y="146" width="32" height="84" fill="#831843" rx="2"/>
    <rect x="976" y="138" width="24" height="92" fill="#1e3a8a" rx="2"/>
    <rect x="1003" y="144" width="28" height="86" fill="#b45309" rx="2"/>
    <rect x="1034" y="140" width="26" height="90" fill="#581c87" rx="2"/>
    <rect x="1063" y="148" width="34" height="82" fill="#be123c" rx="2"/>
    <rect x="1100" y="142" width="26" height="88" fill="#0f766e" rx="2"/>

    <rect x="890" y="250" width="280" height="20" fill="#432857"/>
    <rect x="900" y="270" width="260" height="110" fill="#170f20"/>
    <rect x="910" y="280" width="32" height="100" fill="#a21caf" rx="2"/>
    <rect x="945" y="284" width="28" height="96" fill="#1e40af" rx="2"/>
    <rect x="976" y="278" width="30" height="102" fill="#15803d" rx="2"/>
    <rect x="1009" y="286" width="26" height="94" fill="#be185d" rx="2"/>
    <rect x="1038" y="280" width="34" height="100" fill="#d97706" rx="2"/>
    <rect x="1075" y="285" width="26" height="95" fill="#4338ca" rx="2"/>

    <!-- Library Study Desk in Foreground -->
    <path d="M150 560 L1050 560 L1150 800 L50 800 Z" fill="#2b1810"/>
    <polygon points="150,560 1050,560 1070,590 130,590" fill="#3d2317"/>

    <!-- Green Banker's Lamp & Warm Glow -->
    <circle cx="280" cy="530" r="160" fill="url(#lampGlow)"/>
    <circle cx="920" cy="530" r="160" fill="url(#lampGlow)"/>
    <path d="M250 540 Q280 500 310 540 Z" fill="#065f46"/>
    <rect x="276" y="540" width="8" height="40" fill="#d97706"/>
    <rect x="260" y="580" width="40" height="10" rx="4" fill="#b45309"/>

    <path d="M890 540 Q920 500 950 540 Z" fill="#065f46"/>
    <rect x="916" y="540" width="8" height="40" fill="#d97706"/>
    <rect x="900" y="580" width="40" height="10" rx="4" fill="#b45309"/>

    <!-- Open Study Notebook & Pens on Table -->
    <polygon points="520,620 680,620 710,720 490,720" fill="#f8fafc" opacity="0.95"/>
    <line x1="600" y1="620" x2="600" y2="720" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="535" y1="640" x2="585" y2="640" stroke="#94a3b8" stroke-width="2"/>
    <line x1="535" y1="660" x2="585" y2="660" stroke="#94a3b8" stroke-width="2"/>
    <line x1="535" y1="680" x2="580" y2="680" stroke="#94a3b8" stroke-width="2"/>
    <line x1="615" y1="640" x2="665" y2="640" stroke="#94a3b8" stroke-width="2"/>
    <line x1="615" y1="660" x2="665" y2="660" stroke="#94a3b8" stroke-width="2"/>

    <!-- Stylized Pink Highlighter & Pen -->
    <rect x="460" y="660" width="40" height="6" fill="#ec4899" transform="rotate(-20 460 660)" rx="2"/>
    <rect x="715" y="655" width="48" height="5" fill="#3b82f6" transform="rotate(15 715 655)" rx="1.5"/>

    <!-- Soft Golden Floating Dust Particles -->
    <circle cx="580" cy="300" r="2.5" fill="#fde68a" opacity="0.7"/>
    <circle cx="630" cy="240" r="3.5" fill="#fde68a" opacity="0.6"/>
    <circle cx="520" cy="400" r="2" fill="#fde68a" opacity="0.5"/>
    <circle cx="690" cy="350" r="3" fill="#fde68a" opacity="0.8"/>
  </svg>`),

  // Scenario 2: Rainy Cafe (Window with raindrops, cozy lights, coffee steam)
  cafe: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="cafeRainBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="50%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <radialGradient id="bokeh1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="bokeh2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="pendantGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Rainy Street Outside Glass -->
    <rect width="1200" height="800" fill="url(#cafeRainBg)"/>

    <!-- Blurred Streetlights (Bokeh) -->
    <circle cx="280" cy="220" r="80" fill="url(#bokeh1)"/>
    <circle cx="480" cy="180" r="100" fill="url(#bokeh2)"/>
    <circle cx="820" cy="240" r="120" fill="url(#bokeh1)"/>
    <circle cx="980" cy="190" r="70" fill="url(#bokeh2)"/>
    <circle cx="600" cy="300" r="90" fill="url(#bokeh1)"/>

    <!-- Window Glass Frame & Divider -->
    <rect x="0" y="0" width="1200" height="580" fill="#38bdf8" opacity="0.08"/>
    <line x1="600" y1="0" x2="600" y2="580" stroke="#1e293b" stroke-width="20"/>
    <line x1="0" y1="300" x2="1200" y2="300" stroke="#1e293b" stroke-width="14"/>

    <!-- Diagonal Rain Streaks on Window Pane -->
    <line x1="120" y1="40" x2="80" y2="220" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="30 15" opacity="0.6"/>
    <line x1="320" y1="20" x2="270" y2="260" stroke="#93c5fd" stroke-width="2" stroke-dasharray="40 20" opacity="0.7"/>
    <line x1="500" y1="60" x2="460" y2="280" stroke="#93c5fd" stroke-width="3" stroke-dasharray="25 15" opacity="0.8"/>
    <line x1="720" y1="10" x2="670" y2="290" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="35 18" opacity="0.6"/>
    <line x1="940" y1="50" x2="900" y2="270" stroke="#93c5fd" stroke-width="2" stroke-dasharray="30 20" opacity="0.7"/>
    <line x1="1100" y1="30" x2="1050" y2="250" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="40 15" opacity="0.5"/>

    <!-- Hanging Amber Pendant Lights -->
    <circle cx="340" cy="140" r="140" fill="url(#pendantGlow)"/>
    <line x1="340" y1="0" x2="340" y2="100" stroke="#78350f" stroke-width="4"/>
    <path d="M310 100 Q340 80 370 100 L355 130 L325 130 Z" fill="#b45309"/>
    <circle cx="340" cy="140" r="14" fill="#fef08a"/>

    <circle cx="860" cy="140" r="140" fill="url(#pendantGlow)"/>
    <line x1="860" y1="0" x2="860" y2="100" stroke="#78350f" stroke-width="4"/>
    <path d="M830 100 Q860 80 890 100 L875 130 L845 130 Z" fill="#b45309"/>
    <circle cx="860" cy="140" r="14" fill="#fef08a"/>

    <!-- Wooden Cafe Table in Foreground -->
    <path d="M100 540 L1100 540 L1200 800 L0 800 Z" fill="#382216"/>
    <polygon points="100,540 1100,540 1120,570 80,570" fill="#523221"/>

    <!-- Steaming Coffee Cup & Saucer (Left) -->
    <ellipse cx="380" cy="670" rx="55" ry="18" fill="#d97706" opacity="0.4"/>
    <ellipse cx="380" cy="660" rx="45" ry="14" fill="#ffffff"/>
    <path d="M350 620 L410 620 L400 660 L360 660 Z" fill="#ffffff"/>
    <ellipse cx="380" cy="620" rx="30" ry="10" fill="#78350f"/>
    <!-- Coffee Steam -->
    <path d="M375 600 Q365 570 380 540" stroke="#fed7aa" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M390 605 Q400 575 385 545" stroke="#fed7aa" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>

    <!-- Matcha Latte / Sweet Cake (Right) -->
    <ellipse cx="820" cy="670" rx="55" ry="18" fill="#d97706" opacity="0.4"/>
    <ellipse cx="820" cy="660" rx="45" ry="14" fill="#ffffff"/>
    <path d="M790 620 L850 620 L840 660 L800 660 Z" fill="#ffffff"/>
    <ellipse cx="820" cy="620" rx="30" ry="10" fill="#047857"/>
    <!-- Heart Foam Art -->
    <path d="M820 623 C815 617, 810 622, 820 626 C830 622, 825 617, 820 623 Z" fill="#ffffff"/>
    <path d="M815 600 Q805 570 820 540" stroke="#bbf7d0" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
  </svg>`),

  // Scenario 3: Sunset Riverbank Walk (Golden sky, river waves, cherry blossoms)
  riverbank: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4c0519"/>
        <stop offset="35%" stop-color="#be185d"/>
        <stop offset="70%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fde68a"/>
      </linearGradient>
      <linearGradient id="riverWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="30%" stop-color="#be185d"/>
        <stop offset="80%" stop-color="#4c1d95"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbeb" stop-opacity="1"/>
        <stop offset="30%" stop-color="#fef08a" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Golden Sunset Sky -->
    <rect width="1200" height="480" fill="url(#sunsetSky)"/>

    <!-- Glowing Sun on Horizon -->
    <circle cx="600" cy="380" r="160" fill="url(#sunGlow)"/>
    <circle cx="600" cy="380" r="45" fill="#ffffff"/>

    <!-- Distant City Silhouette -->
    <path d="M0 420 L150 420 L150 360 L190 360 L190 420 L320 420 L320 330 L360 330 L360 420 L500 420 L500 390 L550 390 L550 420 L720 420 L720 350 L770 350 L770 420 L920 420 L920 380 L960 380 L960 420 L1200 420 L1200 440 L0 440 Z" fill="#500724" opacity="0.85"/>

    <!-- River Water -->
    <rect x="0" y="420" width="1200" height="240" fill="url(#riverWater)"/>

    <!-- Water Sun Glare Reflection -->
    <polygon points="560,420 640,420 680,660 520,660" fill="#fef08a" opacity="0.35"/>
    <ellipse cx="600" cy="460" rx="80" ry="4" fill="#ffffff" opacity="0.6"/>
    <ellipse cx="590" cy="490" rx="110" ry="5" fill="#ffffff" opacity="0.5"/>
    <ellipse cx="610" cy="530" rx="130" ry="6" fill="#ffffff" opacity="0.5"/>
    <ellipse cx="600" cy="580" rx="150" ry="7" fill="#ffffff" opacity="0.4"/>

    <!-- Riverside Promenade Pavement -->
    <path d="M0 640 L1200 640 L1200 800 L0 800 Z" fill="#1f1527"/>
    <line x1="0" y1="640" x2="1200" y2="640" stroke="#db2777" stroke-width="4"/>

    <!-- Promenade Railing -->
    <line x1="0" y1="610" x2="1200" y2="610" stroke="#f472b6" stroke-width="5" opacity="0.8"/>
    <line x1="0" y1="580" x2="1200" y2="580" stroke="#f472b6" stroke-width="5" opacity="0.8"/>
    <line x1="120" y1="580" x2="120" y2="640" stroke="#f472b6" stroke-width="6"/>
    <line x1="360" y1="580" x2="360" y2="640" stroke="#f472b6" stroke-width="6"/>
    <line x1="600" y1="580" x2="600" y2="640" stroke="#f472b6" stroke-width="6"/>
    <line x1="840" y1="580" x2="840" y2="640" stroke="#f472b6" stroke-width="6"/>
    <line x1="1080" y1="580" x2="1080" y2="640" stroke="#f472b6" stroke-width="6"/>

    <!-- Romantic Drifting Sakura Petals -->
    <path d="M220 280 C210 270, 230 260, 235 275 C240 290, 230 290, 220 280 Z" fill="#fbcfe8" opacity="0.85"/>
    <path d="M420 210 C410 200, 430 190, 435 205 C440 220, 430 220, 420 210 Z" fill="#fbcfe8" opacity="0.75" transform="rotate(25 420 210)"/>
    <path d="M780 250 C770 240, 790 230, 795 245 C800 260, 790 260, 780 250 Z" fill="#fbcfe8" opacity="0.9" transform="rotate(-35 780 250)"/>
    <path d="M960 320 C950 310, 970 300, 975 315 C980 330, 970 330, 960 320 Z" fill="#fbcfe8" opacity="0.8" transform="rotate(45 960 320)"/>
    <path d="M310 460 C300 450, 320 440, 325 455 C330 470, 320 470, 310 460 Z" fill="#fbcfe8" opacity="0.9" transform="rotate(15 310 460)"/>
  </svg>`),

  // Scenario 4: Weekend Night Festival & Fireworks (Lanterns, night stalls, fireworks)
  festival: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="nightFestSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#090514"/>
        <stop offset="60%" stop-color="#1e1035"/>
        <stop offset="100%" stop-color="#3b1354"/>
      </linearGradient>
      <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#ef4444" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="fireworkGlow1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#ec4899"/>
        <stop offset="70%" stop-color="#8b5cf6" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="fireworkGlow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#38bdf8"/>
        <stop offset="70%" stop-color="#6366f1" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Night Festival Sky -->
    <rect width="1200" height="800" fill="url(#nightFestSky)"/>

    <!-- Distant Fireworks in Night Sky -->
    <circle cx="340" cy="160" r="140" fill="url(#fireworkGlow1)"/>
    <!-- Firework 1 Sparks -->
    <line x1="340" y1="160" x2="340" y2="50" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="340" y1="160" x2="430" y2="90" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="340" y1="160" x2="450" y2="160" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="340" y1="160" x2="420" y2="230" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="340" y1="160" x2="250" y2="230" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="340" y1="160" x2="230" y2="160" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="340" y1="160" x2="260" y2="90" stroke="#f472b6" stroke-width="2" stroke-dasharray="10 10"/>

    <circle cx="860" cy="200" r="150" fill="url(#fireworkGlow2)"/>
    <!-- Firework 2 Sparks -->
    <line x1="860" y1="200" x2="860" y2="80" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>
    <line x1="860" y1="200" x2="960" y2="120" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>
    <line x1="860" y1="200" x2="980" y2="200" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>
    <line x1="860" y1="200" x2="940" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>
    <line x1="860" y1="200" x2="780" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>
    <line x1="860" y1="200" x2="740" y2="200" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>
    <line x1="860" y1="200" x2="770" y2="120" stroke="#38bdf8" stroke-width="2" stroke-dasharray="12 8"/>

    <!-- Festival Stall Awnings (Left and Right) -->
    <polygon points="0,320 280,320 220,440 0,440" fill="#dc2626"/>
    <polygon points="40,320 120,320 100,440 20,440" fill="#ffffff"/>
    <polygon points="160,320 240,320 200,440 140,440" fill="#ffffff"/>

    <polygon points="920,320 1200,320 1200,440 980,440" fill="#7c3aed"/>
    <polygon points="960,320 1040,320 1020,440 940,440" fill="#ffffff"/>
    <polygon points="1080,320 1160,320 1140,440 1060,440" fill="#ffffff"/>

    <!-- Festival String Lights & Red Paper Lanterns -->
    <path d="M0 240 Q300 320 600 240 Q900 320 1200 240" stroke="#475569" stroke-width="4" fill="none"/>

    <!-- Lantern 1 -->
    <circle cx="180" cy="290" r="60" fill="url(#lanternGlow)"/>
    <ellipse cx="180" cy="290" rx="28" ry="36" fill="#ef4444"/>
    <rect x="168" y="250" width="24" height="6" fill="#1e293b"/>
    <rect x="168" y="324" width="24" height="6" fill="#1e293b"/>
    <text x="180" y="297" font-size="20" fill="#fef08a" font-weight="900" text-anchor="middle">祭</text>

    <!-- Lantern 2 -->
    <circle cx="420" cy="295" r="60" fill="url(#lanternGlow)"/>
    <ellipse cx="420" cy="295" rx="28" ry="36" fill="#ef4444"/>
    <rect x="408" y="255" width="24" height="6" fill="#1e293b"/>
    <rect x="408" y="329" width="24" height="6" fill="#1e293b"/>
    <text x="420" y="302" font-size="20" fill="#fef08a" font-weight="900" text-anchor="middle">愛</text>

    <!-- Lantern 3 -->
    <circle cx="780" cy="295" r="60" fill="url(#lanternGlow)"/>
    <ellipse cx="780" cy="295" rx="28" ry="36" fill="#ef4444"/>
    <rect x="768" y="255" width="24" height="6" fill="#1e293b"/>
    <rect x="768" y="329" width="24" height="6" fill="#1e293b"/>
    <text x="780" y="302" font-size="20" fill="#fef08a" font-weight="900" text-anchor="middle">恋</text>

    <!-- Lantern 4 -->
    <circle cx="1020" cy="290" r="60" fill="url(#lanternGlow)"/>
    <ellipse cx="1020" cy="290" rx="28" ry="36" fill="#ef4444"/>
    <rect x="1008" y="250" width="24" height="6" fill="#1e293b"/>
    <rect x="1008" y="324" width="24" height="6" fill="#1e293b"/>
    <text x="1020" y="297" font-size="20" fill="#fef08a" font-weight="900" text-anchor="middle">夢</text>

    <!-- Cobblestone Ground -->
    <path d="M0 600 L1200 600 L1200 800 L0 800 Z" fill="#1e1b2e"/>
    <line x1="0" y1="600" x2="1200" y2="600" stroke="#f43f5e" stroke-width="4" opacity="0.6"/>
  </svg>`),

  // Scenario 5: Starlit Rooftop & Confession (Midnight starry sky, moon, city lights, railing)
  rooftop: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="rooftopSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="40%" stop-color="#0f172a"/>
        <stop offset="75%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#4a044e"/>
      </linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="30%" stop-color="#e0f2fe" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="cityGlow" cx="50%" cy="100%" r="60%">
        <stop offset="0%" stop-color="#ec4899" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Deep Midnight Starry Sky -->
    <rect width="1200" height="800" fill="url(#rooftopSky)"/>

    <!-- Glowing Crescent Moon -->
    <circle cx="950" cy="180" r="120" fill="url(#moonGlow)"/>
    <path d="M960 120 C910 140, 910 220, 960 240 C930 230, 920 160, 960 120 Z" fill="#ffffff"/>

    <!-- Twinkling Constellation Stars -->
    <circle cx="150" cy="120" r="2.5" fill="#ffffff"/>
    <circle cx="280" cy="80" r="3.5" fill="#ffffff" opacity="0.9"/>
    <circle cx="420" cy="140" r="2" fill="#ffffff" opacity="0.7"/>
    <circle cx="560" cy="90" r="3" fill="#ffffff" opacity="0.85"/>
    <circle cx="720" cy="110" r="2" fill="#ffffff" opacity="0.6"/>
    <circle cx="850" cy="70" r="3" fill="#ffffff" opacity="0.9"/>
    <circle cx="1100" cy="130" r="2.5" fill="#ffffff" opacity="0.8"/>
    <circle cx="200" cy="240" r="2" fill="#fbcfe8" opacity="0.8"/>
    <circle cx="360" cy="280" r="2.5" fill="#bae6fd" opacity="0.85"/>
    <circle cx="680" cy="220" r="3" fill="#fbcfe8" opacity="0.7"/>
    <circle cx="800" cy="270" r="2" fill="#ffffff" opacity="0.6"/>

    <!-- Shooting Star Trail -->
    <line x1="260" y1="60" x2="140" y2="130" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <line x1="260" y1="60" x2="200" y2="95" stroke="#f472b6" stroke-width="1.5" opacity="0.5"/>

    <!-- City Skyline Glow & Silhouette -->
    <rect x="0" y="380" width="1200" height="240" fill="url(#cityGlow)"/>
    <path d="M0 480 L80 480 L80 420 L130 420 L130 480 L220 480 L220 380 L270 380 L270 480 L390 480 L390 440 L440 440 L440 480 L580 480 L580 390 L630 390 L630 480 L760 480 L760 430 L810 430 L810 480 L940 480 L940 370 L1000 370 L1000 480 L1120 480 L1120 420 L1200 420 L1200 500 L0 500 Z" fill="#0b0819" opacity="0.9"/>

    <!-- Tiny Glowing Windows in Skyline -->
    <rect x="235" y="400" width="6" height="8" fill="#fef08a" opacity="0.8"/>
    <rect x="250" y="420" width="6" height="8" fill="#fef08a" opacity="0.7"/>
    <rect x="595" y="410" width="6" height="8" fill="#f43f5e" opacity="0.8"/>
    <rect x="610" y="430" width="6" height="8" fill="#38bdf8" opacity="0.8"/>
    <rect x="955" y="390" width="8" height="10" fill="#fef08a" opacity="0.9"/>
    <rect x="975" y="410" width="8" height="10" fill="#fef08a" opacity="0.75"/>

    <!-- Rooftop Floor Pavement -->
    <path d="M0 580 L1200 580 L1200 800 L0 800 Z" fill="#0f172a"/>
    <line x1="0" y1="580" x2="1200" y2="580" stroke="#ec4899" stroke-width="4" opacity="0.8"/>

    <!-- Rooftop Iron Security Fence / Railing -->
    <line x1="0" y1="540" x2="1200" y2="540" stroke="#475569" stroke-width="6"/>
    <line x1="0" y1="500" x2="1200" y2="500" stroke="#475569" stroke-width="4"/>
    <line x1="0" y1="460" x2="1200" y2="460" stroke="#475569" stroke-width="4"/>

    <line x1="100" y1="450" x2="100" y2="580" stroke="#475569" stroke-width="8"/>
    <line x1="300" y1="450" x2="300" y2="580" stroke="#475569" stroke-width="8"/>
    <line x1="500" y1="450" x2="500" y2="580" stroke="#475569" stroke-width="8"/>
    <line x1="700" y1="450" x2="700" y2="580" stroke="#475569" stroke-width="8"/>
    <line x1="900" y1="450" x2="900" y2="580" stroke="#475569" stroke-width="8"/>
    <line x1="1100" y1="450" x2="1100" y2="580" stroke="#475569" stroke-width="8"/>
  </svg>`)
};

// ==========================================================================
// 2. EXPRESSIVE ANIME CHARACTER SPRITES (WAIST-UP / 3 EMOTIONS PER CHARACTER)
// ==========================================================================
export const VN_SPRITES = {
  // ADO (Class Vice-President: Strict, Tsundere, Flustered Blush, Warm Smile)
  ado: {
    normal: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <!-- Blazer Body -->
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazer)"/>
      <!-- White Shirt & Red Tie -->
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <!-- Lapels & Gold VP Badge -->
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>
      <rect x="160" y="440" width="22" height="12" rx="3" fill="#f59e0b"/>

      <!-- Neck & Face -->
      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Eyes (Composed / Sharp) -->
      <ellipse cx="215" cy="205" rx="14" ry="16" fill="#831843"/>
      <circle cx="212" cy="200" r="5" fill="#ffffff"/>
      <ellipse cx="285" cy="205" rx="14" ry="16" fill="#831843"/>
      <circle cx="282" cy="200" r="5" fill="#ffffff"/>
      <!-- Eyebrows (Strict / Composed) -->
      <path d="M200 185 Q215 178 230 185" stroke="#4c0519" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M270 185 Q285 178 300 185" stroke="#4c0519" stroke-width="3.5" stroke-linecap="round" fill="none"/>

      <!-- Nose & Mouth (Neutral Tsundere Line) -->
      <circle cx="250" cy="225" r="2" fill="#be185d"/>
      <path d="M242 245 Q250 248 258 245" stroke="#9d174d" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Hair (Layered with Red/Pink Highlights) -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHair)"/>
      <path d="M190 130 Q250 80 300 140 Q250 120 190 130" fill="#db2777" opacity="0.6"/>
      <path d="M220 120 Q240 170 260 120" fill="url(#adoHair)"/>
    </svg>`),

    idle: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairI" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerI" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <!-- Blazer Body (Poised Listening Posture) -->
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerI)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>
      <rect x="160" y="440" width="22" height="12" rx="3" fill="#f59e0b"/>

      <!-- Neck & Face -->
      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Calm Attentive Resting Eyes (Gentle Listening Gaze) -->
      <ellipse cx="215" cy="206" rx="13" ry="14" fill="#831843"/>
      <circle cx="213" cy="201" r="4.5" fill="#ffffff"/>
      <ellipse cx="285" cy="206" rx="13" ry="14" fill="#831843"/>
      <circle cx="283" cy="201" r="4.5" fill="#ffffff"/>

      <!-- Composed Soft Eyebrows -->
      <path d="M200 186 Q215 180 230 186" stroke="#4c0519" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M270 186 Q285 180 300 186" stroke="#4c0519" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Quiet Serene Closed Mouth (Attentive Non-talking Pose) -->
      <circle cx="250" cy="225" r="2" fill="#be185d"/>
      <path d="M244 246 Q250 248 256 246" stroke="#9d174d" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Subtle Soft Blush While Listening -->
      <ellipse cx="204" cy="226" rx="11" ry="5" fill="#f43f5e" opacity="0.25"/>
      <ellipse cx="296" cy="226" rx="11" ry="5" fill="#f43f5e" opacity="0.25"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairI)"/>
      <path d="M190 130 Q250 80 300 140 Q250 120 190 130" fill="#db2777" opacity="0.6"/>
      <path d="M220 120 Q240 170 260 120" fill="url(#adoHairI)"/>
    </svg>`),

    happy: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerH" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerH)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>
      <rect x="160" y="440" width="22" height="12" rx="3" fill="#f59e0b"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Cheerful Happy Eyes (Curved Anime Arcs) -->
      <path d="M200 210 Q215 195 230 210" stroke="#831843" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M270 210 Q285 195 300 210" stroke="#831843" stroke-width="4" stroke-linecap="round" fill="none"/>

      <!-- Soft Pink Cheeks -->
      <ellipse cx="200" cy="225" rx="14" ry="7" fill="#f43f5e" opacity="0.4"/>
      <ellipse cx="300" cy="225" rx="14" ry="7" fill="#f43f5e" opacity="0.4"/>

      <!-- Happy Sweet Smile -->
      <circle cx="250" cy="225" r="2" fill="#be185d"/>
      <path d="M238 242 Q250 258 262 242" stroke="#be123c" stroke-width="3" stroke-linecap="round" fill="#fce7f3"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairH)"/>
      <path d="M190 130 Q250 80 300 140 Q250 120 190 130" fill="#db2777" opacity="0.6"/>
      <!-- Sparkle -->
      <path d="M340 150 L345 160 L355 165 L345 170 L340 180 L335 170 L325 165 L335 160 Z" fill="#fbbf24"/>
    </svg>`),

    blush: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerB)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>
      <rect x="160" y="440" width="22" height="12" rx="3" fill="#f59e0b"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Wide Shy Eyes (Looking Slightly Away) -->
      <ellipse cx="218" cy="205" rx="14" ry="16" fill="#831843"/>
      <circle cx="215" cy="200" r="5" fill="#ffffff"/>
      <ellipse cx="288" cy="205" rx="14" ry="16" fill="#831843"/>
      <circle cx="285" cy="200" r="5" fill="#ffffff"/>

      <!-- Deep Anime Blush Lines -->
      <ellipse cx="210" cy="225" rx="22" ry="12" fill="#f43f5e" opacity="0.6"/>
      <line x1="200" y1="220" x2="208" y2="232" stroke="#be123c" stroke-width="2"/>
      <line x1="210" y1="218" x2="218" y2="230" stroke="#be123c" stroke-width="2"/>
      <line x1="220" y1="220" x2="228" y2="232" stroke="#be123c" stroke-width="2"/>

      <ellipse cx="290" cy="225" rx="22" ry="12" fill="#f43f5e" opacity="0.6"/>
      <line x1="280" y1="220" x2="288" y2="232" stroke="#be123c" stroke-width="2"/>
      <line x1="290" y1="218" x2="298" y2="230" stroke="#be123c" stroke-width="2"/>
      <line x1="300" y1="220" x2="308" y2="232" stroke="#be123c" stroke-width="2"/>

      <!-- Flustered Pouting Mouth -->
      <circle cx="250" cy="225" r="2" fill="#be185d"/>
      <path d="M244 246 Q250 242 256 246" stroke="#9d174d" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairB)"/>
      <path d="M190 130 Q250 80 300 140 Q250 120 190 130" fill="#db2777" opacity="0.6"/>
    </svg>`),

    pout: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerP" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerP)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>
      <rect x="160" y="440" width="22" height="12" rx="3" fill="#f59e0b"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Sideways Tsundere Glare -->
      <ellipse cx="225" cy="205" rx="14" ry="16" fill="#831843"/>
      <circle cx="220" cy="200" r="5" fill="#ffffff"/>
      <ellipse cx="295" cy="205" rx="14" ry="16" fill="#831843"/>
      <circle cx="290" cy="200" r="5" fill="#ffffff"/>

      <!-- Puffed Blush Cheeks -->
      <ellipse cx="205" cy="225" rx="24" ry="14" fill="#f43f5e" opacity="0.65"/>
      <ellipse cx="295" cy="225" rx="24" ry="14" fill="#f43f5e" opacity="0.65"/>

      <!-- Cute W-shaped Pout Mouth -->
      <path d="M236 245 Q243 240 250 245 Q257 240 264 245" stroke="#be123c" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Tsundere 💢 Anger Mark -->
      <path d="M315 155 L325 155 M320 150 L320 160 M330 155 L340 155" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairP)"/>
      <path d="M190 130 Q250 80 300 140 Q250 120 190 130" fill="#db2777" opacity="0.6"/>
    </svg>`),

    angry: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerA)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Stern Angled Eyebrows -->
      <path d="M195 180 L235 195" stroke="#831843" stroke-width="4" stroke-linecap="round"/>
      <path d="M305 180 L265 195" stroke="#831843" stroke-width="4" stroke-linecap="round"/>

      <!-- Stern Focused Eyes -->
      <ellipse cx="215" cy="208" rx="14" ry="14" fill="#831843"/>
      <circle cx="212" cy="204" r="4.5" fill="#ffffff"/>
      <ellipse cx="285" cy="208" rx="14" ry="14" fill="#831843"/>
      <circle cx="282" cy="204" r="4.5" fill="#ffffff"/>

      <!-- Strict Scolding Mouth -->
      <path d="M236 248 L264 248" stroke="#be123c" stroke-width="3" stroke-linecap="round"/>

      <!-- Cross Anger Vein Symbol 💢 -->
      <path d="M325 145 Q335 145 335 135 M335 145 Q345 145 345 135 M335 145 Q335 155 345 155 M335 145 Q335 155 325 155" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairA)"/>
    </svg>`),

    fear: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerF" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerF)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Startled High Eyebrows -->
      <path d="M198 175 Q215 165 232 178" stroke="#831843" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M268 178 Q285 165 302 175" stroke="#831843" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Wide Dot Pupil Startled Eyes -->
      <ellipse cx="215" cy="205" rx="16" ry="18" fill="#ffffff" stroke="#831843" stroke-width="3"/>
      <circle cx="215" cy="205" r="5" fill="#831843"/>
      <ellipse cx="285" cy="205" rx="16" ry="18" fill="#ffffff" stroke="#831843" stroke-width="3"/>
      <circle cx="285" cy="205" r="5" fill="#831843"/>

      <!-- Flustered Open O-Mouth -->
      <ellipse cx="250" cy="245" rx="7" ry="10" fill="#be123c"/>

      <!-- Giant Anime Blue Sweatdrop 💧 -->
      <path d="M330 170 C330 155, 345 140, 345 140 C345 140, 360 155, 360 170 C360 180, 345 185, 330 170 Z" fill="#38bdf8" opacity="0.9"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairF)"/>
    </svg>`),

    sad: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="adoHairS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#4c0519"/>
        </linearGradient>
        <linearGradient id="adoBlazerS" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L420 700 L80 700 Z" fill="url(#adoBlazerS)"/>
      <polygon points="210,350 290,350 270,480 230,480" fill="#ffffff"/>
      <polygon points="240,360 260,360 265,490 250,520 235,490" fill="#be123c"/>
      <path d="M180 350 L220 460 L180 500 Z" fill="#312e81"/>
      <path d="M320 350 L280 460 L320 500 Z" fill="#312e81"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#fdf2f8"/>

      <!-- Sad Drooping Eyebrows -->
      <path d="M200 188 Q218 178 235 188" stroke="#831843" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M265 188 Q282 178 300 188" stroke="#831843" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Downcast Melancholic Eyes -->
      <path d="M202 210 Q218 200 232 214" stroke="#831843" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="217" cy="216" rx="9" ry="7" fill="#831843"/>
      <path d="M268 214 Q282 200 298 210" stroke="#831843" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="283" cy="216" rx="9" ry="7" fill="#831843"/>

      <!-- Sad Tear Drop 💧 -->
      <circle cx="204" cy="226" r="3.5" fill="#38bdf8"/>
      <path d="M204 220 C204 220 207 225 204 228 C201 225 204 220 204 220 Z" fill="#38bdf8"/>

      <!-- Somber Downward Mouth -->
      <path d="M240 248 Q250 242 260 248" stroke="#be123c" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M160 170 C140 100, 210 50, 250 50 C310 50, 360 100, 340 170 C360 230, 350 300, 340 330 C330 250, 320 200, 320 180 C290 140, 210 140, 180 180 C180 200, 170 250, 160 330 C150 300, 140 230, 160 170 Z" fill="url(#adoHairS)"/>
    </svg>`)
  },

  // KOU (Gentle Junior: Soft, Cozy Hoodie, Puppy Eyes, Sweet Smile, Blush)
  kou: {
    normal: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <!-- Cozy Oversized Pastel Hoodie -->
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodie)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>
      <!-- Hoodie Drawstrings -->
      <line x1="230" y1="390" x2="230" y2="480" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
      <line x1="270" y1="390" x2="270" y2="480" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
      <!-- Cat Pin on Chest -->
      <circle cx="170" cy="450" r="14" fill="#fbbf24"/>
      <polygon points="160,442 165,434 170,442" fill="#f59e0b"/>
      <polygon points="170,442 175,434 180,442" fill="#f59e0b"/>

      <!-- Neck & Face -->
      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Big Soft Gentle Blue Eyes -->
      <ellipse cx="215" cy="205" rx="16" ry="18" fill="#1d4ed8"/>
      <circle cx="210" cy="198" r="6" fill="#ffffff"/>
      <circle cx="222" cy="212" r="3" fill="#60a5fa"/>
      <ellipse cx="285" cy="205" rx="16" ry="18" fill="#1d4ed8"/>
      <circle cx="280" cy="198" r="6" fill="#ffffff"/>
      <circle cx="292" cy="212" r="3" fill="#60a5fa"/>

      <!-- Soft Eyebrows & Smile -->
      <path d="M200 180 Q215 185 230 180" stroke="#1e40af" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M270 180 Q285 185 300 180" stroke="#1e40af" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="250" cy="225" r="2" fill="#3b82f6"/>
      <path d="M240 244 Q250 252 260 244" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Soft Fluffy Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHair)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`),

    idle: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairI" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieI" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <!-- Pastel Blue Hoodie (Quiet Listening Pose) -->
      <path d="M120 460 C120 380, 180 350, 250 350 C320 350, 380 380, 380 460 L410 700 L90 700 Z" fill="url(#kouHoodieI)"/>
      <path d="M190 350 C190 440, 310 440, 310 350 Z" fill="#bfdbfe"/>
      <path d="M225 400 L225 480 M275 400 L275 480" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
      <circle cx="225" cy="485" r="4" fill="#3b82f6"/>
      <circle cx="275" cy="485" r="4" fill="#3b82f6"/>
      <!-- Cute Cat Pin -->
      <circle cx="165" cy="430" r="14" fill="#fbbf24"/>
      <polygon points="155,420 159,412 165,418" fill="#d97706"/>
      <polygon points="175,420 171,412 165,418" fill="#d97706"/>

      <!-- Neck & Face -->
      <polygon points="220,290 280,290 270,360 230,360" fill="#fce7f3"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#eff6ff"/>

      <!-- Soft Sparkling Attentive Eyes (Listening Up to Senior) -->
      <ellipse cx="215" cy="205" rx="14" ry="15" fill="#1d4ed8"/>
      <circle cx="212" cy="199" r="5" fill="#ffffff"/>
      <circle cx="218" cy="209" r="2.5" fill="#93c5fd"/>
      <ellipse cx="285" cy="205" rx="14" ry="15" fill="#1d4ed8"/>
      <circle cx="282" cy="199" r="5" fill="#ffffff"/>
      <circle cx="288" cy="209" r="2.5" fill="#93c5fd"/>

      <!-- Soft Curved Brows -->
      <path d="M200 182 Q215 187 230 182" stroke="#1e40af" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M270 182 Q285 187 300 182" stroke="#1e40af" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Gentle Resting Closed Mouth -->
      <circle cx="250" cy="225" r="2" fill="#3b82f6"/>
      <path d="M242 246 Q250 250 258 246" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Cute Cheek Blush While Listening -->
      <ellipse cx="205" cy="226" rx="12" ry="6" fill="#f472b6" opacity="0.3"/>
      <ellipse cx="295" cy="226" rx="12" ry="6" fill="#f472b6" opacity="0.3"/>

      <!-- Soft Fluffy Blue Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairI)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`),

    happy: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieH" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodieH)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>
      <circle cx="170" cy="450" r="14" fill="#fbbf24"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Joyful Curved Eyes -->
      <path d="M198 210 Q215 192 232 210" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M268 210 Q285 192 302 210" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" fill="none"/>

      <!-- Soft Pink Cheeks -->
      <ellipse cx="200" cy="225" rx="14" ry="7" fill="#f43f5e" opacity="0.45"/>
      <ellipse cx="300" cy="225" rx="14" ry="7" fill="#f43f5e" opacity="0.45"/>

      <!-- Excited Open Grin -->
      <circle cx="250" cy="225" r="2" fill="#3b82f6"/>
      <path d="M236 242 Q250 262 264 242 Z" fill="#ec4899" stroke="#1d4ed8" stroke-width="2.5"/>

      <!-- Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairH)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
      <!-- Sparkle Heart -->
      <path d="M345 160 C335 145, 365 145, 355 160 C365 175, 345 175, 345 160 Z" fill="#f43f5e"/>
    </svg>`),

    blush: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodieB)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Big Teary/Shy Puppy Eyes -->
      <ellipse cx="215" cy="205" rx="16" ry="18" fill="#1d4ed8"/>
      <circle cx="210" cy="198" r="7" fill="#ffffff"/>
      <circle cx="222" cy="212" r="4" fill="#93c5fd"/>
      <ellipse cx="285" cy="205" rx="16" ry="18" fill="#1d4ed8"/>
      <circle cx="280" cy="198" r="7" fill="#ffffff"/>
      <circle cx="292" cy="212" r="4" fill="#93c5fd"/>

      <!-- Deep Blush Overlay -->
      <ellipse cx="210" cy="225" rx="20" ry="10" fill="#f43f5e" opacity="0.6"/>
      <ellipse cx="290" cy="225" rx="20" ry="10" fill="#f43f5e" opacity="0.6"/>

      <!-- Shy Trembling Smile -->
      <circle cx="250" cy="225" r="2" fill="#3b82f6"/>
      <path d="M242 245 Q250 250 258 245" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairB)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`),

    pout: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieP" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodieP)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Pouting Junior Puppy Eyes (Glancing away) -->
      <ellipse cx="205" cy="205" rx="16" ry="18" fill="#1d4ed8"/>
      <circle cx="200" cy="198" r="6" fill="#ffffff"/>
      <ellipse cx="275" cy="205" rx="16" ry="18" fill="#1d4ed8"/>
      <circle cx="270" cy="198" r="6" fill="#ffffff"/>

      <!-- Puffed Pout Cheeks with Pink Hue -->
      <ellipse cx="195" cy="225" rx="24" ry="14" fill="#f43f5e" opacity="0.6"/>
      <ellipse cx="305" cy="225" rx="24" ry="14" fill="#f43f5e" opacity="0.6"/>

      <!-- Whiny Pouting Mouth (3 shape) -->
      <path d="M236 248 Q243 242 250 248 Q257 242 264 248" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Little sulk cloud -->
      <path d="M335 150 Q345 140 355 150 Q365 145 365 155 Q365 165 350 165 Z" fill="#93c5fd" opacity="0.8"/>

      <!-- Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairP)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`),

    angry: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodieA)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Feisty Angled Eyebrows -->
      <path d="M195 182 L230 192" stroke="#1e40af" stroke-width="4" stroke-linecap="round"/>
      <path d="M305 182 L270 192" stroke="#1e40af" stroke-width="4" stroke-linecap="round"/>

      <!-- Feisty Eyes -->
      <ellipse cx="215" cy="208" rx="15" ry="16" fill="#1d4ed8"/>
      <circle cx="212" cy="204" r="5" fill="#ffffff"/>
      <ellipse cx="285" cy="208" rx="15" ry="16" fill="#1d4ed8"/>
      <circle cx="282" cy="204" r="5" fill="#ffffff"/>

      <!-- Upset Pouting Open Mouth -->
      <path d="M238 248 Q250 240 262 248" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Cute Mini 💢 Anger Symbol -->
      <path d="M325 155 L335 155 M330 150 L330 160" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>

      <!-- Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairA)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`),

    fear: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieF" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodieF)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Trembling Wide Puppy Eyes -->
      <ellipse cx="215" cy="205" rx="16" ry="18" fill="#ffffff" stroke="#1d4ed8" stroke-width="3"/>
      <circle cx="215" cy="205" r="5" fill="#1d4ed8"/>
      <ellipse cx="285" cy="205" rx="16" ry="18" fill="#ffffff" stroke="#1d4ed8" stroke-width="3"/>
      <circle cx="285" cy="205" r="5" fill="#1d4ed8"/>

      <!-- Blue Sweatdrop -->
      <path d="M330 170 C330 155, 345 140, 345 140 C345 140, 360 155, 360 170 C360 180, 345 185, 330 170 Z" fill="#38bdf8"/>

      <!-- Trembling Wavy Mouth -->
      <path d="M238 245 Q244 250 250 245 Q256 250 262 245" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairF)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`),

    sad: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="kouHairS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="kouHoodieS" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#93c5fd"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 380, 170 350, 250 350 C330 350, 390 380, 390 460 L430 700 L70 700 Z" fill="url(#kouHoodieS)"/>
      <path d="M190 350 Q250 420 310 350 Z" fill="#bfdbfe"/>

      <polygon points="220,290 280,290 270,360 230,360" fill="#dbeafe"/>
      <path d="M170 190 C170 300, 330 300, 330 190 C330 120, 170 120, 170 190 Z" fill="#f8fafc"/>

      <!-- Sad Drooping Puppy Eyebrows -->
      <path d="M196 186 Q215 176 230 186" stroke="#1e40af" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M304 186 Q285 176 270 186" stroke="#1e40af" stroke-width="3.5" stroke-linecap="round" fill="none"/>

      <!-- Glossy Big Teary Eyes -->
      <ellipse cx="215" cy="208" rx="16" ry="17" fill="#1d4ed8"/>
      <ellipse cx="212" cy="202" rx="7" ry="5" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="220" cy="214" rx="4" ry="3" fill="#93c5fd"/>

      <ellipse cx="285" cy="208" rx="16" ry="17" fill="#1d4ed8"/>
      <ellipse cx="282" cy="202" rx="7" ry="5" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="290" cy="214" rx="4" ry="3" fill="#93c5fd"/>

      <!-- Big Sad Tear Falling on Cheek 💧 -->
      <circle cx="204" cy="225" r="4" fill="#60a5fa"/>
      <path d="M204 218 C204 218 208 223 204 227 C200 223 204 218 204 218 Z" fill="#60a5fa"/>

      <!-- Heartbroken Quivering Mouth -->
      <path d="M240 248 Q250 240 260 248" stroke="#1d4ed8" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Hair (Slightly Drooping) -->
      <path d="M160 170 C140 90, 200 40, 250 40 C310 40, 360 90, 340 170 C360 230, 340 310, 330 330 C320 250, 310 200, 310 180 C280 140, 220 140, 190 180 C190 200, 180 250, 170 330 C160 310, 140 230, 160 170 Z" fill="url(#kouHairS)"/>
      <path d="M180 130 Q250 70 310 130" fill="#60a5fa" opacity="0.5"/>
    </svg>`)
  },

  // REN (Charming Musician Senior: Messy Purple Hair, Leather Jacket, Silver Earring, Smirk)
  ren: {
    normal: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <!-- Leather Biker Jacket & Unbuttoned Shirt -->
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacket)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <!-- Silver Chain Necklace -->
      <path d="M225 380 Q250 420 275 380" stroke="#94a3b8" stroke-width="3" fill="none"/>
      <!-- Lapels with Metal Snaps -->
      <path d="M170 340 L230 450 L160 500 Z" fill="#27272a"/>
      <circle cx="180" cy="460" r="4" fill="#cbd5e1"/>
      <path d="M330 340 L270 450 L340 500 Z" fill="#27272a"/>
      <circle cx="320" cy="460" r="4" fill="#cbd5e1"/>

      <!-- Neck & Face -->
      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Silver Ear Piercing (Left Ear) -->
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <!-- Charismatic Amber Eyes & Smirk -->
      <ellipse cx="215" cy="195" rx="14" ry="14" fill="#d97706"/>
      <circle cx="212" cy="190" r="4.5" fill="#ffffff"/>
      <ellipse cx="285" cy="195" rx="14" ry="14" fill="#d97706"/>
      <circle cx="282" cy="190" r="4.5" fill="#ffffff"/>

      <!-- Sharp Teasing Eyebrows -->
      <path d="M200 175 Q215 168 230 178" stroke="#3b0764" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M270 178 Q285 168 300 175" stroke="#3b0764" stroke-width="3.5" stroke-linecap="round" fill="none"/>

      <!-- Confident Smirking Mouth -->
      <circle cx="250" cy="215" r="2" fill="#9333ea"/>
      <path d="M240 236 Q255 235 264 228" stroke="#581c87" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Messy Layered Purple Hair with Bangs -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHair)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
      <path d="M230 100 Q250 160 270 100" fill="url(#renHair)"/>
    </svg>`),

    idle: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairI" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketI" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <!-- Leather Jacket (Cool Effortless Listening Pose) -->
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketI)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <path d="M225 380 Q250 420 275 380" stroke="#94a3b8" stroke-width="3" fill="none"/>
      <!-- Silver Earring -->
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <!-- Neck & Face -->
      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Confident Observant Eyes (Listening Intently to MC) -->
      <ellipse cx="215" cy="196" rx="14" ry="14" fill="#d97706"/>
      <circle cx="212" cy="191" r="4.5" fill="#ffffff"/>
      <ellipse cx="285" cy="196" rx="14" ry="14" fill="#d97706"/>
      <circle cx="282" cy="191" r="4.5" fill="#ffffff"/>

      <!-- Calm Sharp Eyebrows -->
      <path d="M200 176 Q215 170 230 178" stroke="#3b0764" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M270 178 Q285 170 300 176" stroke="#3b0764" stroke-width="3.5" stroke-linecap="round" fill="none"/>

      <!-- Relaxed Closed Mouth (Gentle Resting Half-Smirk) -->
      <circle cx="250" cy="216" r="2" fill="#9333ea"/>
      <path d="M242 238 Q252 238 260 234" stroke="#581c87" stroke-width="2.8" stroke-linecap="round" fill="none"/>

      <!-- Subtle Soft Teasing Blush -->
      <ellipse cx="204" cy="218" rx="12" ry="5" fill="#f43f5e" opacity="0.2"/>
      <ellipse cx="296" cy="218" rx="12" ry="5" fill="#f43f5e" opacity="0.2"/>

      <!-- Messy Layered Purple Hair with Bangs -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairI)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
      <path d="M230 100 Q250 160 270 100" fill="url(#renHairI)"/>
    </svg>`),

    happy: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketH" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketH)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <path d="M225 380 Q250 420 275 380" stroke="#94a3b8" stroke-width="3" fill="none"/>
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Charming Wink Eye (Left Wink, Right Open with Sparkle) -->
      <path d="M200 198 Q215 188 230 198" stroke="#d97706" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="285" cy="195" rx="14" ry="14" fill="#d97706"/>
      <circle cx="282" cy="190" r="4.5" fill="#ffffff"/>

      <ellipse cx="210" cy="215" rx="14" ry="6" fill="#f43f5e" opacity="0.35"/>
      <ellipse cx="290" cy="215" rx="14" ry="6" fill="#f43f5e" opacity="0.35"/>

      <!-- Playful Charming Grin -->
      <circle cx="250" cy="215" r="2" fill="#9333ea"/>
      <path d="M238 235 Q255 248 266 230" stroke="#581c87" stroke-width="3.5" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairH)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
      <!-- Star Sparkle -->
      <path d="M190 160 L195 170 L205 175 L195 180 L190 190 L185 180 L175 175 L185 170 Z" fill="#e879f9"/>
    </svg>`),

    blush: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketB)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Surprised Soft Amber Eyes -->
      <ellipse cx="218" cy="195" rx="14" ry="14" fill="#d97706"/>
      <circle cx="215" cy="190" r="4.5" fill="#ffffff"/>
      <ellipse cx="288" cy="195" rx="14" ry="14" fill="#d97706"/>
      <circle cx="285" cy="190" r="4.5" fill="#ffffff"/>

      <!-- Deep Blush on Cheekbones -->
      <ellipse cx="210" cy="215" rx="20" ry="10" fill="#f43f5e" opacity="0.6"/>
      <ellipse cx="290" cy="215" rx="20" ry="10" fill="#f43f5e" opacity="0.6"/>

      <!-- Caught Off-Guard Smile -->
      <circle cx="250" cy="215" r="2" fill="#9333ea"/>
      <path d="M242 236 Q250 240 258 236" stroke="#581c87" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairB)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
    </svg>`),

    pout: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketP" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketP)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Half-Lidded Feigned Pout Eyes -->
      <path d="M200 196 Q215 186 230 196" stroke="#d97706" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="215" cy="200" rx="10" ry="10" fill="#d97706"/>
      <path d="M270 196 Q285 186 300 196" stroke="#d97706" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="285" cy="200" rx="10" ry="10" fill="#d97706"/>

      <!-- Dramatic Pout Blush -->
      <ellipse cx="210" cy="218" rx="20" ry="8" fill="#f43f5e" opacity="0.5"/>
      <ellipse cx="290" cy="218" rx="20" ry="8" fill="#f43f5e" opacity="0.5"/>

      <!-- Playful Feigned Sulk Mouth -->
      <path d="M240 240 Q250 234 260 240" stroke="#581c87" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairP)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
    </svg>`),

    angry: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketA)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Intense Protective Glare -->
      <path d="M195 174 L230 188" stroke="#3b0764" stroke-width="4" stroke-linecap="round"/>
      <path d="M305 174 L270 188" stroke="#3b0764" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="215" cy="200" rx="14" ry="13" fill="#d97706"/>
      <circle cx="212" cy="196" r="4" fill="#ffffff"/>
      <ellipse cx="285" cy="200" rx="14" ry="13" fill="#d97706"/>
      <circle cx="282" cy="196" r="4" fill="#ffffff"/>

      <!-- Intense Serious Mouth -->
      <path d="M236 238 L264 238" stroke="#581c87" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Hair -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairA)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
    </svg>`),

    fear: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairF" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketF" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketF)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Flustered / Caught Off-Guard Eyes (Wide, Shaking) -->
      <ellipse cx="215" cy="195" rx="16" ry="16" fill="#ffffff" stroke="#d97706" stroke-width="3"/>
      <circle cx="215" cy="195" r="5" fill="#d97706"/>
      <ellipse cx="285" cy="195" rx="16" ry="16" fill="#ffffff" stroke="#d97706" stroke-width="3"/>
      <circle cx="285" cy="195" r="5" fill="#d97706"/>

      <!-- Shock Sweatdrop -->
      <path d="M330 160 C330 145, 345 130, 345 130 C345 130, 360 145, 360 160 C360 170, 345 175, 330 160 Z" fill="#38bdf8"/>

      <!-- Breathless / Stammering Open Mouth -->
      <ellipse cx="250" cy="236" rx="6" ry="8" fill="#581c87"/>

      <!-- Hair -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairF)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
    </svg>`),

    sad: svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
      <defs>
        <linearGradient id="renHairS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <linearGradient id="renJacketS" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <path d="M110 460 C110 370, 170 340, 250 340 C330 340, 390 370, 390 460 L430 700 L70 700 Z" fill="url(#renJacketS)"/>
      <polygon points="210,340 290,340 260,490 240,490" fill="#ffffff"/>
      <circle cx="168" cy="205" r="4" fill="#cbd5e1"/>

      <polygon points="220,280 280,280 270,350 230,350" fill="#fce7f3"/>
      <path d="M170 180 C170 290, 330 290, 330 180 C330 110, 170 110, 170 180 Z" fill="#fdf2f8"/>

      <!-- Somber Low Eyebrows -->
      <path d="M198 184 Q215 174 230 184" stroke="#3b0764" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M270 184 Q285 174 302 184" stroke="#3b0764" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Melancholic Downcast Eyes (Glance Away) -->
      <path d="M202 202 Q216 190 230 204" stroke="#d97706" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="216" cy="205" rx="10" ry="8" fill="#d97706"/>
      <circle cx="214" cy="202" r="3" fill="#ffffff"/>

      <path d="M270 204 Q284 190 298 202" stroke="#d97706" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="284" cy="205" rx="10" ry="8" fill="#d97706"/>
      <circle cx="282" cy="202" r="3" fill="#ffffff"/>

      <!-- Single Subtle Glistening Tear -->
      <circle cx="204" cy="216" r="3" fill="#38bdf8" opacity="0.85"/>

      <!-- Soft Wistful Sad Mouth -->
      <path d="M238 238 Q250 232 262 238" stroke="#581c87" stroke-width="2.5" stroke-linecap="round" fill="none"/>

      <!-- Hair -->
      <path d="M150 160 C130 80, 190 30, 250 30 C310 30, 370 80, 350 160 C370 220, 350 300, 340 320 C330 240, 320 180, 310 160 C280 120, 220 120, 190 160 C180 180, 170 240, 160 320 C150 300, 130 220, 150 160 Z" fill="url(#renHairS)"/>
      <path d="M180 110 Q250 60 310 110" fill="#a855f7" opacity="0.6"/>
    </svg>`)
  }
};

// ==========================================================================
// 3. SOUND SYNTHESIZER & SPEECH ENGINE
// ==========================================================================
let vnAudioCtx = null;

export function playVNSound(type = "click") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!vnAudioCtx) vnAudioCtx = new AudioContext();
    if (vnAudioCtx.state === "suspended") vnAudioCtx.resume();

    const now = vnAudioCtx.currentTime;

    if (type === "click" || type === "hover") {
      const osc = vnAudioCtx.createOscillator();
      const gain = vnAudioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(type === "hover" ? 440 : 660, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(vnAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "correct" || type === "heart") {
      // Romantic Chime chord (E5 -> G#5 -> B5 -> E6)
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((f, idx) => {
        const osc = vnAudioCtx.createOscillator();
        const gain = vnAudioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(vnAudioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } else if (type === "wrong") {
      const osc = vnAudioCtx.createOscillator();
      const gain = vnAudioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(vnAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "clear") {
      // Fanfare sequence
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        const osc = vnAudioCtx.createOscillator();
        const gain = vnAudioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.12);
        gain.gain.setValueAtTime(0.15, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(vnAudioCtx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
    }
  } catch (e) {
    console.log("Audio synthesis notice:", e);
  }
}

// Speak line using browser speech synthesis
export function speakVNLine(text, lang = "vi") {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (lang === "vi") {
      utter.lang = "vi-VN";
    } else if (lang === "ja") {
      utter.lang = "ja-JP";
    } else {
      utter.lang = "en-US";
    }
    utter.rate = 0.92;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.log("Speech synthesis notice:", e);
  }
}

if (typeof window !== "undefined") {
  window.VN_SPRITES = VN_SPRITES;
  window.VN_SCENERY_SVGS = VN_SCENERY_SVGS;
  window.playVNSound = playVNSound;
  window.speakVNLine = speakVNLine;
}
