import React from "react";
import { Activity, ShieldCheck } from "lucide-react";
import { translations, Language } from "../translations";

export function TopBar({ lang, setLang }: { lang: Language; setLang: (lang: Language) => void }) {
  const t = translations[lang];
  return (
    <nav id="top-teal-bar" aria-label="System status and language selection" className="w-full bg-zinc-900 border-b border-zinc-800/60 px-4 py-2 sm:px-6 md:px-8 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 select-none">
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
            aria-label="Switch language to English"
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
            aria-label="Switch language to Ukrainian"
            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
              lang === "uk" ? "bg-orange-500 text-black font-black shadow-sm" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            UA
          </button>
        </div>
      </div>
    </nav>
  );
}
