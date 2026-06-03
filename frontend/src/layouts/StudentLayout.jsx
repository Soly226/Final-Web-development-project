import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const StudentLayout = ({ children, title }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/student', active: location.pathname === '/student' },
    { icon: 'calendar_month', label: 'Calendar', path: '/student/calendar', active: location.pathname === '/student/calendar' },
    { icon: 'person', label: 'Profile', path: '/student/profile', active: location.pathname === '/student/profile' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24 font-display transition-colors duration-500">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full"></div>
      </div>

      <header className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
        <div>
          <h1 className="text-md font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-widest text-xs opacity-80">{title || 'Student Portal'}</h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Welcome back. Keep learning.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10 pt-5 pb-24">
        {children}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
          <div className="flex items-center justify-between">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={twMerge(
                  'flex flex-col items-center gap-1.5 transition-all duration-300 relative group',
                  item.active ? 'text-primary scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-primary'
                )}
              >
                <span className={twMerge('material-symbols-outlined text-2xl transition-all', item.active ? 'font-variation-fill' : '')}>{item.icon}</span>
                <span className="text-[9px] tracking-wider uppercase font-bold">{item.label}</span>
                {item.active && <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default StudentLayout;
