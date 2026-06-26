const express = require('express');
const { db } = require('../firebase-admin');

const router = express.Router();
const DOC_PATH = ['catalog', 'current'];

// GET /api/catalog — lecture publique du catalogue (pages, jours, plats)
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection(DOC_PATH[0]).doc(DOC_PATH[1]).get();
    if (!snap.exists) {
      return res.status(404).json({ error: 'Catalogue non initialisé. Lancez le script de seed (npm run seed).' });
    }
    res.set('Cache-Control', 'public, max-age=60');
    res.json(snap.data());
  } catch (err) {
    console.error('GET /api/catalog', err);
    res.status(500).json({ error: 'Erreur lors de la lecture du catalogue.' });
  }
});

// PUT /api/catalog — remplace le catalogue (admin uniquement, jeton requis)
// Permet de modifier le menu (ordre des pages, textes, images) sans redéployer le frontend.
router.put('/', requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.pages)) {
      return res.status(400).json({ error: 'Corps invalide : { title, subtitle, pages: [...], contact } attendu.' });
    }
    await db.collection(DOC_PATH[0]).doc(DOC_PATH[1]).set(body);
    res.json({ ok: true, pages: body.pages.length });
  } catch (err) {
    console.error('PUT /api/catalog', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du catalogue.' });
  }
});

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }
  next();
}

module.exports = router;
