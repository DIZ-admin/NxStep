import express from "express";
import dotenv from "dotenv";
import { scoutRouter } from "./server/routes/scout";
import { faceitRouter } from "./server/routes/faceit";
import { applyMiddleware } from "./server/viteMiddleware";

dotenv.config();

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);

app.use(express.json());

app.use("/api", scoutRouter);
app.use("/api", faceitRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", player: "NxStep" });
});

// Vite or Static files serving
async function setupServer() {
  await applyMiddleware(app);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NxStep Professional Portfolio serving on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to bootstrap server:", err);
});
