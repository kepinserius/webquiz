import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import TimerIcon from "@mui/icons-material/Timer";
import { useRouter } from "next/router";
import { Question } from "../types/question";

const UserQuiz: React.FC = () => {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 detik per soal
  const [quizFinished, setQuizFinished] = useState(false);
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "Apa ibu kota Indonesia?",
      options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
      answer: "Jakarta",
    },
    {
      id: "2",
      question: "Siapa presiden pertama Indonesia?",
      options: ["Soekarno", "Soeharto", "Habibie", "Jokowi"],
      answer: "Soekarno",
    },
    {
      id: "3",
      question: "Kapan Indonesia merdeka?",
      options: [
        "17 Agustus 1945",
        "17 Agustus 1944",
        "17 Agustus 1946",
        "17 Agustus 1949",
      ],
      answer: "17 Agustus 1945",
    },
    {
      id: "4",
      question: "Apa lambang negara Indonesia?",
      options: ["Garuda Pancasila", "Elang Jawa", "Komodo", "Harimau Sumatera"],
      answer: "Garuda Pancasila",
    },
    {
      id: "5",
      question: "Siapa penulis lagu Indonesia Raya?",
      options: [
        "W.R. Supratman",
        "Ismail Marzuki",
        "C. Simanjuntak",
        "Kusbini",
      ],
      answer: "W.R. Supratman",
    },
  ]);

  // Cek apakah user sudah login
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    if (!storedUsername || userRole !== "user") {
      router.push("/login");
    } else {
      setUsername(storedUsername);
    }
  }, [router]);

  // Timer untuk soal
  useEffect(() => {
    if (quizFinished || !username) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Jika waktu habis dan belum menjawab, otomatis pindah ke soal berikutnya
          if (!selectedAnswer) {
            handleNextQuestion();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, selectedAnswer, quizFinished, username]);

  // Reset timer saat pindah soal
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestionIndex]);

  const handleOptionClick = (option: string) => {
    if (selectedAnswer) return; // Jika sudah menjawab, tidak bisa memilih lagi

    setSelectedAnswer(option);
    setCorrectAnswer(questions[currentQuestionIndex].answer);

    if (option === questions[currentQuestionIndex].answer) {
      setScore((prev: number) => prev + 1); // Tambah skor jika jawaban benar
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizFinished(true);

    // Simpan skor ke database
    try {
      const userId = localStorage.getItem("userId");
      await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          score,
          totalQuestions: questions.length,
        }),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setQuizFinished(false);
    setTimeLeft(30);
  };

  // Tampilan hasil quiz
  if (quizFinished) {
    return (
      <Container maxWidth="md">
        <AppBar
          position="static"
          color="primary"
          elevation={0}
          sx={{ borderRadius: "4px 4px 0 0", mb: 3 }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Quiz SMA
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Quiz Selesai!
            </Typography>
            <Typography variant="h5" gutterBottom>
              Selamat {username}!
            </Typography>

            <Box
              sx={{ my: 4, p: 3, bgcolor: "background.paper", borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                Skor Anda:
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                {score}/{questions.length}
              </Typography>
              <Typography variant="body1">
                ({Math.round((score / questions.length) * 100)}%)
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleRestartQuiz}
              sx={{ mr: 2 }}
            >
              Mulai Quiz Baru
            </Button>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{ borderRadius: "4px 4px 0 0" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Quiz SMA
          </Typography>
          <Chip
            icon={<TimerIcon />}
            label={`${timeLeft}s`}
            color={timeLeft < 10 ? "error" : "default"}
            sx={{ mr: 2 }}
          />
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ p: 0, borderRadius: "0 0 4px 4px" }}>
        <LinearProgress
          variant="determinate"
          value={(currentQuestionIndex / questions.length) * 100}
          sx={{ height: 8, borderRadius: "0" }}
        />

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="body2">
                  Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                </Typography>
                <Chip
                  label={`Skor: ${score}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {questions[currentQuestionIndex].question}
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={2}>
                {questions[currentQuestionIndex].options.map(
                  (option: string, i: number) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Button
                        fullWidth
                        variant={
                          selectedAnswer
                            ? option === correctAnswer
                              ? "contained"
                              : option === selectedAnswer
                              ? "contained"
                              : "outlined"
                            : "outlined"
                        }
                        color={
                          selectedAnswer
                            ? option === correctAnswer
                              ? "success"
                              : option === selectedAnswer &&
                                option !== correctAnswer
                              ? "error"
                              : "primary"
                            : "primary"
                        }
                        onClick={() => handleOptionClick(option)}
                        disabled={!!selectedAnswer}
                        sx={{
                          py: 2,
                          justifyContent: "flex-start",
                          textAlign: "left",
                        }}
                      >
                        {option}
                      </Button>
                    </Grid>
                  )
                )}
              </Grid>

              {selectedAnswer && (
                <Alert
                  severity={
                    selectedAnswer === correctAnswer ? "success" : "error"
                  }
                  sx={{ mt: 3 }}
                >
                  {selectedAnswer === correctAnswer
                    ? "Jawaban Anda benar!"
                    : `Jawaban salah! Jawaban yang benar adalah ${correctAnswer}.`}
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer && timeLeft > 0}
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Pertanyaan Berikutnya"
                    : "Selesaikan Quiz"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserQuiz;
