import React, { useState } from "react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";
import { Landmark, AlertTriangle, Crosshair, HelpCircle, Swords, Map, MoveHorizontal } from "lucide-react";

export function MapsAndPositions({ data, lang = "en" }: { data: PortfolioData; lang?: Language }) {
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const mapDataList = data.maps;
  const currentMap = mapDataList[selectedMapIndex];
  const t = translations[lang];

  return (
    <section id="maps-positions-container" aria-labelledby="maps-title" className="w-full flex flex-col gap-6 text-left">
      {/* Heading */}
      <header className="flex items-start justify-between relative">
        <div>
          <h2 id="maps-title" className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-orange-500" />
            {t.mapsPoolRotational}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {t.mapsEliteTier}
          </p>
        </div>
        <div className="lg:hidden flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-2">
          <MoveHorizontal className="w-3 h-3" /> Swipe
        </div>
      </header>

      {/* Grid: Map Button Picker & Active Map Detail */}
      <div id="maps-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Grid Selectors (Left side) */}
        <nav aria-label="Map selections" id="map-selectors-col" className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-3 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar w-full snap-x snap-mandatory scroll-pl-4">
          {mapDataList.map((mapItem, idx) => (
            <button
              key={mapItem.name}
              id={`map-select-btn-${idx}`}
              onClick={() => setSelectedMapIndex(idx)}
              className={`p-4 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group hover:scale-[1.03] flex flex-col justify-between flex-shrink-0 w-[200px] sm:w-[240px] lg:w-full min-h-[110px] min-w-0 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] snap-start ${
                idx === selectedMapIndex
                  ? "bg-zinc-900/60 backdrop-blur-md border-white/10 text-white shadow-lg ring-1 ring-white/10"
                  : "bg-white/5 hover:bg-white/10 border-white/5 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className={`absolute inset-0 bg-orange-500/10 blur-xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 ${idx === selectedMapIndex ? "opacity-30" : ""}`} />
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-2">
                  <Landmark className={`w-4 h-4 ${idx === selectedMapIndex ? "text-orange-400" : "text-zinc-500"}`} />
                  <p className="text-sm font-bold tracking-tight">{mapItem.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-medium tracking-widest uppercase ${idx === selectedMapIndex ? "text-orange-400" : "text-zinc-500"}`}>
                    {mapItem.status}
                  </p>
                </div>
              </div>

              {/* Status Win Rate Banner */}
              <div className="flex items-end justify-between mt-4">
                <div>
                  <p className="text-2xl font-medium tracking-tight text-white">
                    {mapItem.winrate}%
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                    {t.winRate}
                  </p>
                </div>
                {mapItem.matches && (
                  <div className="text-right">
                    <p className="text-lg font-medium text-white">{mapItem.matches}</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                      {t.matchesItem}
                    </p>
                  </div>
                )}
              </div>

              {/* Background ambient light */}
              <div
                className={`absolute inset-x-0 bottom-0 top-1/2 blur-2xl transition-all duration-300 ${
                  idx === selectedMapIndex ? "opacity-20" : "opacity-10 group-hover:opacity-30"
                }`}
                style={{ backgroundColor: mapItem.accentColor }}
              />
            </button>
          ))}
        </nav>

        {/* Detailed Map Visualizer & Tactical Description (Right side) */}
        <article id="map-detail-panel" className="lg:col-span-8 flex flex-col h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)] rounded-[32px] overflow-hidden">
          {/* Header representation of Map banner */}
          <div id="map-detail-banner" className="h-44 sm:h-56 relative overflow-hidden shrink-0">
            <img
              src={currentMap.imageUrl}
              alt={currentMap.name}
              className="w-full h-full object-cover grayscale opacity-[0.25] scale-105 hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Spotlight Accent Color */}
            <div
              className="absolute inset-0 opacity-[0.12] mix-blend-color"
              style={{ backgroundColor: currentMap.accentColor }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

            {/* Float values inside banner */}
            <div id="map-banner-header" className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-medium tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400">
                  {currentMap.status} {t.tierItem}
                </span>
                <h3 className="text-3xl sm:text-4xl font-medium text-white tracking-tight mt-3">
                  de_{currentMap.name.toLowerCase()}
                </h3>
              </div>
              <div className="text-right flex items-center justify-end gap-6">
                <div>
                  <span className="text-3xl sm:text-4xl font-medium text-white shadow-lg">
                    {currentMap.winrate}%
                  </span>
                  <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">
                    {t.winMargin}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Blueprint Tactical Lane Breakdown & Stats */}
          <div id="map-blueprint-wrapper" className="p-6 md:p-8 flex-1 flex flex-col gap-6">
            
            {/* Optional Stats Block */}
            {currentMap.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500">K/D Ratio</span>
                  <span className="text-2xl font-bold tracking-tight text-white">{currentMap.stats.kd}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500">ADR</span>
                  <span className="text-2xl font-bold tracking-tight text-white">{currentMap.stats.adr}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500">HLTV Rating</span>
                  <span className="text-2xl font-bold tracking-tight text-white">{currentMap.stats.rating}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-medium text-zinc-500">{t.matchesItem || "Matches"}</span>
                  <span className="text-2xl font-bold tracking-tight text-white">{currentMap.stats.matches}</span>
                </div>
              </div>
            )}

            <div id="blueprint-positions-left" className="space-y-4">
              <h4 className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-white/5 pb-3">
                <Swords className="w-3.5 h-3.5 text-zinc-500" />
                {t.primaryPlacements}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMap.positions.map((pos, pIdx) => (
                  <div
                    key={pos.name}
                    id={`position-card-${pIdx}`}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white tracking-tight">{pos.name}</span>
                      <span className={`text-[10px] font-medium tracking-tight px-2 py-1 rounded-full ${
                        pos.difficulty.toLowerCase().includes("high") || pos.difficulty.toLowerCase().includes("висок")
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {t.difficultyStr} {
                          pos.difficulty.toLowerCase().includes("high") || pos.difficulty.toLowerCase().includes("висок")
                            ? t.diffHigh
                            : t.diffMedium
                        }
                      </span>
                    </div>

                    <div className="text-xs flex items-center gap-1.5">
                      <span className="text-zinc-500 uppercase text-[10px] font-medium tracking-widest">
                        {t.roleTactical}
                      </span>
                      <span className="text-orange-400 text-[11px] font-semibold bg-orange-400/10 px-2.5 py-0.5 rounded-full">
                        {pos.role}
                      </span>
                    </div>

                    <p className="text-[12px] text-zinc-300 leading-relaxed font-medium">
                      {pos.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
