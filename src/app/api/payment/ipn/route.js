// src/app/api/payment/ipn/route.js
// Pesapal calls this server-to-server whenever a transaction status changes.
// This is the SOURCE OF TRUTH for payment confirmation — never trust the customer's
// browser redirect alone, since they can close the tab before it loads.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getTransactionStatus } from "@/lib/pesapal";

async function handleIPN(orderTrackingId, orderMerchantReference) {
  await connectDB();

  const statusResult = await getTransactionStatus(orderTrackingId);

  const order = await Order.findOne({ pesapalOrderTrackingId: orderTrackingId });

  if (!order) {
    console.error("IPN received for unknown order tracking id:", orderTrackingId);
    return { status: 500 };
  }

  // status_code: 0 INVALID, 1 COMPLETED, 2 FAILED, 3 REVERSED
  const code = statusResult.status_code;

  if (code === 1) {
    order.paymentStatus = "paid";
    order.paymentMethod = statusResult.payment_method || order.network;
    order.paymentConfirmationCode = statusResult.confirmation_code || "";
    if (order.status === "pending") order.status = "confirmed";
  } else if (code === 2) {
    order.paymentStatus = "failed";
  } else if (code === 3) {
    order.paymentStatus = "reversed";
  } else {
    order.paymentStatus = "unpaid";
  }

  await order.save();

  return { status: 200 };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get("OrderTrackingId");
    const orderMerchantReference = searchParams.get("OrderMerchantReference");
    const notificationType = searchParams.get("OrderNotificationType");

    const result = await handleIPN(orderTrackingId, orderMerchantReference);

    return NextResponse.json({
      orderNotificationType: notificationType,
      orderTrackingId,
      orderMerchantReference,
      status: result.status,
    });
  } catch (error) {
    console.error("IPN (GET) error:", error);
    return NextResponse.json({ status: 500, error: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = body;

    const result = await handleIPN(OrderTrackingId, OrderMerchantReference);

    return NextResponse.json({
      orderNotificationType: OrderNotificationType,
      orderTrackingId: OrderTrackingId,
      orderMerchantReference: OrderMerchantReference,
      status: result.status,
    });
  } catch (error) {
    console.error("IPN (POST) error:", error);
    return NextResponse.json({ status: 500, error: String(error) }, { status: 500 });
  }
}