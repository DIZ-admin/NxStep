export interface Position {
  name: string;
  role: string;
  description: string;
  difficulty: "High" | "Medium" | "Low";
}

export interface MapData {
  name: string;
  status: "Strong" | "Comfortable" | "Pocket Meta" | string;
  winrate?: number;
  matches?: number;
  stats?: {
    kd: number;
    adr: number;
    rating: number;
    matches: number;
  };
  positions: Position[];
  bgColor: string; // Tailwind class
  accentColor: string; // Hex color for visuals
  imageUrl: string; // Placeholder or generated
}

export interface PlayerStats {
  peakRank: string;
  peakElo: number;
  currentElo?: number | null;
  faceitRating: number;
  currentRating?: number | null;
  currentKd?: number | null;
  avgLobbyElo: number;
  kdRange: string;
  adr: number;
  currentAdr?: number | null;
  kr: number;
  avgKills: number;
  currentAvgKills?: number | null;
  hsRange: string;
  currentHs?: string | null;
  consistencyRange: string;
  matchesPlayed: number;
  currentMatches?: number | null;
  recentForm: string;
}

export interface ExperienceItem {
  type: "team" | "trial" | "league";
  name: string;
  roleOrResult: string;
  periodOrScore?: string;
  details?: string;
}

export interface PortfolioData {
  name: string;
  tagline: string;
  age: number;
  location: string;
  languages: string[];
  avatarUrl: string;
  coverImageUrl?: string;
  overview: string[];
  achievements: string[];
  stats: PlayerStats;
  strengths: string[];
  focus: string[];
  maps: MapData[];
  experience: ExperienceItem[];
  links: {
    faceit: string;
    steam: string;
    leetify: string;
    discord: string;
    email: string;
  };
  media: {
    demos: { title: string; url: string }[];
    highlights: { title: string; url: string }[];
    vods: { title: string; url: string }[];
  };
  segments?: any[];
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
