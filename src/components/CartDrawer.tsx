"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2 } from "lucide-react";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl">Your Cart ({cart.length})</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-120px)]">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <p className="text-6xl mb-4">🛒</p>
                <p className="text-xl font-medium">Your cart is empty</p>
                <p className="text-zinc-500 mt-2">Start adding some premium rice</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-6 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl">
                    <img 
                      src={`${item.image}?w=120`} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-zinc-500">{item.weight}</p>
                      <p className="font-bold text-emerald-700 mt-1">
                        UGX {(item.price * item.qty).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-8 h-8 rounded-lg border hover:bg-zinc-100"
                        >
                          −
                        </button>
                        <span className="font-medium w-6 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-8 h-8 rounded-lg border hover:bg-zinc-100"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t mt-auto">
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span>UGX {totalPrice().toLocaleString()}</span>
                </div>

                <Button className="w-full py-7 text-lg bg-emerald-700 hover:bg-emerald-800">
                  Proceed to Checkout (Mobile Money)
                </Button>
                <Button variant="outline" className="w-full mt-3 py-6">
                  Request Quotation via WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}