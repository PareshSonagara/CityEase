// server/routes/chat.js
const express = require('express');
const router  = express.Router();

// Knowledge base for the chatbot
const KB = {
  greetings: [
    "Hello! 👋 I'm **Sakhi**, your personal City Guide. I can help you with urban services — bus routes to birth certificates. What do you need today?",
    "Hi there! 👋 I'm Sakhi. Ask me anything about city services, government documents, bills, transport, or healthcare!"
  ],
  responses: {
    'birth certificate': `📄 **Birth Certificate — Step by Step**\n\n**Documents needed:**\n• Hospital birth record / discharge summary\n• Parents' Aadhaar card copies\n• Parents' marriage certificate\n• Address proof\n\n**Process:** Visit your Municipal Corporation or apply online.\n\n⏱ **Time:** 7–10 working days\n💰 **Cost:** Free (within 21 days) | ₹50 after 21 days`,
    'electricity bill': `💡 **Pay Electricity Bill Online**\n\n1. Click *Utility Payments* menu\n2. Select **Electricity** and your provider (MSEDCL/DGVCL)\n3. Enter your **Consumer Number** from your bill\n4. View outstanding amount and due date\n5. Pay via **UPI, Card or Net Banking**\n6. Download receipt instantly!\n\n💡 Tip: Set up auto-pay reminders on your dashboard!`,
    'water bill': `💧 **Water Bill Payment**\n\n1. Go to **Utility Payments → Water**\n2. Select your municipality (PCMC/AMC/VMC)\n3. Enter Water Account Number\n4. Pay via UPI/Card\n5. Get SMS confirmation\n\nPay before due date to avoid late fees!`,
    'hospital': `🏥 **Nearest Government Hospitals**\n\n• **City General Hospital** — 0.8 km | 24/7 Emergency\n• **Sassoon General Hospital** — 2.1 km | Specialist OPD\n• **District Hospital** — 3.0 km | Multi-specialty\n\n📍 Use the **Location Map** section for exact directions.\n📞 Emergency: Call **108** for ambulance`,
    'ration card': `🛒 **Ration Card Application**\n\n**Documents needed:**\n• Aadhaar card (all family members)\n• Address proof (electricity bill/rent agreement)\n• Income certificate\n• Family passport-size photo\n\n**Apply at:** nfsa.gov.in or Taluka Food Office\n⏱ **Time:** 15–30 days | 💰 **Cost:** Free`,
    'bus': `🚌 **Bus Route Information**\n\n**Popular Routes:**\n• Bus 42 — Shivajinagar ↔ Hadapsar (every 15 min)\n• Bus 156 — Kothrud ↔ Hinjawadi (every 20 min)\n• Metro L1 — PCMC ↔ Swargate (every 5 min)\n\n**For monthly pass:** Visit any bus depot with photo + ID\n💰 Pass cost: ₹300–₹600/month`,
    'aadhaar': `🪪 **Aadhaar Update Process**\n\n1. Visit **myaadhaar.uidai.gov.in**\n2. Login with Aadhaar + OTP\n3. Select what to update (address/name/mobile)\n4. Upload proof document\n5. Pay **₹50** via UPI/Card\n6. Note your Service Request Number (SRN)\n\n⏱ Updated in 7–14 days. Download from UIDAI website.`,
    'property tax': `🏠 **Property Tax Payment**\n\n1. Go to **Municipal Services → Property Tax**\n2. Enter your **Property Account Number**\n3. View outstanding dues and history\n4. Pay via UPI/Card\n5. Download receipt with unique transaction ID\n\n💡 Pay before March 31 to avoid penalty!`,
    'pm awas': `🏘️ **PM Awas Yojana (PMAY)**\n\n**Eligibility:** Income < ₹3L (EWS) / ₹6L (LIG) / ₹12L (MIG-I) / ₹18L (MIG-II)\n\n**Documents:** Aadhaar, income certificate, bank details, no-house affidavit\n\n**Apply:** pmaymis.gov.in or nearest CSC\n⏱ **Subsidy:** Up to ₹2.67 lakh directly to bank account`,
    'metro': `🚇 **Metro Card Recharge**\n\n1. Go to **Transport → Metro Card**\n2. Enter 10-digit card number\n3. Choose recharge amount or monthly pass (₹600–₹1200)\n4. Pay via UPI/Card\n5. Reflects within 15 minutes!`,
    'scheme': `🏅 **Government Schemes for You**\n\nBased on your profile, explore:\n• **PM Awas Yojana** — Housing subsidy\n• **Pradhan Mantri Jan Dhan** — Free bank account\n• **Ayushman Bharat** — Free health insurance ₹5L\n• **PM Kisan** — ₹6000/year for farmers\n• **PM SVANidhi** — Working capital for street vendors\n\nCheck eligibility for each on the Services page!`,
  },
  fallback: (msg) => `I understand you're asking about: "*${msg}*"\n\n🔍 Let me help you find the right information. You can ask about:\n• **Bus routes or transport passes**\n• **Bill payments** (electricity, water, gas)\n• **Government documents** (Aadhaar, ration card, birth certificate)\n• **Nearby hospitals** and appointments\n• **Government schemes** and subsidies\n\nOr use the **Search bar** for quick results!`,
};

function findResponse(message) {
  const lower = message.toLowerCase();

  // Check greetings
  if (/^(hi|hello|hey)/i.test(lower)) {
    return KB.greetings[0];
  }

  // Keyword matching
  const matches = {
    'birth certificate': ['birth', 'certificate', 'cert'],
    'electricity bill': ['electric', 'electricity', 'bill', 'msedcl', 'light', 'power'],
    'water bill': ['water', 'pcmc', 'jal', 'water bill'],
    'hospital': ['hospital', 'doctor', 'health', 'medical', 'opd', 'clinic', 'near me'],
    'ration card': ['ration', 'food', 'bpl', 'apl', 'nfsa'],
    'bus': ['bus', 'route', 'metro', 'transport', 'travel', 'pass', 'ticket', 'commute'],
    'aadhaar': ['aadhaar', 'aadhar', 'uid', 'update', 'address change'],
    'property tax': ['property', 'tax', 'house tax'],
    'pm awas': ['awas', 'housing', 'house', 'home', 'pmay', 'scheme'],
    'metro': ['metro', 'recharge', 'card', 'metro pass'],
    'scheme': ['scheme', 'yojana', 'benefit', 'subsidy', 'government help'],
  };

  for (const [key, keywords] of Object.entries(matches)) {
    if (keywords.some(kw => lower.includes(kw))) {
      const r = KB.responses?.[key];
      if (r) return r;
    }
  }

  return KB.fallback(message);
}

// POST /api/chat
router.post('/', (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  // Simulate AI processing time (100-400ms)
  const delay = 100 + Math.random() * 300;

  setTimeout(() => {
    const response = findResponse(message);
    res.json({
      success:   true,
      message:   response,
      timestamp: new Date().toISOString(),
    });
  }, delay);
});

module.exports = router;
