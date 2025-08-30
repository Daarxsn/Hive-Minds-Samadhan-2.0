import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(console.error);
  }, []);

  // Add new todo
  const addTodo = () => {
    if (!newTodo.trim()) return;

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    })
      .then(res => res.json())
      .then(todo => {
        setTodos([...todos, todo]);
        setNewTodo('');
      })
      .catch(console.error);
  };

  // Delete todo
  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>To-Do List</h1>
      <input
        type="text"
        placeholder="Add new todo"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button onClick={addTodo} style={{ width: '100%', padding: 8 }}>
        Add
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} style={{ color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

