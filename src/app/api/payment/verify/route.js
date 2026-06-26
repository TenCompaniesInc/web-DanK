// src/app/api/payment/verify/route.js
// Called by the customer-facing callback page. Checks Pesapal directly (in case the IPN
// hasn't arrived yet) and syncs our DB order to match, then returns the real status.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getTransactionStatus } from "@/lib/pesapal";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get("orderTrackingId");

    if (!orderTrackingId) {
      return NextResponse.json({ success: false, error: "Missing orderTrackingId" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ pesapalOrderTrackingId: orderTrackingId });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const statusResult = await getTransactionStatus(orderTrackingId);
    const code = statusResult.status_code;

    let paymentStatus = order.paymentStatus;
    if (code === 1) {
      paymentStatus = "paid";
      order.paymentStatus = "paid";
      order.paymentMethod = statusResult.payment_method || order.network;
      order.paymentConfirmationCode = statusResult.confirmation_code || "";
      if (order.status === "pending") order.status = "confirmed";
      await order.save();
    } else if (code === 2) {
      paymentStatus = "failed";
      order.paymentStatus = "failed";
      await order.save();
    } else if (code === 3) {
      paymentStatus = "reversed";
      order.paymentStatus = "reversed";
      await order.save();
    }

    return NextResponse.json({
      success: true,
      paymentStatus,
      total: order.total,
      orderId: order._id.toString(),
      description: statusResult.description,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}