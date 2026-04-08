// server/routes/bills.js
const express = require('express');
const router  = express.Router();
const db      = require('../data/db');

// GET /api/bills
router.get('/', (req, res) => {
  const bills = db.prepare(
    'SELECT * FROM bills WHERE user_id = ? ORDER BY paid ASC, due_date ASC'
  ).all('default_user');

  res.json({ success: true, data: bills });
});

// GET /api/bills/:id
router.get('/:id', (req, res) => {
  const bill = db.prepare('SELECT * FROM bills WHERE id = ?').get(req.params.id);
  if (!bill) return res.status(404).json({ success: false, error: 'Bill not found' });
  res.json({ success: true, data: bill });
});

// POST /api/bills/:id/pay
router.post('/:id/pay', (req, res) => {
  const bill = db.prepare('SELECT * FROM bills WHERE id = ?').get(req.params.id);
  if (!bill) return res.status(404).json({ success: false, error: 'Bill not found' });
  if (bill.paid) return res.json({ success: true, message: 'Already paid', data: bill });

  db.prepare(
    'UPDATE bills SET paid = 1, paid_at = ? WHERE id = ?'
  ).run(new Date().toISOString(), req.params.id);

  const updated = db.prepare('SELECT * FROM bills WHERE id = ?').get(req.params.id);
  res.json({
    success:    true,
    message:    'Payment successful',
    receiptId:  `RCPT-${Date.now()}`,
    data:       updated,
  });
});

// POST /api/bills (add new bill)
router.post('/', (req, res) => {
  const { type, provider, account_number, amount, due_date, icon } = req.body;
  const id = `bill-${Date.now()}`;

  db.prepare(
    'INSERT INTO bills (id, type, provider, account_number, amount, due_date, icon) VALUES (?,?,?,?,?,?,?)'
  ).run(id, type, provider, account_number, amount, due_date, icon || '💡');

  const created = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
  res.status(201).json({ success: true, data: created });
});

module.exports = router;
