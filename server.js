// server.js — FleetFlow Backend Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./database/schema');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (dev)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Initialize DB ──────────────────────────────────────────────────────────
initDb();

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/vehicles',    require('./routes/vehicles'));
app.use('/api/drivers',     require('./routes/drivers'));
app.use('/api/trips',       require('./routes/trips'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/fuel',        require('./routes/fuel'));
app.use('/api/analytics',   require('./routes/analytics'));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚛 FleetFlow backend running on http://localhost:${PORT}`);
  console.log(`   API base: http://localhost:${PORT}/api`);
  console.log(`   To seed demo data: npm run seed`);
});
