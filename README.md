# 🌾 AgriHub Farmer PWA

**Platform digital untuk petani Indonesia** - Jual hasil panen langsung ke pembeli, pantau harga pasar, dan kelola pesanan dengan mudah.

## ✨ Features

- 📱 **PWA (Progressive Web App)** - Installable seperti aplikasi native
- 📴 **Offline-first** - Bekerja tanpa koneksi internet
- 📊 **Dashboard real-time** - Statistik produk, pesanan, pendapatan
- 📈 **Harga pasar** - Update harga komoditas pertanian
- 🛒 **Marketplace** - Jual dan beli produk pertanian
- 🔔 **Notifikasi** - Update pesanan dan transaksi
- 📱 **Responsive** - Optimal untuk mobile & desktop

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# Build for Cloudflare Pages
npm run pages:build

# Preview locally
npm run preview
```

## ☁️ Deployment

### Cloudflare Pages (Recommended)
1. **Connect GitHub repo** to Cloudflare Pages dashboard
2. **Configure build settings:**
   - Build command: `npm run build && npm run pages:build`
   - Build output directory: `./vercel/output/static`
   - Root directory: `/`
3. **Add environment variables:**
   - `NEXT_PUBLIC_API_URL`: Backend API URL
4. **Deploy!**

### Manual Deployment via GitHub Actions
1. Add secrets to GitHub repository:
   - `CF_API_TOKEN`: Cloudflare API token
   - `CF_ACCOUNT_ID`: Cloudflare account ID
   - `NEXT_PUBLIC_API_URL`: Backend API URL
2. Push to `main` branch triggers auto-deploy

## 🔧 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa (Service Workers, Manifest)
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages + @cloudflare/next-on-pages
- **Backend**: Express.js + PostgreSQL + Redis (separate repo)

## 📁 Project Structure

```
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with PWA config
│   └── page.tsx           # Farmer dashboard (main page)
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   └── pwa/              # PWA-related components
├── public/                # Static assets
│   ├── icons/            # PWA icons (multiple sizes)
│   ├── screenshots/      # App screenshots
│   ├── manifest.json     # PWA manifest
│   ├── _headers          # Cloudflare headers
│   └── _redirects        # URL redirects
├── next.config.js        # Next.js + PWA config
└── package.json          # Dependencies & scripts
```

## 📱 PWA Features

- **Installable**: Add to home screen (Android/iOS)
- **Offline**: Service worker caches core assets
- **Push Notifications**: Coming soon
- **Background Sync**: Coming soon
- **App Shortcuts**: Quick actions from home screen

## 🔐 Environment Variables

Create `.env.local` for development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

Proprietary - All rights reserved AgriHub 2026

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/kresnaputra/agrihub-farmer-pwa/issues)
- **Email**: hello@agrihub.id
- **Website**: https://agrihub.pages.dev

---

*Built with ❤️ for Indonesian farmers*