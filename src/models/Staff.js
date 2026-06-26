import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  image: { type: String, default: "" },
  quote: { type: String, default: "" },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
