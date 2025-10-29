// backend/server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// -------------------- Mock Database --------------------
let products = [
  { id: 1, name: "Wireless Headphones", price: 1999 },
  { id: 2, name: "Bluetooth Speaker", price: 1499 },
  { id: 3, name: "Smartwatch", price: 2999 },
  { id: 4, name: "Laptop Stand", price: 899 },
  { id: 5, name: "USB-C Hub", price: 1299 },
];

let cart = [];

// -------------------- API Routes --------------------

// ✅ Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ✅ Get cart items and total
app.get("/api/cart", (req, res) => {
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + product.price * item.qty;
  }, 0);

  res.json({ cart, total });
});

// ✅ Add item to cart
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty });
  }

  res.json({ message: "Item added to cart", cart });
});

// ✅ Remove item from cart
app.delete("/api/cart/:id", (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.productId !== id);
  res.json({ message: "Item removed", cart });
});

// ✅ Mock Checkout
app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + product.price * item.qty;
  }, 0);

  const receipt = {
    total,
    timestamp: new Date().toLocaleString(),
  };

  cart = []; // Clear cart after checkout
  res.json({ message: "Checkout successful", receipt });
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
