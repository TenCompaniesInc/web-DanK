"use client";

import { useState, useEffect } from "react";
import { Search, Phone, MessageSquare, Eye, X, RefreshCw, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type Customer = {
  name: string;
  phone: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
  delivery: string;
  orders: { id: string; total: number; status: string; items: string; createdAt: string }[];
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min" + (mins === 1 ? "" : "s") + " ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + " hr" + (hrs === 1 ? "" : "s") + " ago";
  return Math.floor(hrs / 24) + " day" + (Math.floor(hrs / 24) === 1 ? "" : "s") + " ago";
}

function waLink(phone: string) {
  return "https://wa.me/256" + phone.replace(/^0/, "").replace(/\s/g, "");
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, quotesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/quotations"),
      ]);
      const ordersData = await ordersRes.json();
      const quotesData = await quotesRes.json();

      if (!ordersData.success) { setError("Failed to load orders."); setLoading(false); return; }

      // Aggregate orders by phone number
      const map: { [phone: string]: Customer } = {};

      for (const order of ordersData.orders || []) {
        const key = order.phone?.replace(/\s/g, "") || "unknown";
        if (!map[key]) {
          map[key] = {
            name: order.customerName,
            phone: order.phone,
            email: order.email || "",
            orderCount: 0,
            totalSpent: 0,
            lastOrder: order.createdAt,
            delivery: order.total > 500000 ? "Wholesale" : "Retail",
            orders: [],
          };
        }
        map[key].orderCount += 1;
        map[key].totalSpent += order.total || 0;
        if (new Date(order.createdAt) > new Date(map[key].lastOrder)) {
          map[key].lastOrder = order.createdAt;
          map[key].name = order.customerName;
        }
        if (order.total > 500000) map[key].delivery = "Wholesale";
        if (!map[key].email && order.email) map[key].email = order.email;
        map[key].orders.push({
          id: order._id.slice(-6).toUpperCase(),
          total: order.total,
          status: order.status,
          items: order.items?.map((i: { name: string; qty: number }) => i.name + " x" + i.qty).join(", ") || "",
          createdAt: order.createdAt,
        });
      }

      // Also include converted quotations as customers
      for (const q of quotesData.quotations || []) {
        if (q.status !== "converted") continue;
        const key = q.phone?.replace(/\s/g, "") || "unknown";
        if (!map[key]) {
          map[key] = {
            name: q.name,
            phone: q.phone,
            email: q.email || "",
            orderCount: 0,
            totalSpent: q.referenceTotal || 0,
            lastOrder: q.createdAt,
            delivery: (q.referenceTotal || 0) > 500000 ? "Wholesale" : "Retail",
            orders: [{
              id: "QT-" + q._id.slice(-4).toUpperCase(),
              total: q.referenceTotal || 0,
              status: "converted",
              items: q.message || "Quotation",
              createdAt: q.createdAt,
            }],
          };
        } else {
          // Merge quotation into existing customer record
          if (!map[key].email && q.email) map[key].email = q.email;
          map[key].orders.push({
            id: "QT-" + q._id.slice(-4).toUpperCase(),
            total: q.referenceTotal || 0,
            status: "converted",
            items: q.message || "Quotation",
            createdAt: q.createdAt,
          });
        }
      }

      const sorted = Object.values(map).sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime());
      setCustomers(sorted);
    } catch { setError("Network error loading customers."); }
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.phone.includes(q);
    const matchFilter = filter === "all" || c.delivery.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders = customers.reduce((s, c) => s + c.orderCount, 0);
  const wholesale = customers.filter((c) => c.delivery === "Wholesale").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Customers</h1>
          <p className="text-zinc-400 text-sm mt-1">All customers derived from placed orders</p>
        </div>
        <button onClick={fetchCustomers} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (<div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">{error}</div>)}

      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Customers", value: customers.length, icon: <Users size={20} />, color: "#1a3d2b" },
          { label: "Total Orders", value: totalOrders, icon: <ShoppingCart size={20} />, color: "#c8961e" },
          { label: "Total Revenue", value: "UGX " + totalRevenue.toLocaleString(), icon: <TrendingUp size={20} />, color: "#2d6a4f" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border-2 border-[rgba(200,230,210,0.5)]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.color + "15", color: s.color }}>{s.icon}</div>
            <p className="text-2xl font-bold text-[#141414] mb-1">{s.value}</p>
            <p className="text-xs text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition bg-white" />
        </div>
        {["all", "wholesale", "retail"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2 transition-all"
            style={{ background: filter === f ? "#1a3d2b" : "white", color: filter === f ? "white" : "#555", borderColor: filter === f ? "#1a3d2b" : "#d8e6dd" }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8f6]">
                  {["Customer", "Phone", "Type", "Orders", "Total Spent", "Last Order", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-bold uppercase tracking-wide text-zinc-400 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-zinc-300 text-sm">{customers.length === 0 ? "No customers yet — they appear here once orders are placed." : "No customers match your search."}</td></tr>
                ) : filtered.map((c, i) => (
                  <tr key={i} className="border-t border-[#f0f5f2] hover:bg-[#f9fbf9] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "#1a3d2b" }}>{c.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="font-semibold text-sm text-[#141414]">{c.name}</p>
                          {c.email && <p className="text-xs text-zinc-400">{c.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500">{c.phone}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: c.delivery === "Wholesale" ? "#e8f5ed" : "#fef3e2", color: c.delivery === "Wholesale" ? "#1a3d2b" : "#e67e22" }}>{c.delivery}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#141414]">{c.orderCount}</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#1a3d2b]">UGX {c.totalSpent.toLocaleString()}</td>
                    <td className="px-5 py-4 text-xs text-zinc-400 whitespace-nowrap">{timeAgo(c.lastOrder)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <a href={"tel:" + c.phone} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><Phone size={13} /></a>
                        <a href={waLink(c.phone)} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><MessageSquare size={13} /></a>
                        <button onClick={() => setViewCustomer(c)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><Eye size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f5f2]">
              <h3 className="font-bold text-[#141414]">{viewCustomer.name}</h3>
              <button onClick={() => setViewCustomer(null)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition"><X size={15} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd] space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Contact</p>
                <p className="text-sm font-semibold text-[#141414]">{viewCustomer.name}</p>
                <p className="text-xs text-zinc-400">{viewCustomer.phone}</p>
                {viewCustomer.email && <p className="text-xs text-zinc-400">{viewCustomer.email}</p>}
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1" style={{ background: viewCustomer.delivery === "Wholesale" ? "#e8f5ed" : "#fef3e2", color: viewCustomer.delivery === "Wholesale" ? "#1a3d2b" : "#e67e22" }}>{viewCustomer.delivery}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd] text-center">
                  <p className="text-2xl font-bold text-[#1a3d2b]">{viewCustomer.orderCount}</p>
                  <p className="text-xs text-zinc-400 mt-1">Total Orders</p>
                </div>
                <div className="p-4 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd] text-center">
                  <p className="text-lg font-bold text-[#1a3d2b]">UGX {viewCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400 mt-1">Total Spent</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-3">Order History</p>
                <div className="space-y-2">
                  {viewCustomer.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 rounded-lg bg-[#f5f8f6] border border-[#d8e6dd]">
                      <div>
                        <p className="text-xs font-bold text-[#1a3d2b]">#{order.id}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{order.items}</p>
                        <p className="text-xs text-zinc-300">{timeAgo(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#1a3d2b]">UGX {order.total.toLocaleString()}</p>
                        <span className="text-[10px] font-bold" style={{ color: order.status === "delivered" ? "#2d6a4f" : order.status === "confirmed" ? "#1a3d2b" : order.status === "cancelled" ? "#e74c3c" : "#e67e22" }}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href={"tel:" + viewCustomer.phone} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition"><Phone size={15} /> Call</a>
                <a href={waLink(viewCustomer.phone)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a3d2b] text-sm font-semibold text-white hover:opacity-90 transition"><MessageSquare size={15} /> WhatsApp</a>
              </div>

              <Button variant="outline" className="w-full border-2 border-[#d8e6dd] text-zinc-400" onClick={() => setViewCustomer(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
