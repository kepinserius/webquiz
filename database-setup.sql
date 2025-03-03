-- Membuat database
CREATE DATABASE IF NOT EXISTS quiz_sma;
USE quiz_sma;

-- Membuat tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel questions
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CHAR(1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel scores
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Menambahkan beberapa data awal untuk testing
-- Admin user
INSERT INTO users (username, password, role) VALUES 
('admin@sma.com', '$2a$10$XFE/UQSXAbrx.h8Qx.5the7UdL5m3HzXhOhETu9Y0CSuBGZKbg.Hy', 'admin'); -- password: admin123

-- Regular user
INSERT INTO users (username, password, role) VALUES 
('user@sma.com', '$2a$10$XFE/UQSXAbrx.h8Qx.5thewm4zzGMW921JVUPSHMyrSuPxlxv.Iva', 'user'); -- password: user123

-- Sample questions
INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('Apa ibukota Indonesia?', 'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'A'),
('Berapa hasil dari 9 x 9?', '81', '72', '90', '99', 'A'),
('Siapa presiden pertama Indonesia?', 'Soekarno', 'Soeharto', 'Habibie', 'Megawati', 'A'),
('Apa rumus kimia air?', 'H2O', 'CO2', 'O2', 'H2SO4', 'A'),
('Planet apa yang terdekat dengan matahari?', 'Merkurius', 'Venus', 'Bumi', 'Mars', 'A'); 