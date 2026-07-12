// src/app/api/email/quotation/route.js
// Sends a custom quotation to a customer from the admin quotations page.

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { toName, toEmail, toPhone, quotationText, referenceTotal } = await request.json();

    if (!toEmail) {
      return NextResponse.json({ success: false, error: "Customer email address is required." }, { status: 400 });
    }
    if (!quotationText) {
      return NextResponse.json({ success: false, error: "Quotation text cannot be empty." }, { status: 400 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#f5f8f6;margin:0;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #d8e6dd;">
    
    <div style="background:linear-gradient(135deg,#0d2418,#1a3d2b);padding:32px;text-align:center;">
      <p style="color:#c8961e;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Origin of Quality</p>
      <h1 style="color:white;font-size:28px;font-weight:800;margin:0;">DAN K</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:8px 0 0;">CHEAP STORES LTD</p>
    </div>

    <div style="padding:32px;">
      <p style="color:#c8961e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Quotation</p>
      <h2 style="font-size:22px;font-weight:700;color:#141414;margin:0 0 4px;">Hello, ${toName}!</h2>
      <p style="color:#888;font-size:14px;margin:0 0 24px;">Thank you for your interest in DAN K CHEAP STORES. Please find your custom quotation below.</p>

      <div style="background:#f5f8f6;border-radius:12px;padding:24px;margin-bottom:24px;border-left:4px solid #1a3d2b;">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin:0 0 12px;">Quotation Details</p>
        <p style="font-size:14px;color:#333;line-height:1.8;margin:0;white-space:pre-wrap;">${quotationText}</p>
      </div>

      ${referenceTotal > 0 ? `
      <div style="background:#1a3d2b;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 4px;">Estimated Total</p>
        <p style="color:#c8961e;font-size:24px;font-weight:800;margin:0;">UGX ${referenceTotal.toLocaleString()}</p>
      </div>` : ""}

      <div style="background:#f5f8f6;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin:0 0 12px;">Ready to Order?</p>
        <p style="font-size:13px;color:#555;margin:0 0 16px;">You can place your order directly on our website or contact us below.</p>
        <a href="https://dankstores.com/order" style="display:inline-block;background:#1a3d2b;color:white;padding:12px 24px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Place Order Online</a>
      </div>

      <p style="color:#888;font-size:13px;line-height:1.6;margin:0 0 4px;">Questions? Call us on <strong>0731 496 117</strong></p>
      <p style="color:#888;font-size:13px;margin:0 0 4px;">WhatsApp: <a href="https://wa.me/256731496117" style="color:#1a3d2b;">+256 731 496 117</a></p>
      <p style="color:#bbb;font-size:12px;margin:16px 0 0;">DAN K CHEAP STORES LTD · Covenant Building, Kisenyi Road, Kampala · Open Sun–Fri 7am–7:30pm</p>
    </div>

    <div style="background:#f5f8f6;padding:16px;text-align:center;border-top:1px solid #d8e6dd;">
      <p style="color:#bbb;font-size:11px;margin:0;">© 2026 DAN K CHEAP STORES LTD · Built by Ten Developers</p>
    </div>
  </div>
</body>
</html>`;

    const result = await resend.emails.send({
      from: "DAN K CHEAP STORES <quotations@dankstores.com>",
      to: [toEmail],
      subject: "Your DAN K Quotation" + (referenceTotal > 0 ? " — UGX " + referenceTotal.toLocaleString() : ""),
      html,
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, emailId: result.data?.id });
  } catch (error) {
    console.error("Quotation email error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}