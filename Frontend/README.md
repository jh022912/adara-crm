# Adara CRM - Frontend

React frontend for the Adara CRM application.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `VITE_API_URL` if your backend runs on a different address:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── ProtectedRoute.jsx
│   ├── LeadTable.jsx
│   └── LeadModal.jsx
├── pages/               # Page components
│   ├── LoginPage.jsx
│   ├── AdminDashboard.jsx
│   └── CompanyLeadsPage.jsx
├── api/                 # API service calls
│   ├── authService.js
│   ├── companyService.js
│   └── leadService.js
├── context/             # React Context for state
│   └── CompanyContext.jsx
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles (Tailwind)
```

## Features

### Authentication
- Login page with email/password
- JWT token stored in localStorage
- Protected routes redirect to login

### Admin Dashboard
- View all companies
- Click company to view its leads
- Logout button

### Company Leads View
- Table of all leads with name, phone, address, status
- Update lead status with dropdown (new → attempted → contacted → sold)
- Add new leads with modal form
- Edit existing leads
- Delete leads with confirmation
- Sync leads from Google Sheets
- Back button to return to dashboard

## Styling

Built with **Tailwind CSS** to match Adara's design:
- Serif fonts (Georgia)
- Dark navy (#001f3f, #0a1929) and white color scheme
- Minimal, clean aesthetic
- Responsive design

## API Integration

Frontend calls the backend API at `VITE_API_URL` for:
- Authentication (login)
- Companies (list, get, create, update, delete)
- Leads (list, create, update, delete)
- Sync from Google Sheets

All API calls include JWT token in Authorization header for protected endpoints.

## Building for Production

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

## Deployment

Can be deployed to:
- Railway (as static site or with Node server)
- Vercel
- Netlify
- Any static hosting that supports single-page apps

Set environment variable `VITE_API_URL` to your deployed backend API URL.

## Troubleshooting

**"Network Error" when trying to login:**
- Check that backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` is correct in `.env`
- Check browser console for CORS errors

**Page not found after clicking company:**
- Ensure you're selecting a company before navigating
- Check URL matches `/company/:companyId`

**Styles not loading:**
- Make sure Tailwind CSS build is running
- Check `index.css` imports are correct

## Next Steps

- Add more validation
- Add loading skeletons
- Add confirmation dialogs
- Add toast notifications for success/error
- Add filtering and sorting to leads table
- Add export to CSV
