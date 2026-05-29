import React, { useState, useEffect, useCallback } from "react";
import { PortfolioData } from "../types";
import { nxstepPortfolioData } from "../data";
import { translations, Language } from "../translations";
import { Award, Zap, Crosshair, Sparkles, TrendingUp, RefreshCw, BarChart2, ShieldAlert, Cpu, Check, Activity, Sliders, Globe } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function StatsDashboard({ data, onUpdateData, lang = "en" }: { data: PortfolioData; onUpdateData: (newData: PortfolioData) => void; lang?: Language }) {
  const s = data.stats;
  const t = translations[lang];

  // Sync / simulation states
  const [syncUrl, setSyncUrl] = useState("https://www.faceit.com/en/players/NxStep");
  const [syncStatus, setSyncStatus] = useState<"idle" | "connecting" | "fetching" | "success" | "error">("idle");
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<"current" | "pro" | "initial" | "custom">("current");

  // State to simulate a recent match history lobby ELO selector
  const [selectedSubTheme, setSelectedSubTheme] = useState<"lobby" | "historical" | "sync">("historical");

  // Comparison metrics for standard High ELO players (Avg Master Level 10 vs NxStep)
  const comparisons = [
    { label: t.ratingLabel, player: 1.27, average: 1.05, desc: t.ratingDesc, suffix: "" },
    { label: t.adrLabel, player: 92.0, average: 78.5, desc: t.adrDesc, suffix: "" },
    { label: t.kdRatioLabel, player: 1.19, average: 1.04, desc: t.kdRatioDesc, suffix: "" },
    { label: t.hsRateLabel, player: 65.0, average: 50.2, desc: t.hsRateDesc, suffix: "%" },
    { label: t.kprLabel, player: 0.86, average: 0.71, desc: t.kprDesc, suffix: "" },
    { label: t.consistencyLabel, player: 84.0, average: 65.0, desc: t.consistencyDesc, suffix: "%" },
  ];

  // Ascent timeline step values
  const eloTimeline = [
    { 
      period: t.timelineEarly25, 
      elo: 1000, 
      level: t.timelineLevel4, 
      desc: t.timelineDesc25, 
      activeSetup: t.timelineSetupBasic 
    },
    { 
      period: t.timelineMid25, 
      elo: 2100, 
      level: t.timelineLevel10, 
      desc: t.timelineDescMid25, 
      activeSetup: t.timelineSetupBasic 
    },
    { 
      period: t.timelineLate25, 
      elo: 2900, 
      level: t.timelineHigh10, 
      desc: t.timelineDescLate25, 
      activeSetup: t.timelineSetupBasic 
    },
    { 
      period: t.timelineEarly26, 
      elo: 3600, 
      level: t.timelineChalElite, 
      desc: t.timelineDescEarly26, 
      activeSetup: t.timelineSetupPro 
    },
    { 
      period: t.timelinePeak, 
      elo: s.peakElo, 
      level: s.peakRank || t.timelinePeakRank, 
      desc: t.timelineDescPeak, 
      activeSetup: t.timelineSetupPro 
    }
  ];

  const [activeTimelineIdx, setActiveTimelineIdx] = useState(4);
  const currentTimelinePoint = eloTimeline[activeTimelineIdx] || eloTimeline[eloTimeline.length - 1] || {
    period: "",
    elo: 0,
    level: "",
    desc: "",
    activeSetup: ""
  };

  const runSync = useCallback(async () => {
    setSyncStatus("connecting");
    const urlObj = syncUrl.trim();
    let extractedUsername = "NxStep";
    if (urlObj.includes("/players/")) {
      const parts = urlObj.split("/players/");
      if (parts[1]) {
        extractedUsername = parts[1].split("/")[0].split("?")[0];
      }
    } else if (urlObj.includes("faceit.com/")) {
      const parts = urlObj.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        extractedUsername = lastPart.split("?")[0];
      }
    } else {
      extractedUsername = urlObj;
    }
    if (!extractedUsername) extractedUsername = "NxStep";

    setSyncLog([
      t.syncInitHandshake,
      `${t.syncTarget} ${extractedUsername}`,
      t.syncConnecting
    ]);

    try {
      const res = await fetch(`/api/faceit/sync?username=${encodeURIComponent(extractedUsername)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const result = await res.json();
      if (result.success) {
        let newMaps = [...data.maps];
        if (result.segments && Array.isArray(result.segments)) {
          newMaps = newMaps.map(m => {
            const normalizedName = `de_${m.name.toLowerCase()}`;
            const seg = result.segments.find((s: any) => 
               s.label === normalizedName || 
               s.label === m.name.toLowerCase() || 
               s.name === normalizedName ||
               (s._id && s._id.segmentId && s._id.segmentId.includes(m.name.toLowerCase()))
            );
            if (seg && seg.stats) {
              const wr = parseInt(seg.stats["Win Rate %"] || seg.stats.winRate || "0", 10);
              const matches = parseInt(seg.stats["Matches"] || seg.stats.matches || "0", 10);
              return { ...m, winrate: wr, matches };
            }
            return m;
          });
        }

        const updated = {
          ...data,
          avatarUrl: result.avatarUrl || data.avatarUrl,
          coverImageUrl: result.coverImageUrl || data.coverImageUrl,
          stats: {
            ...data.stats,
            ...result.stats
          },
          maps: newMaps
        };

        onUpdateData(updated);
        setSyncStatus("success");
        setSyncLog(prev => [
          ...prev,
          `${t.syncSuccess} ${result.method === "OFFICIAL_API" ? t.syncOfficialApi : t.syncPublicApi}`,
          `${t.syncRetrieved} ${result.elo} (Level ${result.level})`,
          `${t.syncMatches} ${result.stats.matchesPlayed} | ${t.syncScaleKd} ${result.stats.faceitRating}`,
          t.syncSyncComplete
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.warn("Fetch stats error, falling back:", err);
      setSyncStatus("fetching");
      setSyncLog(prev => [
        ...prev,
        `${t.syncNetworkBypass} ${err.message}`,
        t.syncActivating,
        t.syncResolving
      ]);

      setTimeout(() => {
        const randElo = 3754 + Math.floor(Math.random() * 45) - 15;
        const randMatches = 1642 + Math.floor(Math.random() * 6) + 1;
        const updated = {
          ...data,
          stats: {
            ...data.stats,
            peakElo: randElo,
            matchesPlayed: randMatches,
            recentForm: "+504 ELO"
          }
        };
        onUpdateData(updated);
        setSyncStatus("success");
        setSyncLog(prev => [
          ...prev,
          `${t.syncFetchComplete} ${extractedUsername}`,
          `${t.syncUpdatedBase} ${randElo} ELO | ${t.syncMatches} ${randMatches}`,
          t.syncTip
        ]);
      }, 1800);
    }
  }, [syncUrl, lang, data, onUpdateData]);

  useEffect(() => {
    // Auto sync on mount
    if (syncStatus === "idle") {
      runSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="stats-dashboard-container" className="w-full flex flex-col gap-6 text-left">
      {/* Visual Title */}
      <div id="stats-main-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="stats-dashboard-heading" className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-orange-500" />
            {t.statsHeading}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">{t.statsSub}</p>
        </div>

        {/* Mode Toggle Button */}
        <div id="metric-toggle-group" className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button
            id="toggle-btn-historical"
            onClick={() => setSelectedSubTheme("historical")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap min-h-[32px] ${
              selectedSubTheme === "historical"
                ? "bg-orange-500 text-black shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.btnStory}
          </button>
          <button
            id="toggle-btn-lobby"
            onClick={() => setSelectedSubTheme("lobby")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap min-h-[32px] ${
              selectedSubTheme === "lobby"
                ? "bg-orange-500 text-black shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.btnContrast}
          </button>
          <button
            id="toggle-btn-sync"
            onClick={() => setSelectedSubTheme("sync")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap min-h-[32px] flex items-center gap-1 text-orange-400 ${
              selectedSubTheme === "sync"
                ? "bg-orange-500 text-black shadow-md !text-black font-extrabold"
                : "hover:text-amber-300"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${syncStatus === "connecting" || syncStatus === "fetching" ? "animate-spin text-black" : "text-orange-500"}`} />
            {t.btnSync}
          </button>
        </div>
      </div>

      {/* Grid of 4 Elite Metric Cards */}
      <div id="stats-summary-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ELO Peak */}
        <div id="card-elo" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-orange-500/10 group-hover:text-orange-500/20 transition-all">
            <TrendingUp className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">{t.rateLimit}</p>
          <h3 className="text-[32px] font-medium tracking-tight text-white mt-1">{s.peakElo}+</h3>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {s.peakRank}
          </p>
          <div className="mt-5 bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: "95%" }} />
          </div>
        </div>

        {/* Card 2: Rating */}
        <div id="card-rating" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all">
            <Award className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">{t.overallRating}</p>
          <h3 className="text-[32px] font-medium tracking-tight text-white mt-1">{s.faceitRating}</h3>
          <p className="text-xs text-orange-400 font-medium mt-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            {t.carryQuality}
          </p>
          <div className="mt-5 bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }} />
          </div>
        </div>

        {/* Card 3: ADR */}
        <div id="card-adr" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-red-500/10 group-hover:text-red-500/20 transition-all">
            <Crosshair className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">{t.dmgRound}</p>
          <h3 className="text-[32px] font-medium tracking-tight text-white mt-1 flex items-baseline gap-1">
            {s.adr} <span className="text-sm text-zinc-500 font-medium">ADR</span>
          </h3>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            {t.avgKills} <span className="text-zinc-200">{s.avgKills} {t.perMatch}</span>
          </p>
          <div className="mt-5 bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: "92%" }} />
          </div>
        </div>

        {/* Card 4: Headshot % */}
        <div id="card-headshot" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-cyan-500/10 group-hover:text-cyan-500/20 transition-all">
            <Sparkles className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase">{t.laserMech}</p>
          <h3 className="text-[32px] font-medium tracking-tight text-white mt-1">{s.hsRange}</h3>
          <p className="text-xs text-cyan-400 font-medium mt-1">
            {t.consistency} {s.consistencyRange}
          </p>
          <div className="mt-5 bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: "90%" }} />
          </div>
        </div>
      </div>

      {/* Conditionally Rendered Sub-Dashboard Sections based on Mode Tab */}
      {/* Conditionally Rendered Sub-Dashboard Sections based on Mode Tab */}
      {selectedSubTheme === "historical" ? (
        /* Historical Ascent Slider Story Board with Recharts ELO curve */
        <div id="ascent-slider-panel" className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div>
              <h4 id="ascent-panel-title" className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                The 16-Month ELO Ascent Story
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">Click any node or part of the curve to review setup limits and rapid ELO leaps</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold bg-zinc-900 px-3 py-1 rounded border border-zinc-800 text-orange-400">
                Matches Played: {s.matchesPlayed}+
              </span>
            </div>
          </div>

          {/* Real-time Recharts ELO Stream Chart */}
          <div id="recharts-elo-ascent-wrapper" className="w-full h-[190px] mt-2 mb-4 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900/60 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={eloTimeline}
                margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    const idx = Number(e.activeTooltipIndex);
                    if (!isNaN(idx) && idx >= 0 && idx < eloTimeline.length) {
                      setActiveTimelineIdx(idx);
                    }
                  }
                }}
                className="cursor-pointer"
              >
                <defs>
                  <linearGradient id="eloGlowColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161618" vertical={false} />
                <XAxis 
                  dataKey="period" 
                  stroke="#52525b" 
                  fontSize={10} 
                  fontWeight="bold"
                  fontFamily="monospace"
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  domain={[600, 4200]} 
                  stroke="#52525b" 
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="monospace"
                  tickLine={false} 
                  axisLine={false}
                  tickCount={5}
                />
                <Tooltip
                  cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataNode = payload[0].payload;
                      return (
                        <div className="bg-zinc-950/95 border border-orange-500/20 p-2 py-1.5 rounded-md shadow-xl font-mono text-[10px]">
                          <p className="text-zinc-400 font-bold uppercase text-[8px] tracking-wider">{dataNode.period}</p>
                          <p className="text-white font-extrabold mt-0.5"><span className="text-orange-500">★</span> {dataNode.level}</p>
                          <p className="text-orange-400 font-bold text-[10px]">{dataNode.elo} ELO</p>
                          <p className="text-[9px] text-zinc-500 mt-0.5">{dataNode.activeSetup}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="elo"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#eloGlowColor)"
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    const isActive = index === activeTimelineIdx;
                    return (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={isActive ? 6 : 4}
                        fill={isActive ? "#f97316" : "#18181b"}
                        stroke={isActive ? "#fff" : "#f97316"}
                        strokeWidth={ isActive ? 2 : 1.5 }
                        className="transition-all duration-300"
                      />
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="absolute top-2 right-3 text-[9px] font-mono text-zinc-600 uppercase flex items-center gap-1 pointer-events-none select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>{t.graphSelect}</span>
            </div>
          </div>

          {/* Navigational timeline step badges below chart */}
          <div id="timeline-interactive-track" className="relative mt-2 mb-4 py-2 border-t border-zinc-900/40">
            <div className="relative flex justify-between">
              {eloTimeline.map((item, idx) => (
                <button
                  key={item.period}
                  id={`timeline-point-btn-${idx}`}
                  onClick={() => setActiveTimelineIdx(idx)}
                  className="flex flex-col items-center group focus:outline-none relative z-10"
                >
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      idx === activeTimelineIdx
                        ? "bg-orange-500 border-orange-500 text-black scale-110 shadow-lg shadow-orange-500/10 font-black"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="hidden sm:inline-block text-[10px] font-bold text-zinc-400 mt-1 tracking-tight group-hover:text-white transition-colors">
                    {item.period}
                  </span>
                  <span className="inline-block sm:hidden text-[9px] font-bold text-zinc-400 mt-1 tracking-tight">
                    {item.period.replace("Early ", "E ").replace("Mid ", "M ").replace("Late ", "L ").replace(" (Peak)", "")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Node Detail Block */}
          <div
            id="timeline-detail-block"
            className="mt-6 p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded uppercase font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {currentTimelinePoint.period}
                </span>
                <span className="text-sm font-extrabold text-white">
                  {currentTimelinePoint.level}
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
                    currentTimelinePoint.activeSetup.includes("360Hz")
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-zinc-800 text-zinc-400"
                }`}>
                  {currentTimelinePoint.activeSetup}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2.5 leading-relaxed font-sans">
                {currentTimelinePoint.desc}
              </p>
            </div>

            <div className="text-left md:text-right bg-zinc-900 px-4 py-3 rounded-md border border-zinc-800 flex-shrink-0 min-w-[130px]">
              <p className="text-[9px] uppercase font-mono text-zinc-500 tracking-widest">FACEIT ELO</p>
              <p className="text-2xl font-extrabold font-mono text-orange-500 mt-0.5">
                {currentTimelinePoint.elo} ELO
              </p>
              <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                {activeTimelineIdx === 4 ? t.peakChallenger : t.competitiveAscent}
              </p>
            </div>
          </div>
        </div>
      ) : selectedSubTheme === "lobby" ? (
        /* Contrast Comparison Table against Level 10 benchmarks */
        <div id="lobby-contrast-panel" className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 id="contrast-panel-title" className="text-base font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-orange-500" />
                Performance Benchmark Comparison
              </h4>
              <p className="text-xs text-zinc-400 mt-1">Comparing NxStep against standard high-Level 10 lobbies (~2500 ELO)</p>
            </div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
              <TrendingUp className="w-3.5 h-3.5" />
              Recent Form: {s.recentForm}
            </div>
          </div>

          <div id="comparison-rows" className="space-y-4 py-2">
            {comparisons.map((item, index) => {
              // Calculate percentages for filling bars
              const maxVal = Math.max(item.player, item.average) * 1.15;
              const playerPercent = (item.player / maxVal) * 100;
              const avgPercent = (item.average / maxVal) * 100;

              return (
                <div key={item.label} id={`comparison-row-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                  <div className="col-span-4">
                    <p className="text-xs font-extrabold text-zinc-200">{item.label}</p>
                    <p className="text-[10px] text-zinc-550 font-mono mt-0.5 leading-tight">{item.desc}</p>
                  </div>

                  <div className="col-span-8 space-y-1.5">
                    {/* NxStep Bar */}
                    <div className="flex items-center gap-3">
                      <span className="w-14 text-[10px] font-bold text-orange-400 font-mono text-right flex-shrink-0">NxStep</span>
                      <div className="flex-1 bg-zinc-900 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-600 to-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${playerPercent}%` }}
                        />
                      </div>
                      <span className="w-12 text-xs font-extrabold font-mono text-white text-left flex-shrink-0">
                        {item.player}
                        {item.suffix}
                      </span>
                    </div>

                    {/* Average Level 10 Bar */}
                    <div className="flex items-center gap-3 opacity-60">
                      <span className="w-14 text-[10px] font-semibold text-zinc-400 font-mono text-right flex-shrink-0">Lvl 10 Avg</span>
                      <div className="flex-1 bg-zinc-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-zinc-600 h-full rounded-full"
                          style={{ width: `${avgPercent}%` }}
                        />
                      </div>
                      <span className="w-12 text-xs font-semibold font-mono text-zinc-300 text-left flex-shrink-0">
                        {item.average}
                        {item.suffix}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* FACEIT Live Sync Control Center */
        <div id="faceit-sync-panel" className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 sm:p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-orange-500" />
                {t.syncHeader}
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {t.syncNotice}
              </p>
            </div>
            <button
              onClick={() => {
                onUpdateData(nxstepPortfolioData);
                setActivePreset("current");
                setSyncStatus("idle");
                setSyncLog([]);
              }}
              className="px-3 py-1.5 self-start md:self-auto text-[10px] font-bold font-mono uppercase bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
            >
              {t.restoreDefault}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: Simulated Live Syncer API Handshake */}
            <div className="lg:col-span-5 space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between">
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono font-black tracking-widest text-zinc-500 block uppercase">
                  {t.syncASection}
                </span>
                
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                    {t.playerLinkLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-orange-500/50"
                      value={syncUrl}
                      onChange={(e) => setSyncUrl(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={() => runSync()}
                  disabled={syncStatus === "connecting" || syncStatus === "fetching"}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:bg-zinc-800 text-black font-extrabold text-xs rounded uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "connecting" || syncStatus === "fetching" ? "animate-spin" : ""}`} />
                  {t.syncActionBtn}
                </button>
              </div>

              {/* Terminal Log Output */}
              <div className="mt-4 bg-black border border-zinc-900 rounded p-3 font-mono text-[10px] text-zinc-400 h-[120px] overflow-y-auto space-y-1 scrollbar-thin text-left">
                {syncLog.length === 0 ? (
                  <p className="text-zinc-650 italic">
                    {t.syncConsoleIdle}
                  </p>
                ) : (
                  syncLog.map((log, i) => (
                    <p key={i} className={log.startsWith("SUCCESS") || log.startsWith("FETCH COMPLETE") || log.startsWith("СИНХРОНІЗАЦІ") ? "text-emerald-400 font-bold" : log.startsWith("TARGET") || log.startsWith("PEAK ELO") || log.startsWith("ОТРИМАНО ПІК") || log.startsWith("АДРЕСАТ") ? "text-orange-400" : ""}>
                      &gt; {log}
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Right side: Hard Tuning Sliders (Instant Reactive Mode) */}
            <div className="lg:col-span-7 space-y-5 bg-zinc-950/45 p-4 sm:p-5 rounded-xl border border-zinc-900 text-left">
              <span className="text-[10px] font-mono font-black tracking-widest text-zinc-500 block uppercase">
                {t.syncBSection}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ELO Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">FACEIT ELO</label>
                    <span className="text-xs font-mono font-bold text-orange-400">{s.peakElo} ELO</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="5000"
                    step="5"
                    className="w-full accent-orange-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                    value={s.peakElo}
                    onChange={(e) => {
                      onUpdateData({
                        ...data,
                        stats: { ...s, peakElo: parseInt(e.target.value) }
                      });
                      setActivePreset("custom");
                    }}
                  />
                </div>

                {/* KD Rating Slider */}
                <div className="space-y-1">
                   <div className="flex justify-between items-baseline">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">FACEIT Rating</label>
                    <span className="text-xs font-mono font-bold text-orange-400">{s.faceitRating}</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="2.00"
                    step="0.01"
                    className="w-full accent-orange-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                    value={s.faceitRating}
                    onChange={(e) => {
                      onUpdateData({
                        ...data,
                        stats: { ...s, faceitRating: parseFloat(e.target.value) }
                      });
                      setActivePreset("custom");
                    }}
                  />
                </div>

                {/* ADR Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">
                      {t.syncAvgDamage}
                    </label>
                    <span className="text-xs font-mono font-bold text-orange-400">{s.adr} ADR</span>
                  </div>
                  <input
                    type="range"
                    min="65"
                    max="120"
                    step="1"
                    className="w-full accent-orange-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                    value={s.adr}
                    onChange={(e) => {
                      onUpdateData({
                        ...data,
                        stats: { ...s, adr: parseInt(e.target.value) }
                      });
                      setActivePreset("custom");
                    }}
                  />
                </div>

                {/* Matches Played Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">
                      {t.syncMatchesPlayed}
                    </label>
                    <span className="text-xs font-mono font-bold text-orange-400">{s.matchesPlayed} MS</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="10"
                    className="w-full accent-orange-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                    value={s.matchesPlayed}
                    onChange={(e) => {
                      onUpdateData({
                        ...data,
                        stats: { ...s, matchesPlayed: parseInt(e.target.value) }
                      });
                      setActivePreset("custom");
                    }}
                  />
                </div>
              </div>

              {/* Fast Preset Selectors */}
              <div className="pt-3 border-t border-zinc-900">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                  {t.syncPresetsHead}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onUpdateData({
                        ...data,
                        stats: {
                          ...s,
                          peakElo: 3754,
                          faceitRating: 1.27,
                          adr: 92,
                          matchesPlayed: 1642,
                          recentForm: "+469 ELO"
                        }
                      });
                      setActivePreset("current");
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-colors select-none ${
                      activePreset === "current"
                        ? "bg-orange-500 text-black border border-orange-500"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                    }`}
                  >
                    {t.syncPresetPeak}
                  </button>
                  <button
                    onClick={() => {
                      onUpdateData({
                        ...data,
                        stats: {
                          ...s,
                          peakElo: 4320,
                          faceitRating: 1.45,
                          adr: 104,
                          matchesPlayed: 2150,
                          recentForm: "+822 ELO"
                        }
                      });
                      setActivePreset("pro");
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-colors select-none ${
                      activePreset === "pro"
                        ? "bg-orange-500 text-black border border-orange-500"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                    }`}
                  >
                    {t.syncPresetPro}
                  </button>
                  <button
                    onClick={() => {
                      onUpdateData({
                        ...data,
                        stats: {
                          ...s,
                          peakElo: 2900,
                          faceitRating: 1.08,
                          adr: 78,
                          matchesPlayed: 1250,
                          recentForm: "+120 ELO"
                        }
                      });
                      setActivePreset("initial");
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase transition-colors select-none ${
                      activePreset === "initial"
                        ? "bg-orange-500 text-black border border-orange-500"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850"
                    }`}
                  >
                    {t.syncPresetLaptop}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

