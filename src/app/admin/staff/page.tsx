"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type StaffMember = { _id: string; name: string; role: string; phone: string; email: string; image: string; quote: string; active: boolean; order: number };

const emptyForm = { name: "", role: "", phone: "", email: "", image: "", quote: "", active: true, order: 0 };

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [listError, setListError] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.success) setStaff(data.staff || []);
      else setListError(data.error || "Failed to load staff.");
    } catch { setListError("Network error loading staff."); }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openAdd = () => { setEditMember(null); setForm(emptyForm); setFormError(""); setShowModal(true); };
  const openEdit = (m: StaffMember) => {
    setEditMember(m);
    setForm({ name: m.name, role: m.role, phone: m.phone, email: m.email, image: m.image, quote: m.quote, active: m.active, order: m.order });
    setFormError(""); setShowModal(true);
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => { img.src = ev.target?.result as string; };
      reader.onerror = reject;
      img.onload = () => {
        const maxDim = 1600;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = (height / width) * maxDim; width = maxDim; }
          else { width = (width / height) * maxDim; height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))), "image/jpeg", 0.8);
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append("file", compressed, "upload.jpg");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((prev: any) => ({ ...prev, image: data.url }));
      } else {
        setFormError(data.error || "Upload failed.");
      }
    } catch {
      setFormError("Upload failed. Check your connection.");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { setFormError("Name and role are required."); return; }
    setSaving(true); setFormError("");
    try {
      let res;
      if (editMember) {
        res = await fetch("/api/staff/" + editMember._id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else {
        res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      const data = await res.json();
      if (data.success) { showToast(editMember ? "Staff member updated" : "Staff member added"); setShowModal(false); fetchStaff(); }
      else { setFormError(data.error || "Could not save. Please try again."); }
    } catch { setFormError("Network error. Please try again."); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch("/api/staff/" + id, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { setDeleteId(null); showToast("Staff member removed"); fetchStaff(); }
      else { showToast(data.error || "Could not delete"); setDeleteId(null); }
    } catch { showToast("Network error"); setDeleteId(null); }
    setDeleting(false);
  };

  const toggleActive = async (m: StaffMember) => {
    try {
      const res = await fetch("/api/staff/" + m._id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !m.active }) });
      const data = await res.json();
      if (data.success) { fetchStaff(); showToast(m.active ? "Hidden from website" : "Now visible on website"); }
    } catch { showToast("Network error"); }
  };

  return (
    <div className="p-8">
      {toast && (<div className="fixed bottom-6 right-6 z-50 bg-[#1a3d2b] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2"><Check size={15} /> {toast}</div>)}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Staff</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage the team shown on the public website — changes reflect instantly</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStaff} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] hover:bg-[#f5f8f6] transition"><RefreshCw size={14} /> Refresh</button>
          <Button className="bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white flex items-center gap-2" onClick={openAdd}><Plus size={16} /> Add Staff Member</Button>
        </div>
      </div>

      {listError && (<div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 flex items-center gap-2"><AlertCircle size={16} /> {listError}</div>)}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin" /></div>
      ) : staff.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] text-zinc-300 text-sm">
          No staff yet. Visit <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded">/api/staff/seed</code> to populate initial staff, then refresh.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {staff.map((member) => (
            <div key={member._id} className="bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.5)] overflow-hidden" style={{ opacity: member.active ? 1 : 0.55 }}>
              <div className="flex gap-4 p-5">
                <img src={member.image || "/home/director.jpeg"} alt={member.name} className="w-20 h-20 rounded-xl object-cover object-top border-2 border-[#d8e6dd] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#141414]">{member.name}</p>
                      <p className="text-xs font-semibold text-[#c8961e] uppercase tracking-wide mt-0.5">{member.role}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0" style={{ background: member.active ? "#e8f5ed" : "#f5f5f5", color: member.active ? "#1a3d2b" : "#999" }}>
                      {member.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">{member.phone}</p>
                  <p className="text-xs text-zinc-400">{member.email}</p>
                  {member.quote && (<p className="text-xs text-zinc-400 italic mt-2 line-clamp-2">"{member.quote}"</p>)}
                </div>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 border-t border-[#f0f5f2] bg-[#f9fbf9]">
                <button onClick={() => toggleActive(member)} className="flex-1 text-xs font-semibold py-2 rounded-lg border-2 border-[#d8e6dd] text-zinc-500 hover:border-[#1a3d2b] hover:text-[#1a3d2b] transition">
                  {member.active ? "Hide from Website" : "Show on Website"}
                </button>
                <button onClick={() => openEdit(member)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#1a3d2b] hover:border-[#1a3d2b] transition"><Pencil size={13} /></button>
                <button onClick={() => setDeleteId(member._id)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-300 transition"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-[rgba(200,230,210,0.6)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f5f2]">
              <h3 className="font-bold text-[#141414]">{editMember ? "Edit Staff Member" : "Add Staff Member"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg border border-[#d8e6dd] flex items-center justify-center text-zinc-400 hover:text-[#141414] transition"><X size={15} /></button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (<div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3 flex items-center gap-2"><AlertCircle size={14} /> {formError}</div>)}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Nakato" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Role / Title *</label>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Head of Sales" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0700 000 000" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@dankstores.com" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Profile Photo</label>
                {form.image && (
                  <div className="mb-2 relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#d8e6dd] bg-[#f5f8f6]">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover object-top" />
                    <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 border border-[#d8e6dd] flex items-center justify-center text-zinc-500 hover:text-red-500 transition text-xs">✕</button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-[#d8e6dd] text-sm font-semibold text-[#1a3d2b] cursor-pointer hover:bg-[#f5f8f6] transition">
                  {uploading ? "Uploading..." : form.image ? "Change Photo" : "📷 Upload Photo"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
                <p className="text-[11px] text-zinc-400 mt-1.5">Tap to choose a photo from your device.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Quote (shown on website)</label>
                <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="A short quote from this person..." rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1 block">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="0" className="w-full px-4 py-3 rounded-xl border-2 border-[#d8e6dd] text-sm focus:outline-none focus:border-[#1a3d2b] transition" />
                <p className="text-xs text-zinc-400 mt-1">Lower numbers appear first on the website.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm({ ...form, active: !form.active })} className="w-10 h-6 rounded-full transition-all flex items-center px-0.5" style={{ background: form.active ? "#1a3d2b" : "#d8e6dd" }}>
                  <span className="w-5 h-5 rounded-full bg-white shadow transition-all" style={{ transform: form.active ? "translateX(16px)" : "translateX(0)" }} />
                </button>
                <span className="text-sm font-medium text-zinc-600">{form.active ? "Visible on website" : "Hidden from website"}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-2 border-[#d8e6dd] text-zinc-500" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1 bg-[#1a3d2b] hover:bg-[#2d6a4f] text-white" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editMember ? "Update Member" : "Add Member"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border-2 border-[rgba(200,230,210,0.6)] text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-bold text-[#141414] mb-2">Remove Staff Member?</h3>
            <p className="text-sm text-zinc-400 mb-6">This person will be removed from the admin and the public website immediately.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-2 border-[#d8e6dd]" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(deleteId)} disabled={deleting}>{deleting ? "Removing..." : "Remove"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
