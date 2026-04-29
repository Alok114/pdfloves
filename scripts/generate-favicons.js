#!/usr/bin/env node

/**
 * Generate PNG favicons from SVG
 * This script requires sharp: npm install sharp --save-dev
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

console.log('🎨 Generating favicons from SVG...\n');

async function generateFavicons() {
  try {
    // Generate 16x16 PNG
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(join(publicDir, 'favicon-16x16.png'));
    console.log('✅ Generated favicon-16x16.png');

    // Generate 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon-32x32.png'));
    console.log('✅ Generated favicon-32x32.png');

    // Generate 180x180 Apple Touch Icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Generated apple-touch-icon.png');

    // Generate 192x192 for PWA
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(join(publicDir, 'icon-192.png'));
    console.log('✅ Generated icon-192.png');

    // Generate 512x512 for PWA
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(join(publicDir, 'icon-512.png'));
    console.log('✅ Generated icon-512.png');

    console.log('\n🎉 All favicons generated successfully!');
    console.log('\nNote: favicon.ico should be created manually or using an online tool.');
    console.log('Visit: https://realfavicongenerator.net/');
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    console.log('\nTry installing sharp: npm install sharp --save-dev');
    process.exit(1);
  }
}

generateFavicons();
