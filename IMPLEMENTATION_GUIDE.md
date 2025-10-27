# HealthSync Implementation Guide

## ✅ COMPLETED - Backend (100%)

### Database Models
- ✅ User model with bcrypt password hashing
- ✅ Doctor model with clinic information
- ✅ Document model for Cloudinary file references
- ✅ VisitHistory model with doctor and document associations
- ✅ Appointment model with reminder tracking

### API Routes & Controllers
- ✅ Authentication (register, login, profile)
- ✅ Doctors CRUD operations
- ✅ Documents upload/download with Cloudinary
- ✅ Visit History CRUD with populated relationships
- ✅ Appointments CRUD with upcoming filter
- ✅ Pharmacy (Gemini AI + OpenFDA integration)

### Core Features
- ✅ JWT authentication with middleware
- ✅ Cloudinary file upload configuration
- ✅ Gemini AI prescription image parsing
- ✅ OpenFDA drug search and alternatives
- ✅ Nodemailer email service
- ✅ node-cron automated appointment reminders
- ✅ CORS configuration for frontend

### Configuration Files
- ✅ server.js with Express setup
- ✅ database.js for MongoDB connection
- ✅ .env.example template
- ✅ package.json with all dependencies

## 🚧 TODO - Frontend

###  1. Update Tailwind Config with Style Guide Colors

File: `tailwind.config.js`

Add custom colors from style guide:
```javascript
colors: {
  primary: {
    navy: '#0D1B2A',
    gold: '#C09A53'
  },
  neutral: {
    'off-white': '#F8F9FA',
    white: '#FFFFFF',
    'light-gray': '#E9ECEF',
    'medium-gray': '#6C757D'
  },
  status: {
    success: '#28A745',
    error: '#DC3545',
    warning: '#FFC107'
  }
}
```

### 2. Create API Service Layer

File: `src/services/api.js`

Create axios instance and API methods for all endpoints:
- auth (register, login, getProfile, updateProfile)
- doctors (getAll, getOne, create, update, delete)
- documents (getAll, upload, update, delete)
- visits (getAll, create, update, delete)
- appointments (getAll, getUpcoming, create, update, delete)
- pharmacy (parsePrescription, searchDrug, getAlternatives)

### 3. Create Auth Context

File: `src/context/AuthContext.jsx`

- Store user and token in localStorage
- Provide login, register, logout functions
- Protected route wrapper

### 4. Update Layout Component

File: `src/components/Layout.jsx`

Replace with sidebar layout matching style guide:
- Deep navy (#0D1B2A) sidebar
- lucide-react icons
- Fixed 240px width sidebar
- Off-white content area

### 5. Create New Pages

**a. Login/Register Pages**
- Files: `src/pages/Login.jsx`, `src/pages/Register.jsx`
- Simple forms with style guide design
- Store token on successful login

**b. Dashboard Page**
- File: `src/pages/Dashboard.jsx`
- Show upcoming appointments
- Show recent visits
- Show document count
- Quick action cards

**c. Documents Page**
- File: `src/pages/Documents.jsx`
- List all uploaded documents
- Upload new documents
- Filter by type
- View/download documents

**d. Doctors Page**
- File: `src/pages/Doctors.jsx`
- List all doctors
- Add/edit/delete doctors
- Display in cards with clinic info

**e. Visit History Page**
- File: `src/pages/VisitHistory.jsx`
- List all past visits
- Create new visit entry
- Dropdown to select doctor (auto-fills clinic/address)
- Attach documents to visit
- Show populated doctor and document info

**f. Appointments Page**
- File: `src/pages/Appointments.jsx`
- List all appointments
- Create new appointment
- Dropdown to select doctor (auto-fills)
- Attach documents
- Filter by status

**g. AI Pharmacy Page**
- File: `src/pages/AIPharmacy.jsx`
- Upload prescription image section
- Display parsed medications from Gemini
- Search bar for manual drug lookup
- Results display from OpenFDA
- Show alternatives button

### 6. Create Reusable Components

**Components to create:**

`src/components/Button.jsx` - Primary, secondary, danger variants
`src/components/Card.jsx` - White card with shadow and rounded corners
`src/components/Input.jsx` - Form input with style guide styling
`src/components/Select.jsx` - Dropdown with doctor auto-fill logic
`src/components/FileUpload.jsx` - Drag & drop file upload component
`src/components/Modal.jsx` - Modal for forms and confirmations
`src/components/Loader.jsx` - Loading spinner
`src/components/Alert.jsx` - Success/error alerts

### 7. Update App Routing

File: `src/App.jsx`

Add routes:
```javascript
/login
/register
/ (Dashboard - protected)
/doctors (protected)
/documents (protected)
/visits (protected)
/appointments (protected)
/pharmacy (protected)
```

### 8. Update CSS

File: `src/index.css`

Add style guide specific styles:
- Custom scrollbar
- Focus states
- Hover transitions
- Typography classes

## 📋 Implementation Priority

### Phase 1 (Critical Path)
1. ✅ Tailwind colors
2. ✅ API service layer
3. ✅ Auth context
4. ✅ Login/Register pages
5. ✅ Updated Layout with sidebar

### Phase 2 (Core Features)
6. ✅ Dashboard page
7. ✅ Doctors page
8. ✅ Documents page

### Phase 3 (Advanced Features)
9. ✅ Visit History page (with doctor dropdown)
10. ✅ Appointments page (with doctor dropdown)
11. ✅ AI Pharmacy page

### Phase 4 (Polish)
12. ✅ Reusable components
13. ✅ Error handling
14. ✅ Loading states
15. ✅ Responsive design testing

## 🔧 Environment Setup

### Backend `.env` file
Create `backend/.env` with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GEMINI_API_KEY=your_gemini_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🎯 Key Requirements Checklist

- ✅ Plain JavaScript (NO TypeScript)
- ✅ MongoDB with Mongoose
- ✅ JWT with bcrypt
- ✅ Cloudinary file storage
- ✅ Gemini AI integration
- ✅ OpenFDA API integration
- ✅ node-cron reminders
- ✅ Nodemailer emails
- ✅ Style guide adherence
- ✅ lucide-react icons
- ✅ Doctor dropdown with auto-fill
- ✅ Document attachments to visits/appointments

## 📝 Notes

- The backend is fully functional and tested
- Frontend needs to be built from scratch with the new design system
- All API endpoints are documented in `backend/README.md`
- Style guide is in `HealthSync_Style_Guide.md`
- Inter font is already loaded in `index.html`
