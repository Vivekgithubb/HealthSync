const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const doctors = await Doctor.find({ user: req.user._id }).sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/doctors
// @desc    Create new doctor
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,
      user: req.user._id
    });
    
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    Object.assign(doctor, req.body);
    await doctor.save();
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    await doctor.deleteOne();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
