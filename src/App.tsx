import { useEffect } from "react";
import { Header } from "./components/Header";
import { TopBar } from "./components/TopBar";
import { OverviewBento } from "./components/OverviewBento";
import { TabHub } from "./components/TabHub";
import { ScoutAI } from "./components/ScoutAI";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { motion } from "motion/react";
import { useLanguage } from "./contexts/LanguageContext";

export default function App() {
  const { t } = useLanguage();

  // Ensure the page always starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="portfolio-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-black pb-16">
      <TopBar />

      <motion.main
        id="main-content-layout"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6"
      >
        <ErrorBoundary>
          {/* Module 1: Header */}
          <Header />

          {/* Module 2: Overviews & Strengths Bento Section */}
          <OverviewBento />

          {/* Module 3: Central Operations Tab Hub */}
          <TabHub />

          {/* Module 4: Live scouting AI dialogue compartment */}
          <div id="ai-agent-wrapper" className="space-y-4">
            <div id="ai-agent-heading" className="flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-orange-500" />
              <div>
                <h3 className="text-lg font-extrabold text-white font-sans uppercase tracking-[0.03em]">{t.aiTitle}</h3>
                <p className="text-xs text-zinc-550 font-mono tracking-wider mt-0.5">{t.aiSubtitle}</p>
              </div>
            </div>
            <ScoutAI />
          </div>
        </ErrorBoundary>

        {/* Footer info strip */}
        <Footer />
      </motion.main>
    </div>
  );
}
