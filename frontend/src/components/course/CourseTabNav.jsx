import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CourseTabNav({ courseId }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { label: 'Stream', path: `/student/course/${courseId}/stream`, icon: 'dynamic_feed' },
    { label: 'Lectures', path: `/student/course/${courseId}/lectures`, icon: 'play_lesson' },
    { label: 'Assignments', path: `/student/course/${courseId}/assignments`, icon: 'assignment' },
    { label: 'Participants', path: `/student/course/${courseId}/students`, icon: 'groups' },
    { label: 'Grades', path: `/student/course/${courseId}/grades`, icon: 'school' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-1.5 flex gap-1 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <Link
            key={tab.label}
            to={tab.path}
            className={`flex-1 min-w-[90px] flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-[11px] sm:text-xs font-black transition-all duration-200 uppercase tracking-wider ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <span className={`material-symbols-outlined text-base ${isActive ? 'font-variation-fill' : ''}`}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
