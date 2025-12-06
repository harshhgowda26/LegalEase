import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.use(cors());
router.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
  if (err) console.error("❌ DB connection failed:", err);
  else {
    console.log("✅ Connected to MySQL Database (Pool)");
    connection.release();
  }
});

router.get("/lawyers", (req, res) => {
  const { specialization, city, language } = req.query;
  let query = "SELECT * FROM Lawyer WHERE 1=1";
  const params = [];

  if (specialization && specialization !== "All Specialties") {
    query += " AND specialization LIKE ?";
    params.push(`%${specialization}%`);
  }

  if (city && city !== "") {
    query += " AND city LIKE ?";
    params.push(`%${city.toLowerCase()}%`);
  }

  if (language && language !== "Any Language") {
    query += " AND FIND_IN_SET(?, languages)";
    params.push(language);
  }

db.query(query, params, (err, results) => {
  if (err) {
    console.error("❌ Database query error:", err); // <---- ADD THIS
    return res.status(500).json({ error: err.message }); // return real error message
  }
  res.json(results);
});
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Lawyer WHERE lawyer_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Lawyer not found" });
    res.json(results[0]);
  });
});

export default router;
