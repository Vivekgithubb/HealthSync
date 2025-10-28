const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const cloudinary = require("cloudinary").v2;
const { protect } = require("../middleware/auth");
const {
  appointments,
  upcoming,
  findAppointment,
  newAppointment,
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
router.put("/:id", protect);

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete("/:id", protect, deleteAppointment);
// Add this route
router.get("/download/:id", protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Generate fresh signed URL valid for 1 hour
    const signedUrl = cloudinary.utils.private_download_url(
      document.publicId,
      document.fileType,
      {
        type: "authenticated",
        attachment: true, // Force download
        resource_type: "raw",
      }
    );

    res.json({ url: signedUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating download URL", error: error.message });
  }
});

module.exports = router;
