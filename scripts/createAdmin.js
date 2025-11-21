// scripts/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/userModel.js";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminFirebaseUid = "7zI2F5464mVtXE3RPB939HKMCW73"; // <-- YOUR ADMIN UID

    const adminUser = await User.findOneAndUpdate(
      { firebaseUid: adminFirebaseUid },
      {
        firebaseUid: adminFirebaseUid,
        name: "Mohit Admin",
        email: "craftedforclicks@gmail.com",
        isAdmin: true,
      },
      {
        upsert: true,  // create if not exists
        new: true,     // return updated doc
      }
    );

    console.log("🔥 ADMIN USER CREATED / UPDATED SUCCESSFULLY:");
    console.log(adminUser);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
}

run();
