# Setup Twilio WhatsApp Edge Function

## 🚀 Overview

Edge Function ini mengirim OTP via WhatsApp menggunakan **Twilio API langsung**, dengan template yang sudah kamu buat.

## 📋 Prerequisites

✅ Template WhatsApp sudah dibuat (Content SID: `HX57469e9f7ed15c2c347dece7fd851e09`)  
✅ Twilio Account SID, Auth Token, WhatsApp Number  
✅ Nomor tujuan sudah join WhatsApp Sandbox

---

## 🛠️ Step 1: Run SQL Migration

1. Buka Supabase Dashboard → **SQL Editor**
2. New Query → Paste isi file `supabase/migrations/001_create_otp_table.sql`
3. Click **Run**

---

## 🛠️ Step 2: Deploy Edge Function

### **2.1 Install Supabase CLI** (di laptop kamu)
```bash
npm install -g supabase
```

### **2.2 Login ke Supabase**
```bash
supabase login
```

### **2.3 Link Project**
```bash
cd /path/to/agrihub-farmer-pwa
supabase link --project-ref lfysdeelrqzvlmpqyfyx
```

### **2.4 Deploy Function**
```bash
supabase functions deploy send-whatsapp-otp
```

---

## 🛠️ Step 3: Set Environment Variables

Di Supabase Dashboard:

1. **Settings** → **Functions** (sidebar)
2. Tab **"Environment Variables"**
3. Add variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `TWILIO_ACCOUNT_SID` | `ACa96403b03db...` | Dari Twilio Console |
| `TWILIO_AUTH_TOKEN` | `your_auth_token` | Dari Twilio Console |
| `TWILIO_CONTENT_SID` | `HX57469e9f7ed15c2c347dece7fd851e09` | Template SID |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+1415XXXXXXX` | Nomor WhatsApp Twilio |
| `SUPABASE_URL` | `https://lfysdeelrqzvlmpqyfyx.supabase.co` | Auto-filled |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Dari Settings → API → service_role key |

4. Click **Save**

---

## 🛠️ Step 4: Update Frontend

Edge Function URL: `https://lfysdeelrqzvlmpqyfyx.supabase.co/functions/v1/send-whatsapp-otp`

Nanti aku update AuthContext untuk pakai function ini.

---

## 🧪 Test Edge Function

### **Via Dashboard:**
1. Supabase → **Edge Functions**
2. Click **send-whatsapp-otp**
3. Tab **"Invoke"**
4. Body:
   ```json
   {"phone": "+6282247809247"}
   ```
5. Click **"Run"**
6. Cek WhatsApp kamu! 📱

### **Via curl:**
```bash
curl -X POST \
  'https://lfysdeelrqzvlmpqyfyx.supabase.co/functions/v1/send-whatsapp-otp' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"phone": "+6282247809247"}'
```

---

## ⚠️ Troubleshooting

### "Failed to send WhatsApp message"
→ Cek Twilio credentials, pastikan nomor sudah join sandbox

### "Template not found"
→ Content SID salah atau template belum approved

### "Unauthorized"
→ Bearer token salah atau function tidak ter-deploy

---

## 🎉 Setelah Berhasil

Edge Function akan:
1. ✅ Generate OTP random (6 digit)
2. ✅ Kirim via WhatsApp dengan template kamu
3. ✅ Simpan OTP ke database (expire 5 menit)
4. ✅ Frontend bisa verifikasi OTP

**Mau aku bantu deploy atau ada yang mau ditanyakan?** 🐼