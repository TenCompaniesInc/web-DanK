"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, X, Plus, Minus, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";

const filters = ["All", "Long Grain", "Brown", "Basmati", "Parboiled", "Local", "Jasmine"];

type WeightOption = { label: string; price: number };

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  wholesale: string;
  image: string;
  badge: string | null;
  inStock: boolean;
};

function getWeightOptions(base: number): WeightOption[] {
  // base = price per kg. Tiers start at 25kg (minimum sell unit).
  // Bulk discounts applied per tier.
  return [
    { label: "25kg",  price: Math.round(base * 25 * 0.96) },
    { label: "50kg",  price: Math.round(base * 50 * 0.93) },
    { label: "100kg", price: Math.round(base * 100 * 0.90) },
    { label: "200kg", price: Math.round(base * 200 * 0.87) },
    { label: "500kg", price: Math.round(base * 500 * 0.84) },
  ];
}

function getPricePerKg(label: string, price: number): number {
  const kg = parseInt(label.replace("kg", ""));
  return Math.round(price / kg);
}

function getTotalKg(label: string, qty: number) {
  return parseInt(label.replace("kg", "")) * qty;
}

// ── Cart Drawer ────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, onRequestQuote }: { open: boolean; onClose: () => void; onRequestQuote: () => void }) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id: number, currentQty: number) => {
    setEditingId(id);
    setEditValue(String(currentQty));
  };

  const commitEdit = (id: number) => {
    const n = parseInt(editValue);
    updateQuantity(id, isNaN(n) || n < 1 ? 1 : n);
    setEditingId(null);
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />}
      <div
        className="fixed top-0 right-0 bottom-0 w-[380px] z-50 flex flex-col transition-transform duration-300"
        style={{ background: "white", borderLeft: "1px solid #d8e6dd", boxShadow: "-8px 0 32px rgba(0,0,0,0.08)", transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8e6dd]">
          <h2 className="text-lg font-bold text-[#141414]">Cart ({cart.length} {cart.length === 1 ? "item" : "items"})</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] hover:border-zinc-400 transition">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-semibold text-zinc-400">Your cart is empty</p>
              <p className="text-xs text-zinc-300 mt-1">Add some rice to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-[#d8e6dd] bg-[#f9fbf9]">
                  <img src={item.image + "?w=120"} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-[#d8e6dd]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#141414] leading-tight">{item.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.weight} bag</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">UGX {item.price.toLocaleString()} / {item.weight}</p>
                    <p className="font-bold text-[#1a3d2b] mt-1">UGX {(item.price * item.qty).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg border border-[#d8e6dd] bg-white flex items-center justify-center text-[#1a3d2b] hover:bg-[#e8f5ed] transition">
                        <Minus size={12} />
                      </button>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          autoFocus
                          value={editValue}
                          onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setEditValue(v); const n = parseInt(v); if (!isNaN(n) && n >= 1) updateQuantity(item.id, n); }}
                          onBlur={() => commitEdit(item.id)}
                          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(item.id); }}
                          className="w-12 text-center text-sm font-bold text-[#141414] border border-[#1a3d2b] rounded-md focus:outline-none"
                        />
                      ) : (
                        <button onClick={() => startEdit(item.id, item.qty)} className="text-sm font-bold text-[#141414] w-8 text-center hover:bg-[#e8f5ed] rounded-md py-0.5 transition">
                          {item.qty}
                        </button>
                      )}
                      <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg border border-[#d8e6dd] bg-white flex items-center justify-center text-[#1a3d2b] hover:bg-[#e8f5ed] transition">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-auto text-zinc-300 hover:text-red-400 transition">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#d8e6dd]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-[#141414]">Total</span>
              <span className="text-2xl font-bold text-[#1a3d2b]">UGX {totalPrice().toLocaleString()}</span>
            </div>
            <Link href="/order" onClick={onClose} className="block w-full text-center bg-[#c8961e] text-[#0d2418] font-bold py-3.5 rounded-xl text-sm hover:opacity-90 transition mb-2">
              Pay with Mobile Money →
            </Link>
            <Link href="/order#quotation" onClick={onClose} className="block w-full text-center border-2 border-[#1a3d2b] text-[#1a3d2b] font-semibold py-3 rounded-xl text-sm hover:bg-[#f5f8f6] transition">
              Get Quotation
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// ── Quotation Modal ────────────────────────────────────────────────────────
function QuotationModal({ open, onClose, cartTotal }: { open: boolean; onClose: () => void; cartTotal: number }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [needs, setNeeds] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const reset = () => { setName(""); setContact(""); setEmail(""); setNeeds(""); setSent(false); setErr(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!name.trim() || !contact.trim() || !needs.trim()) { setErr("Please fill in your name, contact and what you need."); return; }
    setErr("");
    setSending(true);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: contact, email, message: needs, referenceTotal: cartTotal }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setErr("Could not send your request. Please try again or call us.");
    } catch (e) {
      setErr("Network error. Please try again or call us.");
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:px-4" onClick={handleClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8e6dd]">
          <h2 className="text-lg font-bold text-[#141414]">Get a Quotation</h2>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition"><X size={15} /></button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-bold text-[#1a3d2b] text-lg mb-1">Request Sent!</p>
            <p className="text-sm text-zinc-400 mb-6">Thanks {name}, we'll get back to you within 30 minutes with a custom quote.</p>
            <button onClick={handleClose} className="bg-[#1a3d2b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">Close</button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-xs text-zinc-400 bg-[#f5f8f6] border border-[#d8e6dd] rounded-lg p-3 leading-relaxed">
              Quotations are best for bulk or wholesale orders — hotels, schools, restaurants, or anyone buying large quantities. We'll work out the best rate and delivery plan with you directly.
            </p>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Ssekandi" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Contact (Phone)</label>
              <input value={contact} onChange={(e) => setContact(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))} inputMode="numeric" placeholder="e.g. 0700212147" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Email (optional)</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="e.g. john@example.com" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">What do you need?</label>
              <textarea value={needs} onChange={(e) => setNeeds(e.target.value)} rows={4} placeholder="e.g. 50 bags of Basmati, 20 bags of Parboiled, weekly supply..." className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none" />
            </div>

            <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] flex justify-between items-center">
              <span className="text-xs text-zinc-400">Reference total (from your cart)</span>
              <span className="text-lg font-bold text-[#1a3d2b]">UGX {cartTotal.toLocaleString()}</span>
            </div>

            {err && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">{err}</p>}

            <button onClick={handleSubmit} disabled={sending} className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#1a3d2b] hover:bg-[#2d6a4f] transition">
              {sending ? "Sending..." : "Send Quotation Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption | null>(null);
  const [qtyInput, setQtyInput] = useState("1");
  const [quoteOpen, setQuoteOpen] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      const url = activeFilter === "All" ? "/api/products" : "/api/products?category=" + activeFilter;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    };
    fetch_();
  }, [activeFilter]);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedWeight(getWeightOptions(product.price)[0]);
    setQtyInput("1");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedWeight(null);
    setQtyInput("1");
  };

  const quantity = qtyInput === "" ? 1 : Math.max(1, parseInt(qtyInput) || 1);
  const totalKg = selectedWeight ? getTotalKg(selectedWeight.label, quantity) : 0;
  const totalAmount = selectedWeight ? selectedWeight.price * quantity : 0;

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedWeight) return;
    addToCart({
      id: selectedProduct._id as unknown as number,
      name: selectedProduct.name,
      price: selectedWeight.price,
      weight: selectedWeight.label,
      image: selectedProduct.image.split("?")[0],
      qty: quantity,
    });
    closeModal();
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-zinc-50">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/emblem.png" alt="DAN K" width={52} height={52} className="object-contain" />
            <div className="leading-tight">
              <p className="text-2xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
              <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>
          <div className="hidden md:block"><NavHeader /></div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 border border-[#d8e6dd] rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-50 transition">
              <ShoppingCart size={16} />
              Cart
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c8961e] text-[#1a3d2b] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems()}</span>
              )}
            </button>
            <button onClick={() => setQuoteOpen(true)} className="hidden sm:block border-2 border-[#1a3d2b] text-[#1a3d2b] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#f5f8f6] transition">Get Quotation</button>
            <Link href="/order" className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Order Now</Link>
          </div>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <div className="pt-28 pb-8 px-6 max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Our Stock</p>
        <h1 className="text-5xl font-bold tracking-tight text-[#141414] mb-3">Rice Products</h1>
        <p className="text-zinc-400 text-base max-w-xl">Click any product to choose your weight and quantity.</p>
      </div>

      {/* FILTERS */}
      <div className="px-6 max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className="px-5 py-2 rounded-full text-sm font-medium border transition-all"
              style={{ background: activeFilter === f ? "#1a3d2b" : "white", color: activeFilter === f ? "white" : "#555", borderColor: activeFilter === f ? "#1a3d2b" : "#d8e6dd" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="px-6 max-w-7xl mx-auto pb-20">
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-zinc-200" />
                <div className="p-5 space-y-3"><div className="h-4 bg-zinc-200 rounded w-3/4" /><div className="h-3 bg-zinc-200 rounded w-1/2" /><div className="h-8 bg-zinc-200 rounded" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product._id} onClick={() => product.inStock && openModal(product)} className="overflow-hidden group border-2 border-[rgba(200,230,210,0.6)] bg-white rounded-2xl hover:shadow-xl transition-all duration-200 cursor-pointer">
                <div className="relative h-48 bg-[#e6f0e8]">
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center bg-[#e6f0e8]"><span className="text-4xl">🌾</span></div>}
                  {product.badge && <Badge className="absolute top-3 left-3 bg-[#1a3d2b] text-white text-xs">{product.badge}</Badge>}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base text-[#141414] mb-1 leading-tight">{product.name}</h3>
                  <p className="text-xs text-zinc-400 mb-3">{product.wholesale}</p>
                  <div className="flex gap-1 flex-wrap mb-4">
                    {["25kg", "50kg", "100kg", "200kg+"].map((w) => (<span key={w} className="text-[10px] px-2 py-0.5 rounded-full border border-[#d8e6dd] text-zinc-400">{w}</span>))}
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#d8e6dd] text-zinc-300">+2</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1a3d2b]">UGX {product.price.toLocaleString()}<span className="text-sm font-normal text-zinc-400 ml-1">{product.unit}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#141414] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/emblem.png" alt="DAN K" width={36} height={36} className="object-contain" />
                <div>
                  <p className="font-bold text-white text-sm">DAN K</p>
                  <p className="text-[#c8961e] text-[10px] tracking-widest uppercase">Origin of Quality</p>
                </div>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Premium rice and grain store. Main branch at Covenant Building, Kisenyi. Branches in Jinja, Luweero & Katooke.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-4">Quick Links</p>
              <div className="flex flex-col gap-2">
                {["Products", "About", "Order", "Contact"].map((l) => (<Link key={l} href={"/" + l.toLowerCase()} className="text-zinc-500 text-sm hover:text-[#c8961e] transition">{l}</Link>))}
              </div>
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
            <p>2025 DAN K CHEAP STORES LTD</p>
            <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
          </div>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={closeModal}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-52 bg-[#e6f0e8]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition shadow">
                <X size={15} />
              </button>
              {selectedProduct.badge && <Badge className="absolute top-3 left-3 bg-[#1a3d2b] text-white">{selectedProduct.badge}</Badge>}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#141414] mb-1">{selectedProduct.name}</h3>
              <p className="text-xs text-zinc-400 mb-6">{selectedProduct.wholesale}</p>

              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400 mb-3">Select Weight</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {getWeightOptions(selectedProduct.price).map((w) => (
                  <button key={w.label} onClick={() => setSelectedWeight(w)} className="py-3 rounded-xl border-2 text-center transition-all"
                    style={{ borderColor: selectedWeight?.label === w.label ? "#1a3d2b" : "#d8e6dd", background: selectedWeight?.label === w.label ? "rgba(26,61,43,0.06)" : "white" }}>
                    <p className="font-bold text-sm text-[#141414]">{w.label}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">UGX {w.price.toLocaleString()}</p>
                    <p className="text-[10px] text-[#c8961e] font-semibold">UGX {getPricePerKg(w.label, w.price).toLocaleString()}/kg</p>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Quantity</p>
                <p className="text-[10px] text-zinc-300">Minimum: 1</p>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3 border-2 border-[#d8e6dd] rounded-xl px-4 py-2.5">
                  <button onClick={() => setQtyInput(String(Math.max(1, quantity - 1)))} className="w-8 h-8 rounded-lg bg-[#f5f8f6] flex items-center justify-center text-[#1a3d2b] hover:bg-[#e8f5ed] transition">
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={qtyInput}
                    onChange={(e) => setQtyInput(e.target.value.replace(/[^0-9]/g, ""))}
                    onBlur={() => { if (qtyInput === "" || parseInt(qtyInput) < 1) setQtyInput("1"); }}
                    className="w-12 text-center text-lg font-bold text-[#141414] focus:outline-none"
                  />
                  <button onClick={() => setQtyInput(String(quantity + 1))} className="w-8 h-8 rounded-lg bg-[#f5f8f6] flex items-center justify-center text-[#1a3d2b] hover:bg-[#e8f5ed] transition">
                    <Plus size={14} />
                  </button>
                </div>
                <p className="text-sm text-zinc-400">Total: <strong className="text-[#1a3d2b]">{totalKg}kg</strong></p>
              </div>

              <div className="bg-[#f5f8f6] rounded-xl p-4 border border-[#d8e6dd] mb-5">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-2 pb-2 border-b border-[#e2ece5]">
                  <span>Price per kg ({selectedWeight?.label})</span>
                  <span className="font-semibold text-[#1a3d2b]">UGX {selectedWeight ? getPricePerKg(selectedWeight.label, selectedWeight.price).toLocaleString() : selectedProduct.price.toLocaleString()} / kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-zinc-400">{selectedWeight?.label} × {quantity} unit{quantity > 1 ? "s" : ""}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Total: {totalKg}kg</p>
                  </div>
                  <p className="text-2xl font-bold text-[#1a3d2b]">UGX {totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {totalKg > 100 && (
                <div className="bg-[#f0f7f2] border border-[#d8e6dd] rounded-xl p-3 mb-4 text-center">
                  <p className="text-xs text-zinc-500">
                    Buying in bulk? <button onClick={() => { setQuoteOpen(true); closeModal(); }} className="font-semibold text-[#1a3d2b] underline">Get a custom quotation</button> instead for better rates.
                  </p>
                </div>
              )}
              <button onClick={handleAddToCart} className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#1a3d2b] hover:bg-[#2d6a4f] transition">
                Add to Cart — UGX {totalAmount.toLocaleString()}
              </button>

              <button onClick={closeModal} className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border-2 border-[#d8e6dd] hover:bg-zinc-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SUPPORT */}
      <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white" title="Chat with Support on WhatsApp">
        <MessageCircle size={22} />
      </a>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} onRequestQuote={() => setQuoteOpen(true)} />
      <QuotationModal open={quoteOpen} onClose={() => setQuoteOpen(false)} cartTotal={totalPrice()} />
    </main>
  );
}
