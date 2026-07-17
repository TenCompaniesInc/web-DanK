"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, ChevronRight } from "lucide-react";

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
  { _id: "1", name: "Kabala Dan K.", role: "Founder & Director", phone: "0731 496 117", email: "dan@dankstores.com", image: "/home/director.jpeg", quote: "We built DAN K to serve Uganda honestly. Every grain we sell carries our name and our promise.", active: true, order: 0 },
  { _id: "2", name: "Sarah Nakato", role: "Head of Sales", phone: "0701 111 222", email: "sarah@dankstores.com", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80", quote: "My job is to make sure every wholesale client gets the best rate and the fastest service.", active: true, order: 1 },
  { _id: "3", name: "Moses Okello", role: "Store Manager", phone: "0702 333 444", email: "moses@dankstores.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", quote: "Every sack that leaves Kisenyi Road passes through me. Quality is not optional here.", active: true, order: 2 },
];

export default function TeamPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes heroIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-xl border-b border-[#d8e6dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain w-10 h-10 sm:w-11 sm:h-11" />
            <div className="leading-tight">
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[2px] uppercase text-[#c8961e]">Origin of Quality</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/about" className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-[#1a3d2b] transition"><ArrowLeft size={15} /> About</Link>
            <Link href="/order" className="bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Order Now</Link>
          </div>
          <button onClick={() => setMobileMenuOpen((v) => !v)} className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-zinc-50 transition" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-[#1a3d2b] transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#1a3d2b] transition-all duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#1a3d2b] transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#d8e6dd] shadow-xl z-[70]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-2 flex flex-col">
              {[["Home", "/"], ["Products", "/products"], ["Order", "/order"], ["About", "/about"], ["Contact", "/contact"], ["Team", "/team"]].map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="text-[#1a3d2b] font-semibold text-base py-3.5 border-b border-[#f0f7f2] last:border-0 flex items-center justify-between active:text-[#c8961e]">
                  {label} <ChevronRight size={16} className="text-zinc-300" />
                </Link>
              ))}
              <Link href="/order" onClick={() => setMobileMenuOpen(false)} className="my-3 w-full text-center bg-[#1a3d2b] text-white text-sm font-semibold px-4 py-3.5 rounded-xl">Order Now</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-[36vh] flex items-end relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d2418 0%,#1a3d2b 60%,#2d6a4f 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%,#c8961e 0%,transparent 60%)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 pb-8 sm:pb-14 pt-14 sm:pt-20">
          <p className="text-xs font-bold tracking-[3px] uppercase text-[#c8961e] mb-3" style={{ animation: "heroIn 0.5s ease-out 0.1s both" }}>The People</p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-none mb-4" style={{ animation: "heroIn 0.6s ease-out 0.2s both" }}>
            Meet the Full Team
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg" style={{ animation: "heroIn 0.6s ease-out 0.35s both" }}>
            The people behind every sack of rice we deliver — from Kisenyi Road to your kitchen.
          </p>
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
                <div key={member._id} className="bg-white rounded-2xl overflow-hidden border-2 border-[rgba(200,230,210,0.7)] hover:-translate-y-1 hover:shadow-xl transition-all duration-200" style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}>
                  <div className="h-56 sm:h-72 bg-[#d4e8d8] overflow-hidden">
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
                </div>
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
      <footer className="bg-[#141414] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/emblem.png" alt="DAN K" width={36} height={36} className="object-contain" />
                <div><p className="font-bold text-white text-sm">DAN K</p><p className="text-[#c8961e] text-[10px] tracking-widest uppercase">Origin of Quality</p></div>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Premium rice and grain store. Head office in Nansana, main branch at Covenant Building, Kisenyi. Branches in Katooke, Luweero, Iganga & Jinja.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-zinc-600 mb-3">Quick Links</p>
              <div className="flex flex-col gap-2">
                {["Products", "About", "Order", "Contact"].map((l) => (<Link key={l} href={"/" + l.toLowerCase()} className="text-zinc-500 text-sm hover:text-[#c8961e] transition">{l}</Link>))}
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

      <a href="https://wa.me/256731496117" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-[50] bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </main>
  );
}