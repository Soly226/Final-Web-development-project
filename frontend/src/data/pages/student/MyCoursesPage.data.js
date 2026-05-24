export const allCourses = [
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

export const FILTERS = ['All', 'In Progress', 'Completed', 'New'];
export const CATEGORIES = ['All Categories', 'Programming', 'Computer Science', 'AI & ML', 'Database', 'Design'];

export const tagConfig = {
  'In Progress': 'tag-in-progress',
  'Completed': 'tag-completed',
  'New': 'tag-new',
};
