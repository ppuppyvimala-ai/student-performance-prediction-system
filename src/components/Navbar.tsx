import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BarChart3,
  Users,
  Cpu,
  Sliders,
  LogOut,
  LogIn,
  RotateCcw,
  Menu,
  X,
  UserCheck,
  Shield,
  Layers,
  Home,
  ArrowLeft,
  FileText,
  CalendarCheck,
  Edit3,
  BookOpen
} from 'lucide-react';
import { UserAccount, Student } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

export type AppTabType =
  | 'home'
  | 'admin'
  | 'admin-student-details'
  | 'student'
  | 'teachers'
  | 'analytics'
  | 'reports'
  | 'what-if'
  | 'model';

export type AdminModuleTab =
  | 'records'
  | 'attendance'
  | 'marks'
  | 'batch-predict'
  | 'teachers'
  | 'analytics'
  | 'reports';

export type StudentSectionType =
  | 'scorecard'
  | 'attendance'
  | 'marks'
  | 'recommendations'
  | 'what-if'
  | 'teachers'
  | 'report';

interface NavbarProps {
  currentUser: UserAccount | null;
  activeStudent: Student | null;
  activeTab: AppTabType;
  adminSubTab?: AdminModuleTab;
  onSelectTab: (tab: AppTabType) => void;
  onSelectAdminTab?: (tab: AdminModuleTab) => void;
  activeStudentSection?: string;
  onSelectStudentSection?: (section: string) => void;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  canGoBack?: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onResetData: () => void;
  onOpenModelModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeStudent,
  activeTab,
  adminSubTab = 'records',
  onSelectTab,
  onSelectAdminTab,
  activeStudentSection = 'scorecard',
  onSelectStudentSection,
  onNavigateHome,
  onNavigateBack,
  canGoBack = true,
  onOpenAuth,
  onLogout,
  onResetData,
  onOpenModelModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine if current context is Admin or Student
  const isAdminPage =
    activeTab === 'admin' ||
    activeTab === 'admin-student-details' ||
    (currentUser?.role !== 'student' &&
      (activeTab === 'teachers' || activeTab === 'analytics' || activeTab === 'reports'));

  const isStudentPage =
    activeTab === 'student' ||
    (currentUser?.role === 'student' &&
      (activeTab === 'teachers' || activeTab === 'reports'));

  // Active admin module calculation
  const currentAdminTab: AdminModuleTab =
    activeTab === 'teachers'
      ? 'teachers'
      : activeTab === 'analytics'
      ? 'analytics'
      : activeTab === 'reports'
      ? 'reports'
      : adminSubTab;

  const handleAdminNav = (tab: AdminModuleTab) => {
    if (onSelectAdminTab) {
      onSelectAdminTab(tab);
    } else {
      if (tab === 'teachers') onSelectTab('teachers');
      else if (tab === 'analytics') onSelectTab('analytics');
      else if (tab === 'reports') onSelectTab('reports');
      else onSelectTab('admin');
    }
    setMobileMenuOpen(false);
  };

  const handleStudentNav = (sec: string) => {
    if (onSelectStudentSection) {
      onSelectStudentSection(sec);
    }
    setMobileMenuOpen(false);
  };

  const isSubnavActive = isAdminPage || isStudentPage;

