import { useEffect, useState } from "react";
function App() {
  const [students, setStudents] = useState([]);
const [name, setName] = useState("");
const [marks, setMarks] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// Fetch students when the page loads
useEffect(() => {
fetch("http://localhost:3001/students")
.then((res) => res.json())
.then((data) => {
setStudents(data);
setLoading(false);
})
.catch(() => {
setError("Could not reach backend. Is it running?");
setLoading(false);
});
}, []);


// Add a new student
const addStudent = (e) => {
e.preventDefault();
if (!name.trim() || !marks) return;


fetch("http://localhost:3001/students", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ name, marks: parseInt(marks) })
})
.then((res) => res.json())
.then((newStudent) => {
setStudents([...students, newStudent]);
setName("");
setMarks("");
})
.catch(() => setError("Failed to add student."));
};

return (
<div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600 }}>
<h1>📚 Student Directory</h1>


{loading && <p>Loading students…</p>}
{error && <p style={{color: "crimson"}}>{error}</p>}


{!loading && (
<ul>
{students.map((s) => (
<li key={s.id}>
<strong>{s.name}</strong> — Marks: {s.marks}
</li>
))}
</ul>
)}


<h2>Add Student</h2>
<form onSubmit={addStudent}>
<input
type="text"
placeholder="Name"
value={name}
onChange={(e) => setName(e.target.value)}
required
style={{ padding: 6, marginRight: 8 }}
/>
<input
type="number"
placeholder="Marks"
value={marks}
onChange={(e) => setMarks(e.target.value)}
required
style={{ padding: 6, marginRight: 8, width: 120 }}
/>
<button type="submit" style={{ padding: "6px 12px" }}>Add</button>
</form>
</div>
);
}


export default App;