import Doctor from "../models/Doctor.js";

export const doctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ user: req.user._id }).sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    Object.assign(doctor, req.body);
    await doctor.save();

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.deleteOne();
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
