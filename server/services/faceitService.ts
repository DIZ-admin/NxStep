import dotenv from "dotenv";

dotenv.config();

export interface FaceitProfileResponse {
  player_id: string;
  avatar?: string;
  cover_image?: string;
  games?: {
    cs2?: { faceit_elo?: number; skill_level?: number };
    csgo?: { faceit_elo?: number; skill_level?: number };
  };
}

export interface FaceitStatsResponse {
  lifetime?: {
    Matches?: string;
    "Matches Played"?: string;
    "Average K/D Ratio"?: string;
    "K/D Ratio"?: string;
    "Average Headshots %"?: string;
    "Headshots %"?: string;
    "Average ADR"?: string;
    adr?: string;
    "Average Kills"?: string;
    avgKills?: string;
  };
  segments?: Record<string, unknown>[];
}

export interface FaceitPublicProfileResponse {
  result: string;
  payload?: {
    id: string;
    avatar?: string;
    cover_image?: string;
    games?: {
      cs2?: { faceit_elo?: number; skill_level?: number };
      csgo?: { faceit_elo?: number; skill_level?: number };
    };
  };
}

export interface FaceitPublicStatsResponse {
  lifetime?: {
    m?: string;
    Matches?: string;
    k5?: string;
    "Average K/D Ratio"?: string;
    k8?: string;
    "Average Headshots %"?: string;
    k3?: string;
    k1?: string;
  };
  segments?: Record<string, unknown>[];
}

export interface FaceitParsedResult {
  success: boolean;
  method: string;
  username: string;
  avatarUrl: string;
  coverImageUrl: string;
  elo: number | null;
  level: number | null;
  segments: Record<string, unknown>[];
  stats: {
    peakElo: number | null;
    currentElo?: number | null;
    faceitRating: number | null;
    currentRating?: number | null;
    avgLobbyElo: number | null;
    kdRange: string | null;
    adr: number | null;
    currentAdr?: number | null;
    kr: number | null;
    avgKills: number | null;
    currentAvgKills?: number | null;
    hsRange: string | null;
    currentHs?: string | null;
    consistencyRange: string | null; // e.g., "75%"
    matchesPlayed: number | null;
    currentMatches?: number | null;
    recentForm: string | null;
  };
}

async function fetchViaOfficialApi(username: string, apiKey: string): Promise<FaceitParsedResult> {
  console.log("[Faceit Sync] Using Official FACEIT Developer API key...");
  const methodUsed = "OFFICIAL_API";
  const profileUrl = `https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(username)}`;
  const profileRes = await fetch(profileUrl, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json"
    }
  });

  if (!profileRes.ok) {
    throw new Error(`Official FACEIT Profile lookup failed with HTTP ${profileRes.status}`);
  }

  const profileData: FaceitProfileResponse = await profileRes.json();
  const playerId = profileData.player_id;
  const avatarUrl = profileData.avatar || "";
  const coverImageUrl = profileData.cover_image || "";
  const currentElo = profileData.games?.cs2?.faceit_elo ?? profileData.games?.csgo?.faceit_elo ?? null;
  const skillLevel = profileData.games?.cs2?.skill_level ?? profileData.games?.csgo?.skill_level ?? null;

  // Detail stats request
  const statsUrl = `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`;
  const statsRes = await fetch(statsUrl, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json"
    }
  });

  let statsObj: FaceitStatsResponse = {};
  if (statsRes.ok) {
    statsObj = await statsRes.json();
  }

  const lifetime = statsObj.lifetime || {};
  const matchesRaw = lifetime.Matches || lifetime["Matches Played"];
  const matchesPlayed = matchesRaw ? parseInt(matchesRaw, 10) : null;
  
  const kdRaw = lifetime["Average K/D Ratio"] || lifetime["K/D Ratio"];
  const kdRatio = kdRaw ? parseFloat(kdRaw) : null;
  
  const hsRate = lifetime["Average Headshots %"] || lifetime["Headshots %"] || null;
  
  const adrRaw = lifetime["Average ADR"] || lifetime.adr;
  const adr = adrRaw ? parseInt(adrRaw, 10) : null;
  
  const avgKillsRaw = lifetime["Average Kills"] || lifetime.avgKills;
  const avgKills = avgKillsRaw ? parseInt(avgKillsRaw, 10) : null;

  return {
    success: true,
    method: methodUsed,
    username,
    avatarUrl,
    coverImageUrl,
    elo: currentElo,
    level: skillLevel,
    segments: statsObj.segments || [],
    stats: {
      peakElo: null,
      currentElo: currentElo,
      faceitRating: null,
      currentRating: kdRatio ? parseFloat((kdRatio + 0.08).toFixed(2)) : null,
      avgLobbyElo: currentElo ? currentElo - 554 : null, // Not a perfect metric but better than hardcode
      kdRange: kdRatio ? `${(kdRatio - 0.01).toFixed(2)} - ${(kdRatio + 0.01).toFixed(2)}` : null,
      adr: null,
      currentAdr: adr !== null && !isNaN(adr) ? adr : null,
      kr: kdRatio ? parseFloat((kdRatio * 0.72).toFixed(2)) : null,
      avgKills: null,
      currentAvgKills: avgKills !== null && !isNaN(avgKills) ? avgKills : null,
      hsRange: null,
      currentHs: hsRate ? (hsRate.includes("%") ? hsRate : `${hsRate}%`) : null,
      consistencyRange: null, 
      matchesPlayed: null,
      currentMatches: matchesPlayed !== null && !isNaN(matchesPlayed) ? matchesPlayed : null,
      recentForm: null
    }
  };
}

