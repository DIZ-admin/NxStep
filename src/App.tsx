import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { TopBar } from "./components/TopBar";
import { OverviewBento } from "./components/OverviewBento";
import { TabHub } from "./components/TabHub";
import { ScoutAI } from "./components/ScoutAI";
import { Footer } from "./components/Footer";
import { nxstepPortfolioData, nxstepPortfolioDataUK } from "./data";
import { translations, Language } from "./translations";

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

  return (
    <div id="portfolio-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-black pb-16">
      <TopBar lang={lang} setLang={setLang} />

      <div id="main-content-layout" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Module 1: Header */}
        <Header data={activePortfolioData} lang={lang} />

        {/* Module 2: Overviews & Strengths Bento Section */}
        <OverviewBento data={activePortfolioData} lang={lang} />

        {/* Module 3: Central Operations Tab Hub */}
        <TabHub data={activePortfolioData} lang={lang} onUpdateData={handleUpdateData} />

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
        <Footer data={activePortfolioData} lang={lang} />
      </div>
    </div>
  );
}
