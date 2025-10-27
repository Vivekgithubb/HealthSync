require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const cron = require('node-cron');
const { sendAppointmentReminders } = require('./utils/reminderService');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/pharmacy', require('./routes/pharmacy'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HealthSync API is running' });
});

// Cron job for appointment reminders - runs every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running appointment reminder job...');
  try {
    await sendAppointmentReminders();
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
});

// For testing, you can also trigger reminders manually
app.post('/api/reminders/send', async (req, res) => {
  try {
    await sendAppointmentReminders();
    res.json({ message: 'Reminders sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reminders', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
