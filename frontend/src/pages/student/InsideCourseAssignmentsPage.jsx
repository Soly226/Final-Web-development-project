import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { twMerge } from 'tailwind-merge';

const courseAssignments = {
  1: {
    courseName: 'Advanced React 2024',
    color: 'from-primary to-accent',
    icon: 'code',
    assignments: [
      { id: 1, title: 'JSX & Components Lab', type: 'Lab', due: 'Jan 20, 2026', points: 100, status: 'graded', grade: 95 },
      { id: 2, title: 'State Management Quiz', type: 'Quiz', due: 'Feb 5, 2026', points: 50, status: 'graded', grade: 82 },
      { id: 3, title: 'Router Integration', type: 'Assignment', due: 'Feb 20, 2026', points: 100, status: 'graded', grade: 90 },
      { id: 4, title: 'Component Design Lab', type: 'Lab', due: 'Mar 10, 2026', points: 100, status: 'graded', grade: 92 },
      { id: 5, title: 'Midterm Exam', type: 'Exam', due: 'Mar 15, 2026', points: 100, status: 'graded', grade: 78 },
      { id: 1, title: 'API Integration Lab', type: 'Lab', due: 'Apr 14, 2026', points: 100, status: 'pending', grade: null },
      { id: 6, title: 'Final Project', type: 'Project', due: 'May 10, 2026', points: 200, status: 'upcoming', grade: null },
    ],
  },
  2: {
    courseName: 'Data Structures & Algorithms',
    color: 'from-emerald-500 to-cyan-500',
    icon: 'account_tree',
    assignments: [
      { id: 10, title: 'Arrays & Strings', type: 'Assignment', due: 'Feb 1, 2026', points: 100, status: 'graded', grade: 88 },
      { id: 11, title: 'Linked List Implementation', type: 'Lab', due: 'Feb 18, 2026', points: 100, status: 'graded', grade: 78 },
      { id: 12, title: 'Sorting Algorithms Quiz', type: 'Quiz', due: 'Mar 1, 2026', points: 50, status: 'graded', grade: 65 },
      { id: 13, title: 'Trees & Graphs', type: 'Assignment', due: 'Mar 25, 2026', points: 100, status: 'graded', grade: 72 },
      { id: 2, title: 'Midterm Quiz #2', type: 'Quiz', due: 'Apr 15, 2026', points: 50, status: 'pending', grade: null },
      { id: 14, title: 'Final Project', type: 'Project', due: 'May 5, 2026', points: 200, status: 'upcoming', grade: null },
    ],
  },
  3: {
    courseName: 'Machine Learning Fundamentals',
    color: 'from-orange-500 to-rose-500',
    icon: 'psychology',
    assignments: [
      { id: 20, title: 'Intro Quiz', type: 'Quiz', due: 'Apr 5, 2026', points: 50, status: 'graded', grade: 85 },
      { id: 21, title: 'Linear Regression Report', type: 'Assignment', due: 'Apr 18, 2026', points: 100, status: 'pending', grade: null },
      { id: 22, title: 'Classification Project', type: 'Project', due: 'May 15, 2026', points: 200, status: 'upcoming', grade: null },
    ],
  },
};

const statusConfig = {
  graded: { label: 'Graded', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: 'grade' },
  pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: 'schedule' },
  submitted: { label: 'Submitted', bg: 'bg-primary/10', text: 'text-primary', icon: 'check_circle' },
  upcoming: { label: 'Upcoming', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500', icon: 'upcoming' },
};

const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Project: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const getGradeColor = (pct) => {
  if (!pct && pct !== 0) return 'text-slate-400';
  if (pct >= 90) return 'text-emerald-500';
  if (pct >= 75) return 'text-primary';
  if (pct >= 60) return 'text-amber-500';
  return 'text-rose-500';
};

const FILTERS = ['All', 'Graded', 'Pending', 'Upcoming'];

const InsideCourseAssignmentsPage = () => {
  const { id } = useParams();
  const [filter, setFilter] = useState('All');
  const course = courseAssignments[id] || courseAssignments[1];

  const filtered = course.assignments.filter(a => filter === 'All' || a.status === filter.toLowerCase());

  const graded = course.assignments.filter(a => a.status === 'graded');
  const avgGrade = graded.length ? Math.round(graded.reduce((s, a) => s + (a.grade / a.points) * 100, 0) / graded.length) : null;

  return (
    <StudentLayout title={course.courseName}>
      <div className="p-5 flex flex-col gap-5 max-w-3xl mx-auto">

        {/* Back nav */}
        <Link to="/student/courses" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors w-fit group">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className={twMerge('relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl shadow-primary/20', course.color)}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{course.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Assignments</p>
              <h1 className="text-xl font-extrabold tracking-tight">{course.courseName}</h1>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Total', value: course.assignments.length, icon: 'assignment' },
              { label: 'Graded', value: graded.length, icon: 'grade' },
              { label: 'Average', value: avgGrade ? `${avgGrade}%` : '—', icon: 'analytics' },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/50 overflow-x-auto scrollbar-hide">
          <Link to={`/student/course/${id}/lectures`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">play_circle</span>Lectures
          </Link>
          <Link to={`/student/course/${id}/stream`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">forum</span>Stream
          </Link>
          <Link to={`/student/course/${id}/assignments`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary border-b-2 border-primary">
            <span className="material-symbols-outlined text-base">assignment</span>Assignments
          </Link>
          <Link to={`/student/course/${id}/grades`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">grade</span>Grades
          </Link>
        </div>

        {/* Filters */}
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
            </button>
          ))}
        </div>

        {/* Assignment List */}
        <div className="flex flex-col gap-3">
          {filtered.map((a, i) => {
            const sCfg = statusConfig[a.status] || statusConfig.upcoming;
            const pct = a.grade !== null ? Math.round((a.grade / a.points) * 100) : null;
            return (
              <Link key={i} to={`/student/assignments/${a.id}`} className="group block">
                <div className="glass flex items-center gap-4 p-4 rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all">
                  <div className={twMerge('w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center', sCfg.bg)}>
                    <span className={twMerge('material-symbols-outlined text-xl', sCfg.text)} style={{ fontVariationSettings: "'FILL' 1" }}>{sCfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{a.title}</p>
                      <span className={twMerge('text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full flex-shrink-0', typeConfig[a.type])}>{a.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Due: {a.due} · {a.points} pts</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {a.status === 'graded' ? (
                      <>
                        <p className={twMerge('text-lg font-extrabold', getGradeColor(pct))}>{a.grade}</p>
                        <p className="text-[10px] text-slate-400">/ {a.points}</p>
                      </>
                    ) : (
                      <span className={twMerge('text-[11px] font-bold px-2 py-1 rounded-lg', sCfg.bg, sCfg.text)}>{sCfg.label}</span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">assignment_turned_in</span>
              <p className="text-slate-500 font-semibold">No {filter.toLowerCase()} assignments found.</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default InsideCourseAssignmentsPage;
