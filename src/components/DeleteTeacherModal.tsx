import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Teacher } from '../types';

interface DeleteTeacherModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteTeacherModal: React.FC<DeleteTeacherModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Faculty Member</h3>
            <p className="text-xs text-slate-500">Remove from departmental directory and subject assignment.</p>
          </div>
        </div>

        <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5 space-y-1">
          <p>Are you sure you want to delete this faculty member?</p>
          <p className="font-bold text-slate-900">{teacher.name}</p>
          <p className="text-xs text-slate-500">
            Employee ID: <span className="font-mono text-indigo-700 font-bold">{teacher.empId}</span> • {teacher.subjectCode} ({teacher.subjectName})
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 active:scale-95 transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? 'Deleting...' : 'Confirm Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
