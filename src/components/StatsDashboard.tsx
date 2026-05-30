import { useState } from "react";
import { BarChart2, RefreshCw } from "lucide-react";
import { useToastContext } from "./ToastContext";
import { StatCards } from "./StatsDashboard/StatCards";
import { HistoricalAscentPanel } from "./StatsDashboard/HistoricalAscentPanel";
import { LobbyContrastPanel } from "./StatsDashboard/LobbyContrastPanel";
import { usePortfolio } from "../contexts/PortfolioContext";
import { useLanguage } from "../contexts/LanguageContext";
import { apiClient } from "../api";

export function StatsDashboard() {
  const { data, updateData: onUpdateData } = usePortfolio();
  const { t } = useLanguage();
  const s = data.stats;
  const { addToast } = useToastContext();

  const [selectedSubTheme, setSelectedSubTheme] = useState<"lobby" | "historical">("historical");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleFaceitSync = async () => {
    if (isSyncing || !onUpdateData) return;
    setIsSyncing(true);
    addToast("info", "Syncing FACEIT Data...");
    try {
      const result = await apiClient.syncFaceitStats("NxStep");
      if (result.success && result.stats) {
        const cleanedStats = Object.fromEntries(
          Object.entries(result.stats).filter(([_, v]) => v !== null && v !== undefined && v !== 0)
        );
        onUpdateData({
          ...data,
          stats: {
            ...data.stats,
            ...cleanedStats
          }
        });
        addToast("success", "FACEIT Synced", "Successfully pulled the latest data.");
      } else {
        addToast("error", "FACEIT Sync Failed", result.error || "Unable to sync data");
      }
    } catch (e: unknown) {
      console.error("Faceit Sync failed:", e);
      addToast("error", "FACEIT Sync Failed", e instanceof Error ? e.message : "Could not reach the sync server");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section id="stats-dashboard-container" aria-labelledby="stats-dashboard-heading" className="w-full flex flex-col gap-6 text-left">
      {/* Visual Title */}
      <div id="stats-main-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="stats-dashboard-heading" className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-orange-500" />
            {t.statsHeading}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">{t.statsSub}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFaceitSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync FACEIT</span>
          </button>
          {/* Mode Toggle Button */}
          <nav id="metric-toggle-group" aria-label="Metric Views" className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
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
        </nav>
        </div>
      </div>

      <StatCards stats={s} t={t} />

      {selectedSubTheme === "historical" ? (
        <HistoricalAscentPanel stats={s} t={t} />
      ) : selectedSubTheme === "lobby" ? (
        <LobbyContrastPanel stats={s} t={t} />
      ) : null}
    </section>
  );
}

