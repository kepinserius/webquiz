import { useState, useEffect } from "react";
import { Box, Button, Typography, Container, TextField } from "@mui/material";
import { useRouter } from "next/router";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cek apakah user adalah admin
  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Mengambil role dari localStorage
    if (userRole !== "admin") {
      router.push("/"); // Jika bukan admin, redirect ke halaman utama
    }
  }, [router]);

  // Fungsi untuk menangani pembuatan akun admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username dan password harus diisi.");
      return;
    }

    try {
      const res = await fetch("/api/auth/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setSuccess("Admin berhasil dibuat!");
        setUsername(""); // Reset field input
        setPassword(""); // Reset field input
      } else {
        setError(data.error || "Gagal membuat admin");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat membuat admin");
    }
  };

  const handleLogout = () => router.push("/");

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }} textAlign="center">
        <Typography variant="h4" gutterBottom>Dashboard Admin</Typography>
        <Typography mt={2}>Selamat datang, Admin!</Typography>
        
        {/* Form untuk membuat akun admin */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Buat Admin Baru</Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">{success}</Typography>}

          <form onSubmit={handleCreateAdmin}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 3 }}
            >
              Buat Admin
            </Button>
          </form>
        </Box>

        {/* Logout button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 5 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
