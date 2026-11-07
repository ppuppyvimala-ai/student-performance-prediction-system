import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  Award,
  Edit,
  Trash2,
  Building,
  GraduationCap,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Teacher } from '../types';

interface TeacherDirectoryViewProps {
  teachers: Teacher[];
  isAdmin: boolean;
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacher: Teacher) => void;
}

export const TeacherDirectoryView: React.FC<TeacherDirectoryViewProps> = ({
  teachers,
  isAdmin,
  onAddTeacher,
  onEditTeacher,
  onDeleteTeacher,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.empId.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subjectName.toLowerCase().includes(q) ||
      t.subjectCode.toLowerCase().includes(q) ||
      t.designation.toLowerCase().includes(q) ||
      t.cabinNumber.toLowerCase().includes(q);

    const matchesSubject =
      selectedSubject === 'ALL' || t.subjectCode === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  // Unique subject codes for filter
  const subjectCodes = Array.from(new Set(teachers.map((t) => t.subjectCode)));

  const professorCount = teachers.filter((t) => t.designation.includes('Professor') && !t.designation.includes('Assistant') && !t.designation.includes('Associate')).length;
  const associateCount = teachers.filter((t) => t.designation.includes('Associate')).length;
  const assistantCount = teachers.filter((t) => t.designation.includes('Assistant')).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Faculty Directory & Course Instructors</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Department of Computer Science & Engineering (AI & ML) • Cabin Locations, Course Mappings & Office Hours
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View toggle (Grid vs Table) */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-indigo-50 text-indigo-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Teacher Button */}
          <button
            onClick={onAddTeacher}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Faculty</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {teachers.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            AIML Department Mentors
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Professors</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-700">
            {professorCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Senior research faculty
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assoc & Asst Profs</span>
            <GraduationCap className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-700">
            {associateCount + assistantCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Course instructors & lab guides
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Courses Assigned</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
            {subjectCodes.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            100% core subject coverage
          </span>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Professor Name, EMP-ID, Subject, Cabin..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Subject Filter:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-auto"
          >
            <option value="ALL">All Subjects ({teachers.length})</option>
            {subjectCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: PROFILE CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              No matching faculty records found. Try adjusting your search query.
            </div>
          ) : (
            filteredTeachers.map((teacher) => {
              // Deterministic avatar gradient
              const initials = teacher.name
                .replace(/^Dr\.\s*|^Prof\.\s*/i, '')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={teacher.id}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Avatar & Actions */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                            {teacher.name}
                          </h3>
                          <span className="text-xs font-semibold text-indigo-700 block">
                            {teacher.designation}
                          </span>
                        </div>
                      </div>

                      {/* Admin action buttons */}
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                        <button
                          onClick={() => onEditTeacher(teacher)}
                          title="Edit Faculty Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTeacher(teacher)}
                          title="Delete Faculty Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Employee ID & Department */}
                    <div className="flex flex-wrap items-center gap-2 mb-3.5 text-[11px]">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {teacher.empId}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 truncate">{teacher.department}</span>
                    </div>

                    {/* Assigned Subject Banner */}
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/90 mb-3.5">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">
                        Assigned Course
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-extrabold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                          {teacher.subjectCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {teacher.subjectName}
                        </span>
                      </div>
                    </div>

                    {/* Details: Cabin, Office Hours, Qualification */}
                    <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="font-medium text-slate-800">{teacher.cabinNumber}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="text-slate-600 text-[11px]">{teacher.officeHours}</span>
                      </div>

                      {teacher.qualification && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="text-slate-600 text-[11px] truncate">{teacher.qualification}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Contact links */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${teacher.email}`}
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold truncate max-w-[180px]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{teacher.email}</span>
                    </a>

                    <a
                      href={`tel:${teacher.phone}`}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-mono text-[11px]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{teacher.phone.replace('+91 ', '')}</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: STRUCTURED TABLE */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-3">Emp ID</th>
                  <th className="py-3.5 px-3">Designation</th>
                  <th className="py-3.5 px-3">Assigned Course</th>
                  <th className="py-3.5 px-3">Cabin / Office</th>
                  <th className="py-3.5 px-3">Office Hours</th>
                  <th className="py-3.5 px-3">Email</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No matching faculty records found.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {t.name}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-indigo-700 font-bold">
                        {t.empId}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">
                        {t.designation}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded mr-1.5">
                          {t.subjectCode}
                        </span>
                        <span className="text-slate-800">{t.subjectName}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">
                        {t.cabinNumber}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                        {t.officeHours}
                      </td>
                      <td className="py-3.5 px-3">
                        <a href={`mailto:${t.email}`} className="text-indigo-600 hover:underline">
                          {t.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditTeacher(t)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTeacher(t)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
