// server/data/db.js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'cityease.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'default_user',
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    account_number TEXT,
    amount REAL NOT NULL,
    due_date TEXT NOT NULL,
    paid INTEGER DEFAULT 0,
    paid_at TEXT,
    icon TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'default_user',
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 10,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    reference TEXT
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'default_user',
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    urgent INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed default data if empty
const billCount = db.prepare('SELECT COUNT(*) as c FROM bills').get();
if (billCount.c === 0) {
  const insertBill = db.prepare(`
    INSERT INTO bills (id, type, provider, account_number, amount, due_date, paid, icon)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `);

  const today = new Date();
  const dueDate1 = new Date(today); dueDate1.setDate(today.getDate() + 3);
  const dueDate2 = new Date(today); dueDate2.setDate(today.getDate() + 7);
  const dueDate3 = new Date(today); dueDate3.setDate(today.getDate() + 12);

  insertBill.run('bill-1', 'electricity', 'MSEDCL', 'MH-4820199', 847, dueDate1.toISOString().split('T')[0], '⚡');
  insertBill.run('bill-2', 'water', 'PCMC', 'WS-1029847', 497, dueDate2.toISOString().split('T')[0], '💧');
  insertBill.run('bill-3', 'gas', 'MGL', 'GAS-3871029', 634, dueDate3.toISOString().split('T')[0], '🔥');
}

const appCount = db.prepare('SELECT COUNT(*) as c FROM applications').get();
if (appCount.c === 0) {
  const insertApp = db.prepare(`
    INSERT INTO applications (id, service_id, service_name, status, progress, reference, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const d1 = new Date(); d1.setDate(d1.getDate() - 5);
  const d2 = new Date(); d2.setDate(d2.getDate() - 12);
  const d3 = new Date(); d3.setDate(d3.getDate() - 20);

  insertApp.run('app-1', 'aadhaar', 'Aadhaar Card Update', 'in_review', 80, 'AADHAAR-2024-8391', d1.toISOString());
  insertApp.run('app-2', 'ration-card', 'Ration Card New', 'pending_docs', 45, 'RATION-2024-3847', d2.toISOString());
  insertApp.run('app-3', 'property-tax', 'Property Tax FY2025', 'completed', 100, 'PROP-2024-1029', d3.toISOString());
}

const remCount = db.prepare('SELECT COUNT(*) as c FROM reminders').get();
if (remCount.c === 0) {
  const insertRem = db.prepare(`
    INSERT INTO reminders (id, title, description, due_date, urgent)
    VALUES (?, ?, ?, ?, ?)
  `);
  const d1 = new Date(); d1.setDate(d1.getDate() + 3);
  const d2 = new Date(); d2.setDate(d2.getDate() + 5);
  const d3 = new Date(); d3.setDate(d3.getDate() + 7);

  insertRem.run('rem-1', 'Electricity bill due soon', 'Pay ₹847 to MSEDCL', d1.toISOString().split('T')[0], 1);
  insertRem.run('rem-2', 'Doctor appointment', 'City Hospital — 10 AM', d2.toISOString().split('T')[0], 0);
  insertRem.run('rem-3', 'Ration card documents', 'Submit pending documents to office', d3.toISOString().split('T')[0], 0);
}

module.exports = db;
