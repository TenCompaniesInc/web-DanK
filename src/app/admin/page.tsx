"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  FileText,
  Package,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type StatusConfig = {
  label: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
};

const statusConfig: { [key: string]: StatusConfig } = {
  confirmed: { label: "Confirmed", color: "#1a3d2b", bg: "#e8f5ed", icon: <CheckCircle size={12} /> },
  pending: { label: "Pending", color: "#e67e22", bg: "#fef3e2", icon: <Clock size={12} /> },
  delivered: { label: "Delivered", color: "#2d6a4f", bg: "#d4edda", icon: <CheckCircle size={12} /> },
  cancelled: { label: "Cancelled", color: "#e74c3c", bg: "#fde8e8", icon: <AlertCircle size={12} /> },
};

const quickLinks = [
  { label: "Manage Products", href: "/admin/products", icon: <Package size={20} />, desc: "Add, edit or remove rice products" },
  { label: "View Quotations", href: "/admin/quotations", icon: <FileText size={20} />, desc: "Respond to bulk quote requests" },
  { label: "Customer List", href: "/admin/customers", icon: <Users size={20} />, desc: "View all registered customers" },
];

type RecentOrder = {
  id: string;
  customer: string;
  phone: string;
  items: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  quotationRequests: number;
  newQuotationsToday: number;
  ordersDay: number;
  ordersWeek: number;
  ordersMonth: number;
  revenue: { total: number; today: number; week: number; month: number };
};

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min" + (mins === 1 ? "" : "s") + " ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hour" + (hrs === 1 ? "" : "s") + " ago";
  const days = Math.floor(hrs / 24);
  return days + " day" + (days === 1 ? "" : "s") + " ago";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } else {
        setError("Could not load dashboard data.");
      }
    } catch (e) {
      setError("Network error loading dashboard.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          change: stats.ordersMonth + " this month · " + stats.ordersWeek + " this week",
          icon: <ShoppingCart size={20} />,
          color: "#1a3d2b",
        },
        {
          label: "Revenue (Paid)",
          value: "UGX " + (stats.revenue.total).toLocaleString(),
          change: "Month: UGX " + stats.revenue.month.toLocaleString(),
          icon: <TrendingUp size={20} />,
          color: "#c8961e",
        },
        {
          label: "Pending Orders",
          value: String(stats.pendingOrders),
          change: stats.confirmedOrders + " confirmed · " + stats.deliveredOrders + " delivered",
          icon: <Clock size={20} />,
          color: "#e67e22",
        },
        {
          label: "Open Quotations",
          value: String(stats.quotationRequests),
          change: stats.newQuotationsToday + " submitted today (all)",
          icon: <FileText size={20} />,
          color: "#2d6a4f",
        },
      ]
    : [];

  return (
    <div className="p-8">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Welcome back. Here is what is happening at DAN K today.</p>
        </div>
        <button onClick={fetchStats} className="text-xs font-semibold text-[#1a3d2b] border-2 border-[#d8e6dd] rounded-lg px-4 py-2 hover:bg-[#f5f8f6] transition">
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border-2 border-[rgba(200,230,210,0.5)] animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 mb-4" />
                <div className="h-6 w-20 bg-zinc-100 rounded mb-2" />
                <div className="h-3 w-24 bg-zinc-100 rounded" />
              </div>
            ))
          : statCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border-2 border-[rgba(200,230,210,0.5)] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-[#141414] mb-1">{stat.value}</p>
                <p className="text-xs text-zinc-400 mb-1">{stat.label}</p>
                <p className="text-xs font-semibold" style={{ color: stat.color }}>{stat.change}</p>
              </div>
            ))}
      </div>

      {/* Revenue Breakdown */}
      {stats && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { label: "Revenue Today",      value: stats.revenue.today,  sub: "Paid orders today",      color: "#2d6a4f" },
            { label: "Revenue This Week",  value: stats.revenue.week,   sub: "Last 7 days (paid)",     color: "#1a3d2b" },
            { label: "Revenue This Month", value: stats.revenue.month,  sub: "Current month (paid)",   color: "#c8961e" },
          ].map((r) => (
            <div key={r.label} className="bg-white rounded-2xl p-5 border-2 border-[rgba(200,230,210,0.5)]">
              <p className="text-xs text-zinc-400 mb-1">{r.label}</p>
              <p className="text-xl font-bold mb-1" style={{ color: r.color }}>UGX {r.value.toLocaleString()}</p>
              <p className="text-xs text-zinc-300">{r.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f5f2]">
          <h2 className="font-bold text-[#141414]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#1a3d2b] hover:underline">View All →</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f8f6]">
                {["Customer", "Phone", "Items", "Total (UGX)", "Status", "Payment", "Time"].map((h) => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wide text-zinc-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#f0f5f2]">
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-zinc-400">No orders yet.</td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const s = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <tr key={order.id} className="border-t border-[#f0f5f2] hover:bg-[#f9fbf9] transition">
                      <td className="px-5 py-4 text-sm font-semibold text-[#141414]">{order.customer}</td>
                      <td className="px-5 py-4 text-xs text-zinc-400">{order.phone}</td>
                      <td className="px-5 py-4 text-xs text-zinc-500 max-w-xs truncate">{order.items}</td>
                      <td className="px-5 py-4 text-sm font-bold text-[#1a3d2b]">{order.total.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ color: s.color, background: s.bg }}>
                          {s.icon} {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: order.paymentStatus === "paid" ? "#d4edda" : order.paymentStatus === "failed" ? "#fde8e8" : "#fef3e2", color: order.paymentStatus === "paid" ? "#2d6a4f" : order.paymentStatus === "failed" ? "#e74c3c" : "#e67e22" }}>
                          {(order.paymentStatus || "unpaid").charAt(0).toUpperCase() + (order.paymentStatus || "unpaid").slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-zinc-400">{timeAgo(order.createdAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-5">
        {quickLinks.map((item) => (
          <Link key={item.label} href={item.href} className="bg-white rounded-2xl p-5 border-2 border-[rgba(200,230,210,0.5)] hover:-translate-y-1 hover:shadow-md transition-all duration-200 block">
            <div className="w-10 h-10 rounded-xl bg-[#f0f7f2] flex items-center justify-center text-[#1a3d2b] mb-3">{item.icon}</div>
            <p className="font-bold text-sm text-[#141414] mb-1">{item.label}</p>
            <p className="text-xs text-zinc-400">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
