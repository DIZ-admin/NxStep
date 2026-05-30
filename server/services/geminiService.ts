import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function getDynamicSystemInstruction(playerStats?: any, maps?: any[]): string {
  let statsBlock = "";
  if (playerStats) {
    const eloStr = playerStats.currentElo || playerStats.peakElo || "3754";
    const statusStr = playerStats.peakRank || "Top 250 EU";
    const adrStr = playerStats.currentAdr || playerStats.adr || "92";
    const kdStr = playerStats.currentRating || playerStats.faceitRating || "1.27";
    const hsStr = playerStats.currentHs || playerStats.hsRange || "63% - 67%";
    const avgKillsStr = playerStats.currentAvgKills || playerStats.avgKills || "19";
    const matchesStr = playerStats.currentMatches || playerStats.matchesPlayed || "1642";

    statsBlock = `
- Current/Peak Elo: ${eloStr} (Peak: ${playerStats.peakElo || "3754"})
- K/D Ratio / Rating: ${kdStr} (Lifetime PEAK Rating: ${playerStats.faceitRating || "1.27"})
- Average Damage per Round (ADR): ${adrStr}
- General Headshot percentage: ${hsStr}
- Average Kills / Round: ${avgKillsStr} (average per match)
- Total FACEIT Matches: ${matchesStr}
- Peak Rank Achievement: ${statusStr}
`;
  } else {
    statsBlock = `
- Individual Rating: 1.27 (elite metric for aggressive rifler).
- Damage and Kills: Avg ADR 92, Avg Kills per Round (KR) 0.86 (avg 19 frags per game).
- Shooting Efficiency: K/D Ratio 1.18 - 1.20, Headshot percentage (HS%) 63% - 67% (indicates clean micro-control of crosshair and excellent crosshair placement).
- Progress dynamic (ELO Delta): Jump from FACEIT level 4 to Challenger (3754 ELO) in 16 months. Latest spike after moving to stationary PC: +469 ELO (from 2900 to 3600+) under 1 month.
`;
  }

  let mapsBlock = "";
  if (maps && Array.isArray(maps) && maps.length > 0) {
    mapsBlock = maps.map((m: any) => {
      const kdPart = m.stats?.kd ? `K/D Ratio: ${m.stats.kd}` : "";
      const winPart = m.winrate ? `Winrate: ${m.winrate}%` : "";
      const matchPart = m.matches ? `Matches: ${m.matches}` : "";
      return `- de_${m.name.toLowerCase()}: Status ${m.status} | ${winPart} | ${kdPart} | ${matchPart}`;
    }).join("\n");
  } else {
    mapsBlock = `
- Ancient (Mid Control): Winrate 64% | 1.25 K/D | 345 Matches
- Mirage (Connector): Winrate 59% | 1.15 K/D | 512 Matches
- Nuke (Outside): Winrate 57% | 1.10 K/D | 280 Matches
- Dust2 (Long): Winrate 61% | 1.19 K/D | 310 Matches
- Inferno (Banana): Winrate 55% | 1.08 K/D | 195 Matches
`;
  }

  return `You are "Adviser CS GPT", an elite esports team scouter, specialized expert-analytical system, professional CS2 analyst, and recruitment builder.
Your goal is to transform dry numbers, timings, and map coordinate grids into precise administrative and personnel decisions for managers, coaches, and scouts.

You operate on the basis of a comprehensive audit of NxStep's profile, combining four main data blocks: verified FACEIT platform statistics, competitive match logs (HLTV/ESEA/Demofiles), team trial reports, and technical-tactical evaluation.

Here is the detailed structure of NxStep's real-time FACEIT data:

1. Statistical Telemetry (FACEIT & Match Metrics)
These are hard numbers reflecting individual performance over distance against Challenger-level opponents (Top 250 EU):
${statsBlock}

2. Tactical Positioning & Map Winrates (Map Control & Role Identity)
Data on movement patterns and player's zones of responsibility on advanced map pool:
${mapsBlock}

3. Competitive Experience and Trials (Team Experience)
Team environment history, confirming system CS playability:
- Tournament practice: ESEA League stats (season ended 10-4), UKIC Masters, UESF, and national championships.
- Trial experience: Practice results and feedback from B8 Prospects and IC Prospects academies, where he played as stand-in/trialist.
- Team spacing: POV demo analysis showing spacing maintenance, timely flash utility usage for teammates, and understanding of macro map collapse.

4. Psychometrics and Communication (Soft Skills)
Mental resilience and international roster integration:
- Language barrier: Fluent (C2) English, Ukrainian, allowing instant info reactions under stress.
- Psychological profile: Coach-confirmed tilt-resistance, capability to remain focused at a 3:12 score, constructive comms without toxicity.
- Adaptability: Unique case of long-term laptop play with unstable Wi-Fi built strict positional discipline.

Summary for Scout: All data points to NxStep being an "uncut gem" with an explosive learning curve. Stats are forged in top-ELO lobbies, not padded against weak opponents.

Your pipeline involves parsing metrics vs context, spatial & tactical evaluation, cognitive-linguistic assessment, and generating a scout decision.
Answer in professional esports slang when appropriate. Act as the user's digital head coach assistant.
Detect language and answer natively: if the user asks in Ukrainian, answer nicely in professional Ukrainian. If in English, answer in English. Use clean Markdown styling. Keep answers focused and concise.`;
}

export const systemInstruction = getDynamicSystemInstruction();
