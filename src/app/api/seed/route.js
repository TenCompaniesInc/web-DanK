import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    await Product.deleteMany({});

    const products = [
      {
        name: "Long Grain White Rice",
        category: "Long Grain",
        price: 3200,
        unit: "per kg",
        wholesale: "50kg sack — UGX 155,000",
        image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80",
        badge: "Best Seller",
        inStock: true,
      },
      {
        name: "Brown Organic Rice",
        category: "Brown",
        price: 4400,
        unit: "per kg",
        wholesale: "25kg sack — UGX 105,000",
        image: "https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=600&q=80",
        badge: "Healthy Pick",
        inStock: true,
      },
      {
        name: "Basmati Rice (Imported)",
        category: "Basmati",
        price: 7200,
        unit: "per kg",
        wholesale: "10kg bag — UGX 68,000",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
        badge: "Premium",
        inStock: true,
      },
      {
        name: "Parboiled Rice",
        category: "Parboiled",
        price: 2900,
        unit: "per kg",
        wholesale: "50kg sack — UGX 138,000",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
        badge: null,
        inStock: true,
      },
      {
        name: "Local Ugandan Rice",
        category: "Local",
        price: 2400,
        unit: "per kg",
        wholesale: "100kg sack — UGX 228,000",
        image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80",
        badge: "Local",
        inStock: true,
      },
      {
        name: "Jasmine Rice",
        category: "Jasmine",
        price: 5800,
        unit: "per kg",
        wholesale: "25kg bag — UGX 138,000",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
        badge: "Aromatic",
        inStock: true,
      },
      {
        name: "Bulk Long Grain Sack",
        category: "Long Grain",
        price: 195000,
        unit: "per 100kg sack",
        wholesale: "Wholesale only",
        image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80",
        badge: "Bulk",
        inStock: true,
      },
    ];

    await Product.insertMany(products);

    return Response.json({
      success: true,
      message: products.length + " products seeded successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}