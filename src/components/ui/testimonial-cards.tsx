"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: string;
  author: string;
  role: string;
  image: string;
}

export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  author,
  role,
  image,
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? 3 : position === "middle" ? 2 : 1,
      }}
      animate={{
        rotate:
          position === "front" ? "-5deg" : position === "middle" ? "0deg" : "5deg",
        x:
          position === "front" ? "0%" : position === "middle" ? "8%" : "16%",
        y:
          position === "front" ? "0%" : position === "middle" ? "-4%" : "-8%",
      }}
      drag={isFront}
      dragElastic={0.25}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e: any) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 120) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`absolute left-0 top-0 flex flex-col h-[300px] w-[320px] select-none rounded-2xl border-2 border-[rgba(200,230,210,0.7)] bg-white/80 backdrop-blur-md p-6 shadow-xl gap-5 ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {/* Top — avatar + name */}
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={author}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#d8e6dd] pointer-events-none"
        />
        <div>
          <p className="font-bold text-sm text-[#1a3d2b]">{author}</p>
          <p className="text-xs text-[#c8961e] font-semibold">{role}</p>
        </div>
      </div>

      {/* Quote */}
      <p className="text-sm text-zinc-600 leading-relaxed italic flex-1">
        "{testimonial}"
      </p>

      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[#c8961e] text-sm">★</span>
        ))}
      </div>

      {/* Drag hint on front card */}
      {isFront && (
        <p className="text-[10px] text-zinc-300 text-right tracking-wide">
          drag to next →
        </p>
      )}
    </motion.div>
  );
}

interface ShuffleCardsProps {
  testimonials: {
    id: number;
    testimonial: string;
    author: string;
    role: string;
    image: string;
  }[];
}

export function ShuffleCards({ testimonials }: ShuffleCardsProps) {
  const [positions, setPositions] = React.useState(
    testimonials.map((_, i) =>
      i === 0 ? "front" : i === 1 ? "middle" : "back"
    )
  );

  const handleShuffle = React.useCallback(() => {
    setPositions((prev) => {
      const next = [...prev];
      next.push(next.shift()!);
      return next;
    });
  }, []);

  // Auto-loop every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      handleShuffle();
    }, 5000);
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
          image={t.image}
          handleShuffle={handleShuffle}
          position={positions[index] ?? "back"}
        />
      ))}
    </div>
  );
}