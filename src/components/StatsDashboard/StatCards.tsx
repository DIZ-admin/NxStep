import { memo } from "react";
import { PortfolioData } from "../../types";
import { Award, Zap, Crosshair, Sparkles, TrendingUp } from "lucide-react";

interface StatCardsProps {
  stats: PortfolioData["stats"];
  t: any;
}

export const StatCards = memo(function StatCards({ stats: s, t }: StatCardsProps) {
  return (
    <div id="stats-summary-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: ELO Peak */}
      <div id="card-elo" className="bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-orange-500/10 group-hover:text-orange-500/20 transition-all">
          <TrendingUp className="w-12 h-12" />
        </div>
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">{t.rateLimit}</p>
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
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">{t.overallRating}</p>
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
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">{t.dmgRound}</p>
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
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">{t.laserMech}</p>
        <h3 className="text-[32px] font-medium tracking-tight text-white mt-1">{s.hsRange}</h3>
        <p className="text-xs text-cyan-400 font-medium mt-1">
          {t.consistency} {s.consistencyRange}
        </p>
        <div className="mt-5 bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-full rounded-full" style={{ width: "90%" }} />
        </div>
      </div>
    </div>
  );
});
