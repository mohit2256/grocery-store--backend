import express from "express";
import {
  syncUser,
  getMe,
  updateProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/userController.js";

import { protect } from "../middleware/firebaseAuth.js";

const router = express.Router();

/* AUTH */
router.post("/sync", protect, syncUser);
router.get("/me", protect, getMe);

/* PROFILE */
router.put("/update-profile", protect, updateProfile);

/* ADDRESS API */
router.post("/address", protect, addAddress);
router.get("/address", protect, getAddresses);
router.put("/address/:id", protect, updateAddress);
router.delete("/address/:id", protect, deleteAddress);

export default router;
