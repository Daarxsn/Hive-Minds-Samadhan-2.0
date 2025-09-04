const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 4243; // new port so it doesn't clash with previous project

// DB
const db = new Database("tasks.db");

// tables
db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(board_id) REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  assignee TEXT DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE
);
`);

// seed (one board with 3 lists) only if empty
const boardCount = db.prepare("SELECT COUNT(*) as c FROM boards").get().c;
if (boardCount === 0) {
  const insBoard = db.prepare("INSERT INTO boards (name) VALUES (?)");
  const boardId = insBoard.run("My Project").lastInsertRowid;

  const insList = db.prepare("INSERT INTO lists (board_id, name, position) VALUES (?, ?, ?)");
  const todoId = insList.run(boardId, "To Do", 0).lastInsertRowid;
  const doingId = insList.run(boardId, "In Progress", 1).lastInsertRowid;
  const doneId  = insList.run(boardId, "Done", 2).lastInsertRowid;

  const insCard = db.prepare("INSERT INTO cards (list_id, title, description, assignee, position) VALUES (?, ?, ?, ?, ?)");
  insCard.run(todoId,  "Set up repo", "init git + readme", "Ava", 0);
  insCard.run(todoId,  "Design wireframe", "low-fi screens", "Jay", 1);
  insCard.run(doingId, "Build API", "lists/cards endpoints", "Sam", 0);
  insCard.run(doneId,  "Project kickoff", "align goals", "Team", 0);

  console.log("✅ Seeded board/lists/cards");
}

app.use(express.json());
app.use(express.static("public"));

/** utils */
const getBoardTree = (boardId) => {
  const board = db.prepare("SELECT * FROM boards WHERE id = ?").get(boardId);
  const lists = db.prepare("SELECT * FROM lists WHERE board_id = ? ORDER BY position ASC").all(boardId);
  const cardsStmt = db.prepare("SELECT * FROM cards WHERE list_id = ? ORDER BY position ASC");
  const withCards = lists.map(l => ({...l, cards: cardsStmt.all(l.id)}));
  return { board, lists: withCards };
};

// routes
app.get("/api/board", (req, res) => {
  // single board demo
  const b = db.prepare("SELECT id FROM boards LIMIT 1").get();
  res.json(getBoardTree(b.id));
});

app.post("/api/cards", (req, res) => {
  const { list_id, title, description = "", assignee = "" } = req.body;
  const maxPos = db.prepare("SELECT COALESCE(MAX(position), -1) AS m FROM cards WHERE list_id = ?").get(list_id).m;
  const insert = db.prepare(`
    INSERT INTO cards (list_id, title, description, assignee, position)
    VALUES (?, ?, ?, ?, ?)
  `).run(list_id, title, description, assignee, maxPos + 1);
  res.json({ id: insert.lastInsertRowid });
});

app.patch("/api/cards/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, assignee } = req.body;
  db.prepare(`
    UPDATE cards SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      assignee = COALESCE(?, assignee)
    WHERE id = ?
  `).run(title, description, assignee, id);
  res.json({ ok: true });
});

app.delete("/api/cards/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM cards WHERE id = ?").run(id);
  res.json({ ok: true });
});

// move / reorder card
app.post("/api/cards/:id/move", (req, res) => {
  const { id } = req.params;
  const { to_list_id, to_position } = req.body;

  const card = db.prepare("SELECT * FROM cards WHERE id = ?").get(id);
  if (!card) return res.status(404).json({ error: "Card not found" });

  const oldList = card.list_id;
  const newList = to_list_id;

  const tx = db.transaction(() => {
    // shift positions in destination list at/after to_position
    db.prepare(`
      UPDATE cards SET position = position + 1
      WHERE list_id = ? AND position >= ?
    `).run(newList, to_position);

    // remove gap from source list (if list changed)
    if (oldList === newList) {
      // same list reorder: remove old slot first
      db.prepare(`
        UPDATE cards SET position = position - 1
        WHERE list_id = ? AND position > ?
      `).run(oldList, card.position);
    } else {
      db.prepare(`
        UPDATE cards SET position = position - 1
        WHERE list_id = ? AND position > ?
      `).run(oldList, card.position);
    }

    // move card
    db.prepare(`
      UPDATE cards SET list_id = ?, position = ?
      WHERE id = ?
    `).run(newList, to_position, id);
  });

  tx();
  res.json({ ok: true });
});

// create list (optional)
app.post("/api/lists", (req, res) => {
  const { name } = req.body;
  const b = db.prepare("SELECT id FROM boards LIMIT 1").get();
  const maxPos = db.prepare("SELECT COALESCE(MAX(position), -1) AS m FROM lists WHERE board_id = ?").get(b.id).m;
  const insert = db.prepare("INSERT INTO lists (board_id, name, position) VALUES (?, ?, ?)").run(b.id, name, maxPos + 1);
  res.json({ id: insert.lastInsertRowid });
});

// rename list
app.patch("/api/lists/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.prepare("UPDATE lists SET name = ? WHERE id = ?").run(name, id);
  res.json({ ok: true });
});

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🗂️  Task board on http://localhost:${PORT}`);
});

