// backend/models/addressModel.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
