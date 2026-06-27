const express = require('express');
const rateLimit = require('express-rate-limit');
const { db, admin } = require('../firebase-admin');
const { requireRole, optionalPromoterAuth } = require('../lib/auth');

const router = express.Router();

const submitLimiter = rateLimit({ windowMs: 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false });

// POST /api/leads — soumission d'une fiche client.
// Si un jeton promoteur valide est fourni, la fiche est rattachée à ce promoteur.
// Sinon, elle est enregistrée comme soumission publique (depuis le catalogue).
router.post('/', submitLimiter, optionalPromoterAuth, async (req, res) => {
  try {
    const { nom, prenoms, contact, fonction } = req.body || {};
    if (!nom || !contact) {
      return res.status(400).json({ error: 'Les champs Nom et Contact sont requis.' });
    }

    const lead = {
      nom: String(nom).trim().slice(0, 120),
      prenoms: String(prenoms || '').trim().slice(0, 120),
      contact: String(contact).trim().slice(0, 60),
      fonction: String(fonction || '').trim().slice(0, 120),
      source: req.auth?.role === 'promoteur' ? 'promoteur' : 'catalogue',
      promoterId: req.auth?.role === 'promoteur' ? req.auth.promoterId : null,
      promoterName: req.auth?.role === 'promoteur' ? req.auth.displayName : null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('leads').add(lead);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error('POST /api/leads', err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la fiche." });
  }
});

// GET /api/leads — liste des fiches clients, filtrable par ?promoterId= (admin)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    let query = db.collection('leads').orderBy('createdAt', 'desc');
    if (req.query.promoterId) query = query.where('promoterId', '==', req.query.promoterId);

    const snap = await query.get();
    const leads = snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.() ?? data.createdAt ?? null };
    });
    res.json({ leads });
  } catch (err) {
    console.error('GET /api/leads', err);
    res.status(500).json({ error: 'Erreur lors de la lecture des fiches.' });
  }
});

module.exports = router;
