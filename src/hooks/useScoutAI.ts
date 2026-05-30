import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "../types";
import { useToastContext } from "../components/ToastContext";
import { useLanguage } from "../contexts/LanguageContext";
import { firebaseService } from "../services/firebaseService";
import { apiClient } from "../api";
import { usePortfolio } from "../contexts/PortfolioContext";

export function useScoutAI() {
  const { lang, t } = useLanguage();
  const { data } = usePortfolio();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorContext, setErrorContext] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastContext();

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

  const handleSendMessage = useCallback(async (customText?: string) => {
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
      const result = await apiClient.fetchScoutResponse(textToSend, messages, data.stats, data.maps);

      const aiMsg: ChatMessage = {
        sender: "ai",
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      firebaseService.saveScoutSession(textToSend, result.reply);
    } catch (err: unknown) {
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
      const errorObj = typeof err === "object" && err !== null ? err as { errorType?: string, message?: string } : { message: String(err) };
      if (errorObj.errorType === "MISSING_KEY") {
        displayError = t.scoutErrPreview;
      } else if (errorObj.errorType === "SERVICE_UNAVAILABLE" || errorObj.message?.includes("503") || errorObj.message?.toLowerCase().includes("demand") || errorObj.message?.toLowerCase().includes("unavailable")) {
        displayError = t.scoutErr503;
      } else if (errorObj.errorType === "INVALID_KEY") {
        displayError = t.scoutErrInvalid;
      } else {
        displayError = `${t.scoutErrFallback} ${errorObj.message || ""}`;
      }
      
      setErrorContext(displayError);
      addToast("error", "AI Analysis Limited", displayError);
      
      const aiMsg: ChatMessage = {
        sender: "ai",
        text: simulatedReply + "\n\n" + t.scoutNote,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsSending(false);
    }
  }, [inputMessage, isSending, messages, addToast, t, data.stats, data.maps]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isSending,
    errorContext,
    feedRef,
    handleSendMessage,
    t
  };
}
