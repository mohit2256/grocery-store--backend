// backend/routes/adminRoutes.js
import express from "express";
import { protect } from "../middleware/firebaseAuth.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getAdminStats } from "../controllers/statsController.js";



import {
  getAllOrders,
  updateOrderStatus,
  getOrderById
} from "../controllers/adminController.js";
import { getAllProducts } from "../controllers/productController.js";

const router = express.Router();

// 🟪 ORDERS
router.get("/orders", protect, adminOnly, getAllOrders);
router.get("/orders/:id", protect, adminOnly, getOrderById);
router.put("/orders/:id/status", protect, adminOnly, updateOrderStatus);

// 🟪 PRODUCTS
router.get("/products", protect, adminOnly, getAllProducts);
router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
