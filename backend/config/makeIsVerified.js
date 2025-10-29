import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config({ path: "../.env" }); // ✅ Adjust this path based on your setup

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Update users
    const result = await User.updateMany(
      { isverified: { $exists: false } },
      { $set: { isverified: true } }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} old users with isverified=true`
    );
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating users:", err);
  }
})();
