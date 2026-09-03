import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import chatHandler from "./api/chat";
import analyticsHandler from "./api/analytics";
import syncUserHandler from "./api/sync-user";
import mediaLearningHandler from "./api/media-learning";

dotenv.config();

async function startServer() {
  const app = express();

  // Cloud Run / Production detection:
  // In development, the AI Studio sandbox environment uses an internal Nginx reverse-proxy
  // that strictly expects the dev server to listen on port 3000.
  // In production (such as deployed Google Cloud Run), the container must listen on the port
  // defined by process.env.PORT (defaults to 8080) on 0.0.0.0.
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (typeof __filename !== "undefined" && __filename.endsWith(".cjs"));

  const PORT = isProduction
    ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080)
    : 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Cloud Run & Load Balancer health check endpoints
  app.get(["/health", "/api/health"], (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API endpoints
  app.post("/api/chat", (req, res) => chatHandler(req as any, res as any));
  app.post("/api/analytics", (req, res) => analyticsHandler(req as any, res as any));
  app.post("/api/sync-user", (req, res) => syncUserHandler(req as any, res as any));
  app.post("/api/media-learning", (req, res) => mediaLearningHandler(req as any, res as any));

  // Serve custom chibi stickers directly from public/stickers, stickers, or bundle folder
  const baseDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
  app.use("/stickers", express.static(path.join(process.cwd(), "public", "stickers")));
  app.use("/stickers", express.static(path.join(process.cwd(), "stickers")));
  app.use("/stickers", express.static(path.join(baseDir, "stickers")));

  // Serve custom fonts directly from public/fonts, fonts, or bundle folder
  app.use("/fonts", express.static(path.join(process.cwd(), "public", "fonts")));
  app.use("/fonts", express.static(path.join(process.cwd(), "fonts")));
  app.use("/fonts", express.static(path.join(baseDir, "fonts")));

  // Serve scenario backgrounds, avatars, and assets directly from public/assets
  app.use("/assets", express.static(path.join(process.cwd(), "public", "assets"), { maxAge: 0, etag: true }));
  app.use("/assets", express.static(path.join(baseDir, "public", "assets"), { maxAge: 0, etag: true }));

  // Vite middleware in dev, pre-built static assets in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const candidatePaths = [
      path.join(process.cwd(), "dist"),
      baseDir,
      path.resolve(baseDir, "..", "dist"),
    ];

    const distPath = candidatePaths.find((p) =>
      fs.existsSync(path.join(p, "index.html"))
    ) || path.join(process.cwd(), "dist");

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("<!DOCTYPE html><html><body><h1>Otome Lingua is running</h1></body></html>");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (mode: ${isProduction ? "production" : "development"})`);
  });
}

startServer();

