# 🚀 Deploying to Netlify - Complete Guide

## ✨ New Simplified Architecture

**Good news!** You don't need a separate backend server anymore. Everything runs on Netlify:

```
┌─────────────────────────────────────────┐
│          Netlify (All-in-One)           │
├─────────────────────────────────────────┤
│  Frontend (Next.js)                     │
│  Netlify Functions (TypeScript)         │
│    ├─ validate-promo-code              │
│    ├─ record-promo-usage               │
│    ├─ submit-booking (emails)          │
│    └─ promo-codes (admin CRUD)         │
└─────────────────────────────────────────┘
                 ↓
         ┌──────────────┐
         │   Supabase   │
         │  (Database)  │
         └──────────────┘
```

## 📋 Prerequisites

- [x] GitHub account with your repository
- [x] Netlify account (free tier is fine)
- [x] Supabase project already set up
- [x] Resend account for emails (optional)

---

## Step 1: Prepare Your Environment Variables

You'll need these from Supabase dashboard (https://supabase.com/dashboard):

### Required Environment Variables

```bash
# Supabase (get from Supabase dashboard → Settings → API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email (optional - get from Resend.com)
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=contact@gli-international.com
FROM_EMAIL=noreply@gli-international.com
```

---

## Step 2: Deploy to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. **Go to [Netlify](https://app.netlify.com)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub** and select your `gli-international` repository

4. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/.next`
   - **Functions directory:** `frontend/netlify/functions`

5. **Add Environment Variables** (Site configuration → Environment variables):

   Click "Add variable" for each one:
   ```
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_ANON_KEY = eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY = eyJxxx...
   RESEND_API_KEY = re_xxxxx
   ADMIN_EMAIL = contact@gli-international.com
   FROM_EMAIL = noreply@gli-international.com
   ```

6. **Click "Deploy site"** 🚀

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your repository (run from project root)
netlify link

# Set environment variables
netlify env:set SUPABASE_URL "https://xxxxx.supabase.co"
netlify env:set SUPABASE_ANON_KEY "eyJxxx..."
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJxxx..."
netlify env:set RESEND_API_KEY "re_xxxxx"
netlify env:set ADMIN_EMAIL "contact@gli-international.com"
netlify env:set FROM_EMAIL "noreply@gli-international.com"

# Deploy
netlify deploy --prod
```

---

## Step 3: Configure Custom Domain (Optional)

1. **In Netlify Dashboard → Domain settings**

2. **Add custom domain:** `gli-international.com`

3. **Follow DNS configuration instructions:**
   - Add A record or CNAME to your domain registrar
   - Netlify will automatically provision SSL certificate

4. **Wait for DNS propagation** (can take up to 48 hours, usually much faster)

---

## Step 4: Verify Deployment

### Test Functions

```bash
# Test promo code validation
curl -X POST https://gli-international.com/.netlify/functions/validate-promo-code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "amount": 100
  }'

# Expected response:
# {
#   "is_valid": true,
#   "promo_id": "uuid...",
#   "discount_type": "percentage",
#   "discount_value": 10,
#   "discount_amount": 10,
#   "final_amount": 90
# }
```

### Test Booking Submission

```bash
curl -X POST https://gli-international.com/.netlify/functions/submit-booking \
  -H "Content-Type: application/json" \
  -d '{
    "seminarTitle": "Test Formation",
    "destination": "Tbilisi",
    "tripDates": "01/06/2026 - 07/06/2026",
    "participantsCount": 1,
    "pricePerPerson": 1000,
    "totalAmount": 1000,
    "currency": "EUR",
    "participants": [{
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "+33600000000",
      "profession": "Developer"
    }]
  }'
```

### Check Function Logs

1. Go to **Netlify Dashboard → Functions**
2. Click on a function to see logs
3. Check for any errors

---

## Step 5: Database Migrations (If Not Done)

Make sure all Supabase migrations are applied:

1. Go to **Supabase Dashboard → SQL Editor**

2. Run these migrations in order:
   ```sql
   -- 1. Promo codes table
   -- File: database/migrations/20251211_add_promo_codes.sql

   -- 2. Add owner field
   -- File: database/migrations/005_add_owner_to_promo_codes.sql

   -- 3. Public validation function
   -- File: database/migrations/006_public_promo_code_validation.sql

   -- 4. Record usage function
   -- File: database/migrations/007_record_promo_code_usage.sql
   ```

3. Verify tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('promo_codes', 'promo_code_usage');
   ```

---

## 🧪 Local Development

### Test Functions Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Create .env file in root
cat > .env << EOF
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=test@example.com
FROM_EMAIL=noreply@example.com
EOF

# Start local dev server with functions
cd frontend
netlify dev

# Functions available at:
# http://localhost:8888/.netlify/functions/validate-promo-code
# http://localhost:8888/.netlify/functions/submit-booking
```

