import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Email must already be authorized (created by the seed script)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "This email is not authorized. Contact your administrator." },
        { status: 403 }
      );
    }

    // Can't reuse set-password on an account that already has one
    if (user.hasSetPassword) {
      return NextResponse.json(
        { success: false, error: "This account already has a password. Please sign in instead." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    user.password = hashed;
    user.hasSetPassword = true;
    await user.save();

    return NextResponse.json({ success: true, message: "Password set. You can now sign in." });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}