import { useAuth } from '../../../context/AuthContext';

export const activeCourses = [
  { id: 'c1', title: 'Advanced React 2024', students: 124, rating: 4.8, status: 'Active', color: 'from-amber-500 to-orange-500', icon: 'code' },
  { id: 'c2', title: 'Data Structures & Algorithms', students: 89, rating: 4.6, status: 'Active', color: 'from-emerald-500 to-cyan-500', icon: 'account_tree' },
];

export const recentSubmissions = [
  { id: 1, student: 'Alice Johnson', course: 'Advanced React 2024', assignment: 'API Integration Lab', time: '10 mins ago' },
  { id: 2, student: 'Bob Smith', course: 'Data Structures', assignment: 'Linked List Implementation', time: '1 hour ago' },
  { id: 3, student: 'Charlie Brown', course: 'Advanced React 2024', assignment: 'Component Design', time: '2 hours ago' },
];

export const useInstructorDashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return {
    user,
    greeting
  };
};
