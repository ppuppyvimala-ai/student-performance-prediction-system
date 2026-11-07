import { PredictionResult, Student } from '../types';

export function getCategoryBadge(category?: PredictionResult['category']) {
  switch (category) {
    case 'Excellent':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        badge: 'Excellent (>=85%)',
        textColor: 'text-emerald-600',
        accentColor: '#10b981'
      };
    case 'Good':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        badge: 'Good (70-84%)',
        textColor: 'text-indigo-600',
        accentColor: '#6366f1'
      };
    case 'Average':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        badge: 'Average (50-69%)',
        textColor: 'text-amber-600',
        accentColor: '#f59e0b'
      };
    case 'Needs Improvement':
    default:
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        badge: 'Needs Improvement (<50%)',
        textColor: 'text-rose-600',
        accentColor: '#f43f5e'
      };
  }
}

export function getRiskBadge(risk?: PredictionResult['riskLevel']) {
  switch (risk) {
    case 'Low':
      return { bg: 'bg-emerald-100/80 text-emerald-800', label: 'Low Risk' };
    case 'Moderate':
      return { bg: 'bg-amber-100/80 text-amber-800', label: 'Moderate Risk' };
    case 'High':
      return { bg: 'bg-orange-100/80 text-orange-800', label: 'High Risk' };
    case 'Critical':
      return { bg: 'bg-rose-100/90 text-rose-900 font-bold animate-pulse', label: 'Critical Risk' };
    default:
      return { bg: 'bg-slate-100 text-slate-700', label: 'Undetermined' };
  }
}

export function getGradeLetter(sgpa: number): { grade: string; description: string } {
  if (sgpa >= 9.0) return { grade: 'O', description: 'Outstanding' };
  if (sgpa >= 8.0) return { grade: 'A+', description: 'Excellent' };
  if (sgpa >= 7.0) return { grade: 'A', description: 'Very Good' };
  if (sgpa >= 6.0) return { grade: 'B+', description: 'Good' };
  if (sgpa >= 5.0) return { grade: 'B', description: 'Above Average' };
  return { grade: 'RA', description: 'Re-Appear Required' };
}

export function exportStudentsToCsv(students: Student[]) {
  const headers = [
    'Roll Number',
    'Full Name',
    'Email',
    'Phone',
    'Semester',
    'Attendance %',
    'Study Hours/Wk',
    'Internal Test 1 (50)',
    'Internal Test 2 (50)',
    'Assignment Score (100)',
    'Lab Score (100)',
    'Prior CGPA',
    'Predicted Score %',
    'Predicted SGPA',
    'Category',
    'Risk Level'
  ];

  const rows = students.map(s => {
    const p = s.latestPrediction;
    return [
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      s.semester,
      s.academic.attendancePercent,
      s.academic.studyHoursPerWeek,
      s.academic.internalTest1,
      s.academic.internalTest2,
      s.academic.assignmentScore,
      s.academic.labScore,
      s.academic.previousCgpa,
      p?.predictedScore ?? 'N/A',
      p?.predictedSgpa ?? 'N/A',
      `"${p?.category ?? 'Pending'}"`,
      `"${p?.riskLevel ?? 'N/A'}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Student_Performance_Records_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
