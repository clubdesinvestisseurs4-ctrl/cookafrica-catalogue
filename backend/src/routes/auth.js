const express = require('express');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const { db } = require('../firebase-admin');
const { signToken } = require('../lib/auth');

const router = express.Router();

// Compare deux mots de passe en temps constant (même si leurs longueurs diffèrent),
// pour éviter qu'une attaque par timing ne révèle des informations sur ADMIN_PASSWORD.
function passwordsMatch(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/auth/admin/login — { password } -> { token }
router.post('/admin/login', async (req, res) => {
  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD non configuré côté serveur.' });
  }
  if (!password || typeof password !== 'string' || !passwordsMatch(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
  }
  const token = signToken({ role: 'admin' }, '12h');
  res.json({ token });
});

// POST /api/auth/promoteur/login — { username, password } -> { token, promoter }
router.post('/promoteur/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis.' });
  }
  try {
    const snap = await db.collection('promoters').where('username', '==', username.trim().toLowerCase()).limit(1).get();
    if (snap.empty) return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });

    const doc = snap.docs[0];
    const promoter = doc.data();

    if (promoter.active === false) {
      return res.status(403).json({ error: 'Ce compte promoteur a été désactivé.' });
    }

    const valid = await bcrypt.compare(password, promoter.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });

    const token = signToken({ role: 'promoteur', promoterId: doc.id, displayName: promoter.displayName }, '30d');
    res.json({ token, promoter: { id: doc.id, username: promoter.username, displayName: promoter.displayName } });
  } catch (err) {
    console.error('POST /api/auth/promoteur/login', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

module.exports = router;
