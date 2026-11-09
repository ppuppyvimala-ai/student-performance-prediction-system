import express, { type Request, type Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { MODEL_METRICS, runStudentPrediction } from './server/mlEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes

// 1. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username (Email / Roll No) and password are required.' });
  }

  const user = db.findUser(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Check Roll No / Email or password.' });
  }

  let studentData = null;
  if (user.studentId) {
    studentData = db.getStudentById(user.studentId);
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      rollNo: user.rollNo,
      name: user.name,
      role: user.role,
      studentId: user.studentId
    },
    student: studentData
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { rollNo, name, email, password, phone, gender, department, semester } = req.body;
    if (!rollNo || !name || !email) {
      return res.status(400).json({ error: 'Roll number, Name, and Email are required.' });
    }

    const existingStudent = db.getStudentByRollNo(rollNo);
    if (existingStudent) {
      return res.status(409).json({ error: 'Student with this Roll Number already exists.' });
    }

    const newStudent = db.createStudent({
      rollNo,
      name,
      email,
      phone,
      gender,
      department: department || 'CSE - Artificial Intelligence & Machine Learning',
      semester: Number(semester) || 4,
    });

    const user = db.findUser(email, password || 'student123');

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: newStudent,
      user
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// 2. Student CRUD
app.get('/api/students', (req: Request, res: Response) => {
  const { search, category, risk, sort } = req.query;
  let students = db.getStudents();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    students = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }

  if (category && typeof category === 'string' && category !== 'ALL') {
    students = students.filter(s => s.latestPrediction?.category === category);
  }

  if (risk && typeof risk === 'string' && risk !== 'ALL') {
    students = students.filter(s => s.latestPrediction?.riskLevel === risk);
  }

  if (sort === 'sgpa_desc') {
    students.sort((a, b) => (b.latestPrediction?.predictedSgpa || 0) - (a.latestPrediction?.predictedSgpa || 0));
  } else if (sort === 'sgpa_asc') {
    students.sort((a, b) => (a.latestPrediction?.predictedSgpa || 0) - (b.latestPrediction?.predictedSgpa || 0));
  } else if (sort === 'attendance_desc') {
    students.sort((a, b) => b.academic.attendancePercent - a.academic.attendancePercent);
  } else if (sort === 'attendance_asc') {
    students.sort((a, b) => a.academic.attendancePercent - b.academic.attendancePercent);
  } else if (sort === 'name') {
    students.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({
    total: students.length,
    students
  });
});

app.get('/api/students/:id', (req: Request, res: Response) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

app.post('/api/students', (req: Request, res: Response) => {
  try {
    const { name, rollNo, email } = req.body;
    if (!name || !rollNo || !email) {
      return res.status(400).json({ error: 'Name, Roll Number, and Email are required.' });
    }
    const created = db.createStudent(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create student' });
  }
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update student' });
  }
});

app.put('/api/students/:id/attendance', (req: Request, res: Response) => {
  try {
    const { subjects } = req.body;
    if (!Array.isArray(subjects)) {
      return res.status(400).json({ error: 'Subjects attendance array is required.' });
    }
    const updated = db.updateStudentSubjectAttendance(req.params.id, subjects);
    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update student subject attendance' });
  }
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const deleted = db.deleteStudent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Student not found or already deleted' });
  }
  res.json({ success: true, message: 'Student removed successfully' });
});

// 2.5 Teacher / Faculty Directory CRUD
app.get('/api/teachers', (req: Request, res: Response) => {
  const { search, subject } = req.query;
  let teachers = db.getTeachers();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    teachers = teachers.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.empId.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subjectName.toLowerCase().includes(q) ||
      t.subjectCode.toLowerCase().includes(q) ||
      t.designation.toLowerCase().includes(q)
    );
  }

  if (subject && typeof subject === 'string') {
    teachers = teachers.filter(t => t.subjectCode.toLowerCase() === subject.toLowerCase());
  }

  res.json({
    total: teachers.length,
    teachers
  });
});

app.get('/api/teachers/:id', (req: Request, res: Response) => {
  const teacher = db.getTeacherById(req.params.id);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }
  res.json(teacher);
});

app.post('/api/teachers', (req: Request, res: Response) => {
  try {
    const { name, empId, email, subjectCode } = req.body;
    if (!name || !empId || !email || !subjectCode) {
      return res.status(400).json({ error: 'Name, Employee ID, Email, and Assigned Subject are required.' });
    }
    const created = db.createTeacher(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create teacher record' });
  }
});

app.put('/api/teachers/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateTeacher(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Teacher record not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update teacher record' });
  }
});

app.delete('/api/teachers/:id', (req: Request, res: Response) => {
  const deleted = db.deleteTeacher(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Teacher record not found or already deleted' });
  }
  res.json({ success: true, message: 'Teacher record removed successfully' });
});

// 3. Machine Learning & Prediction Endpoints
app.post('/api/students/:id/predict', (req: Request, res: Response) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Compute prediction
  const newPrediction = runStudentPrediction(student.academic);
  db.addPrediction(student.id, newPrediction);

  res.json({
    success: true,
    prediction: newPrediction,
    student: db.getStudentById(req.params.id)
  });
});

// Real-time What-If Simulation endpoint (does not alter student record)
app.post('/api/predict/what-if', (req: Request, res: Response) => {
  try {
    const academic = req.body;
    if (!academic) {
      return res.status(400).json({ error: 'Academic parameter payload required' });
    }
    const prediction = runStudentPrediction({
      id: 'sim_temp',
      studentId: academic.studentId || 'temp_student',
      semester: academic.semester || 4,
      attendancePercent: Number(academic.attendancePercent) || 75,
      studyHoursPerWeek: Number(academic.studyHoursPerWeek) || 12,
      internalTest1: Number(academic.internalTest1) || 35,
      internalTest2: Number(academic.internalTest2) || 35,
      assignmentScore: Number(academic.assignmentScore) || 75,
      labScore: Number(academic.labScore) || 80,
      previousCgpa: Number(academic.previousCgpa) || 7.0,
      sleepHours: Number(academic.sleepHours) || 7,
      subjects: academic.subjects || [],
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      simulation: prediction
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Simulation error' });
  }
});

// 4. Analytics & Model Info
app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  const analytics = db.getAnalytics();
  res.json(analytics);
});

app.get('/api/model/info', (_req: Request, res: Response) => {
  res.json(MODEL_METRICS);
});

app.post('/api/seed/reset', (_req: Request, res: Response) => {
  const resetDb = db.reset();
  res.json({
    success: true,
    message: 'Database reset to default B.Tech CSE AIML dataset successfully',
    totalStudents: resetDb.students.length
  });
});

// Vite middleware integration (Full-Stack dev & prod)
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPredict Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
