import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { StatsDashboard } from "./components/StatsDashboard";
import { MapsAndPositions } from "./components/MapsAndPositions";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { ScoutAI } from "./components/ScoutAI";
import { MediaShowcase } from "./components/MediaShowcase";
import { nxstepPortfolioData, nxstepPortfolioDataUK } from "./data";
import { translations, Language } from "./translations";
import { ShieldCheck, Calendar, Activity, Lock, HelpCircle, Mail, MessageSquare, Terminal, Eye, Sparkles, Crosshair, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Ensure the page always starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load active language
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("nxstep_portfolio_lang");
    if (saved === "ru") {
      localStorage.setItem("nxstep_portfolio_lang", "uk");
      return "uk";
    }
    return (saved as Language) || "en";
  });

  const t = translations[lang];

  // Load initial from localStorage if preset, otherwise default to nxstepPortfolioData
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("nxstep_portfolio_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return nxstepPortfolioData;
      }
    }
    return nxstepPortfolioData;
  });

  const handleUpdateData = (newData: typeof nxstepPortfolioData) => {
    setData(newData);
    localStorage.setItem("nxstep_portfolio_data", JSON.stringify(newData));
  };

  // Compute active portfolio data based on selected language, keeping customized/synced stats
  const activePortfolioData = useMemo(() => {
    const base = lang === "uk" ? nxstepPortfolioDataUK : nxstepPortfolioData;
    return {
      ...base,
      stats: {
        ...base.stats,
        // Selectively overlay numerical/dynamic stats so language-specific strings (like peakRank) aren't overwritten
        peakElo: data.stats.peakElo,
        faceitRating: data.stats.faceitRating,
        avgLobbyElo: data.stats.avgLobbyElo,
        adr: data.stats.adr,
        kr: data.stats.kr,
        avgKills: data.stats.avgKills,
        matchesPlayed: data.stats.matchesPlayed,
        recentForm: data.stats.recentForm,
      }
    };
  }, [lang, data]);

  // Active Tab for the Main Hub
  const [activeTab, setActiveTab ] = useState<"stats" | "maps" | "exp" | "media">("stats");

  return (
    <div id="portfolio-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-black pb-16">
      {/* Dynamic Upper Telemetry Bar */}
      <div id="top-teal-bar" className="w-full bg-zinc-900 border-b border-zinc-800/60 px-4 py-2 sm:px-6 md:px-8 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-orange-400 font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            {t.hubTitle}
          </span>
          <span className="hidden sm:inline-block text-zinc-700">|</span>
          <span className="hidden sm:inline-block">{t.hubStatus}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            {t.faceitVerified}
          </span>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center bg-zinc-950 px-1.5 py-0.5 rounded-md border border-zinc-850 gap-1.5">
            <button
              onClick={() => {
                setLang("en");
                localStorage.setItem("nxstep_portfolio_lang", "en");
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                lang === "en" ? "bg-orange-500 text-black font-black shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                setLang("uk");
                localStorage.setItem("nxstep_portfolio_lang", "uk");
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                lang === "uk" ? "bg-orange-500 text-black font-black shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              UA
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div id="main-content-layout" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Module 1: Header */}
        <Header data={activePortfolioData} lang={lang} />

        {/* Module 2: Overviews & Strengths Bento Section */}
        <div id="bento-overview-container" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Quick Profile Bio Card (Left) */}
          <div id="bento-intro" className="lg:col-span-7 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 relative overflow-hidden shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] text-left">
            <div className="space-y-4 relative z-10 text-left">
              <h2 className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                {t.narativeTitle}
              </h2>
              <div className="space-y-5">
                {activePortfolioData.overview.map((paragraph, index) => (
                  <p key={index} id={`bio-paragraph-${index}`} className="text-sm md:text-[15px] font-medium text-zinc-300 leading-relaxed tracking-tight">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Achievements highlights list */}
            <div id="achievements-strip" className="flex flex-wrap gap-2.5 pt-6 border-t border-white/5 relative z-10">
              {activePortfolioData.achievements.map((ach, idx) => (
                <div key={idx} id={`badge-${idx}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-[11px] font-medium tracking-tight text-zinc-300">{ach}</span>
                </div>
              ))}
            </div>

            {/* Decorative background glow */}
            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 rounded-full bg-orange-500/10 filter blur-[80px] pointer-events-none" />
          </div>

          {/* Key Strengths Dashboard (Right) - Redesigned with low-density visual chips and custom roles */}
          <div id="bento-strengths" className="lg:col-span-5 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-5 relative group/strengths shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)]">
            <div className="space-y-4 relative z-10 text-left">
              <h2 className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                {t.specialtiesTitle}
              </h2>
              
              {/* 2x2 Grid of visual cards with low text density */}
              <div id="strengths-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group/card relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-emerald-400 tracking-tight uppercase">{t.rolClutcher}</span>
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    {t.rolClutcherDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group/card relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-cyan-400 tracking-tight uppercase">{t.rolAwp}</span>
                    <Crosshair className="w-4 h-4 text-cyan-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    {t.rolAwpDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group/card relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-amber-400 tracking-tight uppercase">{t.rolCaptain}</span>
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    {t.rolCaptainDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group/card relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-rose-400 tracking-tight uppercase">{t.rolEntry}</span>
                    <Zap className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    {t.rolEntryDesc}
                  </p>
                </div>
              </div>
            </div>

            <div id="focus-area" className="pt-5 border-t border-white/5 relative z-10 text-left">
              <p className="text-[10px] uppercase font-medium text-zinc-500 tracking-widest">{t.activeGoal}</p>
              <p className="text-[13px] font-medium text-orange-400 mt-1.5">
                {t.activeGoalDesc}
              </p>
            </div>
            {/* Ambient decorative spot background */}
            <div className="absolute left-[-10%] bottom-[-10%] w-48 h-48 rounded-full bg-orange-500/10 filter blur-[80px] pointer-events-none" />
          </div>
        </div>

        {/* Module 3: Central Operations Tab Hub */}
        <div id="ops-tab-hub" className="w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[32px] shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] p-4 sm:p-8 space-y-6 relative overflow-hidden">
          
          {/* Navigation Hub Strip */}
          <div id="hub-actions-strip" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <button
                id="tab-btn-stats"
                onClick={() => setActiveTab("stats")}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] ${
                  activeTab === "stats"
                    ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                {t.tabCombatStats}
              </button>
              <button
                id="tab-btn-maps"
                onClick={() => setActiveTab("maps")}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] ${
                  activeTab === "maps"
                    ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                {t.tabMapPool} ({data.maps.length})
              </button>
              <button
                id="tab-btn-exp"
                onClick={() => setActiveTab("exp")}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] ${
                  activeTab === "exp"
                    ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                {t.tabTrials}
              </button>
              <button
                id="tab-btn-media"
                onClick={() => setActiveTab("media")}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] ${
                  activeTab === "media"
                    ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                {t.tabMedia}
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-550 select-none justify-start md:justify-end">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>{t.scannedMetadata}</span>
            </div>
          </div>

          {/* Animated Tab Layout Component */}
          <div id="render-tab-outlet" className="relative overflow-hidden min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                id={`tab-motion-wrapper-${activeTab}`}
                className="w-full h-full"
              >
                {activeTab === "stats" && <StatsDashboard data={activePortfolioData} onUpdateData={handleUpdateData} lang={lang} />}
                {activeTab === "maps" && <MapsAndPositions data={activePortfolioData} lang={lang} />}
                {activeTab === "exp" && <ExperienceTimeline data={activePortfolioData} lang={lang} />}
                {activeTab === "media" && <MediaShowcase data={activePortfolioData} lang={lang} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Module 4: Live scouting AI dialogue compartment */}
        <div id="ai-agent-wrapper" className="space-y-4">
          <div id="ai-agent-heading" className="flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-orange-500" />
            <div>
              <h3 className="text-lg font-extrabold text-white font-sans uppercase tracking-[0.03em]">{t.aiTitle}</h3>
              <p className="text-xs text-zinc-550 font-mono tracking-wider mt-0.5">{t.aiSubtitle}</p>
            </div>
          </div>
          <ScoutAI lang={lang} />
        </div>

        {/* Footer info strip */}
        <div id="landing-footer" className="pt-12 pb-6 border-t border-zinc-900/80 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t.footerCopy}</p>
            <p className="text-[11px] text-zinc-650 font-mono">{t.footerSub}</p>
          </div>

          {/* Social connections directory */}
          <div id="footer-connections" className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold font-mono text-zinc-400">
            <a href="mailto:kostasnook@gmail.com" className="hover:text-orange-500 transition-colors">EMAIL</a>
            <span className="text-zinc-800">•</span>
            <a href={data.links.faceit} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors font-mono">FACEIT</a>
            <span className="text-zinc-800">•</span>
            <a href={data.links.steam} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors font-mono font-mono">STEAM</a>
            <span className="text-zinc-800">•</span>
            <span className="text-zinc-500">DISCORD: NxStep</span>
          </div>
        </div>

      </div>
    </div>
  );
}
