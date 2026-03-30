const express = require("express");
const cors = require("cors");
const db = require("./db");

console.log("DB IMPORT VALUE:", db);

const app = express();
const PORT = process.env.PORT || 4000;

// ========== CORS ==========
const corsOptions = {
  origin: [
    "https://frontend.theawsn.shop",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ========== DATABASE TEST ==========
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL Database connected");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

// ========== ROUTES ==========
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: result.insertId, name, email }
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ========== HEALTH CHECK ==========
app.get("/health", (req, res) => {
  res.status(200).send("OK"); // ECS/ALB health check
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
