const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001; // ← we use 3001 so React can use 3000


app.use(cors());
app.use(express.json());


let students = [
{ id: 1, name: "Rohan", marks: 250 },
{ id: 2, name: "Priya", marks: 270 },
{ id: 3, name: "Aman", marks: 160 }
];


// GET all students
app.get("/students", (req, res) => {
res.json(students);
});


// POST add a new student
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
console.log(`✅ Backend running at http://localhost:${port}`);
});