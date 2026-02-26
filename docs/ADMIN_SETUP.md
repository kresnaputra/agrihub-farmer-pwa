# Setup Admin User

## Cara Membuat Admin User:

### Option 1: Update existing user to admin (Recommended)

1. Login ke Supabase Dashboard
2. Buka **SQL Editor**
3. Jalankan query berikut (ganti 'user-id-di-sini' dengan ID user yang mau dijadikan admin):

```sql
-- Update user role to admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-id-di-sini';
```

### Option 2: Create admin via Edge Function

Register user biasa, kemudian jalankan SQL di atas untuk set role = 'admin'

### Option 3: Direct SQL Insert (Not recommended for production)

```sql
-- First create auth user manually in Supabase Auth UI
-- Then insert profile with admin role
INSERT INTO profiles (id, name, email, phone, role, created_at, updated_at)
VALUES (
  'auth-user-id-here',
  'Admin Name',
  'admin@email.com',
  '08123456789',
  'admin',
  NOW(),
  NOW()
);
```

## Akses Admin Panel

Setelah jadi admin, login dengan akun tersebut:
- `/login` → Masuk dengan email admin
- Otomatis redirect ke `/admin`

## Fitur Admin Panel:

1. **Dashboard** (`/admin`)
   - Stats overview (total users, products, orders, revenue)
   - Quick actions

2. **Users** (`/admin/users`)
   - Lihat semua pembeli & petani
   - Search & filter by role
   - Stats: total, farmers, buyers

3. **Products** (`/admin/products`)
   - Lihat semua produk dari semua petani
   - Aktifkan/Nonaktifkan produk
   - Hapus produk
   - Search & filter

4. **Orders** (`/admin/orders`)
   - Lihat semua transaksi
   - Filter by status
   - Stats per status
   - Revenue tracking

## Keamanan

- Hanya user dengan `role = 'admin'` yang bisa akses
- Non-admin di-redirect ke homepage
- RLS policies sudah di-setup untuk admin access