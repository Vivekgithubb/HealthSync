import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import "../models/VisitHistory.js"; // Import for model registration

// Check for missed appointments every 5 minutes
export const checkMissedAppointments = async () => {
  try {
    const now = new Date();
    // Find scheduled appointments that are in the past (plus 15 min grace period)
    const cutoffTime = new Date(now.getTime() - 15 * 60000); // 15 minutes ago

    const missedAppointments = await Appointment.find({
      status: "scheduled",
      appointmentDate: { $lt: now.toISOString().split("T")[0] },
      $or: [
        { appointmentTime: { $lt: now.toTimeString().slice(0, 5) } },
        { appointmentDate: { $lt: cutoffTime.toISOString().split("T")[0] } },
      ],
    });

    for (const apt of missedAppointments) {
      apt.status = "missed";
      apt.missedAt = now;
      await apt.save();
    }
  } catch (error) {
    console.error("Error checking missed appointments:", error);
  }
};

// Start the checker when the server starts
setInterval(checkMissedAppointments, 5 * 60 * 1000); // Run every 5 minutes

export const appointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor")
      .populate("documents")
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const upcoming = async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({
      user: req.user._id,
      appointmentDate: { $gte: now },
      status: "scheduled",
    })
      .populate("doctor")
      .populate("documents")
      .sort({ appointmentDate: 1 })
      .limit(5);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const findAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("doctor")
      .populate("documents");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const newAppointment = async (req, res) => {
  try {
    let doctorId;

    // CASE 1: doctor is manually entered
    if (typeof req.body.doctor === "object" && req.body.doctor !== null) {
      const newDoctor = await Doctor.create({
        ...req.body.doctor,
        user: req.user._id,
      });
      doctorId = newDoctor._id;
    } else {
      // CASE 2: doctor is selected from dropdown (ID)
      doctorId = req.body.doctor;
    }

    const appointment = await Appointment.create({
      ...req.body,
      doctor: doctorId, // ensure this is always an ObjectId
      user: req.user._id,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor")
      .populate("documents");

    res.status(201).json({
      status: "success",
      data: populatedAppointment,
    });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while creating appointment",
      error: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("doctor")
      .populate("documents");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if status is being changed to completed
    const isCompletingAppointment =
      req.body.status === "completed" && appointment.status !== "completed";

    // Update appointment with allowed fields only
    const allowedFields = [
      "appointmentDate",
      "appointmentTime",
      "status",
      "notes",
    ];
    allowedFields.forEach((field) => {
      if (field in req.body) {
        appointment[field] = req.body[field];
      }
    });

    await appointment.save();

    // If status changed to completed, create visit history
    if (isCompletingAppointment) {
      const VisitHistory = mongoose.model("VisitHistory");
      await VisitHistory.create({
        visitDate: appointment.appointmentDate,
        doctor: appointment.doctor._id,
        reason: appointment.reason,
        notes: `Converted from appointment: ${appointment.notes || ""}`,
        documents: appointment.documents,
        user: req.user._id,
      });
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor")
      .populate("documents");

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
