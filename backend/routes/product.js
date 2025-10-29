// routes/products.js
const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT id, name, price FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;
