#!/usr/bin/env node

/**
 * Test script to verify blog API is working
 * Run: node scripts/test-blog-api.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env.local
const envPath = join(rootDir, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBlogAPI() {
  console.log('🧪 Testing Blog API...\n');

  // Test 1: Check if table exists
  console.log('1️⃣  Checking if blog_posts table exists...');
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (error) {
      console.log('   ❌ Table does not exist or has permission issues');
      console.log('   Error:', error.message);
      console.log('   → Run the SQL schema in Supabase SQL Editor (supabase-schema.sql)');
      return;
    }
    console.log('   ✅ Table exists');
  } catch (err) {
    console.log('   ❌ Error:', err.message);
    return;
  }

  // Test 2: Count posts
  console.log('\n2️⃣  Counting blog posts...');
  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log(`   ✅ Found ${count} posts in database`);
    
    if (count === 0) {
      console.log('   ℹ️  No posts yet. Run: npm run migrate-blog');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  // Test 3: Fetch published posts
  console.log('\n3️⃣  Fetching published posts...');
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, status')
      .eq('status', 'published')
      .limit(5);

    if (error) throw error;

    if (data.length === 0) {
      console.log('   ⚠️  No published posts found');
      console.log('   → Create posts in admin panel or run: npm run migrate-blog');
    } else {
      console.log(`   ✅ Found ${data.length} published posts:`);
      data.forEach(post => {
        console.log(`      - ${post.title} (${post.slug})`);
      });
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  // Test 4: Check storage bucket
  console.log('\n4️⃣  Checking storage bucket...');
  try {
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();

    if (error) {
      console.log('   ❌ Error listing buckets:', error.message);
    } else {
      const blogAssetsBucket = buckets.find(b => b.id === 'blog-assets');
      
      if (blogAssetsBucket) {
        console.log('   ✅ Storage bucket exists');
        console.log(`      Name: ${blogAssetsBucket.name}`);
        console.log(`      Public: ${blogAssetsBucket.public}`);
      } else {
        console.log('   ❌ Storage bucket "blog-assets" not found');
        console.log('   Available buckets:', buckets.map(b => b.id).join(', ') || 'none');
        console.log('   → Create bucket manually in Supabase Storage dashboard');
      }
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Test complete!\n');
}

testBlogAPI();
