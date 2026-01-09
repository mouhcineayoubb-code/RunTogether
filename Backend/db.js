require("dotenv").config();
const mysql = require("mysql2");

// Creer l-connexion m3a l-base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise(); // Bach n-khdmou b async/await
