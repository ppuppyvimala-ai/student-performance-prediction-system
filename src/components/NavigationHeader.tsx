import React from 'react';
import {
  Home,
  ArrowLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Users,
  GraduationCap,
  CalendarCheck,
  Edit3,
  Sparkles,
  UserCheck,
  BarChart3,
  FileText,
  Sliders,
  Shield,
  Layers,
  Cpu
} from 'lucide-react';
import { UserAccount } from '../types';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export type AdminModuleTab = 'records' | 'attendance' | 'marks' | 'batch-predict' | 'teachers' | 'analytics' | 'reports';

interface NavigationHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  portalType?: 'admin' | 'student' | 'general';
  activeAdminTab?: AdminModuleTab;
  onSelectAdminTab?: (tab: AdminModuleTab) => void;
  activeStudentSection?: string;
  onSelectStudentSection?: (section: string) => void;
  currentUser?: UserAccount | null;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  actions?: React.ReactNode;
  canGoBack?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  portalType = 'general',
  activeAdminTab = 'records',
  onSelectAdminTab,
  activeStudentSection,
  onSelectStudentSection,
  currentUser,
  onNavigateHome,
  onNavigateBack,
  onLogout,
  onOpenAuth,
  actions,
  canGoBack = true,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-6 overflow-hidden">
      {/* Primary Bar: Home, Back, Breadcrumbs, User Status, and Actions */}
      <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100">
        
        {/* Left: Home & Back navigation buttons + Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visible Home Button */}
          <button
            onClick={onNavigateHome}
            title="Return to Welcome Homepage"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 text-slate-700 text-xs sm:text-sm font-bold transition active:scale-95 shadow-2xs"
          >
            <Home className="w-4 h-4 text-indigo-600" />
            <span>Home</span>
          </button>

          {/* Visible Back Button */}
          {canGoBack && (
            <button
              onClick={onNavigateBack}
              title="Return to Previous Page"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-700 text-xs sm:text-sm font-bold transition active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Back</span>
            </button>
          )}

          <div className="hidden sm:block h-4 w-px bg-slate-200 mx-1" />

          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto py-0.5">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                  {crumb.onClick && !isLast ? (
                    <button
                      onClick={crumb.onClick}
                      className="hover:text-indigo-600 hover:underline transition truncate max-w-[140px] sm:max-w-none text-left"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={isLast ? 'text-slate-900 font-bold truncate max-w-[160px] sm:max-w-none' : 'truncate'}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: Portal Context Badge, User Profile & Logout */}
        <div className="flex items-center justify-between md:justify-end gap-2.5">
          {/* Portal badge */}
          {portalType === 'admin' ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Portal</span>
            </div>
          ) : portalType === 'student' ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>Student Portal</span>
            </div>
          ) : null}

          {/* User Sign In / Sign Out */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-bold text-slate-700 max-w-[140px] truncate">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                title="Log out of session"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition active:scale-95 shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          ) : onOpenAuth ? (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition active:scale-95 shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          ) : null}

          {/* Optional custom actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Admin Module Navigation Tabs (Visible when on Admin pages) */}
      {portalType === 'admin' && onSelectAdminTab && (
        <div className="bg-slate-50/70 px-3.5 sm:px-4 py-2 border-b border-slate-100 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-bold text-slate-600 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mr-1 shrink-0 hidden md:inline">
            Admin Menu:
          </span>

          <button
            onClick={() => onSelectAdminTab('records')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'records'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Student Records</span>
          </button>

          <button
            onClick={() => onSelectAdminTab('marks')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'marks'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-sky-600" />
            <span>Marks Management</span>
          </button>

          <button
            onClick={() => onSelectAdminTab('attendance')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'attendance'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Attendance Matrix</span>
          </button>

          <button
            onClick={() => onSelectAdminTab('batch-predict')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'batch-predict'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Batch ML Prediction</span>
          </button>

          <button
            onClick={() => onSelectAdminTab('teachers')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'teachers'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Faculty Management</span>
          </button>

          <button
            onClick={() => onSelectAdminTab('analytics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'analytics'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => onSelectAdminTab('reports')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeAdminTab === 'reports'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Reports Dossier</span>
          </button>
        </div>
      )}

      {/* Student Module Navigation Tabs (Visible when on Student Portal) */}
      {portalType === 'student' && onSelectStudentSection && (
        <div className="bg-slate-50/70 px-3.5 sm:px-4 py-2 border-b border-slate-100 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-bold text-slate-600 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mr-1 shrink-0 hidden md:inline">
            Student Menu:
          </span>

          <button
            onClick={() => onSelectStudentSection('scorecard')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'scorecard'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span>My Scorecard</span>
          </button>

          <button
            onClick={() => onSelectStudentSection('attendance')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'attendance'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Subject Attendance</span>
          </button>

          <button
            onClick={() => onSelectStudentSection('marks')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'marks'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Subject Marks Breakdown</span>
          </button>

          <button
            onClick={() => onSelectStudentSection('recommendations')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'recommendations'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Action Plan</span>
          </button>

          <button
            onClick={() => onSelectStudentSection('what-if')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'what-if'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>What-If Lab</span>
          </button>

          <button
            onClick={() => onSelectStudentSection('teachers')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'teachers'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Course Faculty</span>
          </button>

          <button
            onClick={() => onSelectStudentSection('report')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeStudentSection === 'report'
                ? 'bg-white text-purple-700 shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Official Report</span>
          </button>
        </div>
      )}

      {/* Optional Page Title Header (if provided) */}
      {title && (
        <div className="px-4 py-3 sm:px-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
