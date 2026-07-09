import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: "" },       // bcrypt hash — empty until the owner sets it
  name: { type: String, default: "" },
  role: { type: String, default: "admin" },
  hasSetPassword: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);