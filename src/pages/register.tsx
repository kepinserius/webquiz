import { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useRouter } from "next/router";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fungsi untuk menangani submit form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!username || !password) {
      setError("Username dan password harus diisi!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role: "user" }), // Role hanya user
      });
      
      const data = await res.json();
      if (res.status === 200) {
        router.push("/login");  // Redirect ke halaman login setelah register berhasil
      } else {
        setError(data.error || "Gagal mendaftar!");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat mendaftar!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }} textAlign="center">
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleRegister}>
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
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
