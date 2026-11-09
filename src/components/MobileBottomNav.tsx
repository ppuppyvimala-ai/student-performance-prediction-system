import React from 'react';
import { Home, Users, GraduationCap, BarChart3, UserCheck, FileText } from 'lucide-react';
import { UserAccount } from '../types';
import { AppTabType } from './Navbar';

interface MobileBottomNavProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  currentUser?: UserAccount | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab, currentUser }) => {
  const allNavItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'admin' as const, label: 'Admin', icon: Users, hideForStudent: true },
    { id: 'student' as const, label: 'Student', icon: GraduationCap },
    { id: 'teachers' as const, label: 'Faculty', icon: UserCheck },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
  ];

  const navItems = allNavItems.filter((item) => {
    if (item.hideForStudent && currentUser?.role === 'student') return false;
    return true;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around sm:hidden shadow-lg safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activeTab === item.id ||
          (item.id === 'admin' && activeTab === 'admin-student-details');
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-600' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
