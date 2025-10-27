const express = require('express');
const router = express.Router();
const VisitHistory = require('../models/VisitHistory');
const { protect } = require('../middleware/auth');

// @route   GET /api/visits
// @desc    Get all visits for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const visits = await VisitHistory.find({ user: req.user._id })
      .populate('doctor')
      .populate('documents')
      .sort({ visitDate: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/visits/:id
// @desc    Get single visit
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const visit = await VisitHistory.findOne({ _id: req.params.id, user: req.user._id })
      .populate('doctor')
      .populate('documents');
    
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }
    
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/visits
// @desc    Create new visit
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const visit = await VisitHistory.create({
      ...req.body,
      user: req.user._id
    });

    const populatedVisit = await VisitHistory.findById(visit._id)
      .populate('doctor')
      .populate('documents');
    
    res.status(201).json(populatedVisit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/visits/:id
// @desc    Update visit
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const visit = await VisitHistory.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }
    
    Object.assign(visit, req.body);
    await visit.save();

    const populatedVisit = await VisitHistory.findById(visit._id)
      .populate('doctor')
      .populate('documents');
    
    res.json(populatedVisit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/visits/:id
// @desc    Delete visit
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const visit = await VisitHistory.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }
    
    await visit.deleteOne();
    res.json({ message: 'Visit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
