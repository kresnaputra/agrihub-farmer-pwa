-- Fix: Allow anonymous users to create orders (checkout without login)
-- Run this in Supabase SQL Editor

-- Allow anyone to create orders (for guest checkout)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow anyone to view orders (for order tracking by phone)
-- Note: In production, you might want to restrict this
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT USING (true);

-- Optional: Restrict view to only seller's own orders + allow buyers to track by phone
-- Uncomment below if you want stricter policy:
/*
DROP POLICY IF EXISTS "Sellers can view own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;

CREATE POLICY "Sellers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can view orders by phone" ON orders
  FOR SELECT USING (
    buyer_phone = current_setting('request.jwt.claims', true)::json->>'phone'
  );
*/

-- Make sure orders table has proper indexes for phone lookups
CREATE INDEX IF NOT EXISTS idx_orders_buyer_phone ON orders(buyer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);