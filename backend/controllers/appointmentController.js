import Appointment from "../models/Appointment.js";

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
    const appointment = await Appointment.create({
      ...req.body,
      user: req.user._id,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor")
      .populate("documents");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    Object.assign(appointment, req.body);
    await appointment.save();

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
