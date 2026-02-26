# Deploy Edge Function untuk Bypass Email Rate Limit

## 🚀 Deploy Function

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login & Link Project
```bash
supabase login
supabase link --project-ref lfysdeelrqzvlmpqyfyx
```

### Step 3: Deploy Function
```bash
supabase functions deploy register-user
```

### Step 4: Set Environment Variables

Di Supabase Dashboard:
1. **Settings** → **Functions** → **Environment Variables**
2. Add:
   - `SUPABASE_URL`: `https://lfysdeelrqzvlmpqyfyx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (dari Settings → API → service_role key)

3. Save

## ✅ Selesai!

Register sekarang pakai Admin API — tidak ada email yang dikirim!