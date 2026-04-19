const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Hello from ScholR Node.js Server!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Node Server is running on http://localhost:${PORT}`);
});
