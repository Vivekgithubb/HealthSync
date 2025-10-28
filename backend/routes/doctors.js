const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const { protect } = require("../middleware/auth");
const {
  doctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctor,
} = require("../controllers/doctorController");

// @route   GET /api/doctors
// @desc    Get all doctors for current user
// @access  Private
router.get("/", protect, doctors);

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Private
router.get("/:id", protect, getDoctor);

// @route   POST /api/doctors
// @desc    Create new doctor
// @access  Private
router.post("/", protect, createDoctor);

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private
router.put("/:id", protect, updateDoctor);

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private
router.delete("/:id", protect, deleteDoctor);

module.exports = router;
