import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck, Mail, Phone, MapPin, BookOpen, Clock, Award, Building, Briefcase } from 'lucide-react';
import { Teacher } from '../types';

interface TeacherModalProps {
  isOpen: boolean;
  teacher: Teacher | null; // null for add, object for edit
  onClose: () => void;
  onSave: (data: Partial<Teacher>) => Promise<void>;
}

const PRESET_SUBJECTS = [
  { code: 'CS201', name: 'Data Structures & Algorithms' },
  { code: 'AI202', name: 'Foundations of Machine Learning' },
  { code: 'CS203', name: 'Database Management Systems' },
  { code: 'CS204', name: 'Operating Systems & Architecture' },
  { code: 'MA205', name: 'Discrete Mathematics & Probability' },
  { code: 'AI206', name: 'Artificial Intelligence Lab' },
];

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onSave,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [department, setDepartment] = useState('CSE - Artificial Intelligence & Machine Learning');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subjectCode, setSubjectCode] = useState('CS201');
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [cabinNumber, setCabinNumber] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(8);
  const [officeHours, setOfficeHours] = useState('Mon & Wed: 2:00 PM - 4:00 PM');

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
      setEmpId(teacher.empId);
      setDesignation(teacher.designation);
      setDepartment(teacher.department);
      setEmail(teacher.email);
      setPhone(teacher.phone);
      setSubjectCode(teacher.subjectCode);
      setSubjectName(teacher.subjectName);
      setCabinNumber(teacher.cabinNumber);
      setQualification(teacher.qualification || '');
      setExperienceYears(teacher.experienceYears || 5);
      setOfficeHours(teacher.officeHours || 'Mon & Wed: 2:00 PM - 4:00 PM');
    } else {
      setName('');
      setEmpId(`EMP-AIML-${Math.floor(1000 + Math.random() * 9000)}`);
      setDesignation('Assistant Professor');
      setDepartment('CSE - Artificial Intelligence & Machine Learning');
      setEmail('');
      setPhone('+91 98400 12345');
      setSubjectCode('CS201');
      setSubjectName('Data Structures & Algorithms');
      setCabinNumber('Tech Park 4th Floor, Cabin 405');
      setQualification('Ph.D. in Computer Science');
      setExperienceYears(6);
      setOfficeHours('Tue & Thu: 2:00 PM - 4:00 PM');
    }
    setError(null);
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleSubjectSelect = (code: string) => {
    setSubjectCode(code);
    const found = PRESET_SUBJECTS.find((s) => s.code === code);
    if (found) {
      setSubjectName(found.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !empId.trim() || !email.trim() || !subjectCode.trim()) {
      setError('Name, Employee ID, Email, and Assigned Subject are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload: Partial<Teacher> = {
        name: name.trim(),
        empId: empId.trim().toUpperCase(),
        designation: designation.trim(),
        department: department.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subjectCode: subjectCode.trim().toUpperCase(),
        subjectName: subjectName.trim(),
        cabinNumber: cabinNumber.trim() || 'Tech Park Cabin',
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears) || 0,
        officeHours: officeHours.trim(),
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save faculty record');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {teacher ? 'Edit Faculty Member Details' : 'Add New Faculty Member'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Department of CSE (Artificial Intelligence & Machine Learning)
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name and Employee ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Faculty Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. R. Meenakshi"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="EMP-CSE-1021"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono uppercase"
                required
              />
            </div>
          </div>

          {/* Row 2: Designation and Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Designation
              </label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor (Senior Grade)">Assistant Professor (Senior Grade)</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Visiting Professor">Visiting Professor</option>
                <option value="Lab In-Charge / Technical Officer">Lab In-Charge / Technical Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="CSE - Artificial Intelligence & Machine Learning"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Row 3: Assigned Subject */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <label className="block text-xs font-bold text-indigo-950">
              Assigned Course / Subject *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-indigo-700 font-semibold block mb-1">Subject Preset</span>
                <select
                  value={subjectCode}
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {PRESET_SUBJECTS.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code} - {sub.name}
                    </option>
                  ))}
                  <option value="CUSTOM">Custom Course Code</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-indigo-700 font-semibold block mb-1">Course Title</span>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 4: Email, Phone & Cabin Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@srmist.edu.in"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cabin / Room Location *
              </label>
              <input
                type="text"
                value={cabinNumber}
                onChange={(e) => setCabinNumber(e.target.value)}
                placeholder="TP 4th Floor, Cabin 402"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
            </div>
          </div>

          {/* Row 5: Qualification, Experience & Office Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Ph.D. in Computer Science"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teaching Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Office / Consultation Hours
              </label>
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                placeholder="Mon & Wed: 2:00 PM - 4:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

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
              <span>{saving ? 'Saving...' : teacher ? 'Update Faculty Record' : 'Save Faculty Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
