// controllers/orderController.js
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/ProductModel.js";

/**
 * =========================================================
 *  CREATE ORDER (USER)
 * =========================================================
 */
export const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalPrice,
      deliveryAddress,
      deliveryOption,
      paymentMethod,
      transactionRef,
    } = req.body;

    if (!products || products.length === 0)
      return res.status(400).json({ message: "No products provided" });

    if (!totalPrice)
      return res.status(400).json({ message: "Total price required" });

    const firebaseUid = req.user?.uid;
    if (!firebaseUid)
      return res.status(401).json({ message: "Unauthorized" });

    // find or create MongoDB user
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = await User.create({
        firebaseUid,
        name: req.user.name || "Customer",
        email: req.user.email || "noemail@unknown.com",
      });
    }

    // format product snapshot
    const formattedProducts = await Promise.all(
      products.map(async (p) => {
        const product = await Product.findById(p.productId || p._id);

        return {
          productId: product?._id || null,
          title: product?.title || p.title || "Product",
          image: product?.image || "",
          unit: product?.unit || "",
          priceAtOrder: product?.price || p.price,
          quantity: p.quantity || 1,
        };
      })
    );

    const orderData = {
      userId: user._id,
      products: formattedProducts,
      totalPrice,
      deliveryOption: deliveryOption || "Home",
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
      transactionRef: transactionRef || "",
      status: "Pending",
      deliveryAddress,
      expectedDeliveryDate: new Date(Date.now() + 3 * 86400000), // +3 days
    };

    const saved = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: saved,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * =========================================================
 *  GET LOGGED-IN USER'S ORDERS
 * =========================================================
 */
export const getMyOrders = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    if (!firebaseUid)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ firebaseUid });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, orders });
  } catch (error) {
    console.error("User Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================================================
 *  ADMIN — GET ALL ORDERS
 * =========================================================
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone") // fetch user info
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

/**
 * =========================================================
 *  ADMIN — UPDATE ORDER STATUS
 * =========================================================
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status)
      return res.status(400).json({ message: "Status required" });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const saved = await order.save();

    res.json({ success: true, order: saved });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};
