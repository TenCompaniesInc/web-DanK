// src/app/api/email/receipt/route.js
// Sends an order receipt to the customer after payment is confirmed.
// Call this from the IPN handler or the verify route when paymentStatus becomes "paid".

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { customerName, email, orderId, items, total, network, momoNumber, delivery, address } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "No email address provided." }, { status: 400 });
    }

    const itemRows = (items || []).map((item) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f5f2;">${item.name} (${item.weight})</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f5f2;text-align:center;">${item.qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f5f2;text-align:right;font-weight:600;color:#1a3d2b;">UGX ${(item.price * item.qty).toLocaleString()}</td>
      </tr>`
    ).join("");

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
      <p style="color:#c8961e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Order Confirmed</p>
      <h2 style="font-size:22px;font-weight:700;color:#141414;margin:0 0 4px;">Thank you, ${customerName}!</h2>
      <p style="color:#888;font-size:14px;margin:0 0 24px;">Your payment has been received. Here is your order receipt.</p>

      <div style="background:#f5f8f6;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin:0 0 12px;">Order Details</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#eaf2ed;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#888;font-weight:600;">Item</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#888;font-weight:600;">Qty</th>
              <th style="padding:8px 12px;text-align:right;font-size:11px;color:#888;font-weight:600;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:700;font-size:15px;color:#141414;">Total</td>
              <td style="padding:12px;font-weight:800;font-size:18px;color:#1a3d2b;text-align:right;">UGX ${(total || 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        <div style="background:#f5f8f6;border-radius:12px;padding:16px;">
          <p style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;margin:0 0 4px;">Payment</p>
          <p style="font-size:13px;font-weight:600;color:#141414;margin:0;">${(network || "").toUpperCase()}</p>
          ${momoNumber ? `<p style="font-size:12px;color:#888;margin:2px 0 0;">${momoNumber}</p>` : ""}
        </div>
        <div style="background:#f5f8f6;border-radius:12px;padding:16px;">
          <p style="font-size:11px;color:#aaa;font-weight:600;text-transform:uppercase;margin:0 0 4px;">Delivery</p>
          <p style="font-size:13px;font-weight:600;color:#141414;margin:0;">${delivery === "collect" ? "Store Pickup" : "Delivery"}</p>
          ${address ? `<p style="font-size:12px;color:#888;margin:2px 0 0;">${address}</p>` : '<p style="font-size:12px;color:#888;margin:2px 0 0;">Covenant Building, Kisenyi</p>'}
        </div>
      </div>

      <div style="background:#1a3d2b;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0 0 4px;">Order Reference</p>
        <p style="color:white;font-size:20px;font-weight:800;font-family:monospace;letter-spacing:2px;margin:0;">${(orderId || "").slice(-8).toUpperCase()}</p>
      </div>

      <p style="color:#888;font-size:13px;line-height:1.6;margin:0 0 8px;">For any questions, contact us at <strong>0731 496 117</strong> or WhatsApp <a href="https://wa.me/256731496117" style="color:#1a3d2b;">+256 731 496 117</a>.</p>
      <p style="color:#bbb;font-size:12px;margin:0;">DAN K CHEAP STORES LTD · Covenant Building, Kisenyi Road, Kampala · Open Sun–Fri 7am–7:30pm</p>
    </div>

    <div style="background:#f5f8f6;padding:16px;text-align:center;border-top:1px solid #d8e6dd;">
      <p style="color:#bbb;font-size:11px;margin:0;">© 2026 DAN K CHEAP STORES LTD · Built by Ten Developers</p>
    </div>
  </div>
</body>
</html>`;

    const result = await resend.emails.send({
      from: "DAN K CHEAP STORES <orders@dankcheapstores.com>",
      to: [email],
      subject: "Your DAN K Order Receipt — UGX " + (total || 0).toLocaleString(),
      html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ success: false, error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, emailId: result.data?.id });
  } catch (error) {
    console.error("Receipt email error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}