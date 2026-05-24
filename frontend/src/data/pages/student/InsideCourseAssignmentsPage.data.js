export const courseAssignments = {
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

export const statusConfig = {
  graded: { label: 'Graded', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: 'grade' },
  pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: 'schedule' },
  submitted: { label: 'Submitted', bg: 'bg-primary/10', text: 'text-primary', icon: 'check_circle' },
  upcoming: { label: 'Upcoming', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500', icon: 'upcoming' },
};

export const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Project: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export const FILTERS = ['All', 'Graded', 'Pending', 'Upcoming'];
