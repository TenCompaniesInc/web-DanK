"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Order", href: "/order" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type Position = {
  left: number;
  width: number;
  opacity: number;
};

function NavHeader() {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

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
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {navItems.map((item) => (
        <Tab key={item.label} href={item.href} setPosition={setPosition}>
          {item.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

function Tab({
  children,
  href,
  setPosition,
}: {
  children: React.ReactNode;
  href: string;
  setPosition: (pos: Position) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-4 py-2 text-xs uppercase font-bold tracking-widest"
    >
      <Link
        href={href}
        className="text-[#1a3d2b] hover:text-[#c8961e] transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

function Cursor({ position }: { position: Position }) {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 rounded-full pointer-events-none"
      style={{
        height: "calc(100% - 8px)",
        top: "4px",
        background: "linear-gradient(135deg, rgba(26,61,43,0.15) 0%, rgba(200,150,30,0.12) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1.5px solid rgba(200,230,210,0.8)",
        boxShadow: "0 2px 12px rgba(26,61,43,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    />
  );
}

export default NavHeader;