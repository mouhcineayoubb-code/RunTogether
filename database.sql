DROP DATABASE IF EXISTS runtogether_db;
CREATE DATABASE runtogether_db CHARACTER SET utf8mb4;
USE runtogether_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    niveau ENUM('débutant', 'intermédiaire', 'avancé'),
    ville VARCHAR(100)
);

CREATE TABLE runs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150),
    date_course DATETIME,
    lieu_depart VARCHAR(255),
    ville VARCHAR(100),
    distance_km INT,
    niveau_requis ENUM('débutant', 'intermédiaire', 'avancé'),
    organisateur_id INT,
    FOREIGN KEY (organisateur_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE participations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    run_id INT,
    UNIQUE(user_id, run_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE
);