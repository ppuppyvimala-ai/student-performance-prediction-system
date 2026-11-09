import fs from 'fs';
import path from 'path';
import { type AcademicRecord, type PredictionResult, type Student, runStudentPrediction } from './mlEngine.ts';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'students_database.json');

import type { Teacher } from '../src/types/index.ts';

export interface UserAccount {
  id: string;
  email: string;
  rollNo?: string;
  name: string;
  role: 'admin' | 'student';
  passwordHash: string; // In-memory/local hash check
  studentId?: string;
}

export interface AppDatabase {
  users: UserAccount[];
  students: Student[];
  teachers: Teacher[];
}

const DEFAULT_SUBJECTS_TEMPLATE = [
  { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, totalClasses: 45, attendedClasses: 38, attendancePercent: 84.4 },
  { code: 'AI202', name: 'Foundations of Machine Learning', credits: 4, totalClasses: 45, attendedClasses: 40, attendancePercent: 88.9 },
  { code: 'CS203', name: 'Database Management Systems', credits: 3, totalClasses: 36, attendedClasses: 30, attendancePercent: 83.3 },
  { code: 'CS204', name: 'Operating Systems & Architecture', credits: 3, totalClasses: 36, attendedClasses: 29, attendancePercent: 80.6 },
  { code: 'MA205', name: 'Discrete Mathematics & Probability', credits: 4, totalClasses: 45, attendedClasses: 38, attendancePercent: 84.4 },
  { code: 'AI206', name: 'Artificial Intelligence Lab', credits: 2, totalClasses: 28, attendedClasses: 25, attendancePercent: 89.3 }
];

export function ensureStudentSubjectAttendance(student: Student): Student {
  const defaultClassCounts: Record<string, number> = {
    CS201: 45,
    AI202: 45,
    CS203: 36,
    CS204: 36,
    MA205: 45,
    AI206: 28,
  };

  const attRatio = (student.academic.attendancePercent || 80) / 100;

  student.academic.subjects = (student.academic.subjects || []).map((sub, i) => {
    const total = sub.totalClasses && sub.totalClasses > 0 ? sub.totalClasses : (defaultClassCounts[sub.code] || 40);
    let attended = sub.attendedClasses;
    if (attended === undefined || attended === null) {
      const variance = (((i * 17) % 7) - 3) * 0.02;
      const targetRatio = Math.max(0.3, Math.min(1.0, attRatio + variance));
      attended = Math.min(total, Math.max(0, Math.round(total * targetRatio)));
    }
    const percent = Math.round((attended / total) * 1000) / 10;
    return {
      ...sub,
      totalClasses: total,
      attendedClasses: attended,
      attendancePercent: percent
    };
  });

  return student;
}

