import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import bcrypt from "bcryptjs";

// Tipe untuk user
interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  created_at?: string;
}

// Handler untuk API auth
export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(
    "API auth called with method:",
    req.method,
    "and path:",
    req.query.path
  );

  // Mendapatkan path dari URL
  const { path } = req.query;

  // Menangani berbagai endpoint auth
  if (req.method === "POST") {
    // Endpoint untuk register (dinonaktifkan)
    if (path === "register") {
      console.log("Register endpoint called but is disabled");
      return res.status(403).json({
        error:
          "Fitur pendaftaran telah dinonaktifkan. Hubungi administrator untuk mendapatkan akun.",
      });
    }

    // Endpoint untuk login
    if (path === "login") {
      console.log("Login endpoint called");
      return handleLogin(req, res);
    }
  }

  // Jika method atau path tidak sesuai
  console.log("Method or path not allowed:", req.method, path);
  res.status(405).json({ error: "Metode atau endpoint tidak diizinkan" });
};

// Fungsi untuk menangani register (dipertahankan untuk referensi admin)
async function handleRegister(req: NextApiRequest, res: NextApiResponse) {
  // Fungsi ini dipertahankan hanya untuk referensi admin
  // dan tidak lagi dapat diakses melalui API publik

  const { username, password, role } = req.body;
  console.log("Register attempt for:", username, "with role:", role);

  // Validasi input
  if (!username || !password || !role) {
    console.log("Missing fields in register");
    return res.status(400).json({ error: "Semua field harus diisi!" });
  }

  // Validasi role (hanya admin dan user yang diperbolehkan)
  if (role !== "admin" && role !== "user") {
    console.log("Invalid role:", role);
    return res.status(400).json({ error: "Role tidak valid!" });
  }

  try {
    // Cek apakah username sudah ada
    console.log("Checking if username exists:", username);
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows && result.rows.length > 0) {
      console.log("Username already exists");
      return res.status(400).json({ error: "Username sudah digunakan!" });
    }

    // Enkripsi password
    console.log("Encrypting password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    console.log("Inserting new user");
    const insertResult = await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
      [username, hashedPassword, role]
    );

    console.log(
      "User registered successfully with id:",
      insertResult.rows?.[0]?.id
    );
    res.status(200).json({
      message: "User berhasil didaftarkan",
      userId: insertResult.rows?.[0]?.id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat pendaftaran" });
  }
}

// Fungsi untuk menangani login
async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  console.log("Login attempt for:", username);

  // Validasi input
  if (!username || !password) {
    console.log("Missing username or password");
    return res
      .status(400)
      .json({ error: "Username dan password harus diisi!" });
  }

  try {
    // Cari user berdasarkan username
    console.log("Querying for user:", username);
    let user;

    if (process.env.USE_MOCK_DB === "true") {
      console.log("Using mock database");
      // Untuk mode simulasi, cek langsung dengan data hardcoded
      if (username === "admin@sma.com" && password === "admin123") {
        user = {
          id: 1,
          username: "admin@sma.com",
          role: "admin",
        };
        console.log("Admin user found in mock data");
      } else if (username === "user@sma.com" && password === "user123") {
        user = {
          id: 2,
          username: "user@sma.com",
          role: "user",
        };
        console.log("Regular user found in mock data");
      } else {
        console.log("User not found in mock data or password incorrect");
        return res.status(401).json({ error: "Username atau password salah!" });
      }

      console.log("Login successful with mock data");
      res.status(200).json({
        message: "Login berhasil",
        user,
      });
      return;
    }

    // Jika tidak menggunakan mock database
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("Database query result rows:", result.rows?.length);

    // Jika user tidak ditemukan
    if (!result.rows || result.rows.length === 0) {
      console.log("User not found in database");
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    user = result.rows[0] as User;
    console.log("User found with id:", user.id, "and role:", user.role);

    // Verifikasi password
    console.log("Verifying password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    // Jika login berhasil, kirim data user (tanpa password)
    console.log("Login successful");
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login berhasil",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat login" });
  }
}
