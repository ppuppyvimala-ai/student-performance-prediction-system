import React, { useState } from 'react';
import { X, Shield, GraduationCap, Lock, Mail, User, Phone, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { UserAccount, Student } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, student?: Student) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [roleMode, setRoleMode] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState('RA2311003010012'); // default Aarav
  const [password, setPassword] = useState('student123');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('student123');
  const [regSemester, setRegSemester] = useState(4);

  if (!isOpen) return null;

  const handleQuickDemoLogin = async (type: 'admin' | 'aarav' | 'priya' | 'rohan') => {
    setLoading(true);
    setErrorMessage(null);
    try {
      let u = '';
      let p = '';
      if (type === 'admin') {
        u = 'admin@edupredict.ac.in';
        p = 'admin123';
      } else if (type === 'aarav') {
        u = 'RA2311003010012';
        p = 'student123';
      } else if (type === 'priya') {
        u = 'RA2311003010103';
        p = 'student123';
      } else if (type === 'rohan') {
        u = 'RA2311003010088';
        p = 'student123';
      }

      const res = await api.login(u, p);
      onAuthSuccess(res.user, res.student);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMessage('Please enter your credentials');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.login(identifier, password);
      onAuthSuccess(res.user, res.student);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regRollNo || !regEmail) {
      setErrorMessage('Name, Roll Number, and Email are mandatory');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.register({
        name: regName,
        rollNo: regRollNo,
        email: regEmail,
        phone: regPhone || '+91 98765 00000',
        password: regPassword || 'student123',
        semester: regSemester,
        department: 'CSE - Artificial Intelligence & Machine Learning'
      });
      onAuthSuccess(res.user, res.student);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 text-white shadow-lg shadow-indigo-500/30 mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {activeTab === 'login' ? 'Welcome to EduPredict' : 'Student Self-Registration'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === 'login'
              ? 'Access academic dashboards, marks analytics, and ML performance projections'
              : 'Enroll your profile for B.Tech CSE AIML machine learning evaluation'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              activeTab === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              activeTab === 'register' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Register Student
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs sm:text-sm rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Mode Content */}
        {activeTab === 'login' && (
          <div>
            {/* Quick Demo Login Preset Pills */}
            <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-blue-50/80 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Instant 1-Click Demo Accounts:
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">B.Tech 2nd Year CSE AIML</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-indigo-200/80 text-xs font-semibold text-slate-800 hover:border-indigo-500 hover:text-indigo-600 shadow-xs transition"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Faculty Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('aarav')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-emerald-200/80 text-xs font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 shadow-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aarav (9.4 CGPA)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('rohan')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-amber-200/80 text-xs font-semibold text-slate-800 hover:border-amber-500 hover:text-amber-700 shadow-xs transition"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rohan (Average)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('priya')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-rose-200/80 text-xs font-semibold text-slate-800 hover:border-rose-500 hover:text-rose-700 shadow-xs transition"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Priya (At-Risk)</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <hr className="w-full border-slate-200" />
              <span className="absolute bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
                or sign in manually
              </span>
            </div>

            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Roll Number or University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. RA2311003010012 or admin@edupredict.ac.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (demo: student123 or admin123)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-98 transition disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Register Mode Content */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Varun Varma"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="RA2311003010999"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                <select
                  value={regSemester}
                  onChange={(e) => setRegSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  <option value={3}>Semester 3 (2nd Year)</option>
                  <option value={4}>Semester 4 (2nd Year)</option>
                  <option value={5}>Semester 5 (3rd Year)</option>
                  <option value={6}>Semester 6 (3rd Year)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SRM / University Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="vv6222@srmist.edu.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="student123"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Department assigned: <strong className="text-slate-700">CSE AIML</strong>. Automatic baseline academic records and initial ML prediction will be initialized.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-98 transition disabled:opacity-60"
            >
              {loading ? 'Creating Record...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
