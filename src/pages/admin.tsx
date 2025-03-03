import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter } from "next/router";
import { Question } from "../types/question";

// Interface untuk data siswa
interface Student {
  id: number;
  username: string;
  role: string;
  created_at: string;
  scores: Score[];
  averageScore: number;
  totalQuizzes: number;
  lastQuiz: string | null;
}

// Interface untuk data skor
interface Score {
  score: number;
  total_questions: number;
  created_at: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("");

  // State untuk manajemen soal
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  // State untuk statistik
  const [userCount, setUserCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  // State untuk membuat akun siswa
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  // State untuk daftar siswa
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Cek apakah user adalah admin
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    if (!storedUsername || userRole !== "admin") {
      router.push("/login");
    } else {
      setAdminName(storedUsername);
      fetchQuestions();
      fetchStats();
      fetchStudents();
    }
  }, [router]);

  // Fungsi untuk mengambil data soal
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();

      if (res.status === 200) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fungsi untuk mengambil statistik
  const fetchStats = async () => {
    try {
      // Mengambil jumlah siswa
      const usersRes = await fetch("/api/get-users");
      const usersData = await usersRes.json();
      if (usersRes.status === 200) {
        setUserCount(usersData.users.length);
      }

      // Mengambil jumlah soal
      const questionsRes = await fetch("/api/questions");
      const questionsData = await questionsRes.json();
      if (questionsRes.status === 200) {
        setQuestionCount(questionsData.questions.length);
      }

      // Mengambil jumlah quiz yang telah diselesaikan
      const scoresRes = await fetch("/api/scores");
      const scoresData = await scoresRes.json();
      if (scoresRes.status === 200) {
        setQuizCount(scoresData.scores.length);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fungsi untuk mengambil daftar siswa
  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch("/api/get-users");
      const data = await res.json();
      if (res.status === 200) {
        setStudents(data.users);
      } else {
        console.error("Error fetching students:", data.error);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Fungsi untuk menangani pembuatan akun admin
  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!username || !password) {
      setError("Username dan password harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-admin", {
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
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuat akun siswa
  const handleCreateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStudentError("");
    setStudentSuccess("");
    setStudentLoading(true);

    if (!studentUsername || !studentPassword) {
      setStudentError("Username dan password harus diisi.");
      setStudentLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: studentUsername,
          password: studentPassword,
          role: "user",
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setStudentSuccess("Akun siswa berhasil dibuat!");
        setStudentUsername(""); // Reset field input
        setStudentPassword(""); // Reset field input

        // Refresh daftar siswa setelah berhasil membuat akun
        await fetchStudents();
      } else {
        setStudentError(data.error || "Gagal membuat akun siswa");
      }
    } catch (error) {
      setStudentError("Terjadi kesalahan saat membuat akun siswa");
    } finally {
      setStudentLoading(false);
    }
  };

  // Fungsi untuk menangani perubahan tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fungsi untuk menangani perubahan opsi
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Fungsi untuk menambah soal baru
  const handleAddQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validasi input
    if (!newQuestion || options.some((opt: string) => !opt) || !correctAnswer) {
      setError("Semua field harus diisi!");
      setLoading(false);
      return;
    }

    // Validasi jawaban benar ada di opsi
    if (!options.includes(correctAnswer)) {
      setError("Jawaban benar harus ada di opsi!");
      setLoading(false);
      return;
    }

    try {
      const method = editingQuestionId ? "PUT" : "POST";
      const endpoint = editingQuestionId
        ? `/api/questions?id=${editingQuestionId}`
        : "/api/questions";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newQuestion,
          options,
          answer: correctAnswer,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setSuccess(
          editingQuestionId
            ? "Soal berhasil diperbarui!"
            : "Soal berhasil ditambahkan!"
        );
        setNewQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
        setEditingQuestionId(null);
        fetchQuestions();
      } else {
        setError(data.error || "Gagal menambahkan soal");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menambahkan soal");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengedit soal
  const handleEditQuestion = (question: Question) => {
    setNewQuestion(question.question);
    setOptions([...question.options]);
    setCorrectAnswer(question.answer);
    setEditingQuestionId(question.id);
    setTabValue(1); // Pindah ke tab tambah soal
  };

  // Fungsi untuk menghapus soal
  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    try {
      const res = await fetch(`/api/questions?id=${questionToDelete}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        setSuccess("Soal berhasil dihapus!");
        fetchQuestions();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menghapus soal");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus soal");
    } finally {
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    }
  };

  // Fungsi untuk konfirmasi hapus soal
  const confirmDeleteQuestion = (id: string) => {
    setQuestionToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="lg">
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{ borderRadius: "4px 4px 0 0", mb: 3 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Quiz SMA - Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Selamat datang, {adminName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          variant="fullWidth"
        >
          <Tab label="Dashboard" />
          <Tab label="Tambah Soal" />
          <Tab label="Daftar Soal" />
          <Tab label="Tambah Admin" />
          <Tab label="Tambah Siswa" />
          <Tab
            label="Daftar Siswa"
            icon={<PeopleIcon />}
            iconPosition="start"
          />
        </Tabs>

        {/* Tab Dashboard */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Dashboard Admin
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total User
                  </Typography>
                  <Typography variant="h3">{userCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total Soal
                  </Typography>
                  <Typography variant="h3">{questionCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Quiz Selesai
                  </Typography>
                  <Typography variant="h3">{quizCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Aksi Cepat
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setTabValue(1)}
                >
                  Tambah Soal Baru
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => setTabValue(2)}>
                  Lihat Semua Soal
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab Tambah Soal */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            {editingQuestionId ? "Edit Soal" : "Tambah Soal Baru"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleAddQuestion}>
            <TextField
              label="Pertanyaan"
              fullWidth
              value={newQuestion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewQuestion(e.target.value)
              }
              margin="normal"
              required
            />

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Opsi Jawaban:
            </Typography>

            <Grid container spacing={2}>
              {options.map((option: string, index: number) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    label={`Opsi ${index + 1}`}
                    fullWidth
                    value={option}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOptionChange(index, e.target.value)
                    }
                    margin="normal"
                    required
                  />
                </Grid>
              ))}
            </Grid>

            <TextField
              label="Jawaban Benar"
              fullWidth
              value={correctAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCorrectAnswer(e.target.value)
              }
              margin="normal"
              required
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                {editingQuestionId ? "Update" : "Tambah"}
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Daftar Soal */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Daftar Soal
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Pertanyaan</TableCell>
                  <TableCell>Opsi</TableCell>
                  <TableCell>Jawaban Benar</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{question.question}</TableCell>
                    <TableCell>{question.options.join(", ")}</TableCell>
                    <TableCell>{question.answer}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => confirmDeleteQuestion(question.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab Tambah Admin */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Tambah Admin
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleCreateAdmin}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              margin="normal"
              required
            />
            <TextField
              label="Password"
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Tambah
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Tambah Siswa */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" gutterBottom>
            Tambah Akun Siswa
          </Typography>

          {studentError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {studentError}
            </Alert>
          )}
          {studentSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {studentSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={handleCreateStudent}>
            <TextField
              label="Username Siswa"
              fullWidth
              value={studentUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStudentUsername(e.target.value)
              }
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={studentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStudentPassword(e.target.value)
              }
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={studentLoading}
                startIcon={<PersonAddIcon />}
              >
                {studentLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Buat Akun Siswa"
                )}
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Daftar Siswa */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h5" gutterBottom>
            Daftar Siswa
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PersonAddIcon />}
              onClick={() => setTabValue(4)}
            >
              Tambah Siswa Baru
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={fetchStudents}
              disabled={studentsLoading}
            >
              Refresh Data
            </Button>
          </Box>

          {studentsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : students.length === 0 ? (
            <Typography variant="body1">
              Belum ada data siswa. Silakan tambahkan siswa baru.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Tanggal Dibuat</TableCell>
                    <TableCell align="center">Total Quiz</TableCell>
                    <TableCell align="center">Rata-rata Nilai</TableCell>
                    <TableCell>Quiz Terakhir</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{formatDate(student.created_at)}</TableCell>
                      <TableCell align="center">
                        {student.totalQuizzes}
                      </TableCell>
                      <TableCell align="center">
                        {student.totalQuizzes > 0 ? (
                          <Chip
                            label={`${student.averageScore}%`}
                            color={
                              student.averageScore >= 70
                                ? "success"
                                : student.averageScore >= 50
                                ? "warning"
                                : "error"
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {student.lastQuiz
                          ? formatDate(student.lastQuiz)
                          : "Belum pernah"}
                      </TableCell>
                      <TableCell align="center">
                        {student.totalQuizzes > 0 ? (
                          <Chip label="Aktif" color="success" size="small" />
                        ) : (
                          <Chip
                            label="Belum Aktif"
                            color="default"
                            size="small"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>

      {/* Dialog untuk konfirmasi hapus soal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Konfirmasi Hapus Soal"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin menghapus soal ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
          <Button onClick={handleDeleteQuestion} autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
