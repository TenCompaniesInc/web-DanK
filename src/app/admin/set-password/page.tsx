"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function SetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()) { setError("Enter your company email."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setTimeout(() => router.push("/admin/login"), 2500);
      } else {
        setError(data.error || "Could not set password.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f5f8f6] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.7)] p-8 shadow-sm">
        <Link href="/" className="flex items-center justify-center gap-3 mb-6">
          <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain" />
          <div className="text-left leading-tight">
            <p className="text-xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
            <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">Admin Access</p>
          </div>
        </Link>

        {done ? (
          <div className="text-center py-6">
            <CheckCircle size={52} className="text-[#1a3d2b] mx-auto mb-4" />
            <h1 className="text-xl font-bold text-[#1a3d2b] mb-2">Password Set!</h1>
            <p className="text-sm text-zinc-400 mb-4">Taking you to the sign-in page...</p>
            <Link href="/admin/login" className="text-sm font-semibold text-[#1a3d2b] underline">Go to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-bold text-[#141414] mb-1 text-center">Set Your Password</h1>
            <p className="text-xs text-zinc-400 mb-6 text-center leading-relaxed">
              First time here? Enter your authorized company email and choose your password.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Company Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@dankcheapstores.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Choose a Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#1a3d2b]">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">Confirm Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] bg-white text-sm focus:outline-none focus:border-[#1a3d2b] transition"
                />
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#1a3d2b] hover:bg-[#2d6a4f] transition disabled:opacity-60"
              >
                {loading ? "Setting password..." : "Set Password"}
              </button>

              <p className="text-center text-xs text-zinc-400">
                Already have a password? <Link href="/admin/login" className="font-semibold text-[#1a3d2b] underline">Sign In</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
