import React, { useState } from "react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";
import { Shield, Users, Trophy, Award, Search, ArrowUpRight } from "lucide-react";

export function ExperienceTimeline({ data, lang = "en" }: { data: PortfolioData; lang?: Language }) {
  const t = translations[lang];
  const experiences = data.experience;
  const [filter, setFilter] = useState<"all" | "team" | "trial" | "league">("all");

  const filtered = filter === "all" ? experiences : experiences.filter(e => e.type === filter);

  return (
    <div id="experience-container" className="w-full flex flex-col gap-6 text-left">
      {/* Title */}
      <div id="experience-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 id="experience-heading" className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            {t.expHeading}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {t.expSub}
          </p>
        </div>

        {/* Filter Badges */}
        <div id="experience-filters" className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          {(["all", "team", "trial", "league"] as const).map((type) => (
            <button
              key={type}
              id={`filter-btn-${type}`}
              onClick={() => setFilter(type)}
              className={`px-3.5 py-2 text-xs font-bold rounded-md uppercase tracking-wider transition-all min-h-[38px] flex items-center justify-center ${
                filter === type
                  ? "bg-orange-500 text-black shadow-md font-extrabold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {type === "all" 
                ? t.showAll 
                : type === "team" 
                  ? t.mixedTeams 
                  : type === "trial" 
                    ? t.trials 
                    : t.leagues}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div id="experience-grid-display" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, index) => {
          return (
            <div
              key={item.name + index}
              id={`experience-item-${index}`}
              className="bg-zinc-950/45 border border-zinc-800/80 hover:border-zinc-700/85 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3 relative z-10">
                {/* Visual Label indicators */}
                <div className="flex items-center justify-between">
                  {item.type === "trial" ? (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Search className="w-3 h-3" />
                      {t.rosterTrial}
                    </span>
                  ) : item.type === "league" ? (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {t.leagueTier}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {t.mixedTeam}
                    </span>
                  )}

                  {/* periodOrScore or Record */}
                  {item.periodOrScore && (
                    <span className="text-xs font-mono font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded font-mono">
                      {item.periodOrScore}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5 font-sans">
                    {item.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-orange-400" />
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {t.roleLabel}<span className="text-zinc-200 font-bold">{item.roleOrResult}</span>
                  </p>
                </div>

                {/* Details */}
                {item.details && (
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-1">
                    {item.details}
                  </p>
                )}
              </div>

              {/* Light corner ambient glow on hover */}
              <div
                className="absolute -right-12 -bottom-12 w-24 h-24 rounded-full filter blur-xl opacity-0 group-hover:opacity-15 transition-all duration-500 pointer-events-none"
                style={{
                  backgroundColor: item.type === "trial" ? "#c084fc" : item.type === "league" ? "#fb923c" : "#22d3ee",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Recruitment Status Notice Card */}
      <div id="recruitment-status-notice" className="p-5 rounded-xl border border-dashed border-orange-500/30 bg-orange-500/5 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-extrabold text-white flex items-center gap-1.5 font-sans">
            <Award className="w-4.5 h-4.5 text-orange-400" />
            {t.recruitmentStatus}
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-xl">
            {t.recruitmentStatusDesc}
          </p>
        </div>

        <a
          id="btn-recruit-notice-link"
          href="mailto:kostasnook@gmail.com"
          className="px-5 py-2 hover:bg-orange-500 hover:text-black border border-orange-400/50 hover:border-orange-500 text-orange-400 text-xs font-black font-mono tracking-wider rounded-lg uppercase transition-all whitespace-nowrap"
        >
          {t.sendRequest}
        </a>
      </div>
    </div>
  );
}
