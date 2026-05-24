export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export const events = [
  { id: 1, date: '2026-04-14', type: 'assignment', title: 'API Integration Lab', course: 'Advanced React', color: 'bg-primary', urgent: true },
  { id: 2, date: '2026-04-15', type: 'quiz', title: 'Midterm Quiz #2', course: 'Data Structures', color: 'bg-violet-500', urgent: true },
  { id: 3, date: '2026-04-16', type: 'lecture', title: 'State Management Live', course: 'Advanced React', color: 'bg-cyan-500', urgent: false },
  { id: 4, date: '2026-04-18', type: 'assignment', title: 'Linear Regression Report', course: 'Machine Learning', color: 'bg-orange-500', urgent: false },
  { id: 5, date: '2026-04-20', type: 'exam', title: 'Midterm Exam', course: 'Advanced React', color: 'bg-rose-500', urgent: false },
  { id: 6, date: '2026-04-22', type: 'lecture', title: 'Trees & Graphs — Part 2', course: 'Data Structures', color: 'bg-emerald-500', urgent: false },
  { id: 7, date: '2026-04-25', type: 'assignment', title: 'Final Project Submission', course: 'Data Structures', color: 'bg-violet-500', urgent: false },
  { id: 8, date: '2026-04-28', type: 'exam', title: 'Final Exam', course: 'Machine Learning', color: 'bg-rose-500', urgent: false },
  { id: 9, date: '2026-04-10', type: 'assignment', title: 'Component Design Lab', course: 'Advanced React', color: 'bg-primary', urgent: false },
  { id: 10, date: '2026-04-08', type: 'lecture', title: 'Intro to ML', course: 'Machine Learning', color: 'bg-orange-500', urgent: false },
];

export const typeIcons = {
  assignment: 'assignment',
  quiz: 'quiz',
  lecture: 'live_tv',
  exam: 'description',
};

export const typeColors = {
  assignment: 'bg-primary/10 text-primary border-primary/20',
  quiz: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  lecture: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  exam: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};
