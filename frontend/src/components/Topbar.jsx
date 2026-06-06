import React from 'react';

const Topbar = ({ title = 'EduCore LMS' }) => {
  return (
    <header className="h-[72px] px-4 md:px-6 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">school</span>
        <h1 className="text-sm md:text-base font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>
      <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">notifications</span>
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
      </button>
    </header>
  );
};

export default Topbar;
