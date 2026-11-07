import React from 'react';
import { X, Printer, Download, Award, GraduationCap, CheckCircle2, AlertTriangle, FileText, Sparkles } from 'lucide-react';
import { Student } from '../types';
import { getCategoryBadge, getRiskBadge, getGradeLetter } from '../utils/formatters';

interface ReportModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, student, onClose }) => {
  if (!isOpen || !student) return null;

  const pred = student.latestPrediction;
  const categoryBadge = getCategoryBadge(pred?.category);
  const riskBadge = getRiskBadge(pred?.riskLevel);
  const grade = pred ? getGradeLetter(pred.predictedSgpa) : { grade: 'N/A', description: 'Pending' };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 my-6 print:m-0 print:border-none print:shadow-none">
        
        {/* Top Controls (Hidden during printing) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Performance & ML Analysis Report</h2>
              <p className="text-xs text-slate-500">Official Academic & Predictive Assessment Dossier</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div id="printable-report" className="space-y-6 text-slate-800">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-indigo-600 pb-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 to-purple-700 text-white shadow-md">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  SRM Institute of Science & Technology
                </h1>
                <p className="text-xs sm:text-sm font-bold text-indigo-700">
                  Department of Computer Science & Engineering (AI & ML)
                </p>
                <p className="text-[11px] text-slate-500">
                  Student Performance Prediction & Academic Analytics Dossier • Semester {student.semester} (2023-2027)
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Report Generated</span>
              <span className="font-mono font-bold text-indigo-900">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Model v2.4 (Ridge + Tree)</span>
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Student Name</span>
              <span className="font-bold text-sm text-slate-900">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Roll Number</span>
              <span className="font-mono font-bold text-sm text-indigo-700">{student.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">University Email</span>
              <span className="font-semibold text-slate-700 truncate block">{student.email}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Program & Branch</span>
              <span className="font-semibold text-slate-700">B.Tech CSE (AIML)</span>
            </div>
          </div>

          {/* Continuous Assessment KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Attendance Record</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {student.academic.attendancePercent}%
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  student.academic.attendancePercent >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {student.academic.attendancePercent >= 75 ? 'Eligible' : 'Shortage'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">75% university norm</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Weekly Study Hours</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {student.academic.studyHoursPerWeek}
                </span>
                <span className="text-xs text-slate-500">hrs/week</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Self-study & homework</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Internal Assessments</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-indigo-700">
                  {student.academic.internalTest1 + student.academic.internalTest2}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                IAT1: {student.academic.internalTest1}/50 • IAT2: {student.academic.internalTest2}/50
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Previous Cumulative GPA</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-purple-700">
                  {student.academic.previousCgpa.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">/ 10.0</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Historical academic baseline</span>
            </div>
          </div>

          {/* Machine Learning Prediction Result Card */}
          {pred && (
            <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
                    ML Model Output & Final Evaluation Projection
                  </span>
                </div>
                <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-indigo-100 font-mono">
                  Confidence: {pred.confidenceScore.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
                  <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Predicted Score</span>
                  <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white">
                    {pred.predictedScore}%
                  </div>
                  <span className="text-[10px] text-indigo-200">Scaled out of 100</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
                  <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Predicted SGPA</span>
                  <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-amber-300">
                    {pred.predictedSgpa.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-indigo-200">Grade Letter: {grade.grade} ({grade.description})</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
                  <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Performance Band</span>
                  <div className="text-xl font-bold mt-2 text-white">
                    {pred.category}
                  </div>
                  <span className="text-[10px] text-indigo-200">Based on multi-factor classifier</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
                  <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Academic Risk Index</span>
                  <div className="text-xl font-bold mt-2 text-white">
                    {pred.riskLevel} Risk
                  </div>
                  <span className="text-[10px] text-indigo-200">Departmental monitoring level</span>
                </div>
              </div>
            </div>
          )}

          {/* Subject-Wise Assessment Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Subject-Wise Continuous Evaluation & Internal Marks</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Credits</th>
                    <th className="py-2.5 px-3 text-center">Internal (50)</th>
                    <th className="py-2.5 px-3 text-center">Assignment (50)</th>
                    <th className="py-2.5 px-3 text-center">Total (100)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {student.academic.subjects?.map((sub) => {
                    const total = sub.internal + sub.assignment;
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{sub.code}</td>
                        <td className="py-2.5 px-3 text-slate-900">{sub.name}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.credits}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.internal}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.assignment}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{total}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            total >= 80 ? 'bg-emerald-100 text-emerald-800' :
                            total >= 60 ? 'bg-indigo-100 text-indigo-800' :
                            total >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {total >= 80 ? 'Distinction' : total >= 60 ? 'First Class' : total >= 50 ? 'Pass' : 'Warning'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prescriptive Recommendations & Feature Analysis */}
          {pred && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Key Influencing Factors (SHAP/Feature Attribution)</span>
                </h4>
                <div className="space-y-2">
                  {pred.featureContributions.map((fc, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{fc.feature}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fc.status === 'Positive' ? 'bg-emerald-500' : fc.status === 'Neutral' ? 'bg-indigo-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, fc.impact * 2)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-700 w-8 text-right">
                          {fc.impact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Prescriptive Action Roadmap</span>
                </h4>
                <ul className="space-y-2 text-xs text-indigo-900">
                  {pred.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Verification & Sign-off footer */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Faculty Academic Counselor</p>
              <p className="text-[11px] text-slate-400">Department of CSE (AIML)</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-300 w-36 h-6 mb-1" />
              <p className="text-[11px] text-slate-400">Head of Department (CSE-AIML)</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
