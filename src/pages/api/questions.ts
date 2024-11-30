import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db"; // Mengimpor koneksi database

// Fungsi untuk menambah soal
export const addQuestion = async (question: string, options: string[], answer: string) => {
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { question, options, answer } = req.body;
    try {
      const result = await addQuestion(question, options, answer);
      res.status(200).json({ message: "Soal berhasil ditambahkan", result });
    } catch (error) {
      res.status(500).json({ error: "Gagal menambahkan soal" });
    }
  } else if (req.method === "GET") {
    try {
      const questions = await getQuestions();
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil soal" });
    }
  }
};
