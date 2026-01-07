// backend/db.js
const mysql = require("mysql2");

// Configurer la connexion à la base de données MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Laissez vide si vous n'avez pas de mot de passe MySQL
  database: "runtogether_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Ouvrir la connexion
connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à la base de données :", err.message);
    return;
  }
  console.log(
    '✅ Connecté avec succès à la base de données MySQL "runtogether_db" !'
  );
});

module.exports = pool.promise();
