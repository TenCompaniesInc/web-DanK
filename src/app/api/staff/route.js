import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Staff from "@/models/Staff";

export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, staff });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const member = await Staff.create(body);
    return NextResponse.json({ success: true, member });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
