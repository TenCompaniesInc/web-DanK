import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
await mongoose.connect(process.env.MONGODB_URI);
const r = await mongoose.connection.db.collection("products").updateOne(
  { image: "/products/super-grade3.jpg" },
  { $set: { image: "/products/grade3.jpg" } }
);
console.log("Updated:", r.modifiedCount);
process.exit(0);
