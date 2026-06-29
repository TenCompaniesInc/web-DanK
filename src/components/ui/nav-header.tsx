"use client";
import React, { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Home",     href: "/" },
  { label: "Products", href: "/products" },
  { label: "Order",    href: "/order" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
];

export default function NavHeader() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full p-1"
      style={{
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1.5px solid rgba(200,230,210,0.6)",
        boxShadow: "0 4px 24px rgba(26,61,43,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
      onMouseLeave={() => setHovered(null)}
    >
      {navItems.map((item) => (
        <li
          key={item.label}
          onMouseEnter={() => setHovered(item.label)}
          className="relative z-10 block cursor-pointer px-4 py-2 text-xs uppercase font-bold tracking-widest rounded-full transition-colors duration-150"
          style={{
            background: hovered === item.label ? "rgba(26,61,43,0.12)" : "transparent",
          }}
        >
          <Link
            href={item.href}
            className="text-[#1a3d2b] hover:text-[#c8961e] transition-colors duration-200"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}