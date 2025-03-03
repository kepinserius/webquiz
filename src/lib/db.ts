import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Cek apakah kita perlu menggunakan mode simulasi
const USE_MOCK_DB = process.env.USE_MOCK_DB === "true" || !process.env.DB_HOST;

// Data simulasi untuk mode tanpa database
const mockUsers = [
  {
    id: 1,
    username: "admin@sma.com",
    password: "$2a$10$XFE/UQSXAbrx.h8Qx.5the7UdL5m3HzXhOhETu9Y0CSuBGZKbg.Hy",
    role: "admin",
  },
  {
    id: 2,
    username: "user@sma.com",
    password: "$2a$10$XFE/UQSXAbrx.h8Qx.5thewm4zzGMW921JVUPSHMyrSuPxlxv.Iva",
    role: "user",
  },
];

const mockQuestions = [
  {
    id: 1,
    question: "Apa ibukota Indonesia?",
    option_a: "Jakarta",
    option_b: "Bandung",
    option_c: "Surabaya",
    option_d: "Medan",
    correct_answer: "A",
  },
  {
    id: 2,
    question: "Berapa hasil dari 9 x 9?",
    option_a: "81",
    option_b: "72",
    option_c: "90",
    option_d: "99",
    correct_answer: "A",
  },
  {
    id: 3,
    question: "Siapa presiden pertama Indonesia?",
    option_a: "Soekarno",
    option_b: "Soeharto",
    option_c: "Habibie",
    option_d: "Megawati",
    correct_answer: "A",
  },
  {
    id: 4,
    question: "Apa rumus kimia air?",
    option_a: "H2O",
    option_b: "CO2",
    option_c: "O2",
    option_d: "H2SO4",
    correct_answer: "A",
  },
  {
    id: 5,
    question: "Planet apa yang terdekat dengan matahari?",
    option_a: "Merkurius",
    option_b: "Venus",
    option_c: "Bumi",
    option_d: "Mars",
    correct_answer: "A",
  },
];

// Definisikan tipe untuk skor
interface Score {
  id: number;
  user_id: number;
  score: number;
  total_questions: number;
  created_at: string;
}

const mockScores: Score[] = [];

// Membuat mock database dengan fungsi query
const mockDb = {
  query: async (sql, params) => {
    console.log("Mock DB Query:", sql);

    // Simulasi query untuk users
    if (sql.includes("SELECT * FROM users WHERE username = $1")) {
      const username = params[0];
      const user = mockUsers.find((u) => u.username === username);
      return { rows: user ? [user] : [] };
    }

    // Simulasi query untuk insert user
    if (sql.includes("INSERT INTO users")) {
      const [username, password, role] = params;
      const newUser = {
        id: mockUsers.length + 1,
        username,
        password,
        role,
      };
      mockUsers.push(newUser);
      return { rows: [{ id: newUser.id }] };
    }

    // Simulasi query untuk questions
    if (sql.includes("SELECT * FROM questions")) {
      return { rows: mockQuestions };
    }

    // Simulasi query untuk insert question
    if (sql.includes("INSERT INTO questions")) {
      const [question, option_a, option_b, option_c, option_d, correct_answer] =
        params;
      const newQuestion = {
        id: mockQuestions.length + 1,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
      };
      mockQuestions.push(newQuestion);
      return { rows: [{ id: newQuestion.id }] };
    }

    // Simulasi query untuk scores
    if (sql.includes("SELECT * FROM scores")) {
      return { rows: mockScores };
    }

    // Simulasi query untuk insert score
    if (sql.includes("INSERT INTO scores")) {
      const [user_id, score, total_questions] = params;
      const newScore = {
        id: mockScores.length + 1,
        user_id,
        score,
        total_questions,
        created_at: new Date().toISOString(),
      };
      mockScores.push(newScore);
      return { rows: [{ id: newScore.id }] };
    }

    // Default return untuk query yang tidak dikenali
    return { rows: [] };
  },
};

// Konfigurasi database PostgreSQL
let pool;
if (!USE_MOCK_DB) {
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "quizadmin",
    password: process.env.DB_PASSWORD || "password_anda",
    database: process.env.DB_NAME || "quiz_sma",
    port: parseInt(process.env.DB_PORT || "5432"),
  });

  // Cek koneksi database
  pool
    .connect()
    .then((client) => {
      console.log("Database connected successfully");
      client.release();
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      console.error("DB Config:", {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "quizadmin",
        database: process.env.DB_NAME || "quiz_sma",
        port: parseInt(process.env.DB_PORT || "5432"),
      });
    });
}

// Jika mode simulasi aktif, gunakan mock database
if (USE_MOCK_DB) {
  console.log(
    "🚀 Menggunakan database simulasi karena database tidak tersedia"
  );
}

// Export database yang sesuai
const db = USE_MOCK_DB ? mockDb : pool;
export default db;
