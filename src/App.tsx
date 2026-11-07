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
import { StudentDashboardView } from './views/StudentDashboardView';
import { AnalyticsView } from './views/AnalyticsView';
import { TeacherDirectoryView } from './views/TeacherDirectoryView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model'>('home');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
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

      if (!selectedStudent && studentsRes.students.length > 0) {
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
    if (editingStudent) {
      const updated = await api.updateStudent(editingStudent.id, data);
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      if (selectedStudent?.id === updated.id) setSelectedStudent(updated);
      showToast(`Student record for ${updated.name} updated with new ML prediction.`);
    } else {
      const created = await api.createStudent(data);
      setStudents((prev) => [created, ...prev]);
      setSelectedStudent(created);
      showToast(`Student ${created.name} successfully enrolled and evaluated.`);
    }
    // Refresh analytics
    api.getAnalytics().then(setAnalytics).catch(console.error);
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
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedStudent?.id === updated.id) {
      setSelectedStudent(updated);
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

  const handleAuthSuccess = (user: UserAccount, student?: Student) => {
    setCurrentUser(user);
    if (student) {
      setSelectedStudent(student);
      setActiveTab('student');
      showToast(`Welcome back, ${student.name}!`);
    } else {
      setActiveTab('admin');
      showToast(`Logged in as Faculty Admin (${user.name}).`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of session.');
  };

  const handleSelectTab = (tab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model') => {
    if (tab === 'what-if') {
      setWhatIfModalOpen(true);
      return;
    }
    if (tab === 'model') {
      setModelModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeStudent={selectedStudent}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onResetData={handleResetData}
        onOpenModelModal={() => setModelModalOpen(true)}
      />

      {/* Offline Toast Banner */}
      <OfflineIndicator />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-8">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500">Loading Student Performance & Analytics System...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                onNavigate={handleSelectTab}
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenModelModal={() => setModelModalOpen(true)}
                students={students}
                onSelectStudent={(s) => setSelectedStudent(s)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardView
                students={students}
                analytics={analytics}
                teacherCount={teachers.length}
                onNavigateToTeachers={() => setActiveTab('teachers')}
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
                  setReportStudent(s);
                  setReportModalOpen(true);
                }}
                onRunPrediction={handleRunSinglePrediction}
                onBatchPredict={handleBatchPredict}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onNavigateToStudentView={() => setActiveTab('student')}
                onManageAttendance={(s) => {
                  setSelectedAttendanceStudent(s);
                  setAttendanceModalOpen(true);
                }}
              />
            )}

            {activeTab === 'student' && (
              <StudentDashboardView
                students={students}
                currentStudent={selectedStudent}
                teachers={teachers}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onOpenWhatIf={() => setWhatIfModalOpen(true)}
                onViewReport={(s) => {
                  setReportStudent(s);
                  setReportModalOpen(true);
                }}
                onRunPrediction={handleRunSinglePrediction}
                onNavigateToFaculty={() => setActiveTab('teachers')}
              />
            )}

            {activeTab === 'teachers' && (
              <TeacherDirectoryView
                teachers={teachers}
                isAdmin={currentUser?.role === 'admin' || true}
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
              <AnalyticsView students={students} analytics={analytics} />
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
      <MobileBottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

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
