// server/routes/emergency.js
const express = require('express');
const router  = express.Router();

const EMERGENCY_CONTACTS = {
  en: [
    { id: 'e1', name: 'Police',          number: '100',   icon: '👮', type: 'police',    color: '#3B82F6' },
    { id: 'e2', name: 'Fire Brigade',    number: '101',   icon: '🔥', type: 'fire',      color: '#EF4444' },
    { id: 'e3', name: 'Ambulance',       number: '108',   icon: '🚑', type: 'ambulance', color: '#10B981' },
    { id: 'e4', name: 'Women Helpline',  number: '1091',  icon: '👩', type: 'women',     color: '#EC4899' },
    { id: 'e5', name: 'Child Helpline',  number: '1098',  icon: '👶', type: 'child',     color: '#F59E0B' },
    { id: 'e6', name: 'Senior Citizen',  number: '14567', icon: '🧓', type: 'senior',    color: '#7C3AED' },
  ],
  hi: [
    { id: 'e1', name: 'पुलिस',           number: '100',   icon: '👮', type: 'police',    color: '#3B82F6' },
    { id: 'e2', name: 'फायर ब्रिगेड',   number: '101',   icon: '🔥', type: 'fire',      color: '#EF4444' },
    { id: 'e3', name: 'एम्बुलेंस',      number: '108',   icon: '🚑', type: 'ambulance', color: '#10B981' },
    { id: 'e4', name: 'महिला हेल्पलाइन',number: '1091',  icon: '👩', type: 'women',     color: '#EC4899' },
    { id: 'e5', name: 'बाल हेल्पलाइन', number: '1098',  icon: '👶', type: 'child',     color: '#F59E0B' },
    { id: 'e6', name: 'वरिष्ठ नागरिक', number: '14567', icon: '🧓', type: 'senior',    color: '#7C3AED' },
  ],
  gu: [
    { id: 'e1', name: 'પોલીસ',           number: '100',   icon: '👮', type: 'police',    color: '#3B82F6' },
    { id: 'e2', name: 'ફાયર બ્રિગેડ',  number: '101',   icon: '🔥', type: 'fire',      color: '#EF4444' },
    { id: 'e3', name: 'એમ્બ્યુલન્સ',   number: '108',   icon: '🚑', type: 'ambulance', color: '#10B981' },
    { id: 'e4', name: 'મહિલા હેલ્પ.',  number: '1091',  icon: '👩', type: 'women',     color: '#EC4899' },
    { id: 'e5', name: 'બાળ હેલ્પ.',    number: '1098',  icon: '👶', type: 'child',     color: '#F59E0B' },
    { id: 'e6', name: 'વ. ન.',          number: '14567', icon: '🧓', type: 'senior',    color: '#7C3AED' },
  ],
};

router.get('/', (req, res) => {
  const { lang = 'en' } = req.query;
  const contacts = EMERGENCY_CONTACTS[lang] || EMERGENCY_CONTACTS.en;
  res.json({ success: true, data: contacts });
});

module.exports = router;
