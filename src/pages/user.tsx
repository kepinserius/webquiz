import { useState } from "react";
import { Box, Button, Typography, Container, Alert } from "@mui/material";
import { useRouter } from "next/router";
import { Question } from "../types/question";

const UserQuiz: React.FC = () => {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const questions: Question[] = [
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
  ];

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
    setCorrectAnswer(questions[currentQuestionIndex].answer);

    if (option === questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1); // Tambah skor jika jawaban benar
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
    } else {
      alert(`Quiz selesai! Skor Anda: ${score}/${questions.length}`);
      router.push("/"); // Redirect ke halaman login setelah quiz selesai
    }
  };

  const handleLogout = () => router.push("/");

  return (
    <Container>
      <Box textAlign="center" mt={5}>
        <Typography variant="h4">Quiz SMA</Typography>
        <Box mt={3}>
          <Typography variant="h6">
            {questions[currentQuestionIndex].question}
          </Typography>
          {questions[currentQuestionIndex].options.map((option, i) => (
            <Button
              key={i}
              variant={
                selectedAnswer
                  ? option === correctAnswer
                    ? "contained"
                    : "outlined"
                  : "outlined"
              }
              color={
                selectedAnswer
                  ? option === correctAnswer
                    ? "success"
                    : option === selectedAnswer
                    ? "error"
                    : "primary"
                  : "primary"
              }
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedAnswer} // Disable tombol setelah memilih jawaban
              sx={{ m: 1 }}
            >
              {option}
            </Button>
          ))}
        </Box>
        {selectedAnswer && (
          <Alert
            severity={
              selectedAnswer === correctAnswer ? "success" : "error"
            }
            sx={{ mt: 2 }}
          >
            {selectedAnswer === correctAnswer
              ? "Jawaban Anda benar!"
              : `Jawaban salah! Jawaban yang benar adalah ${correctAnswer}.`}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextQuestion}
          sx={{ mt: 5 }}
          disabled={!selectedAnswer} // Disable tombol jika belum memilih jawaban
        >
          {currentQuestionIndex < questions.length - 1
            ? "Pertanyaan Berikutnya"
            : "Selesaikan Quiz"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default UserQuiz;
