"use client";

import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[54] backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer — full width on mobile, 380px on sm+ */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[55] flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: "min(380px, 100vw)",
          background: "white",
          borderLeft: "1px solid #d8e6dd",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8e6dd] flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#1a3d2b]" />
            <h2 className="text-base font-bold text-[#141414]">
              Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition active:bg-zinc-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-semibold text-zinc-400 mb-1">Your cart is empty</p>
              <p className="text-xs text-zinc-300">Add some rice to get started</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-[#1a3d2b] text-white text-sm font-semibold rounded-xl active:opacity-90">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={`${item.id}-${item.weight}`} className="flex gap-3 p-3 rounded-xl border border-[#d8e6dd] bg-[#f9fbf9]">
                  <img
                    src={item.image + "?w=120"}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-[#d8e6dd]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#141414] leading-tight truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.weight} bag</p>
                    <p className="text-sm font-bold text-[#1a3d2b] mt-1">UGX {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0 gap-2">
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-red-400 transition p-1">
                      <X size={14} />
                    </button>
                    <div className="flex items-center gap-1.5 border border-[#d8e6dd] rounded-lg px-2 py-1 bg-white">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))} className="w-5 h-5 flex items-center justify-center text-[#1a3d2b] active:bg-[#e8f5ed] rounded">
                        <Minus size={11} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[#141414]">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center text-[#1a3d2b] active:bg-[#e8f5ed] rounded">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-[#d8e6dd] flex-shrink-0 bg-white">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-xl font-bold text-[#1a3d2b]">UGX {totalPrice().toLocaleString()}</p>
            </div>
            <Link
              href="/order"
              onClick={onClose}
              className="block w-full py-3.5 text-center bg-[#1a3d2b] text-white text-sm font-bold rounded-xl hover:opacity-90 transition active:scale-[0.98]"
            >
              Proceed to Order
            </Link>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2.5 text-sm font-medium text-zinc-400 border border-[#d8e6dd] rounded-xl hover:bg-zinc-50 transition active:bg-zinc-100"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}