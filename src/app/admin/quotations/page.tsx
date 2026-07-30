"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, Eye, Phone, Mail, MessageSquare, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Quotation = {
  _id: string; name: string; phone: string; email: string;
  message: string; referenceTotal: number;
  status: "new" | "contacted" | "converted" | "closed"; createdAt: string;
};
type StatusConfig = { label: string; color: string; bg: string };

const statusConfig: { [key: string]: StatusConfig } = {
  new:       { label: "New",       color: "#e67e22", bg: "#fef3e2" },
  contacted: { label: "Contacted", color: "#1a3d2b", bg: "#e8f5ed" },
  converted: { label: "Converted", color: "#2d6a4f", bg: "#d4edda" },
  closed:    { label: "Closed",    color: "#999",    bg: "#f5f5f5" },
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

function waLink(phone: string, text: string) {
  return "https://wa.me/256" + phone.replace(/^0/, "").replace(/\s/g, "") + "?text=" + encodeURIComponent(text);
}

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewQuote, setViewQuote] = useState<Quotation | null>(null);
  const [toast, setToast] = useState("");
  const [replyText, setReplyText] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const fetchQuotations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quotations");
      const data = await res.json();
      if (data.success) setQuotations(data.quotations || []);
      else setError(data.error || "Failed to load quotations.");
    } catch { setError("Network error loading quotations."); }
    setLoading(false);
  };

  useEffect(() => { fetchQuotations(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = async (id: string, status: Quotation["status"]) => {
    try {
      const res = await fetch("/api/quotations/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotations((prev) => prev.map((q) => q._id === id ? { ...q, status } : q));
        if (viewQuote?._id === id) setViewQuote((prev) => prev ? { ...prev, status } : prev);
        showToast("Status updated to " + status);
      } else { showToast("Failed to update status"); }
    } catch { showToast("Network error"); }
  };

  const sendQuotationEmail = async () => {
    if (!viewQuote || !viewQuote.email) { setEmailError("This customer did not provide an email address."); return; }
    if (!replyText.trim()) { setEmailError("Please type your quotation details before sending."); return; }
    setEmailSending(true); setEmailError(""); setEmailSent(false);
    try {
      const res = await fetch("/api/email/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toName: viewQuote.name, toEmail: viewQuote.email, toPhone: viewQuote.phone, quotationText: replyText, referenceTotal: viewQuote.referenceTotal || 0 }),
      });
      const data = await res.json();
      if (data.success) { setEmailSent(true); updateStatus(viewQuote._id, "contacted"); showToast("Quotation sent to " + viewQuote.email); }
      else { setEmailError(data.error || "Failed to send email."); }
    } catch { setEmailError("Network error sending email."); }
    setEmailSending(false);
  };

  const filtered = filterStatus === "all" ? quotations : quotations.filter((q) => q.status === filterStatus);
  const counts = {
    all: quotations.length,
    new: quotations.filter((q) => q.status === "new").length,
    contacted: quotations.filter((q) => q.status === "contacted").length,
    converted: quotations.filter((q) => q.status === "converted").length,
    closed: quotations.filter((q) => q.status === "closed").length,
  };

  return (
    <div className="p-8">
      {toast && (<div className="fixed bottom-6 right-6 z-50 bg-[#1a3d2b] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2"><CheckCircle size={15} /> {toast}</div>)}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Quotation Requests</h1>
          <p className="text-zinc-400 text-sm mt-1">Bulk quote requests from the website</p>
        </div>
        <button onClick={fetchQuotations} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition"><RefreshCw size={14} /> Refresh</button>
      </div>

      {error && (<div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4">{error}</div>)}

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[{ label: "New Requests", value: counts.new, color: "#e67e22" }, { label: "Contacted", value: counts.contacted, color: "#1a3d2b" }, { label: "Converted", value: counts.converted, color: "#2d6a4f" }, { label: "Closed", value: counts.closed, color: "#999" }].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border-2 border-[rgba(200,230,210,0.5)]">
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", "new", "contacted", "converted", "closed"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border-2"
            style={{ background: filterStatus === s ? "#1a3d2b" : "white", color: filterStatus === s ? "white" : "#555", borderColor: filterStatus === s ? "#1a3d2b" : "#d8e6dd" }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: filterStatus === s ? "rgba(255,255,255,0.2)" : "#f0f7f2", color: filterStatus === s ? "white" : "#1a3d2b" }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-300 bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)]">{quotations.length === 0 ? "No quotation requests yet. They will appear here when customers submit the form." : "No requests match this filter."}</div>
          ) : filtered.map((quote) => {
            const s = statusConfig[quote.status] || statusConfig.new;
            return (
              <div key={quote._id} className="bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="font-bold text-[#141414]">{quote.name}</p>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                      <span className="text-xs text-zinc-300">{timeAgo(quote.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-xs text-zinc-400 flex items-center gap-1"><Phone size={11} /> {quote.phone}</p>
                      {quote.email && (<p className="text-xs text-zinc-400 flex items-center gap-1"><Mail size={11} /> {quote.email}</p>)}
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{quote.message}</p>
                    {quote.referenceTotal > 0 && (<p className="text-xs text-[#1a3d2b] font-semibold mt-1">Ref. total: UGX {quote.referenceTotal.toLocaleString()}</p>)}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={"tel:" + quote.phone} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><Phone size={13} /></a>
                    <a href={waLink(quote.phone, "Hello, thank you for your quotation request from DAN K CHEAP STORES.")} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><MessageSquare size={13} /></a>
                    <button onClick={() => { setViewQuote(quote); setReplyText(""); setEmailSent(false); setEmailError(""); }} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><Eye size={13} /></button>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-[#f0f5f2]">
                  {(["new", "contacted", "converted", "closed"] as const).map((opt) => (
                    <button key={opt} onClick={() => updateStatus(quote._id, opt)} className="text-[10px] font-bold px-3 py-1.5 rounded-full transition-all border"
                      style={{ background: quote.status === opt ? statusConfig[opt].bg : "transparent", color: quote.status === opt ? statusConfig[opt].color : "#aaa", borderColor: quote.status === opt ? statusConfig[opt].color : "#e8e8e8" }}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f5f2]">
              <h3 className="font-bold text-[#141414]">Quotation Request</h3>
              <button onClick={() => setViewQuote(null)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition"><X size={15} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Status</span>
                <div className="flex gap-2">
                  {(["new", "contacted", "converted", "closed"] as const).map((opt) => (
                    <button key={opt} onClick={() => updateStatus(viewQuote._id, opt)} className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all border"
                      style={{ background: viewQuote.status === opt ? statusConfig[opt].bg : "transparent", color: viewQuote.status === opt ? statusConfig[opt].color : "#aaa", borderColor: viewQuote.status === opt ? statusConfig[opt].color : "#e8e8e8" }}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd] space-y-2">
                <p className="font-bold text-[#141414]">{viewQuote.name}</p>
                <div className="flex items-center gap-1 text-xs text-zinc-400"><Phone size={11} /> {viewQuote.phone}</div>
                {viewQuote.email && (<div className="flex items-center gap-1 text-xs text-zinc-400"><Mail size={11} /> {viewQuote.email}</div>)}
                <p className="text-xs text-zinc-300">{timeAgo(viewQuote.createdAt)}</p>
              </div>

              {viewQuote.referenceTotal > 0 && (
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd]">
                  <div className="flex items-center gap-2 text-xs text-zinc-400"><FileText size={13} /> Reference total from cart</div>
                  <span className="font-bold text-[#1a3d2b]">UGX {viewQuote.referenceTotal.toLocaleString()}</span>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Their Message</p>
                <p className="text-sm text-zinc-600 leading-relaxed bg-[#f5f8f6] p-4 rounded-xl border border-[#d8e6dd]">{viewQuote.message}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Your Reply / Notes</p>
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your quotation or internal notes here..." rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none" />
              </div>

              {emailError && (<p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">{emailError}</p>)}
              {emailSent && (<p className="text-xs text-[#1a3d2b] bg-[#e8f5ed] border border-[#d8e6dd] rounded-lg p-3">Quotation email sent successfully to {viewQuote.email}</p>)}
              <div className="grid grid-cols-2 gap-3">
                <a href={"tel:" + viewQuote.phone} className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition"><Phone size={15} /> Call Now</a>
                <a href={waLink(viewQuote.phone, replyText || "Hello, thank you for your quotation request from DAN K CHEAP STORES.")} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a3d2b] text-sm font-semibold text-white hover:opacity-90 transition"><MessageSquare size={15} /> WhatsApp</a>
              </div>
              {viewQuote.email && (
                <button onClick={sendQuotationEmail} disabled={emailSending} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c8961e] text-[#0d2418] text-sm font-bold hover:opacity-90 transition">
                  <Mail size={15} /> {emailSending ? "Sending..." : "Send Quotation by Email"}
                </button>
              )}
              {!viewQuote.email && (<p className="text-xs text-zinc-400 text-center">No email address provided by this customer.</p>)}

              <Button variant="outline" className="w-full border-2 border-[#d8e6dd] text-zinc-400" onClick={() => setViewQuote(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
