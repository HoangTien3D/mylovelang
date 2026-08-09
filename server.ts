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

  // Klipy GIF API Endpoint
  app.get("/api/klipy-gif", async (req, res) => {
    try {
      const apiKey = process.env.KLIPY_API_KEY || "8Rr0Vl4zM5DCajyma2wUcftUbI0gSQ2Y2kdLAN4MQRqcYLbxEoSt5udVyoXVycbm";
      const q = (req.query.q || req.query.query || "").toString().trim();
      const characterId = (req.query.characterId || "").toString().trim();
      const limit = parseInt((req.query.limit || "10").toString(), 10);

      let searchQuery = q;
      if (!searchQuery) {
        if (characterId === "bao") searchQuery = "anime coffee barista cute";
        else if (characterId === "julian") searchQuery = "anime literature reading book";
        else if (characterId === "ren") searchQuery = "anime tea master illustration";
        else searchQuery = "anime cute heart greeting";
      }

      const klipyUrl = `https://api.klipy.com/api/v1/${apiKey}/gifs/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}`;
      const response = await fetch(klipyUrl);
      if (!response.ok) {
        throw new Error(`Klipy API HTTP error ${response.status}`);
      }

      const json = await response.json();
      const items = json?.data?.data || [];

      const gifs = items.map((item: any) => {
        const file = item?.file || {};
        const gifObj = file.md?.gif || file.hd?.gif || file.sm?.gif || file.hd?.webp || {};
        return {
          id: item.id,
          title: item.title || searchQuery,
          url: gifObj.url || "",
          width: gifObj.width,
          height: gifObj.height
        };
      }).filter((g: any) => g.url);

      const randomGif = gifs.length > 0 ? gifs[Math.floor(Math.random() * gifs.length)] : null;

      res.json({
        success: true,
        query: searchQuery,
        gifs,
        randomGif
      });
    } catch (err: any) {
      console.error("Klipy GIF fetch error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/klipy-gif", async (req, res) => {
    try {
      const apiKey = process.env.KLIPY_API_KEY || "8Rr0Vl4zM5DCajyma2wUcftUbI0gSQ2Y2kdLAN4MQRqcYLbxEoSt5udVyoXVycbm";
      const { query: q, characterId, limit: reqLimit } = req.body || {};
      const limit = parseInt((reqLimit || 10).toString(), 10);

      let searchQuery = (q || "").toString().trim();
      if (!searchQuery) {
        if (characterId === "bao") searchQuery = "anime coffee barista cute";
        else if (characterId === "julian") searchQuery = "anime literature reading book";
        else if (characterId === "ren") searchQuery = "anime tea master illustration";
        else searchQuery = "anime cute heart greeting";
      }

      const klipyUrl = `https://api.klipy.com/api/v1/${apiKey}/gifs/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}`;
      const response = await fetch(klipyUrl);
      if (!response.ok) {
        throw new Error(`Klipy API HTTP error ${response.status}`);
      }

      const json = await response.json();
      const items = json?.data?.data || [];

      const gifs = items.map((item: any) => {
        const file = item?.file || {};
        const gifObj = file.md?.gif || file.hd?.gif || file.sm?.gif || file.hd?.webp || {};
        return {
          id: item.id,
          title: item.title || searchQuery,
          url: gifObj.url || "",
          width: gifObj.width,
          height: gifObj.height
        };
      }).filter((g: any) => g.url);

      const randomGif = gifs.length > 0 ? gifs[Math.floor(Math.random() * gifs.length)] : null;

      res.json({
        success: true,
        query: searchQuery,
        gifs,
        randomGif
      });
    } catch (err: any) {
      console.error("Klipy GIF fetch error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

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
