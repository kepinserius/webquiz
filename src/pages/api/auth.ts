import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import bcrypt from "bcryptjs";  // Untuk enkripsi password

// Fungsi untuk mendaftar user
export const registerUser = async (username: string, password: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi password
  const [result] = await db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role]
  );
  return result;
};

// Fungsi untuk login user
export const loginUser = async (username: string, password: string) => {
  const [user] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return null;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      res.status(400).json({ error: "Semua field harus diisi!" });
      return;
    }

    try {
      const result = await registerUser(username, password, role);
      res.status(200).json({ message: "User berhasil didaftarkan", result });
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat pendaftaran" });
    }
  } else {
    res.status(405).json({ error: "Metode tidak diizinkan" });
  }
};
