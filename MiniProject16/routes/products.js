const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '../db/products.db'), { readonly: true });

const router = express.Router();

router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

module.exports = router;

