import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import chatHandler from "./api/chat";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", (req, res) => chatHandler(req as any, res as any));

  // Convex Telemetry & Analytics Proxy Endpoint
  app.post("/api/analytics", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();
      const userAgent = req.headers["user-agent"] || "unknown";

      const enrichedPayload = {
        ...req.body,
        serverEnriched: {
          clientIp,
          userAgent,
          receivedAt: new Date().toISOString(),
          ipCountry: req.headers["cf-ipcountry"] || req.headers["x-appengine-country"] || "Unknown",
        },
      };

      // Forward directly to Convex HTTP Action
      const convexRes = await fetch("https://wary-reindeer-174.convex.site/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedPayload),
      });

      const convexData = convexRes.ok ? await convexRes.json().catch(() => ({})) : null;

      res.json({
        success: true,
        convexStatus: convexRes.status,
        convexData,
        loggedPayload: enrichedPayload,
      });
    } catch (err: any) {
      console.error("Convex analytics proxy error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Convex User Sync Proxy Endpoint
  app.post("/api/sync-user", async (req, res) => {
    try {
      const convexRes = await fetch("https://wary-reindeer-174.convex.site/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const convexData = convexRes.ok ? await convexRes.json().catch(() => ({})) : null;

      res.json({
        success: true,
        convexStatus: convexRes.status,
        convexData,
      });
    } catch (err: any) {
      console.error("Convex user sync proxy error:", err);
      res.status(500).json({ error: err.message });
    }
  });

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
