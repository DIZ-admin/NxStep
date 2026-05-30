import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { PortfolioData } from "../types";
import { nxstepPortfolioData, nxstepPortfolioDataUK } from "../data";
import { useLanguage } from "./LanguageContext";

interface PortfolioContextType {
  data: PortfolioData; // the active combined data
  updateData: (newData: PortfolioData) => void; 
  reloadFromFirebase: () => Promise<void>;
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

  const [firebaseMatches, setFirebaseMatches] = useState<any[]>([]);

  const reloadFromFirebase = useCallback(async () => {
    try {
      const { getDoc, getDocs, doc, collection, query } = await import("firebase/firestore");
      const { db } = await import("../firebase");
      
      const docRef = doc(db, "faceitStats", "NxStep");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetched = docSnap.data();
        if (fetched) {
          console.log("[PortfolioProvider] Safely synchronized official Faceit stats from Firestore");
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

      const matchesQ = query(collection(db, "faceitMatches"));
      const matchesSnap = await getDocs(matchesQ);
      const fetchedMatches: any[] = [];
      matchesSnap.forEach((doc) => {
        const m = doc.data();
        if (m.username === "NxStep") {
          fetchedMatches.push(m);
        }
      });
      console.log(`[PortfolioProvider] Synced ${fetchedMatches.length} matches from Firestore for Map Pool stats`);
      setFirebaseMatches(fetchedMatches);
    } catch (e) {
      console.warn("[PortfolioProvider] Could not load initial Faceit stats from Firestore, using offline cache:", e);
    }
  }, []);

  // Pull latest FaceitStats from Firestore on mount so we never show fake stats
  useEffect(() => {
    reloadFromFirebase();
  }, [reloadFromFirebase]);

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
      const mapNameLower = m.name.toLowerCase();
      const matchesForMap = firebaseMatches.filter((match) => {
        const matchMapLower = (match.map || "").toLowerCase();
        return matchMapLower === `de_${mapNameLower}` || matchMapLower === mapNameLower;
      });

      let matchesCount: number = m.matches || 0;
      let winRate: number = m.winrate || 0;
      let kd: number = m.stats?.kd || 1.1;
      let adr: number = m.stats?.adr || 85;
      let rating: number = m.stats?.rating || 1.15;

      if (matchesForMap.length > 0) {
        matchesCount = matchesForMap.length;
        const wins = matchesForMap.filter(match => match.result === "W" || match.result === "w").length;
        winRate = Math.round((wins / matchesCount) * 100);
        kd = parseFloat((matchesForMap.reduce((sum, match) => sum + (Number(match.kd) || 0), 0) / matchesCount).toFixed(2)) || kd;
        // Estimate rating based on KD & Win Rate
        rating = parseFloat((kd * 0.95 + (winRate >= 50 ? 0.12 : 0.05)).toFixed(2));
      } else {
        const segment = segments.find((seg: any) => {
          const label = (seg.label || "").toLowerCase();
          return label === `de_${mapNameLower}` || label === mapNameLower;
        });

        if (segment && segment.stats) {
          const s = segment.stats;
          const defaultStats = m.stats || { kd: 1.0, adr: 80, rating: 1.0, matches: 0 };
          matchesCount = parseInt(s.Matches || s.m || "0", 10) || m.matches || 0;
          winRate = parseInt(s["Win Rate %"] || s["Win Rate"] || s.k6 || "0", 10) || m.winrate || 0;
          kd = parseFloat(s["K/D Ratio"] || s["K/D"] || s.k5 || "0") || defaultStats.kd;
          
          const hltvRatingStr = s["HLTV Rating"] || s["Rating"] || s.k2;
          rating = hltvRatingStr ? parseFloat(hltvRatingStr) : parseFloat((kd * 0.95 + 0.1).toFixed(2));
          adr = defaultStats.adr;
        }
      }

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
          adr,
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
  }, [lang, localData, firebaseMatches]);

  const providerValue = useMemo(() => ({ 
    data: activePortfolioData, 
    updateData: handleUpdateData,
    reloadFromFirebase
  }), [activePortfolioData, handleUpdateData, reloadFromFirebase]);

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
