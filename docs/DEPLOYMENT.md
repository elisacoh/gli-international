# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- [ ] Supabase account and project created
- [ ] Vercel account (for frontend)
- [ ] Railway/Render account (for backend)
- [ ] Domain name (optional but recommended)
- [ ] Bank of Georgia API credentials (for payments)
- [ ] Google OAuth credentials (for social login)
- [ ] Apple Developer account (for Apple login)

## Supabase Setup

### 1. Create Project

1. Visit [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. Enter project details:
   - Name: GLI International
   - Database password: Generate a strong password
   - Region: Choose closest to your users

### 2. Set up Database

1. Go to SQL Editor
2. Copy contents of `database/schema.sql`
3. Paste and execute in SQL Editor
4. Verify tables created successfully

### 3. Configure Authentication

**Enable Email Authentication:**
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)

**Enable Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. Paste in Supabase Authentication > Providers > Google

**Enable Apple OAuth:**
1. Go to [Apple Developer](https://developer.apple.com)
2. Create Service ID
3. Configure Sign in with Apple
4. Add redirect URI:
   - `https://your-project.supabase.co/auth/v1/callback`
5. Copy credentials to Supabase

### 4. Set up Storage

Run in SQL Editor:

```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('formations', 'formations', true),
  ('profiles', 'profiles', true),
  ('content', 'content', true);

-- Set up RLS policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('formations', 'profiles', 'content'));

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('formations', 'profiles', 'content')
  AND auth.role() = 'authenticated'
);
```

### 5. Get API Keys

1. Go to Project Settings > API
2. Copy:
   - Project URL
   - Anon (public) key
   - Service role key (keep secret!)

## Backend Deployment (Railway)

### 1. Prepare for Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Deploy to Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Select backend folder as root
6. Configure environment variables (see below)
7. Deploy

### 3. Environment Variables

Add these in Railway dashboard:

```env
# Database
DATABASE_URL=postgresql://[from-supabase]
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Security
SECRET_KEY=generate-a-secure-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Bank of Georgia
BOG_CLIENT_ID=your-bog-client-id
BOG_CLIENT_SECRET=your-bog-client-secret
BOG_API_URL=https://api.bog.ge
BOG_OAUTH_URL=https://oauth.bog.ge/oauth2/token
BOG_MERCHANT_ID=your-merchant-id
BOG_CALLBACK_URL=https://your-api.railway.app/api/v1/payments/callback

# App
DEBUG=False
ENVIRONMENT=production
```

### 4. Custom Domain (Optional)

1. In Railway, go to Settings
2. Add custom domain
3. Update DNS records as instructed

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

Ensure your `frontend/package.json` has:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### 2. Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Environment Variables

Add in Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_DEFAULT_LOCALE=fr
NEXT_PUBLIC_APP_NAME=GLI International
```

### 4. Custom Domain

1. In Vercel, go to Project Settings > Domains
2. Add your domain
3. Update DNS records:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

### 5. Configure Redirects (Optional)

Create `frontend/vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/fr",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Post-Deployment

### 1. Verify Backend

Visit `https://your-api.railway.app/health`

Should return:
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

### 2. Verify Frontend

Visit your domain and check:
- [ ] Pages load correctly
- [ ] Internationalization works (/fr, /en, /ka)
- [ ] Authentication flows work
- [ ] Images load from Supabase Storage

### 3. Test Critical Flows

1. **User Registration**
   - Register new user
   - Check email verification
   - Verify user in Supabase Auth

2. **Formation Browsing**
   - View formations
   - Switch languages
   - Check images load

3. **Admin Access**
   - Create admin user in Supabase:
   ```sql
   UPDATE public.user_profiles
   SET role = 'admin'
   WHERE id = 'user-id-from-auth';
   ```
   - Login as admin
   - Access admin dashboard

## CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Run frontend tests
        run: cd frontend && npm test

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install backend dependencies
        run: cd backend && pip install -r requirements.txt

      - name: Run backend tests
        run: cd backend && pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        # Vercel auto-deploys on push
        run: echo "Frontend deployed automatically by Vercel"

      - name: Deploy to Railway
        # Railway auto-deploys on push
        run: echo "Backend deployed automatically by Railway"
```

## Monitoring Setup

### 1. Supabase Monitoring

1. Go to Supabase Dashboard > Reports
2. Monitor:
   - API requests
   - Database performance
   - Storage usage

### 2. Application Monitoring (Optional)

**Sentry Integration:**

Frontend (`frontend/src/app/layout.tsx`):
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

Backend (`backend/app/main.py`):
```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("ENVIRONMENT"),
)
```

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups (on paid plans).

For manual backups:

```bash
# Set up Supabase CLI
supabase db dump -f backup.sql
```

### Configuration Backups

Keep environment variables documented and backed up securely.

## Rollback Procedure

### Frontend Rollback (Vercel)

1. Go to Vercel Dashboard
2. Select Deployments
3. Find previous successful deployment
4. Click "Promote to Production"

### Backend Rollback (Railway)

1. Go to Railway Dashboard
2. Select Deployments
3. Click on previous deployment
4. Click "Rollback"

## Troubleshooting

### Backend not connecting to database

- Check DATABASE_URL is correct
- Verify Supabase IP allowlist (should allow all for Railway)
- Check Railway logs: `railway logs`

### CORS errors

- Verify ALLOWED_ORIGINS includes your frontend domain
- Check both http:// and https://
- Include www and non-www versions

### Authentication not working

- Verify Supabase URL and keys
- Check redirect URLs in OAuth providers
- Ensure cookies are not blocked

### Images not loading

- Check Supabase Storage buckets are public
- Verify CORS settings in Storage
- Check image URLs are correct

## Security Checklist

- [ ] Environment variables set correctly
- [ ] Service role key kept secret (backend only)
- [ ] HTTPS enabled on all domains
- [ ] RLS policies enabled and tested
- [ ] CORS configured properly
- [ ] Rate limiting enabled (Railway/Vercel)
- [ ] Secrets in GitHub are encrypted
- [ ] Database backups enabled
- [ ] Monitoring and alerting set up

## Performance Optimization

1. **Enable Vercel Edge Network**
   - Images served via CDN
   - Static pages cached globally

2. **Enable Supabase Connection Pooling**
   - Use connection pool mode
   - Reduces database connections

3. **Optimize Images**
   - Use Next.js Image component
   - Enable Supabase image transformations

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Monitor disk space

**Monthly:**
- Review and update dependencies
- Check for security updates
- Analyze usage patterns

**Quarterly:**
- Review and optimize database queries
- Audit user permissions
- Review backup strategy
