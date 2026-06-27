const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function signToken(payload, expiresIn) {
  if (!SECRET) throw new Error('JWT_SECRET manquant.');
  return jwt.sign(payload, SECRET, { expiresIn });
}

function verifyToken(token) {
  if (!SECRET) throw new Error('JWT_SECRET manquant.');
  return jwt.verify(token, SECRET);
}

// Middleware : exige un JWT valide portant le rôle demandé.
// Pose req.auth = { role, promoterId?, username? } si valide.
function requireRole(role) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Authentification requise.' });
    try {
      const decoded = verifyToken(token);
      if (decoded.role !== role) return res.status(403).json({ error: 'Accès refusé.' });
      req.auth = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Session invalide ou expirée.' });
    }
  };
}

// Décode le JWT promoteur s'il est présent, sans bloquer la requête si absent/invalide.
// Utilisé sur les routes publiques qui se comportent différemment pour un promoteur connecté.
function optionalPromoterAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace(/^Bearer\s+/i, '');
  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded.role === 'promoteur') req.auth = decoded;
    } catch (_) { /* jeton absent/invalide : on continue en anonyme */ }
  }
  next();
}

module.exports = { signToken, verifyToken, requireRole, optionalPromoterAuth };
