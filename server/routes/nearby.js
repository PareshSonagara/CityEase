// server/routes/nearby.js
const express = require('express');
const router  = express.Router();

const NEARBY_PLACES = [
  {
    id: 'np1', name: 'City General Hospital', type: 'hospital', icon: '🏥',
    distanceKm: 0.8, features: ['Emergency', 'OPD', '24/7'],
    hours: '24/7', phone: '020-26127302',
    lat: 18.5247, lng: 73.8553,
  },
  {
    id: 'np2', name: 'Central Bus Stand (Pune)', type: 'transport', icon: '🚌',
    distanceKm: 1.2, features: ['42 Routes', 'Intercity', 'Local'],
    hours: '5am–11pm', phone: '020-26126218',
    lat: 18.5196, lng: 73.8553,
  },
  {
    id: 'np3', name: 'Municipal Corporation Office', type: 'office', icon: '🏛️',
    distanceKm: 1.5, features: ['Certificates', 'Tax', 'Complaints'],
    hours: 'Mon–Sat 10am–5pm', phone: '020-25501000',
    lat: 18.5167, lng: 73.8561,
  },
  {
    id: 'np4', name: 'Metro Station — Civil Lines', type: 'transport', icon: '🚉',
    distanceKm: 2.0, features: ['Metro L1', 'AC Coaches', 'Every 5 min'],
    hours: '6am–10pm', phone: null,
    lat: 18.5285, lng: 73.8634,
  },
  {
    id: 'np5', name: 'MSEDCL Bill Payment Center', type: 'utility', icon: '💡',
    distanceKm: 2.3, features: ['Electricity', 'Water', 'Gas'],
    hours: 'Mon–Fri 9am–6pm', phone: '1800-200-3435',
    lat: 18.5134, lng: 73.8571,
  },
  {
    id: 'np6', name: 'District Hospital (Sassoon)', type: 'hospital', icon: '🏥',
    distanceKm: 2.8, features: ['Specialist OPD', 'Surgery', 'ICU'],
    hours: '24/7', phone: '020-26128000',
    lat: 18.5185, lng: 73.8571,
  },
  {
    id: 'np7', name: 'Post Office (GPO)', type: 'office', icon: '🏛️',
    distanceKm: 3.1, features: ['Aadhaar', 'PAN', 'Banking'],
    hours: 'Mon–Sat 9am–5pm', phone: '020-25508888',
    lat: 18.5204, lng: 73.8597,
  },
  {
    id: 'np8', name: 'Police Station — Shivajinagar', type: 'office', icon: '👮',
    distanceKm: 3.4, features: ['FIR', 'Passport Verification', 'NOC'],
    hours: '24/7', phone: '020-25535000',
    lat: 18.5312, lng: 73.8552,
  },
];

// GET /api/nearby?filter=all
router.get('/', (req, res) => {
  const { filter = 'all' } = req.query;
  let data = NEARBY_PLACES;

  if (filter !== 'all') {
    data = NEARBY_PLACES.filter(p => p.type === filter);
  }

  const sorted = data.sort((a, b) => a.distanceKm - b.distanceKm);
  res.json({ success: true, count: sorted.length, data: sorted });
});

module.exports = router;
