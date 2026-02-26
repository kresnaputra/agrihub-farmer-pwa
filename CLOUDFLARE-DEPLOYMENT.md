# 🌐 Cloudflare Pages Deployment Guide

## 📋 Prerequisites

1. **Cloudflare Account** - Already have one (used for agency-landing.pages.dev)
2. **GitHub Repository** - Already set up: [kresnaputra/agrihub-farmer-pwa](https://github.com/kresnaputra/agrihub-farmer-pwa)
3. **Custom Domain** (Optional) - e.g., `farmer.agrihub.id`

## 🚀 Step-by-Step Deployment

### Step 1: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **"Create a project"** → **"Connect to Git"**
4. Select **GitHub** and authorize access
5. Choose repository: **`kresnaputra/agrihub-farmer-pwa`**

### Step 2: Configure Build Settings

**Important:** Use these exact settings:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | `npm run build && npm run pages:build` |
| **Build output directory** | `./vercel/output/static` |
| **Root directory** | `/` (leave empty) |

### Step 3: Environment Variables

Add these environment variables in Cloudflare Pages settings:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required for build |
| `NEXT_PUBLIC_API_URL` | `https://api.agrihub.pages.dev` | Backend API (placeholder) |
| (Optional) Analytics, etc. | | |

### Step 4: Deploy

1. Click **"Save and Deploy"**
2. Wait 3-5 minutes for build to complete
3. Your app will be live at: `https://agrihub-farmer-pwa.pages.dev`

## 🔧 Custom Domain Setup (Optional)

1. After deployment, go to project **Settings** → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain (e.g., `farmer.agrihub.id`)
4. Follow DNS verification steps
5. Wait for SSL certificate issuance (automatic)

## 📊 GitHub Actions Auto-Deploy (Alternative)

If you prefer automated deployments:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `CF_API_TOKEN`: Cloudflare API token
   - `CF_ACCOUNT_ID`: Your Cloudflare account ID
   - `NEXT_PUBLIC_API_URL`: Backend API URL
3. Push to `main` branch will trigger auto-deploy

**To get Cloudflare API token:**
1. Cloudflare Dashboard → **My Profile** → **API Tokens**
2. Click **"Create Token"**
3. Use template: **"Edit Cloudflare Workers"**
4. Add permissions: `Account.Workers Scripts:Edit`, `Account.Workers KV Storage:Edit`
5. Copy token and add to GitHub Secrets

## 🛠️ Manual Build & Deploy

```bash
# Clone repository
git clone https://github.com/kresnaputra/agrihub-farmer-pwa
cd agrihub-farmer-pwa

# Install dependencies
npm install

# Build for Cloudflare Pages
npm run build
npm run pages:build

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy manually
wrangler pages deploy ./vercel/output/static --project-name=agrihub-farmer-pwa
```

## 🔍 Verification

After deployment, verify:

1. **PWA Installation**: Visit site on mobile → "Add to Home Screen"
2. **Offline Mode**: Turn off internet, reload page
3. **Service Worker**: Check DevTools → Application → Service Workers
4. **Manifest**: Check `/manifest.json`
5. **Health Check**: Visit `/api/health` (backend dependent)

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Check `npm install` completed successfully
- Check environment variables are set

### PWA Not Installable
- Ensure site served over HTTPS
- Check `manifest.json` is accessible
- Verify service worker is registered

### Offline Mode Not Working
- Service worker might not be caching properly
- Check `next-pwa` configuration
- Verify `public/sw.js` exists

### Custom Domain Not Working
- DNS propagation can take 24-48 hours
- Verify DNS records in Cloudflare
- Check SSL certificate status

## 📞 Support

- **GitHub Issues**: [Report bugs/features](https://github.com/kresnaputra/agrihub-farmer-pwa/issues)
- **Cloudflare Support**: [Documentation](https://developers.cloudflare.com/pages/)
- **Next.js on Cloudflare**: [Adapter Docs](https://github.com/cloudflare/next-on-pages)

## 🎉 Success Indicators

✅ **Build passes** in Cloudflare Pages dashboard  
✅ **Site loads** at provided URL  
✅ **PWA manifest** detected by browser  
✅ **Service worker** registered  
✅ **Custom domain** resolves (if configured)  
✅ **HTTPS/SSL** certificate issued  

---

*Deployment completed successfully for agency-landing.pages.dev using similar steps.*