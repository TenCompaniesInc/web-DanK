import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const order = await Order.create(body);
    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}