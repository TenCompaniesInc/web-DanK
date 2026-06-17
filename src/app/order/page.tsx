"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Phone, MapPin, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";

const riceWeights = [
  { type: "Long Grain White Rice", weights: [
    { label: "1kg", price: 3200 },
    { label: "5kg", price: 15500 },
    { label: "25kg", price: 75000 },
    { label: "50kg", price: 145000 },
    { label: "100kg", price: 285000 },
  ]},
  { type: "Basmati Rice (Imported)", weights: [
    { label: "1kg", price: 7200 },
    { label: "5kg", price: 35000 },
    { label: "10kg", price: 68000 },
    { label: "25kg", price: 165000 },
  ]},
  { type: "Brown Organic Rice", weights: [
    { label: "1kg", price: 4400 },
    { label: "5kg", price: 21000 },
    { label: "25kg", price: 105000 },
    { label: "50kg", price: 200000 },
  ]},
  { type: "Parboiled Rice", weights: [
    { label: "1kg", price: 2900 },
    { label: "5kg", price: 14000 },
    { label: "25kg", price: 68000 },
    { label: "50kg", price: 132000 },
    { label: "100kg", price: 260000 },
  ]},
  { type: "Local Ugandan Rice", weights: [
    { label: "1kg", price: 2400 },
    { label: "5kg", price: 11500 },
    { label: "25kg", price: 56000 },
    { label: "50kg", price: 108000 },
    { label: "100kg", price: 210000 },
  ]},
  { type: "Jasmine Rice", weights: [
    { label: "1kg", price: 5800 },
    { label: "5kg", price: 28000 },
    { label: "25kg", price: 135000 },
  ]},
];

type Step = "cart" | "details" | "payment" | "confirm";
type PayNetwork = "mtn" | "airtel" | null;

