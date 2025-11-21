// backend/controllers/adminController.js
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

/**
 * GET ALL ORDERS (ADMIN)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Provide a userSnapshot fallback if populate missing
    const normalized = orders.map((o) => ({
      ...o,
      userSnapshot: o.userId ? { name: o.userId.name, email: o.userId.email } : o.userSnapshot || null,
    }));

    res.json({ success: true, orders: normalized });
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

/**
 * GET SINGLE ORDER BY ID (ADMIN)
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .lean();

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // attach userSnapshot if populate succeeded
    const normalized = {
      ...order,
      userSnapshot: order.userId ? { name: order.userId.name, email: order.userId.email } : order.userSnapshot || null,
    };

    res.json({ success: true, order: normalized });
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};

/**
 * UPDATE ORDER STATUS (ADMIN)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) return res.status(400).json({ success: false, message: "Status required" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const saved = await order.save();

    // populate before returning
    const populated = await Order.findById(saved._id).populate("userId", "name email").lean();

    res.json({ success: true, order: populated });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ success: false, message: "Error updating order" });
  }
};
