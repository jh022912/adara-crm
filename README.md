# Adara CRM - Complete Lead Management System

Full-stack CRM application for managing leads from Facebook ads with real-time Google Sheets integration.

## 🚀 Quick Start

### Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your database and Google Sheets credentials
npm run db:migrate
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📋 Features

✅ **Admin Authentication** - Secure login with JWT tokens
✅ **Multi-Company Support** - Manage multiple companies from one dashboard
✅ **Lead Management** - View, create, update, delete leads
✅ **Status Tracking** - Track lead status: new → attempted → contacted → sold
✅ **Google Sheets Sync** - Automatic sync of leads from Google Sheets every 5 minutes
✅ **Responsive Design** - Mobile-friendly interface matching Adara's aesthetic
✅ **PostgreSQL Database** - Robust, scalable database
✅ **REST API** - Complete API for all operations

## 🏗️ Architecture

### Backend (Node.js/Express)
- REST API with authentication middleware
- PostgreSQL database with migrations
- Google Sheets API integration with node-cron scheduler
- JWT-based authentication
- CORS enabled for frontend

### Frontend (React + Vite)
- Single-page application with React Router
- Tailwind CSS for responsive styling
- Axios for API calls
- React Context for state management
- Modal forms for creating/editing leads

### Database (PostgreSQL)
```sql
admin_users (id, email, password_hash)
companies (id, name, created_at)
leads (id, company_id, name, phone, address, status, created_at, updated_at)
```

## 🔧 Configuration Steps

### 1. Database Setup

**Option A: Local PostgreSQL**
```bash
createdb adara_crm
# Update Backend/.env with: DATABASE_URL=postgresql://user:password@localhost:5432/adara_crm
```

**Option B: Railway PostgreSQL**
- Create Railway account and project
- Add PostgreSQL plugin
- Copy DATABASE_URL to `.env`

### 2. Create Admin User

Connect to your database and run:
```sql
-- Hash "password123" with bcryptjs first, then:
INSERT INTO admin_users (email, password_hash) VALUES 
('admin@example.com', '$2a$10$...');
```

Or use this quick command:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10))"
```

### 3. Google Sheets API Setup (CRITICAL!)

This is required for the sync to work. Follow the detailed guide in `Backend/README.md`:

1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account and download JSON
4. Share your Google Sheet with service account email
5. Add credentials to `Backend/.env`:
   ```
   GOOGLE_SHEETS_ID=your-sheet-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=your-private-key
   ```

6. Format your Google Sheet with columns:
   - Column A: Name
   - Column B: Phone
   - Column C: Address
   - Column D: Status (optional)

## 🚀 Deployment to Railway

### Prerequisites
- GitHub account with this repo
- Railway account (railway.app)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy Backend**
   - Create new project in Railway
   - Connect GitHub repo
   - Add PostgreSQL plugin
   - Set environment variables in Railway dashboard
   - Deploy!

3. **Deploy Frontend**
   - Either deploy to Railway as static site
   - Or use Vercel for easier React deployment
   - Set `VITE_API_URL` to deployed backend URL

4. **Verify**
   - Visit frontend URL
   - Login with admin credentials
   - Verify Google Sheets sync is working

## 📚 File Structure

```
Adara CRM/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── jobs/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── README.md (this file)
```

## 🔐 Security Notes

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens for stateless authentication
- CORS configured for frontend origin only
- Google API credentials never committed to git (use .env)
- All sensitive routes protected with `authenticateToken` middleware

## 🐛 Troubleshooting

### Google Sheets sync not working
- Verify service account email is shared on Google Sheet
- Check GOOGLE_SHEETS_ID is correct
- Ensure GOOGLE_PRIVATE_KEY format is correct (include \n)
- Check backend logs for errors

### Login fails
- Verify admin user exists in database
- Confirm password is hashed correctly
- Check JWT_SECRET is set in .env

### Frontend can't reach backend
- Ensure backend is running on correct port
- Verify VITE_API_URL in frontend .env is correct
- Check CORS is enabled in backend

### Database connection errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running (if local)
- Check migrations have been run: `npm run db:migrate`

## 📞 Support

For issues, check:
1. Backend README.md for backend-specific setup
2. Frontend README.md for frontend-specific setup
3. Backend logs with `npm run dev`
4. Browser console for frontend errors

## 📝 Next Enhancements

- [ ] Customer login view (read-only)
- [ ] Advanced filtering and sorting
- [ ] Lead history/notes
- [ ] Email notifications
- [ ] CSV export
- [ ] API rate limiting
- [ ] Input validation improvements
- [ ] Test suite
- [ ] Dashboard with analytics
- [ ] Two-factor authentication

## ✨ Styling

The application uses **Adara's design aesthetic**:
- Serif fonts (Georgia)
- Dark navy (#001f3f) and white color scheme
- Minimal, professional look
- Clean spacing and typography
- Responsive design for all devices

## 📄 License

Built for Adara CRM. All rights reserved.

---

**Ready to start?**

1. Complete the setup steps above
2. Start both backend and frontend
3. Navigate to http://localhost:3000
4. Login with your admin credentials
5. Add a company and start managing leads!

Questions? Check the Backend and Frontend README files for detailed guides.
