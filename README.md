# HealthSync - Personal Health Management System

A comprehensive full-stack web application for managing personal health records, doctor appointments, medical visits, documents, and AI-powered pharmacy assistance.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features Guide](#features-guide)
- [Troubleshooting](#troubleshooting)
- [Development Status](#development-status)

---

## ✨ Features

### 1. **Authentication System**
- User registration and login
- JWT-based authentication
- Protected routes
- Profile management

### 2. **Doctor Management**
- Add, edit, and delete doctor profiles
- Track specialization, contact info, and hospital details
- Search and filter doctors
- View complete doctor list

### 3. **Document Management**
- Upload medical documents (reports, prescriptions, bills)
- Cloudinary integration for secure file storage
- Categorize documents (Lab Report, Prescription, Bill, Insurance, Other)
- Download and delete documents
- Document preview

### 4. **Medical Visits Tracking**
- Record doctor visits with date, reason, and diagnosis
- Link visits to specific doctors
- Attach relevant documents to visits
- Add treatment notes
- View visit history

### 5. **Appointment Scheduling**
- Schedule future appointments with doctors
- Set appointment reminders
- Email notifications (automated daily at 9 AM)
- Manual reminder trigger available
- Mark appointments as completed
- View upcoming appointments

### 6. **AI Pharmacy Assistant** 🤖
- **Prescription Image Parsing**: Upload prescription images, extract medication names using Gemini AI
- **Drug Information Search**: Search comprehensive drug details from OpenFDA database
- **Alternative Medications**: Find generic alternatives for brand-name drugs
- View detailed drug information:
  - Brand and generic names
  - Manufacturer details
  - Purpose and indications
  - Dosage and administration
  - Warnings and precautions
  - Side effects

### 7. **Dashboard & Analytics** (Placeholder for future)
- Overview of health metrics
- Upcoming appointments
- Recent visits

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling (custom config)
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage
- **Nodemailer** - Email service
- **Node-cron** - Task scheduling
- **Google Generative AI (Gemini)** - Prescription parsing
- **OpenFDA API** - Drug information

---

## 📁 Project Structure

```
healthsync/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js         # Cloudinary configuration
│   │   └── database.js           # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Doctor.js             # Doctor schema
│   │   ├── Document.js           # Document schema
│   │   ├── Visit.js              # Visit schema
│   │   └── Appointment.js        # Appointment schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── doctors.js            # Doctor management routes
│   │   ├── documents.js          # Document management routes
│   │   ├── visits.js             # Visit tracking routes
│   │   ├── appointments.js       # Appointment routes
│   │   └── pharmacy.js           # AI Pharmacy routes
│   ├── utils/
│   │   └── reminderService.js    # Email reminder service
│   ├── uploads/                  # Temporary upload directory
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example environment file
│   ├── server.js                 # Main server file
│   ├── package.json
│   └── README.md
├── src/
│   ├── components/
│   │   ├── Layout.jsx            # Main layout wrapper
│   │   ├── ProtectedRoute.jsx   # Route protection component
│   │   └── PlaceholderPage.jsx  # Placeholder component
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── Dashboard.jsx         # Dashboard (placeholder)
│   │   ├── Doctors.jsx           # Doctor management
│   │   ├── Documents.jsx         # Document management
│   │   ├── Visits.jsx            # Visit tracking
│   │   ├── Appointments.jsx      # Appointment scheduling
│   │   └── AIPharmacy.jsx        # AI Pharmacy assistant
│   ├── services/
│   │   └── api.js                # API service layer
│   ├── App.jsx                   # Main app component with routing
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Global styles
├── public/
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md                     # This file
```

---

## 📦 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Google Gemini API Key** - [Get key](https://ai.google.dev/)
- **Gmail Account** (for email notifications with App Password enabled)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd healthsync
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

**Backend Dependencies:**
```json
{
  "@google/generative-ai": "^0.24.1",
  "axios": "^1.12.2",
  "bcrypt": "^6.0.0",
  "cloudinary": "^2.8.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.19.2",
  "multer": "^2.0.2",
  "node-cron": "^4.2.1",
  "nodemailer": "^7.0.10"
}
```

### 3. Install Frontend Dependencies
```bash
cd ..
npm install
```

**Frontend Dependencies:**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "axios": "^1.12.2",
  "lucide-react": "^0.469.0"
}
```

### 4. Configure Environment Variables

Create `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables) section below).

---

