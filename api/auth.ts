import type { Request, Response } from "express";

// In-memory cache of saved progress mapped by Google user ID or email
const savedProgressStore = new Map<string, any>();

function getRedirectUri(req: Request): string {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  const proto = req.headers["x-forwarded-proto"] || (req.secure ? "https" : "http");
  // If APP_URL environment variable is provided, prefer it
  const baseOrigin = process.env.APP_URL || `${proto}://${host}`;
  return `${baseOrigin.replace(/\/+$/, "")}/auth/callback`;
}

export function getGoogleAuthUrl(req: Request, res: Response) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const redirectUri = getRedirectUri(req);

  const devUrl = "https://ais-dev-n274nxwzdnva4ja6cpeitd-577346821946.asia-southeast1.run.app/auth/callback";
  const sharedUrl = "https://ais-pre-n274nxwzdnva4ja6cpeitd-577346821946.asia-southeast1.run.app/auth/callback";

  if (!clientId) {
    return res.status(200).json({
      configured: false,
      message: "GOOGLE_CLIENT_ID is not configured in environment settings.",
      redirectUri,
      devUrl,
      sharedUrl,
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const providerAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const authUrl = `${providerAuthUrl}?${params.toString()}`;

  return res.status(200).json({
    configured: true,
    url: authUrl,
    redirectUri,
    devUrl,
    sharedUrl,
  });
}

export async function handleOAuthCallback(req: Request, res: Response) {
  const code = req.query.code as string | undefined;
  const error = req.query.error as string | undefined;
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
  const redirectUri = getRedirectUri(req);

  if (error) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authentication Error</title></head>
        <body style="font-family:sans-serif; text-align:center; padding:40px; background:#120c1d; color:#fff;">
          <h2>Google Sign-In Cancelled or Encountered an Error</h2>
          <p style="color:#f87171;">${String(error)}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(String(error))} }, '*');
              setTimeout(() => window.close(), 1500);
            }
          </script>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family:sans-serif; text-align:center; padding:40px; background:#120c1d; color:#fff;">
          <h2>Missing Authorization Code</h2>
          <p>No OAuth code was returned by Google.</p>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>
    `);
  }

  try {
    if (!clientId || !clientSecret) {
      throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET on server.");
    }

    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange authorization code.");
    }

    // Fetch Google User Profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    const userProfile = {
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.given_name || "Otome Protagonist",
      picture: userData.picture || "",
      verifiedEmail: userData.verified_email ?? true,
    };

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Sign-In Successful</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="font-family:system-ui,-apple-system,sans-serif; background:#181028; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; height:90vh; margin:0; text-align:center;">
          <div style="background:rgba(255,255,255,0.06); border:1.5px solid #d90057; border-radius:20px; padding:32px 24px; max-width:380px;">
            <div style="font-size:36px; margin-bottom:12px;">🌸</div>
            <h3 style="margin:0 0 8px 0; color:#fff;">Signed in as ${userProfile.name}</h3>
            <p style="margin:0 0 16px 0; color:#f472b6; font-size:14px;">${userProfile.email}</p>
            <p style="margin:0; font-size:13px; color:#cbd5e1;">Saving progress to Otome Lingua Cloud... This window will close automatically.</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_SUCCESS',
                  user: ${JSON.stringify(userProfile)}
                }, '*');
                setTimeout(() => window.close(), 600);
              } else {
                window.location.href = '/';
              }
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Google OAuth Exchange Error:", err);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family:sans-serif; text-align:center; padding:40px; background:#120c1d; color:#fff;">
          <h2>Authentication Exchange Failed</h2>
          <p style="color:#f87171;">${err.message}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: ${JSON.stringify(err.message)} }, '*');
            }
          </script>
        </body>
      </html>
    `);
  }
}

// Save user progress associated with Google account
export async function handleSaveProgress(req: Request, res: Response) {
  try {
    const { googleUser, progress } = req.body || {};
    if (!googleUser || (!googleUser.id && !googleUser.email)) {
      return res.status(400).json({ success: false, error: "Missing Google user identifier." });
    }

    const key = googleUser.id || googleUser.email;
    const record = {
      googleUser,
      progress,
      updatedAt: new Date().toISOString(),
    };

    savedProgressStore.set(key, record);

    // Also forward to Convex cloud user sync if available
    try {
      await fetch("https://wary-reindeer-174.convex.site/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: `google_${key}`,
          googleEmail: googleUser.email,
          googleName: googleUser.name,
          ...progress,
          syncedAt: new Date().toISOString(),
          syncReason: "Google OAuth Cloud Save",
        }),
      }).catch(() => null);
    } catch {
      // Non-blocking if external convex endpoint fails
    }

    return res.status(200).json({
      success: true,
      message: "Progress securely saved with Google account.",
      savedAt: record.updatedAt,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// Load user progress associated with Google account
export function handleLoadProgress(req: Request, res: Response) {
  try {
    const { googleId, email } = req.query as { googleId?: string; email?: string };
    const key = googleId || email;

    if (!key) {
      return res.status(400).json({ success: false, error: "Missing googleId or email query parameter." });
    }

    const saved = savedProgressStore.get(key);
    if (!saved) {
      return res.status(200).json({ success: true, found: false, message: "No remote progress saved for this account yet." });
    }

    return res.status(200).json({
      success: true,
      found: true,
      data: saved,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
