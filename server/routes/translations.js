// server/routes/translations.js
const express      = require('express');
const router       = express.Router();
const translations = require('../data/translations.json');

// GET /api/translations
router.get('/', (req, res) => {
  res.json({ success: true, lang: 'en', data: translations });
});

module.exports = router;
