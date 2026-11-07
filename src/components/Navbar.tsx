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
  Layers
} from 'lucide-react';
import { UserAccount, Student } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentUser: UserAccount | null;
  activeStudent: Student | null;
  activeTab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model';
  onSelectTab: (tab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onResetData: () => void;
  onOpenModelModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeStudent,
  activeTab,
  onSelectTab,
  onOpenAuth,
  onLogout,
  onResetData,
  onOpenModelModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-100 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
                EduPredict
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                CSE AIML
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-600 font-medium -mt-0.5">
              Performance Prediction & Analysis
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'home'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          {/* Admin Dashboard */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'admin'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Admin Portal</span>
          </button>

          {/* Student Dashboard */}
          <button
            onClick={() => handleNavClick('student')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'student'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>Student Portal</span>
          </button>

          {/* Faculty / Teacher Directory */}
          <button
            onClick={() => handleNavClick('teachers')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'teachers'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Faculty Directory</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => handleNavClick('analytics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'analytics'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-sky-500" />
            <span>Analytics</span>
          </button>

          {/* What-If ML Simulator */}
          <button
            onClick={() => handleNavClick('what-if')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'what-if'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span>What-If Lab</span>
          </button>

          {/* Model Architecture */}
          <button
            onClick={onOpenModelModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            <Cpu className="w-4 h-4 text-violet-500" />
            <span>ML Architecture</span>
          </button>
        </nav>

        {/* Action Controls & User Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* User profile / Auth button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600">
                  {currentUser.role === 'admin' ? 'Faculty Admin' : currentUser.rollNo || 'Student'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drop-down drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-indigo-100 bg-white/98 backdrop-blur-xl px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left ${
                activeTab === 'home' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left ${
                activeTab === 'admin' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Admin Portal</span>
            </button>
            <button
              onClick={() => handleNavClick('student')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left ${
                activeTab === 'student' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => handleNavClick('teachers')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left ${
                activeTab === 'teachers' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Faculty Directory</span>
            </button>
            <button
              onClick={() => handleNavClick('analytics')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left ${
                activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => handleNavClick('what-if')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-left ${
                activeTab === 'what-if' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>What-If Lab</span>
            </button>
            <button
              onClick={() => {
                onOpenModelModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-left text-slate-700 hover:bg-slate-50"
            >
              <Cpu className="w-4 h-4 text-violet-600" />
              <span>ML Specs</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition p-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
            <span className="font-semibold text-indigo-600">SRMIST B.Tech AIML</span>
          </div>
        </div>
      )}
    </header>
  );
};
