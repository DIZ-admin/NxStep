import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
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

  // Pull latest FaceitStats from Firestore on mount so we never show fake stats
  useEffect(() => {
    const loadFromFirestore = async () => {
      try {
        const { getDoc, doc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        const docRef = doc(db, "faceitStats", "NxStep");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetched = docSnap.data();
          if (fetched) {
            console.log("[PortfolioProvider] Safely synchronized official Faceit stats on mount");
            setLocalData((prev) => {
              const cleanedStats = Object.fromEntries(
                Object.entries(fetched.stats || {}).filter(([_, v]) => v !== null && v !== undefined && v !== 0)
              );
              const merged = {
                ...prev,
                avatarUrl: fetched.avatarUrl || prev.avatarUrl,
                coverImageUrl: fetched.coverImageUrl || prev.coverImageUrl,
                segments: fetched.segments || prev.segments || [],
                stats: {
                  ...prev.stats,
                  ...cleanedStats
                }
              };
              localStorage.setItem("nxstep_portfolio_data_v2", JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (e) {
        console.warn("[PortfolioProvider] Could not load initial Faceit stats from Firestore, using offline cache:", e);
      }
    };

    loadFromFirestore();
  }, []);

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

    // Map segments dynamically to maps configuration to show authentic win rates and match counts
    const segments = localData.segments || [];
    const updatedMaps = base.maps.map((m) => {
      const segment = segments.find((seg: any) => {
        const label = (seg.label || "").toLowerCase();
        return label === `de_${m.name.toLowerCase()}` || label === m.name.toLowerCase();
      });

      if (!segment || !segment.stats) return m;

      const s = segment.stats;
      const defaultStats = m.stats || { kd: 1.0, adr: 80, rating: 1.0, matches: 0 };
      const matchesCount = parseInt(s.Matches || s.m || "0", 10) || m.matches || 0;
      const winRate = parseInt(s["Win Rate %"] || s["Win Rate"] || s.k6 || "0", 10) || m.winrate || 0;
      const kd = parseFloat(s["K/D Ratio"] || s["K/D"] || s.k5 || "0") || defaultStats.kd;
      
      const hltvRatingStr = s["HLTV Rating"] || s["Rating"] || s.k2;
      const rating = hltvRatingStr ? parseFloat(hltvRatingStr) : parseFloat((kd * 0.95 + 0.1).toFixed(2));

      let status = m.status;
      if (winRate >= 58) {
        status = lang === "uk" ? "Сильна" : "Strong";
      } else if (winRate >= 52) {
        status = lang === "uk" ? "Комфортна" : "Comfortable";
      } else {
        status = lang === "uk" ? "Специфічна" : "Pocket Meta";
      }

      return {
        ...m,
        status,
        winrate: winRate,
        matches: matchesCount,
        stats: {
          kd,
          adr: defaultStats.adr,
          rating,
          matches: matchesCount
        }
      };
    });

    return {
      ...base,
      ...localData, // merge any other top level updates (avatarUrl, coverImageUrl, segments, etc.)
      maps: updatedMaps,
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
