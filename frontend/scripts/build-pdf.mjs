// Assemble toutes les pages du catalogue (dans l'ordre défini par src/data/catalog.js) en un
// seul PDF téléchargeable. Usage : npm run prep:pdf
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from '../src/data/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '..', 'public', 'assets', 'pages');
const outFile = path.join(__dirname, '..', 'public', 'catalogue-cookafrica.pdf');

const pdf = await PDFDocument.create();
pdf.setTitle('Cook Africa — Le Catalogue');
pdf.setAuthor('Cook Africa');
pdf.setSubject("L'univers des mets africains — le menu");

let count = 0;
for (const page of catalog.pages) {
  if (!page.image) continue; // pages sans image (ex: formulaire de contact) ne vont pas dans le PDF
  const filePath = path.join(pagesDir, page.image);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ image manquante, page ignorée : ${page.image}`);
    continue;
  }
  const bytes = fs.readFileSync(filePath);
  const { width, height } = await sharp(bytes).metadata();
  const image = await pdf.embedJpg(bytes);
  const pdfPage = pdf.addPage([width, height]);
  pdfPage.drawImage(image, { x: 0, y: 0, width, height });
  count++;
}

const pdfBytes = await pdf.save();
fs.writeFileSync(outFile, pdfBytes);
console.log(`✓ PDF généré (${count} pages) -> ${outFile}`);
