import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

function clean(p) {
  if (!p) return p;
  const m = p.match(/^\/(home|products)\/(.+)$/i);
  if (!m) return p;
  const folder = m[1].toLowerCase();
  let name = m[2].replace(/\.[^.]+$/, "");           // drop extension
  name = name.toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/-$/,"");
  return `/${folder}/${name}.jpg`;
}

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

for (const coll of ["staff", "products"]) {
  const docs = await db.collection(coll).find({}).toArray();
  for (const d of docs) {
    if (d.image) {
      const newPath = clean(d.image);
      if (newPath !== d.image) {
        await db.collection(coll).updateOne({ _id: d._id }, { $set: { image: newPath } });
        console.log(`${coll}: ${d.image}  ->  ${newPath}`);
      }
    }
  }
}
console.log("Done.");
process.exit(0);
