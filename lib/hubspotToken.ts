/**
 * Server-only module.
 * Reads, refreshes, and saves the HubSpot OAuth token stored in MongoDB.
 */

import axios from "axios";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";

const DB_NAME = "hubspot";
const COLLECTION = "hubspot_connections";

export interface HubspotConnection {
  sessionId: string;
  portalId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<HubspotConnection>(COLLECTION);
}

/**
 * Returns a valid access token. If the stored token is expired (or within
 * 60 seconds of expiry), it is refreshed using the refresh token and
 * saved back to MongoDB before being returned.
 *
 * Throws if no connection exists or if the refresh fails.
 */
export async function getValidAccessToken(): Promise<string> {
  const col = await getCollection();
  const sessionId = (await cookies()).get("hubspot_session")?.value;

  const conn = await col.findOne({ sessionId });

  if (!conn) {
    throw new Error(
      "HubSpot is not connected. Please connect via OAuth first.",
    );
  }

  const nowPlusSixty = new Date(Date.now() + 60 * 1000);
  if (conn.expiresAt > nowPlusSixty) {
    // Token is still valid.
    return conn.accessToken;
  }

  // Token is expired (or about to expire) — refresh it.
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.HUBSPOT_CLIENT_ID!,
    client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
    refresh_token: conn.refreshToken,
  });

  const response = await axios.post<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>("https://api.hubapi.com/oauth/v1/token", params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { access_token, refresh_token, expires_in } = response.data;
  const expiresAt = new Date(Date.now() + expires_in * 1000);
  const now = new Date();

  await col.updateOne(
    { sessionId },
    {
      $set: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        updatedAt: now,
      },
    },
  );

  return access_token;
}

/**
 * Upserts the connection document. Called after a successful OAuth callback.
 */
export async function saveConnection(
  data: Omit<HubspotConnection, "createdAt" | "updatedAt">,
) {
  const col = await getCollection();
  const now = new Date();

  await col.updateOne(
    { sessionId: data.sessionId },
    {
      $set: {
        sessionId: data.sessionId,
        portalId: data.portalId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

/**
 * Returns the current connection status without refreshing the token.
 */
export async function getConnectionStatus(): Promise<{
  connected: boolean;
  portalId?: string;
  expiresAt?: Date;
}> {
  try {
    const col = await getCollection();
    const sessionId = (await cookies()).get("hubspot_session")?.value;

    const conn = await col.findOne({
      sessionId,
    });
    if (!conn) return { connected: false };
    return {
      connected: true,
      portalId: conn.portalId,
      expiresAt: conn.expiresAt,
    };
  } catch {
    return { connected: false };
  }
}
