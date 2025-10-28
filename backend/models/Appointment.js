const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Please select a doctor']
  },
  reason: {
    type: String,
    required: [true, 'Please provide reason for appointment'],
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  reminderSent: {
    type: Boolean,
    default: false
  },
  lastReminderSent: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient reminder queries
appointmentSchema.index({ appointmentDate: 1, reminderSent: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
