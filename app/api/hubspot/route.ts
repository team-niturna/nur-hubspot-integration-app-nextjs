import { hubspot } from "@/app/lib/hubspot";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 },
      );
    }

    const contact = await hubspot.post("/crm/v3/objects/contacts", {
      properties: {
        firstname: body.firstName,
        lastname: body.lastName,
        email: body.email,
        company: body.companyName,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Contact created",
      data: contact.data,
    });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };

    return NextResponse.json(
      {
        success: false,
        message: err.response?.data?.message || "HubSpot Error",
      },
      { status: 500 },
    );
  }
}