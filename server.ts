import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import chatHandler from "./api/chat";
import analyticsHandler from "./api/analytics";
import syncUserHandler from "./api/sync-user";
import mediaLearningHandler from "./api/media-learning";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.post("/api/chat", (req, res) => chatHandler(req as any, res as any));
  app.post("/api/analytics", (req, res) => analyticsHandler(req as any, res as any));
  app.post("/api/sync-user", (req, res) => syncUserHandler(req as any, res as any));
  app.post("/api/media-learning", (req, res) => mediaLearningHandler(req as any, res as any));

  // Serve custom chibi stickers directly from public/stickers or stickers folder
  app.use("/stickers", express.static(path.join(process.cwd(), "public", "stickers")));
  app.use("/stickers", express.static(path.join(process.cwd(), "stickers")));

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

