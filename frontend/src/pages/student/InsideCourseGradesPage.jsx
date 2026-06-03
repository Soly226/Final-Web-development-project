import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';

const courseGradeData = {
  1: {
    courseName: 'Advanced React 2024',
    color: 'from-primary to-accent',
    icon: 'code',
    instructor: 'Prof. Michael Chen',
    overallGrade: 88,
    letterGrade: 'B+',
    gpa: 3.3,
    breakdown: [
      { category: 'Labs', weight: '35%', earned: 32, total: 35, items: 3 },
      { category: 'Quizzes', weight: '15%', earned: 12, total: 15, items: 2 },
      { category: 'Assignments', weight: '20%', earned: 18, total: 20, items: 1 },
      { category: 'Midterm Exam', weight: '30%', earned: 23, total: 30, items: 1 },
    ],
    assignments: [
      { title: 'JSX & Components Lab', type: 'Lab', grade: 95, max: 100, weight: '10%', date: 'Jan 20' },
      { title: 'State Management Quiz', type: 'Quiz', grade: 82, max: 100, weight: '5%', date: 'Feb 5' },
      { title: 'Router Integration', type: 'Assignment', grade: 90, max: 100, weight: '15%', date: 'Feb 20' },
      { title: 'Component Design Lab', type: 'Lab', grade: 92, max: 100, weight: '10%', date: 'Mar 10' },
      { title: 'Midterm Exam', type: 'Exam', grade: 78, max: 100, weight: '30%', date: 'Mar 15' },
    ],
    whatIfEnabled: true,
  },
  2: {
    courseName: 'Data Structures & Algorithms',
    color: 'from-emerald-500 to-cyan-500',
    icon: 'account_tree',
    instructor: 'Dr. Layla Hassan',
    overallGrade: 75,
    letterGrade: 'C+',
    gpa: 2.3,
    breakdown: [
      { category: 'Assignments', weight: '40%', earned: 30, total: 40, items: 2 },
      { category: 'Quizzes', weight: '20%', earned: 13, total: 20, items: 1 },
      { category: 'Labs', weight: '40%', earned: 31, total: 40, items: 2 },
    ],
    assignments: [
      { title: 'Arrays & Strings', type: 'Assignment', grade: 88, max: 100, weight: '10%', date: 'Feb 1' },
      { title: 'Linked List Implementation', type: 'Lab', grade: 78, max: 100, weight: '15%', date: 'Feb 18' },
      { title: 'Sorting Algorithms Quiz', type: 'Quiz', grade: 65, max: 100, weight: '10%', date: 'Mar 1' },
      { title: 'Trees & Graphs', type: 'Assignment', grade: 72, max: 100, weight: '15%', date: 'Mar 25' },
    ],
  },
  3: {
    courseName: 'Machine Learning Fundamentals',
    color: 'from-orange-500 to-rose-500',
    icon: 'psychology',
    instructor: 'Prof. Ahmed Sayed',
    overallGrade: 85,
    letterGrade: 'B',
    gpa: 3.0,
    breakdown: [
      { category: 'Quizzes', weight: '20%', earned: 17, total: 20, items: 1 },
    ],
    assignments: [
      { title: 'Intro Quiz', type: 'Quiz', grade: 85, max: 100, weight: '5%', date: 'Apr 5' },
    ],
  },
};

const getGradeColor = (pct) => {
  if (pct >= 90) return { text: 'text-emerald-500', bar: 'from-emerald-400 to-emerald-500' };
  if (pct >= 75) return { text: 'text-primary', bar: 'from-primary to-accent' };
  if (pct >= 60) return { text: 'text-amber-500', bar: 'from-amber-400 to-amber-500' };
  return { text: 'text-rose-500', bar: 'from-rose-400 to-rose-500' };
};

