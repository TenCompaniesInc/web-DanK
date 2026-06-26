"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import NavHeader from "@/components/ui/nav-header";
import { MapPin, Phone, Clock, Mail, Send, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const contactInfo = [
  { icon: <MapPin size={20} />, label: "Main Branch", value: "Covenant Building, Kisenyi Road", sub: "Kampala — come in anytime", href: "https://maps.google.com/?q=Kisenyi+Road+Kampala" },
  { icon: <Phone size={20} />, label: "Phone", value: "0700 212 147", sub: "Call or WhatsApp anytime", href: "tel:0700212147" },
  { icon: <Clock size={20} />, label: "Hours", value: "Sun – Fri · 7am – 7:30pm", sub: "Closed on Saturdays", href: null },
  { icon: <Mail size={20} />, label: "WhatsApp", value: "+256 700 212 147", sub: "Fast response within minutes", href: "https://wa.me/256700212147" },
];

const branches = [
  { name: "Nansana Head Office", detail: "Nansana Municipality, Wakiso", tag: "Head Office", isMain: true },
  { name: "Kisenyi (Main Branch)", detail: "Covenant Building, Kisenyi Road, Kampala", tag: "Main Branch", isMain: true },
  { name: "Jinja Branch", detail: "Jinja, Eastern Uganda", tag: "Branch", isMain: false },
  { name: "Luweero Branch", detail: "Luweero, Central Uganda", tag: "Branch", isMain: false },
  { name: "Katooke Branch", detail: "Katooke, Kampala", tag: "Branch", isMain: false },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1800);
  };

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

      <section className="pt-16 min-h-[40vh] flex items-end justify-start relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d2418 0%, #1a3d2b 60%, #2d6a4f 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #c8961e 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-14 pt-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs font-bold tracking-[3px] uppercase text-[#c8961e] mb-3">Get in Touch</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-none mb-4">
            We are Right Here<br /><span className="text-[#c8961e]">on Kisenyi Road.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-white/60 text-base max-w-lg leading-relaxed">
            Walk in, call us, WhatsApp, or send a message below. We respond fast — usually within minutes.
          </motion.p>
        </div>
      </section>

      <section className="py-16" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {contactInfo.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.08}>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="block h-full">
                    <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200 h-full cursor-pointer">
                      <CardContent className="p-5">
                        <div className="w-10 h-10 rounded-xl bg-[#f0f7f2] border border-[#d8e6dd] flex items-center justify-center text-[#1a3d2b] mb-4">{item.icon}</div>
                        <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#c8961e] mb-1">{item.label}</p>
                        <p className="font-semibold text-sm text-[#141414] mb-1">{item.value}</p>
                        <p className="text-xs text-zinc-400">{item.sub}</p>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Card className="border-2 border-[rgba(200,230,210,0.7)] bg-white/65 backdrop-blur-md h-full">
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl bg-[#f0f7f2] border border-[#d8e6dd] flex items-center justify-center text-[#1a3d2b] mb-4">{item.icon}</div>
                      <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#c8961e] mb-1">{item.label}</p>
                      <p className="font-semibold text-sm text-[#141414] mb-1">{item.value}</p>
                      <p className="text-xs text-zinc-400">{item.sub}</p>
                    </CardContent>
                  </Card>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">Send a Message</p>
              <h2 className="text-3xl font-bold tracking-tight text-[#141414] mb-8">How can we help you?</h2>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-[#f5f8f6]">
                  <CheckCircle size={52} className="text-[#1a3d2b] mb-4" />
                  <h3 className="text-xl font-bold text-[#1a3d2b] mb-2">Message Received!</h3>
                  <p className="text-zinc-400 text-sm mb-6 max-w-xs leading-relaxed">Thanks {form.name}. We will get back to you on <strong className="text-[#1a3d2b]">{form.phone}</strong> within minutes.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", phone: "", email: "", subject: "", message: "" }); }} className="text-sm font-semibold text-[#1a3d2b] underline">Send another message</button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Ssekandi" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Phone Number *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="0700 212 147" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Email (optional)</label>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition">
                      <option value="">Select a subject</option>
                      <option value="order">Place an Order</option>
                      <option value="quotation">Request Bulk Quotation</option>
                      <option value="delivery">Delivery Enquiry</option>
                      <option value="complaint">Complaint or Feedback</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what you need..." rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none" />
                  </div>
                  <Button className="w-full bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white h-12 font-semibold text-sm flex items-center justify-center gap-2" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Sending..." : (<><Send size={15} /> Send Message</>)}
                  </Button>
                  <div className="flex gap-3 pt-1">
                    <a href="tel:0700212147" className="flex-1 text-center text-xs font-semibold text-[#1a3d2b] border-2 border-[#d8e6dd] rounded-xl py-3 hover:bg-[#f5f8f6] transition">📞 Call: 0700 212 147</a>
                    <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-semibold text-[#1a3d2b] border-2 border-[#d8e6dd] rounded-xl py-3 hover:bg-[#f5f8f6] transition">💬 WhatsApp Us</a>
                  </div>
                </div>
              )}
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">Find Us</p>
              <h2 className="text-3xl font-bold tracking-tight text-[#141414] mb-6">Visit the Store</h2>
              <div className="rounded-2xl overflow-hidden border-2 border-[rgba(200,230,210,0.7)] mb-6 h-64">
                <iframe title="DAN K Store Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757!2d32.5796!3d0.3136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCsxOCcyOS4yIk4gMzLCsDM0JzQ2LjYiRQ!5e0!3m2!1sen!2sug!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-[#f5f8f6]">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#1a3d2b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-[#141414]">DAN K CHEAP STORES LTD</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Covenant Building, Kisenyi Road, Kampala</p>
                      <a href="https://maps.google.com/?q=Kisenyi+Road+Kampala" target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#1a3d2b] underline mt-2 inline-block">Get Directions →</a>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-[#f5f8f6]">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-[#1a3d2b] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-[#141414]">Opening Hours</p>
                      <div className="mt-2 space-y-1">
                        {[{ day: "Sunday – Friday", time: "7:00am – 7:30pm" }, { day: "Saturday", time: "Closed" }].map((h) => (
                          <div key={h.day} className="flex justify-between text-xs">
                            <span className="text-zinc-500">{h.day}</span>
                            <span className="font-semibold text-[#1a3d2b]">{h.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="py-20" style={{ background: "linear-gradient(140deg,#eaf2ed 0%,#f2f8f4 55%,#e6f0ea 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[2px] uppercase text-[#c8961e] mb-3">Find Us Across Uganda</p>
              <h2 className="text-4xl font-bold tracking-tight text-[#141414]">Our Branches</h2>
              <p className="text-sm text-zinc-400 mt-3">Five locations and growing — serving Uganda one sack at a time.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
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

      <section className="py-16 bg-[#0d2418]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-3xl mb-4 opacity-30">✝</p>
            <p className="text-lg text-white/70 italic leading-relaxed mb-4">"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."</p>
            <p className="text-[#c8961e] text-xs font-bold tracking-[2px] uppercase">Matthew 7:7</p>
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
            <p>2026 DAN K CHEAP STORES LTD · Kampala, Uganda</p>
            <p>Built by <span className="text-zinc-500">Ten Developers</span></p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/256700212147" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white" title="Chat with Support on WhatsApp"><MessageCircle size={22} /></a>
    </main>
  );
}
