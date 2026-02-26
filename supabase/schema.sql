-- AgriHub Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  address TEXT,
  village TEXT,
  city TEXT,
  province TEXT DEFAULT 'Jawa Barat',
  postal_code TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bank accounts table
CREATE TABLE bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT,
  quantity INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order', 'payment', 'product', 'price', 'system', 'message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Market prices table
CREATE TABLE market_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commodity_name TEXT NOT NULL,
  current_price INTEGER NOT NULL,
  change INTEGER DEFAULT 0,
  change_percent DECIMAL(5,2) DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  market TEXT NOT NULL,
  high INTEGER,
  low INTEGER,
  volume INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Bank accounts: Users can only access their own
CREATE POLICY "Users can view own bank accounts" ON bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bank accounts" ON bank_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Products: Public can view active, sellers can manage their own
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can manage own products" ON products
  FOR ALL USING (auth.uid() = user_id);

-- Orders: Sellers can view their own orders
CREATE POLICY "Sellers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = seller_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample market prices
INSERT INTO market_prices (commodity_name, current_price, change, change_percent, unit, market, high, low, volume) VALUES
  ('Bawang Merah', 25000, 1200, 5.0, 'kg', 'Pasar Induk Cipinang', 26000, 24000, 12000),
  ('Cabai Rawit', 45000, -900, -2.0, 'kg', 'Pasar Induk Cipinang', 47000, 42000, 8000),
  ('Padi', 8500, 85, 1.0, 'kg', 'Bulog', 8700, 8300, 50000),
  ('Kedelai', 12000, 360, 3.0, 'kg', 'Pasar Induk Cipinang', 12500, 11500, 15000),
  ('Jagung', 7200, 0, 0, 'kg', 'Bulog', 7300, 7100, 30000),
  ('Bawang Putih', 32000, 1600, 5.3, 'kg', 'Pasar Induk Cipinang', 33000, 31000, 7000),
  ('Cabai Merah', 38000, -760, -2.0, 'kg', 'Pasar Induk Cipinang', 40000, 37000, 6000),
  ('Beras Premium', 12500, 375, 3.1, 'kg', 'Bulog', 12800, 12200, 40000),
  ('Kacang Tanah', 18000, 540, 3.1, 'kg', 'Pasar Induk Cipinang', 18500, 17500, 9000),
  ('Tomat', 8000, -240, -2.9, 'kg', 'Pasar Induk Cipinang', 8500, 7800, 12000);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();