const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON body in POST requests
app.use(express.json());

// Sample data (students list)
let students = [
  { id: 1, name: "Rohan", marks: 250 },
  { id: 2, name: "Priya", marks: 270 },
  { id: 3, name: "Aman", marks: 160 }
];

// GET route - return all students
app.get("/students", (req, res) => {
  res.json(students);
});

// POST route - add a new student
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    marks: req.body.marks
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Student API 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
