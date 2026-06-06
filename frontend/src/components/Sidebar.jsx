import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ links = [] }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-full md:w-64 md:min-h-[calc(100vh-72px)] border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const isActive =
            location.pathname === link.to ||
            (link.matchPrefix && location.pathname.startsWith(link.matchPrefix));

          return (
            <Link
              key={link.label}
              to={link.to}
              className={twMerge(
                'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary'
              )}
            >
              {link.icon && (
                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110">
                  {link.icon}
                </span>
              )}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">{link.label}</span>
            </Link>
          );
        })}
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-450 hover:bg-rose-500/10 transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110">
              logout
            </span>
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
