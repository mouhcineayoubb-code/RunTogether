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
    res.redirect("http://localhost:5500/Frontend/index.html");
  }
);

app.post("/api/comments", async (req, res) => {
  const { runId, userId, contenu } = req.body;
  await db.execute(
    "INSERT INTO comments (run_id, user_id, contenu) VALUES (?, ?, ?)",
    [runId, userId, contenu]
  );
  res.send("OK");
});

app.get("/api/runs/:id/comments", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT c.*, u.nom FROM comments c JOIN users u ON c.user_id = u.id WHERE c.run_id = ?",
    [req.params.id]
  );
  res.json(rows);
});

app.listen(3000, () => console.log("Server khdam f port 3000"));
