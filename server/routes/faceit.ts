import { Router } from "express";
import { fetchFaceitStats, fetchFaceitHistory } from "../services/faceitService";

export const faceitRouter = Router();

faceitRouter.get("/faceit/sync", async (req, res) => {
  const username = (req.query.username as string) || "NxStep";
  try {
    const data = await fetchFaceitStats(username);
    return res.json(data);
  } catch (error: unknown) {
    console.error("[Faceit Sync Router] Error fetching stats:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unable to retrieve raw stats",
      hasApiKey: !!process.env.FACEIT_API_KEY,
      message: "Please configure a FACEIT_API_KEY in the application Secrets settings matching your developers.faceit.com token for maximum reliability."
    });
  }
});

faceitRouter.get("/faceit/history", async (req, res) => {
  const username = (req.query.username as string) || "NxStep";
  const latestMatchDateStr = req.query.latestMatchDate as string;
  const latestMatchDate = latestMatchDateStr ? Number(latestMatchDateStr) : undefined;
  
  try {
    const data = await fetchFaceitHistory(username, latestMatchDate);
    return res.json({
      success: true,
      username,
      matches: data
    });
  } catch (error: unknown) {
    console.error("[Faceit History Router] Error fetching history:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unable to retrieve match history"
    });
  }
});

