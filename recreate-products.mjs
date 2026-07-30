import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  wholesale: { type: String },
  image: { type: String },
  badge: { type: String, default: null },
  inStock: { type: Boolean, default: true },
  isHotDeal: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  { name: "Super Kaiso",   category: "Local",      price: 3000, unit: "per kg", image: "/products/kaiso.jpg",         badge: "Hot Deal",    isHotDeal: true,  isFeatured: true, inStock: true },
  { name: "Super Grade 1", category: "Long Grain", price: 3100, unit: "per kg", image: "/products/grade-1.jpg",       badge: "Best Seller", isHotDeal: true,  isFeatured: true, inStock: true },
  { name: "Super Grade 2", category: "Long Grain", price: 3200, unit: "per kg", image: "/products/grade-2.jpg",       badge: null,          isHotDeal: false, isFeatured: true, inStock: true },
  { name: "Super Grade 3", category: "Long Grain", price: 3300, unit: "per kg", image: "/products/grade3.jpg",        badge: null,          isHotDeal: false, isFeatured: true, inStock: true },
  { name: "Super Grade 4", category: "Long Grain", price: 3400, unit: "per kg", image: "/products/super-grade-4.jpg", badge: null,          isHotDeal: false, isFeatured: true, inStock: true },
  { name: "Beyenge",       category: "Local",      price: 3500, unit: "per kg", image: "/products/beyenge.jpg",       badge: null,          isHotDeal: false, isFeatured: true, inStock: true },
  { name: "Pakistan",      category: "Basmati",    price: 5200, unit: "per kg", image: "",                            badge: "Premium",     isHotDeal: false, isFeatured: true, inStock: true },
];

await mongoose.connect(process.env.MONGODB_URI);

const existing = await Product.countDocuments();
console.log(`Current products in DB: ${existing}`);

// Remove the placeholder demo products (by their known demo names), then add real ones
const demoNames = ["Long Grain White Rice","Brown Organic Rice","Basmati Rice (Imported)","Parboiled Rice","Local Ugandan Rice","Jasmine Rice","Bulk Long Grain Sack"];
const del = await Product.deleteMany({ name: { $in: demoNames } });
console.log(`Removed ${del.deletedCount} placeholder demo products.`);

for (const p of products) {
  // avoid duplicates if run twice
  const exists = await Product.findOne({ name: p.name });
  if (exists) {
    await Product.updateOne({ name: p.name }, { $set: p });
    console.log(`Updated: ${p.name}`);
  } else {
    await Product.create(p);
    console.log(`Created: ${p.name} — UGX ${p.price}/kg`);
  }
}

const final = await Product.find({}).select("name price isHotDeal isFeatured").lean();
console.log("\nFinal product list:");
final.forEach(p => console.log(`  ${p.name} — UGX ${p.price} — ${p.isHotDeal ? "HOT " : ""}${p.isFeatured ? "FEATURED" : ""}`));

process.exit(0);
