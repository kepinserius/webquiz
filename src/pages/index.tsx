import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Button,
  Paper,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LoginIcon from "@mui/icons-material/Login";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Gunakan useCallback untuk menghindari re-render yang tidak perlu
  const checkAndRedirect = useCallback(() => {
    // Cek apakah user sudah login
    const role = localStorage.getItem("role");
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "user") {
      router.push("/user");
    }
  }, [router]);

  useEffect(() => {
    checkAndRedirect();
  }, [checkAndRedirect]);

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Quiz SMA - Aplikasi Quiz untuk Siswa SMA</title>
        <meta
          name="description"
          content="Aplikasi quiz interaktif untuk siswa SMA"
        />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
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
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            <Grow in={true} timeout={800}>
              <Paper
                elevation={10}
                sx={{
                  p: isMobile ? 4 : 5,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  maxWidth: 600,
                  mx: "auto",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Fade in={true} timeout={1200}>
                  <Box sx={{ textAlign: "center" }}>
                    <SchoolIcon
                      sx={{
                        fontSize: 80,
                        color: "primary.main",
                        mb: 2,
                        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    />

                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      component="h1"
                      gutterBottom
                      fontWeight="bold"
                      sx={{
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      Quiz SMA
                    </Typography>

                    <Typography
                      variant="h6"
                      gutterBottom
                      color="text.secondary"
                      sx={{ mb: 4, maxWidth: "80%", mx: "auto" }}
                    >
                      Aplikasi Quiz Interaktif untuk Siswa SMA
                    </Typography>
                  </Box>
                </Fade>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
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
                >
                  Masuk ke Aplikasi
                </Button>

                <Typography
                  variant="body2"
                  sx={{ mt: 4, color: "text.secondary" }}
                >
                  Hubungi guru Anda untuk mendapatkan akun
                </Typography>
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
          </Box>
        </Container>
      </Box>
    </>
  );
}
