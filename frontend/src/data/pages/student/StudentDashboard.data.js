export const enrolledCourses = [
  { id: 1, title: 'Advanced React 2024', instructor: 'Prof. Michael Chen', progress: 72, color: 'from-primary to-accent', icon: 'code', tag: 'In Progress' },
  { id: 2, title: 'Data Structures & Algorithms', instructor: 'Dr. Layla Hassan', progress: 45, color: 'from-emerald-500 to-cyan-500', icon: 'account_tree', tag: 'In Progress' },
  { id: 3, title: 'Machine Learning Fundamentals', instructor: 'Prof. Ahmed Sayed', progress: 10, color: 'from-orange-500 to-rose-500', icon: 'psychology', tag: 'New' },
];

export const upcomingTasks = [
  { id: 1, type: 'assignment', title: 'API Integration Lab', course: 'Advanced React 2024', due: 'Today, 11:59 PM', urgent: true, icon: 'assignment' },
  { id: 2, type: 'quiz', title: 'Midterm Quiz #2', course: 'Data Structures', due: 'Tomorrow, 9:00 AM', urgent: true, icon: 'quiz' },
  { id: 3, type: 'lecture', title: 'State Management — Live Lecture', course: 'Advanced React 2024', due: 'Wed, 2:00 PM', urgent: false, icon: 'live_tv' },
  { id: 4, type: 'assignment', title: 'Linear Regression Report', course: 'Machine Learning', due: 'Fri, 11:59 PM', urgent: false, icon: 'assignment' },
];

export const recentGrades = [
  { course: 'Advanced React', assignment: 'Component Design Lab', grade: 92, max: 100, icon: 'code' },
  { course: 'Data Structures', assignment: 'Linked List Implementation', grade: 78, max: 100, icon: 'account_tree' },
  { course: 'Machine Learning', assignment: 'Intro Quiz', grade: 85, max: 100, icon: 'psychology' },
];

export const quickStats = [
  { icon: 'menu_book', label: 'Enrolled', value: '3', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: 'assignment_turned_in', label: 'Submitted', value: '18', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: 'pending_actions', label: 'Pending', value: '4', color: 'text-amber-500', bg: 'bg-amber-500/10' },
];
