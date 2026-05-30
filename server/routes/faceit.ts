import { Router } from "express";
import { fetchFaceitStats } from "../services/faceitService";

export const faceitRouter = Router();

faceitRouter.get("/faceit/sync", async (req, res) => {
  const username = (req.query.username as string) || "NxStep";
  try {
    const data = await fetchFaceitStats(username);
    return res.json(data);
  } catch (error: any) {
    console.error("[Faceit Sync Router] Error fetching stats:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Unable to retrieve raw stats",
      hasApiKey: !!process.env.FACEIT_API_KEY,
      message: "Please configure a FACEIT_API_KEY in the application Secrets settings matching your developers.faceit.com token for maximum reliability."
    });
  }
});
