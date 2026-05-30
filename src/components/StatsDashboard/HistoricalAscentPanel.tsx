import { useState, useMemo, memo } from "react";
import { TrendingUp, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import { PortfolioData } from "../../types";
import { MatchHistoryView } from "./MatchHistoryView";
import { useLanguage } from "../../contexts/LanguageContext";

interface HistoricalAscentPanelProps {
  stats: PortfolioData["stats"];
  t: Record<string, string>;
}

export const HistoricalAscentPanel = memo(function HistoricalAscentPanel({ stats: s, t }: HistoricalAscentPanelProps) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"story" | "live">("story");

  const eloTimeline = useMemo(() => [
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
  ], [s.peakElo, s.peakRank, t]);

  const [activeTimelineIdx, setActiveTimelineIdx] = useState(4);
  const currentTimelinePoint = eloTimeline[activeTimelineIdx] || eloTimeline[eloTimeline.length - 1] || {
    period: "",
    elo: 0,
    level: "",
    desc: "",
    activeSetup: ""
  };

  return (
    <div id="ascent-slider-panel" className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 sm:p-6 space-y-4">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row border-b border-zinc-900 pb-3 items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 border border-zinc-900 rounded-lg">
          <button
            onClick={() => setActiveTab("story")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "story"
                ? "bg-zinc-850 text-white border border-zinc-750 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            ⭐ {lang === "uk" ? "Хронологія ELO" : "Milestone Ascent"}
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-zinc-850 text-white border border-zinc-750 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{lang === "uk" ? "Вся статистика (Firebase)" : "Live Roster Tracker"}</span>
          </button>
        </div>
        <span className="text-[9px] uppercase font-mono text-zinc-600 tracking-wider font-bold">
          {lang === "uk" ? "База Даних Firestore Активована" : "Firestore Live Engine Connected"}
        </span>
      </div>

      {activeTab === "story" ? (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  dot={(props: { cx?: number; cy?: number; index?: number }) => {
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

          <nav id="timeline-interactive-track" aria-label="Timeline navigation" className="relative mt-2 mb-4 py-2 border-t border-zinc-900/40">
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
          </nav>

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
      ) : (
        <MatchHistoryView lang={lang} />
      )}
    </div>
  );
});
