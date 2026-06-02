import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

const InstructorLayout = ({ children, title }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: 'dashboard', label: 'Home', path: '/instructor', active: location.pathname === '/instructor' },
    { icon: 'assignment', label: 'Assignments', path: '/instructor/assignments', active: location.pathname === '/instructor/assignments' },
    { icon: 'add_circle', label: 'Create', path: '/instructor/create', active: location.pathname.startsWith('/instructor/create') },
    { icon: 'forum', label: 'Stream', path: '/instructor/global-stream', active: location.pathname === '/instructor/global-stream' },
    { icon: 'person', label: 'Profile', path: '/instructor/profile', active: location.pathname === '/instructor/profile' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24 font-display transition-colors duration-500">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full"></div>
      </div>

      <header className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button className="p-2.5 hover:bg-primary/10 text-slate-600 dark:text-slate-400 hover:text-primary rounded-xl transition-all">
            <span className="material-symbols-outlined font-variation-bold">menu</span>
          </button>
          <h1 className="text-md font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-widest text-xs opacity-80">{title || 'Instructor Portal'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          <button onClick={logout} className="group relative w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all p-0.5">
            <img className="w-full h-full object-cover rounded-[10px]" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKwegGGT1HdkJEDMLLVJ-in96iY8m4OCFTMpwOF9oRBiwUKBFjz1lrtPsifXvjG5UgenxKZvasMKHgTRKMGureWkS80cUd5jNr2vrTIE7gK8Nb5Bsc6IrwjATOar2adeoOmR8XxW4GbpjS4_Hs4M8LiPBVpybpd_M8OvZtHmJ-e7m3VGZBFRXpJ1Nb-DQfabrUrM0us4a7RS9WZ06pYU8yHw4fpDg9VBbP_kRzX8IG3TvHZxI3-b_kTqmJPlcVCt9ARd-DNW_xK0Q" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10">{children}</main>

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
                <div className={twMerge('p-1 rounded-lg transition-colors', item.active && 'bg-primary/10')}>
                  <span className={twMerge('material-symbols-outlined text-2xl transition-all', item.active ? 'font-variation-fill translate-y-[-2px]' : 'group-hover:translate-y-[-1px]')}>
                    {item.icon}
                  </span>
                </div>
                <span className={twMerge('text-[9px] tracking-wider uppercase', item.active ? 'font-black' : 'font-bold opacity-60')}>
                  {item.label}
                </span>
                {item.active && <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,1)]"></span>}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default InstructorLayout;