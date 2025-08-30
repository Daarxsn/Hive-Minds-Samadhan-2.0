
// studentApi.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample in-memory data (like a database)
let students = [
  { id: 1, name: "Rohan", marks: 250 },
  { id: 2, name: "Priya", marks: 270 },
  { id: 3, name: "Aman", marks: 160 }
];

// GET - all students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET - student by ID
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// POST - add new student
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    marks: req.body.marks
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT - update student by ID
app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });

  student.name = req.body.name || student.name;
  student.marks = req.body.marks || student.marks;

  res.json(student);
});

// DELETE - remove student by ID
app.delete("/students/:id", (req, res) => {
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
  if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });

  const removed = students.splice(studentIndex, 1);
  res.json(removed[0]);
});

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Student CRUD API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});