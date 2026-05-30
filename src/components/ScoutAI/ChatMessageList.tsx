import { ChatMessage } from "../../types";
import { User, Bot, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  errorContext: string | null;
  feedRef: React.RefObject<HTMLDivElement | null>;
  t: any;
}

export function ChatMessageList({ messages, isSending, errorContext, feedRef, t }: ChatMessageListProps) {
  return (
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
  );
}
