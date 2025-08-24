const express = require("express");
const app = express();

// Route: GET /
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start server
app.listen(3000, () => {
  console.log("API running at http://localhost:3000/");
});
