import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Award,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  CalendarCheck,
  ChevronRight,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { Student, UserAccount } from '../types';
import { getCategoryBadge, getRiskBadge, getGradeLetter } from '../utils/formatters';
import { NavigationHeader, AdminModuleTab } from '../components/NavigationHeader';

interface ReportsViewProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateToAdmin: () => void;
  onSelectAdminTab: (tab: AdminModuleTab) => void;
  currentUser?: UserAccount | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onNavigateHome,
  onNavigateBack,
  onNavigateToAdmin,
  onSelectAdminTab,
  currentUser,
  onLogout,
  onOpenAuth,
}) => {
  // If user is logged in as student, enforce their own student record
  const effectiveStudent = (currentUser?.role === 'student' && currentUser.studentId)
    ? (students.find((s) => s.id === currentUser.studentId) || selectedStudent || students[0])
    : (selectedStudent || students[0]);

  const [searchQuery, setSearchQuery] = useState('');

  if (!effectiveStudent) {
    return (
      <div className="py-20 text-center text-slate-400">
        No student records found to generate academic report dossier.
      </div>
    );
  }

  const pred = effectiveStudent.latestPrediction;
  const categoryBadge = getCategoryBadge(pred?.category);
  const riskBadge = getRiskBadge(pred?.riskLevel);
  const grade = pred ? getGradeLetter(pred.predictedSgpa) : { grade: 'N/A', description: 'Pending' };

  const handlePrint = () => {
    window.print();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-0">
      {/* Consistent Navigation Header */}
      <div className="print:hidden">
        <NavigationHeader
          title="Student Performance & ML Analysis Dossier"
          subtitle="Official institutional report card with machine learning projections and prescriptive action plans"
          breadcrumbs={[
            { label: 'Home', onClick: onNavigateHome },
            { label: currentUser?.role === 'student' ? 'Student Portal' : 'Admin Portal', onClick: currentUser?.role === 'student' ? onNavigateBack : onNavigateToAdmin },
            { label: 'Reports Dossier', active: true },
            { label: `${effectiveStudent.name} (${effectiveStudent.rollNo})`, active: true },
          ]}
          portalType={currentUser?.role === 'student' ? 'student' : 'admin'}
          activeAdminTab="reports"
          onSelectAdminTab={onSelectAdminTab}
          currentUser={currentUser}
          onNavigateHome={onNavigateHome}
          onNavigateBack={onNavigateBack}
          onLogout={onLogout}
          onOpenAuth={onOpenAuth}
          actions={
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          }
        />
      </div>

      {/* Student Selector Ribbon (Admin/Guest only) */}
      {currentUser?.role !== 'student' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="text-xs font-bold text-slate-700 block">Select Cohort Student:</span>
              <span className="text-[11px] text-slate-400">Generate report dossier for any enrolled engineering student</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={effectiveStudent.id}
              onChange={(e) => {
                const found = students.find((s) => s.id === e.target.value);
                if (found) onSelectStudent(found);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo}) - Sem {s.semester}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PRINTABLE DOSSIER CARD */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
        
        {/* Top Controls for Quick Printing */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Academic Dossier</h2>
              <p className="text-xs text-slate-500">Autonomous Machine Learning Continuous Evaluation</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>

        {/* INSTITUTIONAL HEADER */}
        <div className="border-b-2 border-indigo-700 pb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-700 text-white shadow-md">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                SRM Institute of Science & Technology
              </h1>
              <p className="text-xs sm:text-sm font-bold text-indigo-700">
                Department of Computer Science & Engineering (AIML Division)
              </p>
              <p className="text-[11px] text-slate-500">
                Student Performance Prediction & Academic Analytics Dossier • Semester {effectiveStudent.semester} (2023-2027)
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Dossier Generated</span>
            <span className="font-mono font-bold text-indigo-900">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="block text-[10px] text-slate-500 mt-0.5">Model Engine v2.4 (Ridge + Tree)</span>
          </div>
        </div>

        {/* STUDENT DEMOGRAPHIC OVERVIEW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs my-6">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Student Name</span>
            <span className="font-bold text-sm text-slate-900">{effectiveStudent.name}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Roll Number</span>
            <span className="font-mono font-bold text-sm text-indigo-700">{effectiveStudent.rollNo}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px] block">University Email</span>
            <span className="font-semibold text-slate-700 truncate block">{effectiveStudent.email}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Department & Batch</span>
            <span className="font-semibold text-slate-700 block">CSE AIML ({effectiveStudent.batch})</span>
          </div>
        </div>

        {/* ML PREDICTION SUMMARY HERO BOX */}
        {pred && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                  Ensemble ML Inference Summary
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <div className="text-4xl sm:text-5xl font-black font-mono text-amber-300">
                    {pred.predictedSgpa.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-300 font-semibold">
                    Predicted SGPA (Grade: <strong className="text-white font-mono">{grade.grade}</strong> - {grade.description})
                  </div>
                </div>
                <p className="text-xs text-indigo-200 mt-1">
                  Projected End-Semester Score: <strong className="text-white font-mono">{pred.predictedScore}%</strong> • Confidence: <strong className="text-white font-mono">{pred.confidenceScore}%</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">Category</span>
                  <span className="font-bold text-sm text-white">{pred.category}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">Risk Tier</span>
                  <span className={`font-bold text-sm ${pred.riskLevel === 'Low' ? 'text-emerald-300' : pred.riskLevel === 'Moderate' ? 'text-amber-300' : 'text-rose-300'}`}>
                    {pred.riskLevel}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">Attendance</span>
                  <span className={`font-mono font-bold text-sm ${effectiveStudent.academic.attendancePercent >= 75 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {effectiveStudent.academic.attendancePercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBJECT-WISE MARKS & ATTENDANCE BREAKDOWN TABLE */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Subject-Wise Academic Performance & Attendance
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Subject Code & Name</th>
                  <th className="py-3 px-3">Credits</th>
                  <th className="py-3 px-3">Internal Test (50)</th>
                  <th className="py-3 px-3">Assignment (50)</th>
                  <th className="py-3 px-3">Total (100)</th>
                  <th className="py-3 px-3">Classes Attended</th>
                  <th className="py-3 px-4">Exam Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {effectiveStudent.academic.subjects?.map((sub) => {
                  const total = sub.internal + sub.assignment;
                  const totalClasses = sub.totalClasses || 40;
                  const attended = sub.attendedClasses ?? Math.round(totalClasses * ((sub.attendancePercent || 80) / 100));
                  const pct = sub.attendancePercent ?? Math.round((attended / totalClasses) * 100);
                  const isEligible = pct >= 75;

                  return (
                    <tr key={sub.code} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-700 mr-2">{sub.code}</span>
                        <span className="text-slate-800 font-bold">{sub.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono">{sub.credits}</td>
                      <td className="py-3 px-3 font-mono">{sub.internal} / 50</td>
                      <td className="py-3 px-3 font-mono">{sub.assignment} / 50</td>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">{total} / 100</td>
                      <td className="py-3 px-3 font-mono">
                        {attended} / {totalClasses} ({pct}%)
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isEligible ? 'Eligible (≥75%)' : 'Shortage (<75%)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRESCRIPTIVE ML ACTION PLAN */}
        {pred && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3 mb-6">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Machine Learning Prescriptive Guidance & Faculty Recommendations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-indigo-950">
              {pred.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INSTITUTIONAL SIGNATURE BLOCK */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs text-slate-500">
          <div>
            <div className="h-10 border-b border-slate-300 mb-2" />
            <p className="font-bold text-slate-700">Course Faculty Advisor</p>
            <span className="text-[10px]">Department of CSE (AIML)</span>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300 mb-2" />
            <p className="font-bold text-slate-700">Head of Department</p>
            <span className="text-[10px]">School of Computing, SRMIST</span>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300 mb-2" />
            <p className="font-bold text-slate-700">Dean of Academics</p>
            <span className="text-[10px]">Controller of Examinations</span>
          </div>
        </div>

      </div>
    </div>
  );
};
