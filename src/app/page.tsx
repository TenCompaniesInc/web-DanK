"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PatternText } from "@/components/ui/pattern-text";
import { Testimonial } from "@/components/ui/testimonial";
import { ShuffleCards } from "@/components/ui/testimonial-cards";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import { MeshGradient } from "@paper-design/shaders-react";
import Link from "next/link";
import Image from "next/image";
import CartDrawer from "@/components/CartDrawer";
import NavHeader from "@/components/ui/nav-header";

// ── DATA ──────────────────────────────────────────────────────────────────

const hotDeals = [
  {
    id: 1,
    name: "Long Grain Rice",
    price: 98000,
    oldPrice: 115000,
    weight: "50kg",
    tag: "Best Seller",
    duration: "Ends in 2 days",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80",
  },
  {
    id: 2,
    name: "Brown Organic Rice",
    price: 110000,
    oldPrice: 125000,
    weight: "25kg",
    tag: "Healthy Pick",
    duration: "Ends in 3 days",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
  },
  {
    id: 3,
    name: "Basmati Rice",
    price: 72000,
    oldPrice: 85000,
    weight: "10kg",
    tag: "Premium",
    duration: "Ends in 1 day",
    image: "https://images.unsplash.com/photo-1631898039837-f0e7a48c5175?w=600&q=80",
  },
];

const products = [
  {
    id: 101,
    name: "Long Grain White Rice",
    price: 3200,
    unit: "/kg",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80",
    badge: "Popular",
  },
  {
    id: 102,
    name: "Basmati Rice",
    price: 7200,
    unit: "/kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    badge: "Premium",
  },
  {
    id: 103,
    name: "Parboiled Rice",
    price: 2900,
    unit: "/kg",
    image: "https://images.unsplash.com/photo-1631898039837-f0e7a48c5175?w=400&q=80",
    badge: null,
  },
  {
    id: 104,
    name: "Brown Organic Rice",
    price: 4400,
    unit: "/kg",
    image: "https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=400&q=80",
    badge: "Healthy",
  },
];

const staffTestimonials = [
  {
    name: "Mr. Dan K.",
    designation: "Founder & Director",
    quote:
      "We built DAN K to serve Kampala honestly. Every grain we sell carries our name and our promise — clean, affordable, and always reliable.",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  },
  {
    name: "Sarah Nakato",
    designation: "Head of Sales",
    quote:
      "My job is to make sure every wholesale client gets the best rate and the fastest service. If you need bulk rice in Kampala, I'll sort you out.",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    name: "Moses Okello",
    designation: "Store Manager",
    quote:
      "Every sack that leaves Kisenyi Road passes through me. Quality is not optional here — it's the standard we set from day one.",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    name: "Grace Auma",
    designation: "Customer Relations",
    quote:
      "I make sure every customer — whether they buy 1kg or 100kg — leaves feeling valued. That's what DAN K is about.",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  },
];