## 🔐 Environment Variables

### Backend `.env` Configuration

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
# Get from: https://cloud.mongodb.com/
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration
# Get from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI API Key
# Get from: https://ai.google.dev/ or https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Nodemailer with Gmail)
# Enable 2FA and create App Password: https://myaccount.google.com/apppasswords
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### How to Get API Keys

#### 1. **MongoDB Atlas**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create database user (Database Access)
4. Whitelist your IP (Network Access) or use `0.0.0.0/0` for all IPs
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<username>`, `<password>`, and `<database>` in the URI

#### 2. **Cloudinary**
1. Sign up at https://cloudinary.com/
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### 3. **Google Gemini AI**
1. Visit https://ai.google.dev/
2. Click "Get API Key in Google AI Studio"
3. Create a new API key
4. Copy the key

#### 4. **Gmail App Password**
1. Enable 2-Factor Authentication on your Google account
2. Visit https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Generate and copy the 16-character password

---

## 🏃 Running the Application

### Development Mode

#### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on: **http://localhost:5000**

#### 2. Start Frontend (in a new terminal)
```bash
cd healthsync
npm run dev
```
Frontend runs on: **http://localhost:5173**

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
npm run build
npm run preview
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token", "user": {...} }
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john@example.com"
}
```

### Doctor Endpoints

#### Get All Doctors
```http
GET /doctors
Authorization: Bearer <token>
```

#### Create Doctor
```http
POST /doctors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Smith",
  "specialization": "Cardiologist",
  "phone": "1234567890",
  "email": "dr.smith@hospital.com",
  "hospital": "City Hospital",
  "address": "123 Medical St"
}
```

### Document Endpoints

#### Upload Document
```http
POST /documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: {
  file: <file>,
  title: "Lab Report",
  category: "Lab Report",
  description: "Blood test results"
}
```

### Pharmacy AI Endpoints

#### Parse Prescription Image
```http
POST /pharmacy/parse-prescription
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: {
  image: <prescription_image>
}

Response: {
  "medications": ["Aspirin", "Ibuprofen", "Metformin"]
}
```

#### Search Drug Information
```http
GET /pharmacy/search/:drugName
Authorization: Bearer <token>

Example: GET /pharmacy/search/aspirin
```

