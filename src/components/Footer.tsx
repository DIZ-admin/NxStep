import React from "react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";

export function Footer({ data, lang }: { data: PortfolioData; lang: Language }) {
  const t = translations[lang];
  return (
    <div id="landing-footer" className="pt-12 pb-6 border-t border-zinc-900/80 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left space-y-1">
        <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t.footerCopy}</p>
        <p className="text-[11px] text-zinc-650 font-mono">{t.footerSub}</p>
      </div>

      {/* Social connections directory */}
      <div id="footer-connections" className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold font-mono text-zinc-400">
        <a href="mailto:kostasnook@gmail.com" className="hover:text-orange-500 transition-colors uppercase">Email</a>
        <span className="text-zinc-800">•</span>
        <a href={data.links.faceit} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors uppercase font-mono">Faceit</a>
        <span className="text-zinc-800">•</span>
        <a href={data.links.steam} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors uppercase font-mono">Steam</a>
        <span className="text-zinc-800">•</span>
        <span className="text-zinc-500 uppercase">Discord: NxStep</span>
      </div>
    </div>
  );
}
