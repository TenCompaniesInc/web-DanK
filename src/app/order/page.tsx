"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Phone, MapPin, User, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";

const riceWeights = [
  { type: "Long Grain White Rice", weights: [{ label: "1kg", price: 3200 }, { label: "5kg", price: 15500 }, { label: "25kg", price: 75000 }, { label: "50kg", price: 145000 }, { label: "100kg", price: 285000 }] },
  { type: "Basmati Rice (Imported)", weights: [{ label: "1kg", price: 7200 }, { label: "5kg", price: 35000 }, { label: "10kg", price: 68000 }, { label: "25kg", price: 165000 }] },
  { type: "Brown Organic Rice", weights: [{ label: "1kg", price: 4400 }, { label: "5kg", price: 21000 }, { label: "25kg", price: 105000 }, { label: "50kg", price: 200000 }] },
  { type: "Parboiled Rice", weights: [{ label: "1kg", price: 2900 }, { label: "5kg", price: 14000 }, { label: "25kg", price: 68000 }, { label: "50kg", price: 132000 }, { label: "100kg", price: 260000 }] },
  { type: "Local Ugandan Rice", weights: [{ label: "1kg", price: 2400 }, { label: "5kg", price: 11500 }, { label: "25kg", price: 56000 }, { label: "50kg", price: 108000 }, { label: "100kg", price: 210000 }] },
  { type: "Jasmine Rice", weights: [{ label: "1kg", price: 5800 }, { label: "5kg", price: 28000 }, { label: "25kg", price: 135000 }] },
];

type Step = "cart" | "details" | "payment" | "confirm";
type PayNetwork = "mtn" | "airtel" | "card" | null;

