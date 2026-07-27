// ─────────────────────────────────────────────────────────────────────────
// AUTHORIZE ADMIN ACCOUNTS
// Add the company email addresses allowed to be admins to the list below,
// then run:  node scripts/seed-admins.mjs
// This creates each account with NO password. Each owner then goes to
// /admin/set-password once to choose their own password.
// To authorize a new admin later: add their email here and run again.
// ─────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const authorizedAdmins = [
  { email: "shkyeera20@gmail.com", name: "DAN K Admin" },
  { email: "kabaladan878@gmail.com", name: "Director" },
  {email: "dankcheapstoresltd@gmail.com", name: "Compqny Admin"},
  {email: "japhethmwesigwa17@gmail.com", name: "web developer"},
],

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: "" },
  name: { type: String, default: "" },
  role: { type: String, default: "admin" },
  hasSetPassword: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("❌ MONGODB_URI not found in .env.local"); process.exit(1); }

  await mongoose.connect(uri);
  console.log("✅ Connected to database\n");

  for (const admin of authorizedAdmins) {
    const email = admin.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⏭️  ${email} already exists (password ${existing.hasSetPassword ? "SET" : "not set yet"}) — skipping`);
    } else {
      await User.create({ email, name: admin.name, role: "admin", password: "", hasSetPassword: false });
      console.log(`✅ Authorized ${email} — they can now set their password at /admin/set-password`);
    }
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => { console.error("❌ Error:", e.message); process.exit(1); });