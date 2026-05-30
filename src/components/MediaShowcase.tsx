import React, { useState } from "react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";
import { Film, PlayCircle, ExternalLink, Copy, Check, Tv, Database, MoveHorizontal } from "lucide-react";

export function MediaShowcase({ data, lang = "en" }: { data: PortfolioData; lang?: Language }) {
  const t = translations[lang];
  const media = data.media;
  const [activeMediaTab, setActiveMediaTab ] = useState<"highlights" | "vods" | "demos">("highlights");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activeCollection =
    activeMediaTab === "highlights" ? media.highlights : activeMediaTab === "vods" ? media.vods : media.demos;

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <section aria-labelledby="media-title" id="media-showcase-container" className="w-full flex flex-col gap-6 text-left">
      {/* Header section */}
      <header className="flex flex-col gap-4">
        <div id="media-header" className="flex items-start justify-between relative">
          <div>
            <h2 id="media-title" className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-orange-500" />
              {t.mediaHeading}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              {t.mediaSub}
            </p>
          </div>
          <div className="md:hidden flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-2">
            <MoveHorizontal className="w-3 h-3" /> Swipe
          </div>
        </div>

        {/* Media Category Buttons */}
        <nav aria-label="Media Categories" id="media-tabs" className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto no-scrollbar max-w-full snap-x snap-mandatory">
          <button
            id="media-tab-highlights"
            onClick={() => setActiveMediaTab("highlights")}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-md uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap min-h-[40px] snap-start ${
              activeMediaTab === "highlights"
                ? "bg-orange-500 text-black shadow-md font-extrabold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            {t.clipsTab}
          </button>
          <button
            id="media-tab-vods"
            onClick={() => setActiveMediaTab("vods")}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-md uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap min-h-[40px] snap-start ${
              activeMediaTab === "vods"
                ? "bg-orange-500 text-black shadow-md font-extrabold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Tv className="w-4 h-4" />
            {t.fullMatchTab}
          </button>
          <button
            id="media-tab-demos"
            onClick={() => setActiveMediaTab("demos")}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-md uppercase tracking-wider transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap min-h-[40px] snap-start ${
              activeMediaTab === "demos"
                ? "bg-orange-500 text-black shadow-md font-extrabold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Database className="w-4 h-4" />
            {t.povDemosTab}
          </button>
        </nav>
      </header>

      {/* Grid of Active Media items */}
      <div role="list" id="media-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {activeCollection.map((item, idx) => {
          return (
            <article
              key={item.title + idx}
              role="listitem"
              id={`media-card-${idx}`}
              className="bg-zinc-950/45 border border-zinc-800/80 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-zinc-700/80 transition-all group"
            >
              {/* Media Card Graphic placeholder */}
              <div id="media-card-gfx" className="relative h-40 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
                {/* Overlay shadow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90 z-10" />

                <PlayCircle className="w-12 h-12 text-orange-500/35 group-hover:text-orange-500 group-hover:scale-110 transition-all relative z-20" />

                {/* Grid backdrop */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-5 pointer-events-none">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="border border-white" />
                  ))}
                </div>

                {/* Subtitle labels */}
                <span className="absolute top-3 left-3 text-[9px] font-mono font-black tracking-widest px-1.5 py-0.5 rounded bg-zinc-950/80 border border-zinc-900 text-zinc-500 uppercase flex items-center gap-1 select-none font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  DE_RECORD
                </span>

                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-900/40 relative z-20 font-mono">
                  {activeMediaTab === "highlights" 
                    ? t.youtubeClip 
                    : activeMediaTab === "vods" 
                      ? t.matchVOD 
                      : t.leetifyMatch}
                </span>
              </div>

              {/* Media specifications */}
              <div id="media-card-specs" className="mt-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-orange-400 transition-colors font-sans">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wide font-mono">
                    {t.linkSource} {item.url}
                  </p>
                </div>

                {/* Row level interactions */}
                <div id="media-action-row" className="mt-4 flex items-center gap-2 border-t border-zinc-900 pt-3">
                  <a
                    id={`media-ext-link-${idx}`}
                    href={item.url}
                    aria-label={`View ${item.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-350 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors font-sans"
                  >
                    {t.viewStream}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    id={`media-copy-btn-${idx}`}
                    aria-label={`Copy link for ${item.title}`}
                    onClick={() => handleCopyLink(item.url, idx)}
                    className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    title="Copy demo link"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 px-0.5 font-sans">
                          {t.copiedLink}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
