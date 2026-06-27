require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const catalogRouter = require('./routes/catalog');
const authRouter = require('./routes/auth');
const promotersRouter = require('./routes/promoters');
const leadsRouter = require('./routes/leads');
const couponsRouter = require('./routes/coupons');

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
}));
app.use(express.json({ limit: '2mb' }));

app.use(rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false }));

const authLimiter = rateLimit({ windowMs: 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

app.get('/health', (req, res) => res.json({ ok: true, service: 'catalogue-cookafrica-api' }));

app.use('/api/catalog', catalogRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/promoters', promotersRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/coupons', couponsRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`catalogue-cookafrica-api listening on :${PORT}`);
});
