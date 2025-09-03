const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'products.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price INTEGER,
    image TEXT
  );
`);

const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)');
  insert.run('Classic T-Shirt', 'Comfortable cotton t-shirt', 499, '/img/tshirt.png');
  insert.run('Running Shoes', 'Lightweight shoes', 2999, '/img/shoes.png');
  insert.run('Coffee Mug', 'Ceramic mug 350ml', 299, '/img/mug.png');
  console.log('✅ Products added!');
} else {
  console.log('Products already exist.');
}

db.close();

