import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getGeminiClient, systemInstruction } from "../services/geminiService";

export const scoutRouter = Router();

const scoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    errorType: "RATE_LIMIT_EXCEEDED",
    error: "You have reached the maximum number of queries. Please wait a few minutes before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

scoutRouter.post("/scout", scoutRateLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const hasKey = !!process.env.GEMINI_API_KEY;
    if (!hasKey) {
      return res.status(400).json({
        errorType: "MISSING_KEY",
        error: "GEMINI_API_KEY is not defined in environment variables."
      });
    }

    const ai = getGeminiClient();

    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
      },
    });

    const reply = response.text || "I was unable to analyze this data. Please review your inquiry.";
    return res.json({ reply });
  } catch (err: unknown) {
    console.error("Scout API Error:", err);
    
    const errStr = err instanceof Error ? String(err.message) : String(err);
    let errorType = "API_ERROR";
    
    if (
      errStr.includes("503") || 
      errStr.toLowerCase().includes("unavailable") || 
      errStr.toLowerCase().includes("high demand") || 
      errStr.toLowerCase().includes("overloaded")
    ) {
      errorType = "SERVICE_UNAVAILABLE";
    } else if (
      errStr.toLowerCase().includes("key") || 
      errStr.toLowerCase().includes("api key") || 
      errStr.toLowerCase().includes("unauthorized") || 
      errStr.toLowerCase().includes("invalid")
    ) {
      errorType = "INVALID_KEY";
    }

    return res.status(500).json({ 
      errorType,
      error: err instanceof Error ? err.message : "An internal error occurred during the scouting session." 
    });
  }
});
