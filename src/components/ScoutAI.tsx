import { Cpu, Terminal } from "lucide-react";
import { useScoutAI } from "../hooks/useScoutAI";
import { ChatMessageList } from "./ScoutAI/ChatMessageList";
import { ChatInputForm } from "./ScoutAI/ChatInputForm";

export function ScoutAI() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isSending,
    errorContext,
    feedRef,
    handleSendMessage,
    t
  } = useScoutAI();

  // Visual suggestions/chips to prompt the AI quickly
  const suggestions = [
    { label: t.sugLabel1, text: t.sugText1 },
    { label: t.sugLabel2, text: t.sugText2 },
    { label: t.sugLabel3, text: t.sugText3 },
    { label: t.sugLabel4, text: t.sugText4 }
  ];

  return (
    <section id="scout-ai-container" aria-label="Scout AI Chat" className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12 md:h-[580px] shadow-2xl text-left">
      {/* Informative Side-Bar (About the AI Scout) */}
      <div id="scout-ai-left-sidebar" className="md:col-span-4 bg-zinc-950 border-r border-zinc-900 p-5 flex flex-col justify-between gap-6 md:h-full overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-sans uppercase tracking-wider">
                {t.scoutAnalyst}
              </h3>
              <p className="text-[10px] text-zinc-550 font-mono tracking-widest">GEMINI 2.5 INTELLIGENCE</p>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {t.scoutSubtitle}
          </p>

          <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1 font-mono">
              <Terminal className="w-3 h-3 text-orange-500" />
              {t.scoutCompetencies}
            </p>
            <ul className="text-[11px] text-zinc-400 font-mono space-y-1 list-disc list-inside">
              <li>{t.scoutComp1}</li>
              <li>{t.scoutComp2}</li>
              <li>{t.scoutComp3}</li>
              <li>{t.scoutComp4}</li>
            </ul>
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{t.scoutStatus}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">{t.scoutSeason}</span>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div id="scout-ai-right-chat" className="md:col-span-8 flex flex-col h-[500px] md:h-full bg-zinc-950/20 overflow-hidden">
        {/* Messages feed */}
        <ChatMessageList 
          messages={messages} 
          isSending={isSending} 
          errorContext={errorContext} 
          feedRef={feedRef} 
          t={t} 
        />

        {/* Suggestion Chips */}
        <div id="chat-suggestions-wrapper" className="relative group/sug bg-zinc-950 border-t border-zinc-900">
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none z-10" />
          <div id="chat-suggestions-strip" className="px-5 py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar flex-shrink-0 snap-x snap-mandatory relative z-0">
            {suggestions.map((sug, sIdx) => (
              <button
                key={sIdx}
                id={`sug-chip-${sIdx}`}
                onClick={() => handleSendMessage(sug.text)}
                className="flex-shrink-0 text-[10px] font-bold font-mono px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all snap-start"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input area */}
        <ChatInputForm 
          inputMessage={inputMessage} 
          setInputMessage={setInputMessage} 
          isSending={isSending} 
          handleSendMessage={handleSendMessage} 
          t={t} 
        />
      </div>
    </section>
  );
}
