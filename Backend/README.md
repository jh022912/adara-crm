# Adara CRM - Backend

Node.js/Express backend API for the Adara CRM application.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
- Install PostgreSQL locally
- Create a database: `createdb adara_crm`
- Update `.env` with your local database URL

#### Option B: Railway PostgreSQL
- Create a Railway project
- Add PostgreSQL plugin
- Copy DATABASE_URL to `.env`

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in:
```bash
cp .env.example .env
```

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret key for JWT signing
- `GOOGLE_SHEETS_ID` - Your Google Sheet ID
- `FRONTEND_URL` - URL where frontend runs (for CORS)

### 4. Run Migrations
```bash
npm run db:migrate
```

This creates the necessary tables: `admin_users`, `companies`, `leads`.

### 5. Create Admin User
You'll need to create an initial admin user. You can do this manually:

```sql
-- Connect to your database and run:
INSERT INTO admin_users (email, password_hash) VALUES ('admin@example.com', '$2a$10$...'); -- use bcrypt hash
```

Or create a seeding script later.

### 6. Google Sheets API Setup (Important!)

The app needs to sync leads from Google Sheets. Follow these steps:

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project named "Adara CRM"

2. **Enable Google Sheets API:**
   - In the Cloud Console, search for "Google Sheets API"
   - Click "Enable"

3. **Create a Service Account:**
   - Go to "Service Accounts" in the left menu
   - Click "Create Service Account"
   - Name: "adara-crm-service"
   - Click "Create and Continue"
   - Grant it "Editor" role
   - Click "Continue"
   - Click "Done"

4. **Get Credentials:**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - This downloads a JSON file with your credentials

5. **Configure Backend:**
   - Open the downloaded JSON file
   - Copy the `private_key` (multiline string)
   - Copy the `client_email`
   - Add to `.env`:
     ```
     GOOGLE_SERVICE_ACCOUNT_EMAIL=adara-crm-service@project.iam.gserviceaccount.com
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     GOOGLE_SHEETS_ID=your-sheet-id-here
     ```

6. **Share Your Google Sheet:**
   - Open your Facebook Leads Google Sheet
   - Click "Share"
   - Paste the service account email
   - Give it "Viewer" access
   - Click "Share"

7. **Get Sheet ID:**
   - Your sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Add it to `.env` as `GOOGLE_SHEETS_ID`

8. **Set Up Sheet Columns:**
   - Make sure your Google Sheet has these columns (in order):
   - Column A: Name
   - Column B: Phone
   - Column C: Address
   - Column D: Status (optional)

### 7. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new admin user

### Companies
- `GET /api/companies` - List all companies (protected)
- `GET /api/companies/:id` - Get company by ID (protected)
- `POST /api/companies` - Create company (protected)
- `PATCH /api/companies/:id` - Update company (protected)
- `DELETE /api/companies/:id` - Delete company (protected)

### Leads
- `GET /api/leads/company/:companyId` - Get leads for company (protected)
- `GET /api/leads/:id` - Get single lead (protected)
- `POST /api/leads` - Create new lead (protected)
- `PATCH /api/leads/:id` - Update lead (protected)
- `DELETE /api/leads/:id` - Delete lead (protected)

### Sync
- `POST /api/sync/leads` - Manually trigger Google Sheets sync (protected)

## Architecture

- **Express** - HTTP server
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **node-cron** - Background jobs for Google Sheets sync
- **Google Sheets API** - Read leads from Google Sheets every 5 minutes
- **bcryptjs** - Password hashing

## Deployment to Railway

1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Add PostgreSQL plugin in Railway
4. Set environment variables in Railway dashboard
5. Deploy!

See Railway docs for detailed instructions.

## Troubleshooting

**Google Sheets sync not working:**
- Check that service account email has access to the Sheet
- Verify `GOOGLE_SHEETS_ID` is correct
- Check server logs for errors

**Database connection issues:**
- Verify DATABASE_URL is correct
- Make sure migrations have run
- Check PostgreSQL is running (if local)

**Authentication errors:**
- Ensure admin user exists in database
- Check JWT_SECRET is set

## Next Steps

- Frontend integration
- Add more validations
- Error handling improvements
- Testing suite
