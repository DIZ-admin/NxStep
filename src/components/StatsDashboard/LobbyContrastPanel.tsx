import { memo, useMemo } from "react";
import { ShieldAlert, TrendingUp } from "lucide-react";

interface LobbyContrastPanelProps {
  stats: any;
  t: any;
}

export const LobbyContrastPanel = memo(function LobbyContrastPanel({ stats: s, t }: LobbyContrastPanelProps) {
  const comparisons = useMemo(() => {
    const r = s.currentRating ?? s.faceitRating ?? 1.27;
    return [
      { label: t.ratingLabel, player: r, average: 1.05, desc: t.ratingDesc, suffix: "" },
      { label: t.adrLabel, player: s.currentAdr ?? s.adr ?? 92.0, average: 78.5, desc: t.adrDesc, suffix: "" },
      { label: t.kdRatioLabel, player: parseFloat((r - 0.08).toFixed(2)) || 1.19, average: 1.04, desc: t.kdRatioDesc, suffix: "" },
      { label: t.hsRateLabel, player: parseFloat(s.currentHs?.replace('%', '') ?? s.hsRange?.split('%')[0] ?? "65.0"), average: 50.2, desc: t.hsRateDesc, suffix: "%" },
      { label: t.kprLabel, player: s.kr ?? 0.86, average: 0.71, desc: t.kprDesc, suffix: "" },
      { label: t.consistencyLabel, player: parseFloat(s.consistencyRange?.split('%')[0] ?? "84.0"), average: 65.0, desc: t.consistencyDesc, suffix: "%" },
    ];
  }, [t, s]);

  return (
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
  );
});
