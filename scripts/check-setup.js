#!/usr/bin/env node

/**
 * Setup verification script for Admin Blog Management
 * Checks if all required configuration is in place
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Checking Admin Blog Setup...\n');

let allGood = true;

// Check 1: Environment variables
console.log('1️⃣  Checking environment variables...');
const envPath = join(rootDir, '.env.local');
if (!existsSync(envPath)) {
  console.log('   ❌ .env.local file not found');
  allGood = false;
} else {
  const envContent = readFileSync(envPath, 'utf-8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_ADMIN_EMAIL',
    'NEXT_PUBLIC_ADMIN_PASSWORD',
    'NEXT_PUBLIC_USE_DATABASE',
  ];
  
  const missingVars = requiredVars.filter(v => !envContent.includes(v));
  if (missingVars.length > 0) {
    console.log(`   ❌ Missing variables: ${missingVars.join(', ')}`);
    allGood = false;
  } else {
    console.log('   ✅ All environment variables present');
  }
}

// Check 2: Dependencies
console.log('\n2️⃣  Checking dependencies...');
const packageJsonPath = join(rootDir, 'package.json');
if (!existsSync(packageJsonPath)) {
  console.log('   ❌ package.json not found');
  allGood = false;
} else {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  if (packageJson.dependencies['@supabase/supabase-js']) {
    console.log('   ✅ @supabase/supabase-js installed');
  } else {
    console.log('   ❌ @supabase/supabase-js not installed');
    console.log('      Run: npm install @supabase/supabase-js');
    allGood = false;
  }
}

// Check 3: Next.js config
console.log('\n3️⃣  Checking Next.js configuration...');
const nextConfigPath = join(rootDir, 'next.config.js');
if (!existsSync(nextConfigPath)) {
  console.log('   ❌ next.config.js not found');
  allGood = false;
} else {
  const nextConfig = readFileSync(nextConfigPath, 'utf-8');
  if (nextConfig.includes("output: 'export'") && !nextConfig.includes("// output: 'export'")) {
    console.log('   ⚠️  Static export is enabled - API routes will not work');
    console.log('      Comment out: output: \'export\' in next.config.js');
    allGood = false;
  } else {
    console.log('   ✅ Next.js configured for API routes');
  }
}

// Check 4: Required files
console.log('\n4️⃣  Checking required files...');
const requiredFiles = [
  'src/lib/supabase/client.ts',
  'src/lib/supabase/auth.ts',
  'src/app/admin/login/page.tsx',
  'src/app/admin/blog/page.tsx',
  'src/app/api/admin/blog/route.ts',
  'src/components/admin/AdminGuard.tsx',
  'src/components/admin/BlogPostForm.tsx',
  'supabase-schema.sql',
];

const missingFiles = requiredFiles.filter(f => !existsSync(join(rootDir, f)));
if (missingFiles.length > 0) {
  console.log(`   ❌ Missing files:\n      ${missingFiles.join('\n      ')}`);
  allGood = false;
} else {
  console.log('   ✅ All required files present');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Setup looks good!\n');
  console.log('Next steps:');
  console.log('1. Run the SQL schema in Supabase SQL Editor');
  console.log('   File: supabase-schema.sql');
  console.log('2. (Optional) Migrate existing posts:');
  console.log('   node scripts/migrate-blog-posts.js');
  console.log('3. Start the dev server:');
  console.log('   npm run dev');
  console.log('4. Visit: http://localhost:3000/admin/login');
} else {
  console.log('❌ Setup incomplete - please fix the issues above\n');
  console.log('See SETUP_CHECKLIST.md for detailed instructions');
}
console.log('='.repeat(50) + '\n');

process.exit(allGood ? 0 : 1);
