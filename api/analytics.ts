import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const clientIp = (
      (req.headers["x-forwarded-for"] as string) ||
      req.socket?.remoteAddress ||
      "127.0.0.1"
    )
      .split(",")[0]
      .trim();

    const userAgent = (req.headers["user-agent"] as string) || "unknown";

    const enrichedPayload = {
      ...req.body,
      serverEnriched: {
        clientIp,
        userAgent,
        receivedAt: new Date().toISOString(),
        ipCountry:
          (req.headers["cf-ipcountry"] as string) ||
          (req.headers["x-vercel-ip-country"] as string) ||
          "Unknown",
      },
    };

    const convexRes = await fetch("https://wary-reindeer-174.convex.site/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedPayload),
    });

    const convexData = convexRes.ok ? await convexRes.json().catch(() => ({})) : null;

    return res.status(200).json({
      success: true,
      convexStatus: convexRes.status,
      convexData,
      loggedPayload: enrichedPayload,
    });
  } catch (err: any) {
    console.error("Convex analytics proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
