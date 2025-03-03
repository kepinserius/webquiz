import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  try {
    // Mengambil jumlah user
    const [userRows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );
    const userCount = userRows[0]?.count || 0;

    // Mengambil jumlah soal
    const [questionRows] = await db.query(
      "SELECT COUNT(*) as count FROM questions"
    );
    const questionCount = questionRows[0]?.count || 0;

    // Mengambil jumlah quiz yang telah diselesaikan
    const [quizRows] = await db.query("SELECT COUNT(*) as count FROM scores");
    const quizCount = quizRows[0]?.count || 0;

    // Mengembalikan data statistik
    res.status(200).json({
      userCount,
      questionCount,
      quizCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Gagal mengambil statistik" });
  }
}
