# 🗄️ Migration Automation System

Sistem untuk otomatis menjalankan SQL migration file ke Supabase.

---

## 🚀 **SETUP PERTAMA KALI**

### **1. Setup Migration Tracking Table**

**WAJIB** jalankan ini dulu di Supabase SQL Editor:

```sql
-- Migration tracking table
CREATE TABLE IF NOT EXISTS _migrations (
  id SERIAL PRIMARY KEY,
  filename TEXT UNIQUE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  checksum TEXT,
  success BOOLEAN DEFAULT true
);

ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view migrations" ON _migrations
  FOR SELECT USING (is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION run_migration_sql(sql_content TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **2. Setup Environment Variables**

Buat file `.env` di root project:

```bash
# Copy dari .env.example
cp .env.example .env
```

Edit file `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lfysdeelrqzvlmpqyfyx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key
```

**Cara dapetin Service Role Key:**
1. Buka Supabase Dashboard → Project Settings → API
2. Copy "service_role secret" (JANGAN SHARE KE SIAPAPUN!)

---

## 📝 **CARA PAKAI**

### **Jalankan Migration:**

```bash
npm run migrate
```

Atau:

```bash
node scripts/run-migrations.js
```

---

## 📁 **STRUKTUR FILE**

```
supabase/migrations/
├── 000_setup_migration_tracking.sql  ← Setup awal (manual)
├── 001_create_otp_table.sql          ← Contoh migration
├── 002_add_admin_support.sql         ← Contoh migration
├── 003_fix_orders_rls_anonymous.sql  ← Contoh migration
└── 004_fix_infinite_recursion_rls.sql ← Contoh migration
```

**Aturan penamaan:**
- Format: `XXX_descriptive_name.sql`
- Urutkan dengan nomor: `001_`, `002_`, `003_`
- Deskriptif: `add_users_table`, `fix_rls_policy`, dll

---

## 🔄 **WORKFLOW MIGRATION**

### **1. Buat Migration Baru**

```bash
# Buat file baru dengan nomor urut berikutnya
touch supabase/migrations/005_new_feature.sql
```

Isi dengan SQL:

```sql
-- 005_new_feature.sql
-- Deskripsi: Tambah kolom baru di tabel products

ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
```

### **2. Jalankan Migration**

```bash
npm run migrate
```

Output:
```
🚀 Migration Runner
==================================================

📂 Found 6 migration file(s)

✅ 000_setup_migration_tracking.sql (already executed)
✅ 001_create_otp_table.sql (already executed)
...
🔄 Running 005_new_feature.sql...
   ✅ Success

==================================================
📊 Summary: 1 ran, 0 failed, 5 already executed
```

---

## ⚠️ **TIPS & BEST PRACTICES**

### **✅ DO:**
- Gunakan `IF EXISTS` / `IF NOT EXISTS` untuk idempotent
- Test migration di local/dev dulu
- Backup database sebelum major migration
- Kasih nama deskriptif

### **❌ DON'T:**
- Edit file migration yang sudah di-execute
- Hapus migration file lama
- Share service_role_key ke siapapun

### **Contoh Idempotent SQL:**

```sql
-- ✅ GOOD: Bisa di-run berkali-kali tanpa error
CREATE TABLE IF NOT EXISTS users (...);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
DROP POLICY IF EXISTS "old_policy" ON users;
CREATE POLICY "new_policy" ON users ...;

-- ❌ BAD: Error kalau di-run lagi
CREATE TABLE users (...);  -- ERROR: table already exists
```

---

## 🐛 **TROUBLESHOOTING**

### **Error: "_migrations table not found"**

Jalankan setup pertama kali:
```sql
-- Copy dari 000_setup_migration_tracking.sql
```

### **Error: "run_migration_sql function may not exist"**

Function belum dibuat. Jalankan:
```sql
CREATE OR REPLACE FUNCTION run_migration_sql(sql_content TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Migration stuck / error**

Cek manual di Supabase Logs:
1. Dashboard → Database → Logs
2. Cari error message

Atau run SQL manual:
```sql
-- Lihat migration history
SELECT * FROM _migrations ORDER BY executed_at DESC;

-- Mark failed migration as executed (hati-hati!)
INSERT INTO _migrations (filename, success) VALUES ('005_stuck.sql', false);
```

---

## 🔐 **KEAMANAN**

- **Service Role Key** = FULL ACCESS ke database
- Jangan commit ke GitHub!
- Jangan share ke siapapun!
- Simpan di `.env` (sudah di .gitignore)

---

## 📚 **REFERENSI**

- Supabase Docs: https://supabase.com/docs
- PostgreSQL DDL: https://www.postgresql.org/docs/current/ddl.html
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security