  return (
    <>
      {/* 1. Fixed Top Navigation Bar (Permanently pinned at top of all pages) */}
      <header className="fixed top-0 inset-x-0 z-50 w-full bg-white/98 backdrop-blur-md border-b border-indigo-100 shadow-xs transition-all duration-200">
        
        {/* Tier 1: Primary Controls Bar (Back, Home, Brand, Status, Logout) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Visible Back & Home buttons + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Always-Visible Back Button */}
            <button
              onClick={onNavigateBack}
              title="Return to previous page"
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition active:scale-95 shadow-2xs font-bold text-xs shrink-0 ${
                activeTab === 'home' && !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={activeTab === 'home' && !canGoBack}
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span className="hidden xs:inline">Back</span>
            </button>

            {/* Always-Visible Home Button */}
            <button
              onClick={onNavigateHome}
              title="Return to Welcome Homepage"
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition active:scale-95 shadow-2xs font-bold text-xs shrink-0 ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-700'
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-white' : 'text-indigo-600'}`} />
              <span className="hidden xs:inline">Home</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-0.5 hidden sm:block" />

            {/* Brand Logo & Name */}
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
              title="EduPredict Homepage"
            >
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                <Sparkles className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-amber-300 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
                    EduPredict
                  </span>
                  <span className="hidden lg:inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    B.Tech AIML
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Portal Context Indicator Badge */}
          <div className="hidden md:flex items-center gap-2">
            {isAdminPage ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Dashboard</span>
              </div>
            ) : isStudentPage ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span>Student Portal</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                <span>Welcome Homepage</span>
              </div>
            )}
          </div>

          {/* Right: Logout Button, User Info, Auth, PWA Install */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Direct Logout Button (Always available on both portals) */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden xl:flex flex-col text-right mr-1">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-indigo-600">
                    {currentUser.role === 'admin' ? 'Faculty Admin' : currentUser.rollNo || 'Student'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition active:scale-95 shadow-2xs"
                  title="Sign out of current account"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 transition shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* PWA Install */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            {/* Mobile menu toggle for secondary settings */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition lg:hidden"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tier 2: Dedicated Dashboard Navigation Bar (Admin or Student Pages) */}
        {isAdminPage && (
          <div className="border-t border-slate-100 bg-slate-50/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              
              {/* Admin Dashboard Navigation Tabs */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold text-slate-600 shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mr-1 hidden lg:inline">
                  Admin Modules:
                </span>

                {/* 1. Records & Individual ML Prediction */}
                <button
                  onClick={() => handleAdminNav('records')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'records' && activeTab !== 'admin-student-details'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : activeTab === 'admin-student-details'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Student Records</span>
                </button>

                {/* 2. Marks Management */}
                <button
                  onClick={() => handleAdminNav('marks')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'marks'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Marks</span>
                </button>

                {/* 3. Subject Attendance */}
                <button
                  onClick={() => handleAdminNav('attendance')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'attendance'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Attendance</span>
                </button>

                {/* 4. Batch ML Prediction */}
                <button
                  onClick={() => handleAdminNav('batch-predict')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'batch-predict'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Batch ML Prediction</span>
                </button>

                {/* 5. Faculty Management */}
                <button
                  onClick={() => handleAdminNav('teachers')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'teachers'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Faculty</span>
                </button>

                {/* 6. Analytics */}
                <button
                  onClick={() => handleAdminNav('analytics')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'analytics'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>

                {/* 7. Academic Reports */}
                <button
                  onClick={() => handleAdminNav('reports')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    currentAdminTab === 'reports'
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/60 border border-slate-200/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </button>
              </div>

              {/* Student Portal Switcher (For non-student accounts to preview Student Portal) */}
              {currentUser?.role !== 'student' && (
                <button
                  onClick={() => onSelectTab('student')}
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition shrink-0"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  <span>View Student Portal</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tier 2: Dedicated Student Dashboard Navigation Bar (When on Student Portal) */}
        {isStudentPage && (
          <div className="border-t border-slate-100 bg-purple-50/70 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              
              {/* Student Dashboard Navigation Tabs */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold text-slate-600 shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-purple-400 font-extrabold mr-1 hidden lg:inline">
                  Student Menu:
                </span>

                {/* Scorecard */}
                <button
                  onClick={() => handleStudentNav('scorecard')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    activeStudentSection === 'scorecard'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>My Scorecard</span>
                </button>

                {/* Attendance */}
                <button
                  onClick={() => handleStudentNav('attendance')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    activeStudentSection === 'attendance'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Attendance</span>
                </button>

                {/* Marks */}
                <button
                  onClick={() => handleStudentNav('marks')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    activeStudentSection === 'marks'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Marks Breakdown</span>
                </button>

                {/* AI Action Plan */}
                <button
                  onClick={() => handleStudentNav('recommendations')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    activeStudentSection === 'recommendations'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Action Plan</span>
                </button>

                {/* What-If Lab */}
                <button
                  onClick={() => handleStudentNav('what-if')}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100 transition shrink-0"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What-If Lab</span>
                </button>

                {/* Faculty */}
                <button
                  onClick={() => handleStudentNav('teachers')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    activeTab === 'teachers'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>My Faculty</span>
                </button>

                {/* Official Report Card */}
                <button
                  onClick={() => handleStudentNav('report')}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition shrink-0 ${
                    activeTab === 'reports'
                      ? 'bg-purple-700 text-white shadow-xs font-bold'
                      : 'hover:text-slate-900 hover:bg-white bg-white/70 border border-purple-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Official Report</span>
                </button>
              </div>

              {/* Admin Portal Switcher (For faculty/staff) */}
              {currentUser?.role !== 'student' && (
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition shrink-0"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Switch to Admin Portal</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Drawer for Secondary Utility Links */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 py-3 space-y-2 lg:hidden animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
              >
                <Home className="w-4 h-4 text-indigo-600" />
                <span>Return to Home</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Logout</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  onSelectTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left hover:bg-slate-50 text-slate-700"
              >
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('student');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left hover:bg-slate-50 text-slate-700"
              >
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>Student Portal</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('teachers');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left hover:bg-slate-50 text-slate-700"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Faculty Directory</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('analytics');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left hover:bg-slate-50 text-slate-700"
              >
                <BarChart3 className="w-4 h-4 text-sky-600" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('reports');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left hover:bg-slate-50 text-slate-700"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Academic Reports</span>
              </button>

              <button
                onClick={() => {
                  onOpenModelModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-left hover:bg-slate-50 text-slate-700"
              >
                <Cpu className="w-4 h-4 text-violet-600" />
                <span>ML Model Specs</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => {
                  onResetData();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition p-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Cohort</span>
              </button>
              <span className="font-semibold text-indigo-600">SRMIST B.Tech CSE AIML</span>
            </div>
          </div>
        )}
      </header>

      {/* 2. Guaranteed Spacer: Pre-occupies the fixed header's exact height so navigation NEVER covers page content */}
      <div
        className={isSubnavActive ? 'h-[96px] sm:h-[108px]' : 'h-14 sm:h-16'}
        aria-hidden="true"
      />
    </>
  );
};
