import React, { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import Card from '../../components/ui/Card';
import { twMerge } from 'tailwind-merge';

const gradeData = [
  {
    courseId: 1,
    courseName: 'Advanced React 2024',
    color: 'from-primary to-accent',
    icon: 'code',
    overallGrade: 88,
    letterGrade: 'B+',
    assignments: [
      { title: 'JSX & Components Lab', type: 'Lab', grade: 95, max: 100, weight: '10%', date: 'Jan 20', feedback: 'Excellent work! Clean code and good component structure.' },
      { title: 'State Management Quiz', type: 'Quiz', grade: 82, max: 100, weight: '5%', date: 'Feb 5', feedback: 'Good understanding of useState. Review useEffect.' },
      { title: 'Router Integration', type: 'Assignment', grade: 90, max: 100, weight: '15%', date: 'Feb 20', feedback: 'Well implemented routes. Minor issues with protected routes.' },
      { title: 'Component Design Lab', type: 'Lab', grade: 92, max: 100, weight: '10%', date: 'Mar 10', feedback: 'Great reusable components. Consider extracting more logic.' },
      { title: 'Midterm Exam', type: 'Exam', grade: 78, max: 100, weight: '30%', date: 'Mar 15', feedback: 'Solid performance. Review Redux concepts.' },
    ],
  },
  {
    courseId: 2,
    courseName: 'Data Structures & Algorithms',
    color: 'from-emerald-500 to-cyan-500',
    icon: 'account_tree',
    overallGrade: 75,
    letterGrade: 'C+',
    assignments: [
      { title: 'Arrays & Strings', type: 'Assignment', grade: 88, max: 100, weight: '10%', date: 'Feb 1', feedback: 'Good solutions. Optimize time complexity where possible.' },
      { title: 'Linked List Implementation', type: 'Lab', grade: 78, max: 100, weight: '15%', date: 'Feb 18', feedback: 'Implementation correct. Review edge cases.' },
      { title: 'Sorting Algorithms Quiz', type: 'Quiz', grade: 65, max: 100, weight: '10%', date: 'Mar 1', feedback: 'Study Quick Sort and Merge Sort more carefully.' },
      { title: 'Trees & Graphs', type: 'Assignment', grade: 72, max: 100, weight: '15%', date: 'Mar 25', feedback: 'BFS/DFS logic is mostly correct. Fix the cycle detection.' },
    ],
  },
  {
    courseId: 3,
    courseName: 'Machine Learning Fundamentals',
    color: 'from-orange-500 to-rose-500',
    icon: 'psychology',
    overallGrade: 85,
    letterGrade: 'B',
    assignments: [
      { title: 'Intro Quiz', type: 'Quiz', grade: 85, max: 100, weight: '5%', date: 'Apr 5', feedback: 'Strong understanding of ML fundamentals.' },
    ],
  },
];

const getGradeColor = (pct) => {
  if (pct >= 90) return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500' };
  if (pct >= 75) return { text: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary' };
  if (pct >= 60) return { text: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500' };
  return { text: 'text-rose-500', bg: 'bg-rose-500/10', ring: 'ring-rose-500' };
};

const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const GpaRing = ({ grade }) => {
  const cfg = getGradeColor(grade);
  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference - (grade / 100) * circumference;
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-slate-700" />
        <circle
          cx="36" cy="36" r="30" fill="none" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={twMerge('transition-all duration-1000', cfg.text)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={twMerge('text-lg font-extrabold', cfg.text)}>{grade}</span>
        <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
      </div>
    </div>
  );
};

const MyGradesPage = () => {
  const [expanded, setExpanded] = useState(1);

  const gpa = (gradeData.reduce((sum, c) => sum + c.overallGrade, 0) / gradeData.length / 25).toFixed(2);

  return (
    <StudentLayout title="My Grades">
      <div className="p-5 flex flex-col gap-5 max-w-3xl mx-auto">

        {/* GPA Summary Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-6 text-white shadow-xl shadow-primary/20">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Academic Performance</p>
              <h2 className="text-3xl font-extrabold tracking-tight">Semester GPA</h2>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-extrabold">{gpa}</span>
                <span className="text-xl text-white/70 mb-1">/ 4.0</span>
              </div>
              <p className="text-white/70 text-sm mt-2">Based on {gradeData.length} active courses</p>
            </div>
            <div className="flex flex-col gap-2 text-right">
              {gradeData.map((c) => (
                <div key={c.courseId} className="flex items-center gap-2 justify-end">
                  <span className="text-white/60 text-xs truncate max-w-28">{c.courseName.split(' ')[0]}</span>
                  <span className="text-white font-black text-sm bg-white/15 rounded-lg px-2 py-0.5">{c.letterGrade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grade Breakdown */}
        <div className="flex flex-col gap-4">
          {gradeData.map((course) => {
            const cfg = getGradeColor(course.overallGrade);
            const isExpanded = expanded === course.courseId;
            return (
              <Card key={course.courseId} className="flex flex-col gap-0 overflow-hidden p-0" hover={false}>
                {/* Course Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : course.courseId)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                >
                  <div className={twMerge('w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', course.color)}>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{course.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-bold text-sm">{course.courseName}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{course.assignments.length} graded items</p>
                  </div>
                  <GpaRing grade={course.overallGrade} />
                  <div className="text-center flex-shrink-0">
                    <p className={twMerge('text-2xl font-extrabold', cfg.text)}>{course.letterGrade}</p>
                  </div>
                  <span className={twMerge('material-symbols-outlined text-slate-400 transition-transform', isExpanded && 'rotate-180')}>
                    expand_more
                  </span>
                </button>

                {/* Expanded Assignment List */}
                {isExpanded && (
                  <div className="border-t border-white/10 dark:border-white/5">
                    {course.assignments.map((a, i) => {
                      const pct = (a.grade / a.max) * 100;
                      const aCfg = getGradeColor(pct);
                      return (
                        <div key={i} className={twMerge('flex items-start gap-4 p-4 border-b border-white/5 last:border-0', i % 2 === 0 ? '' : 'bg-slate-50/5')}>
                          <div className={twMerge('w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black mt-0.5', typeConfig[a.type] || 'bg-primary/10 text-primary')}>
                            {a.type.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</p>
                              <span className={twMerge('text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full flex-shrink-0', typeConfig[a.type])}>{a.type}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{a.date} · Weight: {a.weight}</p>
                            {a.feedback && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 italic leading-relaxed border-l-2 border-primary/30 pl-2">
                                "{a.feedback}"
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={twMerge('text-lg font-extrabold', aCfg.text)}>{a.grade}</p>
                            <p className="text-[10px] text-slate-400">/ {a.max}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
};

export default MyGradesPage;
