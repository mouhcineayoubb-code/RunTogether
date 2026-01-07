const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Pour sécuriser les mots de passe
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

// --- AUTHENTIFICATION ---

// Inscription d'un nouveau coureur
app.post("/api/register", async (req, res) => {
  const { nom, email, password, niveau, ville } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (nom, email, password, niveau, ville) VALUES (?, ?, ?, ?, ?)",
      [nom, email, hashedPassword, niveau, ville]
    );
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'inscription ou email déjà utilisé" });
  }
});

// Connexion
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length > 0) {
      const validPass = await bcrypt.compare(password, users[0].password);
      if (validPass) {
        // On renvoie les infos de l'utilisateur (sans le mot de passe pour la sécurité)
        const { password, ...userInfos } = users[0];
        return res.json({ message: "Connecté", user: userInfos });
      }
    }
    res.status(401).json({ error: "Email ou mot de passe incorrect" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- GESTION DES RUNS ---

// Récupérer tous les runs avec le nombre de participants
app.get("/api/runs", async (req, res) => {
  try {
    const query = `
            SELECT r.*, COUNT(p.id) as nb_participants 
            FROM runs r 
            LEFT JOIN participations p ON r.id = p.run_id 
            GROUP BY r.id 
            ORDER BY r.date_course ASC`;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un nouvel événement
app.post("/api/create-run", async (req, res) => {
  const { titre, date, lieu, ville, distance, niveau, organisateur_id } =
    req.body;
  try {
    await db.execute(
      "INSERT INTO runs (titre, date_course, lieu_depart, ville, distance_km, niveau_requis, organisateur_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [titre, date, lieu, ville, distance, niveau, organisateur_id]
    );
    res.status(201).json({ message: "Run publié" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Action Rejoindre une course
app.post("/api/join", async (req, res) => {
  const { userId, runId } = req.body;
  try {
    await db.execute(
      "INSERT INTO participations (user_id, run_id) VALUES (?, ?)",
      [userId, runId]
    );
    res.json({ message: "Vous avez rejoint la course !" });
  } catch (err) {
    res.status(400).json({ error: "Vous êtes déjà inscrit à ce run" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur RunTogether Pro lancé sur http://localhost:${PORT}`);
});
