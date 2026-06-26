"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Package, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const emptyForm = {
  name: "",
  category: "Long Grain",
  price: "",
  unit: "per kg",
  wholesale: "",
  image: "",
  badge: "",
  inStock: true,
};

const categories = ["Long Grain", "Brown", "Basmati", "Parboiled", "Local", "Jasmine"];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const [formError, setFormError] = useState("");
  const [listError, setListError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setListError(data.error || "Failed to load products.");
      }
    } catch (err) {
      setListError("Network error while loading products.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      unit: p.unit,
      wholesale: p.wholesale || "",
      image: p.image || "",
      badge: p.badge || "",
      inStock: p.inStock,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setFormError("Name and price are required.");
      return;
    }
    setSaving(true);
    setFormError("");

    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      wholesale: form.wholesale,
      image: form.image,
      badge: form.badge || null,
      inStock: form.inStock,
    };

    try {
      let res;
      if (editProduct) {
        res = await fetch(`/api/products/${editProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (data.success) {
        showToast(editProduct ? "Product updated successfully" : "Product added successfully");
        setShowModal(false);
        fetchProducts();
      } else {
        setFormError(data.error || "Could not save product. Please try again.");
      }
    } catch (err) {
      setFormError("Network error. Please check your connection and try again.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteId(null);
        showToast("Product deleted");
        fetchProducts();
      } else {
        showToast(data.error || "Could not delete product");
        setDeleteId(null);
      }
    } catch (err) {
      showToast("Network error while deleting");
      setDeleteId(null);
    }
    setDeleting(false);
  };

  return (
    <div className="p-8">

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a3d2b] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2">
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Products</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your rice product catalogue</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProducts} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition">
            <RefreshCw size={14} /> Refresh
          </button>
          <Button className="bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white flex items-center gap-2" onClick={openAdd}>
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {listError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 flex items-center gap-2">
          <AlertCircle size={16} /> {listError}
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f0f5f2] flex items-center justify-between">
          <h2 className="font-bold text-[#141414]">All Products ({products.length})</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-zinc-300 text-sm">No products yet. Click "Add Product" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8f6]">
                  {["Product", "Category", "Price", "Unit", "Badge", "Stock", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-bold uppercase tracking-wide text-zinc-400 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-[#f0f5f2] hover:bg-[#f9fbf9] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-[#d8e6dd]" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#f0f7f2] flex items-center justify-center">
                            <Package size={16} className="text-[#1a3d2b]" />
                          </div>
                        )}
                        <span className="font-semibold text-sm text-[#141414]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500">{p.category}</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#1a3d2b]">UGX {p.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-xs text-zinc-400">{p.unit}</td>
                    <td className="px-5 py-4">
                      {p.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5ed] text-[#1a3d2b]">{p.badge}</span>
                      ) : (
                        <span className="text-zinc-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: p.inStock ? "#e8f5ed" : "#fde8e8", color: p.inStock ? "#1a3d2b" : "#e74c3c" }}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteId(p._id)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-300 transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f5f2]">
              <h3 className="font-bold text-[#141414]">{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Long Grain White Rice" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition">
                    {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Price (UGX) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 3200" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Unit</label>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g. per kg" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Badge (optional)</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Best Seller" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Wholesale Info</label>
                <input value={form.wholesale} onChange={(e) => setForm({ ...form, wholesale: e.target.value })} placeholder="e.g. 50kg sack — UGX 155,000" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setForm({ ...form, inStock: !form.inStock })} className="w-10 h-6 rounded-full transition-all flex items-center px-0.5" style={{ background: form.inStock ? "#1a3d2b" : "#d8e6dd" }}>
                  <span className="w-5 h-5 rounded-full bg-white shadow transition-all" style={{ transform: form.inStock ? "translateX(16px)" : "translateX(0)" }} />
                </button>
                <span className="text-sm font-medium text-zinc-600">{form.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-2 border-[#d8e6dd] text-zinc-500" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1 bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border-2 border-[rgba(200,230,210,0.6)] text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-bold text-[#141414] mb-2">Delete Product?</h3>
            <p className="text-sm text-zinc-400 mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-2 border-[#d8e6dd]" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(deleteId)} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}