### Test with curl

```bash
# From another terminal
curl -X POST http://localhost:8888/.netlify/functions/validate-promo-code \
  -H "Content-Type: application/json" \
  -d '{"code": "TEST2024", "amount": 100}'
```

---

## 🔍 Troubleshooting

### Functions Return 404

**Problem:** `POST /.netlify/functions/validate-promo-code 404 (Not Found)`

**Solution:**
1. Check `netlify.toml` functions directory matches actual location
2. Verify functions are in `frontend/netlify/functions/`
3. Check build logs for TypeScript compilation errors
4. Redeploy the site

### "Missing SUPABASE_URL environment variable"

**Problem:** Functions fail with environment variable errors

**Solution:**
1. Go to Netlify Dashboard → Site configuration → Environment variables
2. Ensure all variables are set
3. Redeploy (changing env vars requires redeploy)

### Promo Code Validation Fails

**Problem:** Code exists but validation returns "invalid"

**Solution:**
1. Check Supabase logs: Dashboard → Logs → Postgres Logs
2. Verify RPC function exists:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'validate_promo_code';
   ```
3. Check if code is active:
   ```sql
   SELECT * FROM promo_codes WHERE UPPER(code) = 'YOUR_CODE';
   ```
4. Verify permissions:
   ```sql
   -- Should return rows
   SELECT * FROM information_schema.routine_privileges
   WHERE routine_name = 'validate_promo_code';
   ```

### Email Not Sending

**Problem:** Booking submission succeeds but no email received

**Solution:**
1. Check Resend dashboard: https://resend.com/emails
2. Verify `RESEND_API_KEY` is set correctly
3. Check function logs in Netlify
4. Verify `FROM_EMAIL` domain is verified in Resend

### CORS Errors

**Problem:** `Access-Control-Allow-Origin` errors in browser console

**Solution:**
- Functions already have CORS headers in `_lib/response.ts`
- If still seeing errors, check browser console for actual error
- May need to add specific origins instead of `*`

---

## 📊 Monitoring & Logs

### Netlify Function Logs

1. **Dashboard → Functions**
2. Click on function name
3. View real-time logs

### Supabase Logs

1. **Dashboard → Logs**
2. **Postgres Logs** - Database queries
3. **API Logs** - API calls

### Resend Logs

1. **Dashboard → Emails**
2. See all sent emails
3. Check delivery status

---

## 🔐 Security Checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` is set as environment variable (not in code)
- [x] `RESEND_API_KEY` is set as environment variable
- [x] RLS policies enabled on Supabase tables
- [x] Functions validate all inputs
- [x] CORS configured properly
- [x] HTTPS enabled (automatic with Netlify)

---

## 💰 Cost Breakdown

### Netlify (Free Tier)
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ 125K function requests/month
- ✅ Unlimited sites
- ✅ Free SSL
- ✅ Free CDN

### Supabase (Free Tier)
- ✅ 500MB database
- ✅ 5GB bandwidth
- ✅ 50K monthly active users
- ✅ Unlimited API requests

### Resend (Free Tier)
- ✅ 3,000 emails/month
- ✅ 100 emails/day

**Total Cost: $0/month** (with free tiers) 🎉

---

## 🚀 Going to Production

### Before Launch Checklist

- [ ] All environment variables set in Netlify
- [ ] Custom domain configured and SSL active
- [ ] At least one test promo code created in Supabase
- [ ] Test promo code validation on production
- [ ] Test booking submission on production
- [ ] Verify emails are received
- [ ] Check all functions logs for errors
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (Performance, SEO, Accessibility)

### Post-Launch Monitoring

1. **Set up Netlify alerts:**
   - Site configuration → Notifications
   - Get notified of deploy failures

2. **Monitor function usage:**
   - Dashboard → Functions → Usage
   - Watch for approaching limits

3. **Check Supabase dashboard daily:**
   - Database size
   - API requests
   - Any errors in logs

4. **Set up uptime monitoring:**
   - Use [UptimeRobot](https://uptimerobot.com/) (free)
   - Monitor main site and functions

---

## 📚 Additional Resources

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Resend Email Guide](https://resend.com/docs/introduction)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎯 Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying GLI International to Netlify..."

# Check if logged in
if ! netlify status > /dev/null 2>&1; then
    echo "Please login to Netlify first:"
    netlify login
fi

# Build
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Deploy
echo "🚀 Deploying..."
cd ..
netlify deploy --prod

echo "✅ Deployment complete!"
echo "Check your site at: https://gli-international.com"
```

Run with: `bash deploy.sh`

---

## ❓ Need Help?

1. Check function logs in Netlify
2. Check database logs in Supabase
3. Search [Netlify Forums](https://answers.netlify.com/)
4. Check project documentation in `/docs`

---

**Happy Deploying! 🎉**