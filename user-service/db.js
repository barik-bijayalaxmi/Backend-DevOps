const mysql = require("mysql2/promise");

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

// Test DB connection
const connect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("User Service DB connected");
    connection.release();
  } catch (err) {
    console.error("User Service DB connection failed:", err.message);
    process.exit(1); // Important in ECS
  }
};

// Attach connect function to pool
pool.connect = connect;

// Export ONLY pool
module.exports = pool;
