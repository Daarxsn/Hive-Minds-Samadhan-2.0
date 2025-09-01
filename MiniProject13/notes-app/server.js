// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

/* ========== API ROUTES ========== */

// GET all notes
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CREATE a note
app.post('/api/notes', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  const sql = 'INSERT INTO notes (title, body) VALUES (?, ?)';
  db.run(sql, [title, body], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.get('SELECT * FROM notes WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(row);
    });
  });
});

// UPDATE a note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  const sql = 'UPDATE notes SET title = ?, body = ? WHERE id = ?';
  db.run(sql, [title, body, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Note not found' });

    db.get('SELECT * FROM notes WHERE id = ?', [id], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(row);
    });
  });
});

// DELETE a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Note not found' });
    res.status(204).end();
  });
});

/* ========== START SERVER ========== */
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
