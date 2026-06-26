"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const values = [
  { title: "Grade A Only", desc: "Every grain is sorted and cleaned before it reaches our shelves. No compromises." },
  { title: "Honest Pricing", desc: "What you see is what you pay. No hidden charges, no market day surprises." },
  { title: "Community First", desc: "We serve homes, schools, hospitals, and traders. Everyone gets the same quality." },
  { title: "Reliable Delivery", desc: "Uganda-wide delivery on bulk orders. On time, every time." },
  { title: "Easy Payments", desc: "Pay via MTN or Airtel Mobile Money — no cash needed, no queues." },
  { title: "Full Transparency", desc: "Real stock, real prices, real people. You always know what you're getting." },
];

const milestones = [
  { year: "2018", title: "Founded on Kisenyi Road", desc: "Kabala Dan K opens the first store with a simple promise — clean rice at fair prices." },
  { year: "2020", title: "Wholesale Expansion", desc: "DAN K begins supplying schools, hotels and restaurants across Kampala." },
  { year: "2022", title: "Team Grows", desc: "Sarah Nakato and Moses Okello join — sales and operations locked in." },
  { year: "2024", title: "Online Store Launches", desc: "DAN K goes digital. Customers can now order rice online and pay via Mobile Money." },
  { year: "2026", title: "DAN K CHEAP STORES LTD", desc: "Officially registered as a limited company with five locations. Building toward national supply." },
];

