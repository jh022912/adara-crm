# Adara CRM - Quick Start (TL;DR)

## Fastest Path to Running Locally

### Prerequisites Installed?
```bash
node --version  # Need v18+
npm --version   # Need v8+
psql --version  # If using local PostgreSQL
```

If any are missing, install them first.

---

## Setup (Do This Once)

### 1. Database
```bash
# Local PostgreSQL
createdb adara_crm

# OR use Railway - copy DATABASE_URL
```

### 2. Google Sheets
1. Go to Google Cloud Console → New Project
2. Enable Google Sheets API
3. Create Service Account → Download JSON
4. Get `private_key` and `client_email` from JSON
5. Share your Google Sheet with the service account email
6. Get your sheet ID from URL

### 3. Backend
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with DATABASE_URL, Google credentials
npm run db:migrate

# Create admin user (copy bcrypt hash)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"
# Then in psql:
# INSERT INTO admin_users (email, password_hash) VALUES ('admin@example.com', '$2a$...');
```

### 4. Frontend
```bash
cd ../Frontend
npm install
cp .env.example .env
# Edit .env with VITE_API_URL=http://localhost:5000/api
```

---

## Run Local (Do This Every Time)

### Terminal 1: Backend
```bash
cd Backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd Frontend
npm run dev
```

Visit `http://localhost:3000` and login!

---

## Login Credentials
- Email: `admin@example.com`
- Password: `admin123` (or whatever you set)

---

## Quick Commands

| What | Command |
|------|---------|
| Migrate database | `cd Backend && npm run db:migrate` |
| Start backend | `cd Backend && npm run dev` |
| Start frontend | `cd Frontend && npm run dev` |
| Check backend health | `curl http://localhost:5000/api/health` |
| Login via API | `curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'` |
| Build frontend | `cd Frontend && npm run build` |

---

## Google Sheets Format

Your sheet needs these columns:
| A | B | C | D |
|---|---|---|---|
| Name | Phone | Address | Status |
| John Doe | (555) 123-4567 | 123 Main St | new |

---

## First Steps in App

1. ✅ Login at `http://localhost:3000`
2. ✅ See empty dashboard
3. ✅ Add a company (or via API if needed)
4. ✅ Click company to see leads
5. ✅ Add test lead manually
6. ✅ Wait 5 min or click "Sync" to pull from Google Sheets
7. ✅ Update lead status

---

## Detailed Guides

- **Full Setup**: See `SETUP_GUIDE.md`
- **Backend Details**: See `Backend/README.md`
- **Frontend Details**: See `Frontend/README.md`
- **Architecture**: See `README.md`

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "Cannot connect to database" | Check DATABASE_URL, verify PostgreSQL running |
| "Login fails" | Verify admin user in psql: `SELECT * FROM admin_users;` |
| "Can't reach backend" | Check port 5000 open, verify VITE_API_URL |
| "Google Sheets sync not working" | Check service account has Sheet access, verify credentials in .env |
| "Port 5000 already in use" | Change PORT in .env or kill: `kill -9 $(lsof -t -i:5000)` |

---

## Deploy to Railway

```bash
git init
git add .
git commit -m "Adara CRM"
git push origin main  # (after connecting to GitHub)
```

Then:
1. Railway.app → New project → GitHub repo
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy!

---

**Ready?** Start with Backend/Frontend setup above! 🚀
