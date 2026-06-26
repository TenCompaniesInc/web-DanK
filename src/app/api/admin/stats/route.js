import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Quotation from "@/models/Quotation";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    // Use UTC midnight to avoid timezone issues with MongoDB date storage
    const startOfDay = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()
    ));
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), 1
    ));

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      newQuotations,
      newQuotationsToday,
      revenueAll,
      revenueDay,
      revenueWeek,
      revenueMonth,
      ordersDay,
      ordersWeek,
      ordersMonth,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "confirmed" }),
      Order.countDocuments({ status: "delivered" }),

      // All unactioned quotations
      Quotation.countDocuments({ status: "new" }),
      // Quotations submitted today (any status — so admin sees today's activity)
      Quotation.countDocuments({ createdAt: { $gte: startOfDay } }),

      // Revenue: only PAID orders
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Order counts by period (all statuses except cancelled)
      Order.countDocuments({ status: { $ne: "cancelled" }, createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ status: { $ne: "cancelled" }, createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ status: { $ne: "cancelled" }, createdAt: { $gte: startOfMonth } }),

      Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        quotationRequests: newQuotations,
        newQuotationsToday,
        ordersDay,
        ordersWeek,
        ordersMonth,
        revenue: {
          total: revenueAll[0]?.total  || 0,
          today: revenueDay[0]?.total  || 0,
          week:  revenueWeek[0]?.total || 0,
          month: revenueMonth[0]?.total || 0,
        },
      },
      recentOrders: recentOrders.map((o) => ({
        id: o._id.toString(),
        customer: o.customerName,
        phone: o.phone,
        items: o.items?.map((i) => `${i.name} ×${i.qty}`).join(", ") || "",
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus || "unpaid",
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}