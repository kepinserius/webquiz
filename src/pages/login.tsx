import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import { useRouter } from "next/router";
import Head from "next/head";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Efek untuk menampilkan pesan sukses jika ada query registered=true
  useEffect(() => {
    const isRegistered = router.query.registered === "true";
    if (isRegistered) {
      setError("Pendaftaran berhasil! Silakan login dengan akun Anda.");
    }
  }, [router.query.registered]);

  // Fungsi untuk menangani login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Cek apakah username dan password sudah diisi
    if (!username || !password) {
      setError("Username dan password harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth?path=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Simpan role pengguna di localStorage
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);

        // Arahkan berdasarkan role user
        if (data.user.role === "admin") {
          router.push("/admin"); // Jika admin, arahkan ke dashboard admin
        } else if (data.user.role === "user") {
          router.push("/user"); // Jika user, arahkan ke halaman quiz
        }
      } else {
        setError(data.error || "Login gagal");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Login - Quiz SMA</title>
        <meta name="description" content="Login ke aplikasi Quiz SMA" />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          padding: 0,
          margin: 0,
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          "@keyframes gradient": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
            "100%": {
              backgroundPosition: "0% 50%",
            },
          },
        }}
      >
        <Container maxWidth="sm">
          <Grow in={true} timeout={800}>
            <Paper
              elevation={10}
              sx={{
                p: isMobile ? 3 : 5,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Fade in={true} timeout={1200}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 56,
                      height: 56,
                      mr: 2,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <SchoolIcon fontSize="large" />
                  </Avatar>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      backgroundClip: "text",
                      textFillColor: "transparent",
                    }}
                  >
                    Quiz SMA
                  </Typography>
                </Box>
              </Fade>

              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                align="center"
                sx={{ mb: 3, fontWeight: 500 }}
              >
                Masuk ke Akun Anda
              </Typography>

              {error && (
                <Fade in={!!error} timeout={500}>
                  <Alert
                    severity={error.includes("berhasil") ? "success" : "error"}
                    sx={{
                      width: "100%",
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                  width: "100%",
                  "& .MuiTextField-root": {
                    transition: "transform 0.2s ease",
                    "&:focus-within": {
                      transform: "translateY(-2px)",
                    },
                  },
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 4,
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(33, 150, 243, 0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Masuk"
                  )}
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Hubungi guru Anda untuk mendapatkan akun
                </Typography>
              </Box>
            </Paper>
          </Grow>

          <Fade in={true} timeout={2000}>
            <Typography
              variant="body2"
              align="center"
              color="white"
              sx={{ mt: 4, opacity: 0.8 }}
            >
              &copy; {new Date().getFullYear()} Quiz SMA - Aplikasi Quiz untuk
              Siswa SMA
            </Typography>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default Login;
