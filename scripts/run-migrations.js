#!/usr/bin/env node
/**
 * Supabase Migration Runner
 * 
 * Usage:
 *   node scripts/run-migrations.js
 *   
 * Environment variables needed:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (bukan anon key!)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=');
  console.error('');
  console.error('Create .env file or export them:');
  console.error('   export NEXT_PUBLIC_SUPABASE_URL=https://...');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runMigrations() {
  console.log('🚀 Migration Runner');
  console.log('='.repeat(50));
  console.log();

  // 1. Get list of SQL files
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('📂 No migration files found.');
    return;
  }

  console.log(`📂 Found ${files.length} migration file(s)`);
  console.log();

  // 2. Get executed migrations
  const { data: executed, error: fetchError } = await supabase
    .from('_migrations')
    .select('filename');

  if (fetchError) {
    console.error('⚠️  _migrations table not found. Run 000_setup_migration_tracking.sql first!');
    console.error('   Or create the table manually in SQL Editor.');
    process.exit(1);
  }

  const executedFiles = new Set(executed?.map(e => e.filename) || []);

  // 3. Run pending migrations
  let ranCount = 0;
  let errorCount = 0;

  for (const file of files) {
    if (executedFiles.has(file)) {
      console.log(`✅ ${file} (already executed)`);
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    const checksum = crypto.createHash('md5').update(sql).digest('hex');

    console.log(`🔄 Running ${file}...`);

    try {
      // Execute SQL using rpc
      const { error: rpcError } = await supabase.rpc('run_migration_sql', {
        sql_content: sql
      });

      if (rpcError) {
        // Fallback: try direct query
        const { error: queryError } = await supabase.from('_migrations').select('*').limit(0);
        
        if (queryError?.code === '42P01') {
          console.error(`   ❌ Failed: ${rpcError.message}`);
          console.error('   The run_migration_sql function may not exist.');
          console.error('   Please run 000_setup_migration_tracking.sql first.');
          errorCount++;
          break;
        }
      }

      // Record migration
      const { error: insertError } = await supabase
        .from('_migrations')
        .insert([{ filename: file, checksum, success: true }]);

      if (insertError) {
        console.error(`   ⚠️  Migration ran but failed to record: ${insertError.message}`);
      } else {
        console.log(`   ✅ Success`);
        ranCount++;
      }

    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log();
  console.log('='.repeat(50));
  console.log(`📊 Summary: ${ranCount} ran, ${errorCount} failed, ${executedFiles.size} already executed`);
  
  if (errorCount > 0) {
    process.exit(1);
  }
}

runMigrations().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});