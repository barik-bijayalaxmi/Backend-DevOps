const express = require("express");
const cors = require("cors");
const db = require("./db");
 
const app = express();
const PORT = process.env.PORT || 4000;
 
// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://frontend.theawsn.shop",
}));
 
// Connect to DB
db.connect();
 
// Routes
app.get("/users", (req, res) => {
  db.pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});
 
// Health Check
app.get("/health", (req, res) => {
  res.status(200).send("User Service is healthy");
});
 
// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`User Service running on port ${PORT}`);
});
