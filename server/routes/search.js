// server/routes/search.js
const express  = require('express');
const router   = express.Router();
const services = require('../data/services.json');

const SEARCH_CORPUS = [
  // Service-based entries
  ...services.map(s => ({
    type: 'service',
    id: s.id,
    keywords: [
      s.name,
      s.description,
      ...s.tags,
    ].join(' ').toLowerCase(),
    result: () => ({
      type: 'service',
      id: s.id,
      icon: s.icon,
      title: s.name,
      description: s.description,
      cost: s.cost,
      time: s.time,
      url: `/service/${s.id}`,
    })
  })),

  // FAQ-based entries
  {
    type: 'faq',
    id: 'faq-birth-doc',
    keywords: 'birth certificate documents required what needed age child hospital record',
    result: () => ({
      type: 'faq',
      icon: '❓',
      title: 'Documents for Birth Certificate',
      description: 'Hospital record, parents Aadhaar, marriage certificate',
      url: '/service/birth-certificate',
    })
  },
  {
    type: 'faq',
    id: 'faq-bill-late',
    keywords: 'electricity bill late penalty overdue missed due fine',
    result: () => ({
      type: 'faq',
      icon: '⚡',
      title: 'Late Electricity Bill Penalty',
      description: 'Late payment attracts 1.5% monthly surcharge. Pay now to avoid disconnection.',
      url: '/service/electricity-bill',
    })
  },
  {
    type: 'faq',
    id: 'faq-ration-eligibility',
    keywords: 'ration card eligibility who can apply income limit criteria bpl apl',
    result: () => ({
      type: 'faq',
      icon: '🛒',
      title: 'Ration Card Eligibility',
      description: 'BPL: Annual income < ₹27,000. APL: Any resident with valid address proof.',
      url: '/service/ration-card',
    })
  },
  {
    type: 'quick',
    id: 'quick-hospital',
    keywords: 'hospital near me nearby doctor emergency ambulance health',
    result: () => ({
      type: 'quick',
      icon: '🏥',
      title: 'Nearest Hospital',
      description: 'City General Hospital — 0.8 km, 24/7 Emergency available',
      url: '/#location',
    })
  },
];

// Simple search scoring
function scoreMatch(corpus, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (!terms.length) return 0;
  const keyLen = corpus.keywords.length;
  let hits = 0;
  for (const term of terms) {
    if (corpus.keywords.includes(term)) hits += 2; // exact
    else if (corpus.keywords.includes(term.substring(0, term.length - 1))) hits += 1; // stem
  }
  return hits / terms.length;
}

// GET /api/search?q=query&lang=en
router.get('/', (req, res) => {
  const { q = '' } = req.query;

  if (!q.trim()) {
    return res.json({ success: true, query: q, count: 0, data: [] });
  }

  const scored = SEARCH_CORPUS
    .map(c => ({ ...c, score: scoreMatch(c, q) }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(c => c.result());

  res.json({ success: true, query: q, count: scored.length, data: scored });
});

module.exports = router;
