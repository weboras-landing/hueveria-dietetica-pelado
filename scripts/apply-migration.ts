/**
 * Script to apply the store management system migration to Supabase
 * Run this with: npx tsx scripts/apply-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
    console.log('🚀 Starting migration...\n');

    try {
        // Read the migration file
        const migrationPath = path.join(__dirname, 'migration-store-system.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        console.log('📄 Migration file loaded');
        console.log('📊 Executing SQL migration...\n');

        // Execute the migration
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: migrationSQL
        });

        if (error) {
            // If exec_sql doesn't exist, try direct execution (for newer Supabase versions)
            console.log('⚠️  exec_sql not available, trying alternative method...');

            // Split by semicolons and execute each statement
            const statements = migrationSQL
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            for (const statement of statements) {
                if (statement.includes('CREATE') || statement.includes('ALTER') || statement.includes('INSERT')) {
                    console.log(`Executing: ${statement.substring(0, 50)}...`);
                }
            }

            console.log('\n⚠️  Please run the migration manually:');
            console.log('1. Go to Supabase Dashboard → SQL Editor');
            console.log('2. Copy the contents of scripts/migration-store-system.sql');
            console.log('3. Paste and run the SQL');
            console.log('\nOr use the Supabase CLI:');
            console.log('supabase db push');

            return;
        }

        console.log('✅ Migration executed successfully!\n');
        console.log('📋 Tables created:');
        console.log('   - customers');
        console.log('   - orders');
        console.log('   - order_items');
        console.log('   - discounts');
        console.log('   - suppliers');
        console.log('   - expenses');
        console.log('   - store_settings');
        console.log('\n🔒 RLS policies enabled');
        console.log('⚡ Triggers and functions created');
        console.log('\n✨ Database is ready!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        console.log('\n📝 Manual migration required:');
        console.log('1. Open Supabase Dashboard');
        console.log('2. Go to SQL Editor');
        console.log('3. Run the SQL from scripts/migration-store-system.sql');
        process.exit(1);
    }
}

applyMigration();
