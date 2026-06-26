// Pousse le catalogue (frontend/src/data/catalog.js) dans Firestore : collection "catalog", document "current".
// Usage : npm run seed   (nécessite les variables FIREBASE_* dans backend/.env, cf. .env.example)
import 'dotenv/config';
import admin from 'firebase-admin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalog } from '../../frontend/src/data/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Variables FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY manquantes.');
  console.error(`Renseignez-les dans ${path.join(__dirname, '..', '.env')} (voir .env.example).`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();
await db.collection('catalog').doc('current').set(catalog);

console.log(`✓ Catalogue importé dans Firestore (collection "catalog", document "current") — ${catalog.pages.length} pages.`);
process.exit(0);
