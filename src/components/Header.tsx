import React from "react";
import { PortfolioData } from "../types";
import { translations, Language } from "../translations";
import { Globe, Shield, Calendar, Monitor, Link, Mail, MessageSquare, Award } from "lucide-react";

export function Header({ data, lang = "en" }: { data: PortfolioData; lang?: Language }) {
  const t = translations[lang];

  return (
    <div id="header-container" className="relative w-full rounded-[32px] overflow-hidden border border-white/5 bg-zinc-900/40 backdrop-blur-md shadow-[inset_0_1px_0px_rgba(255,255,255,0.05)]">
      {/* Background Banner */}
      <div id="header-banner" className="h-44 sm:h-56 md:h-64 relative w-full overflow-hidden">
        <img
          src={data.coverImageUrl || "/src/assets/images/nxstep_esports_banner_1780012674655.png"}
          alt="CS2 Esports Banner"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div id="banner-overlay" className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      {/* Main Profile Info Section */}
      <div id="profile-info-section" className="relative px-6 pb-6 pt-0 -mt-16 sm:-mt-20 md:px-8 md:pb-8 flex flex-col md:flex-row md:items-end md:gap-6">
        {/* Avatar Wrapper */}
        <div id="avatar-wrapper" className="relative group mx-auto md:mx-0">
          <div className="absolute inset-x-0 bottom-0 top-0 bg-orange-500/10 rounded-3xl blur-md scale-105" />
          <img
            src={data.avatarUrl || "/src/assets/images/nxstep_esports_avatar_1780012695878.png"}
            alt="NxStep Agent Avatar"
            className="relative w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-3xl border-2 border-orange-500/60 bg-zinc-900 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-2 right-2 bg-emerald-500 text-black text-xs font-bold leading-none px-2 py-1 rounded-full border border-zinc-900 flex items-center gap-1 shadow-md">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            LFG
          </span>
        </div>

        {/* Identity Texts */}
        <div id="profile-text-wrapper" className="mt-4 md:mt-0 flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
            <h1 id="player-title" className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
              {data.name}
              <span className="text-sm font-mono tracking-wider text-orange-500 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded uppercase">
                Challenger
              </span>
            </h1>
          </div>
          <p id="player-role-tagline" className="text-zinc-400 font-medium text-base mt-1.5 font-mono">
            {data.tagline}
          </p>

          {/* Quick Demographics */}
          <div id="demographics-grid" className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/5 border border-white/5">
              <Globe className="w-4.5 h-4.5 text-zinc-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">{t.region}</p>
                <p className="text-sm font-semibold text-zinc-200">{data.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/5 border border-white/5">
              <Calendar className="w-4.5 h-4.5 text-zinc-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">{t.age}</p>
                <p className="text-sm font-semibold text-zinc-200">{data.age} {t.ageVal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
              <Shield className="w-4.5 h-4.5 text-zinc-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">{t.type}</p>
                <p className="text-sm font-semibold text-zinc-200">{t.typeVal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fast Actions */}
        <div id="header-contact-actions" className="mt-6 md:mt-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            id="btn-contact-email"
            href={`mailto:${data.links.email}`}
            className="w-full sm:w-auto px-5 py-3 text-center text-sm font-bold text-black bg-orange-500 hover:bg-orange-400 active:bg-orange-600 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Mail className="w-4 h-4" />
            {t.recruitBtn}
          </a>
          <a
            id="btn-steam-profile"
            href={data.links.steam}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 text-center text-sm font-bold text-zinc-300 bg-white/5 hover:bg-white/10 active:bg-white/5 border border-white/5 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Monitor className="w-4 h-4" />
            {t.steamBtn}
          </a>
        </div>
      </div>

      {/* Languages & Setup Mini Strip */}
      <div id="header-meta-strip" className="border-t border-zinc-900 bg-zinc-950 px-6 py-3.5 md:px-8 flex flex-col md:flex-row justify-between gap-4">
        {/* Languages spoken */}
        <div id="spoken-languages" className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-500 mr-1.5">{t.languagesLabel}</span>
          {data.languages.map((langItem, index) => (
            <span
              key={langItem}
              id={`lang-tag-${index}`}
              className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
            >
              {langItem}
            </span>
          ))}
        </div>

        {/* Transition highlight (The Laptop - Desktop Setup Climb story) */}
        <div id="setup-evolution" className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono">
          <Award className="w-4 h-4 text-orange-400 flex-shrink-0 animate-bounce" />
          <span>
            {t.evolutionText}
          </span>
        </div>
      </div>
    </div>
  );
}
