const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      trim: true,
    },
    specialty: {
      type: String,

      trim: true,
    },
    clinic: {
      type: String,

      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    workingHours: {
      type: String,
      default: "9:00 AM - 5:00 PM",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
