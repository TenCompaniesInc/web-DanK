"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, Truck, Search, Eye, X, RefreshCw, Mail, Phone as PhoneIcon, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderItem = { name: string; weight: string; price: number; qty: number };
type Order = {
  _id: string; customerName: string; phone: string; email: string;
  delivery: string; address: string; notes: string; network: string;
  momoNumber: string; items: OrderItem[]; total: number; status: string;
  paymentStatus: string; paymentConfirmationCode: string; createdAt: string;
};
type StatusConfig = { label: string; color: string; bg: string; icon: React.ReactNode };

const statusConfig: { [key: string]: StatusConfig } = {
  pending:   { label: "Pending",   color: "#e67e22", bg: "#fef3e2", icon: <Clock size={12} /> },
  confirmed: { label: "Confirmed", color: "#1a3d2b", bg: "#e8f5ed", icon: <CheckCircle size={12} /> },
  delivered: { label: "Delivered", color: "#2d6a4f", bg: "#d4edda", icon: <Truck size={12} /> },
  cancelled: { label: "Cancelled", color: "#e74c3c", bg: "#fde8e8", icon: <AlertCircle size={12} /> },
};

const paymentColors: { [key: string]: { color: string; bg: string } } = {
  paid:     { color: "#2d6a4f", bg: "#d4edda" },
  unpaid:   { color: "#e67e22", bg: "#fef3e2" },
  failed:   { color: "#e74c3c", bg: "#fde8e8" },
  reversed: { color: "#999",    bg: "#f5f5f5" },
};

