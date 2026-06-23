import { NextResponse } from "next/server";
import crypto from "crypto";

const SCOPES = [
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.companies.read",
  "crm.objects.companies.write",
  "crm.schemas.contacts.read",
  "crm.schemas.companies.read",
].join(" ");

export async function GET() {
  const clientId = process.env.HUBSPOT_CLIENT_ID!;
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI!;

  const sessionId = crypto.randomUUID();

  const url = new URL("https://app.hubspot.com/oauth/authorize");

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", sessionId);

  const response = NextResponse.redirect(url);

  response.cookies.set("hubspot_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}