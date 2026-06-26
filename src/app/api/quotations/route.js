import { connectDB } from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

export async function GET() {
  try {
    await connectDB();
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    return Response.json({ success: true, quotations });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const quotation = await Quotation.create(body);
    return Response.json({ success: true, quotation });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}