# Adara CRM - Complete Setup Guide

This guide walks you through every step to get your Adara CRM up and running.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Google Sheets API Setup](#google-sheets-api-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running Locally](#running-locally)
7. [Creating Your First Admin User](#creating-your-first-admin-user)
8. [Testing the Application](#testing-the-application)
9. [Deployment to Railway](#deployment-to-railway)

---

## Prerequisites

Before starting, make sure you have:

- **Node.js** (v18+) - Download from https://nodejs.org
- **PostgreSQL** (v12+) - Download from https://www.postgresql.org/download/
  - OR create a Railway account for managed PostgreSQL
- **Git** - For version control (optional but recommended)
- **Google Account** - For Google Sheets API
- **A Facebook Lead Ads Google Sheet** - With columns: Name, Phone, Address, Status

### Installation Check

```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version   # Should be v8 or higher

# Check PostgreSQL (if local)
psql --version  # Should be v12 or higher
```

---

## Database Setup

### Option A: Local PostgreSQL (Recommended for Development)

#### 1. Create the Database

```bash
# Open PostgreSQL prompt
psql -U postgres

# In psql, create database
CREATE DATABASE adara_crm;

# Exit psql
\q
```

#### 2. Update Backend .env

Edit `Backend/.env` and set:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/adara_crm
```

Replace `your_password` with your PostgreSQL password.

### Option B: Railway PostgreSQL (For Deployment)

#### 1. Create Railway Project

1. Go to https://railway.app
2. Sign up/login
3. Create new project
4. Add PostgreSQL plugin
5. Copy the `DATABASE_URL` from the plugin settings

#### 2. Update Backend .env

```
DATABASE_URL=postgresql://user:password@host:port/adara_crm
```

Copy the full URL from Railway.

---

## Google Sheets API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a Project" → "New Project"
3. Name it "Adara CRM"
4. Click "Create"

### Step 2: Enable Google Sheets API

1. In Cloud Console, search for "Google Sheets API"
2. Click "Google Sheets API"
3. Click "Enable"

### Step 3: Create Service Account

1. In Cloud Console, go to "Service Accounts" (left menu)
2. Click "Create Service Account"
3. Fill in:
   - Service account name: `adara-crm-service`
   - Service account ID: `adara-crm-service` (auto-filled)
   - Click "Create and Continue"
4. Grant role: `Editor`
5. Click "Continue"
6. Click "Done"

### Step 4: Generate Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. This downloads a JSON file

### Step 5: Extract Credentials

Open the downloaded JSON file and copy:

- `private_key` (multiline string starting with `-----BEGIN PRIVATE KEY-----`)
- `client_email` (looks like `adara-crm-service@project.iam.gserviceaccount.com`)

### Step 6: Share Google Sheet

1. Open your Facebook Leads Google Sheet
2. Click "Share"
3. Paste the `client_email` value
4. Give it "Viewer" access
5. Click "Share"

### Step 7: Get Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. Copy the SHEET_ID portion

### Step 8: Update Backend .env

Edit `Backend/.env`:
```
GOOGLE_SHEETS_ID=your-sheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=adara-crm-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Important:** Make sure the GOOGLE_PRIVATE_KEY has `\n` for newlines.

### Step 9: Format Your Google Sheet

Make sure your Google Sheet has these columns in this order:
- **Column A**: Name
- **Column B**: Phone
- **Column C**: Address
- **Column D**: Status (optional)

Add test data and you're ready!

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

This installs all required packages (Express, PostgreSQL driver, JWT, etc).

### Step 2: Create .env File

```bash
cp .env.example .env
```

Edit `.env` and fill in:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/adara_crm
JWT_SECRET=your-super-secret-key-change-this-in-production
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 3: Run Database Migrations

```bash
npm run db:migrate
```

This creates the three tables:
- `admin_users` - For admin accounts
- `companies` - For companies you work with
- `leads` - For customer leads

### Step 4: Create Initial Admin User

```bash
# Generate bcrypt hash for password "admin123"
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"
```

Copy the hash output. Then connect to your database:

```bash
# Connect to database
psql -U postgres -d adara_crm

# Insert admin user (paste your hash)
INSERT INTO admin_users (email, password_hash) VALUES 
('admin@example.com', '$2a$10$...');

# Exit
\q
```

**Save these credentials!** You'll use them to login.

### Step 5: Start Backend Server

```bash
npm run dev
```

You should see:
```
Backend server running on port 5000
Google Sheets sync job started (runs every 5 minutes)
```

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd ../Frontend
npm install
```

### Step 2: Create .env File

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:3000/
```

Click the link or visit `http://localhost:3000` in your browser.

---

## Running Locally

You now have everything running! To start in the future:

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

The app runs at `http://localhost:3000`.

---

## Creating Your First Admin User

If you haven't already, create an admin account:

### Method 1: SQL (Recommended)

```bash
psql -U postgres -d adara_crm

-- Hash password with bcryptjs first
-- Use: node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('mypassword', 10))"
-- Then insert:
INSERT INTO admin_users (email, password_hash) VALUES 
('admin@example.com', '$2a$10$...');

\q
```

### Method 2: Via API (If you have curl)

```bash
# Register new admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"mypassword"}'
```

---

## Testing the Application

### 1. Login

1. Go to http://localhost:3000
2. Enter your admin email and password
3. Click "Sign In"

You should see the Admin Dashboard.

### 2. Create a Company

Since the dashboard is empty initially:

You can skip this if you just want to test with existing data.

Or create via API:

```bash
# Get your login token first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"mypassword"}'
```

Copy the `token` from the response.

```bash
# Create company (replace TOKEN)
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"My First Company"}'
```

### 3. Add Leads

Go to Admin Dashboard → Click Company → Click "Add Lead"

Fill in the form and save.

### 4. Test Google Sheets Sync

Add a new row to your Google Sheet with test data:
- Name: John Doe
- Phone: (555) 123-4567
- Address: 123 Main St

Wait 5 minutes (or click "Sync from Sheets" button) and refresh the page. The lead should appear!

### 5. Update Lead Status

Click the status dropdown on any lead and change it:
- new → attempted → contacted → sold

The database updates instantly.

---

## Deployment to Railway

### Step 1: Prepare Repository

```bash
# In root directory
git init
git add .
git commit -m "Initial Adara CRM setup"
```

### Step 2: Push to GitHub

1. Create GitHub repo
2. Push code:
   ```bash
   git remote add origin https://github.com/yourusername/adara-crm.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Select `/Backend` as the root directory
5. Add PostgreSQL plugin
6. Set environment variables:
   - Copy from your local `.env`
   - Use Railway's DATABASE_URL
7. Deploy!

### Step 4: Deploy Frontend

Option A: Deploy to Railway
1. Create new service in same project
2. Select GitHub repo
3. Set root directory to `/Frontend`
4. Set environment variable:
   - `VITE_API_URL=https://your-backend-url/api`
5. Deploy!

Option B: Deploy to Vercel (easier for React)
1. Go to https://vercel.com
2. Import your GitHub repo
3. Set root directory to `Frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend-url/api`
5. Deploy!

### Step 5: Test Live

Visit your deployed frontend URL and test:
- Login
- Create company
- Add leads
- Check Google Sheets sync

---

## Troubleshooting

### "Cannot connect to database"
- Verify DATABASE_URL is correct
- Check PostgreSQL is running (if local)
- Verify credentials are correct

### "Login fails"
- Verify admin user exists: `SELECT * FROM admin_users;` in psql
- Ensure password was hashed correctly
- Check JWT_SECRET is set

### "Google Sheets sync not working"
- Check `Backend/README.md` Google Sheets section
- Verify service account email is shared on Sheet
- Check logs: `npm run dev` shows detailed errors

### "Frontend can't reach backend"
- Verify backend is running on port 5000
- Check `VITE_API_URL` is correct in `.env`
- Check browser console for CORS errors

### "Port already in use"
- Change PORT in `.env` (default 5000)
- Or kill process: `kill -9 $(lsof -t -i:5000)`

---

## What's Next?

✅ Basic CRM setup complete!

Optional enhancements:
- [ ] Add customer login view (read-only access to their leads)
- [ ] Add lead notes/history
- [ ] Add email notifications
- [ ] Add CSV export
- [ ] Add advanced filtering
- [ ] Add API documentation
- [ ] Add comprehensive test suite

---

## Support Resources

- **Backend Details**: See `Backend/README.md`
- **Frontend Details**: See `Frontend/README.md`
- **General Info**: See main `README.md`

---

**Congratulations!** Your Adara CRM is now live and ready to manage leads. 🎉

Start by logging in, adding your company, and watching leads sync from Google Sheets automatically every 5 minutes.
