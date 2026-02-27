-- Migration tracking table
-- Run this FIRST before using migration automation

CREATE TABLE IF NOT EXISTS _migrations (
  id SERIAL PRIMARY KEY,
  filename TEXT UNIQUE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  checksum TEXT,
  success BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;

-- Only admins can view migration history
CREATE POLICY "Admin can view migrations" ON _migrations
  FOR SELECT USING (is_admin(auth.uid()));

-- Create helper function to run migrations
CREATE OR REPLACE FUNCTION run_migration_sql(sql_content TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;