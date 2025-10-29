// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, 'data', 'vibe.db');
const fs = require('fs');
const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const db = new sqlite3.Database(dbFile);

const init = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        productId TEXT,
        qty INTEGER,
        createdAt TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY,
        total REAL,
        payload TEXT,
        createdAt TEXT
      )
    `);

    // seed products if empty
    db.get('SELECT COUNT(1) as c FROM products', (err, row) => {
      if (err) return console.error(err);
      if (row.c === 0) {
        const products = [
          ['p1','Aeropress Coffee Maker', 29.99],
          ['p2','Ceramic Mug', 9.5],
          ['p3','Stainless Travel Tumbler', 19.99],
          ['p4','Espresso Beans 1kg', 24.0],
          ['p5','Cold Brew Bottle', 15.0]
        ];
        const stmt = db.prepare('INSERT INTO products (id,name,price) VALUES (?,?,?)');
        products.forEach(p => stmt.run(...p));
        stmt.finalize();
      }
    });
  });
};

module.exports = { db, init };
