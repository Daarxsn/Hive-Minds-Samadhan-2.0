
// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// The database file will live next to this script
const dbPath = path.join(__dirname, 'notes.db');

// Open (or create) the database file
const db = new sqlite3.Database(dbPath);

// Make sure we have a notes table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
