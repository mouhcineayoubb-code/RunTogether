// backend/server.js
const http = require("http");
const db = require("./db"); // On importe la connexion qu'on vient de créer

const server = http.createServer((req, res) => {
  // Configuration des headers pour autoriser le frontend à nous parler (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  // Route de test : Vérifier que ça marche
  if (req.url === "/test" && req.method === "GET") {
    res.end(JSON.stringify({ message: "Le serveur Node.js fonctionne !" }));
  }

  // Route 1 : Récupérer tous les utilisateurs (pour prouver que la BDD est connectée)
  else if (req.url === "/api/users" && req.method === "GET") {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(results));
      }
    });
  }

  // Gestion des routes inconnues
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route non trouvée" }));
  }
});

// Lancer le serveur sur le port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
