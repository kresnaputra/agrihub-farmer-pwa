# Supabase Setup untuk AgriHub (SUDAH SIAP!)

## ✅ Status: Config Sudah Siap

Supabase URL: `https://lfysdeelrqzvlmpqyfyx.supabase.co`

---

## 🚀 Langkah Terakhir (2 Menit):

### 1. Buat File .env.local
Di folder `frontend-farmer`, buat file `.env.local` dengan isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lfysdeelrqzvlmpqyfyx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_AhFz0WqHg2V5YzDNHIezAg_h_v5yDQ-
```

### 2. Run SQL Schema
1. Buka https://supabase.com/dashboard
2. Pilih project `agrihub-petani`
3. Sidebar → **SQL Editor**
4. Click **"New Query"**
5. Copy paste isi file `supabase/schema.sql` (dari repository)
6. Click **"Run"**

### 3. Aktifkan Phone Auth
1. Sidebar → **Authentication**
2. Tab **Providers**
3. Cari **"Phone"** → Toggle **Enable** ✅
4. **Optional**: Untuk production, setup Twilio. Untuk testing, cukup enable saja.

### 4. Selesai! 🎉

---

## 📱 Test Login

**Nomor:** `+6282247809247`

**Mode Testing:**
- Kalau Phone Auth di-set ke "Test OTP", OTP-nya bisa bebas (contoh: `123456`)
- Kalau pakai Twilio, OTP akan dikirim ke WhatsApp/SMS

---

## 🔐 Security Note

File `.env.local` tidak akan di-push ke GitHub (sudah di .gitignore). Ini aman untuk menyimpan API keys.

---

## 🆘 Troubleshooting

**Error: "Invalid API key"**
→ Cek apakah `.env.local` sudah dibuat dengan benar

**Error: "Database not found"**
→ Pastikan SQL schema sudah di-run di SQL Editor

**OTP tidak terkirim**
→ Cek apakah Phone Auth sudah di-enable di dashboard

---

## 📚 Dokumentasi

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/phone-login)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/installing)