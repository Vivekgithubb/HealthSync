# HealthSync Backend API

Full-stack backend for HealthSync medical management application.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
cp .env.example .env
```

Then fill in your actual credentials:

- **MongoDB**: Install MongoDB locally or use MongoDB Atlas
- **Cloudinary**: Sign up at cloudinary.com for free
- **Gemini AI**: Get API key from ai.google.dev
- **Email**: Use Gmail with App Password (enable 2FA first)

### 2. Install Dependencies

Already installed, but if needed:
```bash
npm install
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

If using MongoDB Atlas, update `MONGODB_URI` in `.env` with your connection string.

### 4. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update user profile (Protected)

### Doctors (`/api/doctors`)
- `GET /` - Get all doctors
- `GET /:id` - Get single doctor
- `POST /` - Create doctor
- `PUT /:id` - Update doctor
- `DELETE /:id` - Delete doctor

### Documents (`/api/documents`)
- `GET /` - Get all documents
- `GET /:id` - Get single document
- `POST /upload` - Upload document to Cloudinary
- `PUT /:id` - Update document metadata
- `DELETE /:id` - Delete document

### Visits (`/api/visits`)
- `GET /` - Get all visit history
- `GET /:id` - Get single visit
- `POST /` - Create visit record
- `PUT /:id` - Update visit
- `DELETE /:id` - Delete visit

### Appointments (`/api/appointments`)
- `GET /` - Get all appointments
- `GET /upcoming` - Get upcoming appointments
- `GET /:id` - Get single appointment
- `POST /` - Create appointment
- `PUT /:id` - Update appointment
- `DELETE /:id` - Delete appointment

### Pharmacy (`/api/pharmacy`)
- `POST /parse-prescription` - Upload prescription image for AI parsing
- `GET /search/:drugName` - Search drug info via OpenFDA
- `GET /alternatives/:drugName` - Get drug alternatives

### Reminders
- `POST /api/reminders/send` - Manual trigger for sending reminders (testing)
- Automated cron job runs daily at 9 AM

## Tech Stack

- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - File storage
- **Multer** - File upload handling
- **Gemini AI** - Prescription image parsing
- **OpenFDA API** - Drug information lookup
- **Nodemailer** - Email notifications
- **node-cron** - Scheduled tasks

## Features Implemented

✅ **Pillar 1: Visit & Document Hub**
- Document upload to Cloudinary
- Visit history with doctor associations
- Document attachment to visits

✅ **Pillar 2: AI Pharmacy Assistant**
- Gemini AI prescription parsing
- OpenFDA drug search
- Drug alternatives lookup

✅ **Pillar 3: Appointments & Reminders**
- Appointment scheduling
- Automated email reminders (cron job)
- Doctor auto-fill functionality

## Notes

- All routes except `/register` and `/login` require authentication
- Include `Authorization: Bearer <token>` header for protected routes
- File uploads have a 10MB size limit
- Cron job runs daily at 9 AM to send appointment reminders for appointments in the next 2 days
