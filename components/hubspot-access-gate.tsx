"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface HubspotAccessState {
  accessToken: string;
  validated: boolean;
  scopes: string[];
  missingRecommendedScopes: string[];
}

interface HubspotAccessGateProps {
  onAccessChange?: (state: HubspotAccessState) => void;
  compact?: boolean;
}

type ConnectionStatus = "loading" | "connected" | "disconnected" | "error";

export function HubspotAccessGate({ onAccessChange, compact }: HubspotAccessGateProps) {
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [portalId, setPortalId] = useState<string | null>(null);

  // Read the ?connected= param once on mount using a lazy initializer to avoid
  // calling setState inside a useEffect (react-hooks/set-state-in-effect).
  const [flashMessage] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const val = params.get("connected");
    if (val === "1") {
      window.history.replaceState({}, "", window.location.pathname);
      return "HubSpot connected successfully!";
    }
    if (val === "error") {
      window.history.replaceState({}, "", window.location.pathname);
      return "Connection failed. Please try again.";
    }
    return null;
  });

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/hubspot/oauth/status");
        const data = (await res.json()) as { connected: boolean; portalId?: string };
        if (data.connected) {
          setStatus("connected");
          setPortalId(data.portalId ?? null);
        } else {
          setStatus("disconnected");
        }
      } catch {
        setStatus("error");
      }
    }

    checkStatus();
  }, []);

  // Keep parent pages that check access.validated working unchanged.
  useEffect(() => {
    const validated = status === "connected";
    onAccessChange?.({
      accessToken: "",   // Token is server-side only; never sent to the browser.
      validated,
      scopes: [],
      missingRecommendedScopes: [],
    });
  }, [status, onAccessChange]);

  return (
    <Card className={compact ? "shadow-sm" : ""}>
      <CardHeader>
        <CardTitle>HubSpot Connection</CardTitle>
        <CardDescription>
          Connect your HubSpot account via OAuth to enable contact and company management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
            Checking connection…
          </div>
        )}

        {status === "connected" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs">✓</span>
              Connected{portalId ? ` · Portal ${portalId}` : ""}
            </div>
            <a href="/api/hubspot/oauth/connect">
              <Button type="button" variant="outline" size="sm">
                Reconnect
              </Button>
            </a>
          </div>
        )}

        {(status === "disconnected" || status === "error") && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {status === "error"
                ? "Could not check connection status."
                : "No HubSpot account connected yet."}
            </p>
            <a href="/api/hubspot/oauth/connect">
              <Button type="button" variant="default">
                Connect HubSpot
              </Button>
            </a>
          </div>
        )}

        {flashMessage && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              flashMessage.includes("successfully")
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {flashMessage.includes("successfully") ? "✓ " : "⚠️ "}
            {flashMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
