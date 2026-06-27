const express = require('express');
const rateLimit = require('express-rate-limit');
const { db, admin } = require('../firebase-admin');
const { requireRole } = require('../lib/auth');

const router = express.Router();

const VALIDITY_DAYS = 5;
const issueLimiter = rateLimit({ windowMs: 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CA-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/coupons — émet un coupon (public). Le code est unique et tracé en base,
// pour pouvoir être vérifié/consommé une seule fois en caisse (§ redeem ci-dessous).
router.post('/', issueLimiter, async (req, res) => {
  try {
    let code;
    let attempts = 0;
    do {
      code = generateCode();
      attempts += 1;
      const existing = await db.collection('coupons').doc(code).get();
      if (!existing.exists) break;
    } while (attempts < 5);

    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + VALIDITY_DAYS * 24 * 60 * 60 * 1000);

    await db.collection('coupons').doc(code).set({
      code,
      offerText: "-15% sur l'addition",
      issuedAt: admin.firestore.Timestamp.fromDate(issuedAt),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      used: false,
      usedAt: null,
    });

    res.status(201).json({ code, issuedAt: issuedAt.toISOString(), expiresAt: expiresAt.toISOString() });
  } catch (err) {
    console.error('POST /api/coupons', err);
    res.status(500).json({ error: "Erreur lors de l'émission du coupon." });
  }
});

// POST /api/coupons/:code/redeem — valide et consomme un coupon (admin, en caisse).
router.post('/:code/redeem', requireRole('admin'), async (req, res) => {
  try {
    const ref = db.collection('coupons').doc(req.params.code.toUpperCase());
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Code invalide.' });

    const coupon = snap.data();
    const now = new Date();

    if (coupon.used) {
      return res.status(409).json({
        error: `Ce coupon a déjà été utilisé le ${coupon.usedAt.toDate().toLocaleString('fr-FR')}.`,
      });
    }
    if (coupon.expiresAt.toDate() < now) {
      return res.status(410).json({
        error: `Ce coupon a expiré le ${coupon.expiresAt.toDate().toLocaleDateString('fr-FR')}.`,
      });
    }

    await ref.update({ used: true, usedAt: admin.firestore.Timestamp.fromDate(now) });
    res.json({ ok: true, offerText: coupon.offerText, issuedAt: coupon.issuedAt.toDate().toISOString() });
  } catch (err) {
    console.error('POST /api/coupons/:code/redeem', err);
    res.status(500).json({ error: 'Erreur lors de la validation du coupon.' });
  }
});

module.exports = router;
