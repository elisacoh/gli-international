# Quick Start Guide

Get the GLI International platform running locally in under 15 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.11+ ([Download](https://www.python.org/))
- Git ([Download](https://git-scm.com/))
- Supabase account (free tier works)

## Step 1: Supabase Setup (5 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Note down your project URL and API keys

2. **Set up Database**
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `database/schema.sql`
   - Paste and execute

3. **Enable Authentication**
   - Go to Authentication > Providers
   - Enable Email provider
   - (Optional) Configure Google/Apple OAuth

## Step 2: Frontend Setup (3 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## Step 3: Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=your-supabase-connection-string
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-service-role-key
# SECRET_KEY=generate-a-random-secret-key

# Start development server
uvicorn app.main:app --reload
```

Backend API will be available at: http://localhost:8000

## Step 4: Verify Installation

### Check Backend
Visit http://localhost:8000/health

Should return:
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

### Check Frontend
1. Visit http://localhost:3000
2. You should see the homepage
3. Try switching languages: `/fr`, `/en`, `/ka`

### API Documentation
Visit http://localhost:8000/docs for interactive API documentation

## Step 5: Create Admin User

Run in Supabase SQL Editor:

```sql
-- First, register a user via the frontend
-- Then, promote them to admin:

UPDATE public.user_profiles
SET role = 'admin'
WHERE id = 'your-user-id-from-auth-users-table';
```

## Next Steps

### Add Sample Formation

Use the admin interface or run in SQL Editor:

```sql
INSERT INTO public.formations (
    title,
    description,
    short_description,
    price,
    currency,
    duration_hours,
    level,
    category,
    is_published
) VALUES (
    '{"fr": "Formation Test", "en": "Test Formation", "ka": "ტესტ ტრენინგი"}',
    '{"fr": "Description complète", "en": "Full description", "ka": "სრული აღწერა"}',
    '{"fr": "Courte description", "en": "Short description", "ka": "მოკლე აღწერა"}',
    99.99,
    'GEL',
    10,
    'beginner',
    'general-medicine',
    true
);
```

### Development Workflow

**Frontend Changes:**
- Edit files in `frontend/src/`
- Changes hot-reload automatically
- Check browser console for errors

**Backend Changes:**
- Edit files in `backend/app/`
- Server reloads automatically (--reload flag)
- Check terminal for errors

**Database Changes:**
- Make changes in Supabase SQL Editor
- Or use Alembic migrations (see docs)

## Common Issues

### Port already in use

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

**Backend (8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill
```

### Module not found errors

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Backend:**
```bash
pip install -r requirements.txt --force-reinstall
```

### Database connection errors

- Check DATABASE_URL is correct
- Verify Supabase project is running
- Check network connectivity
- Try using connection pooler URL from Supabase

### CORS errors

- Ensure ALLOWED_ORIGINS in backend includes `http://localhost:3000`
- Check API_URL in frontend points to `http://localhost:8000`

## Useful Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

### Backend
```bash
uvicorn app.main:app --reload          # Start dev server
pytest                                  # Run tests
pytest --cov=app                       # Run tests with coverage
black .                                 # Format code
flake8 .                               # Lint code
```

## Project Structure Reference

```
gli-international/
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/       # Pages and routes
│   │   ├── components/# React components
│   │   ├── lib/       # Utilities
│   │   └── types/     # TypeScript types
│   └── messages/      # Translation files
│
├── backend/           # FastAPI application
│   └── app/
│       ├── api/       # API endpoints
│       ├── core/      # Core functionality
│       ├── models/    # Database models
│       ├── schemas/   # Pydantic schemas
│       └── services/  # Business logic
│
├── database/          # Database schema and docs
└── docs/             # Documentation
```

## Getting Help

1. Check the [main README](README.md)
2. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. Read [API documentation](http://localhost:8000/docs)
4. Check [Supabase docs](https://supabase.com/docs)
5. Review [Next.js docs](https://nextjs.org/docs)
6. Check [FastAPI docs](https://fastapi.tiangolo.com/)

## Ready to Deploy?

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment instructions.

Happy coding!
