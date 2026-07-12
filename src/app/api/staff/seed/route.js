// src/app/api/staff/seed/route.js
// Visit /api/staff/seed ONCE to populate the initial staff into MongoDB.
// After seeding, this route does nothing if staff already exist.

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Staff from "@/models/Staff";

const initialStaff = [
  {
    name: "Kabala Dan K.",
    role: "Founder & Director",
    phone: "0731 496 117",
    email: "dan@dankstores.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    quote: "We built DAN K to serve Uganda honestly. Every grain we sell carries our name and our promise.",
    active: true,
    order: 0,
  },
  {
    name: "Sarah Nakato",
    role: "Head of Sales",
    phone: "0701 111 222",
    email: "sarah@dankstores.com",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    quote: "My job is to make sure every wholesale client gets the best rate and the fastest service.",
    active: true,
    order: 1,
  },
  {
    name: "Moses Okello",
    role: "Store Manager",
    phone: "0702 333 444",
    email: "moses@dankstores.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    quote: "Every sack that leaves Kisenyi Road passes through me. Quality is not optional here.",
    active: true,
    order: 2,
  },
  {
    name: "Grace Auma",
    role: "Customer Relations",
    phone: "0703 555 666",
    email: "grace@dankstores.com",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    quote: "I make sure every customer leaves feeling valued. That is what DAN K is about.",
    active: true,
    order: 3,
  },
];

export async function GET() {
  try {
    await connectDB();
    const existing = await Staff.countDocuments({});
    if (existing > 0) {
      return NextResponse.json({ success: true, message: "Staff already seeded. " + existing + " members in DB." });
    }
    await Staff.insertMany(initialStaff);
    return NextResponse.json({ success: true, message: "Seeded " + initialStaff.length + " staff members." });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}