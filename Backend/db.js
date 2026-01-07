// backend/db.js
const mysql = require("mysql2");

// Configuration de la connexion
// Note : Sur XAMPP par défaut, l'utilisateur est 'root' et il n'y a pas de mot de passe.
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Utilisateur par défaut de XAMPP
  password: "", // Mot de passe vide par défaut sur XAMPP
  database: "runtogether_db", // Le nom exact de la base qu'on a créée
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

module.exports = connection;
