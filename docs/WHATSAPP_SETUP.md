# Setup WhatsApp OTP dengan Twilio

## 🚀 Langkah Setup (5 menit)

### 1. Aktifkan WhatsApp Sandbox di Twilio

1. Buka https://console.twilio.com
2. **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Aktifkan **WhatsApp Sandbox**
4. Ikuti instruksi join sandbox (biasanya kirim pesan ke nomor Twilio)

### 2. Dapatkan Sandbox Number

Di WhatsApp Sandbox page:
- **Sandbox Number**: `+1 415 XXX XXXX` (contoh)
- Copy nomor ini

### 3. Update Supabase Phone Auth

1. Buka https://supabase.com/dashboard
2. Project **agrihub-petani**
3. **Authentication** → **Providers** → **Phone**
4. **Twilio Settings**:
   - **Twilio Account SID**: (dari Twilio Console)
   - **Twilio Auth Token**: (dari Twilio Console)
   - **Twilio WhatsApp Number**: `+1415XXXXXXX` (Sandbox Number)
5. **Message Service SID** atau **WhatsApp** → Pilih **WhatsApp**

### 4. Test Kirim WhatsApp

Dari Supabase Dashboard:
1. **Authentication** → **Users** → **Add User**
2. Pilih **Send OTP via WhatsApp**
3. Masukkan: `+6282247809247`
4. Click **Send**
5. Cek WhatsApp kamu!

---

## 📱 Cara Join Sandbox (Penting!)

Sebelum bisa terima OTP, kamu harus **join sandbox** dulu:

1. Buka WhatsApp di HP
2. Kirim pesan ke nomor Twilio Sandbox:
   ```
   join <sandbox-code>
   ```
   Contoh: `join iron-man` (kode ada di Twilio Console)
3. Tunggu balasan "You are all set!"

**Setelah join**, baru bisa terima OTP!

---

## 🧪 Test dari Website

1. Buka https://agrihub-farmer-pwa.pages.dev/register
2. Isi nama dan nomor: `+6282247809247`
3. Click "Kirim OTP"
4. Cek WhatsApp! 📩

---

## ⚠️ Catatan Penting

### **Sandbox Limitations:**
- Hanya bisa kirim ke nomor yang sudah **join sandbox**
- Expire dalam 24 jam (harus join ulang)
- Untuk production, butuh **WhatsApp Business API** (berbayar)

### **Solusi Production:**
- Upgrade ke **Twilio WhatsApp Business API**
- Atau pakai **MessageBird** (support Indonesia lebih baik)
- Atau **disable OTP** dulu untuk testing (Demo Mode)

---

## 🆘 Troubleshooting

### "Failed to send OTP"
→ Belum join sandbox. Kirim pesan `join <code>` ke nomor Twilio.

### "Message not delivered"
→ Cek format nomor: harus `+6282247809247` (bukan 0822...)

### "Sandbox expired"
→ Join ulang dengan kirim pesan `join <code>` lagi.

---

## 🎯 Alternatif Cepat: Demo Mode

Kalau WhatsApp setup terlalu ribet, aku bisa aktifkan **Demo Mode**:
- Skip OTP
- Register langsung tanpa verifikasi
- Data tetap tersimpan di Supabase

**Mau Demo Mode saja?** 🐼