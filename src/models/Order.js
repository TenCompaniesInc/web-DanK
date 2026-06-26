import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  delivery: { type: String, enum: ["collect", "delivery"], default: "collect" },
  address: { type: String, default: "" },
  notes: { type: String, default: "" },
  network: { type: String, enum: ["mtn", "airtel", "card"], required: true },
  momoNumber: { type: String, default: "" },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending",
  },

  // Pesapal payment tracking
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "failed", "reversed"],
    default: "unpaid",
  },
  paymentMethod: { type: String, default: "" },
  paymentConfirmationCode: { type: String, default: "" },
  pesapalOrderTrackingId: { type: String, default: "" },
  pesapalMerchantReference: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);