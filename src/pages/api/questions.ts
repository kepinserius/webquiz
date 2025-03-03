import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db"; // Mengimpor koneksi database

// Fungsi untuk menambah soal
export const addQuestion = async (
  question: string,
  options: string[],
  answer: string
) => {
  const [result] = await db.query(
    "INSERT INTO questions (question, options, answer) VALUES (?, ?, ?)",
    [question, JSON.stringify(options), answer] // Menyimpan options dalam format JSON
  );
  return result;
};

// Fungsi untuk mengambil soal
export const getQuestions = async () => {
  const [rows] = await db.query("SELECT * FROM questions");
  return rows;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Mendapatkan semua pertanyaan
  if (req.method === "GET") {
    try {
      const result = await db.query("SELECT * FROM questions ORDER BY id ASC");

      // Transformasi data untuk format yang diharapkan oleh frontend
      const questions = result.rows.map((row) => ({
        id: row.id.toString(),
        question: row.question,
        options: [row.option_a, row.option_b, row.option_c, row.option_d],
        answer: row.correct_answer,
      }));

      res.status(200).json({ questions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat mengambil data pertanyaan" });
    }
    return;
  }

  // Menambahkan pertanyaan baru
  if (req.method === "POST") {
    const { question, options, answer } = req.body;

    // Validasi input
    if (!question || !options || !answer || options.length !== 4) {
      return res
        .status(400)
        .json({ error: "Semua field harus diisi dengan benar!" });
    }

    try {
      const result = await db.query(
        "INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [question, options[0], options[1], options[2], options[3], answer]
      );

      res.status(200).json({
        message: "Pertanyaan berhasil ditambahkan",
        questionId: result.rows[0].id,
      });
    } catch (error) {
      console.error("Error adding question:", error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat menambahkan pertanyaan" });
    }
    return;
  }

  // Mengedit pertanyaan
  if (req.method === "PUT") {
    const { id, question, options, answer } = req.body;

    // Validasi input
    if (!id || !question || !options || !answer || options.length !== 4) {
      return res
        .status(400)
        .json({ error: "Semua field harus diisi dengan benar!" });
    }

    try {
      await db.query(
        "UPDATE questions SET question = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_answer = $6 WHERE id = $7",
        [question, options[0], options[1], options[2], options[3], answer, id]
      );

      res.status(200).json({
        message: "Pertanyaan berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error updating question:", error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat memperbarui pertanyaan" });
    }
    return;
  }

  // Menghapus pertanyaan
  if (req.method === "DELETE") {
    const { id } = req.query;

    // Validasi input
    if (!id) {
      return res.status(400).json({ error: "ID pertanyaan harus disediakan!" });
    }

    try {
      await db.query("DELETE FROM questions WHERE id = $1", [id]);

      res.status(200).json({
        message: "Pertanyaan berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat menghapus pertanyaan" });
    }
    return;
  }

  // Jika method tidak diizinkan
  res.status(405).json({ error: "Metode tidak diizinkan" });
}
