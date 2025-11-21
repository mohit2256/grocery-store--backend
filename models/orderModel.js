// backend/models/orderModel.js
import mongoose from "mongoose";

const productSnapshotSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: { type: String },
  image: { type: String },
  unit: { type: String },
  priceAtOrder: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [productSnapshotSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Confirmed, Shipped, Delivered, Cancelled
  paymentMethod: { type: String, enum: ['COD', 'UPI', 'CARD', 'WALLET'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending','Completed','Failed'], default: 'Pending' },
  deliveryOption: { type: String, enum: ['Home','Pickup'], default: 'Home' },
  deliveryAddress: {
    name: String,
    line1: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  transactionRef: { type: String }, // UTR / transaction id
  expectedDeliveryDate: { type: Date },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
