const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 4000;

// SQLite DB
const db = new Database("social.db");

// Create tables if not exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    content TEXT,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

app.use(express.static("public"));
app.use(express.json());

// Get all posts
app.get("/api/posts", (req, res) => {
  const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  res.json(posts);
});

// Add a new post
app.post("/api/posts", (req, res) => {
  const { username, content } = req.body;
  db.prepare("INSERT INTO posts (username, content) VALUES (?, ?)").run(username, content);
  res.json({ message: "Post added" });
});

// Like a post
app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  db.prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?").run(id);
  res.json({ message: "Post liked" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
