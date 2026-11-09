/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Student, UserAccount, AnalyticsOverview, Teacher } from './types';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AuthModal } from './components/AuthModal';
import { StudentModal } from './components/StudentModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ReportModal } from './components/ReportModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { ModelArchitectureModal } from './components/ModelArchitectureModal';
import { TeacherModal } from './components/TeacherModal';
import { DeleteTeacherModal } from './components/DeleteTeacherModal';
import { SubjectAttendanceModal } from './components/SubjectAttendanceModal';

import { HomeView } from './views/HomeView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminStudentDetailsView } from './views/AdminStudentDetailsView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { AnalyticsView } from './views/AnalyticsView';
import { TeacherDirectoryView } from './views/TeacherDirectoryView';
import { ReportsView } from './views/ReportsView';
import { AppTabType } from './components/Navbar';
import { AdminModuleTab } from './components/NavigationHeader';

const getInitialRoute = (): { tab: AppTabType; subTab?: AdminModuleTab; studentId?: string } => {
  if (typeof window === 'undefined') return { tab: 'home' };
  const rawHash = window.location.hash || '';
  if (!rawHash || rawHash === '#' || rawHash === '#/' || rawHash === '#/home') {
    return { tab: 'home' };
  }
  const clean = rawHash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0 || parts[0] === 'home') return { tab: 'home' };

  if (parts[0] === 'admin') {
    if (parts[1] === 'student' && parts[2]) {
      return { tab: 'admin-student-details', studentId: parts[2] };
    }
    const sub = (parts[1] && ['records', 'attendance', 'marks', 'batch-predict'].includes(parts[1]))
      ? (parts[1] as AdminModuleTab)
      : 'records';
    return { tab: 'admin', subTab: sub };
  }

  if (parts[0] === 'student') {
    return { tab: 'student', studentId: parts[1] };
  }

  if (parts[0] === 'teachers') return { tab: 'teachers' };
  if (parts[0] === 'analytics') return { tab: 'analytics' };
  if (parts[0] === 'reports') return { tab: 'reports', studentId: parts[1] };
  if (parts[0] === 'what-if') return { tab: 'what-if' };
  if (parts[0] === 'model') return { tab: 'model' };

  return { tab: 'home' };
};

