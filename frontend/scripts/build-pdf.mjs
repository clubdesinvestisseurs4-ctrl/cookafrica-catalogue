// Assemble toutes les pages optimisées en un seul PDF téléchargeable.
// Usage : npm run prep:pdf (à lancer après prep:images)
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageMap } from './image-map.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '..', 'public', 'assets', 'pages');
const outFile = path.join(__dirname, '..', 'public', 'catalogue-cookafrica.pdf');

const pdf = await PDFDocument.create();
pdf.setTitle('Cook Africa — Le Catalogue');
pdf.setAuthor('Cook Africa');
pdf.setSubject("L'univers des mets africains — menu de la semaine");

let count = 0;
for (const [dest] of imageMap) {
  const filePath = path.join(pagesDir, dest);
  if (!fs.existsSync(filePath)) continue;
  const bytes = fs.readFileSync(filePath);
  const { width, height } = await sharp(bytes).metadata();
  const image = await pdf.embedJpg(bytes);
  const page = pdf.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });
  count++;
}

const pdfBytes = await pdf.save();
fs.writeFileSync(outFile, pdfBytes);
console.log(`✓ PDF généré (${count} pages) -> ${outFile}`);
