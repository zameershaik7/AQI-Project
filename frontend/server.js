const express = require("express");
const path = require("path");

const app = express();

// Serve static files (html, css, js)
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Frontend running at http://localhost:3000");
});
