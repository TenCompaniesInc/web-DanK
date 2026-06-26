"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  UserSquare,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
  { label: "Products", href: "/admin/products", icon: <Package size={18} /> },
  { label: "Quotations", href: "/admin/quotations", icon: <FileText size={18} /> },
  { label: "Customers", href: "/admin/customers", icon: <Users size={18} /> },
  { label: "Staff", href: "/admin/staff", icon: <UserSquare size={18} /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8f6]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#f5f8f6] flex">

      {/* SIDEBAR */}
      <aside
        className="w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{
          background: "linear-gradient(180deg, #0d2418 0%, #1a3d2b 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Image
              src="/emblem.png"
              alt="DAN K"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <p className="font-bold text-white text-base">DAN K</p>
              <p className="text-[#c8961e] text-[9px] tracking-[2px] uppercase">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive
                    ? "rgba(200,150,30,0.15)"
                    : "transparent",
                  color: isActive ? "#c8961e" : "rgba(255,255,255,0.5)",
                  borderLeft: isActive
                    ? "2px solid #c8961e"
                    : "2px solid transparent",
                }}
              >
                <span style={{ color: isActive ? "#c8961e" : "rgba(255,255,255,0.3)" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#c8961e] flex items-center justify-center text-[#1a3d2b] font-bold text-sm">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold">Admin</p>
              <p className="text-white/40 text-[10px] truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <div className="ml-64 flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}