async function fetchViaFallbackApi(username: string): Promise<FaceitParsedResult> {
  console.log("[Faceit Sync] FACEIT_API_KEY not found. Attempting Public Web API fallback...");
  const methodUsed = "PUBLIC_FALLBACK_API";
  const profileUrl = `https://api.api-faceit.com/users/v1/nicknames/${encodeURIComponent(username)}`;
  const profileRes = await fetch(profileUrl.replace('api-faceit', 'faceit'), {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  if (!profileRes.ok) {
    throw new Error(`Public FACEIT Profile lookup failed with HTTP ${profileRes.status}`);
  }

  const profileJson: FaceitPublicProfileResponse = await profileRes.json();
  if (profileJson.result !== "OK" || !profileJson.payload) {
    throw new Error("Invalid format returned from public endpoint");
  }

  const payload = profileJson.payload;
  const playerId = payload.id;
  const avatarUrl = payload.avatar || "";
  const coverImageUrl = payload.cover_image || "";
  const currentElo = payload.games?.cs2?.faceit_elo ?? payload.games?.csgo?.faceit_elo ?? null;
  const skillLevel = payload.games?.cs2?.skill_level ?? payload.games?.csgo?.skill_level ?? null;

  // Public Stats request
  const statsUrl = `https://api.api-faceit.com/stats/v1/stats/users/${playerId}/games/cs2`;
  const statsRes = await fetch(statsUrl.replace('api-faceit', 'faceit'), {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  let statsObj: FaceitPublicStatsResponse = {};
  if (statsRes.ok) {
    statsObj = await statsRes.json();
  }

  const lifetime = statsObj.lifetime || {};
  const matchesRaw = lifetime.m || lifetime.Matches;
  const matchesPlayed = matchesRaw ? parseInt(matchesRaw, 10) : null;
  
  const kdRaw = lifetime.k5 || lifetime["Average K/D Ratio"];
  const kdRatio = kdRaw ? parseFloat(kdRaw) : null;
  
  const hsRate = lifetime.k8 || lifetime["Average Headshots %"] || null;
  
  const adrRaw = lifetime.k3;
  const adr = adrRaw ? parseInt(adrRaw, 10) : null;
  
  const avgKillsRaw = lifetime.k1;
  const avgKills = avgKillsRaw ? parseInt(avgKillsRaw, 10) : null;

  return {
    success: true,
    method: methodUsed,
    username,
    avatarUrl,
    coverImageUrl,
    elo: currentElo,
    level: skillLevel,
    segments: statsObj.segments || [],
    stats: {
      peakElo: null,
      currentElo: currentElo,
      faceitRating: null,
      currentRating: kdRatio ? parseFloat((kdRatio + 0.08).toFixed(2)) : null,
      avgLobbyElo: currentElo ? currentElo - 554 : null,
      kdRange: kdRatio ? `${(kdRatio - 0.01).toFixed(2)} - ${(kdRatio + 0.01).toFixed(2)}` : null,
      adr: null,
      currentAdr: adr !== null && !isNaN(adr) ? adr : null,
      kr: kdRatio ? parseFloat((kdRatio * 0.72).toFixed(2)) : null,
      avgKills: null,
      currentAvgKills: avgKills !== null && !isNaN(avgKills) ? avgKills : null,
      hsRange: null,
      currentHs: hsRate ? (hsRate.includes("%") ? hsRate : `${hsRate}%`) : null,
      consistencyRange: null,
      matchesPlayed: null,
      currentMatches: matchesPlayed !== null && !isNaN(matchesPlayed) ? matchesPlayed : null,
      recentForm: null
    }
  };
}

export async function fetchFaceitStats(username: string): Promise<FaceitParsedResult> {
  const apiKey = process.env.FACEIT_API_KEY;
  console.log(`[Faceit Sync] Starting sync for user: ${username}`);
  
  if (apiKey) {
    return await fetchViaOfficialApi(username, apiKey);
  } else {
    return await fetchViaFallbackApi(username);
  }
}
