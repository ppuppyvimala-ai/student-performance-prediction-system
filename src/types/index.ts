export interface SubjectRecord {
  code: string;
  name: string;
  internal: number; // out of 50
  assignment: number; // out of 50
  credits: number;
  totalClasses: number; // total classes conducted
  attendedClasses: number; // classes attended
  attendancePercent: number; // automatically calculated %
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  semester: number;
  attendancePercent: number;
  studyHoursPerWeek: number;
  internalTest1: number; // out of 50
  internalTest2: number; // out of 50
  assignmentScore: number; // 0-100
  labScore: number; // 0-100
  previousCgpa: number; // 0-10
  sleepHours: number;
  subjects: SubjectRecord[];
  notes?: string;
  updatedAt: string;
}

export interface FeatureContribution {
  feature: string;
  impact: number;
  status: 'Positive' | 'Neutral' | 'Negative';
  detail: string;
}

export interface PredictionResult {
  id: string;
  studentId: string;
  predictedScore: number;
  predictedSgpa: number;
  category: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  confidenceScore: number;
  featureContributions: FeatureContribution[];
  recommendations: string[];
  simulatedAt: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  year: number;
  semester: number;
  batch: string;
  academic: AcademicRecord;
  latestPrediction?: PredictionResult;
  predictionHistory: PredictionResult[];
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  rollNo?: string;
  name: string;
  role: 'admin' | 'student';
  studentId?: string;
}

export interface MLModelMetrics {
  name: string;
  version: string;
  algorithm: string;
  trainedOnRecords: number;
  rSquared: number;
  meanAbsoluteError: number;
  rootMeanSquaredError: number;
  trainingAccuracy: number;
  features: {
    name: string;
    weight: number;
    description: string;
  }[];
}

export interface AnalyticsOverview {
  totalStudents: number;
  averageSgpa: number;
  averageAttendance: number;
  averageStudyHours: number;
  passRate: number;
  categoryCounts: {
    Excellent: number;
    Good: number;
    Average: number;
    'Needs Improvement': number;
  };
  riskCounts: {
    Low: number;
    Moderate: number;
    High: number;
    Critical: number;
  };
  subjectAverages: {
    code: string;
    name: string;
    average: number;
  }[];
}

export interface Teacher {
  id: string;
  empId: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  subjectCode: string; // e.g. 'CS201'
  subjectName: string; // e.g. 'Data Structures & Algorithms'
  cabinNumber: string; // e.g. 'TP-402, Tech Park 4th Floor'
  qualification?: string; // e.g. 'Ph.D. in Computer Science (IIT Madras)'
  experienceYears?: number; // e.g. 12
  officeHours?: string; // e.g. 'Mon & Wed: 2:00 PM - 4:00 PM'
  avatarUrl?: string;
  createdAt: string;
}
