-- Add admin role support
-- Run this in Supabase SQL Editor

-- Add role column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'farmer', 'admin'));

-- Update RLS policies for admin access

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Admin can view all products
CREATE POLICY "Admin can view all products" ON products
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Admin can manage all products
CREATE POLICY "Admin can manage all products" ON products
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Admin can view all orders
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;