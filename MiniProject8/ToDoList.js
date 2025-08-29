
import React, { useState } from "react";

function TodoApp() {
  const [task, setTask] = useState("");       // input field state
  const [tasks, setTasks] = useState([]);     // list of tasks

  // Add task
  const addTask = () => {
    if (task.trim() === "") return; // prevent empty
    setTasks([...tasks, task]);
    setTask(""); // clear input
  };

  // Delete task by index
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div style={{ margin: "20px", fontFamily: "Arial" }}>
      <h2>📝 To-Do List</h2>

      {/* Input + Add button */}
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)} // handling input change
      />
      <button onClick={addTask}>Add</button>

      {/* Render list */}
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            {t}
            <button
              onClick={() => deleteTask(index)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