function createSampleStudents(): Student[] {
  const samplesData: Omit<Student, 'id' | 'createdAt' | 'predictionHistory' | 'latestPrediction'>[] = [
    {
      rollNo: 'RA2311003010012',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@srmist.edu.in',
      phone: '+91 98765 43210',
      gender: 'Male',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_1',
        studentId: '',
        semester: 4,
        attendancePercent: 92,
        studyHoursPerWeek: 21,
        internalTest1: 46,
        internalTest2: 48,
        assignmentScore: 94,
        labScore: 95,
        previousCgpa: 9.35,
        sleepHours: 7.5,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 47, assignment: 48, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 48, assignment: 49, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 46, assignment: 47, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 44, assignment: 46, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 46, assignment: 46, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 49, assignment: 50, credits: 2 },
        ],
        notes: 'Consistent peer tutor and competitive programmer.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010045',
      name: 'Sneha Patel',
      email: 'sneha.patel@srmist.edu.in',
      phone: '+91 98123 45678',
      gender: 'Female',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_2',
        studentId: '',
        semester: 4,
        attendancePercent: 84,
        studyHoursPerWeek: 15,
        internalTest1: 41,
        internalTest2: 39,
        assignmentScore: 82,
        labScore: 86,
        previousCgpa: 8.24,
        sleepHours: 7,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 40, assignment: 42, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 42, assignment: 44, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 38, assignment: 40, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 39, assignment: 41, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 40, assignment: 39, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 45, assignment: 44, credits: 2 },
        ],
        notes: 'Active in AI club; steady improvements in algorithms.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010088',
      name: 'Rohan Iyer',
      email: 'rohan.iyer@srmist.edu.in',
      phone: '+91 97654 32109',
      gender: 'Male',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_3',
        studentId: '',
        semester: 4,
        attendancePercent: 74,
        studyHoursPerWeek: 10,
        internalTest1: 32,
        internalTest2: 31,
        assignmentScore: 68,
        labScore: 72,
        previousCgpa: 6.75,
        sleepHours: 6,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 29, assignment: 32, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 34, assignment: 36, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 30, assignment: 33, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 28, assignment: 30, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 31, assignment: 34, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 38, assignment: 39, credits: 2 },
        ],
        notes: 'Borderline attendance. Needs support with OS memory management concepts.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010103',
      name: 'Priya Reddy',
      email: 'priya.reddy@srmist.edu.in',
      phone: '+91 96543 21098',
      gender: 'Female',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_4',
        studentId: '',
        semester: 4,
        attendancePercent: 61,
        studyHoursPerWeek: 5,
        internalTest1: 21,
        internalTest2: 23,
        assignmentScore: 50,
        labScore: 56,
        previousCgpa: 5.12,
        sleepHours: 5,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 19, assignment: 24, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 24, assignment: 27, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 22, assignment: 25, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 18, assignment: 22, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 20, assignment: 23, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 30, assignment: 32, credits: 2 },
        ],
        notes: 'High risk of semester detention due to medical absence. Mentor intervention scheduled.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010156',
      name: 'Vikram Malhotra',
      email: 'vikram.m@srmist.edu.in',
      phone: '+91 95432 10987',
      gender: 'Male',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_5',
        studentId: '',
        semester: 4,
        attendancePercent: 88,
        studyHoursPerWeek: 17,
        internalTest1: 43,
        internalTest2: 44,
        assignmentScore: 89,
        labScore: 91,
        previousCgpa: 8.58,
        sleepHours: 7,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 44, assignment: 46, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 45, assignment: 46, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 42, assignment: 43, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 41, assignment: 42, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 43, assignment: 44, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 48, assignment: 47, credits: 2 },
        ],
        notes: 'Strong practical skills; team lead in college hackathon.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010189',
      name: 'Ananya Sen',
      email: 'ananya.sen@srmist.edu.in',
      phone: '+91 94321 09876',
      gender: 'Female',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_6',
        studentId: '',
        semester: 4,
        attendancePercent: 97,
        studyHoursPerWeek: 26,
        internalTest1: 49,
        internalTest2: 50,
        assignmentScore: 98,
        labScore: 98,
        previousCgpa: 9.85,
        sleepHours: 8,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 50, assignment: 50, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 49, assignment: 50, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 48, assignment: 49, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 49, assignment: 48, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 50, assignment: 50, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 50, assignment: 50, credits: 2 },
        ],
        notes: 'Department rank 1. Research paper under preparation in deep learning.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010214',
      name: 'Mohammed Zeeshan',
      email: 'zeeshan.m@srmist.edu.in',
      phone: '+91 93210 98765',
      gender: 'Male',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_7',
        studentId: '',
        semester: 4,
        attendancePercent: 79,
        studyHoursPerWeek: 12,
        internalTest1: 35,
        internalTest2: 36,
        assignmentScore: 74,
        labScore: 78,
        previousCgpa: 7.15,
        sleepHours: 6.5,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 34, assignment: 37, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 37, assignment: 38, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 35, assignment: 36, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 32, assignment: 34, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 34, assignment: 35, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 41, assignment: 42, credits: 2 },
        ],
        notes: 'Shows good interest in ML models; needs boost in discrete probability.',
        updatedAt: new Date().toISOString()
      }
    },
    {
      rollNo: 'RA2311003010260',
      name: 'Tanvi Deshmukh',
      email: 'tanvi.d@srmist.edu.in',
      phone: '+91 92109 87654',
      gender: 'Female',
      department: 'CSE - Artificial Intelligence & Machine Learning',
      year: 2,
      semester: 4,
      batch: '2023-2027',
      academic: {
        id: 'acad_8',
        studentId: '',
        semester: 4,
        attendancePercent: 82,
        studyHoursPerWeek: 16,
        internalTest1: 39,
        internalTest2: 42,
        assignmentScore: 84,
        labScore: 88,
        previousCgpa: 7.92,
        sleepHours: 7,
        subjects: [
          { code: 'CS201', name: 'Data Structures & Algorithms', internal: 40, assignment: 43, credits: 4 },
          { code: 'AI202', name: 'Foundations of Machine Learning', internal: 41, assignment: 44, credits: 4 },
          { code: 'CS203', name: 'Database Management Systems', internal: 38, assignment: 41, credits: 3 },
          { code: 'CS204', name: 'Operating Systems & Architecture', internal: 37, assignment: 39, credits: 3 },
          { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 39, assignment: 40, credits: 4 },
          { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 46, assignment: 46, credits: 2 },
        ],
        notes: 'Consistent improvement in internal tests; strong lab records.',
        updatedAt: new Date().toISOString()
      }
    }
  ];

  return samplesData.map((data, index) => {
    const studentId = `std_${index + 1}`;
    const academic: AcademicRecord = {
      ...data.academic,
      id: `acad_${index + 1}`,
      studentId
    };

    const initialPrediction = runStudentPrediction(academic);

    return {
      id: studentId,
      rollNo: data.rollNo,
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      department: data.department,
      year: data.year,
      semester: data.semester,
      batch: data.batch,
      academic,
      latestPrediction: initialPrediction,
      predictionHistory: [initialPrediction],
      createdAt: new Date(Date.now() - (index + 1) * 86400000 * 4).toISOString()
    };
  });
}

