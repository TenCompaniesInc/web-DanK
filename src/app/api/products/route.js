import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const filter = category && category !== "All" ? { category } : {};

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return Response.json({ success: true, products });
}