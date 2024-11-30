import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Username MySQL (default XAMPP adalah root)
  password: "", // Password MySQL (default XAMPP kosong)
  database: "quiz_sma", // Nama database yang telah dibuat
});

export default pool.promise();  // Menggunakan promise untuk query yang async
