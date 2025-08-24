
// studentMarks.js

const students = [
  { name: "Rohan", marks: { math: 85, science: 78, english: 92 } },
  { name: "Priya", marks: { math: 95, science: 88, english: 76 } },
  { name: "Aman", marks: { math: 45, science: 55, english: 60 } },
  { name: "Neha", marks: { math: 72, science: 68, english: 80 } }
];

// 1. Calculate total marks of each student
const studentTotals = students.map(student => {
  const total = Object.values(student.marks).reduce((sum, mark) => sum + mark, 0);
  return { name: student.name, totalMarks: total };
});

console.log("Total Marks of Each Student:", studentTotals);

// 2. Find students with more than 200 marks
const topScorers = studentTotals.filter(s => s.totalMarks > 200);
console.log("Top Scorers:", topScorers);

// 3. Calculate class average
const allMarks = students.flatMap(s => Object.values(s.marks));
const classAverage = allMarks.reduce((sum, m) => sum + m, 0) / allMarks.length;
console.log("Class Average:", classAverage);

// 4. Find topper
const topper = studentTotals.reduce((prev, curr) =>
  prev.totalMarks > curr.totalMarks ? prev : curr
);
console.log("Topper:", topper);
