import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import bcrypt from "bcryptjs"; // Untuk enkripsi password

// Fungsi untuk mendaftar admin
export const createAdmin = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi password
  const result = await db.query(
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
    [username, hashedPassword, "admin"]
  );
  return result.rows[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Hanya menerima metode POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  const { username, password } = req.body;
  const role = "admin"; // Selalu admin untuk endpoint ini

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ error: "Semua field harus diisi!" });
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

    // Simpan admin baru ke database
    console.log("Inserting new admin");
    const insertResult = await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
      [username, hashedPassword, role]
    );

    console.log(
      "Admin created successfully with id:",
      insertResult.rows?.[0]?.id
    );
    res.status(200).json({
      message: "Admin berhasil dibuat",
      userId: insertResult.rows?.[0]?.id,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat membuat admin" });
  }
}
