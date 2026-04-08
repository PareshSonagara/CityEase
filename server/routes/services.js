// server/routes/services.js
const express  = require('express');
const router   = express.Router();
const services = require('../data/services.json');

// GET /api/services — list all services (with optional category filter)
router.get('/', (req, res) => {
  const { category } = req.query;

  let result = services.map(s => ({
    id:          s.id,
    category:    s.category,
    icon:        s.icon,
    color:       s.color,
    name:        s.name,
    description: s.description,
    cost:        s.cost,
    time:        s.time,
    mode:        s.mode,
    tags:        s.tags,
  }));

  if (category) result = result.filter(s => s.category === category);

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/services/categories — unique categories
router.get('/categories', (req, res) => {
  const cats = [...new Set(services.map(s => s.category))];
  res.json({ success: true, data: cats });
});

// GET /api/services/:id — single service with full details
router.get('/:id', (req, res) => {
  const svc = services.find(s => s.id === req.params.id);

  if (!svc) {
    return res.status(404).json({ success: false, error: 'Service not found' });
  }

  res.json({
    success: true,
    data: svc
  });
});

module.exports = router;
