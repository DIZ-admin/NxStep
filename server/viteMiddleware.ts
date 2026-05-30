import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

export async function applyMiddleware(app: express.Express) {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // Do not serve index.html for assets or files with extensions to avoid MIME type errors
      if (req.path.includes(".") || req.path.startsWith("/assets/") || req.path.startsWith("/api/")) {
        res.status(404).send("Not Found");
      } else {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }
}
