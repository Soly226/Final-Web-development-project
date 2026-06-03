import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';

const allCourses = [
  {
    id: 1, title: 'Advanced React 2024', instructor: 'Prof. Michael Chen', progress: 72,
    color: 'from-primary to-accent', icon: 'code', tag: 'In Progress',
    category: 'Programming', enrolled: 'Jan 15, 2026', nextLesson: 'State Management — Part 3',
    totalLessons: 48, completedLessons: 35,
  },
  {
    id: 2, title: 'Data Structures & Algorithms', instructor: 'Dr. Layla Hassan', progress: 45,
    color: 'from-emerald-500 to-cyan-500', icon: 'account_tree', tag: 'In Progress',
    category: 'Computer Science', enrolled: 'Feb 1, 2026', nextLesson: 'Binary Search Trees',
    totalLessons: 60, completedLessons: 27,
  },
  {
    id: 3, title: 'Machine Learning Fundamentals', instructor: 'Prof. Ahmed Sayed', progress: 10,
    color: 'from-orange-500 to-rose-500', icon: 'psychology', tag: 'New',
    category: 'AI & ML', enrolled: 'Apr 1, 2026', nextLesson: 'Linear Regression Basics',
    totalLessons: 55, completedLessons: 5,
  },
  {
    id: 4, title: 'Database Systems Design', instructor: 'Dr. Omar Hassan', progress: 100,
    color: 'from-violet-500 to-purple-500', icon: 'storage', tag: 'Completed',
    category: 'Database', enrolled: 'Sep 1, 2025', nextLesson: null,
    totalLessons: 40, completedLessons: 40,
  },
  {
    id: 5, title: 'UI/UX Design Principles', instructor: 'Prof. Sara Nour', progress: 100,
    color: 'from-pink-500 to-rose-400', icon: 'design_services', tag: 'Completed',
    category: 'Design', enrolled: 'Sep 1, 2025', nextLesson: null,
    totalLessons: 30, completedLessons: 30,
  },
];

const FILTERS = ['All', 'In Progress', 'Completed', 'New'];
const CATEGORIES = ['All Categories', 'Programming', 'Computer Science', 'AI & ML', 'Database', 'Design'];

const tagConfig = {
  'In Progress': 'bg-primary/10 text-primary',
  'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'New': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const MyCoursesPage = () => {
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All Categories');
  const [view, setView] = useState('grid');

  const filtered = allCourses.filter((c) => {
    const tagMatch = filter === 'All' || c.tag === filter;
    const catMatch = category === 'All Categories' || c.category === category;
    return tagMatch && catMatch;
  });

  return (
    <StudentLayout title="My Courses">
      <div className="p-5 flex flex-col gap-5 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">My Courses</h2>
            <p className="text-slate-500 text-sm mt-0.5">{allCourses.length} courses enrolled</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('grid')}
              className={twMerge('w-9 h-9 flex items-center justify-center rounded-xl transition-all', view === 'grid' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-primary/5')}
            >
              <span className="material-symbols-outlined text-xl">grid_view</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={twMerge('w-9 h-9 flex items-center justify-center rounded-xl transition-all', view === 'list' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-primary/5')}
            >
              <span className="material-symbols-outlined text-xl">view_list</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={twMerge(
                  'flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all',
                  filter === f
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20'
                    : 'glass text-slate-600 dark:text-slate-400 hover:text-primary border border-white/20 dark:border-white/10'
                )}
              >
                {f}
                <span className="ml-1.5 opacity-60">
                  ({f === 'All' ? allCourses.length : allCourses.filter(c => c.tag === f).length})
                </span>
              </button>
            ))}
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:ml-auto"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Course Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">search_off</span>
            <p className="text-slate-500 font-semibold">No courses match your filters.</p>
            <button onClick={() => { setFilter('All'); setCategory('All Categories'); }} className="text-sm font-bold text-primary hover:text-accent transition-colors">Clear Filters</button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <Link key={course.id} to={`/student/course/${course.id}/lectures`} className="group block">
                <Card className="flex flex-col gap-4 h-full p-5" hover={false}>
                  {/* Course Header */}
                  <div className="flex items-start gap-3">
                    <div className={twMerge('w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform', course.color)}>
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{course.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors">{course.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 truncate">{course.instructor}</p>
                    </div>
                  </div>

                  {/* Tag & Category */}
                  <div className="flex items-center gap-2">
                    <span className={twMerge('text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full', tagConfig[course.tag] || 'bg-primary/10 text-primary')}>{course.tag}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{course.category}</span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-slate-500 font-semibold">{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span className="font-black text-primary">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={twMerge('h-full rounded-full bg-gradient-to-r', course.color)} style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>

                  {/* Next Lesson */}
                  {course.nextLesson && (
                    <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-3 py-2">
                      <span className="material-symbols-outlined text-primary text-base">play_circle</span>
                      <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">Next: {course.nextLesson}</p>
                    </div>
                  )}
                  {course.tag === 'Completed' && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 rounded-xl px-3 py-2">
                      <span className="material-symbols-outlined text-emerald-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Certificate Earned</p>
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-3">
            {filtered.map((course) => (
              <Link key={course.id} to={`/student/course/${course.id}/lectures`} className="group block">
                <div className="glass rounded-2xl border border-white/20 dark:border-white/10 p-4 flex items-center gap-4 hover:border-primary/30 transition-all">
                  <div className={twMerge('w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform', course.color)}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{course.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-900 dark:text-white font-bold text-sm group-hover:text-primary transition-colors">{course.title}</p>
                      <span className={twMerge('text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full', tagConfig[course.tag])}>{course.tag}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{course.instructor} · {course.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-40">
                        <div className={twMerge('h-full rounded-full bg-gradient-to-r', course.color)} style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-black text-primary">{course.progress}%</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default MyCoursesPage;
