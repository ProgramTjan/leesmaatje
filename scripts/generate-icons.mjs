/**
 * Run this script on your laptop to generate PWA icons from the SVG:
 *
 *   npm install sharp
 *   node scripts/generate-icons.mjs
 *
 * Or use any online SVG-to-PNG converter with public/icons/icon.svg
 * and save as icon-192.png, icon-512.png, and icon-maskable-512.png
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '..', 'public', 'icons', 'icon.svg');
const outDir = join(__dirname, '..', 'public', 'icons');

const svg = readFileSync(svgPath);

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(outDir, name));
  console.log(`Created ${name}`);
}

console.log('Done! Icons saved in public/icons/');
