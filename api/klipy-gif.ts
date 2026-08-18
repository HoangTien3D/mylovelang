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

  try {
    const apiKey =
      process.env.KLIPY_API_KEY || "8Rr0Vl4zM5DCajyma2wUcftUbI0gSQ2Y2kdLAN4MQRqcYLbxEoSt5udVyoXVycbm";

    let q = "";
    let characterId = "";
    let limit = 10;

    if (req.method === "POST") {
      const body = req.body || {};
      q = (body.query || body.q || req.query?.q || "").toString().trim();
      characterId = (body.characterId || req.query?.characterId || "").toString().trim();
      limit = parseInt((body.limit || req.query?.limit || "10").toString(), 10);
    } else {
      q = (req.query.q || req.query.query || "").toString().trim();
      characterId = (req.query.characterId || "").toString().trim();
      limit = parseInt((req.query.limit || "10").toString(), 10);
    }

    let searchQuery = q;
    if (!searchQuery) {
      if (characterId === "bao") searchQuery = "funny coffee meme";
      else if (characterId === "julian") searchQuery = "shrek meme reaction";
      else if (characterId === "ren") searchQuery = "ishowspeed reaction meme";
      else searchQuery = "trending pop culture meme";
    }

    const klipyUrl = `https://api.klipy.com/api/v1/${apiKey}/gifs/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}`;
    const response = await fetch(klipyUrl);

    if (!response.ok) {
      throw new Error(`Klipy API HTTP error ${response.status}`);
    }

    const json = await response.json();
    const items = json?.data?.data || [];

    const gifs = items
      .map((item: any) => {
        const file = item?.file || {};
        const gifObj = file.md?.gif || file.hd?.gif || file.sm?.gif || file.hd?.webp || {};
        return {
          id: item.id,
          title: item.title || searchQuery,
          url: gifObj.url || "",
          width: gifObj.width,
          height: gifObj.height,
        };
      })
      .filter((g: any) => g.url);

    const randomGif = gifs.length > 0 ? gifs[Math.floor(Math.random() * gifs.length)] : null;

    return res.status(200).json({
      success: true,
      query: searchQuery,
      gifs,
      randomGif,
    });
  } catch (err: any) {
    console.error("Klipy GIF fetch error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