For complete API documentation, see the [detailed API section](#api-documentation) above.

---

## 📖 Features Guide

### Using Doctor Management
1. Navigate to "Doctors" from the sidebar
2. Click "Add New Doctor" button
3. Fill in doctor details (name, specialization, contact info)
4. Save to add to your list
5. Use edit/delete icons to modify or remove doctors

### Using Document Management
1. Go to "Documents" page
2. Click "Upload Document"
3. Select file (PDF, images supported)
4. Add title, select category, add optional description
5. Click "Upload" - file is stored in Cloudinary
6. View, download, or delete documents from the list

### Recording Visits
1. Navigate to "Visits"
2. Click "Record New Visit"
3. Select doctor from dropdown
4. Enter visit date, reason, diagnosis, and treatment notes
5. Optionally attach documents
6. Save the visit record

### Scheduling Appointments
1. Go to "Appointments"
2. Click "Schedule New Appointment"
3. Select doctor and date/time
4. Add reason and notes
5. Enable reminder checkbox for email notifications
6. Appointments with reminders will send emails daily at 9 AM if within 24 hours

### Using AI Pharmacy

#### Prescription Parsing
1. Navigate to "AI Pharmacy"
2. Stay on "AI Upload" tab
3. Click upload area and select prescription image
4. Click "Analyze Prescription"
5. Wait for AI to process (5-10 seconds)
6. Extracted medications appear as clickable cards
7. Click any medication to search its information

#### Manual Drug Search
1. Go to "Manual Search" tab
2. Enter drug name (brand or generic)
3. Click "Search" or press Enter
4. View detailed drug information and alternatives
5. Try common names like: aspirin, ibuprofen, tylenol, lipitor

**Tips for Better Results:**
- Use generic names (e.g., "ibuprofen" instead of specific brands)
- Try alternative spellings if no results
- Clear, well-lit prescription images work best for AI parsing
- Printed prescriptions parse better than handwritten ones

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```
Error: MongooseServerSelectionError
```
**Solution:**
- Check MONGODB_URI in `.env`
- Verify network access settings in MongoDB Atlas
- Ensure correct username/password
- Whitelist your IP address

#### Cloudinary Upload Failed
```
Error: Invalid cloud_name
```
**Solution:**
- Verify Cloudinary credentials in `.env`
- Check CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET
- Ensure account is active

#### Email Reminders Not Sending
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:**
- Enable 2-Factor Authentication on Gmail
- Generate App Password at https://myaccount.google.com/apppasswords
- Use the 16-character app password (no spaces)
- Don't use your regular Gmail password

#### Gemini AI Prescription Parsing Failed
```
Error: API key not valid
```
**Solution:**
- Verify GEMINI_API_KEY in `.env`
- Get new key from https://ai.google.dev/
- Check API quota limits at Google AI Studio

### Frontend Issues

#### Cannot Connect to Backend
```
Error: Network Error / ERR_CONNECTION_REFUSED
```
**Solution:**
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/server.js`
- Verify API_URL in `src/services/api.js` is `http://localhost:5000/api`

#### Documents Not Uploading
```
Error: File too large
```
**Solution:**
- Maximum file size is 10MB for Cloudinary free tier
- Compress images/PDFs before uploading
- Check Cloudinary dashboard for storage limits

### AI Pharmacy Issues

#### No Medications Found in Prescription
**Solutions:**
- Use clearer, higher resolution images
- Ensure prescription is well-lit and readable
- Try uploading a different prescription
- Check backend logs for Gemini AI errors

#### Drug Search Returns No Results
**Solutions:**
- Try generic drug name instead of brand name
- Check spelling of drug name
- Use simpler terms (e.g., "aspirin" not "aspirin 500mg")
- OpenFDA database doesn't include all drugs
- Check backend logs for API errors

---

## 🔄 Automated Tasks

### Appointment Reminders
- Cron job runs daily at **9:00 AM**
- Checks appointments within next 24 hours
- Sends email reminders to users
- Manual trigger available at: `POST /api/reminders/send`

To test reminders immediately:
```bash
curl -X POST http://localhost:5000/api/reminders/send
```

---

## 📝 Development Status

### ✅ Completed Features
- [x] Authentication (Register/Login/JWT)
- [x] Doctor Management (CRUD)
- [x] Document Management (Upload/View/Delete)
- [x] Visit Tracking (CRUD with doctor linking)
- [x] Appointment Scheduling (CRUD with reminders)
- [x] AI Pharmacy (Prescription parsing + Drug search)
- [x] Email Notifications
- [x] Responsive UI with Tailwind CSS
- [x] Protected routes
- [x] File upload with Cloudinary
- [x] API integration (Gemini AI, OpenFDA)

### 🚧 Planned Features / Improvements
- [ ] Dashboard with analytics and charts
- [ ] Health metrics tracking (BP, sugar, weight)
- [ ] Medication reminder system
- [ ] Calendar view for appointments
- [ ] Export reports as PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)

### 🐛 Known Issues
- [ ] Dashboard page is placeholder (not yet implemented)
- [ ] Some OpenFDA queries may return limited results
- [ ] Handwritten prescription parsing needs improvement

---

## 📊 Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Doctor
```javascript
{
  user: ObjectId (ref: User),
  name: String (required),
  specialization: String (required),
  phone: String,
  email: String,
  hospital: String,
  address: String,
  createdAt: Date
}
```

### Document
```javascript
{
  user: ObjectId (ref: User),
  title: String (required),
  description: String,
  category: String,
  fileUrl: String (required),
  fileType: String,
  uploadDate: Date
}
```

### Visit
```javascript
{
  user: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  visitDate: Date (required),
  reason: String (required),
  diagnosis: String,
  treatment: String,
  documents: [ObjectId],
  createdAt: Date
}
```

### Appointment
```javascript
{
  user: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  appointmentDate: Date (required),
  reason: String (required),
  status: String,
  reminderEnabled: Boolean,
  reminderSent: Boolean,
  createdAt: Date
}
```

---

## 🧪 Testing

### Test OpenFDA API
```bash
cd backend
node test-fda.js
```

---

## 👤 Author

**Vivek Pai**
- Email: vivekpai2005810@gmail.com

---

## 🙏 Acknowledgments

- OpenFDA API for drug information
- Google Gemini AI for prescription parsing
- Cloudinary for file storage
- MongoDB Atlas for database hosting

---

## 📅 Project Timeline

- **Start Date:** October 2025
- **Current Status:** Core features completed
- **Last Updated:** October 27, 2025

---

**Happy Health Tracking! 🏥💊📋**
