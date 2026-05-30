import { memo } from "react";
import { PortfolioData } from "../../types";
import { Award, Zap, Crosshair, Sparkles, TrendingUp } from "lucide-react";

interface StatCardsProps {
  stats: PortfolioData["stats"];
  t: any;
}

export const StatCards = memo(function StatCards({ stats: s, t }: StatCardsProps) {
  const displayElo = s.currentElo || s.peakElo || "—";
  const showPeakElo = s.currentElo && s.peakElo && s.currentElo !== s.peakElo;

  const displayRating = s.currentRating || s.faceitRating || "—";
  const showPeakRating = s.currentRating && s.faceitRating && s.currentRating !== s.faceitRating;

  const displayAdr = s.currentAdr || s.adr || "—";
  const showPeakAdr = s.currentAdr && s.adr && s.currentAdr !== s.adr;

  const displayHs = s.currentHs || s.hsRange || "—";
  const showPeakHs = s.currentHs && s.hsRange && s.currentHs !== s.hsRange;

  const displayAvgKills = s.currentAvgKills || s.avgKills || "—";

  return (
    <div id="stats-summary-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: ELO Peak */}
      <div id="card-elo" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-5 sm:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-orange-500/10 group-hover:text-orange-500/20 transition-all">
          <TrendingUp className="w-12 h-12" />
        </div>
        <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-400 uppercase leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">{t.rateLimit}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-none">
            {displayElo}
          </h3>
          {showPeakElo && (
            <div className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-wider">
              / {s.peakElo} PEAK
            </div>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-emerald-400 font-medium mt-3 flex items-start gap-1.5 leading-tight">
          {s.peakRank && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1 flex-shrink-0" />
              <span>{s.peakRank}</span>
            </>
          )}
        </p>
        <div className="mt-5 bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-orange-500 h-full rounded-full" style={{ width: "95%" }} />
        </div>
      </div>

      {/* Card 2: Rating */}
      <div id="card-rating" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-5 sm:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-amber-500/10 group-hover:text-amber-500/20 transition-all">
          <Award className="w-12 h-12" />
        </div>
        <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-400 uppercase leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">{t.overallRating}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-none">
            {displayRating}
          </h3>
          {showPeakRating && (
            <div className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-wider">
              / {s.faceitRating} PEAK
            </div>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-orange-400 font-medium mt-3 flex items-start gap-1.5 leading-tight">
          <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0 mt-0.5" />
          <span>{t.carryQuality}</span>
        </p>
        <div className="mt-5 bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }} />
        </div>
      </div>

      {/* Card 3: ADR */}
      <div id="card-adr" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-5 sm:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-red-500/10 group-hover:text-red-500/20 transition-all">
          <Crosshair className="w-12 h-12" />
        </div>
        <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-400 uppercase leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">{t.dmgRound}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-none flex items-baseline gap-1">
            {displayAdr} <span className="text-xs sm:text-sm text-zinc-400 font-normal">ADR</span>
          </h3>
          {showPeakAdr && (
            <div className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-wider">
              / {s.adr} PEAK
            </div>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-3 leading-tight">
          {t.avgKills} <span className="text-zinc-200">{displayAvgKills} {t.perMatch}</span>
        </p>
        <div className="mt-5 bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-red-500 h-full rounded-full" style={{ width: "92%" }} />
        </div>
      </div>

      {/* Card 4: Headshot % */}
      <div id="card-headshot" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-5 sm:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-cyan-500/10 group-hover:text-cyan-500/20 transition-all">
          <Sparkles className="w-12 h-12" />
        </div>
        <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-400 uppercase leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">{t.laserMech}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-none">
            {displayHs}
          </h3>
          {showPeakHs && (
            <div className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-wider">
              / {s.hsRange} PEAK
            </div>
          )}
        </div>
        <p className="text-[10px] sm:text-xs text-cyan-400 font-medium mt-3 leading-tight">
          {t.consistency} {s.consistencyRange || "N/A"}
        </p>
        <div className="mt-5 bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-full rounded-full" style={{ width: "90%" }} />
        </div>
      </div>
    </div>
  );
});
