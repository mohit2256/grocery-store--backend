import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- FIXED ABSOLUTE PATH TO FIREBASE KEY ----
const serviceAccountPath = path.join(
  __dirname,
  "..",
  "config",
  "serviceAccountKey.json"
);

// ---- INITIALIZE FIREBASE ADMIN ----
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

// ---- ADMIN MIDDLEWARE ----
export const adminOnly = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const token = header.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Not admin" });
    }

    req.userMongo = user;
    next();
  } catch (err) {
    console.error("adminOnly ERROR:", err);
    return res.status(500).json({ message: "Server error validating admin" });
  }
};
