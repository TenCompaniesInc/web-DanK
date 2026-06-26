"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, MessageCircle, ArrowRight, ChevronRight, X, Plus, Minus, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CartDrawer from "@/components/CartDrawer";

type WeightOption = { label: string; price: number };
type DealProduct = { id: number; name: string; price: number; oldPrice: number; weight: string; tag: string; image: string; basePrice: number };

const hotDeals: DealProduct[] = [
  { id: 1, name: "Long Grain Rice",   price: 74880,  oldPrice: 90000,  weight: "25kg", tag: "Best Seller",  image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80",  basePrice: 3200 },
  { id: 2, name: "Brown Organic Rice", price: 105600, oldPrice: 120000, weight: "25kg", tag: "Healthy Pick", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",  basePrice: 4400 },
  { id: 3, name: "Basmati Rice",       price: 172800, oldPrice: 200000, weight: "25kg", tag: "Premium",      image: "https://images.unsplash.com/photo-1631898039837-f0e7a48c5175?w=600&q=80",  basePrice: 7200 },
];

const homeProducts = [
  { id: 101, name: "Long Grain White Rice", price: 3200, image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80", badge: "Popular" },
  { id: 102, name: "Basmati Rice",          price: 7200, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", badge: "Premium" },
  { id: 103, name: "Parboiled Rice",         price: 2900, image: "https://images.unsplash.com/photo-1631898039837-f0e7a48c5175?w=400&q=80", badge: null },
  { id: 104, name: "Brown Organic Rice",     price: 4400, image: "https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=400&q=80", badge: "Healthy" },
];

const branches = [
  { name: "Nansana Head Office",       detail: "Nansana Municipality, Wakiso",            tag: "Head Office",  isMain: true },
  { name: "Kisenyi (Main Branch)",     detail: "Covenant Building, Kisenyi Road, Kampala", tag: "Main Branch", isMain: true },
  { name: "Jinja Branch",             detail: "Jinja, Eastern Uganda",                   tag: "Branch",       isMain: false },
  { name: "Luweero Branch",           detail: "Luweero, Central Uganda",                 tag: "Branch",       isMain: false },
  { name: "Katooke Branch",           detail: "Katooke, Kampala",                        tag: "Branch",       isMain: false },
];

const staffList = [
  { name: "Kabala Dan K.",  role: "Founder & Director",  quote: "We built DAN K to serve Uganda honestly.",                                     src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Sarah Nakato",   role: "Head of Sales",       quote: "Every wholesale client gets the best rate and fastest service.",                src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Moses Okello",   role: "Store Manager",       quote: "Quality is not optional here — it is the standard we set from day one.",        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Grace Auma",     role: "Customer Relations",  quote: "Every customer — whether they buy 1kg or 100kg — leaves feeling valued.",       src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80" },
];

const reviews = [
  { text: "DAN K is the only place I buy my rice from. The quality is always consistent and the prices are unbeatable.", author: "Mama Prossy", role: "Restaurant Owner, Kampala" },
  { text: "We supply our entire school kitchen from DAN K. Clean rice, fair wholesale pricing, always on time.", author: "Mr. Ssekandi", role: "School Administrator" },
  { text: "Best basmati in Kampala, no question. My guests always ask what rice I use. The answer is always DAN K.", author: "Chef Amara", role: "Private Chef, Kololo" },
];

function getWeightOptions(base: number): WeightOption[] {
  return [
    { label: "25kg",  price: Math.round(base * 25 * 0.96) },
    { label: "50kg",  price: Math.round(base * 50 * 0.93) },
    { label: "100kg", price: Math.round(base * 100 * 0.90) },
    { label: "200kg", price: Math.round(base * 200 * 0.87) },
    { label: "500kg", price: Math.round(base * 500 * 0.84) },
  ];
}
function getPricePerKg(label: string, price: number) { return Math.round(price / parseInt(label)); }
function getTotalKg(label: string, qty: number) { return parseInt(label) * qty; }

export default function Home() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [isCartOpen, setIsCartOpen]     = useState(false);
  const [dealIndex, setDealIndex]       = useState(0);
  const [reviewIndex, setReviewIndex]   = useState(0);
  const [liveStaff, setLiveStaff]       = useState(staffList);
  const [quoteOpen, setQuoteOpen]       = useState(false);
  const [modalProduct, setModalProduct] = useState<typeof hotDeals[0] | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption | null>(null);
  const [qtyInput, setQtyInput]         = useState("1");
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [editValue, setEditValue]       = useState("");

  const { addToCart, totalItems, totalPrice, cart, updateQuantity, removeFromCart } = useCartStore();

  useEffect(() => {
    const t = setInterval(() => setDealIndex(p => (p + 1) % hotDeals.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setReviewIndex(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/staff").then(r => r.json()).then(d => {
      if (d.success && d.staff?.length > 0) {
        setLiveStaff(d.staff.filter((m: any) => m.active).map((m: any) => ({ name: m.name, role: m.role, quote: m.quote || "", src: m.image || "" })));
      }
    }).catch(() => {});
  }, []);

  const quantity = qtyInput === "" ? 1 : Math.max(1, parseInt(qtyInput) || 1);
  const weightOptions = modalProduct ? getWeightOptions(modalProduct.basePrice) : [];
  const totalKg = selectedWeight ? getTotalKg(selectedWeight.label, quantity) : 0;
  const totalAmount = selectedWeight ? selectedWeight.price * quantity : 0;

  const openModal = (deal: typeof hotDeals[0]) => {
    setModalProduct(deal);
    setSelectedWeight(getWeightOptions(deal.basePrice)[0]);
    setQtyInput("1");
  };

  const handleAddToCart = () => {
    if (!modalProduct || !selectedWeight) return;
    addToCart({ id: modalProduct.id, name: modalProduct.name, price: selectedWeight.price, weight: selectedWeight.label, image: modalProduct.image, qty: quantity });
    setModalProduct(null);
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-white">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/emblem.png" alt="DAN K" width={40} height={40} className="object-contain" />
            <div className="leading-tight">
              <p className="text-lg font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
              <p className="text-[9px] font-bold tracking-[2px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {[["Home","/"],["Products","/products"],["Order","/order"],["About","/about"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h} className="text-sm font-medium text-zinc-600 hover:text-[#1a3d2b] transition">{l}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-1.5 border border-[#d8e6dd] rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-50 transition">
              <ShoppingCart size={16} className="text-[#1a3d2b]" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {totalItems() > 0 && <span className="absolute -top-2 -right-2 bg-[#c8961e] text-[#0d2418] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems()}</span>}
            </button>
            <Link href="/order" className="hidden sm:block bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Order Now</Link>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-[#d8e6dd] text-[#1a3d2b]" aria-label="Menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#d8e6dd] bg-white px-4 py-3 space-y-1">
            {[["Home","/"],["Products","/products"],["Order","/order"],["About","/about"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h} onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-sm font-semibold text-[#141414] hover:bg-[#f5f8f6] rounded-xl transition">{l}</Link>
            ))}
            <div className="pt-1 pb-1">
              <Link href="/order" onClick={() => setMenuOpen(false)} className="block w-full text-center bg-[#1a3d2b] text-white font-semibold py-3 rounded-xl text-sm">Order Now</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-end pt-16 overflow-hidden" style={{ background: "linear-gradient(135deg,#0d2418 0%,#1a3d2b 45%,#2d6a4f 75%,#0a1f12 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 75% 40%,rgba(200,150,30,0.45) 0%,transparent 55%)" }} />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="relative z-10 max-w-3xl px-6 sm:px-10 pb-14 sm:pb-20 hero-content">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tight leading-none mb-2 hero-1">DAN K</h1>
          <p className="text-base sm:text-xl font-bold tracking-[5px] uppercase text-[#c8961e] mb-5 hero-2">Cheap Stores Ltd</p>
          <div className="flex items-center gap-3 mb-6 hero-3">
            <div className="h-px w-8 bg-white/30" />
            <span className="text-white/60 text-[10px] font-semibold tracking-[2px] uppercase">Origin of Quality · Kisenyi Road, Kampala</span>
          </div>
          <p className="text-sm sm:text-base text-white/65 max-w-md mb-8 leading-relaxed hero-4">
            Premium Grade A rice sourced clean, graded right, and priced honestly. Uganda's go-to grain store for homes, restaurants, and traders.
          </p>
          <div className="flex flex-wrap gap-3 hero-5">
            <Link href="/products" className="px-7 py-3.5 rounded-full text-sm font-semibold text-white border-2 border-white/30 bg-white/10 hover:bg-white/20 transition">Shop Rice</Link>
            <Link href="/order" className="px-7 py-3.5 rounded-full text-sm font-bold bg-[#c8961e] text-[#0d2418] hover:opacity-90 transition">Order / Quotation</Link>
          </div>
        </div>
        <style>{`
          .hero-1{animation:heroUp .7s ease-out .15s both}
          .hero-2{animation:heroUp .6s ease-out .35s both}
          .hero-3{animation:heroFade .6s ease-out .55s both}
          .hero-4{animation:heroFade .6s ease-out .7s both}
          .hero-5{animation:heroUp .5s ease-out .85s both}
          @keyframes heroUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes heroFade{from{opacity:0}to{opacity:1}}
        `}</style>
      </section>

      {/* ── HOT DEALS ───────────────────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1">This Week Only</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#141414]">Hot Deals</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline">Show More <ChevronRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {hotDeals.map((deal) => (
              <button key={deal.id} onClick={() => openModal(deal)} className="text-left bg-white rounded-2xl overflow-hidden border border-[#d8e6dd] hover:shadow-lg transition-all active:scale-[0.98]">
                <div className="relative h-44 bg-[#e6f0e8]">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase text-[#c8961e] bg-white/90 px-2 py-1 rounded-full">{deal.tag}</span>
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-red-500 px-2 py-1 rounded-full">SALE</span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-[#141414] mb-1">{deal.name}</p>
                  <p className="text-xs text-zinc-400 mb-2">{deal.weight} bag</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1a3d2b]">UGX {deal.price.toLocaleString()}</span>
                    <span className="text-xs text-zinc-400 line-through">UGX {deal.oldPrice.toLocaleString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1">Our Stock</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#141414]">Products</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline">Show More <ChevronRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {homeProducts.map((p) => (
              <Link key={p.id} href="/products" className="bg-white rounded-2xl overflow-hidden border border-[#d8e6dd] hover:shadow-lg transition-all active:scale-[0.98] block">
                <div className="relative h-36 sm:h-44 bg-[#e6f0e8]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  {p.badge && <span className="absolute top-2 left-2 text-[9px] font-bold uppercase text-white bg-[#1a3d2b] px-2 py-0.5 rounded-full">{p.badge}</span>}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-[#141414] leading-tight mb-1">{p.name}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {["25kg","50kg","100kg"].map(w => <span key={w} className="text-[9px] px-1.5 py-0.5 rounded-full border border-[#d8e6dd] text-zinc-400">{w}</span>)}
                  </div>
                  <p className="text-sm font-bold text-[#1a3d2b]">UGX {p.price.toLocaleString()}<span className="text-xs font-normal text-zinc-400">/kg</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DAN K ───────────────────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#141414]">The DAN K Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "🌾", title: "Grade A Quality",     desc: "Every sack is hand-graded and cleaned before it reaches you. No broken grains, no dirt, no compromise." },
              { icon: "💰", title: "Honest Pricing",       desc: "We price fairly — always. No hidden charges, no seasonal markups. What you see is what you pay." },
              { icon: "🚚", title: "Uganda-Wide Delivery", desc: "We deliver from Kampala to Jinja, Luweero, and beyond. Bulk orders get priority fulfilment." },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65">
                <div className="text-3xl mb-4">{f.icon}</div>
                <p className="font-bold text-[#141414] mb-2">{f.title}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR TEAM ────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-1">The People</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#141414]">Our Team</h2>
            </div>
            <Link href="/team" className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline">All Staff <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {liveStaff.map((m, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[#d8e6dd]">
                <div className="h-36 sm:h-48 bg-[#d4e8d8] overflow-hidden">
                  {m.src ? <img src={m.src} alt={m.name} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>}
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-[#141414] leading-tight">{m.name}</p>
                  <p className="text-[10px] font-semibold text-[#c8961e] uppercase tracking-wide mt-0.5">{m.role}</p>
                  {m.quote && <p className="text-[10px] text-zinc-400 mt-1 leading-snug line-clamp-2">"{m.quote}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">What People Say</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#141414] mb-10">Words from Our Customers</h2>
          <div className="bg-white rounded-2xl border border-[#d8e6dd] p-6 sm:p-8 mb-6 min-h-[180px] flex flex-col justify-center">
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-6 italic">"{reviews[reviewIndex].text}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a3d2b] flex items-center justify-center text-white font-bold text-sm">{reviews[reviewIndex].author.charAt(0)}</div>
              <div className="text-left">
                <p className="font-bold text-sm text-[#141414]">{reviews[reviewIndex].author}</p>
                <p className="text-xs text-zinc-400">{reviews[reviewIndex].role}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setReviewIndex(i)} className={`h-2 rounded-full transition-all ${reviewIndex === i ? "bg-[#1a3d2b] w-6" : "bg-[#d8e6dd] w-2"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANCHES ────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Find Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#141414]">Our Branches</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div key={b.name} className={`p-5 rounded-2xl border-2 ${b.isMain ? "border-[#1a3d2b] bg-[#f5fbf7]" : "border-[#d8e6dd] bg-white"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: b.isMain ? "#1a3d2b" : "#f0f5f2", color: b.isMain ? "white" : "#888" }}>{b.tag}</span>
                </div>
                <p className="font-bold text-[#141414] mb-1">{b.name}</p>
                <p className="text-xs text-zinc-400">{b.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0d2418]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Order?</h2>
          <p className="text-white/50 text-sm mb-8">Place your order online or get a custom bulk quotation.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products" className="px-8 py-3.5 rounded-full bg-[#c8961e] text-[#0d2418] font-bold text-sm hover:opacity-90 transition">Shop Products</Link>
            <Link href="/order#quotation" className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition">Get Quotation</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-[#141414] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain" />
                <div>
                  <p className="text-white font-bold">DAN K</p>
                  <p className="text-[#c8961e] text-[10px] font-bold tracking-[2px] uppercase">Origin of Quality</p>
                </div>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">Premium rice and grain store. Head office in Nansana, main branch at Covenant Building, Kisenyi. Branches in Jinja, Luweero & Katooke.</p>
            </div>
            <div>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[2px] mb-4">Quick Links</p>
              <div className="space-y-2">
                {[["Products","/products"],["About","/about"],["Order","/order"],["Contact","/contact"]].map(([l,h]) => (
                  <Link key={l} href={h} className="block text-zinc-500 hover:text-white text-sm transition">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[2px] mb-4">Contact</p>
              <div className="space-y-2 text-sm text-zinc-500">
                <p>Covenant Building, Kisenyi, Kampala</p>
                <p>0700 212 147</p>
                <p>Sun–Fri · 7am – 7:30pm (Closed Sat)</p>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-6 flex items-center justify-between text-xs text-zinc-600">
            <p>2026 DAN K CHEAP STORES LTD</p>
            <div className="flex items-center gap-4">
              <a href="https://www.tiktok.com/@dakcheapstores" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
              </a>
              <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP ─────────────────────────────────────────── */}
      <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white">
        <MessageCircle size={22} />
      </a>

      {/* ── CART DRAWER ─────────────────────────────────────── */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} onRequestQuote={() => { setIsCartOpen(false); window.location.href = "/order#quotation"; }} />

      {/* ── PRODUCT MODAL ───────────────────────────────────── */}
      {modalProduct && selectedWeight && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:px-4" onClick={() => setModalProduct(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="h-52 sm:h-64 overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
              <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-[#141414] mb-1">{modalProduct.name}</h3>
              <p className="text-xs text-zinc-400 mb-4">Select your weight and quantity below</p>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-2">Select Weight</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {weightOptions.map(w => (
                  <button key={w.label} onClick={() => setSelectedWeight(w)} className="p-2.5 rounded-xl border-2 text-center transition-all" style={{ borderColor: selectedWeight?.label === w.label ? "#1a3d2b" : "#d8e6dd", background: selectedWeight?.label === w.label ? "rgba(26,61,43,0.06)" : "white" }}>
                    <p className="font-bold text-sm text-[#141414]">{w.label}</p>
                    <p className="text-[10px] text-zinc-400">UGX {w.price.toLocaleString()}</p>
                    <p className="text-[10px] text-[#c8961e] font-semibold">UGX {getPricePerKg(w.label, w.price).toLocaleString()}/kg</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Quantity</p>
                <div className="flex items-center gap-2 border-2 border-[#d8e6dd] rounded-xl px-3 py-2">
                  <button onClick={() => setQtyInput(String(Math.max(1, quantity - 1)))} className="w-6 h-6 flex items-center justify-center text-[#1a3d2b] font-bold">−</button>
                  <input type="text" inputMode="numeric" value={qtyInput} onChange={e => setQtyInput(e.target.value.replace(/[^0-9]/g, ""))} className="w-12 text-center text-sm font-bold focus:outline-none" />
                  <button onClick={() => setQtyInput(String(quantity + 1))} className="w-6 h-6 flex items-center justify-center text-[#1a3d2b] font-bold">+</button>
                </div>
                <p className="text-xs text-zinc-400">Total: {totalKg}kg</p>
              </div>
              <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] mb-4">
                <div className="flex justify-between text-xs text-zinc-400 mb-2 pb-2 border-b border-[#e2ece5]">
                  <span>Price per kg</span>
                  <span className="font-semibold text-[#1a3d2b]">UGX {getPricePerKg(selectedWeight.label, selectedWeight.price).toLocaleString()} / kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-zinc-400">{selectedWeight.label} × {quantity} unit{quantity > 1 ? "s" : ""}</p>
                    <p className="text-xs text-zinc-400">Total: {totalKg}kg</p>
                  </div>
                  <p className="text-xl font-bold text-[#1a3d2b]">UGX {totalAmount.toLocaleString()}</p>
                </div>
              </div>
              {totalKg > 100 && (
                <div className="bg-[#f5f8f6] border border-[#d8e6dd] rounded-xl p-3 mb-3 text-center">
                  <p className="text-xs text-zinc-500">Ordering in bulk? <a href="/order#quotation" className="font-semibold text-[#1a3d2b] underline">Get a custom quotation</a> for better rates.</p>
                </div>
              )}
              <button onClick={handleAddToCart} className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#1a3d2b] hover:bg-[#2d6a4f] transition">
                Add to Cart — UGX {totalAmount.toLocaleString()}
              </button>
              <button onClick={() => setModalProduct(null)} className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-[#d8e6dd] hover:bg-zinc-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
