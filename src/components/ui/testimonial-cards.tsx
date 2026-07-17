"use client";
import * as React from "react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: string;
  author: string;
  role: string;
}

export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  author,
  role,
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";
  const initial = author.trim().charAt(0).toUpperCase();

  return (
    <motion.div
      style={{ zIndex: position === "front" ? 3 : position === "middle" ? 2 : 1 }}
      animate={{
        rotate: position === "front" ? "-5deg" : position === "middle" ? "0deg" : "5deg",
        x: position === "front" ? "0%" : position === "middle" ? "8%" : "16%",
        y: position === "front" ? "0%" : position === "middle" ? "-4%" : "-8%",
      }}
      drag={isFront}
      dragElastic={0.25}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e: any) => { dragRef.current = e.clientX; }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 120) handleShuffle();
        dragRef.current = 0;
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`absolute left-0 top-0 flex flex-col h-[300px] w-[320px] select-none rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/80 backdrop-blur-md p-6 shadow-xl gap-5 ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {/* Quote mark */}
      <div className="text-5xl leading-none text-[#c8961e]/30 font-serif">&ldquo;</div>

      {/* Quote */}
      <p className="text-sm text-zinc-600 leading-relaxed italic flex-1 -mt-3">
        {testimonial}
      </p>

      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[#c8961e] text-sm">★</span>
        ))}
      </div>

      {/* Bottom — initial badge + name */}
      <div className="flex items-center gap-3 pt-1 border-t border-[#eef4f0]">
        <div className="w-10 h-10 rounded-full bg-[#1a3d2b] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-3">
          {initial}
        </div>
        <div className="mt-3">
          <p className="font-bold text-sm text-[#1a3d2b]">{author}</p>
          {role ? <p className="text-xs text-[#c8961e] font-semibold">{role}</p> : <p className="text-xs text-zinc-400">Verified Customer</p>}
        </div>
      </div>

      {isFront && (
        <p className="text-[10px] text-zinc-300 text-right tracking-wide">drag to next →</p>
      )}
    </motion.div>
  );
}

interface ShuffleCardsProps {
  testimonials: { id: number; testimonial: string; author: string; role: string }[];
}

export function ShuffleCards({ testimonials }: ShuffleCardsProps) {
  const [positions, setPositions] = React.useState(
    testimonials.map((_, i) => (i === 0 ? "front" : i === 1 ? "middle" : "back"))
  );

  const handleShuffle = React.useCallback(() => {
    setPositions((prev) => {
      const next = [...prev];
      next.push(next.shift()!);
      return next;
    });
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => handleShuffle(), 5000);
    return () => clearInterval(interval);
  }, [handleShuffle]);

  return (
    <div className="relative h-[300px] w-[320px]">
      {testimonials.map((t, index) => (
        <TestimonialCard
          key={t.id}
          testimonial={t.testimonial}
          author={t.author}
          role={t.role}
          handleShuffle={handleShuffle}
          position={positions[index] ?? "back"}
        />
      ))}
    </div>
  );
}
