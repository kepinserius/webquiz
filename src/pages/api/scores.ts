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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userId, score } = req.body;
    try {
      const result = await saveScore(userId, score);
      res.status(200).json({ message: "Nilai berhasil disimpan", result });
    } catch (error) {
      res.status(500).json({ error: "Gagal menyimpan nilai" });
    }
  }
};
