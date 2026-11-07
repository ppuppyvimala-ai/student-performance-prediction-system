import React from 'react';
import { Home, Users, GraduationCap, Sliders, BarChart3, UserCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model';
  onSelectTab: (tab: 'home' | 'admin' | 'student' | 'teachers' | 'analytics' | 'what-if' | 'model') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'admin' as const, label: 'Admin', icon: Users },
    { id: 'teachers' as const, label: 'Faculty', icon: UserCheck },
    { id: 'student' as const, label: 'Student', icon: GraduationCap },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around sm:hidden shadow-lg safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
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
