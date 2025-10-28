const express = require("express");
const router = express.Router();
// const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/auth");
const {
  appointments,
  upcoming,
  findAppointment,
  newAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

// @route   GET /api/appointments
// @desc    Get all appointments for current user
// @access  Private
router.get("/", protect, appointments);

// @route   GET /api/appointments/upcoming
// @desc    Get upcoming appointments
// @access  Private
router.get("/upcoming", protect, upcoming);

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get("/:id", protect, findAppointment);

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post("/", protect, newAppointment);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put("/:id", protect, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete("/:id", protect, deleteAppointment);
// (no extra routes here)

module.exports = router;
