import React, { createContext, useContext, useState, useMemo } from "react";
import { PortfolioData } from "../types";
import { nxstepPortfolioData, nxstepPortfolioDataUK } from "../data";
import { useLanguage } from "./LanguageContext";

interface PortfolioContextType {
  data: PortfolioData; // the active combined data
  updateData: (newData: PortfolioData) => void; 
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();

  const [localData, setLocalData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem("nxstep_portfolio_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return nxstepPortfolioData;
      }
    }
    return nxstepPortfolioData;
  });

  const handleUpdateData = (newData: PortfolioData) => {
    setLocalData(newData);
    localStorage.setItem("nxstep_portfolio_data", JSON.stringify(newData));
  };

  const activePortfolioData = useMemo(() => {
    const base = lang === "uk" ? nxstepPortfolioDataUK : nxstepPortfolioData;
    return {
      ...base,
      stats: {
        ...base.stats,
        peakElo: localData.stats.peakElo,
        faceitRating: localData.stats.faceitRating,
        avgLobbyElo: localData.stats.avgLobbyElo,
        adr: localData.stats.adr,
        kr: localData.stats.kr,
        avgKills: localData.stats.avgKills,
        matchesPlayed: localData.stats.matchesPlayed,
        recentForm: localData.stats.recentForm,
      }
    };
  }, [lang, localData]);

  return (
    <PortfolioContext.Provider value={{ data: activePortfolioData, updateData: handleUpdateData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
