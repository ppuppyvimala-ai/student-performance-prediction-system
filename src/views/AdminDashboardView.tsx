import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Sparkles,
  Download,
  Trash2,
  Edit,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  UserCheck,
  CalendarCheck,
  Calendar,
  Percent,
  Edit3,
  Sliders
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import '../utils/chartSetup';
import { Student, AnalyticsOverview, UserAccount } from '../types';
import { getCategoryBadge, getRiskBadge, exportStudentsToCsv } from '../utils/formatters';
import { NavigationHeader, AdminModuleTab } from '../components/NavigationHeader';

interface AdminDashboardViewProps {
  students: Student[];
  analytics: AnalyticsOverview | null;
  teacherCount?: number;
  initialSubTab?: AdminModuleTab;
  onSubTabChange?: (tab: AdminModuleTab) => void;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateToTeachers: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToReports?: () => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onViewReport: (student: Student) => void;
  onRunPrediction: (student: Student) => Promise<void>;
  onBatchPredict: () => Promise<void>;
  onSelectStudent: (student: Student) => void;
  onViewStudentDetails: (student: Student) => void;
  onManageAttendance: (student: Student) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  students,
  analytics,
  teacherCount = 6,
  initialSubTab = 'records',
  onSubTabChange,
  onNavigateHome,
  onNavigateBack,
  onNavigateToTeachers,
  onNavigateToAnalytics,
  onNavigateToReports,
  currentUser,
  onLogout,
  onOpenAuth,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewReport,
  onRunPrediction,
  onBatchPredict,
  onSelectStudent,
  onViewStudentDetails,
  onManageAttendance,
}) => {
  const [adminSubTab, setAdminSubTab] = useState<AdminModuleTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setAdminSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleTabSwitch = (tab: AdminModuleTab) => {
    if (tab === 'teachers') {
      onNavigateToTeachers();
      return;
    }
    if (tab === 'analytics' && onNavigateToAnalytics) {
      onNavigateToAnalytics();
      return;
    }
    if (tab === 'reports' && onNavigateToReports) {
      onNavigateToReports();
      return;
    }
    setAdminSubTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'sgpa_desc' | 'sgpa_asc' | 'attendance_desc' | 'name'>('sgpa_desc');
  const [predictingId, setPredictingId] = useState<string | null>(null);
  const [batching, setBatching] = useState(false);

  // Subject-wise attendance filters
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<'ALL' | 'ELIGIBLE' | 'SHORTAGE'>('ALL');

  // Filter students locally
  const filteredStudents = students
    .filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'ALL' || s.latestPrediction?.category === selectedCategory;

      const matchesRisk =
        selectedRisk === 'ALL' || s.latestPrediction?.riskLevel === selectedRisk;

      return matchesSearch && matchesCat && matchesRisk;
    })
    .sort((a, b) => {
      if (sortField === 'sgpa_desc') {
        return (b.latestPrediction?.predictedSgpa || 0) - (a.latestPrediction?.predictedSgpa || 0);
      }
      if (sortField === 'sgpa_asc') {
        return (a.latestPrediction?.predictedSgpa || 0) - (b.latestPrediction?.predictedSgpa || 0);
      }
      if (sortField === 'attendance_desc') {
        return b.academic.attendancePercent - a.academic.attendancePercent;
      }
      return a.name.localeCompare(b.name);
    });

  // Attendance Sub-tab Filtered Data & Statistics
  const attendanceFilteredStudents = students.filter((s) => {
    const q = attendanceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);

    const isEligible = s.academic.attendancePercent >= 75;
    const matchesStatus =
      attendanceStatusFilter === 'ALL' ||
      (attendanceStatusFilter === 'ELIGIBLE' && isEligible) ||
      (attendanceStatusFilter === 'SHORTAGE' && !isEligible);

    return matchesSearch && matchesStatus;
  });

  const totalEligibleCount = students.filter((s) => s.academic.attendancePercent >= 75).length;
  const totalShortageCount = students.length - totalEligibleCount;
  const overallMeanAttendance = students.length > 0
    ? Math.round((students.reduce((acc, s) => acc + s.academic.attendancePercent, 0) / students.length) * 10) / 10
    : 0;

  const handleSinglePredict = async (student: Student) => {
    setPredictingId(student.id);
    try {
      await onRunPrediction(student);
    } finally {
      setPredictingId(null);
    }
  };

  const handleRunBatch = async () => {
    setBatching(true);
    try {
      await onBatchPredict();
    } finally {
      setBatching(false);
    }
  };

  // Chart.js: Performance Categories Doughnut
  const categoryCounts = analytics?.categoryCounts || {
    Excellent: 0,
    Good: 0,
    Average: 0,
    'Needs Improvement': 0,
  };

  const doughnutData = {
    labels: ['Excellent (≥85%)', 'Good (70-84%)', 'Average (50-69%)', 'Needs Improvement (<50%)'],
    datasets: [
      {
        data: [
          categoryCounts.Excellent || 0,
          categoryCounts.Good || 0,
          categoryCounts.Average || 0,
          categoryCounts['Needs Improvement'] || 0,
        ],
        backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#f43f5e'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Chart.js: Subject-wise Averages Bar Chart
  const subjectAverages = analytics?.subjectAverages || [];
  const barData = {
    labels: subjectAverages.map((s) => s.code),
    datasets: [
      {
        label: 'Average Score / 100',
        data: subjectAverages.map((s) => s.average),
        backgroundColor: '#6366f1',
        borderRadius: 8,
        hoverBackgroundColor: '#4f46e5',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any) => {
            const idx = items[0]?.dataIndex;
            return subjectAverages[idx]?.name || '';
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: 'bold' as const } },
      },
    },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Consistent Navigation Header with Home, Back, Breadcrumbs, Admin Menu, and Logout */}
      <NavigationHeader
        title="Faculty & Academic Administration Portal"
        subtitle="Manage student records, edit marks, track attendance, run batch predictions, and generate reports"
        breadcrumbs={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Admin Portal', onClick: () => handleTabSwitch('records') },
          {
            label:
              adminSubTab === 'records'
                ? 'Student Records'
                : adminSubTab === 'marks'
                ? 'Marks Management'
                : adminSubTab === 'attendance'
                ? 'Subject Attendance'
                : 'Batch ML Prediction',
            active: true,
          },
        ]}
        portalType="admin"
        activeAdminTab={adminSubTab}
        onSelectAdminTab={handleTabSwitch}
        currentUser={currentUser}
        onNavigateHome={onNavigateHome}
        onNavigateBack={onNavigateBack}
        onLogout={onLogout}
        onOpenAuth={onOpenAuth}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportStudentsToCsv(filteredStudents)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 shadow-2xs transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={onAddStudent}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          </div>
        }
      />

      {adminSubTab === 'records' && (
        <>
          {/* KPI METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {analytics?.totalStudents ?? students.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            100% active academic records
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cohort Mean SGPA</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-700">
            {analytics?.averageSgpa ? analytics.averageSgpa.toFixed(2) : '7.85'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Target benchmark: 8.00
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Attendance</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {analytics?.averageAttendance ? `${analytics.averageAttendance}%` : '82.5%'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Above 75% eligibility line
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">At-Risk Students</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600">
            {analytics?.riskCounts ? analytics.riskCounts.High + analytics.riskCounts.Critical : 1}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            Requires academic intervention
          </span>
        </div>
      </div>

      {/* ANALYTICS VISUALIZATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Doughnut: Category Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Performance Categories</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Cohort Bins
              </span>
            </div>
            <div className="h-48 flex items-center justify-center relative">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Bar: Subject Averages */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subject-Wise Performance Index</h3>
              <p className="text-xs text-slate-400">Continuous Assessment + Assignment Mean out of 100</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              6 Core AIML Subjects
            </span>
          </div>
          <div className="h-52">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* SEARCH, FILTER & CONTROLS BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Roll No (RA23...), Email..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Categories</option>
              <option value="Excellent">Excellent (≥85%)</option>
              <option value="Good">Good (70-84%)</option>
              <option value="Average">Average (50-69%)</option>
              <option value="Needs Improvement">Needs Improvement (&lt;50%)</option>
            </select>

            {/* Risk Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="sgpa_desc">Sort: SGPA (Highest First)</option>
              <option value="sgpa_asc">Sort: SGPA (Lowest First)</option>
              <option value="attendance_desc">Sort: Attendance %</option>
              <option value="name">Sort: Student Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT RECORDS TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Student & Roll No</th>
                <th className="py-3.5 px-3">Attendance</th>
                <th className="py-3.5 px-3">Study Hrs</th>
                <th className="py-3.5 px-3">IAT 1 & 2</th>
                <th className="py-3.5 px-3">Prior CGPA</th>
                <th className="py-3.5 px-3">Predicted SGPA</th>
                <th className="py-3.5 px-3">ML Performance Category</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching student records found. Try adjusting search filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const p = s.latestPrediction;
                  const catBadge = getCategoryBadge(p?.category);
                  const isShortage = s.academic.attendancePercent < 75;

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* Name & Roll No */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => {
                            onSelectStudent(s);
                            onViewStudentDetails(s);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                            <span>{s.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              {s.rollNo}
                            </span>
                            <span className="text-[10px] text-slate-400">Sem {s.semester}</span>
                          </div>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${isShortage ? 'text-rose-600' : 'text-slate-800'}`}>
                            {s.academic.attendancePercent}%
                          </span>
                          {isShortage && (
                            <span className="text-[9px] font-extrabold px-1 rounded bg-rose-100 text-rose-700">
                              Shortage
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Study Hours */}
                      <td className="py-3.5 px-3 font-mono text-slate-700">
                        {s.academic.studyHoursPerWeek} hrs/wk
                      </td>

                      {/* Internals */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-indigo-700">
                          {s.academic.internalTest1 + s.academic.internalTest2} <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {s.academic.internalTest1} + {s.academic.internalTest2}
                        </div>
                      </td>

                      {/* CGPA */}
                      <td className="py-3.5 px-3 font-mono text-slate-800 font-bold">
                        {s.academic.previousCgpa.toFixed(2)}
                      </td>

                      {/* Predicted SGPA */}
                      <td className="py-3.5 px-3">
                        {p ? (
                          <div className="flex items-baseline gap-1">
                            <span className="font-mono text-sm font-black text-slate-900">
                              {p.predictedSgpa.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400">({p.predictedScore}%)</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-3">
                        {p ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${catBadge.bg}`}>
                            <span className={`w-2 h-2 rounded-full ${catBadge.dot}`} />
                            <span>{p.category}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Student Details */}
                          <button
                            onClick={() => {
                              onSelectStudent(s);
                              onViewStudentDetails(s);
                            }}
                            title="View Student Details & Marks"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Re-run ML Prediction */}
                          <button
                            onClick={() => handleSinglePredict(s)}
                            disabled={predictingId === s.id}
                            title="Re-run ML Prediction"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                          >
                            <Sparkles className={`w-4 h-4 ${predictingId === s.id ? 'animate-spin text-purple-600' : ''}`} />
                          </button>

                          {/* Manage Attendance */}
                          <button
                            onClick={() => onManageAttendance(s)}
                            title="Manage Subject-wise Attendance"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          >
                            <CalendarCheck className="w-4 h-4" />
                          </button>

                          {/* View Report Card */}
                          <button
                            onClick={() => onViewReport(s)}
                            title="Generate Official Report Card"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Edit Marks & Attendance Button */}
                          <button
                            onClick={() => onEditStudent(s)}
                            title="Edit Student Marks & Attendance"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition active:scale-95 shadow-2xs"
                          >
                            <Edit className="w-3.5 h-3.5 text-sky-600" />
                            <span>Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteStudent(s)}
                            title="Delete Student"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

  {adminSubTab === 'attendance' && (
    <div className="space-y-6">
      {/* Attendance KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cohort Attendance Mean</span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {overallMeanAttendance}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            University cut-off: 75.0%
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Eligible for Exams</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
            {totalEligibleCount} <span className="text-xs text-slate-400 font-normal">/ {students.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {students.length > 0 ? Math.round((totalEligibleCount / students.length) * 100) : 0}% clearance rate
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Shortage</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600">
            {totalShortageCount}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            {totalShortageCount > 0 ? 'Detention alerts active' : 'Zero detention alerts'}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Courses Tracked</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-700">
            6 Courses
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            DSA, ML, DBMS, OS, Math, Lab
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number (e.g. RA2311003010012) or department..."
            value={attendanceSearch}
            onChange={(e) => setAttendanceSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Status Filter:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAttendanceStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                attendanceStatusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setAttendanceStatusFilter('ELIGIBLE')}
              className={`px-3 py-1.5 rounded-lg transition ${
                attendanceStatusFilter === 'ELIGIBLE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Eligible ({totalEligibleCount})
            </button>
            <button
              onClick={() => setAttendanceStatusFilter('SHORTAGE')}
              className={`px-3 py-1.5 rounded-lg transition ${
                attendanceStatusFilter === 'SHORTAGE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Shortage ({totalShortageCount})
            </button>
          </div>
        </div>
      </div>

      {/* Desktop & iPad Landscape Matrix Table */}
      <div className="hidden xl:block rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-52">Student & Roll No</th>
                <th className="py-3.5 px-3 w-36">Overall Ratio</th>
                <th className="py-3.5 px-3">CS201 (DSA)</th>
                <th className="py-3.5 px-3">AI202 (ML)</th>
                <th className="py-3.5 px-3">CS203 (DBMS)</th>
                <th className="py-3.5 px-3">CS204 (OS)</th>
                <th className="py-3.5 px-3">MA205 (Math)</th>
                <th className="py-3.5 px-3">AI206 (AI Lab)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {attendanceFilteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No students match the selected attendance criteria.
                  </td>
                </tr>
              ) : (
                attendanceFilteredStudents.map((s) => {
                  const isOverallEligible = s.academic.attendancePercent >= 75;
                  const subjectsMap = new Map(s.academic.subjects?.map((sub) => [sub.code, sub]) || []);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => {
                            onSelectStudent(s);
                            onViewStudentDetails(s);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                            {s.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded">
                              {s.rollNo}
                            </span>
                            <span className="text-[10px] text-slate-400">Sem {s.semester}</span>
                          </div>
                        </div>
                      </td>

                      {/* Overall Percentage */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-black ${isOverallEligible ? 'text-slate-900' : 'text-rose-600'}`}>
                            {s.academic.attendancePercent}%
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                            isOverallEligible
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {isOverallEligible ? 'Eligible' : 'Shortage'}
                          </span>
                        </div>
                        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full ${isOverallEligible ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(100, s.academic.attendancePercent)}%` }}
                          />
                        </div>
                      </td>

                      {/* 6 Subject Columns */}
                      {['CS201', 'AI202', 'CS203', 'CS204', 'MA205', 'AI206'].map((code) => {
                        const sub = subjectsMap.get(code);
                        const total = sub?.totalClasses || 40;
                        const attended = sub?.attendedClasses ?? Math.round(total * ((sub?.attendancePercent || 80) / 100));
                        const pct = sub?.attendancePercent ?? (total > 0 ? Math.round((attended / total) * 1000) / 10 : 0);
                        const isEligible = pct >= 75;

                        return (
                          <td key={code} className="py-3.5 px-3">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono text-slate-600">{attended}/{total}</span>
                                <span className={`font-mono font-bold ${isEligible ? 'text-slate-800' : 'text-rose-600'}`}>
                                  {pct}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                  style={{ width: `${Math.min(100, pct)}%` }}
                                />
                              </div>
                              <div className="text-[9px] font-medium text-slate-400">
                                {isEligible ? (
                                  <span className="text-emerald-700 font-semibold">Eligible</span>
                                ) : (
                                  <span className="text-rose-600 font-bold">&lt;75% Shortage</span>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}

                      {/* Edit buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditStudent(s)}
                            title="Edit Student Marks & Details"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition active:scale-95 shadow-2xs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Marks</span>
                          </button>
                          <button
                            onClick={() => onManageAttendance(s)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition active:scale-95 shadow-2xs"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            <span>Attendance</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* iPad Portrait & Mobile Responsive Student Cards Grid */}
      <div className="block xl:hidden space-y-4">
        {attendanceFilteredStudents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-sm">
            No students match the selected attendance criteria.
          </div>
        ) : (
          attendanceFilteredStudents.map((s) => {
            const isOverallEligible = s.academic.attendancePercent >= 75;
            const subjects = s.academic.subjects || [];

            return (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => {
                      onSelectStudent(s);
                      onViewStudentDetails(s);
                    }}
                    className="cursor-pointer"
                  >
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition">{s.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {s.rollNo}
                      </span>
                      <span className="text-xs text-slate-400">Sem {s.semester} • {s.department.split('-')[0]}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`font-mono text-base font-black ${isOverallEligible ? 'text-slate-900' : 'text-rose-600'}`}>
                        {s.academic.attendancePercent}%
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isOverallEligible
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {isOverallEligible ? 'Eligible' : 'Shortage'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Overall Ratio</span>
                  </div>
                </div>

                {/* 6 Subject Sub-cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
                  {subjects.map((sub) => {
                    const total = sub.totalClasses || 40;
                    const attended = sub.attendedClasses ?? Math.round(total * ((sub.attendancePercent || 80) / 100));
                    const pct = sub.attendancePercent ?? (total > 0 ? Math.round((attended / total) * 1000) / 10 : 0);
                    const isEligible = pct >= 75;

                    return (
                      <div
                        key={sub.code}
                        className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                          isEligible
                            ? 'bg-slate-50/70 border-slate-200/80'
                            : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-indigo-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {sub.code}
                          </span>
                          <span className={`font-mono font-bold text-[11px] ${isEligible ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {pct}%
                          </span>
                        </div>

                        <p className="font-medium text-slate-800 text-[11px] truncate" title={sub.name}>
                          {sub.name}
                        </p>

                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>Classes: <strong className="text-slate-800 font-mono">{attended}/{total}</strong></span>
                          <span className={isEligible ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-bold'}>
                            {isEligible ? 'Eligible' : 'Shortage (<75%)'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Footer Action */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEditStudent(s)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 font-bold text-xs hover:bg-sky-100 transition active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Marks</span>
                  </button>
                  <button
                    onClick={() => onManageAttendance(s)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 transition active:scale-95"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Update Attendance</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  )}

  {/* MARKS MANAGEMENT SUB-TAB */}
  {adminSubTab === 'marks' && (
    <div className="space-y-6">
      {/* Marks Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {students.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active Academic Profiles</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cohort Mean IAT 1</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-700">
            {students.length > 0
              ? (students.reduce((acc, s) => acc + s.academic.internalTest1, 0) / students.length).toFixed(1)
              : '0.0'} <span className="text-xs font-normal text-slate-400">/ 50</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Midterm Assessment 1</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cohort Mean IAT 2</span>
            <Award className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-sky-700">
            {students.length > 0
              ? (students.reduce((acc, s) => acc + s.academic.internalTest2, 0) / students.length).toFixed(1)
              : '0.0'} <span className="text-xs font-normal text-slate-400">/ 50</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Midterm Assessment 2</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Continuous Assessment Mean</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
            {students.length > 0
              ? (students.reduce((acc, s) => acc + s.academic.internalTest1 + s.academic.internalTest2, 0) / students.length).toFixed(1)
              : '0.0'} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">IAT 1 + IAT 2 combined</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search students by name, roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of {students.length} students
        </div>
      </div>

      {/* Marks Management Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-48">Student & Roll No</th>
                <th className="py-3.5 px-3">IAT 1 (50)</th>
                <th className="py-3.5 px-3">IAT 2 (50)</th>
                <th className="py-3.5 px-3">Midterm Total (100)</th>
                <th className="py-3.5 px-3">Assignment (100)</th>
                <th className="py-3.5 px-3">Lab Score (100)</th>
                <th className="py-3.5 px-3">Predicted SGPA</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No student records match search filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const p = s.latestPrediction;
                  const catBadge = getCategoryBadge(p?.category);
                  const midTotal = s.academic.internalTest1 + s.academic.internalTest2;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => {
                            onSelectStudent(s);
                            onViewStudentDetails(s);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                            {s.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1 rounded">
                              {s.rollNo}
                            </span>
                            <span className="text-[10px] text-slate-400">Sem {s.semester}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                        {s.academic.internalTest1} <span className="text-[10px] text-slate-400 font-normal">/ 50</span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                        {s.academic.internalTest2} <span className="text-[10px] text-slate-400 font-normal">/ 50</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-indigo-700 text-sm">{midTotal}</span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${Math.min(100, midTotal)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                        {s.academic.assignmentScore}%
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                        {s.academic.labScore}%
                      </td>

                      <td className="py-3.5 px-3">
                        {p ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {p.predictedSgpa.toFixed(2)}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${catBadge.bg}`}>
                              {p.category}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditStudent(s)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition active:scale-95 shadow-2xs"
                            title="Edit Internal Marks & Subject Scores"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Marks</span>
                          </button>
                          <button
                            onClick={() => {
                              onSelectStudent(s);
                              onViewStudentDetails(s);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Open Student Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

  {/* BATCH ML PREDICTION SUB-TAB */}
  {adminSubTab === 'batch-predict' && (
    <div className="space-y-6">
      {/* Hero Banner for Batch Inference */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ensemble ML Inference Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Cohort Batch ML Prediction
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
              Execute multivariate Ridge Regression and Decision Tree classification simultaneously on all {students.length} enrolled B.Tech CSE AIML student records. Updates predicted SGPA, risk stratifications, and SHAP feature attributions with persistence to database.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleRunBatch}
              disabled={batching}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-600 to-sky-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition disabled:opacity-60"
            >
              <Sparkles className={`w-5 h-5 text-amber-300 ${batching ? 'animate-spin' : ''}`} />
              <span>{batching ? 'Running Cohort Inference...' : `Run Batch Predict (${students.length} Students)`}</span>
            </button>
          </div>
        </div>

        {batching && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span>Evaluating academic records and continuous assessments...</span>
              <span className="font-mono font-bold text-white">In Progress</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 via-purple-400 to-sky-400 rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Predictions Summary Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Latest Cohort Inference Matrix</h3>
            <p className="text-xs text-slate-500">Live predictions evaluated against current midterms and attendance</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
            {students.length} Inferences Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Prior CGPA</th>
                <th className="py-3 px-3">Predicted SGPA</th>
                <th className="py-3 px-3">Projected Score</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Risk Tier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((s) => {
                const p = s.latestPrediction;
                const catBadge = getCategoryBadge(p?.category);
                const riskBadge = getRiskBadge(p?.riskLevel);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => {
                          onSelectStudent(s);
                          onViewStudentDetails(s);
                        }}
                        className="cursor-pointer"
                      >
                        <span className="font-bold text-slate-900 hover:text-indigo-600 transition block">
                          {s.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded">
                          {s.rollNo}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                      {s.academic.attendancePercent}%
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                      {s.academic.previousCgpa.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-3">
                      {p ? (
                        <span className="font-mono text-base font-black text-indigo-700">
                          {p.predictedSgpa.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-800 font-bold">
                      {p ? `${p.predictedScore}%` : '-'}
                    </td>

                    <td className="py-3.5 px-3">
                      {p ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${catBadge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${catBadge.dot}`} />
                          <span>{p.category}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {p ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskBadge.bg}`}>
                          <span>{p.riskLevel}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSinglePredict(s)}
                          disabled={predictingId === s.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                          title="Re-run Individual Prediction"
                        >
                          <Sparkles className={`w-4 h-4 ${predictingId === s.id ? 'animate-spin text-purple-600' : ''}`} />
                        </button>
                        <button
                          onClick={() => onViewReport(s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="View Official Report Card"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onSelectStudent(s);
                            onViewStudentDetails(s);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Open Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
</div>
);
};
