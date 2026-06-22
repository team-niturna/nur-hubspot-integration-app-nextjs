import { NextResponse } from "next/server";
import { getConnectionStatus } from "@/lib/hubspotToken";

export async function GET() {
  const status = await getConnectionStatus();
  return NextResponse.json({
    connected: status.connected,
    portalId: status.portalId ?? null,
    expiresAt: status.expiresAt?.toISOString() ?? null,
  });
}
