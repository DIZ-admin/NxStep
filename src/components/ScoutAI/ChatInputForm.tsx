import { Send } from "lucide-react";

interface ChatInputFormProps {
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  isSending: boolean;
  handleSendMessage: (customText?: string) => void;
  t: Record<string, string>;
}

export function ChatInputForm({
  inputMessage,
  setInputMessage,
  isSending,
  handleSendMessage,
  t
}: ChatInputFormProps) {
  return (
    <div id="chat-input-row" className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center gap-3 flex-shrink-0">
      <input
        id="scout-text-input"
        type="text"
        aria-label="Chat input"
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
        aria-label="Send message"
        className="p-3 bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-xl transition-all shadow-md shadow-orange-500/5 cursor-pointer flex-shrink-0"
      >
        <Send className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}
