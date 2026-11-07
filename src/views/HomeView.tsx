import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Cpu,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Download,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Users
} from 'lucide-react';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { Student } from '../types';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model') => void;
  onOpenAuth: () => void;
  onOpenModelModal: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenModelModal,
  students,
  onSelectStudent,
}) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-indigo-900/50">
        {/* Ambient glow backgrounds */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>B.Tech 2nd Year CSE AIML Capstone Project</span>
            <span className="hidden sm:inline text-indigo-400">•</span>
            <span className="hidden sm:inline text-slate-300">PWA + Full-Stack</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Student Performance <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Prediction & Analysis System
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A real-world machine learning system trained on engineering academic records. Forecasts final examination scores, projects SGPA, detects attendance risks, and generates personalized prescriptive improvement roadmaps.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition"
            >
              <Users className="w-5 h-5" />
              <span>Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('student')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm sm:text-base font-bold text-white border border-white/20 hover:bg-white/20 active:scale-95 transition"
            >
              <GraduationCap className="w-5 h-5 text-purple-300" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => onNavigate('what-if')}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/15 backdrop-blur-md px-5 py-3.5 text-sm sm:text-base font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 transition"
            >
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>What-If Lab</span>
            </button>
          </div>

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
              <button onClick={onOpenModelModal} className="hover:underline flex items-center gap-1">
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
              <button onClick={() => onNavigate('analytics')} className="hover:underline flex items-center gap-1">
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
              Click any student to instantly inspect their scorecard, radar profile, and ML prediction
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Records</span>
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p?.category === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                    p?.category === 'Good' ? 'bg-indigo-100 text-indigo-800' :
                    p?.category === 'Average' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
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
                    <span className={`font-mono font-bold ${student.academic.attendancePercent < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
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
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 active:scale-95 shadow-md transition"
        >
          <span>Launch Simulator Lab</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </section>

    </div>
  );
};
