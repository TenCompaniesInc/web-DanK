"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle } from "lucide-react";

type StaffMember = {
  _id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
  quote: string;
  active: boolean;
  order: number;
};

const fallback: StaffMember[] = [
  { _id: "1", name: "Kabala Dan K.", role: "Founder & Director", phone: "0700 212 147", email: "dan@dankstores.com", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80", quote: "We built DAN K to serve Uganda honestly. Every grain we sell carries our name and our promise.", active: true, order: 0 },
  { _id: "2", name: "Sarah Nakato", role: "Head of Sales", phone: "0701 111 222", email: "sarah@dankstores.com", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80", quote: "My job is to make sure every wholesale client gets the best rate and the fastest service.", active: true, order: 1 },
  { _id: "3", name: "Moses Okello", role: "Store Manager", phone: "0702 333 444", email: "moses@dankstores.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", quote: "Every sack that leaves Kisenyi Road passes through me. Quality is not optional here.", active: true, order: 2 },
];

export default function TeamPage() {
  const [team, setTeam] = useState<StaffMember[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.staff?.length > 0) {
          setTeam(data.staff.filter((m: StaffMember) => m.active));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain" />
            <div className="leading-tight">
              <p className="text-xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
              <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about#staff" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#1a3d2b] transition">
              <ArrowLeft size={15} /> Back to About
            </Link>
            <Link href="/order" className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Order Now</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-[36vh] flex items-end relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d2418 0%,#1a3d2b 60%,#2d6a4f 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%,#c8961e 0%,transparent 60%)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-10 sm:pb-14 pt-16 sm:pt-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs font-bold tracking-[3px] uppercase text-[#c8961e] mb-3">The People</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-none mb-4">
            Meet the Full Team
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/60 text-base max-w-lg">
            The people behind every sack of rice we deliver — from Kisenyi Road to your kitchen.
          </motion.p>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border-2 border-[rgba(200,230,210,0.5)] animate-pulse">
                  <div className="h-72 bg-zinc-100" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-32" />
                    <div className="h-3 bg-zinc-100 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <motion.div key={member._id} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden border-2 border-[rgba(200,230,210,0.7)] hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
                  <div className="h-72 bg-[#d4e8d8] overflow-hidden">
                    <img src={member.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"} alt={member.name}
                      className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-6">
                    <p className="font-bold text-lg text-[#141414]">{member.name}</p>
                    <p className="text-xs font-bold uppercase tracking-[2px] text-[#c8961e] mt-1 mb-3">{member.role}</p>
                    {member.quote && (
                      <p className="text-sm text-zinc-400 italic leading-relaxed mb-4">"{member.quote}"</p>
                    )}

                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d2418]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to order from us?</h2>
          <p className="text-white/50 text-sm mb-8">Place your order online or get a custom bulk quotation.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="px-8 py-3.5 rounded-full bg-[#c8961e] text-[#0d2418] font-bold text-sm hover:opacity-90 transition">Shop Products</Link>
            <Link href="/order#quotation" className="px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition">Get Quotation</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#141414] py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600">
          <p>2026 DAN K CHEAP STORES LTD</p>
          <div className="flex items-center gap-4">
            <a href="https://www.tiktok.com/@dakcheapstores" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition" title="TikTok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
            </a>
            <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white">
        <MessageCircle size={22} />
      </a>
    </main>
  );
}
