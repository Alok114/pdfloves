/**
 * Migration script to move existing blog posts from posts.ts to Supabase
 * Run this once after setting up the database schema
 * 
 * Usage: node scripts/migrate-blog-posts.js
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
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hardcoded blog posts from posts.ts
const blogPosts = [
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to merge PDF files',
    description: 'Combine two or more PDF files into one single document in just a few clicks — no software needed.',
    date: 'Apr 20, 2026',
    category: 'How-to Guide',
    cardBg: '#e5322d',
    cardTextColor: '#ffffff',
    cardLabel: 'Merge PDF',
    content: `## How to merge PDF files

Merging PDFs is one of the most common document tasks — whether you're combining a cover letter with a resume, joining chapters of a report, or assembling a multi-section contract.

Pdfloves makes it completely free and browser-based. No uploads to a server, no sign-up required.

### Steps to merge PDF files

1. Go to the **Merge PDF** tool on Pdfloves.
2. Click **Upload PDF** or drag and drop your files into the upload area.
3. Reorder the files by dragging them into the sequence you want.
4. Click **Merge PDF** and wait a moment.
5. Download your combined PDF file.

### Tips for better results

- You can upload up to 100 PDF files at once.
- Drag files to reorder them before merging.
- All processing happens in your browser — your files never leave your device.`,
  },
  {
    slug: 'how-to-compress-pdf',
    title: 'How to reduce PDF file size',
    description: 'Sometimes you need to shrink a PDF for email, upload limits, or storage. Here\'s the fastest way to do it online.',
    date: 'Apr 18, 2026',
    category: 'How-to Guide',
    cardBg: '#f59e0b',
    cardTextColor: '#1a1a1a',
    cardLabel: 'Compress PDF',
    content: `## How to reduce PDF file size

Large PDFs are a headache — they bounce back from email servers, fail to upload to portals, and eat up storage.`,
  },
  {
    slug: 'how-to-convert-pdf-to-word',
    title: 'How to convert PDF to Word',
    description: 'Turn a PDF into an editable Word document quickly — useful for editing contracts, reports, and forms.',
    date: 'Apr 15, 2026',
    category: 'Conversion Guide',
    cardBg: '#2563eb',
    cardTextColor: '#ffffff',
    cardLabel: 'PDF to Word',
    content: `## How to convert PDF to Word

PDFs are great for sharing, but terrible for editing.`,
  },
];

async function migratePosts() {
  console.log(`Starting migration of ${blogPosts.length} blog posts...`);

  for (const post of blogPosts) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert({
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: post.date,
          category: post.category,
          card_bg: post.cardBg,
          card_text_color: post.cardTextColor,
          card_label: post.cardLabel,
          content: post.content,
          status: 'published',
        }, {
          onConflict: 'slug'
        });

      if (error) {
        console.error(`Error migrating post "${post.title}":`, error);
      } else {
        console.log(`✓ Migrated: ${post.title}`);
      }
    } catch (err) {
      console.error(`Exception migrating post "${post.title}":`, err);
    }
  }

  console.log('Migration complete!');
}

migratePosts();