const customerTestimonials = [
  {
    id: 1,
    testimonial:
      "DAN K is the only place I buy my rice from. The quality is always consistent and the prices are unbeatable. Over 2 years and I will never go anywhere else.",
    author: "Mama Prossy",
    role: "Restaurant Owner, Kampala",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
  },
  {
    id: 2,
    testimonial:
      "We supply our entire school kitchen from DAN K. Clean rice, fair wholesale pricing, and they always deliver on time. I recommend them to every institution.",
    author: "Mr. Ssekandi",
    role: "School Administrator",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: 3,
    testimonial:
      "Best basmati in Kampala, no question. My guests always ask what rice I use. The answer is always DAN K. Clean grain, perfect texture every time.",
    author: "Chef Amara",
    role: "Private Chef, Kololo",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
  {
    id: 4,
    testimonial:
      "I buy wholesale from many stores in Kampala. DAN K gives the best price per sack and the quality never disappoints my customers. Real business people.",
    author: "Hajji Kateregga",
    role: "Wholesale Trader, Owino Market",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
  },
  {
    id: 5,
    testimonial:
      "We feed hundreds of patients every day. DAN K understands consistency. Every delivery is on time, every sack is clean. That matters more than people know.",
    author: "Sister Florence",
    role: "Hospital Catering, Mulago",
    image: "https://images.unsplash.com/photo-1524267213992-b76e8577d046?w=200&q=80",
  },
];

// ── FADE IN SECTION ───────────────────────────────────────────────────────

function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── COMPONENT ──────────────────────────────────────────────────────────────

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dealIndex, setDealIndex] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setDealIndex((prev) => (prev + 1) % hotDeals.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
<motion.nav
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]"
>
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

    {/* Logo */}
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/emblem.png"
        alt="DAN K Logo"
        width={52}
        height={52}
        className="object-contain"
      />
      <div className="leading-tight">
        <p className="text-2xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
        <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">
          Origin of Quality
        </p>
      </div>
    </Link>

    {/* Animated Nav */}
    <div className="hidden md:block">
      <NavHeader />
    </div>

    {/* Right side */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex items-center gap-2 border border-[#d8e6dd] rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-50 transition"
      >
        <ShoppingCart size={16} />
        Cart
        {totalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#c8961e] text-[#1a3d2b] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems()}
          </span>
        )}
      </button>
      <Link
        href="/order"
        className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        Order Now
      </Link>
    </div>
  </div>
</motion.nav>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end justify-start pt-16 overflow-hidden">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#0d2418", "#1a3d2b", "#2d6a4f", "#c8961e", "#0a1f12"]}
          speed={0.25}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />

        <div className="relative z-20 max-w-3xl px-10 pb-16 md:pb-20">

          {/* DAN K */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="mb-0"
          >
            <PatternText text="DAN K" className="text-white !text-left" />
          </motion.div>

          {/* Cheap Stores Ltd */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg md:text-2xl font-bold tracking-[6px] uppercase text-[#c8961e] mt-1 mb-6"
          >
            Cheap Stores Ltd
          </motion.p>

          {/* Glass line with chip label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="relative flex items-center w-full max-w-lg mb-8"
          >
            <div
              className="h-px w-8 flex-shrink-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35))",
              }}
            />
            <div className="flex-shrink-0 mx-3 px-3 py-1 rounded-full border border-white/20 bg-white/8 backdrop-blur-sm">
              <span className="text-white/60 text-[10px] font-semibold tracking-[2px] uppercase whitespace-nowrap">
                Origin of Quality · Kisenyi Road, Kampala
              </span>
            </div>
            <div
              className="h-px flex-1"
              style={{
                background: "linear-gradient(90deg, rgba(200,150,30,0.5), transparent)",
              }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-base md:text-lg text-white/60 max-w-lg mb-10 leading-relaxed font-light"
          >
            Premium Grade A rice sourced clean, graded right, and priced honestly.
            Uganda's go-to grain store for homes, restaurants, and traders.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex gap-4 flex-wrap"
          >
            <Link
              href="/products"
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-white border-2 border-white/25 bg-white/10 backdrop-blur hover:bg-white/20 hover:border-white/40 transition-all"
            >
              Shop Rice
            </Link>
            <Link
              href="/order"
              className="px-8 py-3.5 rounded-full text-sm font-bold bg-[#c8961e] text-[#0d2418] hover:opacity-90 transition-all shadow-lg"
            >
              Order / Quotation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOT DEALS ── */}
      <section
        id="deals"
        className="py-20"
        style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">
                  This Week Only
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-[#141414]">
                  Hot Deals
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-medium text-[#1a3d2b] border border-[#d8e6dd] bg-white/60 backdrop-blur px-4 py-2 rounded-lg hover:bg-white transition flex items-center gap-1"
              >
                Show More <ChevronRight size={14} />
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotDeals.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Card
                  className={`overflow-hidden border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md shadow-sm transition-all duration-300 ${
                    dealIndex === i
                      ? "ring-2 ring-[#c8961e] scale-[1.02] shadow-lg"
                      : "hover:-translate-y-1"
                  }`}
                >
                  <div className="relative h-44 bg-[#d4e8d8]">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wide uppercase text-[#c8961e] bg-white/90 backdrop-blur px-2 py-1 rounded-full">
                      {deal.tag}
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] font-semibold text-white bg-[#1a3d2b]/80 backdrop-blur px-2 py-1 rounded-full">
                      ⏱ {deal.duration}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm text-[#141414] mb-1">{deal.name}</p>
                    <p className="text-xs text-zinc-400 mb-2">{deal.weight} sack</p>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xl font-bold text-[#1a3d2b]">
                        UGX {deal.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-400 line-through">
                        UGX {deal.oldPrice.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white text-sm h-9"
                      onClick={() =>
                        addToCart({
                          id: deal.id,
                          name: deal.name,
                          price: deal.price,
                          weight: deal.weight,
                          image: deal.image.split("?")[0],
                        })
                      }
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {hotDeals.map((_, i) => (
              <button
                key={i}
                onClick={() => setDealIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  dealIndex === i ? "bg-[#1a3d2b] w-6" : "bg-[#d8e6dd] w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTED PRODUCTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">
                  Our Stock
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-[#141414]">
                  Products
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline"
              >
                Show More <ArrowRight size={14} />
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <FadeInSection key={p.id} delay={i * 0.1}>
                <Card className="overflow-hidden border-2 border-[rgba(200,230,210,0.65)] bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <div className="relative h-40 bg-[#e6f0e8]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {p.badge && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase text-white bg-[#1a3d2b] px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="font-semibold text-xs text-[#141414] mb-1 leading-tight">
                      {p.name}
                    </p>
                    <p className="text-base font-bold text-[#1a3d2b]">
                      UGX {p.price.toLocaleString()}
                      <span className="text-xs font-normal text-zinc-400">{p.unit}</span>
                    </p>
                    <Button
                      className="w-full mt-2 bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white text-xs h-8"
                      onClick={() =>
                        addToCart({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          weight: p.unit,
                          image: p.image.split("?")[0],
                        })
                      }
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section
        className="py-24"
        style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeInSection>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">
              Why We Exist
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-[#141414] mb-8">
              Mission & Vision
            </h2>
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-[#1a3d2b] mb-3">Our Mission</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  To provide the cleanest, most fairly priced rice to every household,
                  restaurant, and trader in Uganda — with no compromises on grade and no
                  confusion about pricing. What you see is what you pay.
                </p>
              </div>
              <div className="p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md">
                <div className="text-3xl mb-4">🔭</div>
                <h3 className="text-lg font-bold text-[#1a3d2b] mb-3">Our Vision</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  To be Uganda's most trusted grain supplier by 2030 — building a supply
                  chain that connects clean, locally sourced grain directly to consumers
                  and businesses across the country, starting in Kampala.
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── DIRECTOR'S WORDS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <FadeInSection>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3 text-center">
              Words from the Director
            </p>
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <Testimonial
              quote="We didn't build DAN K to compete — we built it to serve. Every sack of rice you buy here carries the same promise: clean, honest, affordable. Kampala deserves nothing less, and we will never stop delivering on that promise."
              highlightedText="clean, honest, affordable"
              authorName="Mr. Dan K."
              authorPosition="Founder & Director, DAN K CHEAP STORES LTD"
              authorImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80"
            />
          </FadeInSection>
        </div>
      </section>

      {/* ── STAFF ── */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">
                  The People
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-[#141414]">
                  Our Team
                </h2>
                <p className="text-sm text-zinc-400 mt-2">
                  The people behind every sack of rice we deliver.
                </p>
              </div>
              <Link
                href="/team"
                className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline"
              >
                All Staff <ArrowRight size={14} />
              </Link>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div className="flex justify-center">
              <CircularTestimonials
                testimonials={staffTestimonials}
                autoplay={true}
                colors={{
                  name: "#1a3d2b",
                  designation: "#c8961e",
                  testimony: "#4b5563",
                  arrowBackground: "#1a3d2b",
                  arrowForeground: "#ffffff",
                  arrowHoverBackground: "#c8961e",
                }}
                fontSizes={{
                  name: "22px",
                  designation: "14px",
                  quote: "15px",
                }}
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── CUSTOMER TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">
                What People Say
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-[#141414]">
                Words from Our Customers
              </h2>
              <p className="text-sm text-zinc-400 mt-3">
                Drag the card or wait 5 seconds
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div className="flex justify-center items-center min-h-[340px]">
              <ShuffleCards testimonials={customerTestimonials} />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── BIBLE VERSE ── */}
      <section className="py-24 bg-[#0d2418]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeInSection>
            <div className="text-4xl mb-8">✝</div>
            <blockquote className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed italic mb-6">
              "The Lord will open to you his good treasury, the heavens, to give the
              rain to your land in its season and to bless all the work of your hands."
            </blockquote>
            <p className="text-[#c8961e] font-bold tracking-widest text-sm uppercase">
              Deuteronomy 28:12
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#141414] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/emblem.png"
                  alt="DAN K"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <div>
                  <p className="font-bold text-white text-sm">DAN K</p>
                  <p className="text-[#c8961e] text-[10px] tracking-widest uppercase">
                    Origin of Quality
                  </p>
                </div>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Premium rice and grain store on Kisenyi Road, Kampala. Clean quality,
                honest prices, every day.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-4">
                Quick Links
              </p>
              <div className="flex flex-col gap-2">
                {["Products", "About", "Mission", "Team", "Order"].map((l) => (
                  <Link
                    key={l}
                    href={`/${l.toLowerCase()}`}
                    className="text-zinc-500 text-sm hover:text-[#c8961e] transition"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-4">
                Contact
              </p>
              <div className="text-zinc-500 text-sm leading-loose">
                <p>📍 26d Kisenyi Road, Kampala</p>
                <p>📞 0700 212 147</p>
                <p>🕐 Mon–Sun · 7am – 7:30pm</p>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-6 flex items-center justify-between text-xs text-zinc-600">
            <p>© 2025 DAN K CHEAP STORES LTD</p>
            <p>
              Built by <span className="text-zinc-500">Ten Developers</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CART ── */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-[#1a3d2b] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"
      >
        <ShoppingCart size={22} />
        {totalItems() > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalItems()}
          </div>
        )}
      </button>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}