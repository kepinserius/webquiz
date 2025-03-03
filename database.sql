-- Membuat database
CREATE DATABASE IF NOT EXISTS quiz_sma;
USE quiz_sma;

-- Membuat tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel questions
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  answer VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel scores
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Menambahkan admin default
INSERT INTO users (username, password, role) VALUES 
('admin@sma.com', '$2a$10$XFE0rQyZ5GfZy8xvZIF1sOeEJwRfA8xNk7bIJxE2KCq1sNkTVF5Ci', 'admin'); -- Password: admin123

-- Menambahkan user default
INSERT INTO users (username, password, role) VALUES 
('user@sma.com', '$2a$10$XFE0rQyZ5GfZy8xvZIF1sOeEJwRfA8xNk7bIJxE2KCq1sNkTVF5Ci', 'user'); -- Password: user123

-- Menambahkan soal default
INSERT INTO questions (question, options, answer) VALUES
('Apa ibu kota Indonesia?', '["Jakarta", "Bandung", "Surabaya", "Medan"]', 'Jakarta'),
('Siapa presiden pertama Indonesia?', '["Soekarno", "Soeharto", "Habibie", "Jokowi"]', 'Soekarno'),
('Kapan Indonesia merdeka?', '["17 Agustus 1945", "17 Agustus 1944", "17 Agustus 1946", "17 Agustus 1949"]', '17 Agustus 1945'),
('Apa lambang negara Indonesia?', '["Garuda Pancasila", "Elang Jawa", "Komodo", "Harimau Sumatera"]', 'Garuda Pancasila'),
('Siapa penulis lagu Indonesia Raya?', '["W.R. Supratman", "Ismail Marzuki", "C. Simanjuntak", "Kusbini"]', 'W.R. Supratman');