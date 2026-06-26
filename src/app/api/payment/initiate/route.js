// src/app/api/payment/initiate/route.js
// Called from the order page once the customer clicks "Pay". Creates the order in our DB
// first (status: pending, paymentStatus: unpaid), then asks Pesapal for a payment URL.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { submitOrderRequest } from "@/lib/pesapal";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      customerName,
      phone,
      email,
      delivery,
      address,
      notes,
      network,
      momoNumber,
      items,
      total,
    } = body;

    if (!customerName || !phone || !items || !total) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields." },
        { status: 400 }
      );
    }

    // 1. Save the order first, so we have a record even if Pesapal step fails.
    const order = await Order.create({
      customerName,
      phone,
      email,
      delivery,
      address,
      notes,
      network,
      momoNumber,
      items,
      total,
      status: "pending",
      paymentStatus: "unpaid",
    });

    const { origin } = new URL(request.url);
    const notificationId = process.env.PESAPAL_NOTIFICATION_ID;

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PESAPAL_NOTIFICATION_ID is not set. Call /api/payment/register-ipn once first.",
        },
        { status: 500 }
      );
    }

    // merchant_reference must be unique, alphanumeric + - _ . : only, max 50 chars
    const merchantReference = "DANK-" + order._id.toString();

    const pesapalPayload = {
      id: merchantReference,
      currency: "UGX",
      amount: total,
      description: "DAN K CHEAP STORES order " + order._id.toString().slice(-8).toUpperCase(),
      callback_url: `${origin}/order/payment-callback`,
      redirect_mode: "",
      notification_id: notificationId,
      branch: "DAN K CHEAP STORES LTD",
      billing_address: {
        email_address: email || "no-email@dankstores.com",
        phone_number: momoNumber || phone,
        country_code: "UG",
        first_name: customerName,
        last_name: "",
      },
    };

    const result = await submitOrderRequest(pesapalPayload);

    if (result.redirect_url) {
      // Save Pesapal's tracking id on the order so we can verify status later.
      order.pesapalOrderTrackingId = result.order_tracking_id;
      order.pesapalMerchantReference = merchantReference;
      await order.save();

      return NextResponse.json({
        success: true,
        redirectUrl: result.redirect_url,
        orderTrackingId: result.order_tracking_id,
        orderId: order._id.toString(),
      });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Pesapal did not return a payment URL.", raw: result },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment initiate error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}