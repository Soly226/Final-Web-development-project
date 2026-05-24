import { useAuth } from '../../../context/AuthContext';

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const overallGPA = 3.6;

  const getGradeColor = (pct) => {
    if (pct >= 90) return 'text-emerald-500';
    if (pct >= 75) return 'text-primary';
    if (pct >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return {
    user,
    greeting,
    overallGPA,
    getGradeColor
  };
};