export default function App() {
  const initialRoute = getInitialRoute();
  const [activeTab, setActiveTab] = useState<AppTabType>(initialRoute.tab);
  const [adminSubTab, setAdminSubTab] = useState<AdminModuleTab>(initialRoute.subTab || 'records');
  const [navigationHistory, setNavigationHistory] = useState<string[]>([window.location.hash || '#/home']);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('edupredict_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalRole, setAuthModalRole] = useState<'admin' | 'student'>('student');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportStudent, setReportStudent] = useState<Student | null>(null);
  const [whatIfModalOpen, setWhatIfModalOpen] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);

  // Subject Attendance Modal state
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedAttendanceStudent, setSelectedAttendanceStudent] = useState<Student | null>(null);

  // Teacher Modals state
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteTeacherModalOpen, setDeleteTeacherModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [deleteTeacherLoading, setDeleteTeacherLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync currentUser in localStorage for refresh persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edupredict_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edupredict_current_user');
    }
  }, [currentUser]);

  // Set default #/home if root hash is empty
  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      window.history.replaceState({ tab: 'home' }, '', '#/home');
    }
  }, []);

  // Initial Data Load
  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsRes, analyticsRes, teachersRes] = await Promise.all([
        api.getStudents(),
        api.getAnalytics(),
        api.getTeachers(),
      ]);
      setStudents(studentsRes.students);
      setAnalytics(analyticsRes);
      setTeachers(teachersRes.teachers);

      if (initialRoute.studentId) {
        const found = studentsRes.students.find((s) => s.id === initialRoute.studentId);
        if (found) setSelectedStudent(found);
      } else if (!selectedStudent && studentsRes.students.length > 0) {
        setSelectedStudent(studentsRes.students[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Student CRUD
  const handleSaveStudent = async (data: Partial<Student>) => {
    try {
      if (editingStudent) {
        const updated = await api.updateStudent(editingStudent.id, data);
        const fresh = await api.getStudents();
        setStudents(fresh.students);
        const freshStudent = fresh.students.find((s) => s.id === updated.id) || updated;
        if (selectedStudent?.id === updated.id) setSelectedStudent(freshStudent);
        showToast(`Student record for ${updated.name} updated in database with new ML prediction.`);
      } else {
        const created = await api.createStudent(data);
        const fresh = await api.getStudents();
        setStudents(fresh.students);
        setSelectedStudent(created);
        showToast(`Student ${created.name} successfully enrolled and evaluated.`);
      }
      // Refresh analytics
      api.getAnalytics().then(setAnalytics).catch(console.error);
    } catch (err: any) {
      showToast(err.message || 'Failed to save student record');
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleteLoading(true);
    try {
      await api.deleteStudent(studentToDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      if (selectedStudent?.id === studentToDelete.id) {
        const remaining = students.filter((s) => s.id !== studentToDelete.id);
        setSelectedStudent(remaining[0] || null);
      }
      showToast(`Student record removed.`);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      api.getAnalytics().then(setAnalytics).catch(console.error);
    } catch (err: any) {
      alert(err.message || 'Failed to delete student');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handlers for Teacher CRUD
  const handleSaveTeacher = async (data: Partial<Teacher>) => {
    if (editingTeacher) {
      const updated = await api.updateTeacher(editingTeacher.id, data);
      setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showToast(`Faculty record for ${updated.name} updated.`);
    } else {
      const created = await api.createTeacher(data);
      setTeachers((prev) => [...prev, created]);
      showToast(`Faculty member ${created.name} added to directory.`);
    }
  };

  const handleConfirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    setDeleteTeacherLoading(true);
    try {
      await api.deleteTeacher(teacherToDelete.id);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
      showToast(`Faculty record for ${teacherToDelete.name} deleted.`);
      setDeleteTeacherModalOpen(false);
      setTeacherToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete faculty member');
    } finally {
      setDeleteTeacherLoading(false);
    }
  };

  const handleRunSinglePrediction = async (student: Student) => {
    const res = await api.predictStudent(student.id);
    setStudents((prev) => prev.map((s) => (s.id === res.student.id ? res.student : s)));
    if (selectedStudent?.id === res.student.id) setSelectedStudent(res.student);
    showToast(`Inference completed: Predicted SGPA ${res.prediction.predictedSgpa.toFixed(2)} (${res.prediction.category}).`);
    api.getAnalytics().then(setAnalytics).catch(console.error);
  };

  const handleSaveSubjectAttendance = async (
    studentId: string,
    updatedSubjects: { code: string; totalClasses: number; attendedClasses: number }[]
  ) => {
    const updated = await api.updateSubjectAttendance(studentId, updatedSubjects);
    const fresh = await api.getStudents();
    setStudents(fresh.students);
    const freshStudent = fresh.students.find((s) => s.id === updated.id) || updated;
    if (selectedStudent?.id === updated.id) {
      setSelectedStudent(freshStudent);
    }
    showToast(`Subject-wise attendance updated for ${updated.name}!`);
    api.getAnalytics().then(setAnalytics).catch(console.error);
  };

  const handleBatchPredict = async () => {
    showToast('Running ensemble ML inference on all cohort records...');
    for (const s of students) {
      await api.predictStudent(s.id);
    }
    await loadData();
    showToast('Batch ML Prediction completed for all enrolled students!');
  };

  const handleResetData = async () => {
    if (confirm('Reset database to pristine sample B.Tech CSE AIML records?')) {
      await api.resetData();
      await loadData();
      showToast('Database reset to default cohort dataset.');
    }
  };

  // Synchronize URL Hash and Browser History
  useEffect(() => {
    const handlePopState = () => {
      const rawHash = window.location.hash || '#/home';
      const clean = rawHash.replace(/^#\/?/, '');
      const parts = clean.split('/').filter(Boolean);

      if (parts.length === 0 || parts[0] === 'home') {
        setActiveTab('home');
        return;
      }

      if (parts[0] === 'admin') {
        if (currentUser?.role === 'student') {
          setActiveTab('student');
          return;
        }
        if (parts[1] === 'student' && parts[2]) {
          const s = students.find((st) => st.id === parts[2]);
          if (s) setSelectedStudent(s);
          setActiveTab('admin-student-details');
          return;
        }
        if (parts[1] && ['records', 'attendance', 'marks', 'batch-predict'].includes(parts[1])) {
          setAdminSubTab(parts[1] as AdminModuleTab);
        }
        setActiveTab('admin');
        return;
      }

      if (parts[0] === 'student') {
        if (parts[1]) {
          const s = students.find((st) => st.id === parts[1]);
          if (s) setSelectedStudent(s);
        }
        setActiveTab('student');
        return;
      }

      if (parts[0] === 'teachers') {
        setActiveTab('teachers');
        return;
      }

      if (parts[0] === 'analytics') {
        setActiveTab('analytics');
        return;
      }

      if (parts[0] === 'reports') {
        if (parts[1]) {
          const s = students.find((st) => st.id === parts[1]);
          if (s) setSelectedStudent(s);
        }
        setActiveTab('reports');
        return;
      }

      if (parts[0] === 'what-if') {
        setWhatIfModalOpen(true);
        return;
      }

      if (parts[0] === 'model') {
        setModelModalOpen(true);
        return;
      }

      setActiveTab('home');
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [students, currentUser]);

  const navigateTo = (
    tab: AppTabType,
    options?: {
      subTab?: AdminModuleTab;
      student?: Student;
      replace?: boolean;
    }
  ) => {
    if (currentUser?.role === 'student' && (tab === 'admin' || tab === 'admin-student-details')) {
      showToast('Access restricted: Faculty Admin credentials required for Admin Portal.');
      tab = 'student';
    }

    if (tab === 'what-if') {
      setWhatIfModalOpen(true);
      return;
    }

    if (tab === 'model') {
      setModelModalOpen(true);
      return;
    }

    let targetHash = `#/${tab}`;
    if (tab === 'admin' && options?.subTab) {
      targetHash = `#/admin/${options.subTab}`;
      setAdminSubTab(options.subTab);
    } else if (tab === 'admin-student-details' && options?.student) {
      targetHash = `#/admin/student/${options.student.id}`;
      setSelectedStudent(options.student);
    } else if (tab === 'reports' && options?.student) {
      targetHash = `#/reports/${options.student.id}`;
      setSelectedStudent(options.student);
    } else if (tab === 'student' && options?.student) {
      targetHash = `#/student/${options.student.id}`;
      setSelectedStudent(options.student);
    }

    setActiveTab(tab);

    if (options?.replace) {
      window.history.replaceState({ tab, targetHash }, '', targetHash);
    } else {
      window.history.pushState({ tab, targetHash }, '', targetHash);
      setNavigationHistory((prev) => [...prev, targetHash]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    navigateTo('home');
  };

  const handleNavigateBack = () => {
    if (window.history.length > 1 && navigationHistory.length > 1) {
      window.history.back();
    } else {
      if (activeTab === 'admin-student-details') {
        navigateTo('admin', { subTab: 'records' });
      } else if (activeTab === 'admin') {
        if (adminSubTab !== 'records') {
          navigateTo('admin', { subTab: 'records' });
        } else {
          navigateTo('home');
        }
      } else if (activeTab === 'student') {
        navigateTo('home');
      } else if (activeTab === 'teachers' || activeTab === 'analytics' || activeTab === 'reports') {
        if (currentUser?.role === 'admin') {
          navigateTo('admin', { subTab: 'records' });
        } else {
          navigateTo('home');
        }
      } else {
        navigateTo('home');
      }
    }
  };

  const handleAuthSuccess = (user: UserAccount, student?: Student) => {
    setCurrentUser(user);
    if (student) {
      setSelectedStudent(student);
      navigateTo('student', { student });
      showToast(`Welcome back, ${student.name}!`);
    } else {
      navigateTo('admin', { subTab: 'records' });
      showToast(`Logged in as Faculty Admin (${user.name}).`);
    }
  };

  const [studentSection, setStudentSection] = useState<string>('scorecard');

  const handleSelectAdminTab = (subTab: AdminModuleTab) => {
    if (subTab === 'teachers') {
      navigateTo('teachers');
    } else if (subTab === 'analytics') {
      navigateTo('analytics');
    } else if (subTab === 'reports') {
      navigateTo('reports');
    } else {
      navigateTo('admin', { subTab });
    }
  };

  const handleSelectStudentSection = (section: string) => {
    setStudentSection(section);
    if (section === 'what-if') {
      setWhatIfModalOpen(true);
    } else if (section === 'report') {
      if (selectedStudent) {
        navigateTo('reports', { student: selectedStudent });
      } else {
        navigateTo('reports');
      }
    } else if (section === 'teachers') {
      navigateTo('teachers');
    } else {
      if (activeTab !== 'student') {
        navigateTo('student');
      }
      setTimeout(() => {
        let targetId = '';
        if (section === 'scorecard') targetId = 'student-scorecard';
        else if (section === 'attendance') targetId = 'student-attendance';
        else if (section === 'marks') targetId = 'student-marks';
        else if (section === 'recommendations') targetId = 'student-recommendations';
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('home');
    showToast('Signed out of session.');
  };

  const handleViewStudentDetails = (student: Student) => {
    navigateTo('admin-student-details', { student });
  };

  const handleSaveStudentDetailsDirect = async (studentId: string, data: Partial<Student>): Promise<Student> => {
    const updated = await api.updateStudent(studentId, data);
    const fresh = await api.getStudents();
    setStudents(fresh.students);
    const freshStudent = fresh.students.find((s) => s.id === updated.id) || updated;
    setSelectedStudent(freshStudent);
    showToast(`Student record for ${updated.name} updated with latest prediction.`);
    api.getAnalytics().then(setAnalytics).catch(console.error);
    return freshStudent;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Fixed Navbar (Permanently pinned at top with Home, Back, Admin Dashboard Navigation, and Logout) */}
      <Navbar
        currentUser={currentUser}
        activeStudent={selectedStudent}
        activeTab={activeTab}
        adminSubTab={adminSubTab}
        onSelectTab={(tab) => navigateTo(tab)}
        onSelectAdminTab={handleSelectAdminTab}
        activeStudentSection={studentSection}
        onSelectStudentSection={handleSelectStudentSection}
        onNavigateHome={handleNavigateHome}
        onNavigateBack={handleNavigateBack}
        canGoBack={navigationHistory.length > 1 || activeTab !== 'home'}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onResetData={handleResetData}
        onOpenModelModal={() => setModelModalOpen(true)}
      />

      {/* Offline Toast Banner */}
      <OfflineIndicator />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-28 right-4 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 sm:pb-8">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500">Loading Student Performance & Analytics System...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                onNavigate={(tab) => navigateTo(tab)}
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenModelModal={() => setModelModalOpen(true)}
                students={students}
                onSelectStudent={(s) => {
                  setSelectedStudent(s);
                  navigateTo('student', { student: s });
                }}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardView
                students={students}
                analytics={analytics}
                teacherCount={teachers.length}
                initialSubTab={adminSubTab}
                onSubTabChange={(sub) => {
                  setAdminSubTab(sub);
                  window.history.replaceState({}, '', `#/admin/${sub}`);
                }}
                onNavigateHome={handleNavigateHome}
                onNavigateBack={handleNavigateBack}
                onNavigateToTeachers={() => navigateTo('teachers')}
                onNavigateToAnalytics={() => navigateTo('analytics')}
                onNavigateToReports={() => navigateTo('reports')}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenAuth={() => setAuthModalOpen(true)}
                onAddStudent={() => {
                  setEditingStudent(null);
                  setStudentModalOpen(true);
                }}
                onEditStudent={(s) => {
                  setEditingStudent(s);
                  setStudentModalOpen(true);
                }}
                onDeleteStudent={(s) => {
                  setStudentToDelete(s);
                  setDeleteModalOpen(true);
                }}
                onViewReport={(s) => {
                  setSelectedStudent(s);
                  navigateTo('reports', { student: s });
                }}
                onRunPrediction={handleRunSinglePrediction}
                onBatchPredict={handleBatchPredict}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onViewStudentDetails={handleViewStudentDetails}
                onManageAttendance={(s) => {
                  setSelectedAttendanceStudent(s);
                  setAttendanceModalOpen(true);
                }}
              />
            )}

            {activeTab === 'admin-student-details' && selectedStudent && (
              <AdminStudentDetailsView
                student={selectedStudent}
                allStudents={students}
                teachers={teachers}
                onBackToAdmin={() => navigateTo('admin', { subTab: 'records' })}
                onNavigateHome={handleNavigateHome}
                onSelectAdminTab={(tab) => navigateTo('admin', { subTab: tab })}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenAuth={() => setAuthModalOpen(true)}
                onSaveStudent={handleSaveStudentDetailsDirect}
                onRunPrediction={handleRunSinglePrediction}
                onViewReport={(s) => {
                  setSelectedStudent(s);
                  navigateTo('reports', { student: s });
                }}
                onDeleteStudent={(s) => {
                  setStudentToDelete(s);
                  setDeleteModalOpen(true);
                }}
                onSelectOtherStudent={(s) => {
                  setSelectedStudent(s);
                  navigateTo('admin-student-details', { student: s, replace: true });
                }}
              />
            )}

            {activeTab === 'student' && (
              <StudentDashboardView
                students={students}
                currentStudent={selectedStudent}
                currentUser={currentUser}
                teachers={teachers}
                onNavigateHome={handleNavigateHome}
                onNavigateBack={handleNavigateBack}
                onLogout={handleLogout}
                onOpenAuth={() => setAuthModalOpen(true)}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onOpenWhatIf={() => setWhatIfModalOpen(true)}
                onViewReport={(s) => {
                  setSelectedStudent(s);
                  navigateTo('reports', { student: s });
                }}
                onRunPrediction={handleRunSinglePrediction}
                onNavigateToFaculty={() => navigateTo('teachers')}
              />
            )}

            {activeTab === 'teachers' && (
              <TeacherDirectoryView
                teachers={teachers}
                isAdmin={currentUser?.role === 'admin' || true}
                onNavigateHome={handleNavigateHome}
                onNavigateBack={handleNavigateBack}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenAuth={() => setAuthModalOpen(true)}
                onAddTeacher={() => {
                  setEditingTeacher(null);
                  setTeacherModalOpen(true);
                }}
                onEditTeacher={(t) => {
                  setEditingTeacher(t);
                  setTeacherModalOpen(true);
                }}
                onDeleteTeacher={(t) => {
                  setTeacherToDelete(t);
                  setDeleteTeacherModalOpen(true);
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                students={students}
                analytics={analytics}
                onNavigateHome={handleNavigateHome}
                onNavigateBack={handleNavigateBack}
                onSelectAdminTab={(tab) => navigateTo('admin', { subTab: tab })}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                students={students}
                selectedStudent={selectedStudent}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onNavigateHome={handleNavigateHome}
                onNavigateBack={handleNavigateBack}
                onNavigateToAdmin={() => navigateTo('admin', { subTab: 'records' })}
                onSelectAdminTab={(tab) => navigateTo('admin', { subTab: tab })}
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-indigo-700">EduPredict</span>
            <span>•</span>
            <span>Student Performance Prediction and Analysis System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>B.Tech 2nd Year CSE AIML</span>
            <span>•</span>
            <span>PWA & iPad Compatible</span>
            <span>•</span>
            <button onClick={() => setModelModalOpen(true)} className="hover:text-indigo-600 underline">
              ML Documentation
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (for iPad & Mobile PWA) */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={(tab) => navigateTo(tab)} currentUser={currentUser} />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <StudentModal
        isOpen={studentModalOpen}
        student={editingStudent}
        onClose={() => setStudentModalOpen(false)}
        onSave={handleSaveStudent}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        studentName={studentToDelete?.name || ''}
        rollNo={studentToDelete?.rollNo || ''}
        onClose={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      <ReportModal
        isOpen={reportModalOpen}
        student={reportStudent}
        onClose={() => {
          setReportModalOpen(false);
          setReportStudent(null);
        }}
      />

      <WhatIfSimulatorModal
        isOpen={whatIfModalOpen}
        baseAcademic={selectedStudent?.academic}
        onClose={() => setWhatIfModalOpen(false)}
      />

      <ModelArchitectureModal
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
      />

      {/* Teacher / Faculty Modals */}
      <TeacherModal
        isOpen={teacherModalOpen}
        teacher={editingTeacher}
        onClose={() => setTeacherModalOpen(false)}
        onSave={handleSaveTeacher}
      />

      <DeleteTeacherModal
        isOpen={deleteTeacherModalOpen}
        teacher={teacherToDelete}
        onClose={() => {
          setDeleteTeacherModalOpen(false);
          setTeacherToDelete(null);
        }}
        onConfirm={handleConfirmDeleteTeacher}
        loading={deleteTeacherLoading}
      />

      {/* Subject Attendance Modal */}
      <SubjectAttendanceModal
        isOpen={attendanceModalOpen}
        student={selectedAttendanceStudent}
        onClose={() => {
          setAttendanceModalOpen(false);
          setSelectedAttendanceStudent(null);
        }}
        onSave={handleSaveSubjectAttendance}
      />

    </div>
  );
}
