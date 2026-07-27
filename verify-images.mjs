import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

for (const coll of ["staff", "products"]) {
  const docs = await db.collection(coll).find({}).toArray();
  for (const d of docs) {
    if (d.image && d.image.startsWith("/")) {
      const filePath = "public" + d.image;
      const exists = fs.existsSync(filePath);
      console.log(`${exists ? "OK  " : "MISS"} | ${coll} | ${d.name} | ${d.image}`);
    }
  }
}
process.exit(0);
