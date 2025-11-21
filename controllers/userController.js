// backend/controllers/userController.js
import User from "../models/userModel.js";
import Address from "../models/addressModel.js";

/* ------------------------- SYNC FIREBASE USER -------------------------- */
export const syncUser = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const email = req.user.email;
    const name =
      req.user.name ||
      req.user.displayName ||
      (email ? email.split("@")[0] : "User");

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isAdmin = adminEmails.includes(email.toLowerCase());

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        name,
        email,
        isAdmin,
      });
    } else {
      user.name = name;
      user.email = email;
      user.isAdmin = isAdmin;
      await user.save();
    }

    return res.status(200).json({ message: "User synced", user });
  } catch (error) {
    return res.status(500).json({ message: "Sync failed", error: error.message });
  }
};

/* ---------------------------- GET LOGGED USER --------------------------- */
export const getMe = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ------------------------------- EDIT PROFILE ------------------------------ */
export const updateProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const { name, phone } = req.body;

    const user = await User.findOne({ firebaseUid });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;

    await user.save();

    return res.json({ message: "Profile updated", user });
  } catch (e) {
    return res.status(500).json({ message: "Update failed", error: e.message });
  }
};

/* ------------------------------- ADD ADDRESS ------------------------------ */
export const addAddress = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    const { name, address, city, pincode, phone } = req.body;

    const newAddress = await Address.create({
      userId: user._id,
      name,
      address,
      city,
      pincode,
      phone,
    });

    return res.json({ message: "Address saved", address: newAddress });
  } catch (e) {
    return res.status(500).json({ message: "Add failed", error: e.message });
  }
};

/* ------------------------------- GET ALL ADDRESSES ------------------------------ */
export const getAddresses = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    const addresses = await Address.find({ userId: user._id }).sort({ createdAt: -1 });

    return res.json(addresses);
  } catch (e) {
    return res.status(500).json({ message: "Fetch failed", error: e.message });
  }
};

/* ------------------------------- UPDATE ADDRESS ------------------------------ */
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Address.findByIdAndUpdate(id, updates, { new: true });

    return res.json({ message: "Updated", address: updated });
  } catch (e) {
    return res.status(500).json({ message: "Update failed", error: e.message });
  }
};

/* ------------------------------- DELETE ADDRESS ------------------------------ */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await Address.findByIdAndDelete(id);

    return res.json({ message: "Address deleted" });
  } catch (e) {
    return res.status(500).json({ message: "Delete failed", error: e.message });
  }
};



 


