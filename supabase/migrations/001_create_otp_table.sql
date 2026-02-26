-- Create table to store OTP codes
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Index for faster lookup
  CONSTRAINT unique_phone_otp UNIQUE (phone, otp)
);

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can access (for security)
CREATE POLICY "Service role only" ON otp_codes
  FOR ALL USING (false);

-- Auto cleanup expired OTPs (optional)
CREATE OR REPLACE FUNCTION cleanup_expired_otp()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Run cleanup every hour (optional, requires pg_cron extension)
-- SELECT cron.schedule('cleanup-otp', '0 * * * *', 'DELETE FROM otp_codes WHERE expires_at < NOW()');