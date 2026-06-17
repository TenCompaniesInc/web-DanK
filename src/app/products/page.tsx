"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";

const filters = ["All", "Long Grain", "Brown", "Basmati", "Parboiled", "Local", "Jasmine"];

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  wholesale: string;
  image: string;
  badge: string | null;
  inStock: boolean;
};

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const url =
        activeFilter === "All"
          ? "/api/products"
          : `/api/products?category=${activeFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    };

    fetchProducts();
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-zinc-50">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-xl">
              🌾
            </div>
            <div>
              <p className="text-xl font-bold tracking-tighter leading-none">DAN K</p>
              <p className="text-xs text-emerald-600">CHEAP STORES</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link href="/#deals" className="hover:text-emerald-600 transition">Hot Deals</Link>
            <Link href="/products" className="text-emerald-700 font-semibold border-b-2 border-emerald-700 pb-0.5">Products</Link>
            <Link href="/about" className="hover:text-emerald-600 transition">About</Link>
            <Link href="/portal" className="hover:text-emerald-600 transition">Customer Portal</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition"
            >
              <ShoppingCart size={18} />
              Cart
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </button>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-sm">
              Order Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
          Our Stock
        </p>
        <h1 className="text-5xl font-bold tracking-tight mb-3">Rice Products</h1>
        <p className="text-zinc-500 text-lg max-w-xl">
          All varieties graded, sorted, and available in retail and wholesale
          quantities. Collect from Kisenyi Road or request delivery.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 max-w-7xl mx-auto mb-10">
        <div className="flex gap-3 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                activeFilter === f
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-emerald-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 max-w-7xl mx-auto pb-24">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-zinc-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                  <div className="h-6 bg-zinc-200 rounded w-1/3" />
                  <div className="h-10 bg-zinc-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 border border-emerald-100 bg-white"
              >
                <div className="relative h-48 bg-zinc-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-emerald-700 text-white text-xs">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  <h3 className="font-semibold text-base mb-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">{product.wholesale}</p>

                  <p className="text-2xl font-bold text-emerald-700">
                    UGX {product.price.toLocaleString()}
                    <span className="text-sm font-normal text-zinc-400 ml-1">
                      {product.unit}
                    </span>
                  </p>

                  <Button
                    className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800"
                    onClick={() =>
                      addToCart({
                        id: product._id as unknown as number,
                        name: product.name,
                        price: product.price,
                        weight: product.unit,
                        image: product.image.split("?")[0],
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-emerald-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"
      >
        <ShoppingCart size={26} />
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