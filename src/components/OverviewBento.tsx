import React from "react";
import { ShieldCheck, Terminal, Sparkles, Crosshair, MessageSquare, Zap } from "lucide-react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";

export function OverviewBento({ data, lang }: { data: PortfolioData; lang: Language }) {
  const t = translations[lang];

  return (
    <div id="bento-overview-container" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Quick Profile Bio Card (Left) */}
      <div id="bento-intro" className="lg:col-span-7 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 relative overflow-hidden shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] text-left">
        <div className="space-y-4 relative z-10 text-left">
          <h2 className="text-[10px] font-medium tracking-widest text-zinc-400 uppercase flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            {t.narativeTitle}
          </h2>
          <div className="space-y-5">
            {data.overview.map((paragraph, index) => (
              <p key={index} id={`bio-paragraph-${index}`} className="text-sm md:text-[15px] font-medium text-zinc-300 leading-relaxed tracking-tight">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Achievements highlights list */}
        <div id="achievements-strip" className="flex flex-wrap gap-2.5 pt-6 border-t border-white/5 relative z-10">
          {data.achievements.map((ach, idx) => (
            <div key={idx} id={`badge-${idx}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-[11px] font-medium tracking-tight text-zinc-300">{ach}</span>
            </div>
          ))}
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-[-10%] top-[-10%] w-64 h-64 rounded-full bg-orange-500/10 filter blur-[80px] pointer-events-none" />
      </div>

      {/* Key Strengths Dashboard (Right) */}
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
  );
}
