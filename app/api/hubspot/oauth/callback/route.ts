import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import axios from "axios";
import { saveConnection } from "@/lib/hubspotToken";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    redirect("/?connected=error");
  }

  try {
    // 1. Exchange authorization code for tokens.
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI!,
      code: code!,
    });

    const tokenResponse = await axios.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>("https://api.hubapi.com/oauth/v1/token", params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // 2. Get the portal (hub) ID from the token info endpoint.
    const tokenInfo = await axios.get<{ hub_id: number; user: string }>(
      `https://api.hubapi.com/oauth/v1/access-tokens/${encodeURIComponent(access_token)}`,
    );

    const portalId = String(tokenInfo.data.hub_id);

    // 3. Persist connection to MongoDB.
    await saveConnection({
      portalId,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt,
    });
  } catch (err) {
    console.error("HubSpot OAuth callback error:", err);
    redirect("/?connected=error");
  }

  redirect("/?connected=1");
}