const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Project: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const InsideCourseGradesPage = () => {
  const { id } = useParams();
  const course = courseGradeData[id] || courseGradeData[1];
  const cfg = getGradeColor(course.overallGrade);

  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (course.overallGrade / 100) * circumference;

  return (
    <StudentLayout title={course.courseName}>
      <div className="p-5 flex flex-col gap-5 max-w-3xl mx-auto">

        {/* Back */}
        <Link to="/student/courses" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors w-fit group">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className={twMerge('relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl', course.color)}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{course.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Grades</p>
              <h1 className="text-xl font-extrabold tracking-tight">{course.courseName}</h1>
              <p className="text-white/70 text-xs mt-0.5">{course.instructor}</p>
            </div>
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
          <Link to={`/student/course/${id}/assignments`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-base">assignment</span>Assignments
          </Link>
          <Link to={`/student/course/${id}/grades`} className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary border-b-2 border-primary">
            <span className="material-symbols-outlined text-base">grade</span>Grades
          </Link>
        </div>

        {/* Overall Grade Card */}
        <Card className="flex items-center gap-6 p-6" hover={false}>
          {/* SVG Ring */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="38" fill="none" stroke="currentColor" strokeWidth="7" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="44" cy="44" r="38" fill="none" strokeWidth="7"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                strokeLinecap="round" className={twMerge('transition-all duration-1000', cfg.text)} stroke="currentColor"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={twMerge('text-xl font-extrabold', cfg.text)}>{course.overallGrade}</span>
              <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Current Standing</p>
            <div className="flex items-end gap-2">
              <span className={twMerge('text-5xl font-extrabold', cfg.text)}>{course.letterGrade}</span>
              <span className="text-slate-400 text-sm mb-1">letter grade</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-slate-600 dark:text-slate-300 font-semibold">GPA Points:</span>
              <span className={twMerge('text-lg font-extrabold', cfg.text)}>{course.gpa.toFixed(1)}</span>
              <span className="text-slate-400 text-xs">/ 4.0</span>
            </div>
          </div>
        </Card>

        {/* Grade Breakdown by Category */}
        <Card className="p-5" hover={false}>
          <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>pie_chart</span>
            Grade Breakdown
          </h2>
          <div className="flex flex-col gap-4">
            {course.breakdown.map((b, i) => {
              const pct = Math.round((b.earned / b.total) * 100);
              const bCfg = getGradeColor(pct);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{b.category}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{b.weight} · {b.items} item{b.items > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={twMerge('text-sm font-extrabold', bCfg.text)}>{b.earned}/{b.total}</span>
                      <span className="text-[11px] text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={twMerge('h-full rounded-full bg-gradient-to-r transition-all duration-700', bCfg.bar)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Detailed Assignment Grades */}
        <Card className="p-5" hover={false}>
          <h2 className="text-slate-900 dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
            All Graded Work
          </h2>
          <div className="flex flex-col">
            {course.assignments.map((a, i) => {
              const pct = Math.round((a.grade / a.max) * 100);
              const aCfg = getGradeColor(pct);
              return (
                <div key={i} className={twMerge('flex items-center gap-4 py-3.5 border-b border-white/10 dark:border-white/5 last:border-0', i % 2 === 1 ? 'bg-slate-50/30 dark:bg-slate-800/20 -mx-3 px-3 rounded-xl' : '')}>
                  <span className={twMerge('text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0', typeConfig[a.type])}>{a.type}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{a.title}</p>
                    <p className="text-[11px] text-slate-500">{a.date} · Weight: {a.weight}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={twMerge('text-base font-extrabold', aCfg.text)}>{a.grade}</p>
                    <p className="text-[10px] text-slate-400">/ {a.max}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Grade Policy Note */}
        <div className="glass rounded-2xl border border-primary/20 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Grades are calculated based on weighted averages. Contact <span className="font-bold text-primary">{course.instructor}</span> for grade disputes within 7 days of release.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default InsideCourseGradesPage;
