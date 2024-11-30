import { useState } from "react";
import { Box, Button, Typography, Container, TextField } from "@mui/material";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fungsi untuk menangani login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Cek apakah username dan password sudah diisi
    if (!username || !password) {
      setError("Username dan password harus diisi.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Simpan role pengguna di localStorage
        localStorage.setItem("role", data.role);
        
        // Arahkan berdasarkan role user
        if (data.role === "admin") {
          router.push("/admin"); // Jika admin, arahkan ke dashboard admin
        } else if (data.role === "user") {
          router.push("/user-quiz"); // Jika user, arahkan ke halaman quiz
        }
      } else {
        setError(data.error || "Login gagal");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }} textAlign="center">
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleLogin}>
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
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
