import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, BookOpen, Clock, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Student, SubjectRecord } from '../types';
import { getCategoryBadge } from '../utils/formatters';

interface StudentModalProps {
  isOpen: boolean;
  student: Student | null; // null for add, object for edit
  onClose: () => void;
  onSave: (data: Partial<Student>) => Promise<void>;
}

const DEFAULT_SUBJECTS: SubjectRecord[] = [
  { code: 'CS201', name: 'Data Structures & Algorithms', internal: 38, assignment: 40, credits: 4, totalClasses: 45, attendedClasses: 38, attendancePercent: 84.4 },
  { code: 'AI202', name: 'Foundations of Machine Learning', internal: 40, assignment: 42, credits: 4, totalClasses: 45, attendedClasses: 40, attendancePercent: 88.9 },
  { code: 'CS203', name: 'Database Management Systems', internal: 36, assignment: 39, credits: 3, totalClasses: 36, attendedClasses: 30, attendancePercent: 83.3 },
  { code: 'CS204', name: 'Operating Systems & Architecture', internal: 35, assignment: 38, credits: 3, totalClasses: 36, attendedClasses: 29, attendancePercent: 80.6 },
  { code: 'MA205', name: 'Discrete Mathematics & Probability', internal: 37, assignment: 39, credits: 4, totalClasses: 45, attendedClasses: 38, attendancePercent: 84.4 },
  { code: 'AI206', name: 'Artificial Intelligence Lab', internal: 44, assignment: 45, credits: 2, totalClasses: 28, attendedClasses: 25, attendancePercent: 89.3 },
];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'subjects'>('academic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [semester, setSemester] = useState(4);
  const [department, setDepartment] = useState('CSE - Artificial Intelligence & Machine Learning');

  // Academic Metrics
  const [attendance, setAttendance] = useState(82);
  const [studyHours, setStudyHours] = useState(15);
  const [internal1, setInternal1] = useState(40);
  const [internal2, setInternal2] = useState(42);
  const [assignment, setAssignment] = useState(85);
  const [lab, setLab] = useState(88);
  const [cgpa, setCgpa] = useState(8.2);
  const [sleep, setSleep] = useState(7);
  const [notes, setNotes] = useState('');

  // Subjects
  const [subjects, setSubjects] = useState<SubjectRecord[]>(DEFAULT_SUBJECTS);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setRollNo(student.rollNo);
      setEmail(student.email);
      setPhone(student.phone);
      setGender(student.gender);
      setSemester(student.semester);
      setDepartment(student.department);

      setAttendance(student.academic.attendancePercent);
      setStudyHours(student.academic.studyHoursPerWeek);
      setInternal1(student.academic.internalTest1);
      setInternal2(student.academic.internalTest2);
      setAssignment(student.academic.assignmentScore);
      setLab(student.academic.labScore);
      setCgpa(student.academic.previousCgpa);
      setSleep(student.academic.sleepHours || 7);
      setNotes(student.academic.notes || '');

      setSubjects(student.academic.subjects?.length ? student.academic.subjects : DEFAULT_SUBJECTS);
    } else {
      // Defaults for new student
      setName('');
      setRollNo(`RA2311003010${Math.floor(100 + Math.random() * 899)}`);
      setEmail('');
      setPhone('+91 98765 43210');
      setGender('Male');
      setSemester(4);
      setDepartment('CSE - Artificial Intelligence & Machine Learning');

      setAttendance(80);
      setStudyHours(14);
      setInternal1(38);
      setInternal2(40);
      setAssignment(80);
      setLab(85);
      setCgpa(7.8);
      setSleep(7);
      setNotes('Newly registered candidate.');
      setSubjects(DEFAULT_SUBJECTS);
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  // Approximate quick client-side predicted score for live feedback
  const quickScore = Math.min(
    99,
    Math.max(
      20,
      Math.round(
        ((internal1 + internal2) / 100) * 100 * 0.3 +
          cgpa * 10 * 0.22 +
          attendance * 0.18 +
          Math.min(100, studyHours * 4.8) * 0.15 +
          assignment * 0.1 +
          lab * 0.05 -
          (attendance < 75 ? 5 : 0)
      )
    )
  );

  const quickCategory =
    quickScore >= 85 ? 'Excellent' : quickScore >= 70 ? 'Good' : quickScore >= 50 ? 'Average' : 'Needs Improvement';
  const badgeInfo = getCategoryBadge(quickCategory);

  const handleSubjectChange = (index: number, field: 'internal' | 'assignment', val: number) => {
    const updated = [...subjects];
    updated[index] = {
      ...updated[index],
      [field]: Math.max(0, Math.min(50, val))
    };
    setSubjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim() || !email.trim()) {
      setError('Student Name, Roll Number, and Email are mandatory.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: Partial<Student> = {
        name: name.trim(),
        rollNo: rollNo.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        gender,
        semester,
        department,
        academic: {
          id: student?.academic?.id || `acad_${Date.now()}`,
          studentId: student?.id || '',
          semester,
          attendancePercent: Number(attendance),
          studyHoursPerWeek: Number(studyHours),
          internalTest1: Number(internal1),
          internalTest2: Number(internal2),
          assignmentScore: Number(assignment),
          labScore: Number(lab),
          previousCgpa: Number(cgpa),
          sleepHours: Number(sleep),
          subjects,
          notes,
          updatedAt: new Date().toISOString()
        }
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save student details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title with Live ML Predictor Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>{student ? 'Edit Student & Academic Record' : 'Enroll New Student Record'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              B.Tech CSE Artificial Intelligence & Machine Learning System
            </p>
          </div>

          {/* Real-time estimated score chip */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Live ML Projection</span>
              <span className={`text-xs font-bold ${badgeInfo.textColor}`}>
                {quickScore}% • {quickCategory}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-5 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'academic'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Academic & Performance Factors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subjects')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'subjects'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Subject Marks (6 Courses)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Profile Details
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TAB 1: ACADEMIC METRICS */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Attendance % */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Attendance Record</span>
                      {attendance < 75 ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                          &lt;75% Shortage
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Eligible
                        </span>
                      )}
                    </label>
                    <span className="text-sm font-bold text-indigo-600 font-mono">{attendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={attendance}
                    onChange={(e) => setAttendance(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>30% Minimum</span>
                    <span className="text-amber-600 font-semibold">75% Threshold</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Study Hours/Week */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Self-Study Hours / Week</span>
                    </label>
                    <span className="text-sm font-bold text-indigo-600 font-mono">{studyHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={studyHours}
                    onChange={(e) => setStudyHours(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>2 hrs</span>
                    <span>18-22 hrs (Optimal)</span>
                    <span>40 hrs</span>
                  </div>
                </div>
              </div>

              {/* Assessment Marks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal Test 1 (50)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={internal1}
                    onChange={(e) => setInternal1(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Internal Test 2 (50)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={internal2}
                    onChange={(e) => setInternal2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assignments (100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignment}
                    onChange={(e) => setAssignment(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lab Score (100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={lab}
                    onChange={(e) => setLab(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    required
                  />
                </div>
              </div>

              {/* CGPA & Sleep */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous Semester CGPA (0.00 - 10.00)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Sleep Hours (Cognitive Factor)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="3"
                    max="12"
                    value={sleep}
                    onChange={(e) => setSleep(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty / Academic Counselor Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Needs extra lab practice in recursion; consistent in tutorials."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECT BREAKDOWN */}
          {activeTab === 'subjects' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Configure continuous internal assessment (out of 50) and assignment scores (out of 50) for core B.Tech AIML subjects:
              </p>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {subjects.map((sub, idx) => (
                  <div
                    key={sub.code}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 gap-2"
                  >
                    <div className="sm:w-1/2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {sub.code}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{sub.credits} Credits</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{sub.name}</div>
                    </div>

                    <div className="flex items-center gap-3 sm:w-1/2">
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                          Internal (50)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={sub.internal}
                          onChange={(e) => handleSubjectChange(idx, 'internal', Number(e.target.value))}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 font-mono"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                          Assignment (50)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={sub.assignment}
                          onChange={(e) => handleSubjectChange(idx, 'assignment', Number(e.target.value))}
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 font-mono"
                        />
                      </div>
                      <div className="text-right w-12 shrink-0">
                        <span className="text-[10px] text-slate-400 block">Total</span>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {sub.internal + sub.assignment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GENERAL STUDENT DETAILS */}
          {activeTab === 'general' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="RA2311003010..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@srmist.edu.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5</option>
                    <option value={6}>Semester 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    disabled
                    value="2023-2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-98 transition disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : student ? 'Update & Re-Predict' : 'Enroll & Run ML'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
