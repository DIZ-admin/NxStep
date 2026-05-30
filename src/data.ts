import { PortfolioData } from "./types";

export const nxstepPortfolioData: PortfolioData = {
  name: "NxStep",
  tagline: "CS2 Rifler | FACEIT Challenger",
  age: 18,
  location: "Europe (EU)",
  languages: ["English (C2)", "Russian (Native)", "Ukrainian (Native)"],
  avatarUrl: "https://distribution.faceit-cdn.net/images/69118f24-2942-4935-bc9c-bbdbaea8e848.jpg",
  coverImageUrl: "https://distribution.faceit-cdn.net/images/d5762549-8ebf-4193-ab33-4b1c6095a797.jpg",
  overview: [
    "Started 2025 at FACEIT Level 4 and reached Top 250 EU / 3700+ ELO within approximately 16 months through primarily solo/duo queue play, high-volume practice, and independent development.",
    "Reached Challenger level while still playing on a laptop and unstable Wi-Fi setup, then climbed from ~2900 ELO to 3600+ within under a month after moving to a stable competitive setup.",
    "Looking to transition into a structured long-term team environment and continue developing within a strong practice system."
  ],
  achievements: [
    "Top 250 EU Faceit Peak Rank",
    "3700+ Peak ELO within 16 months",
    "Level 4 to Challenger Ascent",
    "B8 Prospects Trialist"
  ],
  stats: {
    peakRank: "Top 250 EU",
    peakElo: 3754,
    currentElo: null,
    faceitRating: 1.27,
    currentRating: null,
    avgLobbyElo: 3200,
    kdRange: "1.18 - 1.20",
    adr: 92,
    currentAdr: null,
    kr: 0.86,
    avgKills: 19,
    currentAvgKills: null,
    hsRange: "63% - 67%",
    currentHs: null,
    consistencyRange: "83% - 85%",
    matchesPlayed: 1642,
    currentMatches: null,
    recentForm: "+469 ELO"
  },
  strengths: [
    "Strong opening duel impact (high first blood convert percentage)",
    "Elite level mouse control & rifle mechanics (65%+ headshot average)",
    "Consistent and clinical damage floor in high-tier lobbies (92 ADR average)",
    "Clear, structured, and unflappable communication under high pressure",
    "Tilt-resistant mental state, keeping team focused under heavy adversity",
    "Rapid adaptation: quick transition to optimal 360Hz desktop competitive setup",
    "Positive, constructive dialogue contributor with strong team builder attitude",
    "High-intensity regimen builder: thrives in high-volume, structural practice environments"
  ],
  focus: [
    "Expanding structured team experience in serious regional/international divisions",
    "Deeply improving strategic coordination & micro-spacing inside team-authoritative systems",
    "Refining mid-round micro-decision making, rotational timing, and position discipline",
    "Mastering advanced utility execution sequences for coordinated tactical setups"
  ],
  maps: [
    {
      name: "Ancient",
      status: "Strong",
      winrate: 64,
      matches: 345,
      stats: { kd: 1.25, adr: 96, rating: 1.31, matches: 345 },
      positions: [
        {
          name: "Mid Control Active Choice",
          role: "Solo Contestant",
          description: "Contests Mid, aggressive rifle crosshair positioning, locks down early information and makes quick entry dual initiatives.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-emerald-950/45",
      accentColor: "#10b981",
      imageUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "Mirage",
      status: "Strong",
      winrate: 59,
      matches: 512,
      stats: { kd: 1.15, adr: 89, rating: 1.18, matches: 512 },
      positions: [
        {
          name: "Connector / Mid Rotation",
          role: "Active Playmaker",
          description: "Responsible for pivotal early-round information, rotating to A site short or supporting mid contests under heavy executable utility.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-amber-950/45",
      accentColor: "#f59e0b",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/74/Mirage_%28Counter-Strike_2%29.jpg"
    },
    {
      name: "Nuke",
      status: "Comfortable",
      winrate: 57,
      matches: 280,
      stats: { kd: 1.10, adr: 85, rating: 1.12, matches: 280 },
      positions: [
        {
          name: "Outside / Yard Control",
          role: "Space Specialist",
          description: "Holds aggressive outside sightline, denies secret transitions, and triggers mid-round flanks.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-slate-900/40",
      accentColor: "#64748b",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/72/Nuke_%28CSGO%29.png"
    },
    {
      name: "Dust2",
      status: "Strong",
      winrate: 61,
      matches: 310,
      stats: { kd: 1.19, adr: 91, rating: 1.21, matches: 310 },
      positions: [
        {
          name: "Long / Catwalk",
          role: "Entry / Anchor",
          description: "Challenges Long-A corner aggressively under flashes, takes space, or rotates back to hold Catwalk.",
          difficulty: "Medium"
        }
      ],
      bgColor: "bg-yellow-950/40",
      accentColor: "#eab308",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3e/Csgo_dust2.jpg"
    },
    {
      name: "Inferno",
      status: "Pocket Meta",
      winrate: 55,
      matches: 195,
      stats: { kd: 1.08, adr: 82, rating: 1.05, matches: 195 },
      positions: [
        {
          name: "Banana / Brackets",
          role: "Anchor & Space Taker",
          description: "Chokes early Banana aggression using deep utility or takes quick aggressive angles inside bracket fights.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-red-950/45",
      accentColor: "#ef4444",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d1/Inferno_%28Counter-Strike_2%29.png"
    }
  ],
  experience: [
    {
      type: "team",
      name: "[Your Team Name]",
      roleOrResult: "Your Role (e.g., Entry / Active Rifler)",
      periodOrScore: "Your Record or Period",
      details: "Provide details about your actual team or league experience here, and I will update it. E.g., 'Acted as key opening space maker...'"
    },
    {
      type: "trial",
      name: "[Your Scrim / Trial History]",
      roleOrResult: "Your Role",
      periodOrScore: "Result",
      details: "List any relevant academy tests, mix scrims, or trials you have played recently."
    }
  ],
  links: {
    faceit: "https://faceit.com/en/players/NxStep",
    steam: "https://steamcommunity.com/profiles/7656119259974234",
    leetify: "https://leetify.com/public/profile/76561198259974234",
    discord: "https://discord.com/users/NxStep",
    email: "kostasnook@gmail.com"
  },
  media: {
    demos: [
      { title: "Ancient Entry Focus (vs 3500+ ELO Stack)", url: "https://leetify.com/public/match/demo-placeholder-1" },
      { title: "Mirage CT Connector Defense & Flanking Utility", url: "https://leetify.com/public/match/demo-placeholder-2" }
    ],
    highlights: [
      { title: "NxStep Challenger Highlight Reel - Aggressive Quad Kills", url: "https://youtube.com/watch?v=placeholder-highlights" },
      { title: "Entry Duel Mechanics - 1v3 Clutch Compilation", url: "https://youtube.com/watch?v=placeholder-entries" }
    ],
    vods: [
      { title: "ESEA Match VOD - Ancient Dominance (28-14 Stats)", url: "https://youtube.com/watch?v=placeholder-vod1" },
      { title: "UKIC Masters Practice Scrim - Full Match Comms View", url: "https://youtube.com/watch?v=placeholder-vod2" }
    ]
  }
};

export const nxstepPortfolioDataUK: PortfolioData = {
  name: "NxStep",
  tagline: "CS2 Райфлер | FACEIT Челленджер",
  age: 18,
  location: "Європа (ЄС)",
  languages: ["Англійська (C2)", "Українська (Рідна)"],
  avatarUrl: "https://distribution.faceit-cdn.net/images/69118f24-2942-4935-bc9c-bbdbaea8e848.jpg",
  coverImageUrl: "https://distribution.faceit-cdn.net/images/d5762549-8ebf-4193-ab33-4b1c6095a797.jpg",
  overview: [
    "Розпочав 2025 рік з 4 рівня FACEIT і досяг статусу Top 250 EU / 3700+ ELO протягом приблизно 16 місяців, граючи переважно в соло/дуо режимі, виконуючи величезний обсяг тренувань та ведучи незалежний аналіз.",
    "Досяг рівня Челленджер, все ще граючи на стандартному ноутбуці з нестабільним Wi-Fi з'єднанням. Потім здійснив колосальний стрибок з ~2900 ELO до 3600+ менш ніж за місяць після переходу на стабільний ПК та якісний інтернет.",
    "Прагну приєднатися до структурованої команди на тривалий термін для подальшого розкриття потенціалу в серйозній турнірній системі."
  ],
  achievements: [
    "Топ 250 Європи Faceit Peak",
    "3700+ Пік ELO за 16 місяців",
    "Підйом з Level 4 до Челленджера",
    "Тріаліст B8 Prospects"
  ],
  stats: {
    peakRank: "Топ 250 Європи",
    peakElo: 3754,
    currentElo: null,
    faceitRating: 1.27,
    currentRating: null,
    avgLobbyElo: 3200,
    kdRange: "1.18 - 1.20",
    adr: 92,
    currentAdr: null,
    kr: 0.86,
    avgKills: 19,
    currentAvgKills: null,
    hsRange: "63% - 67%",
    currentHs: null,
    consistencyRange: "83% - 85%",
    matchesPlayed: 1642,
    currentMatches: null,
    recentForm: "+469 ELO"
  },
  strengths: [
    "Сильний вплив на перші дуелі (дуже висока конверсія фрагів)",
    "Елітний контроль миші та механіка стрільби (в середньому більше 65% хедшотів)",
    "Стабільна та висока шкода у висококласних лобі (92 ADR в середньому)",
    "Чітка, структурована та холоднокровна комунікація під тиском",
    "Стійкість до тильту, вміння тримати фокус команди у складних ситуаціях",
    "Швидка адаптивність: миттєвий перехід на оптимальний ПК сетап 360 Гц",
    "Позитивна, конструктивна участь у діалогах, налаштованість на роботу в команді",
    "Висока дисципліна тренувань: процвітає в умовах інтенсивних командних праків"
  ],
  focus: [
    "Отримання досвіду командної гри в сильних регіональних/міжнародних дивізіонах",
    "Поглиблення тактичної взаємодії та мікро-позиціонування в командних зв'язках",
    "Вдосконалення мікро-рішень у мід-раундах, таймінгів ротації та позиційної дисципліни",
    "Освоєння складних варіантів розкидки гранат під тактичні раунди"
  ],
  maps: [
    {
      name: "Ancient",
      status: "Сильна",
      winrate: 64,
      matches: 345,
      stats: { kd: 1.25, adr: 96, rating: 1.31, matches: 345 },
      positions: [
        {
          name: "Активний контроль мідла",
          role: "Соло-борець",
          description: "Контролює мід, агресивно тримає приціл, збирає ранню інформацію та швидко бере ініціативу в перших дуелях.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-emerald-950/45",
      accentColor: "#10b981",
      imageUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "Mirage",
      status: "Сильна",
      winrate: 59,
      matches: 512,
      stats: { kd: 1.15, adr: 89, rating: 1.18, matches: 512 },
      positions: [
        {
          name: "Коннектор / Ротація на мід",
          role: "Активний плеймейкер",
          description: "Відповідає за збір інфи на ранніх таймінгах, ротується на шорт А Пленту або допомагає при жорсткому прийомі мідла з розкидкою.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-amber-950/45",
      accentColor: "#f59e0b",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/74/Mirage_%28Counter-Strike_2%29.jpg"
    },
    {
      name: "Nuke",
      status: "Комфортна",
      winrate: 57,
      matches: 280,
      stats: { kd: 1.10, adr: 85, rating: 1.12, matches: 280 },
      positions: [
        {
          name: "Контроль Вулиці / Yard",
          role: "Спеціаліст з простору",
          description: "Агресивно тримає вулицю, присікає переходи в сикрет і заходить на таймінгові фланги в середині раунду.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-slate-900/40",
      accentColor: "#64748b",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/72/Nuke_%28CSGO%29.png"
    },
    {
      name: "Dust2",
      status: "Сильна",
      winrate: 61,
      matches: 310,
      stats: { kd: 1.19, adr: 91, rating: 1.21, matches: 310 },
      positions: [
        {
          name: "Довжина / Catwalk",
          role: "Опенер / Анкор",
          description: "Агресивно бореться за лонг А під флешки сокомандників, забирає простір або відкочується для утримання Кетвелка.",
          difficulty: "Medium"
        }
      ],
      bgColor: "bg-yellow-950/40",
      accentColor: "#eab308",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3e/Csgo_dust2.jpg"
    },
    {
      name: "Inferno",
      status: "Специфічна",
      winrate: 55,
      matches: 195,
      stats: { kd: 1.08, adr: 82, rating: 1.05, matches: 195 },
      positions: [
        {
          name: "Балкон і Брекет",
          role: "Анкор і опорник простору",
          description: "Присікає ранню агресію глибокою розкидкою або приймає агресивні кути всередині брекетів.",
          difficulty: "High"
        }
      ],
      bgColor: "bg-red-950/45",
      accentColor: "#ef4444",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d1/Inferno_%28Counter-Strike_2%29.png"
    }
  ],
  experience: [
    {
      type: "team",
      name: "[Назва вашої команди / Досвід]",
      roleOrResult: "Ваша роль (напр. Опенер)",
      periodOrScore: "Період або рекорд",
      details: "Будь ласка, розкажіть про ваш реальний змагальний досвід, і я оновлю це поле."
    },
    {
      type: "trial",
      name: "[Тестування / Праки]",
      roleOrResult: "Позиція",
      periodOrScore: "Результати тестування",
      details: "Вкажіть команди або академії, де ви проходили тести чи грали праки."
    }
  ],
  links: {
    faceit: "https://faceit.com/en/players/NxStep",
    steam: "https://steamcommunity.com/profiles/7656119259974234",
    leetify: "https://leetify.com/public/profile/76561198259974234",
    discord: "https://discord.com/users/NxStep",
    email: "kostasnook@gmail.com"
  },
  media: {
    demos: [
      { title: "Зачистка Ancient (Мід проти стаку 3500+ ELO)", url: "https://leetify.com/public/match/demo-placeholder-1" },
      { title: "Захист Mirage CT Connector та флангові утиліти", url: "https://leetify.com/public/match/demo-placeholder-2" }
    ],
    highlights: [
      { title: "Плейліст хайлайтів NxStep - Агресивні Quad-фраги", url: "https://youtube.com/watch?v=placeholder-highlights" },
      { title: "Механіка дуелей - Компіляція клатчів 1в3", url: "https://youtube.com/watch?v=placeholder-entries" }
    ],
    vods: [
      { title: "VOD матчу ESEA - Повне домінування на Ancient (Статистика 28-14)", url: "https://youtube.com/watch?v=placeholder-vod1" },
      { title: "UKIC Masters праки - Запис гри з комунікацією команди", url: "https://youtube.com/watch?v=placeholder-vod2" }
    ]
  }
};

