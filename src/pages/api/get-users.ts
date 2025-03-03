import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Hanya menerima metode GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  try {
    // Ambil semua pengguna dengan role 'user' (siswa)
    const result = await db.query(
      "SELECT id, username, role, created_at FROM users WHERE role = 'user' ORDER BY id ASC"
    );

    // Ambil data skor untuk setiap siswa
    const usersWithScores = await Promise.all(
      result.rows.map(async (user) => {
        const scoreResult = await db.query(
          "SELECT score, total_questions, created_at FROM scores WHERE user_id = $1 ORDER BY created_at DESC",
          [user.id]
        );

        // Hitung rata-rata skor
        let averageScore = 0;
        let totalQuizzes = 0;

        if (scoreResult.rows.length > 0) {
          const totalScore = scoreResult.rows.reduce(
            (sum, score) => sum + parseInt(score.score),
            0
          );
          averageScore = Math.round(totalScore / scoreResult.rows.length);
          totalQuizzes = scoreResult.rows.length;
        }

        return {
          ...user,
          scores: scoreResult.rows,
          averageScore,
          totalQuizzes,
          lastQuiz: scoreResult.rows[0]?.created_at || null,
        };
      })
    );

    res.status(200).json({ users: usersWithScores });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data siswa" });
  }
}
