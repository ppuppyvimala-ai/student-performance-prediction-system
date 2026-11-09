import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Sliders,
  FileText,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Radar, Line } from 'react-chartjs-2';
import '../utils/chartSetup';
import { Student, Teacher, UserAccount } from '../types';
import { getCategoryBadge, getRiskBadge, getGradeLetter } from '../utils/formatters';
import { NavigationHeader } from '../components/NavigationHeader';

interface StudentDashboardViewProps {
  students: Student[];
  currentStudent: Student | null;
  currentUser?: UserAccount | null;
  teachers?: Teacher[];
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  onSelectStudent: (student: Student) => void;
  onOpenWhatIf: () => void;
  onViewReport: (student: Student) => void;
  onRunPrediction: (student: Student) => Promise<void>;
  onNavigateToFaculty?: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  students,
  currentStudent,
  currentUser,
  teachers = [],
  onNavigateHome,
  onNavigateBack,
  onLogout,
  onOpenAuth,
  onSelectStudent,
  onOpenWhatIf,
  onViewReport,
  onRunPrediction,
  onNavigateToFaculty,
}) => {
  // If a student account is logged in, lock view exclusively to their own student record
  const student = (currentUser?.role === 'student' && currentUser.studentId)
    ? (students.find((s) => s.id === currentUser.studentId) || currentStudent || students[0])
    : (currentStudent || students[0]);

  if (!student) {
    return (
      <div className="py-20 text-center text-slate-400">
        No student record loaded. Please select or enroll a student.
      </div>
    );
  }

  const pred = student.latestPrediction;
  const catBadge = getCategoryBadge(pred?.category);
  const riskBadge = getRiskBadge(pred?.riskLevel);
  const grade = pred ? getGradeLetter(pred.predictedSgpa) : { grade: 'N/A', description: 'Pending' };

  // Subject-wise Radar Chart Data
  const subjects = student.academic.subjects || [];
  const radarData = {
    labels: subjects.map((s) => s.code),
    datasets: [
      {
        label: 'Internal Marks (scaled / 100)',
        data: subjects.map((s) => (s.internal + s.assignment)),
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#4f46e5',
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4f46e5',
      },
      {
        label: 'Benchmark Target (80%)',
        data: subjects.map(() => 80),
        borderColor: 'rgba(148, 163, 184, 0.5)',
        borderDash: [4, 4],
        pointRadius: 0,
        backgroundColor: 'transparent',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20, font: { size: 9 } },
        pointLabels: { font: { size: 10, weight: 'bold' as const } },
      },
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 10 } } },
      tooltip: {
        callbacks: {
          title: (items: any) => {
            const idx = items[0]?.dataIndex;
            return subjects[idx]?.name || '';
          },
        },
      },
    },
  };

  // Prediction History Trend Line
  const history = [...(student.predictionHistory || [])].reverse();
  const lineData = {
    labels: history.map((_, i) => `Inference #${i + 1}`),
    datasets: [
      {
        label: 'Predicted Score %',
        data: history.map((p) => p.predictedScore),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#7c3aed',
        pointRadius: 4,
      },
    ],
  };

  const isAttendanceShortage = student.academic.attendancePercent < 75;

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Header with Home, Back, Student Menu, and Logout */}
      <NavigationHeader
        title="Student Academic & Performance Portal"
        subtitle={`Personal Scorecard & ML Guidance • ${student.name} (${student.rollNo})`}
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Student Portal', active: true },
          { label: `${student.name} (${student.rollNo})`, active: true },
        ]}
        portalType="student"
        currentUser={currentUser}
        onNavigateHome={onNavigateHome}
        onNavigateBack={onNavigateBack}
        onLogout={onLogout}
        onOpenAuth={onOpenAuth}
        onSelectStudentSection={(section) => {
          if (section === 'what-if') {
            onOpenWhatIf();
          } else if (section === 'report') {
            onViewReport(student);
          } else if (section === 'teachers' && onNavigateToFaculty) {
            onNavigateToFaculty();
          } else {
            let targetId = '';
            if (section === 'scorecard') targetId = 'student-scorecard';
            else if (section === 'attendance') targetId = 'student-attendance';
            else if (section === 'marks') targetId = 'student-marks';
            else if (section === 'recommendations') targetId = 'student-recommendations';
            if (targetId) {
              const el = document.getElementById(targetId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
        actions={
          <div className="flex items-center gap-2">
            {currentUser?.role !== 'student' && (
              <select
                value={student.id}
                onChange={(e) => {
                  const found = students.find((s) => s.id === e.target.value);
                  if (found) onSelectStudent(found);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo})
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => onViewReport(student)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report Card</span>
            </button>
          </div>
        }
      />


      {/* STUDENT PROFILE HERO CARD */}
      <div id="student-scorecard" className="scroll-mt-32 sm:scroll-mt-36 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-2xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Identity & Department */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                {student.rollNo}
              </span>
              <span className="text-xs text-slate-300">Semester {student.semester}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">{student.batch}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{student.name}</h2>
            <p className="text-xs sm:text-sm text-indigo-200">{student.department}</p>
            <p className="text-xs text-slate-400">{student.email} • {student.phone}</p>
          </div>

          {/* Predicted SGPA Banner */}
          {pred && (
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15">
              <div className="text-center sm:text-right">
                <span className="text-[11px] uppercase font-bold text-indigo-200 block">Predicted SGPA</span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 mt-0.5">
                  {pred.predictedSgpa.toFixed(2)}
                </div>
                <span className="text-[10px] text-indigo-200">
                  Grade {grade.grade} ({grade.description})
                </span>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div className="text-center sm:text-left">
                <span className="text-[11px] uppercase font-bold text-indigo-200 block">Performance</span>
                <div className="text-lg font-bold text-white mt-1">
                  {pred.category}
                </div>
                <span className="text-[10px] text-indigo-200 block">
                  {pred.predictedScore}% Final Score
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ATTENDANCE & ACADEMIC METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className={`p-5 rounded-2xl bg-white border shadow-xs ${
          isAttendanceShortage ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Attendance</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono ${isAttendanceShortage ? 'text-rose-600' : 'text-slate-900'}`}>
              {student.academic.attendancePercent}%
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isAttendanceShortage ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isAttendanceShortage ? 'Shortage (<75%)' : 'Eligible'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isAttendanceShortage
              ? 'Urgent: Attend next classes to avoid semester detention.'
              : 'Punctuality criteria satisfied.'}
          </p>
        </div>

        {/* Study Hours */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Self-Study</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">
            {student.academic.studyHoursPerWeek} <span className="text-xs font-normal text-slate-400">hrs/wk</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {student.academic.studyHoursPerWeek >= 18
              ? 'Top percentile study dedication.'
              : '15-20 hrs/wk recommended for AIML.'}
          </p>
        </div>

        {/* Continuous Assessments */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Midterms Total</span>
            <Award className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black font-mono text-indigo-700">
            {student.academic.internalTest1 + student.academic.internalTest2} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            IAT1: {student.academic.internalTest1}/50 • IAT2: {student.academic.internalTest2}/50
          </p>
        </div>

        {/* Historical CGPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Prior CGPA</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-700">
            {student.academic.previousCgpa.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Academic track record through Sem 3
          </p>
        </div>
      </div>

      {/* SUBJECT-WISE ATTENDANCE MANAGEMENT & ELIGIBILITY SECTION */}
      <div id="student-attendance" className="scroll-mt-32 sm:scroll-mt-36 rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Subject-Wise Attendance & Examination Eligibility
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual class attendance across all 6 core courses. University regulation mandates minimum <strong className="text-slate-800">75% attendance</strong> for end-semester board exams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Semester Average:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-black font-mono border ${
              isAttendanceShortage
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {student.academic.attendancePercent}% • {isAttendanceShortage ? 'Shortage (<75%)' : 'Eligible'}
            </span>
          </div>
        </div>

        {/* 6 Subject Attendance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {subjects.map((sub) => {
            const total = sub.totalClasses || 40;
            const attended = sub.attendedClasses ?? Math.round(total * ((sub.attendancePercent || 80) / 100));
            const pct = sub.attendancePercent ?? (total > 0 ? Math.round((attended / total) * 1000) / 10 : 0);
            const isEligible = pct >= 75;
            const classesNeeded = !isEligible ? Math.max(1, Math.ceil(3 * total - 4 * attended)) : 0;
            const assignedTeacher = teachers.find(
              (t) => t.subjectCode.toUpperCase() === sub.code.toUpperCase()
            );

            return (
              <div
                key={sub.code}
                className={`p-4 rounded-xl border transition-all ${
                  isEligible
                    ? 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    : 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                        {sub.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">({sub.credits} Credits)</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{sub.name}</h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      isEligible
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isEligible ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Eligible
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        Shortage
                      </>
                    )}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 my-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Attended: <strong className="font-mono text-slate-900">{attended}</strong> / {total} classes
                    </span>
                    <span className={`font-mono font-black ${isEligible ? 'text-indigo-700' : 'text-rose-600'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 85
                          ? 'bg-emerald-500'
                          : pct >= 75
                          ? 'bg-indigo-600'
                          : pct >= 65
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>

                {/* Status footnote */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  {assignedTeacher ? (
                    <span className="text-slate-500 truncate" title={assignedTeacher.name}>
                      Faculty: <strong className="text-slate-700">{assignedTeacher.name.split(' ')[0]} {assignedTeacher.name.split(' ')[1] || ''}</strong>
                    </span>
                  ) : (
                    <span className="text-slate-400">Regular Session</span>
                  )}

                  {!isEligible ? (
                    <span className="text-rose-700 font-bold">
                      Need {classesNeeded} more class{classesNeeded > 1 ? 'es' : ''}
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      Above 75% limit
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHARTS GRID: RADAR + INFLUENCING FACTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Radar Chart: Subject Mastery */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subject-Wise Competency Radar</h3>
                <p className="text-xs text-slate-400">Continuous Assessment + Assignment (out of 100)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                6 Courses
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Points outside the gray dashed line surpass the departmental distinction benchmark (80%).
          </p>
        </div>

        {/* Feature Attribution (Why this prediction was made) */}
        {pred && (
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Model Feature Attribution</h3>
                  <p className="text-xs text-slate-400">Factor impacts on predicted grade</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  SHAP Weights
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {pred.featureContributions.map((fc, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">{fc.feature}</span>
                      <span className={`font-bold font-mono text-[11px] ${
                        fc.status === 'Positive' ? 'text-emerald-600' : fc.status === 'Neutral' ? 'text-indigo-600' : 'text-rose-600'
                      }`}>
                        {fc.impact}% impact ({fc.status})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${
                          fc.status === 'Positive' ? 'bg-emerald-500' : fc.status === 'Neutral' ? 'bg-indigo-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, fc.impact * 2.2)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">{fc.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Want to see what changing study hours does?</span>
              <button
                onClick={onOpenWhatIf}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Launch What-If Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PRESCRIPTIVE IMPROVEMENT ROADMAP */}
      {pred && (
        <div id="student-recommendations" className="scroll-mt-32 sm:scroll-mt-36 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-blue-50/80 border border-indigo-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wider">
              AI/ML Prescriptive Recommendations & Action Plan
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {pred.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-indigo-100 shadow-2xs text-xs text-indigo-900"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                  {i + 1}
                </div>
                <p className="leading-relaxed pt-0.5">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBJECT-WISE MARKS ACCORDION/GRID */}
      <div id="student-marks" className="scroll-mt-32 sm:scroll-mt-36 rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 sm:p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Detailed Subject Score Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {subjects.map((sub) => {
            const total = sub.internal + sub.assignment;
            const assignedTeacher = teachers.find(
              (t) => t.subjectCode.toUpperCase() === sub.code.toUpperCase()
            );

            return (
              <div key={sub.code} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:border-indigo-200 transition">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {sub.code}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{sub.credits} Credits</span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{sub.name}</div>

                {/* Assigned Course Instructor */}
                {assignedTeacher ? (
                  <div className="p-2 rounded-lg bg-white border border-slate-200/70 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-indigo-700">Course Instructor</span>
                      <span className="text-[10px] text-slate-400 font-mono">{assignedTeacher.empId}</span>
                    </div>
                    <p className="font-bold text-slate-800 line-clamp-1">{assignedTeacher.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span className="truncate">{assignedTeacher.cabinNumber}</span>
                      <a
                        href={`mailto:${assignedTeacher.email}`}
                        className="text-indigo-600 hover:underline font-semibold ml-1 shrink-0"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-white/60 border border-dashed border-slate-200 text-[11px] text-slate-400">
                    Faculty assignment pending
                  </div>
                )}

                {/* Subject Attendance Meter */}
                <div className="p-2 rounded-lg bg-white border border-slate-200/70 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">Attendance:</span>
                    <span className={`font-mono font-bold ${
                      (sub.attendancePercent ?? 80) >= 75 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {sub.attendedClasses ?? Math.round((sub.totalClasses || 40) * ((sub.attendancePercent || 80) / 100))}/{sub.totalClasses || 40} ({sub.attendancePercent ?? 80}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (sub.attendancePercent ?? 80) >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, sub.attendancePercent ?? 80))}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Internal / Asgn</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {sub.internal} + {sub.assignment}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Score</span>
                    <span className="font-mono font-bold text-sm text-indigo-700">
                      {total} <span className="text-[10px] text-slate-400">/ 100</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
