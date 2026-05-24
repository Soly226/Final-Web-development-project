export const gradeData = [
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

export const typeConfig = {
  Lab: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Quiz: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Assignment: 'bg-primary/10 text-primary',
  Exam: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};
