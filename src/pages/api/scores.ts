import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

// Fungsi untuk menyimpan nilai user
export const saveScore = async (userId: number, score: number) => {
  const [result] = await db.query(
    "INSERT INTO scores (user_id, score) VALUES (?, ?)",
    [userId, score]
  );
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Hanya menerima metode GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  try {
    // Ambil semua data skor
    const result = await db.query(
      "SELECT scores.*, users.username FROM scores JOIN users ON scores.user_id = users.id ORDER BY scores.created_at DESC"
    );

    res.status(200).json({ scores: result.rows });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data skor" });
  }
}
