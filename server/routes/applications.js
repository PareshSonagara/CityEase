// server/routes/applications.js
const express = require('express');
const router  = express.Router();
const db      = require('../data/db');

// GET /api/applications
router.get('/', (req, res) => {
  const apps = db.prepare(
    'SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC'
  ).all('default_user');
  res.json({ success: true, data: apps });
});

// GET /api/applications/:id
router.get('/:id', (req, res) => {
  const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  if (!app) return res.status(404).json({ success: false, error: 'Application not found' });
  res.json({ success: true, data: app });
});

// POST /api/applications
router.post('/', (req, res) => {
  const { service_id, service_name } = req.body;
  if (!service_id || !service_name) {
    return res.status(400).json({ success: false, error: 'service_id and service_name required' });
  }

  const id        = `app-${Date.now()}`;
  const reference = `${service_id.toUpperCase().substring(0, 5)}-${Date.now()}`;

  db.prepare(
    `INSERT INTO applications (id, service_id, service_name, status, progress, reference)
     VALUES (?, ?, ?, 'submitted', 10, ?)`
  ).run(id, service_id, service_name, reference);

  const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
  res.status(201).json({ success: true, data: created, message: 'Application submitted successfully' });
});

// PATCH /api/applications/:id — update status
router.patch('/:id', (req, res) => {
  const { status, progress } = req.body;
  db.prepare(
    'UPDATE applications SET status = ?, progress = ?, updated_at = ? WHERE id = ?'
  ).run(status, progress, new Date().toISOString(), req.params.id);

  const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

module.exports = router;
