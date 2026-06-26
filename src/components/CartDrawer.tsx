"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function CartDrawer({ open, onClose, onRequestQuote }: { open: boolean; onClose: () => void; onRequestQuote?: () => void }) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCartStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (id: number, currentQty: number) => {
    setEditingId(id);
    setEditValue(String(currentQty));
  };

  const commitEdit = (id: number) => {
    const n = parseInt(editValue);
    updateQuantity(id, isNaN(n) || n < 1 ? 1 : n);
    setEditingId(null);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] z-50 flex flex-col transition-transform duration-300"
        style={{
          background: "white",
          borderLeft: "1px solid #d8e6dd",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8e6dd]">
          <h2 className="text-lg font-bold text-[#141414]">
            Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] hover:border-zinc-400 transition"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-semibold text-zinc-400">Your cart is empty</p>
              <p className="text-xs text-zinc-300 mt-1">Add some rice to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-[#d8e6dd] bg-[#f9fbf9]"
                >
                  <img
                    src={item.image + "?w=120"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-[#d8e6dd]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#141414] leading-tight">{item.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.weight} bag</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">UGX {item.price.toLocaleString()} / {item.weight}</p>
                    <p className="font-bold text-[#1a3d2b] mt-1">
                      UGX {(item.price * item.qty).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-lg border border-[#d8e6dd] bg-white flex items-center justify-center text-[#1a3d2b] font-bold hover:bg-[#e8f5ed] transition"
                      >
                        <Minus size={12} />
                      </button>
                      {editingId === item.id ? (
                        <input
                          type="text"
                          inputMode="numeric"
                          autoFocus
                          value={editValue}
                          onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setEditValue(v); const n = parseInt(v); if (!isNaN(n) && n >= 1) updateQuantity(item.id, n); }}
                          onBlur={() => commitEdit(item.id)}
                          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(item.id); }}
                          className="w-12 text-center text-sm font-bold text-[#141414] border border-[#1a3d2b] rounded-md focus:outline-none"
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(item.id, item.qty)}
                          className="text-sm font-bold text-[#141414] w-8 text-center hover:bg-[#e8f5ed] rounded-md py-0.5 transition"
                        >
                          {item.qty}
                        </button>
                      )}
                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-lg border border-[#d8e6dd] bg-white flex items-center justify-center text-[#1a3d2b] font-bold hover:bg-[#e8f5ed] transition"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-zinc-300 hover:text-red-400 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#d8e6dd]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-[#141414]">Total</span>
              <span className="text-2xl font-bold text-[#1a3d2b]">
                UGX {totalPrice().toLocaleString()}
              </span>
            </div>
            <Link
              href="/order"
              onClick={onClose}
              className="block w-full text-center bg-[#c8961e] text-[#0d2418] font-bold py-3.5 rounded-xl text-sm hover:opacity-90 transition mb-2"
            >
              Pay with Mobile Money →
            </Link>
            <Link
              href="/order#quotation"
              onClick={onClose}
              className="block w-full text-center border-2 border-[#1a3d2b] text-[#1a3d2b] font-semibold py-3 rounded-xl text-sm hover:bg-[#f5f8f6] transition"
            >
              Get Quotation
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
