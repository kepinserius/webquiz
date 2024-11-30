import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import bcrypt from "bcryptjs";  // Untuk enkripsi password

// Fungsi untuk mendaftar admin
export const createAdmin = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi password
  const [result] = await db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, "admin"]
  );
  return result;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Cek apakah user sudah login sebagai admin (gunakan sesi atau token)
    const userRole = req.headers["role"]; // Misalnya dapatkan role dari header
    if (userRole !== "admin") {
      return res.status(403).json({ error: "Hanya admin yang dapat membuat akun admin." });
    }

    if (!username || !password) {
      return res.status(400).json({ error: "Semua field harus diisi!" });
    }

    try {
      const result = await createAdmin(username, password);
      res.status(200).json({ message: "Admin berhasil dibuat", result });
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat membuat admin" });
    }
  } else {
    res.status(405).json({ error: "Metode tidak diizinkan" });
  }
};
