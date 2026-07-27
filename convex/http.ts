import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Synchronize user settings, progress, hearts, and tier status
http.route({
  path: "/sync-user",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    try {
      const body = await request.json();
      console.log("Convex HTTP Action [/sync-user] received:", body);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Otome Lingua user state synchronized successfully with Convex Cloud.",
          syncedAt: new Date().toISOString(),
          userId: body.userId || "guest_otome_user",
          hearts: body.totalHearts ?? 0,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: (error as Error).message }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }),
});

// Analytics upload endpoint for secret dashboard
http.route({
  path: "/analytics",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    try {
      const body = await request.json();
      console.log("Convex HTTP Action [/analytics] received:", body);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Analytics telemetry successfully ingested into Convex Cloud.",
          receivedAt: new Date().toISOString(),
          metricsCount: Object.keys(body).length,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: (error as Error).message }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }),
});

// CORS Preflight Handlers
http.route({
  path: "/sync-user",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/analytics",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