function createDefaultUsers(students: Student[]): UserAccount[] {
  const users: UserAccount[] = [
    {
      id: 'usr_admin',
      email: 'admin@edupredict.ac.in',
      name: 'Dr. K. Ramanathan (HOD CSE-AIML)',
      role: 'admin',
      passwordHash: 'admin123'
    }
  ];

  for (const s of students) {
    users.push({
      id: `usr_${s.id}`,
      email: s.email,
      rollNo: s.rollNo,
      name: s.name,
      role: 'student',
      studentId: s.id,
      passwordHash: 'student123'
    });
  }

  return users;
}

export function createSampleTeachers(): Teacher[] {
  return [
    {
      id: 'tch_1',
      empId: 'EMP-CSE-1021',
      name: 'Dr. R. Meenakshi',
      designation: 'Professor',
      department: 'Computer Science & Engineering',
      email: 'meenakshi.r@srmist.edu.in',
      phone: '+91 98401 23456',
      subjectCode: 'CS201',
      subjectName: 'Data Structures & Algorithms',
      cabinNumber: 'Tech Park 4th Floor, Cabin 402',
      qualification: 'Ph.D. in Computer Science (IIT Madras)',
      experienceYears: 16,
      officeHours: 'Mon & Wed: 2:00 PM - 4:00 PM',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tch_2',
      empId: 'EMP-AIML-2045',
      name: 'Dr. S. Vignesh',
      designation: 'Associate Professor',
      department: 'Artificial Intelligence & Machine Learning',
      email: 'vignesh.s@srmist.edu.in',
      phone: '+91 98402 34567',
      subjectCode: 'AI202',
      subjectName: 'Foundations of Machine Learning',
      cabinNumber: 'Tech Park 5th Floor, Cabin 508',
      qualification: 'Ph.D. in Deep Learning (IISc Bangalore)',
      experienceYears: 11,
      officeHours: 'Tue & Thu: 10:00 AM - 12:00 PM',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tch_3',
      empId: 'EMP-CSE-1088',
      name: 'Dr. Priya Sundaram',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'priya.sundaram@srmist.edu.in',
      phone: '+91 98403 45678',
      subjectCode: 'CS203',
      subjectName: 'Database Management Systems',
      cabinNumber: 'Tech Park 3rd Floor, Cabin 312',
      qualification: 'M.Tech, Ph.D. in Distributed Data (Anna Univ)',
      experienceYears: 8,
      officeHours: 'Wed & Fri: 3:00 PM - 5:00 PM',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tch_4',
      empId: 'EMP-CSE-1102',
      name: 'Prof. K. Anand Kumar',
      designation: 'Associate Professor',
      department: 'Computer Science & Engineering',
      email: 'anandkumar.k@srmist.edu.in',
      phone: '+91 98404 56789',
      subjectCode: 'CS204',
      subjectName: 'Operating Systems & Architecture',
      cabinNumber: 'Tech Park 4th Floor, Cabin 415',
      qualification: 'M.E. in Computer Systems, Pursuing Ph.D.',
      experienceYears: 13,
      officeHours: 'Mon & Thu: 11:00 AM - 1:00 PM',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tch_5',
      empId: 'EMP-MATH-3012',
      name: 'Dr. M. V. Lakshmi',
      designation: 'Professor',
      department: 'Mathematics & Statistics',
      email: 'lakshmi.mv@srmist.edu.in',
      phone: '+91 98405 67890',
      subjectCode: 'MA205',
      subjectName: 'Discrete Mathematics & Probability',
      cabinNumber: 'Tech Park 2nd Floor, Cabin 201',
      qualification: 'Ph.D. in Applied Mathematics (Univ of Madras)',
      experienceYears: 19,
      officeHours: 'Tue & Fri: 2:00 PM - 3:30 PM',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tch_6',
      empId: 'EMP-AIML-2077',
      name: 'Dr. Rajesh Narayanan',
      designation: 'Assistant Professor (Senior Grade)',
      department: 'Artificial Intelligence & Machine Learning',
      email: 'rajesh.n@srmist.edu.in',
      phone: '+91 98406 78901',
      subjectCode: 'AI206',
      subjectName: 'Artificial Intelligence Lab',
      cabinNumber: 'Tech Park 5th Floor, AI Lab 2',
      qualification: 'Ph.D. in Computer Vision & Robotics',
      experienceYears: 7,
      officeHours: 'Mon to Fri: 4:00 PM - 5:00 PM',
      createdAt: new Date().toISOString()
    }
  ];
}

