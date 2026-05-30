import { useState, useEffect, useMemo, memo } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Calendar, SlidersHorizontal, ArrowLeft, ArrowRight, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface MatchHistoryViewProps {
  lang: "en" | "uk";
}

interface MatchRecord {
  matchId: string;
  username: string;
  date: number;
  map: string;
  kills: number;
  deaths: number;
  kd: number;
  result: "W" | "L";
  elo: number | null;
  stats: {
    headshots: string;
    tripleKills: string;
    quadKills: string;
    aces: string;
    mvps: string;
  };
}

export const MatchHistoryView = memo(function MatchHistoryView({ lang }: MatchHistoryViewProps) {
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for filters and pagination
  const [selectedMap, setSelectedMap] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 8;

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "faceitMatches"));
        const snapshot = await getDocs(q);
        const list: MatchRecord[] = [];
        
        snapshot.forEach((doc) => {
          const item = doc.data() as MatchRecord;
          if (item.username === "NxStep") {
            list.push(item);
          }
        });

        // Sort descending by date (newest first)
        list.sort((a, b) => b.date - a.date);
        setMatches(list);
      } catch (err: unknown) {
        console.error("Firestore history fetch error: ", err);
        setError(err instanceof Error ? err.message : "Unable to query matches from Firebase.");
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  // Filter maps options
  const mapOptions = useMemo(() => {
    const mapsSet = new Set<string>();
    matches.forEach((m) => {
      if (m.map) mapsSet.add(m.map);
    });
    return ["All", ...Array.from(mapsSet)];
  }, [matches]);

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    if (selectedMap === "All") return matches;
    return matches.filter((m) => m.map === selectedMap);
  }, [matches, selectedMap]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage) || 1;
  const currentMatches = useMemo(() => {
    const startIdx = (currentPage - 1) * matchesPerPage;
    return filteredMatches.slice(startIdx, startIdx + matchesPerPage);
  }, [filteredMatches, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Chart data (chronological order: oldest to newest of the last 40 matches with valid Elo)
  const chartData = useMemo(() => {
    const eloMatches = filteredMatches.filter((m) => m.elo !== null && m.elo > 0);
    // Take the most recent 40 matches, but order them chronologically
    const slice = eloMatches.slice(0, 40).reverse();
    return slice.map((m) => ({
      date: new Date(m.date).toLocaleDateString(lang === "uk" ? "uk" : "en", {
        month: "short",
        day: "numeric",
      }),
      elo: m.elo,
      kills: m.kills,
      kd: m.kd,
      map: m.map.replace("de_", ""),
      result: m.result,
    }));
  }, [filteredMatches, lang]);

  // Average performance indicators for the filtered maps
  const quickStats = useMemo(() => {
    if (filteredMatches.length === 0) return { avgKd: 0, winrate: 0, count: 0 };
    const wins = filteredMatches.filter((m) => m.result === "W").length;
    const totalKd = filteredMatches.reduce((acc, m) => acc + m.kd, 0);
    return {
      avgKd: Number((totalKd / filteredMatches.length).toFixed(2)),
      winrate: Math.round((wins / filteredMatches.length) * 100),
      count: filteredMatches.length,
    };
  }, [filteredMatches]);

  if (loading) {
    return (
      <div id="match-loader" className="w-full h-80 flex flex-col items-center justify-center gap-4 bg-zinc-950/20 border border-zinc-900 rounded-3xl p-8">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 font-mono text-xs tracking-widest uppercase">
          {lang === "uk" ? "Завантаження матчів з Firebase..." : "Querying Firebase Match history..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div id="match-error" className="w-full flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
        <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
        <div>
          <h5 className="text-sm font-bold text-white uppercase font-mono">Error Fetching Real-Time Matches</h5>
          <p className="text-xs text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div id="match-empty-state" className="w-full flex flex-col items-center justify-center text-center gap-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 py-12">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-orange-500 shadow-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white uppercase tracking-tight">
            {lang === "uk" ? "База даних матчів порожня" : "Firebase Matches Database is Empty"}
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm sm:max-w-md mx-auto leading-relaxed">
            {lang === "uk"
              ? "Для вивантаження всієї статистики у Firestore натисніть кнопку 'Sync FACEIT' у верхньому правому куті панелі. Наша система автоматично спарсить всю історію та побудує інтерактивну аналітику!"
              : "To synchronize and back up every match history record into your cloud Firebase, click the 'Sync FACEIT' button at the top of this panel. History data will be parsed automatically!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="match-history-wrapper" className="space-y-6">
      {/* Top Banner stats and Map filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-0.5 border-r border-zinc-850 pr-4">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              {lang === "uk" ? "Спарсено матчів" : "Synced Matches"}
            </span>
            <span className="text-lg font-bold text-white font-mono">{quickStats.count}</span>
          </div>
          <div className="flex flex-col gap-0.5 border-r border-zinc-850 pr-4">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              {lang === "uk" ? "Показник перемог" : "Win Rate"}
            </span>
            <span className="text-lg font-bold text-green-400 font-mono">{quickStats.winrate}%</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Avg K/D</span>
            <span className="text-lg font-bold text-orange-400 font-mono">{quickStats.avgKd}</span>
          </div>
        </div>

        {/* Map Dropdown filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0" />
          <p className="text-xs font-mono text-zinc-400 hidden sm:inline-block">Map:</p>
          <select
            value={selectedMap}
            onChange={(e) => {
              setSelectedMap(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 md:flex-none text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer font-bold font-mono"
          >
            {mapOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "All" ? (lang === "uk" ? "Всі карти" : "All Maps") : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Line Chart */}
      {chartData.length > 1 && (
        <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
              {lang === "uk" ? "Динамічний графік ELO (Останні 40 матчів)" : "Live Record ELO Progression (Last 40 Matches)"}
            </span>
          </div>
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="eloLineColor" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161618" vertical={false} />
                <XAxis dataKey="date" stroke="#3f3f46" fontSize={9} fontWeight="bold" fontFamily="monospace" tickLine={false} axisLine={false} />
                <YAxis domain={["dataMin - 100", "dataMax + 100"]} stroke="#3f3f46" fontSize={9} fontWeight="bold" fontFamily="monospace" tickLine={false} axisLine={false} tickCount={4} />
                <Tooltip
                  cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataNode = payload[0].payload;
                      return (
                        <div className="bg-zinc-950/95 border border-orange-500/20 p-2 py-1.5 rounded-md shadow-xl font-mono text-[10px] space-y-0.5">
                          <p className="text-zinc-400 font-bold uppercase text-[8px] tracking-wider">{dataNode.date}</p>
                          <p className="text-white font-extrabold flex items-center gap-1">
                            <span className={dataNode.result === "W" ? "text-green-400" : "text-red-400"}>■</span> 
                            de_{dataNode.map} ({dataNode.result})
                          </p>
                          <p className="text-orange-400 font-bold">{dataNode.elo} ELO</p>
                          <p className="text-zinc-500">Kills: {dataNode.kills} | K/D: {dataNode.kd}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="elo"
                  stroke="url(#eloLineColor)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#09090b", strokeWidth: 1.5, stroke: "#f97316" }}
                  activeDot={{ r: 5, fill: "#f97316", stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Matches Grid List */}
      <div id="matches-grid-container" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentMatches.map((m) => {
          const formattedDate = new Date(m.date).toLocaleDateString(lang === "uk" ? "uk" : "en", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={m.matchId}
              id={`match-row-${m.matchId}`}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/60 hover:bg-zinc-900 transition-all flex flex-col justify-between gap-3 relative overflow-hidden group shadow-[inset_0_1px_0px_rgba(255,255,255,0.03)]"
            >
              {/* Highlight background based on outcome */}
              <div className={`absolute top-0 right-0 w-[40%] h-[120%] -skew-x-12 blur-3xl pointer-events-none opacity-[0.03] transition-all duration-300 group-hover:opacity-[0.05] ${
                  m.result === "W" ? "bg-emerald-500" : "bg-red-500"
              }`} />

              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                      m.result === "W" ? "bg-emerald-500 glow-emerald" : "bg-red-500 glow-red"
                  }`} />
                  <div>
                    <h5 className="text-sm font-bold tracking-tight text-white font-mono">
                      {m.map}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mt-0.5">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      m.result === "W" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {m.result === "W" ? (lang === "uk" ? "ПЕРЕМОГА" : "WIN") : (lang === "uk" ? "ПОРАЗКА" : "LOSS")}
                  </span>
                  {m.elo && (
                    <p className="text-[10px] font-mono text-zinc-400 mt-1.5 font-bold">
                      {m.elo} ELO
                    </p>
                  )}
                </div>
              </div>

              {/* Combat parameters row */}
              <div className="grid grid-cols-4 gap-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-850/60 font-mono text-[10px] text-zinc-400 text-center relative z-10 transition-colors group-hover:bg-zinc-950/60">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">K / D</span>
                  <span className={`font-bold ${m.kd >= 1.0 ? "text-orange-400" : "text-zinc-400"}`}>
                    {m.kills} / {m.deaths}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 border-l border-zinc-850">
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Ratio</span>
                  <span className={`font-extrabold ${m.kd >= 1.2 ? "text-green-400" : m.kd >= 1.0 ? "text-orange-400" : "text-zinc-400"}`}>
                    {m.kd}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 border-l border-zinc-850">
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">HS %</span>
                  <span className="text-white font-bold">
                    {m.stats.headshots}%
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 border-l border-zinc-850">
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">MVPs</span>
                  <span className="text-white font-bold">{m.stats.mvps || "0"}</span>
                </div>
              </div>

              {/* Advanced multi-kills row */}
              {(parseInt(m.stats.tripleKills) > 0 || parseInt(m.stats.quadKills) > 0 || parseInt(m.stats.aces) > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-0.5 justify-start">
                  {parseInt(m.stats.tripleKills) > 0 && (
                    <span className="text-[8px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                      3K: {m.stats.tripleKills}
                    </span>
                  )}
                  {parseInt(m.stats.quadKills) > 0 && (
                    <span className="text-[8px] font-mono font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">
                      4K: {m.stats.quadKills}
                    </span>
                  )}
                  {parseInt(m.stats.aces) > 0 && (
                    <span className="text-[8px] font-mono font-black bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-yellow-400" /> ACE: {m.stats.aces}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav aria-label="Pagination Navigation" className="flex items-center justify-between border-t border-zinc-900 pt-3.5 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-sans rounded-md border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "uk" ? "Назад" : "Prev"}</span>
          </button>
          
          <span className="text-xs font-bold font-mono text-zinc-500">
            {lang === "uk" ? "Сторінка" : "Page"} {currentPage} {lang === "uk" ? "з" : "of"} {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-sans rounded-md border border-zinc-800 text-zinc-400 disabled:opacity-40 hover:text-white transition-colors"
          >
            <span>{lang === "uk" ? "Далі" : "Next"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}
    </div>
  );
});
