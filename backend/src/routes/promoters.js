const express = require('express');
const bcrypt = require('bcryptjs');
const { db, admin } = require('../firebase-admin');
const { requireRole } = require('../lib/auth');

const router = express.Router();

function serialize(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    username: data.username,
    displayName: data.displayName,
    active: data.active !== false,
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt ?? null,
  };
}

// GET /api/promoters — liste des chefs promoteurs (admin)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const snap = await db.collection('promoters').orderBy('createdAt', 'desc').get();
    const promoters = snap.docs.map(serialize);

    // Compte le nombre de fiches collectées par promoteur (en une passe).
    const leadsSnap = await db.collection('leads').get();
    const counts = {};
    leadsSnap.forEach((d) => {
      const pid = d.data().promoterId;
      if (pid) counts[pid] = (counts[pid] || 0) + 1;
    });
    promoters.forEach((p) => { p.leadCount = counts[p.id] || 0; });

    res.json({ promoters });
  } catch (err) {
    console.error('GET /api/promoters', err);
    res.status(500).json({ error: 'Erreur lors de la lecture des promoteurs.' });
  }
});

// POST /api/promoters — { username, displayName, password } (admin)
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { username, displayName, password } = req.body || {};
    if (!username || !displayName || !password) {
      return res.status(400).json({ error: 'username, displayName et password sont requis.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }
    const normalizedUsername = username.trim().toLowerCase();

    const existing = await db.collection('promoters').where('username', '==', normalizedUsername).limit(1).get();
    if (!existing.empty) {
      return res.status(409).json({ error: 'Cet identifiant est déjà utilisé.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const docRef = await db.collection('promoters').add({
      username: normalizedUsername,
      displayName: displayName.trim(),
      passwordHash,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: docRef.id, username: normalizedUsername, displayName: displayName.trim(), active: true });
  } catch (err) {
    console.error('POST /api/promoters', err);
    res.status(500).json({ error: 'Erreur lors de la création du promoteur.' });
  }
});

// PATCH /api/promoters/:id — { active?, displayName?, password? } (admin)
router.patch('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { active, displayName, password } = req.body || {};
    const update = {};
    if (typeof active === 'boolean') update.active = active;
    if (typeof displayName === 'string' && displayName.trim()) update.displayName = displayName.trim();
    if (typeof password === 'string' && password) {
      if (password.length < 6) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
      update.passwordHash = await bcrypt.hash(password, 10);
    }
    if (!Object.keys(update).length) {
      return res.status(400).json({ error: 'Rien à mettre à jour.' });
    }
    await db.collection('promoters').doc(req.params.id).update(update);
    res.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/promoters/:id', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du promoteur.' });
  }
});

// DELETE /api/promoters/:id (admin)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    await db.collection('promoters').doc(req.params.id).delete();
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/promoters/:id', err);
    res.status(500).json({ error: 'Erreur lors de la suppression du promoteur.' });
  }
});

module.exports = router;
