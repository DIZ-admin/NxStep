import React, { useState, Suspense, lazy } from "react";
import { Eye, MoveHorizontal, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";

// Lazy-load complex tab components to optimize initial bundle size
const StatsDashboard = lazy(() => import("./StatsDashboard").then(m => ({ default: m.StatsDashboard })));
const MapsAndPositions = lazy(() => import("./MapsAndPositions").then(m => ({ default: m.MapsAndPositions })));
const ExperienceTimeline = lazy(() => import("./ExperienceTimeline").then(m => ({ default: m.ExperienceTimeline })));
const MediaShowcase = lazy(() => import("./MediaShowcase").then(m => ({ default: m.MediaShowcase })));

interface TabHubProps {
  data: PortfolioData;
  lang: Language;
  onUpdateData: (newData: PortfolioData) => void;
}

export function TabHub({ data, lang, onUpdateData }: TabHubProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"stats" | "maps" | "exp" | "media">("stats");

  return (
    <section id="ops-tab-hub" aria-label="Portfolio Details" className="w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[32px] shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] p-4 sm:p-8 space-y-6 relative overflow-hidden">
      
      {/* Navigation Hub Strip */}
      <div className="md:hidden w-full flex justify-end items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-widest uppercase -mt-2 mb-2 pr-2">
        <MoveHorizontal className="w-3 h-3" /> Swipe
      </div>
      <div id="hub-actions-strip" className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <nav aria-label="Portfolio Tabs" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-pl-4">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] snap-start ${
              activeTab === "stats"
                ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            {t.tabCombatStats}
          </button>
          <button
            onClick={() => setActiveTab("maps")}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] snap-start ${
              activeTab === "maps"
                ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            {t.tabMapPool} ({data.maps.length})
          </button>
          <button
            onClick={() => setActiveTab("exp")}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] snap-start ${
              activeTab === "exp"
                ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            {t.tabTrials}
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all font-mono uppercase flex-shrink-0 whitespace-nowrap min-h-[44px] snap-start ${
              activeTab === "media"
                ? "bg-orange-500 text-black shadow-md shadow-orange-500/10 font-black"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            {t.tabMedia}
          </button>
        </nav>

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
            className="w-full h-full"
          >
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
                <span className="font-mono text-xs uppercase tracking-widest">{t.aiSubtitle || "Loading component..."}</span>
              </div>
            }>
              {activeTab === "stats" && <StatsDashboard data={data} onUpdateData={onUpdateData as any} lang={lang} />}
              {activeTab === "maps" && <MapsAndPositions data={data} lang={lang} />}
              {activeTab === "exp" && <ExperienceTimeline data={data} lang={lang} />}
              {activeTab === "media" && <MediaShowcase data={data} lang={lang} />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
