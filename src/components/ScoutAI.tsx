import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { translations, Language } from "../translations";
import { Bot, User, Send, Sparkles, AlertTriangle, Cpu, Terminal, MoveHorizontal } from "lucide-react";
import { auth, db, handleFirestoreError } from "../firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export function ScoutAI({ lang = "en" }: { lang?: Language }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorContext, setErrorContext] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

    const t = translations[lang];

  // Initialize greeting on mount and whenever language changes
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: t.scoutGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
  }, [lang, t.scoutGreeting]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  // Visual suggestions/chips to prompt the AI quickly
  const suggestions = [
    { label: t.sugLabel1, text: t.sugText1 },
    { label: t.sugLabel2, text: t.sugText2 },
    { label: t.sugLabel3, text: t.sugText3 },
    { label: t.sugLabel4, text: t.sugText4 }
  ];

  // Sign in anonymously for persistence
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.warn("Failed anonymous auth", error);
    });
  }, []);

  const saveSessionToFirestore = async (query: string, reply: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const sessionId = crypto.randomUUID();
      await setDoc(doc(db, "scoutSessions", sessionId), {
        userId: user.uid,
        query: query,
        response: reply,
        createdAt: new Date().getTime()
      });
    } catch (e) {
      console.error("Failed to save to Firestore", e);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    setErrorContext(null);
    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsSending(true);

    try {
      const res = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        const customErr = new Error(result.error || "Failed key confirmation.");
        (customErr as any).errorType = result.errorType;
        throw customErr;
      }

      const aiMsg: ChatMessage = {
        sender: "ai",
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      saveSessionToFirestore(textToSend, result.reply);
    } catch (err: any) {
      console.error("Scout AI Client Caught Error:", err);
      // Clean fallback response of Scouting details in case environment API key is missing or system is initializing
      let simulatedReply = "";
      
      const containsLaptop = textToSend.toLowerCase().includes("ноутбук") || textToSend.toLowerCase().includes("laptop") || textToSend.toLowerCase().includes("как он") || textToSend.toLowerCase().includes("як він") || textToSend.toLowerCase().includes("how did");
      const containsMap = textToSend.toLowerCase().includes("ancient") || textToSend.toLowerCase().includes("mirage") || textToSend.toLowerCase().includes("роль на") || textToSend.toLowerCase().includes("позиции") || textToSend.toLowerCase().includes("позиції") || textToSend.toLowerCase().includes("tactical");
      const containsAcademy = textToSend.toLowerCase().includes("academy") || textToSend.toLowerCase().includes("академ") || textToSend.toLowerCase().includes("готовность") || textToSend.toLowerCase().includes("готовність") || textToSend.toLowerCase().includes("сильные") || textToSend.toLowerCase().includes("сильні") || textToSend.toLowerCase().includes("readiness");

      if (containsLaptop) {
        simulatedReply = t.simLaptop;
      } else if (containsMap) {
        simulatedReply = t.simMap;
      } else if (containsAcademy) {
        simulatedReply = t.simAcademy;
      } else {
        simulatedReply = t.simContact;
      }

      let displayError = "";
      if (err.errorType === "MISSING_KEY") {
        displayError = t.scoutErrPreview;
      } else if (err.errorType === "SERVICE_UNAVAILABLE" || err.message?.includes("503") || err.message?.toLowerCase().includes("demand") || err.message?.toLowerCase().includes("unavailable")) {
        displayError = t.scoutErr503;
      } else if (err.errorType === "INVALID_KEY") {
        displayError = t.scoutErrInvalid;
      } else {
        displayError = `${t.scoutErrFallback} ${err.message || ""}`;
      }
      
      setErrorContext(displayError);
      
      const aiMsg: ChatMessage = {
        sender: "ai",
        text: simulatedReply + "\n\n" + t.scoutNote,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="scout-ai-container" className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12 md:h-[580px] shadow-2xl text-left">
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
              <p className="text-[10px] text-zinc-550 font-mono tracking-widest">GEMINI 3.5 INTELLIGENCE</p>
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
        <div id="scout-messages-feed" ref={feedRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              id={`chat-message-${index}`}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-zinc-850 border-zinc-700 text-zinc-350"
                    : "bg-orange-500/10 border-orange-500/25 text-orange-500"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tr-none"
                    : "bg-zinc-950/50 text-zinc-300 border border-zinc-800/60 rounded-tl-none font-sans"
                }`}
              >
                {msg.sender === "user" ? (
                  <span>{msg.text}</span>
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
                <div className="text-[9px] font-mono text-zinc-500 mt-1.5 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isSending && (
            <div id="chat-loading-state" className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center flex-shrink-0 animate-spin">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-zinc-950/40 text-zinc-400 border border-zinc-800/60 px-4 py-3 rounded-xl rounded-tl-none text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce delay-200" />
                <span className="font-mono text-[10px] uppercase text-zinc-500">
                  {t.scoutAnalyzing}
                </span>
              </div>
            </div>
          )}

          {errorContext && (
            <div id="chat-error-toast" className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>{errorContext}</span>
            </div>
          )}

        </div>

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
        <div id="chat-input-row" className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center gap-3 flex-shrink-0">
          <input
            id="scout-text-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={t.scoutPlaceholder}
            className="flex-1 bg-zinc-900 hover:bg-zinc-850 focus:bg-zinc-900 text-zinc-100 border border-zinc-800 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors"
          />
          <button
            id="action-send-message"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isSending}
            className="p-3 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-xl transition-all shadow-md shadow-orange-500/5 cursor-pointer flex-shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
