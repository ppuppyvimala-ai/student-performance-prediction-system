import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Sparkles,
  BookOpen,
  Clock,
  Award,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  CalendarCheck,
  FileText,
  User,
  Mail,
  Phone,
  Hash,
  Layers,
  RefreshCw,
  BarChart2,
  ShieldCheck,
  Check,
  ChevronRight,
  Sliders,
  Trash2
} from 'lucide-react';
import { Student, SubjectRecord, Teacher, UserAccount } from '../types';
import { getCategoryBadge, getRiskBadge, getGradeLetter } from '../utils/formatters';
import { NavigationHeader, AdminModuleTab } from '../components/NavigationHeader';

interface AdminStudentDetailsViewProps {
  student: Student;
  allStudents: Student[];
  teachers?: Teacher[];
  onBackToAdmin: () => void;
  onNavigateHome: () => void;
  onSelectAdminTab?: (tab: AdminModuleTab) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  onSaveStudent: (studentId: string, data: Partial<Student>) => Promise<Student>;
  onRunPrediction: (student: Student) => Promise<void>;
  onViewReport: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
  onSelectOtherStudent: (student: Student) => void;
}

export const AdminStudentDetailsView: React.FC<AdminStudentDetailsViewProps> = ({
  student,
  allStudents,
  teachers = [],
  onBackToAdmin,
  onNavigateHome,
  onSelectAdminTab,
  currentUser,
  onLogout,
  onOpenAuth,
  onSaveStudent,
  onRunPrediction,
  onViewReport,
  onDeleteStudent,
  onSelectOtherStudent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form editable states
  const [name, setName] = useState(student.name);
  const [rollNo, setRollNo] = useState(student.rollNo);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [department, setDepartment] = useState(student.department);
  const [semester, setSemester] = useState(student.semester);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(student.gender);
  const [batch, setBatch] = useState(student.batch);

  // Marks & Academic Metrics states
  const [attendancePercent, setAttendancePercent] = useState(student.academic.attendancePercent);
  const [internalTest1, setInternalTest1] = useState(student.academic.internalTest1);
  const [internalTest2, setInternalTest2] = useState(student.academic.internalTest2);
  const [assignmentScore, setAssignmentScore] = useState(student.academic.assignmentScore);
  const [labScore, setLabScore] = useState(student.academic.labScore);
  const [previousCgpa, setPreviousCgpa] = useState(student.academic.previousCgpa);
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(student.academic.studyHoursPerWeek);
  const [sleepHours, setSleepHours] = useState(student.academic.sleepHours || 7);
  const [notes, setNotes] = useState(student.academic.notes || '');

  // Subject-wise records state
  const [subjects, setSubjects] = useState<SubjectRecord[]>(student.academic.subjects || []);

  // Sync state whenever the viewed student prop changes
  useEffect(() => {
    setName(student.name);
    setRollNo(student.rollNo);
    setEmail(student.email);
    setPhone(student.phone);
    setDepartment(student.department);
    setSemester(student.semester);
    setGender(student.gender);
    setBatch(student.batch);

    setAttendancePercent(student.academic.attendancePercent);
    setInternalTest1(student.academic.internalTest1);
    setInternalTest2(student.academic.internalTest2);
    setAssignmentScore(student.academic.assignmentScore);
    setLabScore(student.academic.labScore);
    setPreviousCgpa(student.academic.previousCgpa);
    setStudyHoursPerWeek(student.academic.studyHoursPerWeek);
    setSleepHours(student.academic.sleepHours || 7);
    setNotes(student.academic.notes || '');
    setSubjects(student.academic.subjects ? JSON.parse(JSON.stringify(student.academic.subjects)) : []);

    setIsEditing(false);
    setErrorMessage(null);
  }, [student]);

  // Handle subject-wise field changes in Edit mode
  const handleSubjectChange = (
    index: number,
    field: 'internal' | 'assignment' | 'attendedClasses' | 'totalClasses',
    value: number
  ) => {
    setSubjects((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      // Recalculate attendance percent for this subject
      if (item.totalClasses > 0) {
        item.attendancePercent = Math.round((item.attendedClasses / item.totalClasses) * 1000) / 10;
      }

      updated[index] = item;
      return updated;
    });
  };

  // Auto-sync overall attendance from subject attendance if edited
  const handleSyncAttendanceFromSubjects = () => {
    if (subjects.length === 0) return;
    const totalAttended = subjects.reduce((sum, s) => sum + (s.attendedClasses || 0), 0);
    const totalConducted = subjects.reduce((sum, s) => sum + (s.totalClasses || 0), 0);
    if (totalConducted > 0) {
      const avg = Math.round((totalAttended / totalConducted) * 1000) / 10;
      setAttendancePercent(avg);
    }
  };

  const handleCancelEdit = () => {
    setName(student.name);
    setRollNo(student.rollNo);
    setEmail(student.email);
    setPhone(student.phone);
    setDepartment(student.department);
    setSemester(student.semester);
    setGender(student.gender);
    setBatch(student.batch);

    setAttendancePercent(student.academic.attendancePercent);
    setInternalTest1(student.academic.internalTest1);
    setInternalTest2(student.academic.internalTest2);
    setAssignmentScore(student.academic.assignmentScore);
    setLabScore(student.academic.labScore);
    setPreviousCgpa(student.academic.previousCgpa);
    setStudyHoursPerWeek(student.academic.studyHoursPerWeek);
    setSleepHours(student.academic.sleepHours || 7);
    setNotes(student.academic.notes || '');
    setSubjects(student.academic.subjects ? JSON.parse(JSON.stringify(student.academic.subjects)) : []);

    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !rollNo.trim()) {
      setErrorMessage('Student Name and Roll Number are required.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const payload: Partial<Student> = {
        name: name.trim(),
        rollNo: rollNo.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department,
        semester: Number(semester),
        gender,
        batch,
        academic: {
          ...student.academic,
          attendancePercent: Number(attendancePercent),
          internalTest1: Number(internalTest1),
          internalTest2: Number(internalTest2),
          assignmentScore: Number(assignmentScore),
          labScore: Number(labScore),
          previousCgpa: Number(previousCgpa),
          studyHoursPerWeek: Number(studyHoursPerWeek),
          sleepHours: Number(sleepHours),
          notes,
          subjects,
          updatedAt: new Date().toISOString(),
        },
      };

      await onSaveStudent(student.id, payload);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save student details.');
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerPrediction = async () => {
    setPredicting(true);
    try {
      await onRunPrediction(student);
    } finally {
      setPredicting(false);
    }
  };

  const pred = student.latestPrediction;
  const catBadge = getCategoryBadge(pred?.category);
  const riskBadge = getRiskBadge(pred?.riskLevel);
  const grade = pred ? getGradeLetter(pred.predictedSgpa) : { grade: 'N/A', description: 'Pending' };
  const isAttendanceShortage = student.academic.attendancePercent < 75;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Navigation Header with Home, Back to Admin, Admin Menu, and Cohort Switcher */}
      <NavigationHeader
        title={`${student.name} (${student.rollNo})`}
        subtitle={`Admin Student Details • Semester ${student.semester} • ${student.department}`}
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Admin Portal', onClick: onBackToAdmin },
          { label: 'Student Records', onClick: onBackToAdmin },
          { label: `${student.name} (${student.rollNo})`, active: true },
        ]}
        portalType="admin"
        activeAdminTab="records"
        onSelectAdminTab={(tab) => {
          if (onSelectAdminTab) {
            onSelectAdminTab(tab);
          } else {
            onBackToAdmin();
          }
        }}
        currentUser={currentUser}
        onNavigateHome={onNavigateHome}
        onNavigateBack={onBackToAdmin}
        onLogout={onLogout}
        onOpenAuth={onOpenAuth}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden md:inline">Cohort:</span>
            <select
              value={student.id}
              onChange={(e) => {
                const found = allStudents.find((s) => s.id === e.target.value);
                if (found) onSelectOtherStudent(found);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
            >
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Student details, marks, and attendance successfully updated in the database and re-evaluated!</span>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STUDENT PROFILE HERO HEADER */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                {student.rollNo}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/10">
                Semester {student.semester}
              </span>
              <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-slate-800">
                Batch {student.batch}
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                {student.gender}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>{student.name}</span>
                {saveSuccess && <Check className="w-6 h-6 text-emerald-400" />}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
                {student.department}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {student.email} • {student.phone}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/30 transition"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Student Details</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-200 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/30 transition"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              onClick={handleTriggerPrediction}
              disabled={predicting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 active:scale-95 px-3.5 py-2.5 text-xs sm:text-sm font-bold transition"
              title="Run Ensemble ML Inference"
            >
              <Sparkles className={`w-4 h-4 ${predicting ? 'animate-spin text-purple-300' : ''}`} />
              <span className="hidden sm:inline">Recalculate ML</span>
            </button>

            <button
              onClick={() => onViewReport(student)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 active:scale-95 px-3.5 py-2.5 text-xs sm:text-sm font-bold transition"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Report Card</span>
            </button>

            {onDeleteStudent && (
              <button
                onClick={() => onDeleteStudent(student)}
                className="inline-flex items-center p-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 hover:text-white transition border border-rose-500/30"
                title="Delete Student Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* QUICK METRICS STRIP */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Predicted SGPA</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 mt-0.5">
              {pred ? pred.predictedSgpa.toFixed(2) : '--'}
            </div>
            <span className="text-[10px] text-slate-400">Scale of 10.0</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Performance</span>
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md ${catBadge.bg}`}>
                {pred?.category || 'Pending'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Risk Level</span>
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md ${riskBadge.bg}`}>
                {pred?.riskLevel || 'Normal'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Overall Attendance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xl sm:text-2xl font-black font-mono ${isAttendanceShortage ? 'text-rose-400' : 'text-emerald-400'}`}>
                {student.academic.attendancePercent}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400">{isAttendanceShortage ? 'Below cut-off (75%)' : 'Eligible for Exams'}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Internal Avg (IAT)</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
              {((student.academic.internalTest1 + student.academic.internalTest2) / 2).toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 50</span>
            </div>
            <span className="text-[10px] text-slate-400">IAT-1: {student.academic.internalTest1} • IAT-2: {student.academic.internalTest2}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Prior CGPA</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
              {student.academic.previousCgpa.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-400">Semesters 1-3 Cumulative</span>
          </div>
        </div>
      </div>

      {/* EDIT MODE: FULL FORM EDITOR */}
      {isEditing ? (
        <div className="bg-white rounded-3xl border-2 border-indigo-500/30 p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <span>Edit Student Record, Marks & Attendance</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Update academic continuous evaluation parameters, marks, and attendance. Changes are immediately saved to the student database.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>1. Student Identity & Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration / Roll No *</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  placeholder="RA2311003010001"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  placeholder="student@srmist.edu.in"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Batch</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  placeholder="2023-2027"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Continuous Assessment & Marks */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>2. Marks & Core Academic Metrics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-900 mb-1">
                  Overall Attendance % (0 - 100)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={attendancePercent}
                    onChange={(e) => setAttendancePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-indigo-700">%</span>
                </div>
                <button
                  type="button"
                  onClick={handleSyncAttendanceFromSubjects}
                  className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline block"
                >
                  Auto-sync from subject classes
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Assessment Test 1 (out of 50)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={internalTest1}
                  onChange={(e) => setInternalTest1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Conducted at Week 6</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Assessment Test 2 (out of 50)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={internalTest2}
                  onChange={(e) => setInternalTest2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Conducted at Week 12</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Score (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assignmentScore}
                  onChange={(e) => setAssignmentScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Continuous homework & LMS</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lab / Practical Score (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={labScore}
                  onChange={(e) => setLabScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Laboratory experiments & viva</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous CGPA (0.0 - 10.0)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={previousCgpa}
                  onChange={(e) => setPreviousCgpa(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Cumulative past performance</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Self-Study Hours / Week
                </label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={studyHoursPerWeek}
                  onChange={(e) => setStudyHoursPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Non-classroom learning time</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Sleep Hours
                </label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Health & focus indicator</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Faculty & Proctor Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                placeholder="Advisor notes, participation, or intervention steps..."
              />
            </div>
          </div>

          {/* Section 3: Subject-Wise Marks & Attendance Editor */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>3. Subject-Wise Marks & Attendance Breakdown</span>
              </h3>
              <span className="text-xs text-slate-500">Live attendance percentage updates automatically</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-3">Credits</th>
                    <th className="py-3 px-3">Internal Test (/50)</th>
                    <th className="py-3 px-3">Assignment (/50)</th>
                    <th className="py-3 px-3">Classes Attended</th>
                    <th className="py-3 px-3">Total Classes</th>
                    <th className="py-3 px-3">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjects.map((sub, idx) => {
                    const isShort = (sub.attendancePercent || 0) < 75;
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div>{sub.name}</div>
                          <span className="font-mono text-xs text-indigo-600 font-bold">{sub.code}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono font-bold">{sub.credits}</td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={sub.internal}
                            onChange={(e) => handleSubjectChange(idx, 'internal', Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={sub.assignment}
                            onChange={(e) => handleSubjectChange(idx, 'assignment', Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            max={sub.totalClasses || 60}
                            value={sub.attendedClasses || 0}
                            onChange={(e) => handleSubjectChange(idx, 'attendedClasses', Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={sub.totalClasses || 45}
                            onChange={(e) => handleSubjectChange(idx, 'totalClasses', Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          <span className={isShort ? 'text-rose-600' : 'text-emerald-700'}>
                            {sub.attendancePercent}%
                          </span>
                          {isShort && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-extrabold">
                              Shortage
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* VIEW MODE: COMPREHENSIVE OVERVIEW WITH MARKS & ATTENDANCE */
        <div className="space-y-6">
          
          {/* CARDS GRID: MARKS & ATTENDANCE OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Attendance Record */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Attendance Status</span>
                <CalendarCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black font-mono ${isAttendanceShortage ? 'text-rose-600' : 'text-slate-900'}`}>
                  {student.academic.attendancePercent}%
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  isAttendanceShortage
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isAttendanceShortage ? 'Attendance Shortage' : 'Eligible for Exams'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isAttendanceShortage ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(student.academic.attendancePercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {isAttendanceShortage
                  ? 'Warning: Below mandatory 75% university criteria. Condonation required.'
                  : 'Satisfies university attendance threshold for end-semester exams.'}
              </p>
            </div>

            {/* Card 2: Continuous Assessment (IAT) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Internal Tests</span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Test 1 (IAT-1)</span>
                  <span className="text-2xl font-black font-mono text-slate-900">{student.academic.internalTest1}</span>
                  <span className="text-xs text-slate-400"> / 50</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Test 2 (IAT-2)</span>
                  <span className="text-2xl font-black font-mono text-slate-900">{student.academic.internalTest2}</span>
                  <span className="text-xs text-slate-400"> / 50</span>
                </div>
              </div>
              <div className="pt-1 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>Weighted IAT Total:</span>
                <span className="font-mono font-bold text-indigo-700">
                  {((student.academic.internalTest1 + student.academic.internalTest2) / 2).toFixed(1)} / 50
                </span>
              </div>
            </div>

            {/* Card 3: Assignments & Lab Work */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Coursework & Lab</span>
                <BookOpen className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Assignments</span>
                  <span className="text-2xl font-black font-mono text-slate-900">{student.academic.assignmentScore}</span>
                  <span className="text-xs text-slate-400"> %</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Lab Practical</span>
                  <span className="text-2xl font-black font-mono text-slate-900">{student.academic.labScore}</span>
                  <span className="text-xs text-slate-400"> %</span>
                </div>
              </div>
              <div className="pt-1 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>Lab Performance:</span>
                <span className="font-semibold text-emerald-600">
                  {student.academic.labScore >= 80 ? 'Distinction' : 'Standard'}
                </span>
              </div>
            </div>

            {/* Card 4: Study Habits & Routine */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Study Habits</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Study / Week</span>
                  <span className="text-2xl font-black font-mono text-slate-900">{student.academic.studyHoursPerWeek}</span>
                  <span className="text-xs text-slate-400"> hrs</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Sleep / Day</span>
                  <span className="text-2xl font-black font-mono text-slate-900">{student.academic.sleepHours || 7}</span>
                  <span className="text-xs text-slate-400"> hrs</span>
                </div>
              </div>
              <div className="pt-1 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                <span>Study Ratio:</span>
                <span className="font-semibold text-slate-700">
                  {student.academic.studyHoursPerWeek >= 14 ? 'High Dedication' : 'Needs Optimization'}
                </span>
              </div>
            </div>
          </div>

          {/* SUBJECT-WISE MARKS & ATTENDANCE TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Subject-Wise Marks & Attendance Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed evaluation of B.Tech CSE AIML subjects for Semester {student.semester}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Marks & Attendance</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Subject Code & Name</th>
                    <th className="py-3.5 px-3">Credits</th>
                    <th className="py-3.5 px-3">Internal Mark (/50)</th>
                    <th className="py-3.5 px-3">Assignment (/50)</th>
                    <th className="py-3.5 px-3">Total (/100)</th>
                    <th className="py-3.5 px-3">Classes</th>
                    <th className="py-3.5 px-4 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(student.academic.subjects || []).map((sub) => {
                    const totalMarks = sub.internal + sub.assignment;
                    const isShort = (sub.attendancePercent || 0) < 75;
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{sub.name}</div>
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {sub.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-600">{sub.credits}</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{sub.internal} / 50</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{sub.assignment} / 50</td>
                        <td className="py-3.5 px-3">
                          <span className={`font-mono font-black ${totalMarks >= 75 ? 'text-indigo-600' : 'text-slate-800'}`}>
                            {totalMarks}
                          </span>
                          <span className="text-xs text-slate-400"> / 100</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-slate-600">
                          {sub.attendedClasses || 0} / {sub.totalClasses || 45}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`font-mono font-bold ${isShort ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {sub.attendancePercent}%
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isShort
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {isShort ? 'Shortage' : 'Eligible'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MACHINE LEARNING PERFORMANCE EVALUATION */}
          {pred && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>ML Predictive Performance & Prescriptive Guidance</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Model Confidence: <span className="font-bold text-slate-800">{pred.confidenceScore}%</span> • Evaluated on {new Date(pred.simulatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleTriggerPrediction}
                  disabled={predicting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${predicting ? 'animate-spin' : ''}`} />
                  <span>Re-evaluate Model</span>
                </button>
              </div>

              {/* Feature contributions breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Key Contributing Academic Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {pred.featureContributions.map((fc, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border ${
                        fc.status === 'Positive'
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : fc.status === 'Negative'
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{fc.feature}</span>
                        <span className={`text-xs font-mono font-bold ${
                          fc.status === 'Positive'
                            ? 'text-emerald-700'
                            : fc.status === 'Negative'
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }`}>
                          {fc.impact > 0 ? `+${fc.impact}%` : `${fc.impact}%`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{fc.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptive recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Prescriptive Recommendations for Improvement
                </h4>
                <div className="space-y-2">
                  {pred.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FACULTY PROCTOR NOTES */}
          {student.academic.notes && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                Faculty & Proctor Academic Notes
              </span>
              <p className="text-xs sm:text-sm text-amber-950 font-medium">
                {student.academic.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
