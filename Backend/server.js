const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const cors = require("cors");
const db = require("./db"); // Import de votre connexion MySQL

const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config(); // Had l-ster kiy-jib l-asrar mn .env

// Blat mat-ktb l-secret dyalk b l-iddin f l-code:
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, ... ));
// 1. Configuration de la session
app.use(
  session({
    secret: "runtogether_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Posti commentaire jdid f event
app.post('/api/comments', async (req, res) => {
    const { runId, userId, contenu } = req.body;
    await db.execute("INSERT INTO comments (run_id, user_id, contenu) VALUES (?, ?, ?)", 
    [runId, userId, contenu]);
    res.send("Commentaire ajouté");
});

// Sift message private l-sa7bk
app.post('/api/messages', async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    await db.execute("INSERT INTO private_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)", 
    [senderId, receiverId, message]);
    res.send("Message envoyé");
});
// 1. Route bach t-sift commentaire jdid
app.post('/api/comments', async (req, res) => {
    const { runId, userId, contenu } = req.body;
    try {
        await db.execute("INSERT INTO comments (run_id, user_id, contenu) VALUES (?, ?, ?)", 
        [runId, userId, contenu]);
        res.status(201).json({ message: "Commentaire t-sift!" });
    } catch (err) { res.status(500).json(err); }
});

// 2. Route bach t-qra l-commentaires dyal wahed l-run
app.get('/api/runs/:id/comments', async (req, res) => {
    const [rows] = await db.execute(`
        SELECT c.*, u.nom FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.run_id = ? ORDER BY c.date_publication DESC`, [req.params.id]);
    res.json(rows);
});
// Fonction bach t-sift commentaire
async function sendComment() {
    const text = document.getElementById('new-comment').value;
    const user = JSON.parse(localStorage.getItem('user')); // User dakhhel mn Gmail
    
    if (!text || !user) return alert("Khsek t-connecta auwel!");

    await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId: currentRunId, userId: user.id, contenu: text })
    });
    
    document.getElementById('new-comment').value = '';
    loadComments(currentRunId);
}

// Fonction bach t-qra l-commentaires
async function loadComments(id) {
    const res = await fetch(`http://localhost:3000/api/runs/${id}/comments`);
    const data = await res.json();
    const display = document.getElementById('comments-display');
    display.innerHTML = data.map(c => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #262626; padding-bottom: 5px;">
            <b style="color: var(--primary);">${c.nom}</b>: <span>${c.contenu}</span>
        </div>
    `).join('');
}

// 3. Route dyal l-Chat (Messages private)
app.post('/api/messages', async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    await db.execute("INSERT INTO private_messages (sender_id, receiver_id, message) VALUES (?, ?, ?)", 
    [senderId, receiverId, message]);
    res.send("Message envoyé");
});
// 2. Stratégie Google Passport
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "122510118172-qc3819qjlv6q30a22efisqr8qj4dvg2g.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      try {
        // Vérifier si l'utilisateur existe dans votre table 'users'
        let [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
          email,
        ]);

        if (rows.length === 0) {
          // Création automatique si nouveau (Droit au but pour RunTogether)
          await db.execute(
            "INSERT INTO users (nom, email, ville) VALUES (?, ?, ?)",
            [profile.displayName, email, "Casablanca"]
          );
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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 3. Routes d'authentification
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5500/Frontend/index.html");
  }
);

app.get("/api/current_user", (req, res) => res.send(req.user));

app.listen(3000, () =>
  console.log("Backend RunTogether Google Auth sur port 3000")
);
