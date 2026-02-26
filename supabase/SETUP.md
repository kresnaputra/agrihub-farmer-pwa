# Setup Supabase untuk AgriHub

## 🚀 Quick Setup (5 Menit)

### 1. Buat Project Supabase
1. Buka https://supabase.com
2. Sign up dengan email kamu
3. Click **"New Project"**
4. Isi detail:
   - **Name:** `agrihub-petani`
   - **Database Password:** `D3@dp00l`
   - **Region:** Singapore (Southeast Asia)
5. Click **"Create Project"**
6. Tunggu 1-2 menit sampai project ready

### 2. Ambil API Keys
Setelah project ready:
1. Dashboard → Project Settings (icon gear)
2. Tab **"API"**
3. Copy:
   - `URL` (contoh: https://xxxxx.supabase.co)
   - `anon public` API key

### 3. Setup Environment Variables
Buat file `.env.local` di root project:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### 4. Run Database Schema
1. Dashboard → **SQL Editor** (sidebar)
2. Click **"New Query"**
3. Copy paste isi file `supabase/schema.sql`
4. Click **"Run"**

### 5. Aktifkan Phone Auth
1. Dashboard → **Authentication** (sidebar)
2. Tab **"Providers"**
3. Find **"Phone"** → Click Enable ✅
4. Provider pilih **"Twilio"** atau **"MessageBird"**
5. Untuk testing, bisa pakai "Test OTP" tanpa Twilio

### 6. Install Supabase di Project
```bash
cd frontend-farmer
npm install @supabase/supabase-js
```

### 7. Selesai! 🎉
Project sudah siap pakai Supabase!

---

## 📱 Test Phone Auth

Gunakan nomor: `+6282247809247`
OTP Test: `123456` (kalau mode test)

---

## 🔗 Resources

- Supabase Docs: https://supabase.com/docs
- Phone Auth: https://supabase.com/docs/guides/auth/phone-login
- JavaScript Client: https://supabase.com/docs/reference/javascript/installing