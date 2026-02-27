-- Fix: Infinite recursion in RLS policies for admin
-- Use SECURITY DEFINER function to avoid recursion

-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can view all products" ON products;
DROP POLICY IF EXISTS "Admin can manage all products" ON products;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

-- Create SECURITY DEFINER function to check admin status
-- SECURITY DEFINER bypasses RLS, preventing infinite recursion
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin policies using the function
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view all products" ON products
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admin can manage all products" ON products
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (is_admin(auth.uid()));