// Génère les icônes PWA (192, 512, maskable) à partir d'un monogramme SVG aux couleurs de la charte.
// Remplaçable plus tard par un vrai logo transparent (voir README).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

const RED = '#7a0e0e';
const GOLD = '#d4af37';

function svgIcon({ size, padding = 0 }) {
  const inner = size - padding * 2;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${RED}"/>
    <rect x="${padding * 0.4}" y="${padding * 0.4}" width="${size - padding * 0.8}" height="${size - padding * 0.8}" fill="none" stroke="${GOLD}" stroke-width="${size * 0.012}"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, 'Times New Roman', serif" font-weight="bold"
      font-size="${inner * 0.34}" fill="${GOLD}">CA</text>
    <text x="50%" y="74%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, serif" font-size="${inner * 0.085}" fill="${GOLD}" letter-spacing="${inner * 0.01}">COOK AFRICA</text>
  </svg>`;
}

async function make(name, size, padding) {
  const svg = Buffer.from(svgIcon({ size, padding }));
  await sharp(svg).png().toFile(path.join(outDir, name));
  console.log(`✓ icons/${name}`);
}

await make('icon-192.png', 192, 0);
await make('icon-512.png', 512, 0);
await make('icon-maskable-512.png', 512, 60); // marge de sécurité pour le masquage adaptatif

console.log(`\nIcônes générées dans ${outDir}`);
