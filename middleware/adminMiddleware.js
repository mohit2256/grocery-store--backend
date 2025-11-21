import admin from "../config/firebaseAdmin.js"; 
import User from "../models/userModel.js";

// ---- ADMIN MIDDLEWARE (USING ENV-BASED FIREBASE ADMIN) ----
export const adminOnly = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const token = header.split(" ")[1];

    // Verify Firebase Token using ADMIN SDK already initialized via ENV
    const decoded = await admin.auth().verifyIdToken(token);

    // Match Firebase UID to MongoDB user
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not admin" });
    }

    req.userMongo = user; // attach user to request object
    next();

  } catch (err) {
    console.error("🔥 adminOnly ERROR:", err);
    return res.status(500).json({ message: "Server error validating admin" });
  }
};
