// Génère le QR code à imprimer pointant vers le catalogue en ligne.
// Usage : node scripts/generate-qr.mjs https://votre-domaine.vercel.app
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || process.env.CATALOG_URL;

if (!url) {
  console.error('Usage: node scripts/generate-qr.mjs <url-du-site-en-ligne>');
  console.error('   ou : CATALOG_URL=https://... node scripts/generate-qr.mjs');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(outDir, { recursive: true });

const pngPath = path.join(outDir, 'qr-code.png');
const svgPath = path.join(__dirname, '..', 'qr-code-print.svg'); // haute résolution, pour impression, hors dossier public/

await QRCode.toFile(pngPath, url, {
  type: 'png',
  width: 1024,
  margin: 2,
  color: { dark: '#7a0e0e', light: '#ffffff' }
});

const svg = await QRCode.toString(url, { type: 'svg', margin: 2, color: { dark: '#7a0e0e', light: '#ffffff' } });
fs.writeFileSync(svgPath, svg);

console.log(`✓ QR code généré pour : ${url}`);
console.log(`  - ${pngPath} (affiché dans l'app)`);
console.log(`  - ${svgPath} (vectoriel, pour impression flyers/affiches)`);
