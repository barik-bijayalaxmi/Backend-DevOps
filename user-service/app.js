require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

// Parse JSON
app.use(express.json());

// ===== CORS =====
const allowedOrigins = [
  "https://frontend.theawsn.shop",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl, mobile apps)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Make sure preflight requests are handled
app.options("*", cors());

// ===== ROUTES =====
app.get("/health", (req,res) => {
  res.status(200).send("User Service is healthy");
});

app.get("/users", async (req,res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email FROM users");
    res.json(rows);
  } catch(err){
    res.status(500).json({error: "Database error"});
  }
});

app.post("/register", async (req,res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({error: "All fields required"});

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if(existing.length > 0) return res.status(400).json({error: "User already exists"});

    const [result] = await db.query("INSERT INTO users (name,email,password) VALUES (?,?,?)", [name,email,password]);
    res.status(201).json({message: "User registered successfully", user: {id: result.insertId, name, email}});
  } catch(err){
    res.status(500).json({error: "Database error"});
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
