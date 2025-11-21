// backend/controllers/statsController.js
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const getAdminStats = async (req, res) => {
  try {
    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // TOTAL REVENUE
    const orders = await Order.find({});
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalPrice || o.totalAmount || 0),
      0
    );

    // UNIQUE CUSTOMERS
    const uniqueCustomers = await User.countDocuments();

    // 7-DAY SALES TREND
    const last7 = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 86400000) },
    }).sort({ createdAt: 1 });

    const salesTrend = {};

    for (let i = 0; i < 7; i++) {
      const day = new Date(Date.now() - i * 86400000)
        .toISOString()
        .slice(0, 10);
      salesTrend[day] = 0;
    }

    last7.forEach((o) => {
      const d = o.createdAt.toISOString().slice(0, 10);
      if (salesTrend[d] !== undefined) {
        salesTrend[d] += o.totalPrice || o.totalAmount || 0;
      }
    });

    // PRODUCT MIX (CATEGORY COUNT)
    const productMix = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // RECENT ORDERS
    const recentOrders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        uniqueCustomers,
        salesTrend,
        productMix,
        recentOrders,
      },
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
