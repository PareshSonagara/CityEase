// server/routes/reminders.js
const express = require('express');
const router  = express.Router();
const db      = require('../data/db');

router.get('/', (req, res) => {
  const rems = db.prepare(
    'SELECT * FROM reminders WHERE user_id = ? AND completed = 0 ORDER BY due_date ASC'
  ).all('default_user');
  res.json({ success: true, data: rems });
});

router.post('/:id/complete', (req, res) => {
  db.prepare('UPDATE reminders SET completed = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.post('/', (req, res) => {
  const { title, description, due_date, urgent = 0 } = req.body;
  const id = `rem-${Date.now()}`;
  db.prepare(
    'INSERT INTO reminders (id, title, description, due_date, urgent) VALUES (?,?,?,?,?)'
  ).run(id, title, description, due_date, urgent ? 1 : 0);
  const created = db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
  res.status(201).json({ success: true, data: created });
});

module.exports = router;