export default function OrderPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("cart");
  const [payNetwork, setPayNetwork] = useState<PayNetwork>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", delivery: "collect", notes: "" });
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; email?: string }>({});
  const [momoNumber, setMomoNumber] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [editingCartId, setEditingCartId] = useState<number | null>(null);
  const [editCartValue, setEditCartValue] = useState("");
  const [momoError, setMomoError] = useState("");

  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteSending, setQuoteSending] = useState(false);

  const isValidPhone = (v: string) => /^[0-9]{10}$/.test(v.replace(/\s/g, ""));
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "phone" || name === "email") setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateDetails = () => {
    const errs: { phone?: string; email?: string } = {};
    if (!isValidPhone(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email address";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = async () => {
    if (!payNetwork || !form.phone) return;
    if (payNetwork !== "card" && !isValidPhone(momoNumber)) { setMomoError("Enter a valid 10-digit mobile money number"); return; }
    setMomoError("");
    setProcessing(true);
    setError("");
    try {
      const orderPayload = {
        customerName: form.name, phone: form.phone, email: form.email, delivery: form.delivery, address: form.address, notes: form.notes, network: payNetwork, momoNumber,
        items: cart.map((item) => ({ name: item.name, weight: item.weight, price: item.price, qty: item.qty })),
        total: totalPrice(),
      };
      const res = await fetch("/api/payment/initiate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderPayload) });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        clearCart();
        setIframeUrl(data.redirectUrl);
        setProcessing(false);
      } else {
        setError(data.error || "Failed to start payment. Please try again.");
        setProcessing(false);
      }
    } catch (err) { setError("Network error. Please check your connection."); setProcessing(false); }
  };

  const handleQuote = async () => {
    if (!quoteName || !quotePhone || !quoteMessage) return;
    setQuoteSending(true);
    try {
      const res = await fetch("/api/quotations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: quoteName, phone: quotePhone, email: quoteEmail, message: quoteMessage, referenceTotal: totalPrice() }) });
      const data = await res.json();
      if (data.success) setQuoteSent(true);
    } catch (err) { console.error("Quotation error:", err); }
    setQuoteSending(false);
  };

  const steps: Step[] = ["cart", "details", "payment", "confirm"];
  const stepLabels = ["Cart", "Your Info", "Payment", "Done"];

  return (
    <main className="min-h-screen bg-[#f5f8f6]">

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain" />
            <div className="leading-tight">
              <p className="text-xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
              <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>
          <div className="hidden md:block"><NavHeader /></div>
          <Link href="/products" className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Shop Rice</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Buy & Quote</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#141414]">Order & Get a Quotation</h1>
          <p className="text-zinc-400 mt-2 text-sm">Complete your order below or request a bulk quotation.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!done && (
              <div className="flex items-center gap-1 sm:gap-2 mb-4 overflow-x-auto">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{ background: step === s ? "#1a3d2b" : steps.indexOf(step) > i ? "#c8961e" : "#d8e6dd", color: step === s || steps.indexOf(step) > i ? "white" : "#aaa" }}>
                      {steps.indexOf(step) > i ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${step === s ? "text-[#1a3d2b]" : "text-zinc-400"}`}>{stepLabels[i]}</span>
                    {i < steps.length - 1 && (<div className="h-px w-6 sm:w-10" style={{ background: steps.indexOf(step) > i ? "#c8961e" : "#d8e6dd" }} />)}
                  </div>
                ))}
              </div>
            )}

            {step === "cart" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-[#1a3d2b] mb-4 flex items-center gap-2"><ShoppingCart size={18} /> Your Cart</h2>
                    {cart.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="text-zinc-400 text-sm mb-4">Your cart is empty</p>
                        <Link href="/products" className="text-sm font-semibold text-[#1a3d2b] underline">Browse Products →</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd]">
                            <img src={item.image + "?w=120"} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#141414]">{item.name}</p>
                              <p className="text-xs text-zinc-400 mb-1">{item.weight}</p>
                              <p className="font-bold text-[#1a3d2b] text-sm">UGX {(item.price * item.qty).toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-6 h-6 rounded-md border border-[#d8e6dd] flex items-center justify-center hover:bg-white transition"><Minus size={12} /></button>
                                {editingCartId === item.id ? (
                                  <input type="text" inputMode="numeric" autoFocus value={editCartValue}
                                    onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setEditCartValue(v); const n = parseInt(v); if (!isNaN(n) && n >= 1) updateQuantity(item.id, n); }}
                                    onBlur={() => { const n = parseInt(editCartValue); updateQuantity(item.id, isNaN(n) || n < 1 ? 1 : n); setEditingCartId(null); }}
                                    onKeyDown={(e) => { if (e.key === "Enter") { const n = parseInt(editCartValue); updateQuantity(item.id, isNaN(n) || n < 1 ? 1 : n); setEditingCartId(null); }}}
                                    className="w-10 text-center text-sm font-semibold border border-[#1a3d2b] rounded-md focus:outline-none" />
                                ) : (
                                  <button onClick={() => { setEditingCartId(item.id); setEditCartValue(String(item.qty)); }} className="text-sm font-semibold w-8 text-center hover:bg-[#f0f7f2] rounded-md py-0.5 transition">{item.qty}</button>
                                )}
                                <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-6 h-6 rounded-md border border-[#d8e6dd] flex items-center justify-center hover:bg-white transition"><Plus size={12} /></button>
                                <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 hover:text-red-600 transition"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-[#d8e6dd] pt-4 flex justify-between items-center">
                          <span className="font-bold text-[#141414]">Total</span>
                          <span className="text-2xl font-bold text-[#1a3d2b]">UGX {totalPrice().toLocaleString()}</span>
                        </div>
                        <Button className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white h-11 text-sm font-semibold" onClick={() => setStep("details")}>Continue to Your Info <ArrowRight size={16} className="ml-1" /></Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#1a3d2b] mb-2 flex items-center gap-2"><User size={18} /> Your Information</h2>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Full Name</label>
                      <input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. John Ssekandi" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Phone Number (10 digits)</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={(e) => { const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 10); setForm({ ...form, phone: digits }); setFieldErrors((prev) => ({ ...prev, phone: undefined })); }}
                        inputMode="numeric"
                        placeholder="e.g. 0700212147"
                        className="w-full px-4 py-3 rounded-xl border-2 bg-white text-sm focus:outline-none transition"
                        style={{ borderColor: fieldErrors.phone ? "#e74c3c" : "#d8e6dd" }}
                      />
                      {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Email (for your receipt)</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleFormChange}
                        placeholder="e.g. john@example.com"
                        className="w-full px-4 py-3 rounded-xl border-2 bg-white text-sm focus:outline-none transition"
                        style={{ borderColor: fieldErrors.email ? "#e74c3c" : "#d8e6dd" }}
                      />
                      {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Delivery Option</label>
                      <select name="delivery" value={form.delivery} onChange={handleFormChange} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition">
                        <option value="collect">Collect from Store — Covenant Building, Kisenyi</option>
                        <option value="delivery">Delivery within Uganda</option>
                      </select>
                    </div>
                    {form.delivery === "delivery" && (
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Delivery Address</label>
                        <input name="address" value={form.address} onChange={handleFormChange} placeholder="e.g. Ntinda, Kampala" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                        <p className="text-[11px] text-zinc-400 mt-1.5">We'll route your order to your nearest branch for fast delivery.</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Additional Notes (optional)</label>
                      <textarea name="notes" value={form.notes} onChange={handleFormChange} placeholder="Any special instructions..." rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1 border-2 border-[#d8e6dd] text-zinc-500 h-11" onClick={() => setStep("cart")}>Back</Button>
                      <Button className="flex-1 bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white h-11 font-semibold" onClick={() => { if (!form.name) return; if (!validateDetails()) return; setStep("payment"); }}>Continue to Payment <ArrowRight size={16} className="ml-1" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "payment" && !done && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-bold text-[#1a3d2b] flex items-center gap-2"><Phone size={18} /> Pay with Mobile Money</h2>
                    <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-3">Order Summary</p>
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-zinc-600">{item.name} x {item.qty}<span className="text-zinc-400 ml-1">({item.weight})</span></span>
                          <span className="font-semibold text-[#1a3d2b]">UGX {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#d8e6dd] pt-2 mt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[#1a3d2b] text-lg">UGX {totalPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 pt-1">
                        <span className="flex items-center gap-1"><User size={11} /> {form.name}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />{form.delivery === "collect" ? "Collect from store" : form.address}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Select Network</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => { setPayNetwork("mtn"); setMomoError(""); }} className="p-4 rounded-xl border-2 text-center transition-all" style={{ borderColor: payNetwork === "mtn" ? "#FFCC00" : "#d8e6dd", background: payNetwork === "mtn" ? "#fffbe6" : "white" }}>
                        <div className="flex items-center justify-center mb-1">
                          <svg viewBox="0 0 80 30" width="56" height="21" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="30" rx="4" fill="#FFCC00"/><text x="40" y="22" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="16" fill="#000">MTN</text></svg>
                        </div>
                        <p className="font-bold text-sm text-[#141414]">MTN MoMo</p><p className="text-xs text-zinc-400">*165#</p>
                      </button>
                      <button onClick={() => { setPayNetwork("airtel"); setMomoError(""); }} className="p-4 rounded-xl border-2 text-center transition-all" style={{ borderColor: payNetwork === "airtel" ? "#E40000" : "#d8e6dd", background: payNetwork === "airtel" ? "#fff0f0" : "white" }}>
                        <div className="flex items-center justify-center mb-1">
                          <svg viewBox="0 0 80 30" width="56" height="21" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="30" rx="4" fill="#E40000"/><text x="40" y="22" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="14" fill="#fff">AIRTEL</text></svg>
                        </div>
                        <p className="font-bold text-sm text-[#141414]">Airtel Money</p><p className="text-xs text-zinc-400">*185#</p>
                      </button>
                      <button onClick={() => { setPayNetwork("card"); setMomoError(""); }} className="p-4 rounded-xl border-2 text-center transition-all col-span-2" style={{ borderColor: payNetwork === "card" ? "#1a3d2b" : "#d8e6dd", background: payNetwork === "card" ? "rgba(26,61,43,0.05)" : "white" }}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <svg viewBox="0 0 48 30" width="38" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="30" rx="4" fill="#1A1F71"/><circle cx="19" cy="15" r="9" fill="#EB001B"/><circle cx="29" cy="15" r="9" fill="#F79E1B"/><path d="M24 8.3A9 9 0 0 1 28 15a9 9 0 0 1-4 6.7A9 9 0 0 1 20 15a9 9 0 0 1 4-6.7z" fill="#FF5F00"/></svg>
                          <svg viewBox="0 0 48 30" width="38" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="30" rx="4" fill="#EB001B"/><text x="24" y="21" textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="13" fill="#fff">MC</text></svg>
                        </div>
                        <p className="font-bold text-sm text-[#141414]">Pay with Card</p><p className="text-xs text-zinc-400">Visa / Mastercard</p>
                      </button>
                    </div>

                    {payNetwork && payNetwork !== "card" && (
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">
                          {payNetwork === "mtn" ? "MTN" : "Airtel"} Money Number (10 digits)
                        </label>
                        <input
                          value={momoNumber}
                          onChange={(e) => { setMomoNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setMomoError(""); }}
                          inputMode="numeric"
                          placeholder="e.g. 0700212147"
                          className="w-full px-4 py-3 rounded-xl border-2 bg-white text-sm focus:outline-none transition"
                          style={{ borderColor: momoError ? "#e74c3c" : "#d8e6dd" }}
                        />
                        {momoError ? (
                          <p className="text-xs text-red-500 mt-1">{momoError}</p>
                        ) : (
                          <p className="text-[11px] text-zinc-400 mt-1.5">The payment prompt will be sent to this number.</p>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-zinc-400 leading-relaxed bg-[#f5f8f6] rounded-lg p-3 border border-[#d8e6dd]">You'll be redirected to a secure payment page to complete your {payNetwork === "mtn" ? "MTN MoMo" : "Airtel Money"} payment using <strong className="text-[#1a3d2b]">{momoNumber || "the number you enter above"}</strong>.</p>
                    {error && (<p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>)}
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="flex-1 border-2 border-[#d8e6dd] text-zinc-500 h-11" onClick={() => setStep("details")}>Back</Button>
                      <Button className="flex-1 bg-[#c8961e] hover:opacity-90 text-[#0d2418] font-bold h-11" onClick={handlePay} disabled={!payNetwork || processing}>{processing ? "Redirecting to payment..." : "Pay UGX " + totalPrice().toLocaleString() + " →"}</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {done && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-10 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-[#1a3d2b] mb-2">Order Placed!</h2>
                    <p className="text-zinc-400 text-sm mb-2">Your order has been saved. Payment prompt sent to <strong className="text-[#1a3d2b]">{momoNumber}</strong>.</p>
                    {form.email && <p className="text-zinc-400 text-sm mb-2">A receipt will be sent to <strong className="text-[#1a3d2b]">{form.email}</strong>.</p>}
                    {orderId && (<p className="text-xs text-zinc-300 mb-4">Order ID: <span className="font-mono text-zinc-400">{orderId.slice(-8).toUpperCase()}</span></p>)}
                    <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] text-left mb-6 space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Order Details</p>
                      <p className="text-sm text-zinc-600"><strong>Name:</strong> {form.name}</p>
                      <p className="text-sm text-zinc-600"><strong>Phone:</strong> {form.phone}</p>
                      <p className="text-sm text-zinc-600"><strong>Delivery:</strong> {form.delivery === "collect" ? "Collect from Covenant Building, Kisenyi" : form.address}</p>
                      {form.notes && <p className="text-sm text-zinc-600"><strong>Notes:</strong> {form.notes}</p>}
                    </div>
                    <Link href="/" className="inline-block bg-[#1a3d2b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">Back to Home</Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* QUOTATION CARD - inline in left column */}
            <div id="quotation" className="scroll-mt-24">
              <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                <CardContent className="p-6 space-y-4">
                  <div className="mb-2">
                    <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1">Quotation</p>
                    <h3 className="text-xl font-bold text-[#141414]">Get a Custom Quotation</h3>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">For bulk orders, wholesale supply, or recurring needs — tell us what you need and we will reply within 30 minutes.</p>
                  </div>

                  {quoteSent ? (
                    <div className="text-center py-8">
                      <p className="text-4xl mb-3">💬</p>
                      <h3 className="font-bold text-[#1a3d2b] text-lg mb-2">Quotation Request Sent!</h3>
                      <p className="text-sm text-zinc-400 mb-4">We will get back to you within 30 minutes with a custom quote. Check your phone and email.</p>
                      <button onClick={() => setQuoteSent(false)} className="text-sm font-semibold text-[#1a3d2b] underline">Send another request</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Your Name</label>
                          <input value={quoteName} onChange={(e) => setQuoteName(e.target.value)} placeholder="e.g. John Ssekandi" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Phone Number</label>
                          <input value={quotePhone} onChange={(e) => setQuotePhone(e.target.value)} placeholder="0700 212 147" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Email (optional — for your quotation copy)</label>
                        <input type="email" value={quoteEmail} onChange={(e) => setQuoteEmail(e.target.value)} placeholder="e.g. john@example.com" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">What do you need?</label>
                        <textarea value={quoteMessage} onChange={(e) => setQuoteMessage(e.target.value)} placeholder="e.g. 50 sacks of Long Grain White Rice, 20 sacks of Basmati — for weekly restaurant supply..." rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none" />
                      </div>
                      <p className="text-xs text-zinc-400 bg-[#f5f8f6] rounded-xl p-3 border border-[#d8e6dd] leading-relaxed">
                        We serve hotels, schools, hospitals, restaurants and wholesale traders. Minimum quotation order: 10 sacks. Delivery available Uganda-wide.
                      </p>
                      <Button className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white h-12 text-sm font-bold" onClick={handleQuote} disabled={quoteSending}>
                        {quoteSending ? "Sending..." : "Send Quotation Request →"}
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <a href="tel:0700212147" className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition">📞 Call: 0700 212 147</a>
                        <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition">💬 WhatsApp Us</a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

          <div className="space-y-6">
            <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-[#1a3d2b] mb-4 flex items-center gap-2 uppercase tracking-wide"><Package size={15} /> Rice Price Guide</h3>
                <div className="space-y-5">
                  {riceWeights.map((rice) => (
                    <div key={rice.type}>
                      <p className="text-xs font-bold text-[#c8961e] uppercase tracking-wide mb-2">{rice.type}</p>
                      <div className="space-y-1">
                        {rice.weights.map((w) => (
                          <div key={w.label} className="flex justify-between items-center py-1 border-b border-[#f0f5f2] last:border-0">
                            <span className="text-xs text-zinc-500">{w.label}</span>
                            <span className="text-xs font-bold text-[#1a3d2b]">UGX {w.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>



      {/* FOOTER */}
      <footer className="bg-[#141414] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/emblem.png" alt="DAN K" width={36} height={36} className="object-contain" />
                <div><p className="font-bold text-white text-sm">DAN K</p><p className="text-[#c8961e] text-[10px] tracking-widest uppercase">Origin of Quality</p></div>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Premium rice and grain store. Head office in Nansana, main branch at Covenant Building, Kisenyi. Branches in Jinja, Luweero & Katooke.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-4">Quick Links</p>
              <div className="flex flex-col gap-2">{["Products", "About", "Order", "Contact"].map((l) => (<Link key={l} href={"/" + l.toLowerCase()} className="text-zinc-500 text-sm hover:text-[#c8961e] transition">{l}</Link>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-4">Contact</p>
              <div className="text-zinc-500 text-sm leading-loose">
                <p>Covenant Building, Kisenyi, Kampala</p>
                <p>0700 212 147</p>
                <p>Sun–Fri · 7am – 7:30pm (Closed Sat)</p>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-6 flex items-center justify-between text-xs text-zinc-600">
            <p>2026 DAN K CHEAP STORES LTD</p>
            <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white" title="Chat with Support on WhatsApp"><MessageCircle size={22} /></a>

      {iframeUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-[rgba(200,230,210,0.6)] overflow-hidden" style={{ height: "85vh" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#d8e6dd]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#f0f7f2] flex items-center justify-center">🔒</div>
                <div>
                  <p className="text-sm font-bold text-[#141414]">Secure Payment</p>
                  <p className="text-xs text-zinc-400">Powered by Pesapal</p>
                </div>
              </div>
              <button onClick={() => setIframeUrl("")} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-red-500 transition text-lg">✕</button>
            </div>
            <iframe src={iframeUrl} className="w-full" style={{ height: "calc(85vh - 56px)" }} allow="payment" title="Pesapal Payment" />
          </div>
        </div>
      )}
    </main>
  );
}
