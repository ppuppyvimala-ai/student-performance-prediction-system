import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Cpu,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Users,
  Shield,
  LogIn,
  KeyRound
} from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { Student, UserAccount } from '../types';
import { AppTabType } from '../components/Navbar';

interface HomeViewProps {
  onNavigate: (tab: AppTabType) => void;
  onOpenAdminLogin: () => void;
  onOpenStudentLogin: () => void;
  onOpenModelModal: () => void;
  onQuickDemoLogin?: (type: 'admin' | 'aarav' | 'priya' | 'rohan') => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  currentUser?: UserAccount | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAdminLogin,
  onOpenStudentLogin,
  onOpenModelModal,
  onQuickDemoLogin,
  students,
  onSelectStudent,
  currentUser,
}) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION: WELCOME TO EDUPREDICT */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-indigo-900/50">
        {/* Ambient glow backgrounds */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>B.Tech 2nd Year CSE AIML Capstone Project</span>
            <span className="hidden sm:inline text-indigo-400">•</span>
            <span className="hidden sm:inline text-slate-300">PWA + Full-Stack</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Student Performance <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Prediction & Analysis System
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A real-world machine learning system trained on engineering academic records. Forecasts final examination scores, projects SGPA, detects attendance risks, and generates personalized prescriptive improvement roadmaps.
          </p>

          {/* TWO PRIMARY PORTAL ENTRANCE CARDS / BUTTONS */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              
              {/* ADMIN PORTAL BUTTON */}
              <button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    onNavigate('admin');
                  } else {
                    onOpenAdminLogin();
                  }
                }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-indigo-300/30 hover:border-indigo-400 backdrop-blur-md shadow-xl transition-all duration-200 active:scale-98 text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                      <Shield className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-500/25 border border-indigo-400/40 text-indigo-200">
                      <KeyRound className="w-3 h-3 text-amber-300" />
                      Admin Login
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white group-hover:text-indigo-200 transition">
                    Admin Portal
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Faculty & Administrator access to edit student marks, update subject attendance, run cohort batch ML predictions, and generate academic reports.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-white transition">
                  <span>Sign In as Faculty Admin</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* STUDENT PORTAL BUTTON */}
              <button
                onClick={() => {
                  if (currentUser?.role === 'student') {
                    onNavigate('student');
                  } else {
                    onOpenStudentLogin();
                  }
                }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-purple-300/30 hover:border-purple-400 backdrop-blur-md shadow-xl transition-all duration-200 active:scale-98 text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-sky-500 text-white shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-500/25 border border-purple-400/40 text-purple-200">
                      <LogIn className="w-3 h-3 text-sky-300" />
                      Student Login
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white group-hover:text-purple-200 transition">
                    Student Portal
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Engineering student access to view personal continuous assessment marks, subject-wise attendance percentage, and predicted SGPA forecast.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
                  <span>Sign In as Student</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

            </div>
          </div>

          {/* Quick Shortcuts: What-If Simulator & Model Specs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('what-if')}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/15 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 transition"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Launch What-If Simulator</span>
            </button>

            <button
              onClick={onOpenModelModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-200 border border-white/20 hover:bg-white/20 active:scale-95 transition"
            >
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Model Architecture ($R^2=0.942$)</span>
            </button>
          </div>

          {/* Instant 1-Click Demo Shortcut Pills */}
          {onQuickDemoLogin && (
            <div className="pt-3 max-w-lg mx-auto">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                Instant 1-Click Demo Exploration:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => onQuickDemoLogin('admin')}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold border border-white/15 transition shadow-2xs"
                >
                  Faculty Admin Demo
                </button>
                <button
                  onClick={() => onQuickDemoLogin('aarav')}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold border border-white/15 transition shadow-2xs"
                >
                  Student: Aarav (9.4 CGPA)
                </button>
                <button
                  onClick={() => onQuickDemoLogin('priya')}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold border border-white/15 transition shadow-2xs"
                >
                  Student: Priya (At-Risk)
                </button>
              </div>
            </div>
          )}

          {/* Device & PWA Notice */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              Installable PWA for iPad & Mobile
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" />
              Ridge Regression + Tree Classifier
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Interactive Chart.js Visuals
            </span>
          </div>

        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Modern Engineering Academia
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Combining statistical rigor, continuous assessment monitoring, and modern web application standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Trained ML Prediction Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mathematical multi-variable model trained on 4,250 academic records ($R^2 = 0.942$). Dynamically processes continuous midterms (IAT 1 & 2), study hours, attendance, assignments, and historical CGPA.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <button onClick={onOpenModelModal} className="hover:underline flex items-center gap-1 cursor-pointer">
                View weights & formula &rarr;
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Subject-Wise Analytics (Chart.js)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multidimensional radar and comparative bar charts covering 2nd year B.Tech subjects: Data Structures, Machine Learning, Operating Systems, DBMS, and Discrete Probability.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
              <button onClick={() => onNavigate('analytics')} className="hover:underline flex items-center gap-1 cursor-pointer">
                Explore charts & trends &rarr;
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">iPad & Mobile Progressive Web App</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% installable with service worker offline cache and iPad split-view optimization. Lets students check prediction history and teachers review attendance right in the lab or lecture hall.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE STUDENT HIGHLIGHT CARDS (QUICK DEMO ACCESS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Featured Students in Current Cohort
            </h2>
            <p className="text-xs text-slate-500">
              Click any student to inspect their scorecard, radar profile, and ML prediction
            </p>
          </div>
          <button
            onClick={() => {
              if (currentUser?.role === 'admin') onNavigate('admin');
              else onOpenAdminLogin();
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records in Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {students.slice(0, 4).map((student) => {
            const p = student.latestPrediction;
            return (
              <div
                key={student.id}
                onClick={() => {
                  onSelectStudent(student);
                  onNavigate('student');
                }}
                className="group cursor-pointer rounded-2xl bg-white p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {student.rollNo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p?.category === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p?.category === 'Good'
                        ? 'bg-indigo-100 text-indigo-800'
                        : p?.category === 'Average'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p?.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {student.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{student.department}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Attendance</span>
                    <span
                      className={`font-mono font-bold ${
                        student.academic.attendancePercent < 75 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {student.academic.attendancePercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Predicted SGPA</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {p?.predictedSgpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                  <span>Open Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QUICK WHAT-IF PROMO BANNER */}
      <section className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-sky-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200">
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Simulator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            "What if I increase study hours from 10 to 18 hrs/week?"
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Test the live ML inference model in real-time. Move sliders for attendance, internal test marks, and homework completion to see immediate score projections.
          </p>
        </div>

        <button
          onClick={() => onNavigate('what-if')}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 active:scale-95 shadow-md transition cursor-pointer"
        >
          <span>Launch Simulator Lab</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </section>

    </div>
  );
};
