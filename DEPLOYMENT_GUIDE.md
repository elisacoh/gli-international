# Deployment Guide - GLI International

## 1. Create GitHub Repository

### Option A: Via GitHub Website
1. Go to https://github.com/new
2. Repository name: `gli-international`
3. Description: `GLI International - Medical Training Platform`
4. Make it **Private** (recommended) or Public
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Option B: Via GitHub CLI (if installed)
```bash
gh repo create gli-international --private --source=. --remote=origin --push
```

## 2. Push Code to GitHub

After creating the repository on GitHub, run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gli-international.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

## 3. Deploy to Netlify

### Step 1: Install Netlify Plugin (if needed)
```bash
cd frontend
npm install -D @netlify/plugin-nextjs
```

### Step 2: Deploy via Netlify Website

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub account
5. Select the `gli-international` repository
6. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
   - **Node version**: 18
7. Add environment variables (if needed):
   - `NEXT_PUBLIC_SUPABASE_URL` (when ready)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (when ready)
8. Click "Deploy site"

### Step 3: Configure Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: `gli-international.com`
3. Configure DNS with your domain provider
4. Netlify will automatically provision SSL certificate

## 4. Automatic Deployments

Netlify will automatically deploy when you push to the main branch:

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main
```

## 5. Preview Deployments

Every pull request will get a preview deployment URL for testing before merging.

## Environment Variables

Add these in Netlify dashboard under "Site settings" → "Environment variables":

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Build fails on Netlify
- Check Node version is set to 18
- Ensure `@netlify/plugin-nextjs` is in package.json
- Check build logs for specific errors

### Routing issues
- Verify `netlify.toml` is in the root directory
- Check redirect rules are properly configured

### Environment variables not working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
- Redeploy after adding environment variables

## Support

For issues with deployment, check:
- Netlify Status: https://www.netlifystatus.com/
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/
