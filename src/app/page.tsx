"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.totalItems);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const hotDeals = [
    { 
      id: 1, 
      name: "Premium Long Grain Rice", 
      price: 98000, 
      weight: "50kg", 
      image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906" 
    },
    { 
      id: 2, 
      name: "Brown Organic Rice", 
      price: 110000, 
      weight: "25kg", 
      image: "https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7" 
    },
    { 
      id: 3, 
      name: "Basmati Rice (Imported)", 
      price: 72000, 
      weight: "10kg", 
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c" 
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-2xl flex items-center justify-center text-2xl">
              🌾
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">DAN K</h1>
              <p className="text-xs -mt-1 text-emerald-600">CHEAP STORES • WHOLESALE</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link href="#deals" className="hover:text-emerald-600 transition">Hot Deals</Link>
            <Link href="/products" className="hover:text-emerald-600 transition">Products</Link>
            <Link href="/about" className="hover:text-emerald-600 transition">About</Link>
            <Link href="/portal" className="hover:text-emerald-600 transition">Customer Portal</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost">Login</Button>
            <Button className="bg-emerald-700 hover:bg-emerald-800">Order Now</Button>
          </div>
        </div>
      </nav>

      {/* Hero with Aurora Effect */}
      <section className="hero min-h-screen flex items-center justify-center pt-20 relative">
        <div className="aurora" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <Badge className="mb-6 text-emerald-300 border-emerald-500/30 bg-emerald-900/50">
            Kisenyi Road, Kampala
          </Badge>

          <h1 className="text-7xl md:text-[100px] font-bold tracking-tighter text-white leading-none mb-4">
            DAN K
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-emerald-400 tracking-tight mb-8">
            Cheap Stores
          </p>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Premium Grade A Rice • Real-time Stock • Wholesale Prices • 
            Mobile Money • Fast Delivery in Kampala
          </p>

          <div className="flex gap-5 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-white text-emerald-950 hover:bg-white/90 text-lg px-10 py-7 rounded-2xl"
              asChild
            >
              <Link href="#deals">Shop Hot Deals</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-10 py-7 rounded-2xl"
            >
              Get Quotation
            </Button>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section id="deals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="uppercase tracking-widest text-emerald-600 text-sm font-medium">Limited Time</p>
              <h2 className="text-5xl font-bold tracking-tight">Hot Deals This Week</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">All Products →</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotDeals.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-emerald-100"
              >
                <div className="relative h-64 bg-zinc-200">
                  <img 
                    src={`${product.image}?w=600&q=80`} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-1">{product.name}</h3>
                  <p className="text-emerald-600 font-medium">{product.weight} Sack</p>
                  
                  <p className="text-3xl font-bold text-emerald-700 mt-4">
                    UGX {product.price.toLocaleString()}
                  </p>

                  <Button 
                    className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800 text-lg py-6"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-emerald-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"
      >
        <ShoppingCart size={28} />
        {totalItems() > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
            {totalItems()}
          </div>
        )}
      </button>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}