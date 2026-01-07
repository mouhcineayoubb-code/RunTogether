const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const cors = require("cors");
const db = require("./db"); // Import de votre connexion MySQL

const app = express();

app.use(cors());
app.use(express.json());

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
