# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at http://localhost:5173

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Architecture Overview

### Tech Stack
- **React 19** (without TypeScript) - Component library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling
- **date-fns** - Date formatting utility
- **idb-keyval** - IndexedDB wrapper for persistent browser storage

### Application Structure

HealthSync is a single-page medical appointment and prescription manager. All data is stored client-side in IndexedDB—no backend exists.

**Core Pages** (`src/pages/`):
- `Dashboard.jsx` - Shows upcoming appointments and recent prescriptions with quick action buttons
- `Appointments.jsx` - Full CRUD for appointments (doctor, date, time, location, notes)
- `Prescriptions.jsx` - Full CRUD for prescriptions with file upload support (images/PDFs stored as base64 data URLs)

**Key Components**:
- `Layout.jsx` - Navigation wrapper with active route highlighting

**Storage Layer** (`src/utils/storage.js`):
- Abstracts IndexedDB operations via `idb-keyval`
- Uses prefixed keys: `appointment-{timestamp}` and `prescription-{timestamp}`
- All data objects include `id` and `type` fields

**Routing**:
- `/` → Dashboard
- `/appointments` → Appointments manager
- `/prescriptions` → Prescriptions manager

### Data Model

**Appointments**:
```javascript
{
  id: string,
  type: 'appointment',
  doctor: string,
  date: string,
  time: string,
  reason: string,
  location: string,
  notes: string
}
```

**Prescriptions**:
```javascript
{
  id: string,
  type: 'prescription',
  medication: string,
  doctor: string,
  date: string,
  dosage: string,
  notes: string,
  files: [{ name, type, data }] // data is base64 data URL
}
```

### File Upload Pattern

Prescriptions support multiple file uploads. Files are:
1. Read via FileReader as data URLs (base64)
2. Stored with metadata: `{ name, type, data }`
3. Rendered as downloadable links or viewable images

### Styling Conventions

- Tailwind utility classes throughout
- Color scheme: Indigo (appointments) and Purple (prescriptions)
- Custom font: Inter (loaded from Google Fonts)
- Responsive design with `md:` breakpoints
- Gradient backgrounds and shadow effects for modern UI

### ESLint Configuration

- React Hooks rules enforced
- Unused variables allowed if uppercase (e.g., constants)
- React Refresh enabled for HMR
