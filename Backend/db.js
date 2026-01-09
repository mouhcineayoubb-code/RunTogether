const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Laissez vide par défaut pour XAMPP/WAMP
  database: "runtogether_db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
