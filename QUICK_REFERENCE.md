# HealthSync - Quick Reference Card

## 🚀 Start Development

```bash
# Terminal 1 - Backend
cd C:\Users\VIVEK PAI\healthsync\backend
npm run dev

# Terminal 2 - Frontend  
cd C:\Users\VIVEK PAI\healthsync
npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

---

## 📁 Project Structure

```
healthsync/
├── backend/          # Express.js API server
│   ├── routes/      # API endpoints
│   ├── models/      # MongoDB schemas
│   ├── config/      # DB & Cloudinary config
│   └── .env         # API keys (DO NOT COMMIT)
└── src/             # React frontend
    ├── pages/       # All page components
    ├── services/    # API integration
    └── components/  # Reusable components
```

---

## 🔑 Features

| Feature | Status | Route |
|---------|--------|-------|
| Authentication | ✅ | /login, /register |
| Doctors | ✅ | /doctors |
| Documents | ✅ | /documents |
| Visits | ✅ | /visits |
| Appointments | ✅ | /appointments |
| AI Pharmacy | ✅ | /pharmacy |
| Dashboard | 🚧 | / (placeholder) |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Axios, Lucide Icons  
**Backend:** Node.js, Express, MongoDB, JWT, Multer  
**Services:** Cloudinary (files), Gemini AI (OCR), OpenFDA (drugs), Nodemailer (email)

---

## 🧪 Test Features

### Manual Drug Search
Try: `aspirin`, `ibuprofen`, `tylenol`, `lipitor`

### Prescription Upload
- Use clear, well-lit images
- Printed > handwritten
- Under 10MB

---

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB connection in `.env` |
| 401 Unauthorized | Login again or clear localStorage |
| File upload fails | Check Cloudinary credentials |
| AI parsing fails | Check GEMINI_API_KEY in `.env` |
| Drug search fails | Try generic drug names |

---

## 📚 Documentation

- **README.md** - Full documentation
- **SESSION_NOTES.md** - Development notes & next steps
- **AI_PHARMACY_FIXES.md** - Recent fixes details

---

## 🔐 Environment Setup

Required in `backend/.env`:
- MONGODB_URI
- JWT_SECRET
- CLOUDINARY_* (3 variables)
- GEMINI_API_KEY
- EMAIL_USER & EMAIL_PASSWORD

See `.env.example` for template.

---

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/doctors | Get all doctors |
| POST | /api/documents/upload | Upload file |
| POST | /api/pharmacy/parse-prescription | AI parse image |
| GET | /api/pharmacy/search/:drug | Search drug info |

See README.md for complete API documentation.

---

## 🎯 Next Steps

1. **Dashboard** - Add charts and analytics
2. **Health Metrics** - BP, sugar, weight tracking
3. **Medication Manager** - Dosage tracking, reminders
4. **Calendar View** - Visual appointment calendar
5. **Export** - PDF reports generation

---

## 💾 Git Commands

```bash
# First time setup
git init
git add .
git commit -m "Initial commit - HealthSync v1.0"

# Connect to GitHub
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main

# Daily commits
git add .
git commit -m "Your message"
git push
```

⚠️ **Before pushing:** Make sure `.env` files are NOT included!

---

## 🐛 Debug Commands

```bash
# Check backend status
curl http://localhost:5000/api/health

# Test OpenFDA API
cd backend && node test-fda.js

# Send test reminder
curl -X POST http://localhost:5000/api/reminders/send

# Clear browser data
localStorage.clear()  # In browser console
```

---

## 📞 Support Links

- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Cloudinary Console](https://cloudinary.com/console)
- [Gemini API Keys](https://makersuite.google.com/app/apikey)
- [OpenFDA Docs](https://open.fda.gov/apis/)

---

**Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Status:** Production Ready ✅
