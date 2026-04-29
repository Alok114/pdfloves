#!/usr/bin/env node

/**
 * Generate favicon.ico from PNG files
 */

import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

console.log('🎨 Generating favicon.ico...\n');

async function generateIco() {
  try {
    const png16 = readFileSync(join(publicDir, 'favicon-16x16.png'));
    const png32 = readFileSync(join(publicDir, 'favicon-32x32.png'));

    const ico = await toIco([png16, png32]);
    writeFileSync(join(publicDir, 'favicon.ico'), ico);

    console.log('✅ Generated favicon.ico');
    console.log('\n🎉 Favicon setup complete!');
  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error.message);
    process.exit(1);
  }
}

generateIco();
