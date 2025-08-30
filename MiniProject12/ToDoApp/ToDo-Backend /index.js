const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let todos = [
  { id: 1, text: 'Learn React' },
  { id: 2, text: 'Build a To-Do App' },
];

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newTodo = { id: Date.now(), text };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Delete a todo by id
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).send();
});

const PORT = 4000;
app.get('/', (req, res) => {
  res.send('To-Do API is running');
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

