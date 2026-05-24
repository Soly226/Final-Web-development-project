export const courseGradeData = {
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

export const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Project: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};
