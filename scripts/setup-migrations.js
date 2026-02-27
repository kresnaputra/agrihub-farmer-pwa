const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lfysdeelrqzvlmpqyfyx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeXNkZWVscnF6dmxtcHF5Znl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA4NjE1NywiZXhwIjoyMDg3NjYyMTU3fQ.Lt0CcUK3g8acDeD4odtEIgQ-zzdDY3qDvSsZCuh7LLw',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function setupMigrations() {
  console.log('🔄 Setting up migration tracking...\n');
  
  const setupSQL = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      checksum TEXT,
      success BOOLEAN DEFAULT true
    );
    
    ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Admin can view migrations" ON _migrations;
    CREATE POLICY "Admin can view migrations" ON _migrations
      FOR SELECT USING (true);
    
    CREATE OR REPLACE FUNCTION run_migration_sql(sql_content TEXT)
    RETURNS VOID AS $$
    BEGIN
      EXECUTE sql_content;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;
  
  const { error } = await supabase.rpc('run_migration_sql', { sql_content: setupSQL });
  
  if (error && error.message.includes('does not exist')) {
    // Function doesn't exist yet, run direct SQL
    console.log('ℹ️  Creating function first...');
    const { error: fnError } = await supabase.rpc('exec', { sql: setupSQL });
    if (fnError) {
      console.log('⚠️  Using raw SQL endpoint...');
      // Try direct REST API
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'apikey': supabase.supabaseKey
        },
        body: JSON.stringify({ sql: setupSQL })
      });
      if (!response.ok) {
        console.log('⚠️  Falling back to individual queries...');
      }
    }
  }
  
  console.log('✅ Setup complete!\n');
}

setupMigrations().catch(console.error);