export default function OrderPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("cart");
  const [payNetwork, setPayNetwork] = useState<PayNetwork>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    delivery: "collect",
    notes: "",
  });

  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = () => {
    if (!payNetwork || !form.phone) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      clearCart();
    }, 2500);
  };

  const handleQuote = () => {
    if (!quoteName || !quotePhone || !quoteMessage) return;
    setQuoteSent(true);
  };

  const steps: Step[] = ["cart", "details", "payment", "confirm"];
  const stepLabels = ["Cart", "Your Info", "Payment", "Done"];

  return (
    <main className="min-h-screen bg-[#f5f8f6]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain" />
            <div className="leading-tight">
              <p className="text-xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
              <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>
          <div className="hidden md:block">
            <NavHeader />
          </div>
          <Link href="/products" className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">
            Shop Rice
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Buy & Quote</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#141414]">Order & Get a Quotation</h1>
          <p className="text-zinc-400 mt-2 text-sm">Complete your order below or request a bulk quotation.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT — Order flow */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step indicator */}
            {!done && (
              <div className="flex items-center gap-2 mb-2">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s
                          ? "bg-[#1a3d2b] text-white"
                          : steps.indexOf(step) > i
                          ? "bg-[#c8961e] text-[#1a3d2b]"
                          : "bg-[#d8e6dd] text-zinc-400"
                      }`}
                    >
                      {steps.indexOf(step) > i ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${step === s ? "text-[#1a3d2b]" : "text-zinc-400"}`}>
                      {stepLabels[i]}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`h-px w-6 sm:w-10 ${steps.indexOf(step) > i ? "bg-[#c8961e]" : "bg-[#d8e6dd]"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1 — Cart */}
            {step === "cart" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-[#1a3d2b] mb-4 flex items-center gap-2">
                      <ShoppingCart size={18} /> Your Cart
                    </h2>

                    {cart.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-5xl mb-4">🛒</p>
                        <p className="text-zinc-400 text-sm mb-4">Your cart is empty</p>
                        <Link href="/products" className="text-sm font-semibold text-[#1a3d2b] underline">
                          Browse Products →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-[#f5f8f6] border border-[#d8e6dd]">
                            <img
                              src={`${item.image}?w=120`}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#141414]">{item.name}</p>
                              <p className="text-xs text-zinc-400 mb-1">{item.weight}</p>
                              <p className="font-bold text-[#1a3d2b] text-sm">
                                UGX {(item.price * item.qty).toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.qty - 1)}
                                  className="w-6 h-6 rounded-md border border-[#d8e6dd] flex items-center justify-center hover:bg-white transition"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.qty + 1)}
                                  className="w-6 h-6 rounded-md border border-[#d8e6dd] flex items-center justify-center hover:bg-white transition"
                                >
                                  <Plus size={12} />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-red-400 hover:text-red-600 transition"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="border-t border-[#d8e6dd] pt-4 flex justify-between items-center">
                          <span className="font-bold text-[#141414]">Total</span>
                          <span className="text-2xl font-bold text-[#1a3d2b]">
                            UGX {totalPrice().toLocaleString()}
                          </span>
                        </div>

                        <Button
                          className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white h-11 text-sm font-semibold"
                          onClick={() => setStep("details")}
                        >
                          Continue to Your Info <ArrowRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 2 — Customer Details */}
            {step === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#1a3d2b] mb-2 flex items-center gap-2">
                      <User size={18} /> Your Information
                    </h2>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="e.g. John Ssekandi"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">
                        Phone Number (Mobile Money)
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="e.g. 0700 212 147"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">
                        Delivery Option
                      </label>
                      <select
                        name="delivery"
                        value={form.delivery}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                      >
                        <option value="collect">Collect from Store — 26d Kisenyi Road</option>
                        <option value="delivery">Delivery within Kampala</option>
                      </select>
                    </div>

                    {form.delivery === "delivery" && (
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">
                          Delivery Address
                        </label>
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleFormChange}
                          placeholder="e.g. Ntinda, Kampala"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleFormChange}
                        placeholder="Any special instructions..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-[#d8e6dd] text-zinc-500 h-11"
                        onClick={() => setStep("cart")}
                      >
                        ← Back
                      </Button>
                      <Button
                        className="flex-1 bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white h-11 font-semibold"
                        onClick={() => {
                          if (!form.name || !form.phone) return;
                          setStep("payment");
                        }}
                      >
                        Continue to Payment <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 3 — Payment */}
            {step === "payment" && !done && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-bold text-[#1a3d2b] flex items-center gap-2">
                      <Phone size={18} /> Pay with Mobile Money
                    </h2>

                    {/* Order summary */}
                    <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-3">Order Summary</p>
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-zinc-600">{item.name} × {item.qty} <span className="text-zinc-400">({item.weight})</span></span>
                          <span className="font-semibold text-[#1a3d2b]">UGX {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#d8e6dd] pt-2 mt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[#1a3d2b] text-lg">UGX {totalPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 pt-1">
                        <span className="flex items-center gap-1"><User size={11} /> {form.name}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {form.delivery === "collect" ? "Collect from store" : form.address}</span>
                      </div>
                    </div>

                    {/* Network select */}
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Select Network</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPayNetwork("mtn")}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          payNetwork === "mtn"
                            ? "border-[#1a3d2b] bg-[#1a3d2b]/5"
                            : "border-[#d8e6dd] bg-white hover:border-[#1a3d2b]/40"
                        }`}
                      >
                        <p className="text-2xl mb-1">📱</p>
                        <p className="font-bold text-sm text-[#141414]">MTN MoMo</p>
                        <p className="text-xs text-zinc-400">Dial *165#</p>
                      </button>
                      <button
                        onClick={() => setPayNetwork("airtel")}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          payNetwork === "airtel"
                            ? "border-[#1a3d2b] bg-[#1a3d2b]/5"
                            : "border-[#d8e6dd] bg-white hover:border-[#1a3d2b]/40"
                        }`}
                      >
                        <p className="text-2xl mb-1">📲</p>
                        <p className="font-bold text-sm text-[#141414]">Airtel Money</p>
                        <p className="text-xs text-zinc-400">Dial *185#</p>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed bg-[#f5f8f6] rounded-lg p-3 border border-[#d8e6dd]">
                      A payment prompt will be sent to <strong className="text-[#1a3d2b]">{form.phone}</strong>. Approve it on your phone to complete the order. You will receive a confirmation SMS once payment is processed.
                    </p>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-[#d8e6dd] text-zinc-500 h-11"
                        onClick={() => setStep("details")}
                      >
                        ← Back
                      </Button>
                      <Button
                        className="flex-1 bg-[#c8961e] hover:opacity-90 text-[#0d2418] font-bold h-11"
                        onClick={handlePay}
                        disabled={!payNetwork || processing}
                      >
                        {processing ? "Sending prompt..." : `Pay UGX ${totalPrice().toLocaleString()} →`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 4 — Done */}
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
                  <CardContent className="p-10 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-[#1a3d2b] mb-2">Order Placed!</h2>
                    <p className="text-zinc-400 text-sm mb-2">
                      Payment prompt sent to <strong className="text-[#1a3d2b]">{form.phone}</strong>.
                    </p>
                    <p className="text-zinc-400 text-sm mb-6">
                      Approve it on your phone. You'll receive a confirmation SMS once processed.
                    </p>
                    <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] text-left mb-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Order Details</p>
                      <p className="text-sm text-zinc-600"><strong>Name:</strong> {form.name}</p>
                      <p className="text-sm text-zinc-600"><strong>Phone:</strong> {form.phone}</p>
                      <p className="text-sm text-zinc-600"><strong>Delivery:</strong> {form.delivery === "collect" ? "Collect from 26d Kisenyi Road" : form.address}</p>
                      {form.notes && <p className="text-sm text-zinc-600"><strong>Notes:</strong> {form.notes}</p>}
                    </div>
                    <Link
                      href="/"
                      className="inline-block bg-[#1a3d2b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition"
                    >
                      Back to Home
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* RIGHT — Price reference + Quotation */}
          <div className="space-y-6">

            {/* Rice price reference */}
            <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-[#1a3d2b] mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <Package size={15} /> Rice Price Guide
                </h3>
                <div className="space-y-5">
                  {riceWeights.map((rice) => (
                    <div key={rice.type}>
                      <p className="text-xs font-bold text-[#c8961e] uppercase tracking-wide mb-2">
                        {rice.type}
                      </p>
                      <div className="space-y-1">
                        {rice.weights.map((w) => (
                          <div key={w.label} className="flex justify-between items-center py-1 border-b border-[#f0f5f2] last:border-0">
                            <span className="text-xs text-zinc-500">{w.label}</span>
                            <span className="text-xs font-bold text-[#1a3d2b]">
                              UGX {w.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quotation form */}
            <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/70 backdrop-blur-md">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-[#1a3d2b] mb-1 uppercase tracking-wide">
                  Request a Bulk Quotation
                </h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Hotels, schools, restaurants — tell us what you need and we reply in under 30 minutes.
                </p>

                {quoteSent ? (
                  <div className="text-center py-6">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="font-bold text-[#1a3d2b] text-sm">Request Sent!</p>
                    <p className="text-xs text-zinc-400 mt-1">We'll call you within 30 minutes.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                    />
                    <input
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                    />
                    <textarea
                      value={quoteMessage}
                      onChange={(e) => setQuoteMessage(e.target.value)}
                      placeholder="e.g. 10 sacks Long Grain + 5 sacks Basmati, weekly supply..."
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none"
                    />
                    <Button
                      className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white text-sm h-10 font-semibold"
                      onClick={handleQuote}
                    >
                      Send Quotation Request
                    </Button>
                    <div className="flex gap-2 pt-1">
                      <a
                        href="tel:0700212147"
                        className="flex-1 text-center text-xs font-semibold text-[#1a3d2b] border-2 border-[#d8e6dd] rounded-lg py-2 hover:bg-[#f5f8f6] transition"
                      >
                        📞 Call Us
                      </a>
                      <a
                        href="https://wa.me/256700212147"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center text-xs font-semibold text-[#1a3d2b] border-2 border-[#d8e6dd] rounded-lg py-2 hover:bg-[#f5f8f6] transition"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}