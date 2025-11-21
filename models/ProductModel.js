import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // was: name
    price: { type: Number, required: true },
    unit: { type: String, default: "" },           // NEW (your frontend uses it)
    category: { type: String, default: "Other" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    brand: { type: String, default: "" },
    weight: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
