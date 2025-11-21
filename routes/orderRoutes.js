// backend/routes/orderRoutes.js
import express from "express";
import { protect } from "../middleware/firebaseAuth.js";
import { createOrder, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

// Create new order
router.post("/create", protect, createOrder);

// Get orders of logged-in user
router.get("/myorders", protect, getMyOrders);

// Alias for older frontends (optional)
router.get("/my", protect, getMyOrders);

export default router;
