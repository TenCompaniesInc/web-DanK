"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, MessageCircle, ArrowRight, ChevronRight, X, Plus, Minus, MapPin, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatternText } from "@/components/ui/pattern-text";
import { Testimonial } from "@/components/ui/testimonial";
import { ShuffleCards } from "@/components/ui/testimonial-cards";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import Link from "next/link";
import Image from "next/image";
import CartDrawer from "@/components/CartDrawer";
import NavHeader from "@/components/ui/nav-header";
import { MeshGradient } from "@paper-design/shaders-react";

type WeightOption = { label: string; price: number };
type DealProduct = { id: number; name: string; price: number; oldPrice: number; weight: string; tag: string; duration: string; image: string; basePrice: number };
type HomeProduct = { id: number; name: string; price: number; unit: string; image: string; badge: string | null };

const hotDeals: DealProduct[] = [
  { id: 1, name: "Long Grain Rice", price: 98000, oldPrice: 115000, weight: "50kg", tag: "Best Seller", duration: "Ends in 2 days", image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80", basePrice: 3200 },
  { id: 2, name: "Brown Organic Rice", price: 110000, oldPrice: 125000, weight: "25kg", tag: "Healthy Pick", duration: "Ends in 3 days", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80", basePrice: 4400 },
  { id: 3, name: "Basmati Rice", price: 72000, oldPrice: 85000, weight: "10kg", tag: "Premium", duration: "Ends in 1 day", image: "https://images.unsplash.com/photo-1631898039837-f0e7a48c5175?w=600&q=80", basePrice: 7200 },
];

const homeProducts: HomeProduct[] = [
  { id: 101, name: "Long Grain White Rice", price: 3200, unit: "/kg", image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80", badge: "Popular" },
  { id: 102, name: "Basmati Rice", price: 7200, unit: "/kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", badge: "Premium" },
  { id: 103, name: "Parboiled Rice", price: 2900, unit: "/kg", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", badge: null },
  { id: 104, name: "Brown Organic Rice", price: 4400, unit: "/kg", image: "https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=400&q=80", badge: "Healthy" },
];

const branches = [
  { name: "Nansana Head Office", detail: "Nansana Business Centre, C16", tag: "Head Office", isMain: true },
  { name: "Kisenyi Main Branch", detail: "Covenant Building Plaza, Shop A23, Mengo Kisenyi", tag: "Main Branch", isMain: true },
  { name: "Katooke Branch", detail: "Katooke Town Council, along Kisumu Road", tag: "Branch", isMain: false },
  { name: "Luweero Branch", detail: "Luweero", tag: "Branch", isMain: false },
  { name: "Iganga Branch", detail: "Ssaza Road, Iganga", tag: "Branch", isMain: false },
  { name: "Jinja Branch", detail: "Gokale Road, off Main Street Primary School, Jinja", tag: "Branch", isMain: false },
];

const fallbackStaff = [
  { name: "Kabala Dan K.", designation: "Founder & Director", quote: "We built DAN K to serve Uganda honestly. Every grain we sell carries our name and our promise — clean, affordable, and always reliable.", src: "/Users/jast/web-dank/public/home page/director photo.jpeg" },
  { name: "Maria Kabala", designation: "Assistant Director", quote: "My job is to make sure every wholesale client gets the best rate and the fastest service. If you need bulk rice in Uganda, I will sort you out.", src: "/Users/jast/web-dank/public/home page/ass.director:quality assurance.jpeg" },
  { name: "Katumba Isaac", designation: "Store Manager", quote: "Every sack that leaves our stores passes through me. Quality is not optional here — it is the standard we set from day one.", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
  { name: "Grace Auma", designation: "Customer Relations", quote: "I make sure every customer — whether they buy 1kg or 100kg — leaves feeling valued. That is what DAN K is about.", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80" },
];

const customerTestimonials = [
  { id: 1, testimonial: "I have been buying rice in bulk from DAN K Cheap Stores since 2015 and have never once faced an issue with quality or delivery.", author: "Nakintu Evelyn", role: "" },
  { id: 2, testimonial: "Buying rice from DAN K Cheap Stores is always smooth. I have never had any complications.", author: "Ssabirye Irene", role: "" },
  { id: 3, testimonial: "DAN K Cheap Stores is the best rice wholesaler in East Africa, in terms of everything.", author: "Ssekitto Emmanuel", role: "" },
  { id: 4, testimonial: "DAN K Cheap Stores has the best customer care, and they sell the best quality rice.", author: "Mugisha Paul", role: "" },
  { id: 5, testimonial: "The rice quality DAN K sells is the best in East Africa. I have been a loyal customer since I discovered them in 2021.", author: "Kagoya Zzimenya", role: "" },
];

function getWeightOptions(base: number): WeightOption[] {
  return [
    { label: "1kg", price: base },
    { label: "5kg", price: Math.round(base * 4.8) },
    { label: "10kg", price: Math.round(base * 9.5) },
    { label: "25kg", price: Math.round(base * 23) },
    { label: "50kg", price: Math.round(base * 45) },
    { label: "100kg", price: Math.round(base * 88) },
  ];
}
function getTotalKg(label: string, qty: number) { return parseInt(label.replace("kg", "")) * qty; }

// CSS-only fade-in — works on every browser, no JS dependency for visibility
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={className}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      {children}
    </div>
  );
}

function ProductModal({ product, onClose, onAdd }: {
  product: { id: number; name: string; image: string; badge: string | null; basePrice: number };
  onClose: () => void;
  onAdd: (item: { id: number; name: string; price: number; weight: string; image: string }) => void;
}) {
  const weightOptions = getWeightOptions(product.basePrice);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(weightOptions[0]);
  const [qty, setQty] = useState(1);
  const totalKg = getTotalKg(selectedWeight.label, qty);
  const totalAmount = selectedWeight.price * qty;
  const needsQuote = totalKg > 200;

  const handleAdd = () => {
    if (needsQuote) return;
    onAdd({ id: product.id, name: product.name, price: selectedWeight.price, weight: selectedWeight.label, image: product.image.split("?")[0] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#d8e6dd] max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-44 bg-[#e6f0e8] flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-zinc-500 shadow-md"><X size={16} /></button>
          {product.badge && <Badge className="absolute top-3 left-3 bg-[#1a3d2b] text-white text-[10px]">{product.badge}</Badge>}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#141414] mb-1">{product.name}</h3>
          <p className="text-xs text-zinc-400 mb-4">Select weight and quantity</p>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Weight</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {weightOptions.map((w) => (
              <button key={w.label} onClick={() => setSelectedWeight(w)}
                className="py-2.5 rounded-xl border-2 text-center transition-all active:scale-95"
                style={{ borderColor: selectedWeight.label === w.label ? "#1a3d2b" : "#d8e6dd", background: selectedWeight.label === w.label ? "rgba(26,61,43,0.06)" : "white" }}>
                <p className="font-bold text-sm text-[#141414]">{w.label}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">UGX {w.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Quantity</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3 border-2 border-[#d8e6dd] rounded-xl px-3 py-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-lg bg-[#f5f8f6] flex items-center justify-center text-[#1a3d2b] active:bg-[#d4e8d8]"><Minus size={14} /></button>
              <span className="w-8 text-center text-lg font-bold text-[#141414]">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-lg bg-[#f5f8f6] flex items-center justify-center text-[#1a3d2b] active:bg-[#d4e8d8]"><Plus size={14} /></button>
            </div>
            <p className="text-sm text-zinc-400">Total: <strong className="text-[#1a3d2b]">{totalKg}kg</strong></p>
          </div>
          <div className="bg-[#f5f8f6] rounded-xl p-3 border border-[#d8e6dd] mb-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-zinc-400">{selectedWeight.label} × {qty} bag{qty > 1 ? "s" : ""}</p>
              <p className="text-xs text-zinc-400">{totalKg}kg total</p>
            </div>
            <p className="text-xl font-bold text-[#1a3d2b]">UGX {totalAmount.toLocaleString()}</p>
          </div>
          {needsQuote ? (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-3 text-center">
              <p className="text-sm font-bold text-amber-700 mb-1">Quotation required for {totalKg}kg</p>
              <a href={"https://wa.me/256731496117?text=" + encodeURIComponent("Hello DAN K, I would like a quotation for " + totalKg + "kg of " + product.name + ".")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold mt-2">💬 WhatsApp Quotation</a>
            </div>
          ) : (
            <button onClick={handleAdd} className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#1a3d2b] active:bg-[#2d6a4f] transition">Add to Cart — UGX {totalAmount.toLocaleString()}</button>
          )}
          <button onClick={onClose} className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-[#d8e6dd] active:bg-zinc-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dealIndex, setDealIndex] = useState(0);
  const [modalProduct, setModalProduct] = useState<{ id: number; name: string; image: string; badge: string | null; basePrice: number } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveDeals, setLiveDeals] = useState<any[]>([]);
  const [liveFeatured, setLiveFeatured] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          setLiveDeals(data.products.filter((p: any) => p.isHotDeal));
          setLiveFeatured(data.products.filter((p: any) => p.isFeatured));
        }
      })
      .catch(() => {});
  }, []);
  const [staffTestimonials, setStaffTestimonials] = useState(fallbackStaff);
  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.staff?.length > 0) {
          const active = data.staff.filter((m: any) => m.active);
          if (active.length > 0) {
            setStaffTestimonials(active.map((m: any) => ({ name: m.name, designation: m.role, quote: m.quote, src: m.image })));
          }
        }
      })
      .catch(() => {});
  }, []);
  const addToCart = useCartStore((s) => s.addToCart);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => {
    const interval = setInterval(() => setDealIndex((p) => (p + 1) % hotDeals.length), 3500);
    return () => clearInterval(interval);
  }, []);



  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroGradient {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.1) translate(-3%, 2%); }
        }
        @keyframes heroGlow {
          from { opacity: 0.6; transform: scale(1); }
          to { opacity: 1; transform: scale(1.15) translate(3%, -5%); }
        }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]" onClick={() => {}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain w-10 h-10 sm:w-11 sm:h-11" />
            <div className="leading-tight">
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a3d2b]">DAN  K</p>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[2px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:block"><NavHeader /></div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-1.5 border border-[#d8e6dd] rounded-lg px-2.5 py-2 text-sm font-medium hover:bg-zinc-50 transition active:bg-zinc-100">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {totalItems() > 0 && <span className="absolute -top-2 -right-2 bg-[#c8961e] text-[#1a3d2b] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems()}</span>}
            </button>
            <Link href="/order" className="hidden sm:flex bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Order Now</Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-zinc-50 transition"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-[#1a3d2b] transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1a3d2b] transition-all duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#1a3d2b] transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#d8e6dd] shadow-lg z-[70]">
            <div className="px-5 py-3 flex flex-col">
              {(["Home:/", "Products:/products", "Order:/order", "About:/about", "Contact:/contact", "Team:/team"] as string[]).map((item) => {
                const [label, href] = item.split(":");
                return (
                  <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="text-[#1a3d2b] font-semibold text-base py-3.5 border-b border-[#f0f7f2] last:border-0 flex items-center justify-between active:text-[#c8961e]">
                    {label} <ChevronRight size={16} className="text-zinc-300" />
                  </Link>
                );
              })}
              <Link href="/order" onClick={() => setMobileMenuOpen(false)} className="mt-4 mb-2 w-full text-center bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-3.5 rounded-xl active:opacity-90">
                Order Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center justify-start pt-16 overflow-hidden" style={{ background: "#0d2418" }}>
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#0d2418", "#1a3d2b", "#2d6a4f", "#c8961e", "#0a1f12"]}
          speed={0.25}
          style={{ pointerEvents: "none" } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: 1 }} />
        <div className="relative w-full max-w-3xl px-5 sm:px-10 py-12 sm:py-20" style={{ zIndex: 2, animation: "heroIn 0.8s ease-out 0.1s both" }}>
          <PatternText text="DAN K" className="text-white !text-left !tracking-normal" />
          <p className="text-base sm:text-2xl font-bold tracking-[4px] sm:tracking-[6px] uppercase text-[#c8961e] mt-1 mb-5">Cheap Stores Ltd</p>
          <div className="relative flex items-center w-full max-w-lg mb-6">
            <div className="h-px w-6 flex-shrink-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
            <div className="flex-shrink-0 mx-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <span className="text-white/60 text-[9px] sm:text-[10px] font-semibold tracking-[2px] uppercase whitespace-nowrap">Origin of Quality · </span>
            </div>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(200,150,30,0.5), transparent)" }} />
          </div>
          <p className="text-sm sm:text-lg text-white/60 max-w-lg mb-8 leading-relaxed font-light">
            High-quality rice at honest, favourable prices — supplying homes, schools, restaurants, hotels, retailers and wholesalers across Uganda since 2013.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/products" className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-semibold text-white border-2 border-white/25 bg-white/10 backdrop-blur hover:bg-white/20 transition-all active:scale-95">Shop Rice</Link>
            <Link href="/order" className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-bold bg-[#c8961e] text-[#0d2418] hover:opacity-90 transition-all shadow-lg active:scale-95">Order / Quotation</Link>
          </div>
        </div>
      </section>

      {/* HOT DEALS */}
      <section id="deals" className="py-14 sm:py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1.5">This Week Only</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414]">Hot Deals</h2>
              </div>
              <Link href="/products" className="text-sm font-medium text-[#1a3d2b] border border-[#d8e6dd] bg-white/60 px-3 sm:px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-1 flex-shrink-0">
                <span className="hidden sm:inline">Show More</span><span className="sm:hidden">More</span> <ChevronRight size={14} />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {liveDeals.length === 0 ? (
              <div className="col-span-full text-center py-14">
                <p className="text-zinc-400 text-sm">Hot deals coming soon — check back shortly.</p>
              </div>
            ) : (
              liveDeals.map((deal, i) => (
                <FadeIn key={deal._id} delay={i * 0.1}>
                  <Card
                    className={`overflow-hidden border-2 border-[rgba(200,230,210,0.7)] bg-white shadow-sm transition-all duration-300 cursor-pointer active:scale-[0.98] ${dealIndex === i ? "ring-2 ring-[#c8961e] shadow-lg" : ""}`}
                    onClick={() => setModalProduct({ id: deal._id, name: deal.name, image: deal.image || "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80", badge: deal.badge, basePrice: deal.price })}
                  >
                    <div className="relative h-44 sm:h-48 bg-[#d4e8d8]">
                      <img src={deal.image || "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80"} alt={deal.name} className="w-full h-full object-cover" />
                      {deal.badge && <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wide uppercase text-[#c8961e] bg-white/95 px-2 py-1 rounded-full">{deal.badge}</span>}
                    </div>
                    <CardContent className="p-4">
                      <p className="font-semibold text-sm sm:text-base text-[#141414] mb-1">{deal.name}</p>
                      <p className="text-xs text-zinc-400 mb-2">{deal.unit}</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#1a3d2b]">UGX {deal.price.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))
            )}
          </div>
          {liveDeals.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {liveDeals.map((_, i) => (<button key={i} onClick={() => setDealIndex(i)} className={`h-2 rounded-full transition-all ${dealIndex === i ? "bg-[#1a3d2b] w-6" : "bg-[#d8e6dd] w-2"}`} />))}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1.5">Our Stock</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414]">Products</h2>
              </div>
              <Link href="/products" className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline flex-shrink-0">Show More <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {liveFeatured.length === 0 ? (
              <div className="col-span-full text-center py-14">
                <p className="text-zinc-400 text-sm">Featured products coming soon.</p>
              </div>
            ) : (
              liveFeatured.map((p, i) => (
                <FadeIn key={p._id} delay={i * 0.08}>
                  <div
                    className="overflow-hidden border-2 border-[rgba(200,230,210,0.65)] bg-white rounded-2xl active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    onClick={() => setModalProduct({ id: p._id, name: p.name, image: p.image || "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80", badge: p.badge, basePrice: p.price })}
                  >
                    <div className="relative h-36 sm:h-40 bg-[#e6f0e8]">
                      <img src={p.image || "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80"} alt={p.name} className="w-full h-full object-cover" />
                      {p.badge && <span className="absolute top-2 left-2 text-[9px] sm:text-[10px] font-bold uppercase text-white bg-[#1a3d2b] px-2 py-0.5 rounded-full">{p.badge}</span>}
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="font-semibold text-xs sm:text-sm text-[#141414] mb-1 leading-tight">{p.name}</p>
                      <div className="flex gap-1 flex-wrap mb-1.5">{["25kg", "50kg", "100kg"].map((w) => (<span key={w} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border border-[#d8e6dd] text-zinc-400">{w}</span>))}</div>
                      <p className="text-base sm:text-lg font-bold text-[#1a3d2b]">UGX {p.price.toLocaleString()}<span className="text-xs font-normal text-zinc-400">{p.unit}</span></p>
                    </div>
                  </div>
                </FadeIn>
              ))
            )}
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-14 sm:py-24" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Why We Exist</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-6 sm:mb-8">Mission & Vision</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md">
                <h3 className="text-base sm:text-lg font-bold text-[#1a3d2b] mb-3">Our Mission</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">To deliver high-quality rice at honest, favourable prices — keeping our word to every customer, every time — while building a trusted supply network that serves homes and businesses across Uganda and beyond.</p>
              </div>
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md">
                <h3 className="text-base sm:text-lg font-bold text-[#1a3d2b] mb-3">Our Vision</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">To become the leading supplier of quality rice in Uganda and across the region — recognised everywhere for reliability, fair pricing, and the trust we earn with every sack we deliver.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* DIRECTOR */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3 text-center">Words from the Director</p>
            <Testimonial quote="What makes us special is simple: we keep our word. We deliver high-quality rice at fair prices, we serve every customer with dedication, and we grow the people around us. This business was built on faith and strong values — and a belief that when God leads, serving others well becomes the truest measure of success." highlightedText="we keep our word" authorName="Kabala Dan" authorPosition="Founder & Director, DAN K CHEAP STORES LTD" authorImage="/home/director.jpeg" />
          </FadeIn>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-14 sm:py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1.5">The People</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414]">Our Team</h2>
                <p className="text-sm text-zinc-400 mt-2">The people behind every sack of rice we deliver.</p>
              </div>
              <Link href="/team" className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline flex-shrink-0">All Staff <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex justify-center overflow-hidden w-full max-w-2xl mx-auto">
              <CircularTestimonials testimonials={staffTestimonials} autoplay={true} colors={{ name: "#1a3d2b", designation: "#c8961e", testimony: "#4b5563", arrowBackground: "#1a3d2b", arrowForeground: "#ffffff", arrowHoverBackground: "#c8961e" }} fontSizes={{ name: "18px", designation: "12px", quote: "13px" }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-16">
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">What People Say</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414]">Words from Our Customers</h2>
              <p className="text-sm text-zinc-400 mt-2">Drag the card to see more</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex justify-center items-center min-h-[320px] sm:min-h-[360px]">
              <ShuffleCards testimonials={customerTestimonials} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="py-14 sm:py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Find Us Across Uganda</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414]">Our Branches</h2>
              <p className="text-sm text-zinc-400 mt-2">Five locations and growing — serving Uganda one sack at a time.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {branches.map((b, i) => (
              <FadeIn key={b.name} delay={i * 0.06}>
                <div className="p-5 sm:p-6 rounded-2xl border-2 bg-white/70 backdrop-blur-md h-full" style={{ borderColor: b.isMain ? "#c8961e" : "rgba(200,230,210,0.7)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: b.isMain ? "rgba(200,150,30,0.12)" : "#f0f7f2", color: b.isMain ? "#c8961e" : "#1a3d2b" }}><MapPin size={18} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: b.isMain ? "rgba(200,150,30,0.12)" : "#f0f7f2", color: b.isMain ? "#c8961e" : "#1a3d2b" }}>{b.tag}</span>
                  <h3 className="font-bold text-sm text-[#141414] mt-2.5 mb-1">{b.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{b.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BIBLE VERSE */}
      <section className="py-16 sm:py-24 bg-[#0d2418]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="text-3xl sm:text-4xl mb-6">✝</div>
            <blockquote className="text-lg sm:text-2xl text-white/80 font-medium leading-relaxed italic mb-4">"The Lord will open to you his good treasury, the heavens, to give the rain to your land in its season and to bless all the work of your hands."</blockquote>
            <p className="text-[#c8961e] font-bold tracking-widest text-sm uppercase">Deuteronomy 28:12</p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#141414] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/emblem.png" alt="DAN K" width={36} height={36} className="object-contain" />
                <div>
                  <p className="font-bold text-white text-sm">DAN  K</p>
                  <p className="text-[#c8961e] text-[10px] tracking-widest uppercase">Origin of Quality</p>
                </div>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Premium rice and grain store. Head office in Nansana, main branch at Covenant Building, Kisenyi. Branches in Katooke, Luweero, Iganga & Jinja.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-3">Quick Links</p>
              <div className="flex flex-col gap-2">
                {["Products", "About", "Order", "Contact"].map((l) => (
                  <Link key={l} href={"/" + l.toLowerCase()} className="text-zinc-500 text-sm hover:text-[#c8961e] transition">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-3">Contact</p>
              <div className="text-zinc-500 text-sm leading-loose">
                <p>Covenant Building, Kisenyi, Kampala</p>
                <p>0731 496 117</p>
                <p>Sun–Fri · 7am – 7:30pm (Closed Sat)</p>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
            <p>2026 DAN K CHEAP STORES LTD</p>
            <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/256731496117" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-[50] bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-4 border-white active:scale-95 transition-transform"
        title="Chat on WhatsApp"
      ><svg viewBox="0 0 24 24" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>

      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} onAdd={(item) => { addToCart(item); setModalProduct(null); setIsCartOpen(true); }} />
      )}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}
