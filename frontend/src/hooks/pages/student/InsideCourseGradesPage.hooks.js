import { useParams } from 'react-router-dom';
import { courseGradeData } from '../../../data/pages/student/InsideCourseGradesPage.data';

export const useInsideCourseGrades = () => {
  const { id } = useParams();
  const course = courseGradeData[id] || courseGradeData[1];

  const getGradeColor = (pct) => {
    if (pct >= 90) return { text: 'text-emerald-500', bar: 'from-emerald-400 to-emerald-500' };
    if (pct >= 75) return { text: 'text-primary', bar: 'from-primary to-accent' };
    if (pct >= 60) return { text: 'text-amber-500', bar: 'from-amber-400 to-amber-500' };
    return { text: 'text-rose-500', bar: 'from-rose-400 to-rose-500' };
  };

  const cfg = getGradeColor(course.overallGrade);
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (course.overallGrade / 100) * circumference;

  return {
    id,
    course,
    cfg,
    circumference,
    dashOffset,
    getGradeColor
  };
};
