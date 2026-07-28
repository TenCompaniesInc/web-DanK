// src/app/api/payment/register-ipn/route.js
// One-time setup endpoint. Call this once (via browser or curl) to register your IPN URL
// with Pesapal and get back a notification_id. Save that ID into PESAPAL_NOTIFICATION_ID
// in your .env.local — every order submission after that reuses the same ID.

import { NextResponse } from "next/server";
import { registerIPN } from "@/lib/pesapal";

export async function GET(request) {
  try {
    const { origin } = new URL(request.url);
    const baseUrl = process.env.NEXTAUTH_URL || origin;
    const ipnUrl = `${baseUrl}/api/payment/ipn`;

    const data = await registerIPN(ipnUrl, "GET");

    if (data.ipn_id) {
      return NextResponse.json({
        success: true,
        message: "IPN registered. Copy ipn_id into PESAPAL_NOTIFICATION_ID in .env.local",
        ipn_id: data.ipn_id,
        registered_url: data.url,
        raw: data,
      });
    }

    return NextResponse.json({ success: false, error: data }, { status: 400 });
  } catch (error) {
    console.error("IPN registration error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}