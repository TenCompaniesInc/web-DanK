import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await request.json();
    const quotation = await Quotation.findByIdAndUpdate(id, body, { new: true });
    if (!quotation) {
      return NextResponse.json({ success: false, error: "Quotation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    console.error("PUT /api/quotations/[id] error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const deleted = await Quotation.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Quotation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/quotations/[id] error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}