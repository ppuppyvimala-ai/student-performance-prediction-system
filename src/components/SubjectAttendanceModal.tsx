import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Calculator, Sparkles, GraduationCap } from 'lucide-react';
import { Student } from '../types';

interface SubjectAttendanceModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (studentId: string, updatedSubjects: { code: string; totalClasses: number; attendedClasses: number }[]) => Promise<void>;
}

interface SubjectDraft {
  code: string;
  name: string;
  credits: number;
  totalClasses: number;
  attendedClasses: number;
}

export const SubjectAttendanceModal: React.FC<SubjectAttendanceModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave,
}) => {
  const [subjectsData, setSubjectsData] = useState<SubjectDraft[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (student && student.academic?.subjects) {
      setSubjectsData(
        student.academic.subjects.map((s) => ({
          code: s.code,
          name: s.name,
          credits: s.credits,
          totalClasses: s.totalClasses || 40,
          attendedClasses: s.attendedClasses ?? Math.round((s.totalClasses || 40) * ((s.attendancePercent || 80) / 100)),
        }))
      );
      setErrorMessage(null);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleClassChange = (code: string, field: 'totalClasses' | 'attendedClasses', value: number) => {
    const safeVal = Math.max(0, Math.floor(value || 0));
    setSubjectsData((prev) =>
      prev.map((sub) => {
        if (sub.code !== code) return sub;

        if (field === 'totalClasses') {
          const newTotal = Math.max(1, safeVal);
          const newAttended = Math.min(newTotal, sub.attendedClasses);
          return { ...sub, totalClasses: newTotal, attendedClasses: newAttended };
        } else {
          const newAttended = Math.min(sub.totalClasses, safeVal);
          return { ...sub, attendedClasses: newAttended };
        }
      })
    );
  };

  const handleQuickAdjust = (code: string, deltaAttended: number, deltaTotal: number = 0) => {
    setSubjectsData((prev) =>
      prev.map((sub) => {
        if (sub.code !== code) return sub;
        const newTotal = Math.max(1, sub.totalClasses + deltaTotal);
        const newAttended = Math.min(newTotal, Math.max(0, sub.attendedClasses + deltaAttended));
        return { ...sub, totalClasses: newTotal, attendedClasses: newAttended };
      })
    );
  };

  // Overall aggregate
  const totalHeldAll = subjectsData.reduce((acc, s) => acc + s.totalClasses, 0);
  const totalAttendedAll = subjectsData.reduce((acc, s) => acc + s.attendedClasses, 0);
  const overallPercent = totalHeldAll > 0 ? Math.round((totalAttendedAll / totalHeldAll) * 1000) / 10 : 0;
  const isOverallEligible = overallPercent >= 75;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = subjectsData.map((s) => ({
        code: s.code,
        totalClasses: s.totalClasses,
        attendedClasses: s.attendedClasses,
      }));
      await onSave(student.id, payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update attendance records');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Manage Subject-wise Attendance</h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                  Sem {student.semester}
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                {student.name} • <span className="font-mono">{student.rollNo}</span> • {student.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-indigo-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Summary Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">
              Total Classes Held: <strong className="text-slate-900 font-mono">{totalHeldAll}</strong>
            </div>
            <span className="text-slate-300">•</span>
            <div className="text-xs text-slate-500">
              Total Attended: <strong className="text-slate-900 font-mono">{totalAttendedAll}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Calculated Aggregate:</span>
              <span className={`font-mono text-sm font-extrabold ${isOverallEligible ? 'text-emerald-700' : 'text-rose-600'}`}>
                {overallPercent}%
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isOverallEligible
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isOverallEligible ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Eligible (≥75%)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Shortage (&lt;75%)
                </>
              )}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <p className="text-xs text-slate-500">
            Track classes held and attended separately across all 6 core B.Tech CSE AIML subjects. Minimum eligibility threshold for university examinations is <strong>75%</strong>.
          </p>

          <div className="space-y-3.5">
            {subjectsData.map((sub) => {
              const pct = sub.totalClasses > 0 ? Math.round((sub.attendedClasses / sub.totalClasses) * 1000) / 10 : 0;
              const isEligible = pct >= 75;
              
              // Classes needed to reach 75%
              // (attended + x) / (total + x) >= 0.75 => x >= 3*total - 4*attended
              const classesNeeded = !isEligible
                ? Math.max(1, Math.ceil(3 * sub.totalClasses - 4 * sub.attendedClasses))
                : 0;

              return (
                <div
                  key={sub.code}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEligible
                      ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                      : 'bg-rose-50/40 border-rose-200 shadow-2xs hover:border-rose-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {sub.code}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{sub.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold hidden md:inline">({sub.credits} Credits)</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-sm font-black text-slate-800">{pct}%</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isEligible
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-700 border border-rose-300'
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
                            Shortage (&lt;75%)
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 85
                          ? 'bg-emerald-500'
                          : pct >= 75
                          ? 'bg-indigo-500'
                          : pct >= 65
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>

                  {/* Editable Counters & Quick Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Total Classes Held
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={sub.totalClasses}
                        onChange={(e) => handleClassChange(sub.code, 'totalClasses', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Classes Attended
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={sub.totalClasses}
                        value={sub.attendedClasses}
                        onChange={(e) => handleClassChange(sub.code, 'attendedClasses', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* Quick increment buttons */}
                    <div className="flex items-center gap-1.5 pt-1 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(sub.code, 1, 1)}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition text-center"
                        title="Add 1 attended class (held +1, attended +1)"
                      >
                        +1 Attended
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(sub.code, 0, 1)}
                        className="flex-1 py-1 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 transition text-center"
                        title="Add 1 missed class (held +1, attended +0)"
                      >
                        +1 Missed
                      </button>
                    </div>
                  </div>

                  {/* Warning advice for shortage */}
                  {!isEligible && (
                    <div className="mt-2.5 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Detention Warning:</strong> Attendance is below mandatory 75% threshold.</span>
                      </span>
                      <span className="font-bold text-rose-800 underline">
                        Must attend next {classesNeeded} class{classesNeeded > 1 ? 'es' : ''}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Saving updates will automatically recalculate the student's overall attendance ratio and re-execute the machine learning prediction model in real time.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Attendance...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Attendance Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
