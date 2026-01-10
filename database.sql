-- 1. Ms7 o creyi l-base de données (Bach t-fiksi Error 1046 o 1007)
DROP DATABASE IF EXISTS runtogether_db;
CREATE DATABASE runtogether_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE runtogether_db;

-- ==========================================================
-- 2. TABLE : USERS (L-auth o l-profil l-kamil)
-- ==========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    age INT, 
    ville_actuelle VARCHAR(100), 
    lieu_naissance VARCHAR(100), 
    niveau ENUM('Débutant', 'Intermédiaire', 'Expert') DEFAULT 'Débutant',
    photo_url VARCHAR(255) DEFAULT 'default_avatar.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================================
-- 3. TABLE : RUNS (L-postes dyal l-courses)
-- ==========================================================
CREATE TABLE runs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    date_course DATETIME NOT NULL,
    ville VARCHAR(100) NOT NULL,
    distance_km DECIMAL(5,2) NOT NULL,
    organisateur_id INT NOT NULL,
    CONSTRAINT fk_organisateur FOREIGN KEY (organisateur_id) 
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 4. TABLE : PARTICIPATIONS (Inscriptions f l-courses)
-- ==========================================================
CREATE TABLE participations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    run_id INT NOT NULL,
    UNIQUE KEY unique_participation (user_id, run_id), -- May-qderch y-tsjjel joj mrat
    CONSTRAINT fk_part_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_part_run FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 5. TABLE : COMMENTS (L-commentaires f l-events)
-- ==========================================================
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    run_id INT NOT NULL,
    user_id INT NOT NULL,
    contenu TEXT NOT NULL,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comm_run FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE,
    CONSTRAINT fk_comm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 6. TABLE : MESSAGES (Chat private bin s7ab)
-- ==========================================================
CREATE TABLE private_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;