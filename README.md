# Quiz SMA

Aplikasi quiz sederhana untuk siswa SMA dengan fitur admin dan user.

## Fitur

- **Admin**: Mengelola pertanyaan quiz, melihat statistik, membuat admin baru, dan mengelola akun siswa
- **User**: Mengerjakan quiz dan melihat skor

## Teknologi yang Digunakan

- Next.js
- TypeScript
- Material UI
- PostgreSQL

## Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- PostgreSQL Server

## Cara Menjalankan Aplikasi

### 1. Konfigurasi Database PostgreSQL

1. Pastikan PostgreSQL server sudah terinstal dan berjalan
2. Buat database baru dengan nama `quiz_sma`:

   sudo service postgresql start
   sudo service postgresql status
   sudo -u postgres psql
   \c quiz_sma

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE quiz_sma;

# Buat user untuk aplikasi (opsional)
CREATE USER quizadmin WITH PASSWORD 'password_anda';
GRANT ALL PRIVILEGES ON DATABASE quiz_sma TO quizadmin;

# Keluar dari PostgreSQL
\q
```

3. Buat tabel-tabel yang diperlukan:

```bash
# Login ke database quiz_sma
psql -U postgres -d quiz_sma

# Buat tabel users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Buat tabel questions
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Buat tabel scores
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Keluar dari PostgreSQL
\q
```

4. Tambahkan data awal (opsional):

```bash
# Login ke database quiz_sma
psql -U postgres -d quiz_sma

# Tambahkan admin dan user default
INSERT INTO users (username, password, role) VALUES
('admin@sma.com', '$2a$10$XFE/UQSXAbrx.h8Qx.5the7UdL5m3HzXhOhETu9Y0CSuBGZKbg.Hy', 'admin'),
('user@sma.com', '$2a$10$XFE/UQSXAbrx.h8Qx.5thewm4zzGMW921JVUPSHMyrSuPxlxv.Iva', 'user');

# Keluar dari PostgreSQL
\q
```

### 2. Konfigurasi Environment

1. Buat file `.env.local` di root proyek dan sesuaikan dengan konfigurasi database Anda:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password_anda
DB_NAME=quiz_sma
DB_PORT=5432
```

### 3. Instalasi Dependensi

```bash
# Instal semua dependensi
npm install
```

### 4. Menjalankan Aplikasi

```bash
# Jalankan aplikasi dalam mode development
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### 5. Login

- **Admin**:

  - Username: admin@sma.com
  - Password: admin123

- **User**:
  - Username: user@sma.com
  - Password: user123

## Struktur Aplikasi

- `/src/pages`: Halaman-halaman aplikasi
- `/src/pages/api`: API endpoints
- `/src/lib`: Utilitas dan konfigurasi
- `/src/types`: Tipe-tipe TypeScript

## Pengembangan

Untuk menjalankan aplikasi dalam mode development:

```bash
npm run dev
```

Untuk membangun aplikasi:

```bash
npm run build
```

Untuk menjalankan aplikasi yang sudah di-build:

```bash
npm start
```

## Troubleshooting

### Masalah Koneksi Database

Jika mengalami masalah koneksi ke database, pastikan:

1. PostgreSQL server berjalan
2. Kredensial di file `.env.local` benar
3. Database dan tabel sudah dibuat dengan benar

Untuk memeriksa koneksi database:

```bash
# Cek apakah PostgreSQL berjalan
pg_isready

# Coba koneksi ke database
psql -U postgres -d quiz_sma -c "SELECT 'Koneksi berhasil';"
```

### Masalah Aplikasi

Jika aplikasi tidak berjalan dengan benar:

1. Periksa log error di konsol
2. Restart server dengan `npm run dev`
3. Hapus folder `.next` dan jalankan `npm run dev` lagi

## Lisensi

MIT
