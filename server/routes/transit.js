// server/routes/transit.js — Live Transit Mock
const express = require('express');
const router  = express.Router();

const BASE_ROUTES = [
  { id: 't1', route: 'Bus 42',   destination: 'Shivajinagar',  type: 'bus',   startMinutes: 8,  frequency: 15 },
  { id: 't2', route: 'Bus 156',  destination: 'Hadapsar',      type: 'bus',   startMinutes: 22, frequency: 20 },
  { id: 't3', route: 'Metro L1', destination: 'PCMC',          type: 'metro', startMinutes: 5,  frequency: 5  },
  { id: 't4', route: 'Bus 68',   destination: 'Kothrud',       type: 'bus',   startMinutes: 38, frequency: 30 },
  { id: 't5', route: 'Metro L2', destination: 'Swargate',      type: 'metro', startMinutes: 12, frequency: 8  },
  { id: 't6', route: 'Bus 99',   destination: 'Hinjawadi',     type: 'bus',   startMinutes: 45, frequency: 25 },
];

function generateLiveTimes() {
  const now      = new Date();
  const secsSinceMidnight = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();

  return BASE_ROUTES.map(r => {
    const offset  = (secsSinceMidnight % (r.frequency * 60));
    const minutes = Math.max(1, r.frequency - Math.floor(offset / 60));
    const isNextSoon = minutes <= 3;

    return {
      id:          r.id,
      route:       r.route,
      destination: r.destination,
      type:        r.type,
      minutesAway: minutes,
      status:      isNextSoon ? 'arriving' : 'on_time',
      platform:    r.type === 'metro' ? `Platform ${Math.ceil(BASE_ROUTES.indexOf(r) / 2) + 1}` : null,
      updatedAt:   now.toISOString(),
    };
  }).sort((a, b) => a.minutesAway - b.minutesAway);
}

// GET /api/transit
router.get('/', (req, res) => {
  res.json({
    success:   true,
    data:      generateLiveTimes(),
    updatedAt: new Date().toISOString(),
  });
});

module.exports = router;
