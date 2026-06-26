import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  message: { type: String, required: true },
  referenceTotal: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["new", "contacted", "converted", "closed"],
    default: "new",
  },
}, { timestamps: true });

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
