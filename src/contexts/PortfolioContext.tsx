import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
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
    const saved = localStorage.getItem("nxstep_portfolio_data_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return nxstepPortfolioData;
      }
    }
    return nxstepPortfolioData;
  });

  const handleUpdateData = useCallback((newData: PortfolioData) => {
    setLocalData(newData);
    localStorage.setItem("nxstep_portfolio_data_v2", JSON.stringify(newData));
  }, []);

  const activePortfolioData = useMemo(() => {
    const base = lang === "uk" ? nxstepPortfolioDataUK : nxstepPortfolioData;
    
    // Only apply local stats if they exist and are not null
    const safeLocalStats = Object.fromEntries(
      Object.entries(localData.stats || {}).filter(([_, v]) => v !== null && v !== undefined)
    );

    return {
      ...base,
      ...localData, // merge any other top level updates
      stats: {
        ...base.stats,
        ...safeLocalStats
      }
    };
  }, [lang, localData]);

  const providerValue = useMemo(() => ({ data: activePortfolioData, updateData: handleUpdateData }), [activePortfolioData, handleUpdateData]);

  return (
    <PortfolioContext.Provider value={providerValue}>
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
