const mongoose = require('mongoose');

const visitHistorySchema = new mongoose.Schema({
  visitDate: {
    type: Date,
    required: [true, 'Please provide visit date'],
    default: Date.now
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Please select a doctor']
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for visit'],
    trim: true
  },
  diagnosis: {
    type: String,
    trim: true
  },
  prescription: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  followUpDate: {
    type: Date
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  vitalSigns: {
    bloodPressure: String,
    temperature: String,
    heartRate: String,
    weight: String,
    height: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VisitHistory', visitHistorySchema);
