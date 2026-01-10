require("dotenv").config(); // Darori hiya l-lowla
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({ secret: "runtogether_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Configuration Passport b l-.env
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      try {
        let [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
          email,
        ]);
        if (rows.length === 0) {
          await db.execute("INSERT INTO users (nom, email) VALUES (?, ?)", [
            profile.displayName,
            email,
          ]);
          [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
            email,
          ]);
        }
        return done(null, rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((u, d) => d(null, u));
passport.deserializeUser((u, d) => d(null, u));

// ROUTES
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    // Après authentification réussie, rediriger avec les infos utilisateur dans l'URL
    if (req.user) {
      const userData = encodeURIComponent(JSON.stringify({
        id: req.user.id,
        name: req.user.nom,
        email: req.user.email,
        avatar: req.user.photo_url || "/placeholder.svg?height=100&width=100",
      }));
      res.redirect(`http://localhost:5500/Frontend/index.html?user=${userData}`);
    } else {
      res.redirect("http://localhost:5500/Frontend/index.html?error=authentication_failed");
    }
  }
);

app.post("/api/comments", async (req, res) => {
  const { runId, userId, contenu } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO comments (run_id, user_id, contenu) VALUES (?, ?, ?)",
      [runId, userId, contenu]
    );
    res.status(201).json({ message: "Commentaire ajouté!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour l'inscription (alternative à Google OAuth)
app.post("/api/register", async (req, res) => {
  const { nom, email, niveau } = req.body;
  try {
    // Vérifier si l'utilisateur existe déjà
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }
    const [result] = await db.execute(
      "INSERT INTO users (nom, email, niveau) VALUES (?, ?, ?)",
      [nom, email, niveau || "Débutant"]
    );
    res.status(201).json({ message: "Utilisateur créé!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/runs/:id/comments", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT c.*, u.nom, u.email FROM comments c JOIN users u ON c.user_id = u.id WHERE c.run_id = ? ORDER BY COALESCE(c.created_at, c.date_publication) DESC",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour obtenir tous les runs
app.get("/api/runs", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT r.*, u.nom as organisateur_nom FROM runs r LEFT JOIN users u ON r.organisateur_id = u.id ORDER BY r.date_course ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour obtenir un run spécifique
app.get("/api/runs/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT r.*, u.nom as organisateur_nom FROM runs r LEFT JOIN users u ON r.organisateur_id = u.id WHERE r.id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Run non trouvé" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour créer un nouveau run
app.post("/api/runs", async (req, res) => {
  const {
    titre,
    description,
    date_course,
    ville,
    distance_km,
    organisateur_id,
    adresse,
    lat,
    lng,
    niveau,
    max_participants,
  } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO runs (titre, description, date_course, ville, distance_km, organisateur_id, adresse, lat, lng, niveau, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        titre,
        description,
        date_course,
        ville,
        distance_km,
        organisateur_id,
        adresse || null,
        lat || null,
        lng || null,
        niveau || "debutant",
        max_participants || 30,
      ]
    );
    res.status(201).json({ message: "Course créée!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour mettre à jour un run
app.put("/api/runs/:id", async (req, res) => {
  const {
    titre,
    description,
    date_course,
    ville,
    distance_km,
    adresse,
    lat,
    lng,
    niveau,
    max_participants,
  } = req.body;
  try {
    await db.execute(
      "UPDATE runs SET titre = ?, description = ?, date_course = ?, ville = ?, distance_km = ?, adresse = ?, lat = ?, lng = ?, niveau = ?, max_participants = ? WHERE id = ?",
      [
        titre,
        description,
        date_course,
        ville,
        distance_km,
        adresse || null,
        lat || null,
        lng || null,
        niveau || "debutant",
        max_participants || 30,
        req.params.id,
      ]
    );
    res.json({ message: "Course mise à jour!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour supprimer un run
app.delete("/api/runs/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM runs WHERE id = ?", [req.params.id]);
    res.json({ message: "Course supprimée!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour obtenir les runs d'un utilisateur
app.get("/api/users/:id/runs", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM runs WHERE organisateur_id = ? ORDER BY date_course ASC",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour rejoindre/quitter une course
app.post("/api/runs/:id/join", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId est requis" });
  }
  try {
    // Vérifier si l'utilisateur existe
    const [userCheck] = await db.execute("SELECT id FROM users WHERE id = ?", [userId]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    // Vérifier si l'utilisateur est déjà inscrit
    const [existing] = await db.execute(
      "SELECT * FROM participations WHERE user_id = ? AND run_id = ?",
      [userId, req.params.id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Déjà inscrit à cette course" });
    }
    
    // Vérifier le nombre de participants
    const [runRows] = await db.execute(
      "SELECT max_participants FROM runs WHERE id = ?",
      [req.params.id]
    );
    if (runRows.length === 0) {
      return res.status(404).json({ error: "Course non trouvée" });
    }
    
    const [participantsCount] = await db.execute(
      "SELECT COUNT(*) as count FROM participations WHERE run_id = ?",
      [req.params.id]
    );
    
    if (participantsCount[0].count >= (runRows[0].max_participants || 30)) {
      return res.status(400).json({ error: "Course complète" });
    }
    
    await db.execute(
      "INSERT INTO participations (user_id, run_id) VALUES (?, ?)",
      [userId, req.params.id]
    );
    res.json({ message: "Inscription réussie!" });
  } catch (err) {
    console.error("Error joining run:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/runs/:id/join", async (req, res) => {
  // Utiliser query params ou body pour DELETE (Express peut parser les deux)
  const userId = req.query.userId || (req.body && req.body.userId) || null;
  if (!userId) {
    return res.status(400).json({ error: "userId est requis (utilisez ?userId=... dans l'URL)" });
  }
  try {
    const [result] = await db.execute(
      "DELETE FROM participations WHERE user_id = ? AND run_id = ?",
      [userId, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Participation non trouvée" });
    }
    res.json({ message: "Désinscription réussie!" });
  } catch (err) {
    console.error("Error leaving run:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route pour obtenir les participants d'une course
app.get("/api/runs/:id/participants", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT u.id, u.nom, u.email, u.photo_url FROM participations p JOIN users u ON p.user_id = u.id WHERE p.run_id = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour obtenir tous les utilisateurs (pour test)
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, nom, email FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server khdam f port 3000"));
