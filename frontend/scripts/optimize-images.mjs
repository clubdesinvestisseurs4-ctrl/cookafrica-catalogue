// Copie + optimise les images sources du catalogue vers public/assets/pages/.
// Usage : npm run prep:images   (variable MENU_SOURCE_DIR pour changer le dossier source)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageMap, MENU_SOURCE_DIR } from './image-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'assets', 'pages');
const TARGET_WIDTH = 1400;

fs.mkdirSync(outDir, { recursive: true });

let ok = 0;
let missing = [];

for (const [dest, src] of imageMap) {
  if (!fs.existsSync(src)) {
    missing.push(src);
    continue;
  }
  const outPath = path.join(outDir, dest);
  await sharp(src)
    .rotate()
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    // progressive: false (volontaire) — pdf-lib n'embarque que des JPEG baseline
    .jpeg({ quality: 82, mozjpeg: true, progressive: false })
    .toFile(outPath);
  ok++;
  console.log(`✓ ${dest}`);
}

console.log(`\n${ok}/${imageMap.length} pages générées dans ${outDir}`);
if (missing.length) {
  console.warn(`\n⚠ ${missing.length} image(s) source introuvable(s) (MENU_SOURCE_DIR=${MENU_SOURCE_DIR}) :`);
  missing.forEach((m) => console.warn(`  - ${m}`));
  process.exitCode = 1;
}
