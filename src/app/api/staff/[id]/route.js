import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Staff from "@/models/Staff";

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await request.json();
    const member = await Staff.findByIdAndUpdate(id, body, { new: true });
    if (!member) return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    return NextResponse.json({ success: true, member });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}