class DatabaseManager {
  private data: AppDatabase;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): AppDatabase {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.students) && parsed.students.length > 0) {
          parsed.students = parsed.students.map((s: Student) => ensureStudentSubjectAttendance(s));
          if (!Array.isArray(parsed.teachers) || parsed.teachers.length === 0) {
            parsed.teachers = createSampleTeachers();
          }
          this.saveDatabase(parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading db file, regenerating default data:', err);
    }

    const defaultStudents = createSampleStudents();
    const defaultUsers = createDefaultUsers(defaultStudents);
    const defaultTeachers = createSampleTeachers();
    const initialDb: AppDatabase = {
      users: defaultUsers,
      students: defaultStudents,
      teachers: defaultTeachers
    };
    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave?: AppDatabase): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public reset(): AppDatabase {
    const students = createSampleStudents();
    const users = createDefaultUsers(students);
    const teachers = createSampleTeachers();
    this.data = { students, users, teachers };
    this.saveDatabase();
    return this.data;
  }

  public getUsers(): UserAccount[] {
    return this.data.users;
  }

  public findUser(emailOrRoll: string, password: string): UserAccount | undefined {
    const lower = emailOrRoll.trim().toLowerCase();
    return this.data.users.find(u =>
      (u.email.toLowerCase() === lower || (u.rollNo && u.rollNo.toLowerCase() === lower)) &&
      u.passwordHash === password
    );
  }

  public registerStudentUser(student: Student, password = 'student123'): UserAccount {
    const existing = this.data.users.find(u => u.email.toLowerCase() === student.email.toLowerCase() || u.rollNo === student.rollNo);
    if (existing) return existing;

    const newUser: UserAccount = {
      id: `usr_${student.id}`,
      email: student.email,
      rollNo: student.rollNo,
      name: student.name,
      role: 'student',
      studentId: student.id,
      passwordHash: password
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  public getStudents(): Student[] {
    return this.data.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.data.students.find(s => s.id === id);
  }

  public getStudentByRollNo(rollNo: string): Student | undefined {
    return this.data.students.find(s => s.rollNo.toLowerCase() === rollNo.toLowerCase());
  }

  public createStudent(input: Partial<Student> & { name: string; rollNo: string; email: string }): Student {
    const id = `std_${Date.now()}`;
    const studentId = id;

    const academic: AcademicRecord = {
      id: `acad_${Date.now()}`,
      studentId,
      semester: input.semester || 4,
      attendancePercent: input.academic?.attendancePercent ?? 80,
      studyHoursPerWeek: input.academic?.studyHoursPerWeek ?? 14,
      internalTest1: input.academic?.internalTest1 ?? 38,
      internalTest2: input.academic?.internalTest2 ?? 40,
      assignmentScore: input.academic?.assignmentScore ?? 80,
      labScore: input.academic?.labScore ?? 85,
      previousCgpa: input.academic?.previousCgpa ?? 7.8,
      sleepHours: input.academic?.sleepHours ?? 7,
      subjects: input.academic?.subjects && input.academic.subjects.length > 0
        ? input.academic.subjects
        : DEFAULT_SUBJECTS_TEMPLATE.map(sub => ({
            ...sub,
            internal: 38,
            assignment: 40
          })),
      notes: input.academic?.notes || 'Newly enrolled academic record.',
      updatedAt: new Date().toISOString()
    };

    const initialPrediction = runStudentPrediction(academic);

    const student: Student = {
      id,
      rollNo: input.rollNo.toUpperCase().trim(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone || '+91 90000 00000',
      gender: input.gender || 'Male',
      department: input.department || 'CSE - Artificial Intelligence & Machine Learning',
      year: input.year || 2,
      semester: input.semester || 4,
      batch: input.batch || '2023-2027',
      academic,
      latestPrediction: initialPrediction,
      predictionHistory: [initialPrediction],
      createdAt: new Date().toISOString()
    };

    this.data.students.unshift(student);
    this.registerStudentUser(student);
    this.saveDatabase();
    return student;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const current = this.data.students[index];
    let updatedAcademic: AcademicRecord = current.academic;

    if (updates.academic) {
      // Process subjects if provided
      let subjects = current.academic.subjects;
      if (updates.academic.subjects && Array.isArray(updates.academic.subjects)) {
        subjects = updates.academic.subjects.map(sub => {
          const totalClasses = Math.max(1, Math.round(Number(sub.totalClasses) || 40));
          const attendedClasses = Math.min(totalClasses, Math.max(0, Math.round(Number(sub.attendedClasses) || 0)));
          const attendancePercent = Math.round((attendedClasses / totalClasses) * 1000) / 10;
          return {
            ...sub,
            internal: Math.min(50, Math.max(0, Number(sub.internal) || 0)),
            assignment: Math.min(50, Math.max(0, Number(sub.assignment) || 0)),
            credits: Number(sub.credits) || 3,
            totalClasses,
            attendedClasses,
            attendancePercent
          };
        });
      }

      // Calculate or use overall attendance
      let overallAttendance = updates.academic.attendancePercent !== undefined
        ? Number(updates.academic.attendancePercent)
        : current.academic.attendancePercent;

      if (updates.academic.subjects && updates.academic.attendancePercent === undefined) {
        const totalHeld = subjects.reduce((sum, s) => sum + (s.totalClasses || 0), 0);
        const totalAttended = subjects.reduce((sum, s) => sum + (s.attendedClasses || 0), 0);
        if (totalHeld > 0) {
          overallAttendance = Math.round((totalAttended / totalHeld) * 1000) / 10;
        }
      }

      updatedAcademic = {
        ...current.academic,
        ...updates.academic,
        attendancePercent: overallAttendance,
        subjects,
        studentId: current.id,
        updatedAt: new Date().toISOString()
      };
    }

    // Rerun ML prediction automatically on academic updates
    const newPrediction = runStudentPrediction(updatedAcademic);

    const updatedStudent: Student = {
      ...current,
      ...updates,
      academic: updatedAcademic,
      latestPrediction: newPrediction,
      predictionHistory: [newPrediction, ...(current.predictionHistory || []).slice(0, 9)]
    };

    this.data.students[index] = updatedStudent;
    this.saveDatabase();
    return updatedStudent;
  }

  public updateStudentSubjectAttendance(
    id: string,
    attendanceUpdates: { code: string; totalClasses: number; attendedClasses: number }[]
  ): Student | null {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const current = this.data.students[index];
    const updateMap = new Map(attendanceUpdates.map(u => [u.code.toUpperCase(), u]));

    const updatedSubjects = current.academic.subjects.map(sub => {
      const update = updateMap.get(sub.code.toUpperCase());
      if (!update) return sub;

      const total = Math.max(1, Math.round(Number(update.totalClasses) || 1));
      const attended = Math.min(total, Math.max(0, Math.round(Number(update.attendedClasses) || 0)));
      const percent = Math.round((attended / total) * 1000) / 10;

      return {
        ...sub,
        totalClasses: total,
        attendedClasses: attended,
        attendancePercent: percent
      };
    });

    const totalHeld = updatedSubjects.reduce((sum, s) => sum + (s.totalClasses || 0), 0);
    const totalAttended = updatedSubjects.reduce((sum, s) => sum + (s.attendedClasses || 0), 0);
    const overallAttendancePercent = totalHeld > 0
      ? Math.round((totalAttended / totalHeld) * 1000) / 10
      : current.academic.attendancePercent;

    const updatedAcademic: AcademicRecord = {
      ...current.academic,
      subjects: updatedSubjects,
      attendancePercent: overallAttendancePercent,
      updatedAt: new Date().toISOString()
    };

    const newPrediction = runStudentPrediction(updatedAcademic);

    const updatedStudent: Student = {
      ...current,
      academic: updatedAcademic,
      latestPrediction: newPrediction,
      predictionHistory: [newPrediction, ...(current.predictionHistory || []).slice(0, 9)]
    };

    this.data.students[index] = updatedStudent;
    this.saveDatabase();
    return updatedStudent;
  }

  public deleteStudent(id: string): boolean {
    const initialLen = this.data.students.length;
    this.data.students = this.data.students.filter(s => s.id !== id);
    this.data.users = this.data.users.filter(u => u.studentId !== id);
    if (this.data.students.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public addPrediction(studentId: string, prediction: PredictionResult): Student | null {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    student.latestPrediction = prediction;
    student.predictionHistory = [prediction, ...(student.predictionHistory || []).slice(0, 9)];
    this.saveDatabase();
    return student;
  }

  public getAnalytics() {
    const students = this.data.students;
    const total = students.length;
    if (total === 0) {
      return {
        totalStudents: 0,
        averageSgpa: 0,
        averageAttendance: 0,
        averageStudyHours: 0,
        passRate: 0,
        categoryCounts: { Excellent: 0, Good: 0, Average: 0, 'Needs Improvement': 0 },
        riskCounts: { Low: 0, Moderate: 0, High: 0, Critical: 0 },
        subjectAverages: []
      };
    }

    let sumSgpa = 0;
    let sumAttendance = 0;
    let sumStudyHours = 0;
    let passingCount = 0;

    const categoryCounts = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      'Needs Improvement': 0
    };

    const riskCounts = {
      Low: 0,
      Moderate: 0,
      High: 0,
      Critical: 0
    };

    const subjectAccumulator: Record<string, { name: string; totalMarks: number; count: number }> = {};

    for (const s of students) {
      const pred = s.latestPrediction || runStudentPrediction(s.academic);
      sumSgpa += pred.predictedSgpa;
      sumAttendance += s.academic.attendancePercent;
      sumStudyHours += s.academic.studyHoursPerWeek;

      if (pred.predictedScore >= 50) passingCount++;

      categoryCounts[pred.category] = (categoryCounts[pred.category] || 0) + 1;
      riskCounts[pred.riskLevel] = (riskCounts[pred.riskLevel] || 0) + 1;

      // Subject stats
      if (s.academic.subjects) {
        for (const sub of s.academic.subjects) {
          if (!subjectAccumulator[sub.code]) {
            subjectAccumulator[sub.code] = { name: sub.name, totalMarks: 0, count: 0 };
          }
          // Combined subject mark normalized out of 100
          subjectAccumulator[sub.code].totalMarks += (sub.internal + sub.assignment);
          subjectAccumulator[sub.code].count += 1;
        }
      }
    }

    const subjectAverages = Object.entries(subjectAccumulator).map(([code, val]) => ({
      code,
      name: val.name,
      average: Math.round((val.totalMarks / val.count) * 10) / 10
    }));

    return {
      totalStudents: total,
      averageSgpa: Math.round((sumSgpa / total) * 100) / 100,
      averageAttendance: Math.round((sumAttendance / total) * 10) / 10,
      averageStudyHours: Math.round((sumStudyHours / total) * 10) / 10,
      passRate: Math.round((passingCount / total) * 100),
      categoryCounts,
      riskCounts,
      subjectAverages
    };
  }

  // Teacher / Faculty Management
  public getTeachers(): Teacher[] {
    if (!Array.isArray(this.data.teachers)) {
      this.data.teachers = createSampleTeachers();
      this.saveDatabase();
    }
    return this.data.teachers;
  }

  public getTeacherById(id: string): Teacher | undefined {
    return this.getTeachers().find(t => t.id === id);
  }

  public getTeacherBySubjectCode(code: string): Teacher | undefined {
    return this.getTeachers().find(t => t.subjectCode.toLowerCase() === code.toLowerCase());
  }

  public createTeacher(input: Partial<Teacher> & { name: string; empId: string; email: string; subjectCode: string }): Teacher {
    const id = `tch_${Date.now()}`;
    const newTeacher: Teacher = {
      id,
      empId: input.empId.toUpperCase().trim(),
      name: input.name.trim(),
      designation: input.designation || 'Assistant Professor',
      department: input.department || 'CSE - Artificial Intelligence & Machine Learning',
      email: input.email.trim().toLowerCase(),
      phone: input.phone || '+91 98400 00000',
      subjectCode: input.subjectCode.toUpperCase().trim(),
      subjectName: input.subjectName || input.subjectCode,
      cabinNumber: input.cabinNumber || 'Tech Park 4th Floor',
      qualification: input.qualification || 'M.Tech, Ph.D.',
      experienceYears: Number(input.experienceYears) || 5,
      officeHours: input.officeHours || 'Mon to Fri: 3:00 PM - 4:00 PM',
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(this.data.teachers)) {
      this.data.teachers = [];
    }
    this.data.teachers.push(newTeacher);
    this.saveDatabase();
    return newTeacher;
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updated: Teacher = {
      ...teachers[index],
      ...updates,
      id
    };
    teachers[index] = updated;
    this.data.teachers = teachers;
    this.saveDatabase();
    return updated;
  }

  public deleteTeacher(id: string): boolean {
    const teachers = this.getTeachers();
    const initialLen = teachers.length;
    this.data.teachers = teachers.filter(t => t.id !== id);
    if (this.data.teachers.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }
}

export const db = new DatabaseManager();
