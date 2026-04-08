// server/index.js — CityEase Express Server
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// ── CORS ────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: isDev ? true : allowedOrigins,
  credentials: true,
}));

// ── Middleware ───────────────────────────
app.use(express.json());

// ── API Routes ───────────────────────────
app.use('/api/services',     require('./routes/services'));
app.use('/api/search',       require('./routes/search'));
app.use('/api/chat',         require('./routes/chat'));
app.use('/api/transit',      require('./routes/transit'));
app.use('/api/bills',        require('./routes/bills'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/translations', require('./routes/translations'));
app.use('/api/nearby',       require('./routes/nearby'));
app.use('/api/emergency',    require('./routes/emergency'));
app.use('/api/reminders',    require('./routes/reminders'));

// ── Health Check ─────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV || 'development' });
});

// ── Serve React Build in Production ──────
if (!isDev) {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// ── 404 Handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// ── Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏙️  CityEase API  →  http://localhost:${PORT}`);
  console.log(`📊  Health check  →  http://localhost:${PORT}/api/health`);
  if (!isDev) console.log(`🌐  Serving React build from /client/dist`);
  console.log();
});
