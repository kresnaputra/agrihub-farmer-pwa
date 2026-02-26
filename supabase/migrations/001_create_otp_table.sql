-- Create table to store OTP codes (not used for email auth, but kept for future)
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  CONSTRAINT unique_phone_otp UNIQUE (phone, otp)
);

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON otp_codes FOR ALL USING (false);

-- Auto cleanup expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otp()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: For Email Auth, we don't need OTP table
-- This is kept for backward compatibility if we want to add phone OTP later