const statusOptions = ["pending", "confirmed", "delivered", "cancelled"];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min" + (mins === 1 ? "" : "s") + " ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hr" + (hrs === 1 ? "" : "s") + " ago";
  return Math.floor(hrs / 24) + " day" + (Math.floor(hrs / 24) === 1 ? "" : "s") + " ago";
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setError(data.error || "Failed to load orders.");
    } catch { setError("Network error loading orders."); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/orders/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
        if (viewOrder?._id === id) setViewOrder((prev) => prev ? { ...prev, status } : prev);
        showToast("Status updated to " + status);
      } else { showToast("Failed to update status"); }
    } catch { showToast("Network error"); }
    setUpdatingId(null);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.customerName.toLowerCase().includes(q) || o.phone.includes(q) || o._id.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="p-8">
      {toast && (<div className="fixed bottom-6 right-6 z-50 bg-[#1a3d2b] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2"><CheckCircle size={15} /> {toast}</div>)}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">All customer orders placed on the website</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (<div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">{error}</div>)}

      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border-2"
            style={{ background: filterStatus === s ? "#1a3d2b" : "white", color: filterStatus === s ? "white" : "#555", borderColor: filterStatus === s ? "#1a3d2b" : "#d8e6dd" }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: filterStatus === s ? "rgba(255,255,255,0.2)" : "#f0f7f2", color: filterStatus === s ? "white" : "#1a3d2b" }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or ID..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition bg-white" />
      </div>

      <div className="bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8f6]">
                  {["Order", "Customer", "Items", "Total", "Network", "Delivery", "Payment", "Status", "Time", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-bold uppercase tracking-wide text-zinc-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-16 text-zinc-300 text-sm">{orders.length === 0 ? "No orders yet — they will appear here as customers place them." : "No orders match your search."}</td></tr>
                ) : filtered.map((order) => {
                  const s = statusConfig[order.status] || statusConfig.pending;
                  const p = paymentColors[order.paymentStatus] || paymentColors.unpaid;
                  return (
                    <tr key={order._id} className="border-t border-[#f0f5f2] hover:bg-[#f9fbf9] transition">
                      <td className="px-4 py-4 text-xs font-bold text-[#1a3d2b]">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-sm text-[#141414]">{order.customerName}</p>
                        <p className="text-xs text-zinc-400">{order.phone}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-zinc-500 max-w-[140px]">{order.items?.map((i, idx) => (<div key={idx}>{i.name} ×{i.qty}</div>))}</td>
                      <td className="px-4 py-4 text-sm font-bold text-[#1a3d2b]">UGX {order.total?.toLocaleString()}</td>
                      <td className="px-4 py-4 text-xs text-zinc-400 uppercase">{order.network}</td>
                      <td className="px-4 py-4 text-xs text-zinc-400">{order.delivery === "collect" ? "Collect" : "Delivery"}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: p.color, background: p.bg }}>{(order.paymentStatus || "unpaid").charAt(0).toUpperCase() + (order.paymentStatus || "unpaid").slice(1)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <select value={order.status} disabled={updatingId === order._id} onChange={(e) => updateStatus(order._id, e.target.value)} className="text-[10px] font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none" style={{ background: s.bg, color: s.color }}>
                          {statusOptions.map((opt) => (<option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-xs text-zinc-400 whitespace-nowrap">{timeAgo(order.createdAt)}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => setViewOrder(order)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><Eye size={13} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f5f2]">
              <h3 className="font-bold text-[#141414]">Order #{viewOrder._id.slice(-6).toUpperCase()}</h3>
              <button onClick={() => setViewOrder(null)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition"><X size={15} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Order Status</span>
                <select value={viewOrder.status} onChange={(e) => updateStatus(viewOrder._id, e.target.value)} className="text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none" style={{ background: (statusConfig[viewOrder.status] || statusConfig.pending).bg, color: (statusConfig[viewOrder.status] || statusConfig.pending).color }}>
                  {statusOptions.map((opt) => (<option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd] space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Customer</p>
                <p className="text-sm font-semibold text-[#141414]">{viewOrder.customerName}</p>
                <div className="flex items-center gap-1 text-xs text-zinc-400"><PhoneIcon size={11} /> {viewOrder.phone}</div>
                {viewOrder.email && (<div className="flex items-center gap-1 text-xs text-zinc-400"><Mail size={11} /> {viewOrder.email}</div>)}
                <p className="text-xs text-zinc-400">{viewOrder.delivery === "collect" ? "Collecting from store" : "Delivery to: " + viewOrder.address}</p>
                {viewOrder.notes && (<p className="text-xs text-zinc-400 italic">Note: {viewOrder.notes}</p>)}
              </div>

              <div className="p-4 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd] space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Payment</p>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Status</span>
                  <span className="font-bold px-2 py-0.5 rounded-full" style={{ color: (paymentColors[viewOrder.paymentStatus] || paymentColors.unpaid).color, background: (paymentColors[viewOrder.paymentStatus] || paymentColors.unpaid).bg }}>
                    {(viewOrder.paymentStatus || "unpaid").charAt(0).toUpperCase() + (viewOrder.paymentStatus || "unpaid").slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Network</span>
                  <span className="font-semibold uppercase text-[#141414]">{viewOrder.network}</span>
                </div>
                {viewOrder.momoNumber && (<div className="flex justify-between text-xs"><span className="text-zinc-400">MoMo Number</span><span className="font-semibold text-[#141414]">{viewOrder.momoNumber}</span></div>)}
                {viewOrder.paymentConfirmationCode && (<div className="flex justify-between text-xs"><span className="text-zinc-400">Confirmation</span><span className="font-semibold text-[#1a3d2b]">{viewOrder.paymentConfirmationCode}</span></div>)}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {viewOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#f5f8f6] border border-[#d8e6dd]">
                      <div><p className="text-sm font-semibold text-[#141414]">{item.name}</p><p className="text-xs text-zinc-400">{item.weight} × {item.qty}</p></div>
                      <p className="text-sm font-bold text-[#1a3d2b]">UGX {(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#d8e6dd]">
                <span className="font-bold text-[#141414]">Total</span>
                <span className="text-xl font-bold text-[#1a3d2b]">UGX {viewOrder.total?.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-xs text-zinc-400">
                <span>Placed</span><span>{timeAgo(viewOrder.createdAt)}</span>
              </div>

              <Button className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white" onClick={() => setViewOrder(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
