import { NextResponse } from "next/server";
import { createHubspotClient } from "@/app/lib/hubspot";
import { getValidAccessToken } from "@/lib/hubspotToken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const objectType = body.objectType; // "contacts" or "companies"

    if (objectType !== "contacts" && objectType !== "companies") {
      return NextResponse.json(
        { success: false, message: "Invalid object type." },
        { status: 400 },
      );
    }

    // Fetch the access token server-side from MongoDB (auto-refreshes if expired).
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken();
    } catch {
      return NextResponse.json(
        { success: false, message: "HubSpot is not connected. Please connect via OAuth first." },
        { status: 401 },
      );
    }

    const hubspot = createHubspotClient(accessToken);
    const response = await hubspot.get(`/crm/v3/properties/${objectType}`, {
      params: { archived: false },
    });

    const properties = response.data.results.map((prop: { name: string; label: string; type: string; description?: string; options?: { label: string; value: string }[]; readOnlyValue?: boolean; calculated?: boolean }) => ({
      name: prop.name,
      label: prop.label || prop.name,
      type: prop.type,
      description: prop.description || "",
      options: prop.options || [],
      readonly: prop.readOnlyValue || prop.calculated || false,
    }));

    return NextResponse.json({ success: true, properties });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch properties" },
      { status: 500 },
    );
  }
}
