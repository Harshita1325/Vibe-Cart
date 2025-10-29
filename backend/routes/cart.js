// routes/cart.js
const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET /api/cart -> items + total
router.get('/', (req, res) => {
  const sql = `
    SELECT c.id, c.productId, c.qty, p.name, p.price, (c.qty * p.price) as lineTotal
    FROM cart_items c
    JOIN products p ON p.id = c.productId
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    const total = rows.reduce((s, r) => s + r.lineTotal, 0);
    res.json({ items: rows, total });
  });
});

// POST /api/cart -> { productId, qty }
router.post('/', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty < 1) return res.status(400).json({ error: 'Invalid payload' });

  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const stmt = `INSERT INTO cart_items (id, productId, qty, createdAt) VALUES (?,?,?,?)`;
  db.run(stmt, [id, productId, qty, createdAt], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.status(201).json({ id, productId, qty });
  });
});

// DELETE /api/cart/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM cart_items WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: id });
  });
});

// PATCH /api/cart/:id  -> change quantity
router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  if (!qty || qty < 1) return res.status(400).json({ error: 'Invalid qty' });
  db.run('UPDATE cart_items SET qty = ? WHERE id = ?', [qty, id], function(err) {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ id, qty });
  });
});

// POST /api/checkout -> { cartItems, name, email } => receipt
router.post('/checkout', (req, res) => {
  const { cartItems, name, email } = req.body;
  if (!Array.isArray(cartItems) || !name || !email) return res.status(400).json({ error: 'Invalid payload' });

  // compute total from DB to avoid client tampering
  const placeholders = cartItems.map(() => '?').join(',');
  const productIds = cartItems.map(i => i.productId);
  if (productIds.length === 0) return res.status(400).json({ error: 'Cart empty' });

  const sql = `SELECT id, price FROM products WHERE id IN (${placeholders})`;
  db.all(sql, productIds, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });

    const priceMap = {};
    rows.forEach(r => priceMap[r.id] = r.price);
    let total = 0;
    for (const item of cartItems) {
      const p = priceMap[item.productId];
      if (!p) return res.status(400).json({ error: 'Product not found: ' + item.productId });
      total += p * item.qty;
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const payload = JSON.stringify({ cartItems, name, email });
    db.run('INSERT INTO receipts (id, total, payload, createdAt) VALUES (?,?,?,?)', [id, total, payload, createdAt], function(err2) {
      if (err2) return res.status(500).json({ error: 'DB error' });

      // Optionally clear cart (for simplicity let's clear all)
      db.run('DELETE FROM cart_items', [], () => {
        res.json({ receipt: { id, total, createdAt, name, email } });
      });
    });
  });
});

module.exports = router;
