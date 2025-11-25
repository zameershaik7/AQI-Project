// ------------------------------------------------------------
// CLEAN FRONTEND SERVER
// Serves: index.html, script.js, style.css, assets
// No axios, no dotenv, no backend logic
// ------------------------------------------------------------

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Always send index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
