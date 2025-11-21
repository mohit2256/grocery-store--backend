import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/firebaseAuth.js";

const router = express.Router();

// Public route
router.get("/", getProducts);

// Admin-only routes
router.post("/", protect, adminOnly, addProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