const team = [
  { name: "Kabala Dan K.", role: "Founder & Director", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Sarah Nakato", role: "Head of Sales", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Moses Okello", role: "Store Manager", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
];

const branches = [
  { name: "Nansana Head Office", detail: "Nansana Municipality, Wakiso", tag: "Head Office", isMain: true },
  { name: "Kisenyi (Main Branch)", detail: "Covenant Building, Kisenyi Road, Kampala", tag: "Main Branch", isMain: true },
  { name: "Jinja Branch", detail: "Jinja, Eastern Uganda", tag: "Branch", isMain: false },
  { name: "Luweero Branch", detail: "Luweero, Central Uganda", tag: "Branch", isMain: false },
  { name: "Katooke Branch", detail: "Katooke, Kampala", tag: "Branch", isMain: false },
];

export default function AboutPage() {
  const [liveTeam, setLiveTeam] = useState(team);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.staff?.length > 0) {
          setLiveTeam(
            data.staff
              .filter((m: any) => m.active)
              .map((m: any) => ({
                name: m.name,
                role: m.role,
                image: m.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
              }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-white">

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
          <Link href="/order" className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Order Now</Link>
        </div>
      </nav>

      <section className="pt-16 min-h-[50vh] flex items-end justify-start relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d2418 0%, #1a3d2b 60%, #2d6a4f 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #c8961e 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-10 sm:pb-16 pt-16 sm:pt-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs font-bold tracking-[3px] uppercase text-[#c8961e] mb-3">Who We Are</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-6">
            Built to Serve<br /><span className="text-[#c8961e]">Uganda.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-white/60 text-lg max-w-xl leading-relaxed">
            DAN K CHEAP STORES LTD started with one promise — clean rice, honest prices, and a store that actually cares about the people it serves.
          </motion.p>
        </div>
      </section>

      <section className="py-14 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <FadeIn>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" alt="DAN K Store" className="w-full h-[440px] object-cover rounded-2xl border-2 border-[rgba(200,230,210,0.5)]" />
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">Our Story</p>
              <h2 className="text-4xl font-bold tracking-tight text-[#141414] mb-6 leading-tight">From Kisenyi Road<br />to Uganda's Kitchens</h2>
              <p className="text-zinc-500 leading-relaxed mb-4">DAN K CHEAP STORES was founded on Kisenyi Road with a straightforward idea — Ugandans deserve access to clean, high-quality rice without paying inflated market prices or dealing with inconsistent grades.</p>
              <p className="text-zinc-500 leading-relaxed mb-4">We started small, serving neighbourhood homes and local traders. Today we supply restaurants, hotels, schools, and hospitals across Uganda from five locations — and we've never compromised on the quality of what we sell.</p>
              <p className="text-zinc-500 leading-relaxed">Every sack that leaves our stores is sorted, cleaned, and graded. Every price you see is the price you pay. That's the DAN K promise — and it hasn't changed since day one.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">Why We Exist</p>
            <h2 className="text-4xl font-bold tracking-tight text-[#141414] mb-12">Mission, Vision & the Problem We're Solving</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <div className="p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md h-full">
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Our Mission</p>
                <h3 className="text-xl font-bold text-[#1a3d2b] mb-4 leading-tight">Make quality rice accessible to every Ugandan</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">To provide the cleanest, most fairly priced rice and grain products to every household, restaurant, and trader in Uganda — with no compromises on grade and no confusion about pricing. What you see is what you pay.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md h-full">
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">Our Vision</p>
                <h3 className="text-xl font-bold text-[#1a3d2b] mb-4 leading-tight">Uganda's most trusted grain supplier by 2030</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">To build a supply chain that connects clean, locally sourced grain directly to consumers and businesses across Uganda — starting in Kampala, growing nationwide. We want DAN K to be the name people trust when it comes to what they put on the table.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="p-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md h-full">
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">The Problem We Solve</p>
                <h3 className="text-xl font-bold text-[#1a3d2b] mb-4 leading-tight">Grain markets are confusing, inconsistent & overpriced</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Most grain buyers in Uganda face hidden charges, inconsistent quality between purchases, and no way to order without showing up in person. DAN K fixes this — real stock, real prices, online ordering, and Mobile Money payment. No guesswork.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">What We Stand For</p>
            <h2 className="text-4xl font-bold tracking-tight text-[#141414] mb-12">Our Core Values</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border-2 border-[rgba(200,230,210,0.65)] bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 h-full">
                  <h3 className="font-bold text-[#1a3d2b] mb-2">{v.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="py-24" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">Find Us Across Uganda</p>
              <h2 className="text-4xl font-bold tracking-tight text-[#141414]">Our Branches</h2>
              <p className="text-sm text-zinc-400 mt-3">Five locations and growing — serving Uganda one sack at a time.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {branches.map((b, i) => (
              <FadeIn key={b.name} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border-2 bg-white/70 backdrop-blur-md h-full" style={{ borderColor: b.isMain ? "#c8961e" : "rgba(200,230,210,0.7)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: b.isMain ? "rgba(200,150,30,0.12)" : "#f0f7f2", color: b.isMain ? "#c8961e" : "#1a3d2b" }}><MapPin size={20} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: b.isMain ? "rgba(200,150,30,0.12)" : "#f0f7f2", color: b.isMain ? "#c8961e" : "#1a3d2b" }}>{b.tag}</span>
                  <h3 className="font-bold text-[#141414] mt-3 mb-1">{b.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{b.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="staff" className="py-14 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-2">The People</p>
                <h2 className="text-4xl font-bold tracking-tight text-[#141414]">Meet the Team</h2>
              </div>
              <Link href="/team" className="text-sm font-medium text-[#1a3d2b] flex items-center gap-1 hover:underline">See All Staff <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {liveTeam.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="rounded-2xl overflow-hidden border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md">
                  <div className="h-64 bg-[#d4e8d8]"><img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" /></div>
                  <div className="p-5">
                    <p className="font-bold text-[#141414]">{member.name}</p>
                    <p className="text-xs text-[#c8961e] font-semibold uppercase tracking-wide mt-1">{member.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-[#0d2418]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="text-5xl mb-6 opacity-30">"</div>
            <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed italic mb-8">We didn't build DAN K to compete — we built it to serve. Every sack of rice you buy here carries the same promise: clean, honest, affordable. Uganda deserves nothing less.</p>
            <div className="flex items-center justify-center gap-4">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="Kabala Dan K." className="w-12 h-12 rounded-full object-cover border-2 border-[#c8961e]" />
              <div className="text-left">
                <p className="font-bold text-white text-sm">Kabala Dan K.</p>
                <p className="text-[#c8961e] text-xs">Founder & Director</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-[#141414] mb-4">Ready to order?</h2>
            <p className="text-zinc-400 text-sm mb-8">Browse our full range of rice products and place your order online.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products" className="px-8 py-3.5 rounded-full bg-[#1a3d2b] text-white font-semibold text-sm hover:opacity-90 transition">Shop Products</Link>
              <Link href="/order" className="px-8 py-3.5 rounded-full border-2 border-[#1a3d2b] text-[#1a3d2b] font-semibold text-sm hover:bg-[#1a3d2b] hover:text-white transition">Get Quotation</Link>
            </div>
          </FadeIn>
        </div>
      </section>

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
            <div className="flex items-center gap-4">
              <a href="https://www.tiktok.com/@dakcheapstores" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition" title="DAN K on TikTok"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg></a>
              <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
            </div>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white" title="Chat with Support on WhatsApp"><MessageCircle size={22} /></a>
    </main>
  );
}
