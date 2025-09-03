const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 4242;

// Connect to SQLite database
const db = new Database("store.db");

// Create tables if not exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT,
    total INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Insert some products (only if table is empty)
const count = db.prepare("SELECT COUNT(*) AS c FROM products").get().c;
if (count === 0) {
  const insert = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
  insert.run("Product 1", 500);
  insert.run("Product 2", 700);
  insert.run("Product 3", 1000);
  console.log("✅ Sample products inserted into database.");
}

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Route: Get products
app.get("/api/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

// Route: Save order
app.post("/api/order", (req, res) => {
  const { items, total } = req.body;
  db.prepare("INSERT INTO orders (items, total) VALUES (?, ?)")
    .run(JSON.stringify(items), total);
  res.json({ message: "✅ Order saved successfully" });
});

// Default route - serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

