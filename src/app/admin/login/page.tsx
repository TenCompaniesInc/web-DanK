"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #0d2418 0%, #1a3d2b 60%, #2d6a4f 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #c8961e 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/emblem.png"
              alt="DAN K"
              width={64}
              height={64}
              className="object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DAN K Admin
            </h1>
            <p className="text-white/50 text-xs mt-1 tracking-[2px] uppercase">
              Secure Portal
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dankstores.com"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: loading
                ? "rgba(200,150,30,0.5)"
                : "linear-gradient(135deg, #c8961e, #e8b84b)",
              color: "#0d2418",
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p className="text-center text-white/40 text-xs mt-5">
            First time here?{" "}
            <Link href="/admin/set-password" className="font-semibold text-[#c8961e] underline underline-offset-2 hover:text-[#e0aa2e] transition">
              Set your password
            </Link>
          </p>
          <p className="text-center text-white/25 text-xs mt-6">
            DAN K CHEAP STORES LTD · Admin Only
          </p>
        </div>
      </motion.div>
    </main>
  );
}